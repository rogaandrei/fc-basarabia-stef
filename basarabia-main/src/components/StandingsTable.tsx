'use client';

/* eslint-disable @next/next/no-img-element */
import { useCallback, useEffect, useState } from 'react';
import { standings, standingsRound, isOurs, ZONES, type Zone } from '@/data/club';
import { t, LOCALE, type Lang } from '@/i18n/dict';
import { lastForm, type FormItem, type LeagueMatch } from '@/data/league';

const dot = {
  V: 'bg-emerald-500/90 text-white ring-emerald-300/40',
  E: 'bg-slate-400/70 text-navy-950 ring-slate-200/40',
  Î: 'bg-rose-500/85 text-white ring-rose-300/40'
} as const;

type Active = { match: LeagueMatch; result: FormItem['result']; team: string; x: number; y: number; key: string };

const shortDate = (iso: string, lang: Lang) =>
  new Date(iso + 'T12:00:00').toLocaleDateString(LOCALE[lang], { day: '2-digit', month: 'short' }).replace('.', '');

/** Locurile dintr-o zonă, ex. „locurile 1–3”, „locul 4” */
function places(zone: Zone, lang: Lang) {
  const idx = standings.map((r, i) => (r.zone === zone ? i + 1 : 0)).filter(Boolean);
  if (!idx.length) return '';
  const a = idx[0];
  const b = idx[idx.length - 1];
  return a === b ? t(lang).standings.place(a) : t(lang).standings.places(a, b);
}

export default function StandingsTable({ lang = 'ro' }: { lang?: Lang }) {
  const d = t(lang);
  const S = d.standings;
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
  const zonesShown = (Object.keys(ZONES) as Zone[]).filter(z => standings.some(r => r.zone === z));

  return (
    <>
      <div className="overflow-x-auto rounded-3xl ring-1 ring-white/10" onMouseLeave={hide}>
        <table className="w-full min-w-[720px] text-left text-sm tabular-nums">
          <caption className="sr-only">
            {S.caption(d.league, standingsRound)}
          </caption>
          <thead className="bg-navy-900 text-[11px] font-bold uppercase tracking-[.16em] text-muted">
            <tr>
              <th scope="col" className="w-12 px-4 py-3 text-center">#</th>
              <th scope="col" className="px-2 py-3">{S.cols.team}</th>
              <th scope="col" className="px-2 py-3 text-center" title={S.colTitles.p}>{S.cols.p}</th>
              <th scope="col" className="px-2 py-3 text-center" title={S.colTitles.w}>{S.cols.w}</th>
              <th scope="col" className="px-2 py-3 text-center" title={S.colTitles.d}>{S.cols.d}</th>
              <th scope="col" className="px-2 py-3 text-center" title={S.colTitles.l}>{S.cols.l}</th>
              <th scope="col" className="px-2 py-3 text-center" title={S.colTitles.goals}>{S.cols.goals}</th>
              <th scope="col" className="px-2 py-3 text-center">{S.cols.form}</th>
              <th scope="col" className="px-4 py-3 text-center">{S.cols.pts}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {standings.map((row, i) => {
              const ours = isOurs(row.team);
              const zone = row.zone ? ZONES[row.zone] : null;
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
                        : `${zone?.tint ?? ''} text-ink/85 hover:bg-white/[.03]`
                  } ${dim ? 'opacity-40' : ''}`}
                >
                  <td className="relative px-4 py-3 text-center">
                    {zone && <span className={`absolute inset-y-1.5 left-0 w-1.5 rounded-r ${zone.bar}`} aria-hidden="true" />}
                    {i + 1}
                    {row.zone && <span className="sr-only"> ({S.zones[row.zone]})</span>}
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
                    <ol className="flex items-center justify-center gap-1.5" aria-label={S.formAria(row.team)}>
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
                              aria-label={`${d.outcome[f.result]}: ${S.tooltipRound(m.round, shortDate(m.date, lang))}, ${m.home} ${m.hg}–${m.ag} ${m.away}`}
                              onMouseEnter={e => show(e, row.team, f, key)}
                              onFocus={e => show(e, row.team, f, key)}
                              onBlur={hide}
                              onClick={e => (active?.key === key ? hide() : show(e, row.team, f, key))}
                            >
                              {d.outcomeLetter[f.result]}
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

      {/* Legenda culorilor */}
      <ul className="mt-5 grid grid-cols-2 gap-2 sm:gap-3 lg:grid-cols-4" aria-label={S.legendAria}>
        {zonesShown.map(z => (
          <li key={z} className="flex items-center gap-3 rounded-2xl bg-white/[.03] px-3 py-3 ring-1 ring-white/10 sm:px-4">
            <span className={`h-8 w-1.5 shrink-0 rounded ${ZONES[z].bar}`} aria-hidden="true" />
            <span className="text-sm leading-tight">
              <span className="block text-[13px] font-semibold text-white sm:text-sm">{S.zones[z]}</span>
              <span className="block text-xs capitalize text-muted">{places(z, lang)}</span>
            </span>
          </li>
        ))}
      </ul>
      <p className="mt-3 text-xs text-muted">{S.formNote}</p>

      {active && (
        <div
          role="tooltip"
          className="pointer-events-none fixed z-[60] w-64 -translate-x-1/2 -translate-y-full rounded-2xl bg-navy-800/95 p-4 text-sm shadow-[0_20px_50px_-15px_rgba(0,0,0,.8)] ring-1 ring-sky/25 backdrop-blur-md"
          style={{ left: Math.min(Math.max(active.x, 140), (typeof window !== 'undefined' ? window.innerWidth : 1000) - 140), top: active.y - 10 }}
        >
          <p className="flex items-center justify-between text-[10px] font-bold uppercase tracking-[.18em] text-muted">
            <span>
              {S.tooltipRound(active.match.round, shortDate(active.match.date, lang))}
            </span>
            <span className={`rounded-full px-2 py-0.5 ${dot[active.result]}`}>{d.outcome[active.result]}</span>
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
