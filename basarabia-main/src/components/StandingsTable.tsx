'use client';

/* eslint-disable @next/next/no-img-element */
import { useCallback, useEffect, useState } from 'react';
import { club, standings, standingsRound, isOurs } from '@/data/club';
import { lastForm, type FormItem, type LeagueMatch } from '@/data/league';

const dot = {
  V: 'bg-emerald-500/90 text-white ring-emerald-300/40',
  E: 'bg-slate-400/70 text-navy-950 ring-slate-200/40',
  Î: 'bg-rose-500/85 text-white ring-rose-300/40'
} as const;
const label = { V: 'Victorie', E: 'Egal', Î: 'Înfrângere' } as const;

type Active = { match: LeagueMatch; result: FormItem['result']; team: string; x: number; y: number; key: string };

const shortDate = (iso: string) =>
  new Date(iso + 'T12:00:00').toLocaleDateString('ro-RO', { day: '2-digit', month: 'short' }).replace('.', '');

export default function StandingsTable() {
  const [active, setActive] = useState<Active | null>(null);

  const show = useCallback((e: React.SyntheticEvent<HTMLButtonElement>, team: string, f: FormItem, key: string) => {
    const r = e.currentTarget.getBoundingClientRect();
    setActive({ match: f.match, result: f.result, team, x: r.left + r.width / 2, y: r.top, key });
  }, []);
  const hide = useCallback(() => setActive(null), []);

  // tooltip-ul e „fixed”: îl ascundem la scroll ca să nu rămână în aer
  useEffect(() => {
    if (!active) return;
    const h = () => setActive(null);
    window.addEventListener('scroll', h, { passive: true, capture: true });
    return () => window.removeEventListener('scroll', h, { capture: true });
  }, [active]);

  const involved = active ? [active.match.home, active.match.away] : [];

  return (
    <>
      <div className="overflow-x-auto rounded-3xl ring-1 ring-white/10" onMouseLeave={hide}>
        <table className="w-full min-w-[720px] text-left text-sm tabular-nums">
          <caption className="sr-only">
            Clasament {club.league} după etapa {standingsRound}, cu forma din ultimele 5 meciuri
          </caption>
          <thead className="bg-navy-900 text-[11px] font-bold uppercase tracking-[.16em] text-muted">
            <tr>
              <th scope="col" className="w-12 px-4 py-3 text-center">#</th>
              <th scope="col" className="px-2 py-3">Echipa</th>
              <th scope="col" className="px-2 py-3 text-center" title="Meciuri">M</th>
              <th scope="col" className="px-2 py-3 text-center" title="Victorii">V</th>
              <th scope="col" className="px-2 py-3 text-center" title="Egaluri">E</th>
              <th scope="col" className="px-2 py-3 text-center" title="Înfrângeri">Î</th>
              <th scope="col" className="px-2 py-3 text-center" title="Goluri marcate:primite">Golaveraj</th>
              <th scope="col" className="px-2 py-3 text-center">Ultimele 5</th>
              <th scope="col" className="px-4 py-3 text-center">Pct</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {standings.map((row, i) => {
              const ours = isOurs(row.team);
              const zone = i < 3 ? 'bg-emerald-400' : i === 3 ? 'bg-sky' : '';
              const hit = involved.includes(row.team);
              const dim = active && !hit;
              const form = lastForm(row.team);
              return (
                <tr
                  key={row.team}
                  aria-current={ours ? 'true' : undefined}
                  className={`transition-[background-color,opacity] duration-200 ${
                    hit
                      ? 'bg-sky/15 font-semibold text-white shadow-[inset_3px_0_0_#A2C6E0]'
                      : ours
                        ? 'bg-brand/20 font-bold text-white'
                        : 'text-ink/85 hover:bg-white/[.03]'
                  } ${dim ? 'opacity-40' : ''}`}
                >
                  <td className="relative px-4 py-3 text-center">
                    {zone && <span className={`absolute inset-y-2 left-0 w-1 rounded-r ${zone}`} aria-hidden="true" />}
                    {i + 1}
                  </td>
                  <th scope="row" className="px-2 py-3 font-semibold">
                    <span className="flex items-center gap-2">
                      {ours && <img src="/logo-128.webp" width={22} height={22} alt="" className="shrink-0" />}
                      {row.team}
                    </span>
                  </th>
                  <td className="px-2 py-3 text-center">{row.p}</td>
                  <td className="px-2 py-3 text-center">{row.w}</td>
                  <td className="px-2 py-3 text-center">{row.d}</td>
                  <td className="px-2 py-3 text-center">{row.l}</td>
                  <td className="px-2 py-3 text-center">
                    {row.gf}:{row.ga}
                  </td>
                  <td className="px-2 py-2">
                    <ol className="flex items-center justify-center gap-1.5" aria-label={`Forma ${row.team}, de la cel mai vechi la cel mai recent meci`}>
                      {form.map(f => {
                        const key = `${row.team}-${f.match.round}`;
                        const m = f.match;
                        return (
                          <li key={key}>
                            <button
                              type="button"
                              className={`grid h-6 w-6 place-items-center rounded-full text-[10px] font-extrabold ring-1 transition-transform duration-150 hover:scale-125 focus-visible:scale-125 ${dot[f.result]} ${
                                hit && active?.match.round === m.round ? 'scale-125 ring-2 ring-white' : ''
                              }`}
                              aria-label={`${label[f.result]}: etapa ${m.round}, ${m.home} ${m.hg}–${m.ag} ${m.away}`}
                              onMouseEnter={e => show(e, row.team, f, key)}
                              onFocus={e => show(e, row.team, f, key)}
                              onBlur={hide}
                              onClick={e => (active?.key === key ? hide() : show(e, row.team, f, key))}
                            >
                              {f.result}
                            </button>
                          </li>
                        );
                      })}
                    </ol>
                  </td>
                  <td className="display px-4 py-3 text-center text-xl text-white">{row.pts}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {active && (
        <div
          role="tooltip"
          className="pointer-events-none fixed z-[60] w-64 -translate-x-1/2 -translate-y-full rounded-2xl bg-navy-800/95 p-4 text-sm shadow-[0_20px_50px_-15px_rgba(0,0,0,.8)] ring-1 ring-sky/25 backdrop-blur-md"
          style={{ left: Math.min(Math.max(active.x, 140), (typeof window !== 'undefined' ? window.innerWidth : 1000) - 140), top: active.y - 10 }}
        >
          <p className="flex items-center justify-between text-[10px] font-bold uppercase tracking-[.18em] text-muted">
            <span>
              Etapa {active.match.round} · {shortDate(active.match.date)}
            </span>
            <span className={`rounded-full px-2 py-0.5 ${dot[active.result]}`}>{label[active.result]}</span>
          </p>
          <div className="mt-3 grid grid-cols-[1fr_auto] items-center gap-x-3 gap-y-1.5">
            {[
              [active.match.home, active.match.hg],
              [active.match.away, active.match.ag]
            ].map(([t, g]) => (
              <div key={t as string} className="contents">
                <span className={`truncate ${t === active.team ? 'font-bold text-white' : 'text-ink/80'}`}>{t}</span>
                <span className="display text-2xl leading-none text-white">{g}</span>
              </div>
            ))}
          </div>
          <span className="absolute -bottom-1.5 left-1/2 h-3 w-3 -translate-x-1/2 rotate-45 bg-navy-800 ring-1 ring-sky/25 [clip-path:polygon(100%_0,100%_100%,0_100%)]" aria-hidden="true" />
        </div>
      )}
    </>
  );
}
