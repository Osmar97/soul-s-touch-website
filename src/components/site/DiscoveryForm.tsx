import { useState } from "react";

import { Button } from "./Button";
import { useT } from "@/i18n";
import { supabase } from "@/integrations/supabase/client";
import { cn } from "@/lib/utils";

type SourceKey = "sourceFriend" | "sourceGoogle" | "sourceInstagram" | "sourceTiktok" | "sourceReturning" | "sourceOther";

const SOURCES: { value: string; labelKey: SourceKey }[] = [
  { value: "friend", labelKey: "sourceFriend" },
  { value: "google", labelKey: "sourceGoogle" },
  { value: "instagram", labelKey: "sourceInstagram" },
  { value: "tiktok", labelKey: "sourceTiktok" },
  { value: "returning", labelKey: "sourceReturning" },
  { value: "other", labelKey: "sourceOther" },
];

const FRIEND = "friend";

type SubmitState = "idle" | "sending" | "done" | "invalid" | "error";

/**
 * "How did you hear about us?" — a quiet capture panel that sits inside the
 * booking section. It records the marketing source (and, when a friend sent
 * the visitor, the referrer) through the `record_discovery` RPC so the
 * referral programme can be attributed without exposing customer data.
 */
export function DiscoveryForm() {
  const t = useT();
  const [source, setSource] = useState("");
  const [name, setName] = useState("");
  const [contact, setContact] = useState("");
  const [referrer, setReferrer] = useState("");
  const [status, setStatus] = useState<SubmitState>("idle");

  const sourceId = "discovery-source";
  const nameId = "discovery-name";
  const contactId = "discovery-contact";
  const referrerId = "discovery-referrer";

  const isFriend = source === FRIEND;

  const fieldClass =
    "mt-3 w-full rounded-none border border-ink-foreground/25 bg-transparent px-4 py-3 text-sm text-ink-foreground outline-none transition-colors placeholder:text-ink-foreground/35 focus:border-gold";

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();

    const trimmed = {
      source: source.trim(),
      name: name.trim(),
      contact: contact.trim(),
      referrer: referrer.trim(),
    };

    if (!trimmed.source || !trimmed.contact || (isFriend && !trimmed.referrer)) {
      setStatus("invalid");
      return;
    }

    setStatus("sending");
    try {
      const looksLikeEmail = trimmed.contact.includes("@");
      const { error } = await supabase.rpc("record_discovery", {
        p_source: trimmed.source,
        p_name: trimmed.name || null,
        p_email: looksLikeEmail ? trimmed.contact : null,
        p_phone: looksLikeEmail ? null : trimmed.contact,
        p_referrer: isFriend ? trimmed.referrer : null,
      });
      if (error) throw error;

      setSource("");
      setName("");
      setContact("");
      setReferrer("");
      setStatus("done");
    } catch {
      setStatus("error");
    }
  }

  if (status === "done") {
    return (
      <div className="mt-14 border border-gold/30 px-6 py-8 sm:px-8">
        <p className="label-luxe text-gold-soft">{t.discovery.title}</p>
        <p
          role="status"
          className="mt-4 text-sm leading-[1.9] text-ink-foreground/70"
        >
          {t.discovery.success}
        </p>
        <div className="mt-6">
          <Button variant="onInk" size="sm" onClick={() => setStatus("idle")}>
            {t.discovery.submit}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="mt-14 border border-ink-foreground/15 px-6 py-8 sm:px-8 sm:py-9">
      <p className="label-luxe text-gold-soft">{t.discovery.title}</p>
      <p className="mt-4 max-w-xl text-sm leading-[1.9] text-ink-foreground/70">
        {t.discovery.intro}
      </p>

      <div className="mt-8 grid gap-7 sm:grid-cols-2">
        <div>
          <label htmlFor={sourceId} className="label-luxe text-ink-foreground/60">
            {t.discovery.sourceLabel}
          </label>
          <select
            id={sourceId}
            className={cn(fieldClass, "cursor-pointer appearance-none")}
            value={source}
            onChange={(event) => {
              setSource(event.target.value);
              if (status !== "sending") setStatus("idle");
            }}
            required
          >
            <option value="">{t.discovery.sourcePlaceholder}</option>
            {SOURCES.map((option) => (
              <option key={option.value} value={option.value}>
                {t.discovery[option.labelKey]}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor={nameId} className="label-luxe text-ink-foreground/60">
            {t.discovery.nameLabel}
          </label>
          <input
            id={nameId}
            type="text"
            autoComplete="name"
            className={fieldClass}
            placeholder={t.discovery.namePlaceholder}
            value={name}
            onChange={(event) => setName(event.target.value)}
            maxLength={80}
          />
        </div>

        <div>
          <label htmlFor={contactId} className="label-luxe text-ink-foreground/60">
            {t.discovery.contactLabel}
          </label>
          <input
            id={contactId}
            type="text"
            autoComplete="email"
            className={fieldClass}
            placeholder={t.discovery.contactPlaceholder}
            value={contact}
            onChange={(event) => {
              setContact(event.target.value);
              if (status !== "sending") setStatus("idle");
            }}
            maxLength={160}
            required
          />
          <span className="mt-2 block text-xs leading-relaxed text-ink-foreground/45">
            {t.discovery.contactHint}
          </span>
        </div>

        {isFriend ? (
          <div>
            <label htmlFor={referrerId} className="label-luxe text-ink-foreground/60">
              {t.discovery.referrerLabel}
            </label>
            <input
              id={referrerId}
              type="text"
              className={fieldClass}
              placeholder={t.discovery.referrerPlaceholder}
              value={referrer}
              onChange={(event) => {
                setReferrer(event.target.value);
                if (status !== "sending") setStatus("idle");
              }}
              maxLength={160}
              required
            />
            <span className="mt-2 block text-xs leading-relaxed text-ink-foreground/45">
              {t.discovery.referrerHint}
            </span>
          </div>
        ) : null}
      </div>

      {status === "invalid" || status === "error" ? (
        <p role="alert" className="mt-6 text-sm text-gold-soft">
          {status === "invalid" ? t.discovery.required : t.discovery.error}
        </p>
      ) : null}

      <div className="mt-8">
        <Button type="submit" variant="onInk" disabled={status === "sending"}>
          {status === "sending" ? t.discovery.sending : t.discovery.submit}
        </Button>
      </div>
    </form>
  );
}

/** Kept for parity with the other form modules that export their dictionary keys. */
export type DiscoveryDictionary = ReturnType<typeof useT>["discovery"];
