import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";

import { Button } from "@/components/site/Button";
import { Wordmark } from "@/components/site/Wordmark";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/_authenticated/admin/reviews")({
  component: AdminReviewsPage,
  head: () => ({
    meta: [
      { title: "Review moderation — Soul's Touch by Dani" },
      { name: "description", content: "Internal moderation of client reviews." },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
});

type ReviewStatus = "pending" | "approved" | "rejected";

function AdminReviewsPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const reviews = useQuery({
    queryKey: ["admin-reviews"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("reviews")
        .select("id, author_name, rating, body, language, city, status, created_at")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const setStatus = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: ReviewStatus }) => {
      const { error } = await supabase.from("reviews").update({ status }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin-reviews"] }),
  });

  const remove = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("reviews").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin-reviews"] }),
  });


  return (
    <main className="min-h-screen bg-background px-5 py-16 md:px-12">
      <div className="mx-auto max-w-4xl">
        <div className="flex items-start justify-between gap-6">
          <Wordmark className="items-start" />
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

        <h1 className="mt-12 font-serif text-3xl text-foreground">Review moderation</h1>
        <span className="rule-gold mt-6" aria-hidden="true" />

        {reviews.isLoading ? (
          <p className="mt-10 text-sm text-muted-foreground">Loading reviews…</p>
        ) : reviews.isError ? (
          <p role="alert" className="mt-10 text-sm text-destructive">
            Reviews could not be loaded. Only administrators can moderate reviews.
          </p>
        ) : reviews.data && reviews.data.length > 0 ? (
          <ul className="mt-12 flex flex-col gap-10">
            {reviews.data.map((review) => (
              <li key={review.id} className="border-t border-border pt-6">
                <div className="flex flex-wrap items-baseline justify-between gap-3">
                  <p className="font-serif text-xl text-foreground">{review.author_name}</p>
                  <span className="label-luxe text-muted-foreground">
                    {review.status} · {review.rating}/5 · {review.language.toUpperCase()}
                  </span>
                </div>
                <p className="mt-4 text-sm leading-relaxed text-muted-foreground">{review.body}</p>
                <div className="mt-5 flex flex-wrap gap-3">
                  <Button
                    size="sm"
                    disabled={setStatus.isPending || review.status === "approved"}
                    onClick={() => setStatus.mutate({ id: review.id, status: "approved" })}
                  >
                    Approve
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    disabled={setStatus.isPending || review.status === "rejected"}
                    onClick={() => setStatus.mutate({ id: review.id, status: "rejected" })}
                  >
                    Reject
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-10 text-sm text-muted-foreground">No reviews yet.</p>
        )}
      </div>
    </main>
  );
}
