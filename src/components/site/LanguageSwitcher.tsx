import { LANGUAGES, useI18n } from "@/i18n";
import { cn } from "@/lib/utils";

/**
 * Discreet EN · PT · ES toggle — deliberately not a dropdown.
 */
export function LanguageSwitcher({
  className,
  tone = "default",
}: {
  className?: string;
  tone?: "default" | "onInk";
}) {
  const { lang, setLang, t } = useI18n();
  const onInk = tone === "onInk";

  return (
    <div
      role="group"
      aria-label={t.common.language}
      className={cn("flex items-center gap-3", className)}
    >
      {LANGUAGES.map((code, index) => {
        const active = code === lang;
        return (
          <span key={code} className="flex items-center gap-3">
            {index > 0 ? (
              <span
                aria-hidden="true"
                className={cn("text-[0.6rem]", onInk ? "text-ink-foreground/30" : "text-border")}
              >
                /
              </span>
            ) : null}
            <button
              type="button"
              lang={code}
              aria-current={active ? "true" : undefined}
              onClick={() => setLang(code)}
              className={cn(
                "label-luxe cursor-pointer border-b py-0.5 transition-colors duration-300",
                active
                  ? "border-gold text-gold-deep"
                  : cn(
                      "border-transparent hover:text-gold-deep",
                      onInk ? "text-ink-foreground/60" : "text-muted-foreground",
                    ),
                onInk && active && "text-gold-soft",
              )}
            >
              {code.toUpperCase()}
            </button>
          </span>
        );
      })}
    </div>
  );
}
