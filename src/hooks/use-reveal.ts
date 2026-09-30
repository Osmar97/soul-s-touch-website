import { useEffect, useRef } from "react";
import type { RefObject } from "react";

/**
 * One-shot entrance reveal.
 *
 * Adds `is-revealed` the first time the element enters the viewport, so the
 * CSS transition can do the work. Observes once and disconnects — no scroll
 * listeners, no re-renders. Falls back to the revealed state when
 * `prefers-reduced-motion` is set or IntersectionObserver is unavailable.
 */
export function useReveal<T extends HTMLElement>(): RefObject<T | null> {
  const ref = useRef<T>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const reveal = () => element.classList.add("is-revealed");

    if (
      typeof IntersectionObserver === "undefined" ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      reveal();
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            reveal();
            observer.disconnect();
          }
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -6% 0px" },
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return ref;
}
