'use client';

import dynamic from 'next/dynamic';
import { useEffect, useRef, useState } from 'react';

// React Bits <LightRays/> — ca nocturna de pe stadion. Se încarcă doar în browser, după HTML (nu blochează LCP).
const LightRays = dynamic(() => import('./reactbits/LightRays'), { ssr: false });

/**
 * Poze din meciuri pentru fundalul hero — se schimbă singure, cu fade lin.
 *
 * Pentru fiecare poză:
 *   face: unde e subiectul (fețele) în poză, în procente din lățime/înălțime
 *   d:    pe desktop — unde să ajungă subiectul pe ecran (x, y în %) și cât de mult mărim (zoom)
 *   m:    la fel, pe telefon
 * Pe desktop subiectul e pus în „fereastra” liberă dintre titlu și cardul „Următorul meci”.
 */
type Spot = { x: number; y: number; zoom: number };
type Photo = { n: number; face: [number, number]; d: Spot; m: Spot };

const D: Spot = { x: 52, y: 40, zoom: 1.15 };
const M: Spot = { x: 62, y: 30, zoom: 1 };

const PHOTOS: Photo[] = [
  { n: 3, face: [48, 31], d: D, m: M }, // bucuria de pe bancă
  { n: 2, face: [50, 13], d: { ...D, x: 55, y: 40, zoom: 1.6 }, m: { ...M, x: 55, zoom: 1.15 } }, // duel
  { n: 9, face: [46, 30], d: D, m: { ...M, x: 58 } }, // tricourile Banu Sport
  { n: 5, face: [59, 27], d: { ...D, zoom: 1.25 }, m: { ...M, zoom: 1.1 } }, // gol
  { n: 11, face: [45, 24], d: D, m: M }, // echipa zâmbind
  { n: 1, face: [49, 22], d: { ...D, zoom: 1.3 }, m: { ...M, zoom: 1.1 } }, // dribling
  { n: 10, face: [53, 21], d: { ...D, zoom: 1.3 }, m: { ...M, zoom: 1.15 } }, // îmbrățișare
  { n: 4, face: [50, 14], d: { ...D, y: 34 }, m: { ...M, y: 24 } }, // aplauze
  { n: 7, face: [51, 16], d: { ...D, y: 34 }, m: { ...M, y: 24 } }, // la margine
  { n: 8, face: [40, 19], d: { ...D, x: 54, y: 38, zoom: 1.4 }, m: { ...M, x: 55, y: 26, zoom: 1.15 } }, // antrenorul
  { n: 12, face: [47, 25], d: D, m: M }, // „La mulți ani, căpitane!”
  { n: 6, face: [55, 22], d: { ...D, y: 40, zoom: 1.35 }, m: { ...M, x: 52, y: 26 } } // suporterii
];
const IMG_W = 1400;
const IMG_H = 933;
const src = (n: number) => `/hero/meci-${String(n).padStart(2, '0')}.webp`;
const SLIDE_MS = 7000;
const FADE_MS = 2500;

/** Poziția și mărimea pozei ca subiectul să ajungă unde vrem, fără margini goale */
function place(p: Photo, W: number, H: number) {
  const spot = W >= 1024 ? p.d : p.m;
  const s = Math.max(W / IMG_W, H / IMG_H) * spot.zoom;
  const w = IMG_W * s;
  const h = IMG_H * s;
  const fx = (p.face[0] / 100) * w;
  const fy = (p.face[1] / 100) * h;
  const left = Math.min(0, Math.max(W - w, (spot.x / 100) * W - fx));
  const top = Math.min(0, Math.max(H - h, (spot.y / 100) * H - fy));
  return { left, top, width: w, height: h, origin: `${fx}px ${fy}px` };
}

export default function HeroBackground() {
  const [{ current, prev }, setSlide] = useState({ current: 0, prev: -1 });
  const box = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState<{ W: number; H: number } | null>(null);

  useEffect(() => {
    const el = box.current;
    if (!el) return;
    const ro = new ResizeObserver(([e]) => setSize({ W: e.contentRect.width, H: e.contentRect.height }));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    // pentru verificare: ?slide=5 arată direct poza a 5-a și oprește schimbarea
    const forced = Number(new URLSearchParams(window.location.search).get('slide'));
    if (forced >= 1 && forced <= PHOTOS.length) return setSlide({ current: forced - 1, prev: -1 });
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const t = setInterval(() => setSlide(s => ({ current: (s.current + 1) % PHOTOS.length, prev: s.current })), SLIDE_MS);
    return () => clearInterval(t);
  }, []);

  const next = (current + 1) % PHOTOS.length;

  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
      {/* pozele din meciuri: cea nouă apare lin PESTE cea veche (fără „clipire” întunecată) */}
      <div ref={box} className="absolute inset-0 isolate overflow-hidden bg-navy-950">
        {size &&
          PHOTOS.map((p, i) => {
            const isCurrent = i === current;
            const isPrev = i === prev;
            if (!isCurrent && !isPrev && i !== next) return null; // încărcăm doar ce trebuie
            const pos = place(p, size.W, size.H);
            return (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                key={p.n}
                src={src(p.n)}
                alt=""
                fetchPriority={i === 0 ? 'high' : 'low'}
                style={{
                  left: pos.left,
                  top: pos.top,
                  width: pos.width,
                  height: pos.height,
                  transformOrigin: pos.origin,
                  transitionProperty: 'opacity, transform',
                  transitionTimingFunction: 'ease-in-out, linear',
                  transitionDuration: isCurrent ? `${FADE_MS}ms, ${SLIDE_MS + FADE_MS}ms` : '0ms, 0ms'
                }}
                className={`absolute max-w-none will-change-[opacity,transform] ${
                  isCurrent ? 'z-20 scale-[1.04] opacity-100' : isPrev ? 'z-10 scale-[1.04] opacity-100' : 'z-0 scale-100 opacity-0'
                }`}
              />
            );
          })}
      </div>
      {/* voal albastru-închis peste poze, ca textul să se citească */}
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(6,22,48,.92)_0%,rgba(6,22,48,.78)_36%,rgba(6,22,48,.3)_52%,rgba(6,22,48,.45)_100%)] max-lg:bg-[linear-gradient(180deg,rgba(6,22,48,.55)_0%,rgba(6,22,48,.7)_100%)]" />
      <div className="absolute inset-0 bg-gradient-to-b from-navy-950/60 via-transparent to-transparent" />
      {/* fallback static (fără JS / reduced motion) */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_55%_at_50%_-10%,rgba(162,198,224,.35),transparent_70%)]" />
      <div className="absolute inset-0">
        <LightRays
          raysOrigin="top-center"
          raysColor="#cfe3f5"
          raysSpeed={0.6}
          lightSpread={0.9}
          rayLength={1.6}
          intensity={0.9}
          followMouse={false}
          cursorShadow={false}
          clickPulse={false}
          haze={0.15}
          opacity={0.75}
        />
      </div>
      <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-navy-950 to-transparent" />
    </div>
  );
}
