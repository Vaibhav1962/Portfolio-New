import { useEffect, useRef } from 'react';
import { IMG_H, IMG_W, spots } from './data';

interface Light { x: number; y: number; r: number; g: number; b: number; L: number; size: number; ph: number; sp: number; flick: boolean; off: number }
interface Star { x: number; y: number; r: number; ph: number; sp: number; m: number }

export default function CityCanvas({ paused = false }: { paused?: boolean }) {
  const ref = useRef<HTMLCanvasElement>(null);
  const pausedRef = useRef(paused);
  pausedRef.current = paused;

  useEffect(() => {
    const c = ref.current;
    if (!c) return;
    const ctx = c.getContext('2d');
    if (!ctx) return;
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    let k = 1, raf = 0, lights: Light[] = [], stars: Star[] = [], cancelled = false;
    const sprites: Record<string, HTMLCanvasElement> = {};

    const fit = () => {
      const dpr = Math.min(devicePixelRatio || 1, 1.5);
      const w = c.offsetWidth, h = c.offsetHeight;
      c.width = w * dpr; c.height = h * dpr; k = w / IMG_W;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    const ro = new ResizeObserver(fit);
    ro.observe(c);
    fit();

    const sprite = (r: number, g: number, b: number) => {
      const key = `${r >> 5}-${g >> 5}-${b >> 5}`;
      if (sprites[key]) return sprites[key];
      const sc = document.createElement('canvas');
      sc.width = sc.height = 64;
      const x = sc.getContext('2d')!;
      const gr = x.createRadialGradient(32, 32, 0, 32, 32, 32);
      gr.addColorStop(0, `rgba(${Math.min(255, r + 60)},${Math.min(255, g + 60)},${Math.min(255, b + 60)},1)`);
      gr.addColorStop(0.25, `rgba(${r},${g},${b},0.55)`);
      gr.addColorStop(1, `rgba(${r},${g},${b},0)`);
      x.fillStyle = gr; x.fillRect(0, 0, 64, 64);
      return (sprites[key] = sc);
    };

    const img = new Image();
    img.src = '/city.png';
    img.onload = () => {
      if (cancelled) return;
      const S = 4, sw = Math.round(IMG_W / S), sh = Math.round(IMG_H / S);
      const o = document.createElement('canvas');
      o.width = sw; o.height = sh;
      const oc = o.getContext('2d')!;
      oc.drawImage(img, 0, 0, sw, sh);
      const d = oc.getImageData(0, 0, sw, sh).data;
      const lum = (i: number) => 0.3 * d[i] + 0.59 * d[i + 1] + 0.11 * d[i + 2];
      const pts: { x: number; y: number; r: number; g: number; b: number; L: number }[] = [];

      for (let y = 1; y < sh - 1; y++) for (let x = 1; x < sw - 1; x++) {
        const i = (y * sw + x) * 4, L = lum(i);
        if (L < 175) continue;
        let peak = true;
        for (let yy = -1; yy <= 1 && peak; yy++) for (let xx = -1; xx <= 1; xx++) {
          if ((xx || yy) && lum(((y + yy) * sw + x + xx) * 4) > L) { peak = false; break; }
        }
        if (!peak) continue;
        const px = x * S, py = y * S;
        // skip the baked-in UI labels
        if (spots.some(s => px > s.x * 14.48 - 10 && px < (s.x + s.w) * 14.48 + 10 && py > s.y * 10.86 - 10 && py < (s.y + s.h) * 10.86 + 60)) continue;
        pts.push({ x: px, y: py, r: d[i], g: d[i + 1], b: d[i + 2], L });
      }

      const R = Math.random;
      for (let n = 0; n < 4000 && stars.length < 140; n++) {
        const x = (R() * sw) | 0, y = (R() * sh * 0.4) | 0, i = (y * sw + x) * 4;
        if (lum(i) > 55 || d[i + 2] > 95) continue;
        stars.push({ x: x * S, y: y * S, r: 0.5 + R() * 1.1, ph: R() * 6.28, sp: 0.6 + R() * 2, m: 0.25 + R() * 0.55 });
      }
      pts.sort((p, q) => q.L - p.L);
      lights = pts.slice(0, 420).map(p => ({
        ...p, size: 4 + (p.L - 175) / 80 * 9 + R() * 3,
        ph: R() * 6.28, sp: 0.4 + R() * 1.2, flick: R() < 0.1, off: 0,
      }));
    };

    const loop = (now: number) => {
      if (pausedRef.current) { raf = requestAnimationFrame(loop); return; }
      ctx.clearRect(0, 0, c.width, c.height);
      if (lights.length) {
        const t = now / 1000, R = Math.random;
        ctx.save();
        ctx.scale(k, k);
        for (const st of stars) {
          ctx.globalCompositeOperation = 'source-over';
          const tw = 0.5 + 0.5 * Math.sin(t * st.sp + st.ph);
          ctx.globalAlpha = st.m * tw * tw;
          ctx.fillStyle = '#dfe8ff';
          ctx.beginPath(); ctx.arc(st.x, st.y, st.r, 0, 7); ctx.fill();
          if (st.r > 1.3 && tw > 0.85) {
            ctx.globalAlpha *= 0.5;
            ctx.fillRect(st.x - st.r * 3, st.y - 0.3, st.r * 6, 0.6);
            ctx.fillRect(st.x - 0.3, st.y - st.r * 3, 0.6, st.r * 6);
          }
        }
        ctx.globalCompositeOperation = 'lighter';
        for (const p of lights) {
          let a = 0.12 + 0.3 * (0.5 + 0.5 * Math.sin(t * p.sp + p.ph));
          if (p.flick) {
            if (p.off > 0) { p.off--; a = 0; }
            else if (R() < 0.004) p.off = 2 + ((R() * 6) | 0);
            else a = 0.45;
          }
          ctx.globalAlpha = a;
          ctx.drawImage(sprite(p.r, p.g, p.b), p.x - p.size, p.y - p.size, p.size * 2, p.size * 2);
        }
        ctx.restore();
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    return () => { cancelled = true; cancelAnimationFrame(raf); ro.disconnect(); };
  }, []);

  return <canvas ref={ref} className="fill no-pointer" aria-hidden="true" />;
}
