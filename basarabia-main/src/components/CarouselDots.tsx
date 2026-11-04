'use client';

import { useEffect, useState } from 'react';

/** Punctele de sub carousel (doar pe telefon): arată cardul curent; click pe un punct duce la card */
export default function CarouselDots({ target, count, label }: { target: string; count: number; label: string }) {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const el = document.getElementById(target);
    if (!el) return;
    const update = () => {
      const items = Array.from(el.children) as HTMLElement[];
      const x = el.scrollLeft + 16;
      let best = 0;
      items.forEach((it, i) => {
        if (Math.abs(it.offsetLeft - x) < Math.abs(items[best].offsetLeft - x)) best = i;
      });
      // la capătul din dreapta, ultimul card e cel activ
      if (el.scrollLeft + el.clientWidth >= el.scrollWidth - 4) best = items.length - 1;
      setActive(best);
    };
    update();
    el.addEventListener('scroll', update, { passive: true });
    return () => el.removeEventListener('scroll', update);
  }, [target]);

  if (count < 2) return null;

  const goTo = (i: number) => {
    const el = document.getElementById(target);
    const it = el?.children[i] as HTMLElement | undefined;
    if (el && it) el.scrollTo({ left: it.offsetLeft - 16, behavior: 'smooth' });
  };

  return (
    <div className="mt-4 flex justify-center gap-2 sm:hidden" role="tablist" aria-label={label}>
      {Array.from({ length: count }, (_, i) => (
        <button
          key={i}
          type="button"
          role="tab"
          aria-selected={i === active}
          aria-label={`${i + 1} / ${count}`}
          onClick={() => goTo(i)}
          className={`h-2 rounded-full transition-all duration-300 ${i === active ? 'w-6 bg-sky' : 'w-2 bg-white/25'}`}
        />
      ))}
    </div>
  );
}
