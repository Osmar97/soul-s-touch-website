import { useState } from "react";

import { Button } from "./Button";
import { FieldError, invalidClass } from "./FieldError";
import { discoverySchema, fieldErrors, type FormErrorKey } from "@/lib/schemas/forms";
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

    const found = fieldErrors(discoverySchema, trimmed);
    setErrors(found);
    if (Object.keys(found).length) {
      setStatus("invalid");
      document.getElementById(`discovery-${Object.keys(found)[0]}`)?.focus();
      return;
    }

    setStatus("sending");
    try {
      const looksLikeEmail = trimmed.contact.includes("@");
      const { error } = await supabase.rpc("record_discovery", {
        p_source: trimmed.source,
        ...(trimmed.name ? { p_name: trimmed.name } : {}),
        ...(looksLikeEmail ? { p_email: trimmed.contact } : { p_phone: trimmed.contact }),
        ...(isFriend && trimmed.referrer ? { p_referrer: trimmed.referrer } : {}),
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
    <form noValidate onSubmit={handleSubmit} className="mt-14 border border-ink-foreground/15 px-6 py-8 sm:px-8 sm:py-9">
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
            className={cn(fieldClass, "cursor-pointer appearance-none", invalidClass(!!errors["source"], "ink"))}
            value={source}
            {...a11y("source", sourceId)}
            onChange={(event) => {
              setSource(event.target.value);
              clear("source");
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
          <FieldError id={`${sourceId}-error`} message={err("source")} tone="ink" />
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
            className={cn(fieldClass, invalidClass(!!errors["contact"], "ink"))}
            placeholder={t.discovery.contactPlaceholder}
            value={contact}
            {...a11y("contact", contactId, `${contactId}-hint`)}
            onChange={(event) => {
              setContact(event.target.value);
              clear("contact");
              if (status !== "sending") setStatus("idle");
            }}
            maxLength={160}
            required
          />
          <FieldError id={`${contactId}-error`} message={err("contact")} tone="ink" />
          <span id={`${contactId}-hint`} className="mt-2 block text-xs leading-relaxed text-ink-foreground/70">
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
              className={cn(fieldClass, invalidClass(!!errors["referrer"], "ink"))}
              placeholder={t.discovery.referrerPlaceholder}
              value={referrer}
              {...a11y("referrer", referrerId, `${referrerId}-hint`)}
              onChange={(event) => {
                setReferrer(event.target.value);
                clear("referrer");
                if (status !== "sending") setStatus("idle");
              }}
              maxLength={160}
              required
            />
            <FieldError id={`${referrerId}-error`} message={err("referrer")} tone="ink" />
            <span id={`${referrerId}-hint`} className="mt-2 block text-xs leading-relaxed text-ink-foreground/70">
              {t.discovery.referrerHint}
            </span>
          </div>
        ) : null}
      </div>

      {status === "invalid" || status === "error" ? (
        <p role="alert" className="mt-6 text-sm text-gold-soft">
          {status === "invalid" ? t.forms.summary : t.discovery.error}
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
