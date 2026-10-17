'use client';

import dynamic from 'next/dynamic';

// React Bits <LightRays/> — ca nocturna de pe stadion. Se încarcă doar în browser, după HTML (nu blochează LCP).
const LightRays = dynamic(() => import('./reactbits/LightRays'), { ssr: false });

export default function HeroBackground() {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
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
      {/* marcajele terenului */}
      <svg className="absolute inset-x-0 bottom-0 h-[46%] w-full" viewBox="0 0 1440 400" preserveAspectRatio="xMidYMax slice" fill="none" stroke="rgba(162,198,224,.14)" strokeWidth="2">
        <line x1="0" y1="398" x2="1440" y2="398" />
        <circle cx="720" cy="398" r="170" />
        <circle cx="720" cy="398" r="5" fill="rgba(162,198,224,.25)" />
        <rect x="-2" y="140" width="240" height="258" />
        <rect x="1202" y="140" width="240" height="258" />
      </svg>
      <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-navy-950 to-transparent" />
    </div>
  );
}
