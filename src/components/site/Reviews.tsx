import { useState } from "react";
import { useQuery } from "@tanstack/react-query";

import { Button } from "@/components/site/Button";
import { ReviewForm } from "@/components/site/ReviewForm";
import { Section } from "@/components/site/Section";
import { SectionHeading } from "@/components/site/SectionHeading";
import { StarRating } from "@/components/site/StarRating";
import { SECTIONS } from "@/config/site";
import { supabase } from "@/integrations/supabase/client";
import { useT } from "@/i18n";
import { cn } from "@/lib/utils";

type PublicReview = {
  id: string;
  author_name: string;
  rating: number;
  body: string;
};

export function Reviews() {
  const t = useT();
  const [formOpen, setFormOpen] = useState(false);
  const [thanks, setThanks] = useState(false);
  const [index, setIndex] = useState(0);

  const reviews = useQuery({
    queryKey: ["public-reviews"],
    queryFn: async (): Promise<PublicReview[]> => {
      const { data, error } = await supabase
        .from("reviews")
        .select("id, author_name, rating, body")
        .eq("status", "approved")
        .order("created_at", { ascending: false })
        .limit(12);
      if (error) throw error;
      return data ?? [];
    },
  });

  const list = reviews.data ?? [];
  const hasReviews = list.length > 0;
  const current = list[Math.min(index, Math.max(list.length - 1, 0))];

  return (
    <Section id={SECTIONS.reviews} tone="muted" labelledBy="reviews-heading">
      <SectionHeading
        id="reviews-heading"
        align="center"
        eyebrow={t.reviews.eyebrow}
        title={t.reviews.title}
        description={t.reviews.description}
      />

      {reviews.isLoading ? (
        <p role="status" className="mt-16 text-center text-sm text-muted-foreground">
          {t.common.loading}
        </p>
      ) : reviews.isError ? (
        <div className="mx-auto mt-16 max-w-xl border-y border-border py-12 text-center">
          <p role="alert" className="text-sm text-muted-foreground">
            {t.common.error}
          </p>
          <Button className="mt-7" variant="outline" onClick={() => reviews.refetch()}>
            {t.common.tryAgain}
          </Button>
        </div>
      ) : hasReviews ? (
        <>
          {/* Desktop: editorial grid */}
          <ul className="mt-16 hidden gap-x-14 gap-y-16 md:grid md:grid-cols-2 lg:grid-cols-3">
            {list.map((review) => (
              <li key={review.id}>
                <ReviewQuote review={review} label={t.reviews.ratingLabel} />
              </li>
            ))}
          </ul>

          {/* Mobile: one review per view */}
          <div className="mt-14 md:hidden">
            {current ? <ReviewQuote review={current} label={t.reviews.ratingLabel} /> : null}
            {list.length > 1 ? (
              <div className="mt-10 flex items-center justify-between">
                <Button
                  size="sm"
                  variant="ghost"
                  aria-label={t.reviews.previous}
                  onClick={() => setIndex((i) => (i - 1 + list.length) % list.length)}
                >
                  ←
                </Button>
                <span className="label-luxe text-muted-foreground">
                  {Math.min(index, list.length - 1) + 1} / {list.length}
                </span>
                <Button
                  size="sm"
                  variant="ghost"
                  aria-label={t.reviews.next}
                  onClick={() => setIndex((i) => (i + 1) % list.length)}
                >
                  →
                </Button>
              </div>
            ) : null}
          </div>
        </>
      ) : (
        <div className="mx-auto mt-16 max-w-xl border-y border-border py-16 text-center">
          <p className="font-serif text-2xl leading-relaxed text-foreground sm:text-3xl">
            {t.reviews.empty}
          </p>
        </div>
      )}

      {thanks ? (
        <p
          role="status"
          className="mx-auto mt-12 max-w-xl border-t border-gold/40 pt-8 text-center text-sm leading-relaxed text-muted-foreground"
        >
          {t.reviews.submitted}
        </p>
      ) : formOpen ? (
        <ReviewForm
          onCancel={() => setFormOpen(false)}
          onSubmitted={() => {
            setFormOpen(false);
            setThanks(true);
          }}
        />
      ) : (
        <div className={cn("mt-12 flex justify-center", !hasReviews && "mt-10")}>
          <Button onClick={() => setFormOpen(true)}>{t.reviews.emptyCta}</Button>
        </div>
      )}
    </Section>
  );
}

function ReviewQuote({ review, label }: { review: PublicReview; label: string }) {
  return (
    <figure className="flex h-full flex-col border-t border-border pt-8">
      <StarRating value={review.rating} label={label} />
      <blockquote className="mt-6 font-serif text-xl leading-relaxed text-foreground">
        <span aria-hidden="true" className="mr-1 text-gold/70">
          &ldquo;
        </span>
        {review.body}
        <span aria-hidden="true" className="text-gold/70">
          &rdquo;
        </span>
      </blockquote>
      <figcaption className="label-luxe mt-7 text-muted-foreground">
        {review.author_name}
      </figcaption>
    </figure>
  );
}
