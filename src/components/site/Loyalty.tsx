import { useState } from "react";

import { Button } from "./Button";
import { Section } from "./Section";
import { SectionHeading } from "./SectionHeading";
import { SECTIONS } from "@/config/site";
import { useReveal } from "@/hooks/use-reveal";
import { useT } from "@/i18n";
import { supabase } from "@/integrations/supabase/client";
import { cn } from "@/lib/utils";

/** Sessions required before the loyalty reward unlocks. */
const GOAL = 10;

type RewardStatus = "locked" | "unlocked" | "used";

type Card = {
  name: string;
  completed: number;
  status: RewardStatus;
};

const lookupState = ["idle", "sending", "found", "notfound", "error"] as const;
type LookupState = (typeof lookupState)[number];

function isRewardStatus(value: string): value is RewardStatus {
  return value === "locked" || value === "unlocked" || value === "used";
}

/**
 * LOYALTY — the digital loyalty card plus the referral programme message.
 * Progress only ever reflects COMPLETED sessions; the figure itself comes from
 * the database, never from anything the visitor submits.
 */
export function Loyalty() {
  const t = useT();
  const revealRef = useReveal<HTMLDivElement>();
  const [identifier, setIdentifier] = useState("");
  const [card, setCard] = useState<Card | null>(null);
  const [status, setStatus] = useState<LookupState>("idle");

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    const value = identifier.trim();
    if (!value) return;

    setStatus("sending");
    try {
      const { data, error } = await supabase.rpc("lookup_loyalty", {
        p_identifier: value,
      });
      if (error) throw error;

      const row = data?.[0];
      if (!row) {
        setCard(null);
        setStatus("notfound");
        return;
      }

      setCard({
        name: row.display_name,
        completed: row.completed_sessions,
        status: isRewardStatus(row.reward_status) ? row.reward_status : "locked",
      });
      setStatus("found");
    } catch {
      setCard(null);
      setStatus("error");
    }
  }

  const completed = Math.max(0, Math.min(card?.completed ?? 0, GOAL));
  const rewardLine =
    card?.status === "used"
      ? t.loyalty.rewardUsed
      : card?.status === "unlocked"
        ? t.loyalty.rewardUnlocked
        : t.loyalty.rewardLocked;

  const fieldClass =
    "mt-3 w-full rounded-none border border-border bg-transparent px-4 py-3 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground/60 focus:border-gold";

  return (
    <Section id={SECTIONS.loyalty} tone="muted" labelledBy="loyalty-heading">
      <div
        ref={revealRef}
        className="reveal grid gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] lg:items-start lg:gap-16"
      >
        {/* Copy + referral programme */}
        <div>
          <SectionHeading
            id="loyalty-heading"
            eyebrow={t.loyalty.eyebrow}
            title={t.loyalty.title}
            description={t.loyalty.description}
            className="max-w-none"
          />

          <div className="mt-10 border border-gold/40 px-6 py-7 sm:px-8 sm:py-8">
            <p className="label-luxe text-gold-deep">{t.loyalty.referralTitle}</p>
            <p className="mt-4 text-sm leading-[1.9] text-muted-foreground">
              {t.loyalty.referralBody}
            </p>
          </div>

          <p className="mt-6 text-xs leading-relaxed text-muted-foreground/80">
            {t.loyalty.footNote}
          </p>
        </div>

        {/* Digital loyalty card + lookup */}
        <div>
          <div className="border border-foreground/15 bg-ink px-6 py-8 text-ink-foreground sm:px-9 sm:py-10">
            <div className="flex flex-wrap items-baseline justify-between gap-3">
              <p className="label-luxe text-gold-soft">{t.loyalty.cardTitle}</p>
              <p className="label-luxe text-ink-foreground/50">{t.brand.name}</p>
            </div>

            <p className="mt-6 font-serif text-2xl leading-snug sm:text-3xl">
              {card?.name || t.loyalty.cardSubtitle}
            </p>

            <ul
              aria-hidden="true"
              className="mt-8 grid grid-cols-5 gap-3 sm:grid-cols-10 sm:gap-2.5"
            >
              {Array.from({ length: GOAL }, (_, index) => {
                const filled = index < completed;
                return (
                  <li
                    key={index}
                    className={cn(
                      "aspect-square w-full rounded-full border transition-colors duration-500",
                      filled
                        ? "border-gold bg-gold/70"
                        : "border-ink-foreground/25 bg-transparent",
                    )}
                  />
                );
              })}
            </ul>

            <p className="mt-7 text-sm text-ink-foreground/70" role="status">
              <span className="font-serif text-xl text-gold-soft">{completed}</span>
              <span className="mx-2 text-ink-foreground/40">/ {GOAL}</span>
              {t.loyalty.progressLabel}
            </p>

            <p className="mt-3 text-sm leading-relaxed text-ink-foreground/60">{rewardLine}</p>
          </div>

          <form onSubmit={handleSubmit} className="mt-8 border-t border-border pt-8">
            <label htmlFor="loyalty-lookup" className="label-luxe text-muted-foreground">
              {t.loyalty.lookupLabel}
            </label>
            <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-start">
              <input
                id="loyalty-lookup"
                type="text"
                inputMode="email"
                autoComplete="email"
                className={cn(fieldClass, "mt-0 sm:flex-1")}
                placeholder={t.loyalty.lookupPlaceholder}
                value={identifier}
                onChange={(event) => {
                  setIdentifier(event.target.value);
                  if (status !== "idle") setStatus("idle");
                }}
                maxLength={160}
              />
              <Button
                type="submit"
                variant="solid"
                disabled={status === "sending"}
                className="shrink-0"
              >
                {status === "sending" ? t.loyalty.lookupSending : t.loyalty.lookupCta}
              </Button>
            </div>

            <p
              role={status === "error" || status === "notfound" ? "alert" : "status"}
              aria-live="polite"
              className={cn(
                "mt-4 text-sm leading-relaxed",
                status === "error" ? "text-destructive" : "text-muted-foreground",
              )}
            >
              {status === "error"
                ? t.loyalty.lookupError
                : status === "notfound"
                  ? t.loyalty.lookupNotFound
                  : ""}
            </p>
          </form>
        </div>
      </div>
    </Section>
  );
}
