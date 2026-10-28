'use client';

import { useEffect, useRef, useState } from 'react';
import { leagueScorersCount, type Player, type Result } from '@/data/club';
import { t, LOCALE, goalsWord, type Lang } from '@/i18n/dict';

/** „Danu Garbuz” → „Garbuz Danu” (numele de familie primul) */
const surnameFirst = (name: string) => {
  const w = name.split(' ');
  return [w[w.length - 1], ...w.slice(0, -1)].join(' ');
};

const initials = (name: string) =>
  name
    .split(' ')
    .map(w => w[0])
    .filter((_, k, a) => k === 0 || k === a.length - 1)
    .join('');

/** „Danu Garbuz ×2” → 2 goluri pentru Danu Garbuz */
function goalsInMatch(scorers: string[] | undefined, name: string) {
  if (!scorers) return 0;
  return scorers.reduce((n, s) => {
    const m = s.match(/^(.*?)(?:\s*×\s*(\d+))?$/);
    return m && m[1].trim() === name ? n + Number(m[2] ?? 1) : n;
  }, 0);
}

export default function SquadList({
  squad,
  results,
  photos = {},
  positions = {},
  lang = 'ro'
}: {
  squad: Player[];
  results: Result[];
  /** numele jucătorului → calea pozei din /public/players (dacă există) */
  photos?: Record<string, string>;
  /** numele jucătorului → poziția, deja tradusă */
  positions?: Record<string, string>;
  lang?: Lang;
}) {
  const d = t(lang);
  const Q = d.squad;
  const [active, setActive] = useState<Player | null>(null);
  const dialog = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const d = dialog.current;
    if (!d) return;
    if (active && !d.open) d.showModal();
    if (!active && d.open) d.close();
  }, [active]);

  const pos = active ? positions[active.name] || null : null;
  const teamGoals = squad.reduce((n, p) => n + p.goals, 0);
  const scorersRank = [...squad].sort((a, b) => b.goals - a.goals);

  const matches = active
    ? results
        .map(r => ({ r, g: goalsInMatch(r.scorers, active.name) }))
        .filter(x => x.g > 0)
    : [];
  const rank = active && active.goals > 0 ? scorersRank.findIndex(p => p.goals === active.goals) + 1 : 0;
  const share = active && teamGoals ? Math.round((active.goals / teamGoals) * 100) : 0;

  return (
    <>
      <ul className="grid grid-cols-1 gap-px overflow-hidden rounded-3xl bg-white/10 sm:grid-cols-2 lg:grid-cols-3">
        {[...squad].sort((a, b) => surnameFirst(a.name).localeCompare(surnameFirst(b.name), LOCALE[lang])).map(p => (
          <li key={p.name} className="bg-navy-950">
            <button
              type="button"
              onClick={() => setActive(p)}
              aria-haspopup="dialog"
              className="group flex w-full items-center gap-4 px-5 py-4 text-left transition-colors hover:bg-white/[.04] focus-visible:bg-white/[.06] focus-visible:outline-none"
            >
              {photos[p.name] ? (
                <span className="relative h-11 w-11 shrink-0 overflow-hidden rounded-full ring-1 ring-white/15 transition group-hover:ring-2 group-hover:ring-sky">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={photos[p.name]}
                    alt=""
                    width={44}
                    height={44}
                    loading="lazy"
                    className="h-full w-full origin-[50%_12%] scale-[1.9] object-cover object-top"
                  />
                </span>
              ) : (
                <span aria-hidden="true" className="display grid h-11 w-11 shrink-0 place-items-center rounded-full bg-white/[.06] text-xl text-sky ring-1 ring-white/10 transition group-hover:bg-brand group-hover:text-white">
                  {initials(p.name)}
                </span>
              )}
              <span className="min-w-0 flex-1">
                <span className="block truncate font-semibold text-white">{surnameFirst(p.name)}</span>
                <span className="block text-xs text-muted transition-colors group-hover:text-sky">
                  {positions[p.name] || Q.viewStats}
                </span>
              </span>
              <svg aria-hidden="true" viewBox="0 0 20 20" className="h-4 w-4 shrink-0 text-white/30 transition group-hover:translate-x-0.5 group-hover:text-sky" fill="currentColor">
                <path fillRule="evenodd" d="M7.2 14.8a.75.75 0 0 1 0-1.06L10.94 10 7.2 6.26a.75.75 0 1 1 1.06-1.06l4.27 4.27a.75.75 0 0 1 0 1.06L8.26 14.8a.75.75 0 0 1-1.06 0Z" clipRule="evenodd" />
              </svg>
            </button>
          </li>
        ))}
      </ul>

      <dialog
        ref={dialog}
        aria-labelledby="player-dialog-title"
        onClose={() => setActive(null)}
        onClick={e => e.target === e.currentTarget && setActive(null)}
        className="m-auto max-h-[90dvh] w-[min(92vw,28rem)] overflow-y-auto rounded-3xl bg-navy-900 p-0 text-white shadow-2xl ring-1 ring-white/10 backdrop:bg-navy-950/80 backdrop:backdrop-blur-sm"
      >
        {active && (
          <div className="relative">
            {photos[active.name] ? (
              <div className="relative aspect-[4/3] overflow-hidden bg-navy-800">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={photos[active.name]} alt={Q.photo(surnameFirst(active.name))} className="absolute inset-0 h-full w-full object-cover object-top" />
                <div className="absolute inset-0 bg-gradient-to-t from-navy-900 via-navy-900/20 to-transparent" aria-hidden="true" />
                <div className="absolute inset-x-0 bottom-0 px-6 pb-5">
                  <p className="text-[10px] font-bold uppercase tracking-[.2em] text-sky">{pos ?? Q.registered}</p>
                  <h3 id="player-dialog-title" className="display mt-2 text-4xl leading-none drop-shadow-lg">{surnameFirst(active.name)}</h3>
                </div>
              </div>
            ) : (
              <div className="relative overflow-hidden bg-gradient-to-br from-brand via-navy-700 to-navy-900 px-6 pb-6 pt-8">
                <span aria-hidden="true" className="display absolute -right-3 -top-8 text-[9rem] leading-none text-white/10">
                  {initials(active.name)}
                </span>
                <p className="text-[10px] font-bold uppercase tracking-[.2em] text-sky">{pos ?? Q.registered}</p>
                <h3 id="player-dialog-title" className="display mt-2 text-4xl leading-none">{surnameFirst(active.name)}</h3>
              </div>
            )}
              <button
                type="button"
                onClick={() => setActive(null)}
                aria-label={Q.close}
                className="absolute right-4 top-4 z-10 grid h-9 w-9 place-items-center rounded-full bg-navy-950/40 text-white/80 ring-1 ring-white/15 transition hover:bg-navy-950/70 hover:text-white"
              >
                <svg viewBox="0 0 20 20" className="h-4 w-4" fill="currentColor" aria-hidden="true">
                  <path d="M6.28 5.22a.75.75 0 0 0-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 1 0 1.06 1.06L10 11.06l3.72 3.72a.75.75 0 1 0 1.06-1.06L11.06 10l3.72-3.72a.75.75 0 0 0-1.06-1.06L10 8.94 6.28 5.22Z" />
                </svg>
              </button>

            <dl className="grid grid-cols-3 gap-px bg-white/10">
              {[
                { k: Q.stat.goals, v: active.goals, accent: 'text-white' },
                { k: Q.stat.yellow, v: active.yellow, accent: 'text-yellow-300' },
                { k: Q.stat.red, v: active.red, accent: 'text-red-400' }
              ].map(s => (
                <div key={s.k} className="bg-navy-900 px-4 py-5 text-center">
                  <dd className={`display text-5xl leading-none ${s.accent}`}>{s.v}</dd>
                  <dt className="mt-2 text-[10px] font-bold uppercase tracking-[.18em] text-muted">{s.k}</dt>
                </div>
              ))}
            </dl>

            <div className="space-y-4 px-6 py-6 text-sm">
              {active.goals > 0 ? (
                <ul className="space-y-1.5 text-muted">
                  <li>{Q.teamRank(rank, share)}</li>
                  {active.leagueRank && (
                    <li>{Q.leagueRank(active.leagueRank, leagueScorersCount, d.league)}</li>
                  )}
                </ul>
              ) : (
                <p className="text-muted">{Q.noGoals}</p>
              )}

              {matches.length > 0 && (
                <div>
                  <p className="mb-2 text-[10px] font-bold uppercase tracking-[.18em] text-sky">{Q.scoredIn}</p>
                  <ul className="divide-y divide-white/5 rounded-2xl bg-white/[.03] ring-1 ring-white/10">
                    {matches.map(({ r, g }) => (
                      <li key={r.round} className="flex items-center justify-between gap-3 px-4 py-2.5">
                        <span className="min-w-0 truncate">
                          <span className="text-muted">{Q.roundShort(r.round)}</span>
                          {r.home} <span className="font-semibold tabular-nums">{r.homeGoals}–{r.awayGoals}</span> {r.away}
                        </span>
                        <span className="shrink-0 rounded-md bg-brand px-2 py-0.5 text-xs font-bold">
                          {goalsWord(lang, g)}
                        </span>
                      </li>
                    ))}
                  </ul>
                  {matches.reduce((n, x) => n + x.g, 0) < active.goals && (
                    <p className="mt-2 text-xs text-muted/70">{Q.partial}</p>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </dialog>
    </>
  );
}
