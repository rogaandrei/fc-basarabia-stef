'use client';

import { useEffect, useState } from 'react';

function parts(ms: number) {
  const s = Math.max(0, Math.floor(ms / 1000));
  return { zile: Math.floor(s / 86400), ore: Math.floor((s % 86400) / 3600), min: Math.floor((s % 3600) / 60), sec: s % 60 };
}

export default function Countdown({ to }: { to: string }) {
  const [now, setNow] = useState<number | null>(null);

  useEffect(() => {
    setNow(Date.now());
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  const target = new Date(to).getTime();
  const p = now === null ? null : parts(target - now);
  const live = now !== null && target - now <= 0;

  if (live) {
    return <p className="display text-center text-3xl text-sky">Meciul a început — Hai, FC Basarabia!</p>;
  }

  return (
    <dl className="grid grid-cols-4 gap-2" aria-live="off">
      {(['zile', 'ore', 'min', 'sec'] as const).map(k => (
        <div key={k} className="flex flex-col-reverse rounded-xl bg-navy-950/60 px-2 py-3 text-center ring-1 ring-sky/10">
          <dt className="mt-1 text-[10px] font-bold uppercase tracking-[.2em] text-muted">{k}</dt>
          <dd className="display text-3xl tabular-nums text-white sm:text-4xl">{p ? String(p[k]).padStart(2, '0') : '--'}</dd>
        </div>
      ))}
    </dl>
  );
}
