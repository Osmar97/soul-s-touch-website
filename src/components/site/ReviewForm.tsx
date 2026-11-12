import { useState } from "react";

import { Button } from "@/components/site/Button";
import { FieldError, invalidClass } from "@/components/site/FieldError";
import { fieldErrors, reviewSchema, type FormErrorKey } from "@/lib/schemas/forms";
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
  const [errors, setErrors] = useState<Record<string, FormErrorKey>>({});
  const err = (field: string) => (errors[field] ? t.forms[errors[field]] : undefined);
  const a11y = (field: string, id: string, hint?: string) => ({
    "aria-invalid": errors[field] ? true : undefined,
    "aria-describedby": [errors[field] ? `${id}-error` : "", hint ?? ""].filter(Boolean).join(" ") || undefined,
  });
  const clear = (field: string) =>
    setErrors((prev) => {
      if (!prev[field]) return prev;
      const next = { ...prev };
      delete next[field];
      return next;
    });
  const nameId = "review-form-author";
  const bodyId = "review-form-body";
  const emailId = "review-form-email";

  const fieldClass =
    "mt-3 w-full rounded-none border border-border bg-transparent px-4 py-3 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground/60 focus:border-gold";

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    const found = fieldErrors(reviewSchema, { name, rating, body, email });
    setErrors(found);
    if (Object.keys(found).length) {
      setStatus("invalid");
      const first = Object.keys(found)[0];
      document.getElementById(first === "rating" ? "review-form-rating-1" : `review-form-${first === "name" ? "author" : first}`)?.focus();
      return;
    }
    setStatus("sending");
    try {
      const { error } = await supabase.from("reviews").insert({
        author_name: name.trim().slice(0, 60),
        rating,
        body: body.trim().slice(0, 1200),
        language: lang,
        contact_email: email.trim() ? email.trim().slice(0, 160) : null,
        status: "pending",
      });
      if (error) throw error;
      onSubmitted();
    } catch {
      setStatus("error");
    }
  }

  return (
    <form noValidate onSubmit={handleSubmit} className="mx-auto mt-14 max-w-xl border-t border-border pt-10">
      <p className="label-luxe text-gold-deep">{t.reviews.formTitle}</p>
      <p className="mt-4 text-sm leading-relaxed text-muted-foreground">{t.reviews.formIntro}</p>

      <div className="mt-9">
        <label htmlFor={nameId} className="label-luxe text-muted-foreground">
          {t.reviews.fieldName}
        </label>
        <input
          id={nameId}
          className={cn(fieldClass, invalidClass(!!errors["name"]))}
          value={name}
          onChange={(e) => {
            setName(e.target.value);
            clear("name");
          }}
          maxLength={60}
          required
          {...a11y("name", nameId)}
        />
        <FieldError id={`${nameId}-error`} message={err("name")} />
      </div>

      <fieldset className="mt-8" aria-describedby={errors["rating"] ? "review-form-rating-error" : undefined}>
        <legend className="label-luxe text-muted-foreground">{t.reviews.fieldRating}</legend>
        <div className="mt-3 flex items-center gap-2">
          {[1, 2, 3, 4, 5].map((n) => (
            <button
              key={n}
              id={`review-form-rating-${n}`}
              type="button"
              onClick={() => {
                setRating(n);
                clear("rating");
              }}
              aria-pressed={rating === n}
              aria-label={`${n} ${t.reviews.ratingLabel}`}
              className={cn(
                "h-11 w-11 border text-sm transition-colors",
                n <= rating
                  ? "border-gold bg-gold/10 text-gold-deep"
                  : "border-border text-muted-foreground hover:border-gold/60",
              )}
            >
              {n}
            </button>
          ))}
        </div>
        <FieldError id="review-form-rating-error" message={err("rating")} />
      </fieldset>

      <div className="mt-8">
        <label htmlFor={bodyId} className="label-luxe text-muted-foreground">
          {t.reviews.fieldBody}
        </label>
        <textarea
          id={bodyId}
          className={cn(fieldClass, "min-h-32 resize-y leading-relaxed", invalidClass(!!errors["body"]))}
          value={body}
          onChange={(e) => {
            setBody(e.target.value);
            clear("body");
          }}
          maxLength={1200}
          required
          {...a11y("body", bodyId)}
        />
        <FieldError id={`${bodyId}-error`} message={err("body")} />
      </div>

      <div className="mt-8">
        <label htmlFor={emailId} className="label-luxe text-muted-foreground">
          {t.reviews.fieldEmail}
        </label>
        <input
          id={emailId}
          type="email"
          autoComplete="email"
          className={cn(fieldClass, invalidClass(!!errors["email"]))}
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            clear("email");
          }}
          maxLength={160}
          {...a11y("email", emailId, `${emailId}-hint`)}
        />
        <FieldError id={`${emailId}-error`} message={err("email")} />
        <span id={`${emailId}-hint`} className="mt-2 block text-xs text-muted-foreground">
          {t.reviews.fieldEmailHint}
        </span>
      </div>

      {status === "invalid" || status === "error" ? (
        <p role="alert" className="mt-6 text-sm text-destructive">
          {status === "invalid" ? t.forms.summary : t.reviews.error}
        </p>
      ) : null}

      <div className="mt-10 flex flex-wrap items-center gap-4">
        <Button type="submit" variant="solid" disabled={status === "sending"}>
          {status === "sending" ? t.reviews.sending : t.reviews.submit}
        </Button>
        <Button variant="ghost" size="sm" onClick={onCancel}>
          {t.reviews.cancel}
        </Button>
      </div>
    </form>
  );
}
