import { useEffect, useRef, type RefObject } from 'react';

const reduced = () => matchMedia('(prefers-reduced-motion: reduce)').matches;

/** Neon cursors: cyan arrow by default, magenta reticle over clickables. */
export function useNeonCursor(enabled: boolean) {
  useEffect(() => {
    if (!enabled) return;
    const glow = "<defs><filter id='g' x='-50%' y='-50%' width='200%' height='200%'><feGaussianBlur stdDeviation='1.3' result='b'/><feMerge><feMergeNode in='b'/><feMergeNode in='SourceGraphic'/></feMerge></filter></defs>";
    const svg = (b: string) =>
      'url("data:image/svg+xml,' + encodeURIComponent(`<svg xmlns='http://www.w3.org/2000/svg' width='32' height='32' viewBox='0 0 32 32'>${glow}${b}</svg>`) + '")';
    const arrow = svg("<path d='M6 4L6 24L11 19.5L14.5 27L18 25.5L14.5 18L21 18Z' fill='rgba(5,6,15,0.8)' stroke='#5ff3ff' stroke-width='1.6' stroke-linejoin='round' filter='url(#g)'/>");
    const sel = svg("<g fill='none' stroke='#ff4fb8' stroke-width='2.2' stroke-linecap='round' filter='url(#g)'><path d='M7 12V7h5M20 7h5v5M25 20v5h-5M12 25H7v-5'/></g><circle cx='16' cy='16' r='2.4' fill='#ff4fb8' filter='url(#g)'/>");
    const st = document.createElement('style');
    st.textContent =
      `html[data-neon-cursor],html[data-neon-cursor] *{cursor:${arrow} 6 4, auto !important}` +
      `html[data-neon-cursor] :is(a,button,[role=button]),html[data-neon-cursor] :is(a,button) *{cursor:${sel} 16 16, pointer !important}`;
    document.head.appendChild(st);
    document.documentElement.setAttribute('data-neon-cursor', '');
    return () => { st.remove(); document.documentElement.removeAttribute('data-neon-cursor'); };
  }, [enabled]);
}

/** Random card glitch while a panel is open. `active` must be true only when the panel is fully open and not swapping. */
export function useCardGlitch(enabled: boolean, active: boolean) {
  const activeRef = useRef(active);
  activeRef.current = active;

  useEffect(() => {
    if (!enabled || reduced()) return;
    const R = Math.random;
    const timers = new Set<number>();
    let stopped = false;

    const glitch = () => {
      if (!activeRef.current) return;
      const els = [...document.querySelectorAll<HTMLElement>('[data-glitch]')].filter(e => e.offsetParent);
      if (!els.length) return;
      const el = els[(R() * els.length) | 0];
      const clean = { transform: 'none', clipPath: 'inset(0 0 0 0)', filter: 'none', easing: 'steps(1,end)' };
      const frames: Keyframe[] = [clean];
      for (let i = 0, n = 2 + ((R() * 5) | 0); i < n; i++) {
        const t = (R() * 80) | 0, b = Math.max(0, (100 - t - 6 - R() * 40) | 0), sx = (R() * 4 + 1).toFixed(1);
        frames.push({
          transform: `translate(${((R() - 0.5) * 14).toFixed(1)}px,${((R() - 0.5) * 3).toFixed(1)}px)`,
          clipPath: R() < 0.6 ? `inset(${t}% 0 ${b}% 0)` : 'inset(0 0 0 0)',
          filter: `drop-shadow(${sx}px 0 0 rgba(255,79,184,0.85)) drop-shadow(-${sx}px 0 0 rgba(95,243,255,0.85))`,
          easing: 'steps(1,end)',
        });
      }
      frames.push(clean);
      el.animate(frames, { duration: 140 + R() * 260 });
    };

    const later = (fn: () => void, ms: number) => {
      const id = window.setTimeout(() => { timers.delete(id); fn(); }, ms);
      timers.add(id);
    };
    const tick = () => {
      later(() => {
        if (stopped) return;
        glitch();
        if (R() < 0.25) later(glitch, 60 + R() * 140);
        tick();
      }, 700 + R() * R() * 6500);
    };
    tick();
    return () => { stopped = true; timers.forEach(clearTimeout); };
  }, [enabled]);
}

/** Random flicker burst on a single glyph of the neon sign. */
export function useSignFlicker(ref: RefObject<HTMLElement>) {
  useEffect(() => {
    if (reduced()) return;
    const R = Math.random;
    let id = 0;
    const tick = () => {
      id = window.setTimeout(() => {
        const el = ref.current;
        if (el) {
          const f: Keyframe[] = [{ opacity: 1 }];
          for (let i = 0, n = 2 + ((R() * 6) | 0); i < n; i++) f.push({ opacity: i % 2 ? 1 : 0.12 + R() * 0.2 }, { opacity: i % 2 ? 1 : 0.12 });
          f.push({ opacity: 1 });
          el.animate(f.map(k => ({ ...k, easing: 'steps(1,end)' })), { duration: 250 + R() * 700 });
          if (R() < 0.15) el.animate([{ opacity: 0.1 }, { opacity: 0.1 }, { opacity: 1 }], { duration: 1200 + R() * 1500, easing: 'steps(1,end)' });
        }
        tick();
      }, 1500 + R() * 7000);
    };
    tick();
    return () => clearTimeout(id);
  }, [ref]);
}
