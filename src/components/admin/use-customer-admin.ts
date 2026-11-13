import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { CustomerActions, CustomerData, ReferralRewardField, SessionStatus } from "./customer-data";

const KEY = ["admin-customers"];

async function fetchCustomerData(): Promise<CustomerData> {
  const [customers, loyalty, sessions, referrals] = await Promise.all([
    supabase.from("customers").select("*").order("created_at", { ascending: false }),
    supabase.from("loyalty").select("*"),
    supabase.from("sessions").select("*")
      .order("session_date", { ascending: false })
      .order("created_at", { ascending: false }),
    supabase.from("referrals").select("*").order("created_at", { ascending: false }),
  ]);
  for (const result of [customers, loyalty, sessions, referrals]) {
    if (result.error) throw result.error;
  }
  return {
    customers: customers.data ?? [],
    loyalty: loyalty.data ?? [],
    sessions: sessions.data ?? [],
    referrals: referrals.data ?? [],
  };
}

/** Loads all customer records and exposes the admin actions on them. */
export function useCustomerAdmin() {
  const queryClient = useQueryClient();
  const query = useQuery({ queryKey: KEY, queryFn: fetchCustomerData });
  const onSuccess = () => queryClient.invalidateQueries({ queryKey: KEY });
  const run = (fn: () => PromiseLike<{ error: unknown }>) => async () => {
    const { error } = await fn();
    if (error) throw error;
  };

  const mutation = useMutation({
    mutationFn: (job: () => Promise<void>) => job(),
    onSuccess: () => {
      setSaved(true);
      return onSuccess();
    },
    onMutate: () => setSaved(false),
  });
  const [saved, setSaved] = useState(false);
  useEffect(() => {
    if (!saved) return;
    const timer = window.setTimeout(() => setSaved(false), 2500);
    return () => window.clearTimeout(timer);
  }, [saved]);

  const actions: CustomerActions = {
    busy: mutation.isPending,
    addSession: (customerId) =>
      mutation.mutate(run(() => supabase.from("sessions").insert({
        customer_id: customerId,
        session_date: new Date().toISOString().slice(0, 10),
        status: "completed",
      }))),
    setSessionStatus: (id, status: SessionStatus) =>
      mutation.mutate(run(() => supabase.from("sessions").update({ status }).eq("id", id))),
    markLoyaltyUsed: (customerId) =>
      mutation.mutate(run(() => supabase.from("loyalty")
        .update({ reward_used: true, reward_status: "used" }).eq("customer_id", customerId))),
    markReferralUsed: (id, field: ReferralRewardField) =>
      mutation.mutate(run(() => supabase.from("referrals")
        .update(field === "referrer_reward_status"
          ? { referrer_reward_status: "used" }
          : { referred_reward_status: "used" })
        .eq("id", id))),
  };

  return { query, actions, error: mutation.error, saved };
}
