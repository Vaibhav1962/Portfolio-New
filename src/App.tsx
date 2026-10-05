import { useCallback, useEffect, useRef, useState, type CSSProperties } from 'react';
import CityCanvas from './CityCanvas';
import SectionContent from './Sections';
import { ZOOM, signs, spots, type SectionId, type Spot } from './data';

type Phase = 'idle' | 'zoom' | 'open' | 'closing';

const Icon = ({ d, color, size }: { d: string; color: string; size: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d={d} />
  </svg>
);

const idFromHash = (): SectionId | null => {
  const h = location.hash.slice(1);
  return spots.some(s => s.id === h) ? (h as SectionId) : null;
};

export default function App() {
  const [active, setActive] = useState<SectionId | null>(null);
  const [phase, setPhase] = useState<Phase>('idle');
  const [swap, setSwap] = useState(false);
  const timer = useRef<number>();
  const parallax = useRef<HTMLDivElement>(null);
  const lastTrigger = useRef<HTMLElement | null>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  const cur: Spot = spots.find(s => s.id === active) ?? spots[0];
  const zoomed = phase === 'zoom' || phase === 'open';
  const shown = phase === 'open';

  const open = useCallback((id: SectionId) => {
    if (phase !== 'idle') return;
    lastTrigger.current = document.activeElement as HTMLElement | null;
    setActive(id); setPhase('zoom');
    history.replaceState(null, '', `#${id}`);
    clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setPhase('open'), 650);
  }, [phase]);

  const jump = (id: SectionId) => {
    if (id === active) return;
    setSwap(true);
    history.replaceState(null, '', `#${id}`);
    clearTimeout(timer.current);
    timer.current = window.setTimeout(() => { setActive(id); setSwap(false); }, 180);
  };

  const close = useCallback(() => {
    if (phase !== 'open') return;
    setPhase('closing');
    history.replaceState(null, '', location.pathname);
    clearTimeout(timer.current);
    timer.current = window.setTimeout(() => {
      setPhase('idle'); setActive(null);
      lastTrigger.current?.focus?.();
    }, 900);
  }, [phase]);

  // deep link on first load
  useEffect(() => {
    const id = idFromHash();
    if (id) { setActive(id); setPhase('zoom'); timer.current = window.setTimeout(() => setPhase('open'), 650); }
    return () => clearTimeout(timer.current);
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close();
      if (e.key === 'Tab' && shown && panelRef.current) {
        const f = panelRef.current.querySelectorAll<HTMLElement>('a[href],button');
        if (!f.length) return;
        const first = f[0], last = f[f.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
        else if (!panelRef.current.contains(document.activeElement)) { e.preventDefault(); first.focus(); }
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [close, shown]);

  useEffect(() => { if (shown) panelRef.current?.focus(); }, [shown]);

  useEffect(() => {
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const onMove = (e: MouseEvent) => {
      const el = parallax.current;
      if (!el) return;
      const dx = e.clientX / innerWidth - 0.5, dy = e.clientY / innerHeight - 0.5;
      el.style.transform = `scale(1.04) translate(${-dx * 22}px, ${-dy * 14}px)`;
    };
    window.addEventListener('mousemove', onMove);
    return () => window.removeEventListener('mousemove', onMove);
  }, []);

  const idle = phase === 'idle';
  const accentVars = { '--accent': cur.color, '--accent-glow': cur.color + '55', '--accent-border': cur.color + '99' } as CSSProperties;

  return (
    <div className="root" style={accentVars}>
      <div className="scene">
        <div ref={parallax} className="fill parallax">
          <div
            className="fill zoomwrap"
            style={{
              transformOrigin: `${cur.ox}% ${cur.oy}%`,
              transform: `scale(${zoomed ? ZOOM : 1})`,
            }}
          >
            <img src="/city.png" alt="Neon cyberpunk city skyline" className="fill city" draggable={false} />
            <div className={`fill no-pointer glows${idle ? '' : ' paused'}`} aria-hidden="true">
              {signs.map(([x, y, w, h, col, anim, dur], i) => (
                <div
                  key={i}
                  style={{
                    position: 'absolute',
                    left: `${(x - w * 0.6) / 14.48}%`, top: `${(y - h * 0.35) / 10.86}%`,
                    width: `${(w * 2.2) / 14.48}%`, height: `${(h * 1.7) / 10.86}%`,
                    background: `radial-gradient(ellipse at center, ${col}99 0%, ${col}38 40%, transparent 70%)`,
                    filter: 'blur(10px)',
                    animation: `${anim} ${dur}s ease-in-out ${-(i * 1.3)}s infinite`,
                  }}
                />
              ))}
            </div>
            <CityCanvas paused={!idle} />
            {spots.map(s => (
              <button
                key={s.id}
                className="hotspot"
                aria-label={s.label}
                tabIndex={idle ? 0 : -1}
                onClick={() => open(s.id)}
                style={{
                  left: `${s.x}%`, top: `${s.y}%`, width: `${s.w}%`, height: `${s.h}%`,
                  opacity: idle ? 1 : 0, pointerEvents: idle ? 'auto' : 'none', '--c': s.color,
                } as CSSProperties}
              />
            ))}
          </div>
        </div>
      </div>

      <div className="fill no-pointer dim" style={{ opacity: shown ? 0.55 : zoomed ? 0.25 : 0 }} />
      <div className="fill no-pointer vignette" />
      <div className="fill no-pointer flash" style={{ opacity: phase === 'zoom' || swap ? 0.18 : 0 }} />

      <div className="hud" style={{ opacity: idle ? 1 : 0, pointerEvents: idle ? 'auto' : 'none' }} aria-hidden={!idle}>
        <div className="col gap6 mb8 no-pointer">
          <h1 className="name">VAIBHAV SINGH</h1>
          <div className="subtitle">BACKEND ENGINEER // NOIDA, IN</div>
        </div>
        <div className="select">SELECT A NODE<span className="blink"> _</span></div>
        <nav className="wrap gap8" aria-label="Sections">
          {spots.map(s => (
            <button key={s.id} className="navbtn" style={{ '--c': s.color } as CSSProperties} tabIndex={idle ? 0 : -1} onClick={() => open(s.id)}>
              <Icon d={s.icon} color={s.color} size={14} />
              <span style={{ color: s.color }}>{s.num}.</span>{s.label}
            </button>
          ))}
        </nav>
      </div>

      <div className="overlay" style={{ pointerEvents: shown ? 'auto' : 'none' }} onClick={close}>
        <div
          ref={panelRef}
          tabIndex={-1}
          role="dialog"
          aria-modal="true"
          aria-label={cur.label}
          aria-hidden={!shown}
          className="panel"
          onClick={e => e.stopPropagation()}
          style={{
            clipPath: shown ? 'inset(0 0 0 0)' : 'inset(50% 0 50% 0)',
            opacity: shown ? 1 : 0,
            transform: shown ? 'scale(1)' : 'scale(0.96)',
            backdropFilter: shown ? undefined : 'none',
            willChange: shown ? undefined : 'clip-path, transform, opacity',
          }}
        >
          <span className="corner tl" /><span className="corner tr" /><span className="corner bl" /><span className="corner br" />
          <div className="panel-head">
            <div className="row center gap16 minw0">
              <div className="chip-label">
                <Icon d={cur.icon} color={cur.color} size={16} />
                <span style={{ color: cur.color }}>{cur.num}.</span><span className="chip-name">{cur.label}</span>
              </div>
              <span className="kana">{cur.kana}</span>
            </div>
            <button className="closebtn" onClick={close}><span className="esc">ESC</span>CLOSE</button>
          </div>
          <div className="divider" />
          <div className="panel-body cp-scroll" style={{ opacity: swap ? 0 : 1 }}>
            {active && <SectionContent id={active} />}
          </div>
          <div className="panel-foot">
            {spots.map(s => (
              <button
                key={s.id}
                className="footbtn"
                style={{ '--c': s.color, color: s.id === active ? s.color : '#8b93b8', borderColor: s.id === active ? s.color : 'rgba(255,255,255,.15)' } as CSSProperties}
                onClick={() => jump(s.id)}
              >
                <Icon d={s.icon} color={s.color} size={13} />
                <span style={{ whiteSpace: 'nowrap' }}>{s.num}. {s.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
