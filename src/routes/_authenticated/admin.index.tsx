import { useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { Button } from "@/components/site/Button";
import { Wordmark } from "@/components/site/Wordmark";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { supabase } from "@/integrations/supabase/client";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_authenticated/admin/")({
  component: AdminPage,
  head: () => ({
    meta: [
      { title: "Admin — Soul's Touch by Dani" },
      { name: "description", content: "Private review moderation for Soul's Touch by Dani." },
      { name: "robots", content: "noindex, nofollow" },
      { property: "og:title", content: "Admin — Soul's Touch by Dani" },
      { property: "og:description", content: "Private review moderation." },
    ],
  }),
});

type ReviewStatus = "pending" | "approved" | "rejected";
type Filter = "all" | ReviewStatus;

const FILTERS: { value: Filter; label: string }[] = [
  { value: "all", label: "All" },
  { value: "pending", label: "Pending" },
  { value: "approved", label: "Approved" },
  { value: "rejected", label: "Rejected" },
];

function AdminPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [filter, setFilter] = useState<Filter>("pending");
  const [toDelete, setToDelete] = useState<{ id: string; name: string } | null>(null);

  const isAdmin = useQuery({
    queryKey: ["is-admin"],
    queryFn: async () => {
      const { data: u } = await supabase.auth.getUser();
      if (!u.user) return false;
      const { data, error } = await supabase.rpc("has_role", {
        _user_id: u.user.id,
        _role: "admin",
      });
      if (error) throw error;
      return Boolean(data);
    },
  });

  const reviews = useQuery({
    queryKey: ["admin-reviews"],
    enabled: isAdmin.data === true,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("reviews")
        .select("id, author_name, rating, body, language, status, created_at, contact_email")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: ["admin-reviews"] });
    queryClient.invalidateQueries({ queryKey: ["public-reviews"] });
  };

  const setStatus = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: ReviewStatus }) => {
      const { error } = await supabase.from("reviews").update({ status }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: invalidate,
  });

  const remove = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("reviews").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: invalidate,
  });

  async function signOut() {
    await queryClient.cancelQueries();
    queryClient.clear();
    await supabase.auth.signOut();
    navigate({ to: "/auth", replace: true });
  }

  const all = reviews.data ?? [];
  const counts = {
    pending: all.filter((r) => r.status === "pending").length,
    approved: all.filter((r) => r.status === "approved").length,
    rejected: all.filter((r) => r.status === "rejected").length,
  };
  const visible = filter === "all" ? all : all.filter((r) => r.status === filter);

  return (
    <main className="min-h-screen bg-background px-5 py-14 md:px-12">
      <div className="mx-auto max-w-5xl">
        <div className="flex items-start justify-between gap-6">
          <Wordmark className="items-start" />
          <div className="flex flex-wrap items-center justify-end gap-2">
            <Button variant="ghost" size="sm" onClick={() => navigate({ to: "/admin/customers" })}>
              Customers
            </Button>
            <Button variant="ghost" size="sm" onClick={signOut}>
              Sign out
            </Button>
          </div>
        </div>

        <h1 className="mt-12 font-serif text-4xl text-foreground">Reviews</h1>
        <span className="rule-gold mt-6" aria-hidden="true" />

        {isAdmin.isLoading ? (
          <p className="mt-10 text-sm text-muted-foreground">Checking access…</p>
        ) : isAdmin.data !== true ? (
          <p role="alert" className="mt-10 text-sm text-destructive">
            This account is not authorised to moderate reviews.
          </p>
        ) : (
          <>
            <dl className="mt-10 grid grid-cols-3 border-y border-border">
              {(["pending", "approved", "rejected"] as const).map((s, i) => (
                <div key={s} className={cn("px-4 py-6", i > 0 && "border-l border-border")}>
                  <dt className="label-luxe text-muted-foreground">
                    {s.charAt(0).toUpperCase() + s.slice(1)} reviews
                  </dt>
                  <dd className="mt-3 font-serif text-3xl text-foreground">{counts[s]}</dd>
                </div>
              ))}
            </dl>

            <div role="tablist" aria-label="Filter reviews" className="mt-10 flex flex-wrap gap-2">
              {FILTERS.map((f) => (
                <button
                  key={f.value}
                  role="tab"
                  aria-selected={filter === f.value}
                  onClick={() => setFilter(f.value)}
                  className={cn(
                    "label-luxe min-h-11 border px-4 transition-colors",
                    filter === f.value
                      ? "border-foreground bg-foreground text-background"
                      : "border-border text-muted-foreground hover:border-gold",
                  )}
                >
                  {f.label}
                  {f.value !== "all" ? ` (${counts[f.value]})` : ` (${all.length})`}
                </button>
              ))}
            </div>

            {setStatus.isError || remove.isError ? (
              <p role="alert" className="mt-6 text-sm text-destructive">
                The change could not be saved. Please try again.
              </p>
            ) : null}

            {reviews.isLoading ? (
              <p className="mt-10 text-sm text-muted-foreground">Loading reviews…</p>
            ) : reviews.isError ? (
              <p role="alert" className="mt-10 text-sm text-destructive">
                Reviews could not be loaded.
              </p>
            ) : visible.length === 0 ? (
              <p className="mt-10 text-sm text-muted-foreground">No reviews here.</p>
            ) : (
              <ul className="mt-8 flex flex-col">
                {visible.map((r) => (
                  <li key={r.id} className="border-t border-border py-7">
                    <div className="flex flex-wrap items-baseline justify-between gap-3">
                      <p className="font-serif text-xl text-foreground">{r.author_name}</p>
                      <div className="flex items-center gap-3">
                        <span className="label-luxe text-muted-foreground">
                          {new Date(r.created_at).toLocaleDateString("en-GB", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })}{" "}
                          · {r.rating}/5 · {r.language.toUpperCase()}
                        </span>
                        <StatusBadge status={r.status as ReviewStatus} />
                      </div>
                    </div>
                    <p className="mt-4 max-w-3xl text-sm leading-relaxed text-muted-foreground">
                      {r.body}
                    </p>
                    {r.contact_email ? (
                      <p className="mt-2 text-xs text-muted-foreground/80">{r.contact_email}</p>
                    ) : null}
                    <div className="mt-5 flex flex-wrap gap-2">
                      <Button
                        size="sm"
                        variant="solid"
                        disabled={setStatus.isPending || r.status === "approved"}
                        onClick={() => setStatus.mutate({ id: r.id, status: "approved" })}
                      >
                        Approve
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        disabled={setStatus.isPending || r.status === "rejected"}
                        onClick={() => setStatus.mutate({ id: r.id, status: "rejected" })}
                      >
                        Reject
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        disabled={remove.isPending}
                        onClick={() => setToDelete({ id: r.id, name: r.author_name })}
                      >
                        Delete
                      </Button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </>
        )}
      </div>

      <AlertDialog open={toDelete !== null} onOpenChange={(o) => !o && setToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this review?</AlertDialogTitle>
            <AlertDialogDescription>
              The review from {toDelete?.name} will be permanently deleted. This cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (toDelete) remove.mutate(toDelete.id);
                setToDelete(null);
              }}
            >
              Delete permanently
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </main>
  );
}

function StatusBadge({ status }: { status: ReviewStatus }) {
  return (
    <span
      className={cn(
        "label-luxe border px-2 py-1",
        status === "approved" && "border-gold text-gold-deep",
        status === "pending" && "border-foreground text-foreground",
        status === "rejected" && "border-border text-muted-foreground",
      )}
    >
      {status}
    </span>
  );
}
