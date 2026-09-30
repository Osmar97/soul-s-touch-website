-- Customer identity, referral programme and digital loyalty.
--
-- Business rules implemented here (do not change without client sign-off):
--   * Only COMPLETED sessions count. Cancelled, no-show, unpaid and future
--     sessions never count towards loyalty or referral qualification.
--   * Referral — the referred customer receives 15% off their first service.
--   * Referral — the referring customer receives 15% off their next service,
--     but only after the referred customer's first service has been completed
--     AND the referring customer already has at least one completed service.
--   * Loyalty — 10 completed services unlock a 30% discount on a service of
--     the customer's choice.
--
-- Deliberately NOT defined here (client to decide later): stacking of
-- discounts, expiry of rewards, transferability, and partial redemption.

CREATE TABLE public.customers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name text,
  email text,
  phone text,
  discovery_source text,
  referred_by uuid REFERENCES public.customers(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX customers_email_key
  ON public.customers (lower(btrim(email)))
  WHERE email IS NOT NULL AND btrim(email) <> '';

CREATE UNIQUE INDEX customers_phone_key
  ON public.customers (regexp_replace(phone, '\D', '', 'g'))
  WHERE phone IS NOT NULL AND regexp_replace(phone, '\D', '', 'g') <> '';

CREATE INDEX customers_referred_by_idx
  ON public.customers (referred_by)
  WHERE referred_by IS NOT NULL;

-- One row per recorded session. `status` is the single source of truth for
-- what counts: only 'completed' is realised, paid and reward-eligible.
CREATE TABLE public.sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id uuid NOT NULL REFERENCES public.customers(id) ON DELETE CASCADE,
  appointment_ref text,
  service_label text,
  session_date date NOT NULL DEFAULT current_date,
  status text NOT NULL DEFAULT 'completed'
    CHECK (status IN ('completed', 'cancelled', 'no_show', 'unpaid')),
  completed_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX sessions_customer_status_idx
  ON public.sessions (customer_id, status);

CREATE INDEX sessions_date_idx
  ON public.sessions (session_date DESC);

CREATE TABLE public.loyalty (
  customer_id uuid PRIMARY KEY REFERENCES public.customers(id) ON DELETE CASCADE,
  completed_sessions integer NOT NULL DEFAULT 0 CHECK (completed_sessions >= 0),
  reward_status text NOT NULL DEFAULT 'locked'
    CHECK (reward_status IN ('locked', 'unlocked', 'used')),
  reward_type text,
  reward_used boolean NOT NULL DEFAULT false,
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Exactly one referral per referred customer.
CREATE TABLE public.referrals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  referrer_customer_id uuid NOT NULL REFERENCES public.customers(id) ON DELETE CASCADE,
  referred_customer_id uuid NOT NULL UNIQUE REFERENCES public.customers(id) ON DELETE CASCADE,
  referral_status text NOT NULL DEFAULT 'pending'
    CHECK (referral_status IN ('pending', 'qualified')),
  first_completed_service_at timestamptz,
  referrer_reward_status text NOT NULL DEFAULT 'pending'
    CHECK (referrer_reward_status IN ('pending', 'available', 'used')),
  referred_reward_status text NOT NULL DEFAULT 'available'
    CHECK (referred_reward_status IN ('available', 'used')),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT referrals_distinct CHECK (referrer_customer_id <> referred_customer_id)
);

CREATE INDEX referrals_referrer_idx ON public.referrals (referrer_customer_id);

-- ---------------------------------------------------------------------------
-- Grants and row level security
-- ---------------------------------------------------------------------------

GRANT SELECT, INSERT, UPDATE, DELETE ON public.customers TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.sessions TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.referrals TO authenticated;
GRANT SELECT, UPDATE ON public.loyalty TO authenticated;

GRANT ALL ON public.customers TO service_role;
GRANT ALL ON public.sessions TO service_role;
GRANT ALL ON public.referrals TO service_role;
GRANT ALL ON public.loyalty TO service_role;

ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.referrals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.loyalty ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage customers"
  ON public.customers FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can manage sessions"
  ON public.sessions FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can manage referrals"
  ON public.referrals FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can manage loyalty"
  ON public.loyalty FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER customers_set_updated_at
  BEFORE UPDATE ON public.customers
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER sessions_set_updated_at
  BEFORE UPDATE ON public.sessions
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER referrals_set_updated_at
  BEFORE UPDATE ON public.referrals
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER loyalty_set_updated_at
  BEFORE UPDATE ON public.loyalty
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ---------------------------------------------------------------------------
-- Session status → completed_at
-- ---------------------------------------------------------------------------

CREATE OR REPLACE FUNCTION public.sessions_apply_status()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NEW.status <> 'completed' THEN
    NEW.completed_at := NULL;
  ELSIF NEW.completed_at IS NULL THEN
    NEW.completed_at := now();
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER sessions_apply_status
  BEFORE INSERT OR UPDATE OF status ON public.sessions
  FOR EACH ROW EXECUTE FUNCTION public.sessions_apply_status();

REVOKE ALL ON FUNCTION public.sessions_apply_status() FROM PUBLIC, anon, authenticated;

-- ---------------------------------------------------------------------------
-- Reward engine: loyalty counter + referral qualification
-- ---------------------------------------------------------------------------

CREATE OR REPLACE FUNCTION public.refresh_loyalty(p_customer_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_count integer;
  v_used boolean;
BEGIN
  IF p_customer_id IS NULL THEN
    RETURN;
  END IF;

  SELECT count(*) INTO v_count
    FROM public.sessions
   WHERE customer_id = p_customer_id
     AND status = 'completed';

  SELECT reward_used INTO v_used
    FROM public.loyalty
   WHERE customer_id = p_customer_id;

  IF NOT FOUND THEN
    INSERT INTO public.loyalty (customer_id, completed_sessions, reward_status)
    VALUES (
      p_customer_id,
      v_count,
      CASE WHEN v_count >= 10 THEN 'unlocked' ELSE 'locked' END
    );
  ELSE
    UPDATE public.loyalty
       SET completed_sessions = v_count,
           reward_status = CASE
             WHEN v_used THEN 'used'
             WHEN v_count >= 10 THEN 'unlocked'
             ELSE 'locked'
           END,
           updated_at = now()
     WHERE customer_id = p_customer_id;
  END IF;
END;
$$;

REVOKE ALL ON FUNCTION public.refresh_loyalty(uuid) FROM PUBLIC, anon, authenticated;

CREATE OR REPLACE FUNCTION public.sync_rewards_on_session()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_customer uuid;
  v_status text;
  v_ref public.referrals%ROWTYPE;
  v_referrer_completed integer;
BEGIN
  IF TG_OP = 'DELETE' THEN
    v_customer := OLD.customer_id;
    v_status := OLD.status;
  ELSE
    v_customer := NEW.customer_id;
    v_status := NEW.status;
  END IF;

  PERFORM public.refresh_loyalty(v_customer);

  IF TG_OP = 'DELETE' OR v_status <> 'completed' THEN
    RETURN NULL;
  END IF;

  -- The referred customer just completed a service → the referral qualifies
  -- and the referrer's reward may become available.
  SELECT * INTO v_ref
    FROM public.referrals
   WHERE referred_customer_id = v_customer
   FOR UPDATE;

  IF FOUND AND v_ref.first_completed_service_at IS NULL THEN
    SELECT count(*) INTO v_referrer_completed
      FROM public.sessions
     WHERE customer_id = v_ref.referrer_customer_id
       AND status = 'completed';

    UPDATE public.referrals
       SET first_completed_service_at = now(),
           referral_status = 'qualified',
           referrer_reward_status = CASE
             WHEN v_referrer_completed > 0 THEN 'available'
             ELSE 'pending'
           END
     WHERE id = v_ref.id;
  END IF;

  -- The referrer just completed a service while a qualified referral is still
  -- waiting on their own completed-service history → release the reward.
  UPDATE public.referrals
     SET referrer_reward_status = 'available'
   WHERE referrer_customer_id = v_customer
     AND referral_status = 'qualified'
     AND referrer_reward_status = 'pending';

  RETURN NULL;
END;
$$;

CREATE TRIGGER sync_rewards_on_session
  AFTER INSERT OR UPDATE OR DELETE ON public.sessions
  FOR EACH ROW EXECUTE FUNCTION public.sync_rewards_on_session();

REVOKE ALL ON FUNCTION public.sync_rewards_on_session() FROM PUBLIC, anon, authenticated;

-- ---------------------------------------------------------------------------
-- Public RPC: capture "How did you hear about us?" + optional friend referral
-- ---------------------------------------------------------------------------

CREATE OR REPLACE FUNCTION public.record_discovery(
  p_source text DEFAULT NULL,
  p_name text DEFAULT NULL,
  p_email text DEFAULT NULL,
  p_phone text DEFAULT NULL,
  p_referrer text DEFAULT NULL
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_customer uuid;
  v_referrer uuid;
  v_email text := NULLIF(btrim(COALESCE(p_email, '')), '');
  v_phone text := NULLIF(btrim(COALESCE(p_phone, '')), '');
  v_name  text := NULLIF(btrim(COALESCE(p_name, '')), '');
  v_source text := NULLIF(btrim(COALESCE(p_source, '')), '');
  v_ref text := NULLIF(btrim(COALESCE(p_referrer, '')), '');
BEGIN
  IF v_email IS NULL AND v_phone IS NULL AND v_name IS NULL THEN
    RETURN NULL;
  END IF;

  SELECT id INTO v_customer
    FROM public.customers
   WHERE (v_email IS NOT NULL AND lower(btrim(email)) = lower(v_email))
      OR (v_phone IS NOT NULL AND regexp_replace(phone, '\D', '', 'g') = regexp_replace(v_phone, '\D', '', 'g'))
   LIMIT 1;

  IF v_customer IS NULL THEN
    INSERT INTO public.customers (full_name, email, phone, discovery_source)
    VALUES (v_name, v_email, v_phone, v_source)
    RETURNING id INTO v_customer;
  ELSE
    UPDATE public.customers
       SET full_name = COALESCE(full_name, v_name),
           email = COALESCE(email, v_email),
           phone = COALESCE(phone, v_phone),
           discovery_source = COALESCE(discovery_source, v_source)
     WHERE id = v_customer;
  END IF;

  IF v_ref IS NOT NULL THEN
    SELECT id INTO v_referrer
      FROM public.customers
     WHERE (v_ref LIKE '%@%' AND lower(btrim(email)) = lower(v_ref))
        OR (v_ref ~ '[0-9]' AND regexp_replace(phone, '\D', '', 'g') = regexp_replace(v_ref, '\D', '', 'g'))
     LIMIT 1;

    IF v_referrer IS NULL THEN
      -- Fallback: an exact (case-insensitive) name match, so a first-time
      -- visitor can still name the friend who referred them.
      SELECT id INTO v_referrer
        FROM public.customers
       WHERE lower(btrim(COALESCE(full_name, ''))) = lower(v_ref)
       LIMIT 1;
    END IF;

    IF v_referrer IS NOT NULL AND v_referrer <> v_customer THEN
      UPDATE public.customers SET referred_by = v_referrer WHERE id = v_customer;

      INSERT INTO public.referrals (referrer_customer_id, referred_customer_id)
      VALUES (v_referrer, v_customer)
      ON CONFLICT (referred_customer_id) DO NOTHING;
    END IF;
  END IF;

  RETURN v_customer;
END;
$$;

REVOKE ALL ON FUNCTION public.record_discovery(text, text, text, text, text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.record_discovery(text, text, text, text, text) TO anon, authenticated;

-- ---------------------------------------------------------------------------
-- Public RPC: customer loyalty lookup (email or phone)
-- ---------------------------------------------------------------------------

CREATE OR REPLACE FUNCTION public.lookup_loyalty(p_identifier text)
RETURNS TABLE (
  display_name text,
  completed_sessions integer,
  reward_status text,
  reward_used boolean
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT COALESCE(c.full_name, '') AS display_name,
         COALESCE(l.completed_sessions, 0) AS completed_sessions,
         COALESCE(l.reward_status, 'locked') AS reward_status,
         COALESCE(l.reward_used, false) AS reward_used
    FROM public.customers c
    LEFT JOIN public.loyalty l ON l.customer_id = c.id
   WHERE NULLIF(btrim(COALESCE(p_identifier, '')), '') IS NOT NULL
     AND (
       lower(btrim(c.email)) = lower(btrim(p_identifier))
       OR regexp_replace(COALESCE(c.phone, ''), '\D', '', 'g')
          = regexp_replace(btrim(p_identifier), '\D', '', 'g')
     )
   LIMIT 1;
$$;

REVOKE ALL ON FUNCTION public.lookup_loyalty(text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.lookup_loyalty(text) TO anon, authenticated;
