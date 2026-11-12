import { useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";

import { Button } from "@/components/site/Button";
import { Wordmark } from "@/components/site/Wordmark";
import { supabase } from "@/integrations/supabase/client";
import { CustomerCard } from "@/components/admin/CustomerCard";
import { CustomerSearch } from "@/components/admin/CustomerSearch";
import { hasRewardReady, matchesSearch } from "@/components/admin/customer-data";
import { useCustomerAdmin } from "@/components/admin/use-customer-admin";

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

function AdminCustomersPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { query, actions, error } = useCustomerAdmin();
  const [search, setSearch] = useState("");
  const [rewardsOnly, setRewardsOnly] = useState(false);

  const data = query.data;
  const term = search.trim().toLowerCase();
  const rows = (data?.customers ?? []).filter(
    (customer) =>
      matchesSearch(customer, term) && (!rewardsOnly || (data && hasRewardReady(customer.id, data))),
  );
  const totalCompleted = (data?.sessions ?? []).filter((row) => row.status === "completed").length;

  const signOut = async () => {
    await supabase.auth.signOut();
    queryClient.clear();
    navigate({ to: "/auth" });
  };

  return (
    <main className="min-h-screen bg-background px-5 py-16 md:px-12">
      <div className="mx-auto max-w-5xl">
        <div className="flex items-start justify-between gap-6">
          <Wordmark className="items-start" />
          <div className="flex flex-wrap items-center justify-end gap-3">
            <Button variant="ghost" size="sm" onClick={() => navigate({ to: "/admin" })}>
              Reviews
            </Button>
            <Button variant="ghost" size="sm" onClick={signOut}>
              Sign out
            </Button>
          </div>
        </div>

        <h1 className="mt-12 font-serif text-3xl text-foreground">Customers & rewards</h1>
        <span className="rule-gold mt-6" aria-hidden="true" />

        <CustomerSearch search={search} onSearch={setSearch} rewardsOnly={rewardsOnly}
          onRewardsOnly={setRewardsOnly} count={rows.length} completed={totalCompleted} />

        {error ? (
          <p role="alert" className="mt-6 text-sm text-destructive">
            That change could not be saved. Please try again.
          </p>
        ) : null}

        {query.isLoading ? (
          <p className="mt-10 text-sm text-muted-foreground">Loading customers…</p>
        ) : query.isError ? (
          <p role="alert" className="mt-10 text-sm text-destructive">
            Customers could not be loaded. Only administrators can see these records.
          </p>
        ) : rows.length === 0 ? (
          <p className="mt-10 text-sm text-muted-foreground">
            {rewardsOnly ? "No rewards waiting to be redeemed." : "No customers yet."}
          </p>
        ) : (
          <ul className="mt-12 flex flex-col gap-8">
            {rows.map((customer) => (
              <CustomerCard key={customer.id} customer={customer} data={data!} actions={actions} />
            ))}
          </ul>
        )}
      </div>
    </main>
  );
}
