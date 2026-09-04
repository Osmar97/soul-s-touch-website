import { useState } from "react";

import { Button } from "@/components/site/Button";
import { supabase } from "@/integrations/supabase/client";
import { useI18n } from "@/i18n";
import { cn } from "@/lib/utils";

export function ReviewForm({
  onSubmitted,
  onCancel,
}: {
  onSubmitted: () => void;
  onCancel: () => void;
}) {
  const { t, lang } = useI18n();
  const [name, setName] = useState("");
  const [rating, setRating] = useState(0);
  const [body, setBody] = useState("");
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "error" | "invalid">("idle");

  const fieldClass =
    "mt-3 w-full rounded-none border border-border bg-transparent px-4 py-3 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground/60 focus:border-gold";

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (!name.trim() || !body.trim() || rating < 1) {
      setStatus("invalid");
      return;
    }
    setStatus("sending");
    const { error } = await supabase.from("reviews").insert({
      author_name: name.trim().slice(0, 60),
      rating,
      body: body.trim().slice(0, 1200),
      language: lang,
      contact_email: email.trim() ? email.trim().slice(0, 160) : null,
      status: "pending",
    });
    if (error) {
      setStatus("error");
      return;
    }
    onSubmitted();
  }

  return (
    <form onSubmit={handleSubmit} className="mx-auto mt-14 max-w-xl border-t border-border pt-10">
      <p className="label-luxe text-gold-deep">{t.reviews.formTitle}</p>
      <p className="mt-4 text-sm leading-relaxed text-muted-foreground">{t.reviews.formIntro}</p>

      <label className="mt-9 block">
        <span className="label-luxe text-muted-foreground">{t.reviews.fieldName}</span>
        <input
          className={fieldClass}
          value={name}
          onChange={(e) => setName(e.target.value)}
          maxLength={60}
          required
        />
      </label>

      <fieldset className="mt-8">
        <legend className="label-luxe text-muted-foreground">{t.reviews.fieldRating}</legend>
        <div className="mt-3 flex items-center gap-2">
          {[1, 2, 3, 4, 5].map((n) => (
            <button
              key={n}
              type="button"
              onClick={() => setRating(n)}
              aria-pressed={rating === n}
              aria-label={`${n} / 5`}
              className={cn(
                "h-10 w-10 border text-sm transition-colors",
                n <= rating
                  ? "border-gold bg-gold/10 text-gold-deep"
                  : "border-border text-muted-foreground hover:border-gold/60",
              )}
            >
              {n}
            </button>
          ))}
        </div>
      </fieldset>

      <label className="mt-8 block">
        <span className="label-luxe text-muted-foreground">{t.reviews.fieldBody}</span>
        <textarea
          className={cn(fieldClass, "min-h-32 resize-y leading-relaxed")}
          value={body}
          onChange={(e) => setBody(e.target.value)}
          maxLength={1200}
          required
        />
      </label>

      <label className="mt-8 block">
        <span className="label-luxe text-muted-foreground">{t.reviews.fieldEmail}</span>
        <input
          type="email"
          className={fieldClass}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          maxLength={160}
        />
        <span className="mt-2 block text-xs text-muted-foreground/80">
          {t.reviews.fieldEmailHint}
        </span>
      </label>

      {status === "invalid" || status === "error" ? (
        <p role="alert" className="mt-6 text-sm text-destructive">
          {status === "invalid" ? t.reviews.validation : t.reviews.error}
        </p>
      ) : null}

      <div className="mt-10 flex flex-wrap items-center gap-4">
        <ButtonSubmit sending={status === "sending"} label={t.reviews.submit} sendingLabel={t.reviews.sending} />
        <Button variant="ghost" size="sm" onClick={onCancel}>
          {t.reviews.cancel}
        </Button>
      </div>
    </form>
  );
}

function ButtonSubmit({
  sending,
  label,
  sendingLabel,
}: {
  sending: boolean;
  label: string;
  sendingLabel: string;
}) {
  return (
    <button
      type="submit"
      disabled={sending}
      className="inline-flex items-center justify-center rounded-none border border-primary bg-primary px-7 py-3.5 text-[0.6875rem] uppercase tracking-[0.24em] text-primary-foreground transition-colors duration-300 hover:bg-ink disabled:pointer-events-none disabled:opacity-50"
    >
      {sending ? sendingLabel : label}
    </button>
  );
}
