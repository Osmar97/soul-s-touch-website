import { useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";

import { Button } from "@/components/site/Button";
import { Wordmark } from "@/components/site/Wordmark";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";

export const Route = createFileRoute("/_authenticated/admin/customers")({
  component: AdminCustomersPage,
  head: () => ({
    meta: [
      { title: "Customers & rewards — Soul's Touch by Dani" },
      { name: "description", content: "Internal customer, loyalty and referral records." },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
});

type Customer = Tables<"customers">;
type Loyalty = Tables<"loyalty">;
type Session = Tables<"sessions">;
type Referral = Tables<"referrals">;
type SessionStatus = Session["status"];

const SESSION_STATUSES: SessionStatus[] = ["completed", "cancelled", "no_show", "unpaid"];

const statusLabels: Record<string, string> = {
  locked: "Locked",
  unlocked: "Reward unlocked",
  used: "Reward used",
  pending: "Pending",
  available: "Available",
};

function identity(customer: Customer) {
  return customer.full_name || customer.email || customer.phone || "Unnamed customer";
}

function AdminCustomersPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");

  const data = useQuery({
    queryKey: ["admin-customers"],
    queryFn: async () => {
      const [customers, loyalty, sessions, referrals] = await Promise.all([
        supabase.from("customers").select("*").order("created_at", { ascending: false }),
        supabase.from("loyalty").select("*"),
        supabase
          .from("sessions")
          .select("*")
          .order("session_date", { ascending: false })
          .order("created_at", { ascending: false }),
        supabase.from("referrals").select("*").order("created_at", { ascending: false }),
      ]);
      if (customers.error) throw customers.error;
      if (loyalty.error) throw loyalty.error;
      if (sessions.error) throw sessions.error;
      if (referrals.error) throw referrals.error;

      return {
        customers: customers.data as Customer[],
        loyalty: loyalty.data as Loyalty[],
        sessions: sessions.data as Session[],
        referrals: referrals.data as Referral[],
      };
    },
  });

  const invalidate = () => queryClient.invalidateQueries({ queryKey: ["admin-customers"] });

  const addSession = useMutation({
    mutationFn: async (customerId: string) => {
      const { error } = await supabase.from("sessions").insert({
        customer_id: customerId,
        session_date: new Date().toISOString().slice(0, 10),
        status: "completed",
      });
      if (error) throw error;
    },
    onSuccess: invalidate,
  });

  const setSessionStatus = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: SessionStatus }) => {
      const { error } = await supabase.from("sessions").update({ status }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: invalidate,
  });

  const markLoyaltyUsed = useMutation({
    mutationFn: async (customerId: string) => {
      const { error } = await supabase
        .from("loyalty")
        .update({ reward_used: true, reward_status: "used" })
        .eq("customer_id", customerId);
      if (error) throw error;
    },
    onSuccess: invalidate,
  });

  const setReferralReward = useMutation({
    mutationFn: async ({
      id,
      field,
      value,
    }: {
      id: string;
      field: "referrer_reward_status" | "referred_reward_status";
      value: string;
    }) => {
      const patch =
        field === "referrer_reward_status"
          ? { referrer_reward_status: value }
          : { referred_reward_status: value };
      const { error } = await supabase.from("referrals").update(patch).eq("id", id);
      if (error) throw error;
    },
    onSuccess: invalidate,
  });

  const term = search.trim().toLowerCase();
  const rows = (data.data?.customers ?? []).filter((customer) => {
    if (!term) return true;
    return [customer.full_name, customer.email, customer.phone, customer.discovery_source]
      .filter(Boolean)
      .some((value) => String(value).toLowerCase().includes(term));
  });

  const loyaltyOf = (customerId: string) =>
    data.data?.loyalty.find((row) => row.customer_id === customerId);

  const sessionsOf = (customerId: string) =>
    (data.data?.sessions ?? []).filter((row) => row.customer_id === customerId);

  const asReferrer = (customerId: string) =>
    (data.data?.referrals ?? []).filter((row) => row.referrer_customer_id === customerId);

  const asReferred = (customerId: string) =>
    (data.data?.referrals ?? []).find((row) => row.referred_customer_id === customerId);

  const nameOf = (customerId: string) => {
    const customer = data.data?.customers.find((row) => row.id === customerId);
    return customer ? identity(customer) : "Unknown customer";
  };

  const totalCompleted = (data.data?.sessions ?? []).filter(
    (row) => row.status === "completed",
  ).length;

  return (
    <main className="min-h-screen bg-background px-5 py-16 md:px-12">
      <div className="mx-auto max-w-5xl">
        <div className="flex items-start justify-between gap-6">
          <Wordmark className="items-start" />
          <div className="flex flex-wrap items-center justify-end gap-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate({ to: "/admin/reviews" })}
            >
              Reviews
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={async () => {
                await supabase.auth.signOut();
                queryClient.clear();
                navigate({ to: "/auth" });
              }}
            >
              Sign out
            </Button>
          </div>
        </div>

        <h1 className="mt-12 font-serif text-3xl text-foreground">Customers & rewards</h1>
        <span className="rule-gold mt-6" aria-hidden="true" />

        <div className="mt-8 flex flex-wrap items-end gap-6">
          <div>
            <label htmlFor="customer-search" className="label-luxe text-muted-foreground">
              Search
            </label>
            <input
              id="customer-search"
              type="search"
              className="mt-3 w-full min-w-64 rounded-none border border-border bg-transparent px-4 py-3 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground/60 focus:border-gold sm:w-72"
              placeholder="Name, email, phone or source"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
          </div>
          <p className="text-sm text-muted-foreground">
            {rows.length} customers · {totalCompleted} completed sessions recorded
          </p>
        </div>

        {data.isLoading ? (
          <p className="mt-10 text-sm text-muted-foreground">Loading customers…</p>
        ) : data.isError ? (
          <p role="alert" className="mt-10 text-sm text-destructive">
            Customers could not be loaded. Only administrators can see these records.
          </p>
        ) : rows.length === 0 ? (
          <p className="mt-10 text-sm text-muted-foreground">No customers yet.</p>
        ) : (
          <ul className="mt-12 flex flex-col gap-8">
            {rows.map((customer) => {
              const loyalty = loyaltyOf(customer.id);
              const sessions = sessionsOf(customer.id);
              const referrerReward = asReferrer(customer.id);
              const referral = asReferred(customer.id);
              const completed = sessions.filter((row) => row.status === "completed").length;

              return (
                <li key={customer.id} className="border-t border-border pt-6">
                  <div className="flex flex-wrap items-baseline justify-between gap-3">
                    <p className="font-serif text-xl text-foreground">{identity(customer)}</p>
                    <span className="label-luxe text-muted-foreground">
                      {customer.discovery_source ?? "source not recorded"} · {completed} completed
                    </span>
                  </div>

                  <div className="mt-3 flex flex-wrap gap-x-6 gap-y-1 text-sm text-muted-foreground">
                    {customer.email ? <span>{customer.email}</span> : null}
                    {customer.phone ? <span>{customer.phone}</span> : null}
                    <span>Added {new Date(customer.created_at).toLocaleDateString()}</span>
                  </div>

                  {/* Loyalty */}
                  <div className="mt-5 flex flex-wrap items-center gap-4 border border-border px-4 py-3">
                    <span className="label-luxe text-gold-deep">Loyalty</span>
                    <span className="text-sm text-muted-foreground">
                      {loyalty?.completed_sessions ?? completed} / 10 completed sessions
                    </span>
                    <span className="text-sm text-foreground">
                      {statusLabels[loyalty?.reward_status ?? "locked"] ?? "Locked"}
                    </span>
                    {loyalty && loyalty.reward_status === "unlocked" ? (
                      <Button
                        size="sm"
                        variant="ghost"
                        disabled={markLoyaltyUsed.isPending}
                        onClick={() => markLoyaltyUsed.mutate(customer.id)}
                      >
                        Mark reward used
                      </Button>
                    ) : null}
                  </div>

                  {/* Referrals */}
                  {referral ? (
                    <div className="mt-4 flex flex-wrap items-center gap-4 border border-border px-4 py-3">
                      <span className="label-luxe text-gold-deep">Referred by</span>
                      <span className="text-sm text-foreground">
                        {nameOf(referral.referrer_customer_id)}
                      </span>
                      <span className="text-sm text-muted-foreground">
                        New client reward:{" "}
                        {statusLabels[referral.referred_reward_status] ?? "Available"}
                      </span>
                      {referral.referred_reward_status === "available" ? (
                        <Button
                          size="sm"
                          variant="ghost"
                          disabled={setReferralReward.isPending}
                          onClick={() =>
                            setReferralReward.mutate({
                              id: referral.id,
                              field: "referred_reward_status",
                              value: "used",
                            })
                          }
                        >
                          Mark used
                        </Button>
                      ) : null}
                    </div>
                  ) : null}

                  {referrerReward.map((row) => (
                    <div
                      key={row.id}
                      className="mt-4 flex flex-wrap items-center gap-4 border border-border px-4 py-3"
                    >
                      <span className="label-luxe text-gold-deep">Referred</span>
                      <span className="text-sm text-foreground">
                        {nameOf(row.referred_customer_id)}
                      </span>
                      <span className="text-sm text-muted-foreground">
                        {row.referral_status === "qualified" ? "First session completed" : "Awaiting first session"}{" "}
                        · Referrer reward: {statusLabels[row.referrer_reward_status] ?? "Pending"}
                      </span>
                      {row.referrer_reward_status === "available" ? (
                        <Button
                          size="sm"
                          variant="ghost"
                          disabled={setReferralReward.isPending}
                          onClick={() =>
                            setReferralReward.mutate({
                              id: row.id,
                              field: "referrer_reward_status",
                              value: "used",
                            })
                          }
                        >
                          Mark used
                        </Button>
                      ) : null}
                    </div>
                  ))}

                  {/* Sessions */}
                  <div className="mt-5 border border-border px-4 py-4">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <span className="label-luxe text-muted-foreground">Sessions</span>
                      <Button
                        size="sm"
                        variant="outline"
                        disabled={addSession.isPending}
                        onClick={() => addSession.mutate(customer.id)}
                      >
                        Record completed session
                      </Button>
                    </div>

                    {sessions.length === 0 ? (
                      <p className="mt-4 text-sm text-muted-foreground">No sessions recorded.</p>
                    ) : (
                      <ul className="mt-4 flex flex-col gap-2">
                        {sessions.map((session) => (
                          <li
                            key={session.id}
                            className="flex flex-wrap items-center justify-between gap-3 text-sm"
                          >
                            <span className="text-muted-foreground">
                              {session.session_date}
                              {session.service_label ? ` · ${session.service_label}` : ""}
                            </span>
                            <label className="flex items-center gap-2">
                              <span className="sr-only">Session status</span>
                              <select
                                value={session.status}
                                onChange={(event) =>
                                  setSessionStatus.mutate({
                                    id: session.id,
                                    status: event.target.value as SessionStatus,
                                  })
                                }
                                className="cursor-pointer rounded-none border border-border bg-transparent px-3 py-2 text-sm text-foreground outline-none focus:border-gold"
                              >
                                {SESSION_STATUSES.map((value) => (
                                  <option key={value} value={value}>
                                    {value.replace("_", "-")}
                                  </option>
                                ))}
                              </select>
                            </label>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </main>
  );
}
