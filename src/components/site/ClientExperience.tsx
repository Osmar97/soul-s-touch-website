import { useEffect, useRef } from "react";
import type { CSSProperties } from "react";

import { SECTIONS } from "@/config/site";
import { useT } from "@/i18n";

import { SectionHeading } from "./SectionHeading";

/**
 * Client care guidelines: before, during, boundaries and privacy.
 *
 * Desktop (>=768px, no reduced-motion preference) runs as a pinned
 * editorial storytelling stage:
 *
 *   - the outer track is 300vh tall and the inner stage sticks for its length
 *   - the LEFT column never moves: it is the editorial anchor
 *   - the RIGHT column progresses through three states, driven purely by the
 *     user's scroll progress through the track
 *
 * The scroll driver writes CSS custom properties (`--pos`, `--o`) directly on
 * the DOM inside a single requestAnimationFrame loop — no React re-renders per
 * frame, no animation library.
 *
 * Below 768px, and whenever `prefers-reduced-motion: reduce` is set, the whole
 * section falls back to plain document flow with every state visible.
 */

const PIN_MIN_WIDTH = 768;

/** Scroll progress (0..1) → continuous state position (0..2), eased. */
function progressToPosition(progress: number): number {
  // state 1 rests until 26%, transitions to state 2 across 26–42%,
  // rests until 60%, transitions to state 3 across 60–76%, then rests.
  if (progress <= 0.26) return 0;
  if (progress < 0.42) {
    const t = (progress - 0.26) / 0.16;
    return t * t * (3 - 2 * t);
  }
  if (progress <= 0.6) return 1;
  if (progress < 0.76) {
    const t = (progress - 0.6) / 0.16;
    return 1 + (t * t * (3 - 2 * t));
  }
  return 2;
}

function clamp01(value: number): number {
  if (value < 0) return 0;
  if (value > 1) return 1;
  return value;
}

export function ClientExperience() {
  const t = useT();

  const trackRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const stateRefs = useRef<(HTMLElement | null)[]>([]);

  useEffect(() => {
    const track = trackRef.current;
    const stage = stageRef.current;
    const list = listRef.current;
    if (!track || !stage || !list) return;

    const pinQuery = window.matchMedia(`(min-width: ${PIN_MIN_WIDTH}px)`);
    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");

    let frame = 0;

    const paint = () => {
      frame = 0;
      const pinned = pinQuery.matches && !motionQuery.matches;

      if (!pinned) {
        list.style.removeProperty("--pos");
        for (const state of stateRefs.current) state?.style.removeProperty("--o");
        return;
      }

      const travel = track.offsetHeight - stage.offsetHeight;
      const passed = -track.getBoundingClientRect().top;
      const progress = travel > 0 ? clamp01(passed / travel) : 0;
      const position = progressToPosition(progress);

      list.style.setProperty("--pos", position.toFixed(4));

      for (let index = 0; index < stateRefs.current.length; index += 1) {
        const state = stateRefs.current[index];
        if (!state) continue;
        const distance = Math.min(1, Math.abs(index - position));
        // Past states fade a touch further than upcoming ones so the eye is
        // always pulled to the state currently in the focal position.
        const opacity = index <= position ? 1 - 0.7 * distance : 1 - 0.66 * distance;
        state.style.setProperty("--o", opacity.toFixed(3));
      }
    };

    const schedule = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(paint);
    };

    const onMotionChange = () => {
      if (motionQuery.matches) {
        if (frame) {
          window.cancelAnimationFrame(frame);
          frame = 0;
        }
        paint();
      } else {
        schedule();
      }
    };

    paint();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    pinQuery.addEventListener("change", schedule);
    motionQuery.addEventListener("change", onMotionChange);

    return () => {
      if (frame) window.cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      pinQuery.removeEventListener("change", schedule);
      motionQuery.removeEventListener("change", onMotionChange);
      list.style.removeProperty("--pos");
      for (const state of stateRefs.current) state?.style.removeProperty("--o");
    };
  }, []);

  const beforeItems = [
    t.clientExperience.beforeItem1,
    t.clientExperience.beforeItem2,
    t.clientExperience.beforeItem3,
    t.clientExperience.beforeItem4,
    t.clientExperience.beforeItem5,
    t.clientExperience.beforeItem6,
    t.clientExperience.beforeItem7,
  ];

  const states = [
    { index: "01", title: t.clientExperience.pressureTitle, body: t.clientExperience.pressureBody },
    {
      index: "02",
      title: t.clientExperience.communicateTitle,
      body: t.clientExperience.communicateBody,
    },
    { index: "03", title: t.clientExperience.pauseTitle, body: t.clientExperience.pauseBody },
  ];

  return (
    <section
      id={SECTIONS.clientExperience}
      aria-labelledby="client-experience-heading"
      className="story-section"
    >
      {/* Scroll track — its height is the storytelling distance. */}
      <div ref={trackRef} className="story-track">
        <div ref={stageRef} className="story-stage">
          <div className="container-luxe grid w-full gap-14 md:grid-cols-[45fr_55fr] md:gap-10 lg:gap-16 xl:gap-24">
            {/* ── LEFT — the editorial anchor, never moves ─────────────── */}
            <div>
              <SectionHeading
                id="client-experience-heading"
                eyebrow={t.clientExperience.eyebrow}
                title={t.clientExperience.title}
                className="max-w-md"
              />

              <div className="mt-10 lg:mt-12">
                <h3 className="font-serif text-xl leading-snug text-foreground sm:text-2xl">
                  {t.clientExperience.beforeTitle}
                </h3>
                <p className="mt-3 max-w-md text-sm leading-relaxed text-muted-foreground">
                  {t.clientExperience.beforeIntro}
                </p>
                <span className="label-luxe mt-6 block text-foreground">
                  {t.clientExperience.beforePlease}
                </span>
                <ul className="mt-4 border-t border-gold/20">
                  {beforeItems.map((item) => (
                    <li
                      key={item}
                      className="flex items-start gap-4 border-b border-gold/20 py-3 text-[0.8125rem] leading-relaxed text-muted-foreground"
                    >
                      <span aria-hidden="true" className="mt-2 h-px w-4 shrink-0 bg-gold" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* ── RIGHT — the storytelling column ──────────────────────── */}
            <div className="min-w-0">
              <h3 className="font-serif text-xl leading-snug text-foreground sm:text-2xl">
                {t.clientExperience.duringTitle}
              </h3>
              <p className="mt-3 max-w-xl text-sm leading-relaxed text-muted-foreground">
                {t.clientExperience.duringIntro}
              </p>

              <div className="story-window mt-8 lg:mt-10">
                <div ref={listRef} className="story-list">
                  {states.map((state, position) => (
                    <article
                      key={state.index}
                      ref={(element) => {
                        stateRefs.current[position] = element;
                      }}
                      className="story-state"
                      style={{ "--i": position } as CSSProperties}
                    >
                      <div className="flex items-center gap-5">
                        <span className="label-luxe text-gold-deep">{state.index}</span>
                        <span className="h-px flex-1 bg-gold/25" aria-hidden="true" />
                      </div>

                      <div className="mt-5 border-l border-gold/40 pl-5 sm:pl-6">
                        <h4 className="font-serif text-2xl leading-snug text-foreground sm:text-3xl">
                          {state.title}
                        </h4>
                        <p className="mt-3 max-w-md text-sm leading-relaxed text-muted-foreground">
                          {state.body}
                        </p>
                      </div>
                    </article>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Professional boundaries + privacy — normal document flow ──── */}
      <div className="container-luxe story-after mt-16 border-t border-gold/20 pt-16 md:mt-20 md:pt-20">
        <div className="grid gap-12 lg:grid-cols-[1fr_minmax(0,0.75fr)] lg:gap-20">
          <div>
            <h3 className="font-serif text-2xl leading-snug text-foreground sm:text-3xl">
              {t.clientExperience.boundariesTitle}
            </h3>
            <p className="mt-5 max-w-2xl text-sm leading-[1.95] text-muted-foreground">
              {t.clientExperience.boundariesBody}
            </p>
          </div>

          <div className="bg-muted/50 px-6 py-8 md:px-8">
            <h3 className="label-luxe text-foreground">{t.clientExperience.privacyTitle}</h3>
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
              {t.clientExperience.privacyBody}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
