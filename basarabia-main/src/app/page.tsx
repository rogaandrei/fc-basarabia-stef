import Header from '@/components/Header';
import HeroBackground from '@/components/HeroBackground';
import Countdown from '@/components/Countdown';
import Crest from '@/components/Crest';
import JsonLd from '@/components/JsonLd';
import StandingsTable from '@/components/StandingsTable';
import SquadList from '@/components/SquadList';
import { readdirSync } from 'node:fs';
import path from 'node:path';
import SplitText from '@/components/reactbits/SplitText';
import ShinyText from '@/components/reactbits/ShinyText';
import CountUp from '@/components/reactbits/CountUp';
import ScrollVelocity from '@/components/reactbits/ScrollVelocity';
import SpotlightCard from '@/components/reactbits/SpotlightCard';
import Magnet from '@/components/reactbits/Magnet';
import GradientText from '@/components/reactbits/GradientText';
import { club, fixtures, results, standingsRound, squad, spotlightPlayers, sponsors, outcome, isOurs, ourRow, ourPosition, fmt } from '@/data/club';

const BUILD_TIME = Date.now();
/**
 * Pozele jucătorilor: pui fișierul în public/players cu numele jucătorului,
 * ex. „danu-garbuz.jpg” (sau „garbuz-danu.jpg”, .jpg/.png/.webp). Fără poză → inițialele.
 */
const slug = (s: string) =>
  s.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
const photoFiles = (() => {
  try {
    return readdirSync(path.join(process.cwd(), 'public', 'players')).filter(f => /\.(jpe?g|png|webp|avif)$/i.test(f));
  } catch {
    return [];
  }
})();
const playerPhotos: Record<string, string> = Object.fromEntries(
  squad.flatMap(p => {
    const words = p.name.split(' ');
    const keys = [slug(p.name), slug([words.at(-1), ...words.slice(0, -1)].join(' '))];
    const file = photoFiles.find(f => keys.includes(slug(f.replace(/\.[a-z]+$/i, ''))));
    return file ? [[p.name, `/players/${file}`]] : [];
  })
);

const upcoming = fixtures.filter(f => new Date(f.date).getTime() > BUILD_TIME - 2 * 3600_000);
const nextMatch = upcoming[0];

const cardStyle = {
  '--spotlight-card-surface': 'rgba(10,33,80,.55)',
  '--spotlight-card-border': 'rgba(142,197,255,.14)'
} as React.CSSProperties;

function TeamBadge({ name, size = 56, light = false }: { name: string; size?: number; light?: boolean }) {
  if (isOurs(name)) return <Crest size={size} title={club.name} />;
  const initials = name
    .split(/\s+/)
    .map(w => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
  return (
    <span
      aria-hidden="true"
      style={{ width: size, height: size }}
      className={`display inline-flex items-center justify-center rounded-full text-2xl ${light ? 'bg-navy-900 text-white ring-4 ring-sky/40' : 'bg-white/[.08] text-white ring-1 ring-white/20'}`}
    >
      {initials}
    </span>
  );
}

function SectionHead({ kicker, title, id, children }: { kicker: string; title: string; id: string; children?: React.ReactNode }) {
  return (
    <div className="mb-10 flex flex-col gap-4 md:mb-14 md:flex-row md:items-end md:justify-between">
      <div>
        <p className="section-kicker">{kicker}</p>
        <h2 id={id} className="display mt-3 text-4xl text-white sm:text-5xl lg:text-[3.5rem]">
          {title}
        </h2>
      </div>
      {children}
    </div>
  );
}

const outcomeStyle = {
  V: 'bg-emerald-400/15 text-emerald-300 ring-emerald-300/30',
  E: 'bg-sky/15 text-sky ring-sky/30',
  Î: 'bg-rose-400/15 text-rose-300 ring-rose-300/30'
} as const;
const outcomeLabel = { V: 'Victorie', E: 'Egal', Î: 'Înfrângere' } as const;

export default function Home() {
  return (
    <>
      <JsonLd />
      <Header />

      <main id="continut">
        {/* ───────────── HERO ───────────── */}
        <section id="top" aria-labelledby="hero-title" className="relative isolate overflow-hidden bg-navy-950 pt-28 pb-24 sm:pt-32 lg:pt-32 lg:pb-28">
          <HeroBackground />
          <div className="relative mx-auto grid w-full max-w-7xl items-center gap-12 px-4 sm:px-6 lg:grid-cols-[1.2fr_1fr] lg:gap-16 lg:px-8">
            <div>
              <p className="mb-6 inline-flex items-center gap-2 rounded-full bg-sky/10 px-4 py-2 ring-1 ring-sky/25">
                <span className="h-1.5 w-1.5 rounded-full bg-sky" aria-hidden="true" />
                <ShinyText
                  text={`Minifotbal · ${club.league} · Timișoara`}
                  color="#A2C6E0"
                  shineColor="#ffffff"
                  speed={3}
                  className="text-[11px] font-bold uppercase tracking-[.2em]"
                />
              </p>

              <h1 id="hero-title" className="display text-[clamp(2.75rem,6.2vw,4.9rem)] leading-[0.95] text-white [text-shadow:0_4px_40px_rgba(1,11,31,.6)]">
                <SplitText
                  tag="span"
                  text="Pasiune din Basarabia,"
                  className="block pt-[0.08em]"
                  color="#ffffff"
                  splitType="chars"
                  delay={28}
                  duration={0.7}
                  trigger="load"
                  textAlign="left"
                />
                <SplitText
                  tag="span"
                  text="victorie în România."
                  className="block pt-[0.08em]"
                  color="#A2C6E0"
                  splitType="chars"
                  delay={28}
                  duration={0.7}
                  trigger="load"
                  textAlign="left"
                />
              </h1>

              <p className="mt-6 max-w-xl text-lg leading-relaxed text-[#d6e2f5]">
                Suntem <strong className="font-semibold text-white">FC Basarabia</strong>, echipa basarabenilor din Timișoara.
                Jucăm minifotbal în {club.league}, luptăm pentru fiecare minge și ducem cu noi, pe teren, povestea de acasă.
              </p>

              <div className="mt-10 flex flex-wrap items-center gap-4">
                <Magnet padding={60} magnetStrength={4}>
                  <a
                    href="#meciuri"
                    className="inline-flex items-center gap-2 rounded-full bg-brand-600 px-7 py-4 font-bold text-white shadow-[0_12px_40px_-10px_rgba(10,109,254,.9)] ring-1 ring-white/20 transition hover:bg-brand"
                  >
                    Programul meciurilor
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
                  </a>
                </Magnet>
                <a
                  href={club.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-full px-6 py-4 font-semibold text-white ring-1 ring-white/30 transition hover:bg-white/10"
                >
                  <InstagramIcon /> {club.instagramHandle}
                </a>
              </div>
            </div>

            {nextMatch && (
              <aside aria-labelledby="next-match" className="relative">
                <div className="overflow-hidden rounded-3xl bg-navy-800/80 text-ink shadow-[0_40px_80px_-30px_rgba(0,0,0,.7)] ring-1 ring-sky/15 backdrop-blur-md">
                  <div className="flex items-center justify-between border-b border-sky/10 px-6 py-4 text-white sm:px-8">
                    <h2 id="next-match" className="display text-2xl tracking-wide">Următorul meci</h2>
                    <span className="rounded-full bg-sky/10 px-3 py-1 text-[10px] font-bold uppercase tracking-[.16em] text-sky ring-1 ring-sky/25">Etapa {nextMatch.round}</span>
                  </div>
                  <div className="p-6 sm:p-8">
                    <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3 text-center">
                      <div className="flex min-w-0 flex-col items-center gap-2">
                        <TeamBadge name={nextMatch.home} size={68} />
                        <span className="text-xs font-bold uppercase tracking-wide text-white/90">{nextMatch.home}</span>
                      </div>
                      <span className="display text-3xl text-sky/70" aria-label="contra">vs</span>
                      <div className="flex min-w-0 flex-col items-center gap-2">
                        <TeamBadge name={nextMatch.away} size={68} />
                        <span className="text-xs font-bold uppercase tracking-wide text-white/90">{nextMatch.away}</span>
                      </div>
                    </div>
                    <p className="mt-6 text-center text-sm text-muted">
                      <time dateTime={nextMatch.date} className="font-semibold capitalize text-white">{fmt.long(nextMatch.date)}</time>
                      {' · '}
                      <span className="font-semibold text-white">{`ora ${fmt.time(nextMatch.date)}`}</span>
                    </p>
                    <div className="mt-5">
                      <Countdown to={nextMatch.date} />
                    </div>
                    <a
                      href={club.ground.mapsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-5 flex items-center justify-center gap-2 text-sm font-semibold text-sky underline-offset-4 hover:text-white hover:underline"
                    >
                      <PinIcon /> {club.ground.street}, {club.ground.city}
                    </a>
                  </div>
                </div>
              </aside>
            )}
          </div>
          <div className="stripe-band absolute inset-x-0 bottom-0" aria-hidden="true" />
        </section>

        {/* ───────────── MARQUEE ───────────── */}
        <div className="overflow-hidden border-y border-white/5 bg-navy-950 py-8" aria-hidden="true">
          <ScrollVelocity
            texts={['Hai FC Basarabia ✦ Liga III-B ✦ ', 'Pasiune ✦ Comunitate ✦ Victorie ✦ ']}
            velocity={60}
            className="display px-4 uppercase text-white/55"
            fontSize="clamp(2rem,4.5vw,3.25rem)"
            parallaxClassName="parallax py-1"
            gap={24}
            outlineAlternate
            fadeEdges
            numCopies={6}
          />
        </div>

        {/* ───────────── STATS ───────────── */}
        <section aria-label="Sezonul în cifre" className="bg-navy-950 py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <p className="section-kicker mb-5">Sezonul curent · {club.league} · după etapa {standingsRound}</p>
            <dl className="grid grid-cols-2 gap-px overflow-hidden rounded-3xl bg-white/10 lg:grid-cols-4">
              {[
                { label: 'Loc în clasament', sr: `${ourPosition}`, value: <CountUp from={16} to={ourPosition} direction="up" duration={1.4} /> },
                { label: 'Puncte', sr: String(ourRow.pts), value: <CountUp to={ourRow.pts} duration={1.4} /> },
                { label: 'Goluri marcate', sr: String(ourRow.gf), value: <CountUp to={ourRow.gf} duration={1.6} /> },
                { label: 'Victorii · Egaluri · Înfrângeri', sr: `${ourRow.w}-${ourRow.d}-${ourRow.l}`, value: <>{ourRow.w}<span className="text-sky">·</span>{ourRow.d}<span className="text-sky">·</span>{ourRow.l}</> }
              ].map(s => (
                <div key={s.label} className="flex flex-col-reverse gap-2 bg-navy-950 p-6 sm:p-10">
                  <dt className="text-xs font-bold uppercase tracking-[.2em] text-muted">{s.label}</dt>
                  <dd className="display text-5xl text-white sm:text-6xl">
                    <span aria-hidden="true">{s.value}</span>
                    <span className="sr-only">{s.sr}</span>
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </section>

        {/* ───────────── PROGRAM ───────────── */}
        <section id="meciuri" aria-labelledby="meciuri-title" className="bg-navy-950 py-20 sm:py-28">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <SectionHead kicker="Program tur" title="Meciurile care urmează" id="meciuri-title">
              <p className="max-w-sm text-muted">
                Toate meciurile se joacă pe {club.ground.street}, {club.ground.city}. Vino cu prietenii și susține echipa!
              </p>
            </SectionHead>
            <ol className="divide-y divide-white/10 overflow-hidden rounded-3xl ring-1 ring-white/10">
              {upcoming.map((f, i) => (
                <li
                  key={f.round}
                  className={`grid grid-cols-[auto_1fr] items-center gap-4 p-4 sm:grid-cols-[auto_1fr_auto] sm:gap-6 sm:p-6 ${i === 0 ? 'bg-brand/15' : 'bg-navy-900/60'}`}
                >
                  <time dateTime={f.date} className={`flex w-16 flex-col items-center rounded-2xl py-2 text-white ${i === 0 ? 'bg-brand' : 'bg-white/10'}`}>
                    <span className="display text-4xl">{fmt.day(f.date)}</span>
                    <span className="text-[10px] font-bold uppercase tracking-widest">{fmt.mon(f.date)}</span>
                  </time>
                  <div className="min-w-0">
                    <p className="display text-2xl text-white sm:text-3xl">
                      <span className={isOurs(f.home) ? 'text-white' : 'text-white/70'}>{f.home}</span> <span className="text-sky">vs</span>{' '}
                      <span className={isOurs(f.away) ? 'text-white' : 'text-white/70'}>{f.away}</span>
                    </p>
                    <p className="mt-1 text-sm text-muted">
                      Etapa {f.round} · <span className="capitalize">{fmt.long(f.date)}</span> · ora {fmt.time(f.date)}
                    </p>
                  </div>
                  <span className={`col-span-2 justify-self-start rounded-full px-3 py-1 text-[10px] font-extrabold uppercase tracking-widest ring-1 sm:col-span-1 sm:justify-self-end ${isOurs(f.home) ? 'bg-white/10 text-white ring-white/20' : 'text-sky ring-sky/30'}`}>
                    {isOurs(f.home) ? 'Gazde' : 'Oaspeți'}
                  </span>
                </li>
              ))}
              <li className="bg-navy-900/30 p-5 text-center text-sm text-muted sm:p-6">
                Programul poate suferi modificări. Varianta oficială e pe{' '}
                <a href={club.programUrl} target="_blank" rel="noopener noreferrer" className="font-semibold text-sky underline-offset-4 hover:underline">
                  site-ul ligii
                </a>{' '}
                și pe{' '}
                <a href={club.instagram} target="_blank" rel="noopener noreferrer" className="font-semibold text-sky underline-offset-4 hover:underline">
                  Instagram
                </a>
                .
              </li>
            </ol>
          </div>
        </section>

        {/* ───────────── REZULTATE ───────────── */}
        <section id="rezultate" aria-labelledby="rezultate-title" className="relative bg-navy-900 py-20 sm:py-28">
          <div className="stripe-band absolute inset-x-0 top-0 opacity-80" aria-hidden="true" />
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <SectionHead kicker="Final de meci" title="Rezultate" id="rezultate-title" />
            <ul className="grid gap-5 md:grid-cols-2">
              {results.slice(0, 4).map(r => {
                const o = outcome(r);
                return (
                  <li key={r.round}>
                    <SpotlightCard className="h-full rounded-3xl p-6 sm:p-8" spotlightColor="rgba(10,109,254,.55)" style={cardStyle}>
                      <article className="relative" aria-label={`${r.home} ${r.homeGoals}–${r.awayGoals} ${r.away}`}>
                        <div className="flex items-center justify-between text-xs font-bold uppercase tracking-[.18em] text-muted">
                          <time dateTime={r.date}>Etapa {r.round} · {fmt.short(r.date)}</time>
                          <span className={`rounded-full px-3 py-1 ring-1 ${outcomeStyle[o]}`}>{outcomeLabel[o]}</span>
                        </div>
                        <div className="mt-6 grid grid-cols-[1fr_auto_1fr] items-center gap-4 text-center">
                          <div className="flex min-w-0 flex-col items-center gap-2">
                            <TeamBadge name={r.home} />
                            <span className="text-sm font-semibold">{r.home}</span>
                          </div>
                          <p className="display text-5xl tabular-nums text-white sm:text-6xl">
                            {r.homeGoals}<span className="mx-1 text-sky">–</span>{r.awayGoals}
                          </p>
                          <div className="flex min-w-0 flex-col items-center gap-2">
                            <TeamBadge name={r.away} />
                            <span className="text-sm font-semibold">{r.away}</span>
                          </div>
                        </div>
                        {r.scorers && r.scorers.length > 0 && (
                          <p className="mt-6 border-t border-white/10 pt-4 text-sm text-muted">
                            <span aria-hidden="true">⚽ </span>
                            <span className="sr-only">Marcatori FC Basarabia: </span>
                            {r.scorers.join(' · ')}
                          </p>
                        )}
                      </article>
                    </SpotlightCard>
                  </li>
                );
              })}
            </ul>
            <ol className="mt-5 divide-y divide-white/10 overflow-hidden rounded-3xl ring-1 ring-white/10">
              {results.slice(4).map(r => {
                const o = outcome(r);
                return (
                  <li key={r.round} className="grid grid-cols-[auto_1fr_auto] items-center gap-4 bg-navy-950/40 px-5 py-4 text-sm">
                    <time dateTime={r.date} className="w-20 text-xs font-bold uppercase tracking-widest text-muted">
                      Et. {r.round} · {fmt.short(r.date)}
                    </time>
                    <p className="min-w-0 font-semibold">
                      <span className={isOurs(r.home) ? 'text-white' : 'text-muted'}>{r.home}</span>{' '}
                      <span className="display mx-1 text-xl tabular-nums text-white">{r.homeGoals}–{r.awayGoals}</span>{' '}
                      <span className={isOurs(r.away) ? 'text-white' : 'text-muted'}>{r.away}</span>
                    </p>
                    <span className={`grid h-7 w-7 place-items-center rounded-full text-xs font-extrabold ring-1 ${outcomeStyle[o]}`} title={outcomeLabel[o]}>
                      {o}
                    </span>
                  </li>
                );
              })}
            </ol>
          </div>
        </section>

        {/* ───────────── CLASAMENT ───────────── */}
        <section id="clasament" aria-labelledby="clasament-title" className="bg-navy-950 py-20 sm:py-28">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <SectionHead kicker={club.competition} title={`Clasament ${club.league}`} id="clasament-title" />
            <StandingsTable />
            <p className="mt-4 text-xs text-muted">
              <a href={club.leagueUrl} target="_blank" rel="noopener noreferrer" className="font-semibold text-sky hover:text-white">Sursa: alborzminifotbal.ro →</a>
            </p>
          </div>
        </section>

        {/* ───────────── JUCĂTORI ───────────── */}
        <section id="jucatori" aria-labelledby="jucatori-title" className="bg-navy-900 py-20 sm:py-28">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <SectionHead kicker="Lotul" title="Jucători în formă" id="jucatori-title" />
            <ul className={`grid grid-cols-2 gap-3 sm:gap-5 ${spotlightPlayers.length > 3 ? 'lg:grid-cols-4' : 'lg:grid-cols-3'}`}>
              {spotlightPlayers.map(sp => ({ ...sp, image: sp.image ?? (sp.badge === 'Golgheter' ? playerPhotos[sp.name] : undefined) })).map((p, i) => (
                <li key={`${p.badge}-${p.name}`} className={spotlightPlayers.length === 3 && i === 2 ? 'col-span-2 mx-auto w-[calc(50%-0.375rem)] lg:col-span-1 lg:mx-0 lg:w-auto' : undefined}>
                  <SpotlightCard className="h-full rounded-3xl p-3 sm:p-6" spotlightColor="rgba(142,197,255,.45)" style={cardStyle}>
                    <article className="relative flex h-full flex-col">
                      <div className="relative mb-4 flex aspect-square items-end sm:mb-6 sm:aspect-[4/5] overflow-hidden rounded-2xl bg-gradient-to-br from-brand via-navy-700 to-navy-900 p-4">
                        {p.image && (
                          <>
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={p.image} alt={`${p.name} — ${p.badge}`} loading="lazy" className="absolute inset-0 h-full w-full object-cover object-top" />
                            <span className="absolute inset-0 bg-gradient-to-t from-navy-950/70 via-transparent to-transparent" aria-hidden="true" />
                          </>
                        )}
                        <span className={`display absolute -right-2 -top-6 text-[5rem] leading-none text-white/10 sm:text-[10rem] ${p.image ? 'hidden' : ''}`} aria-hidden="true">
                          {String(i + 1).padStart(2, '0')}
                        </span>
                        <span className={`display text-5xl text-white/95 sm:text-7xl ${p.image ? 'hidden' : ''}`} aria-hidden="true">
                          {p.name.replace(/[„”"]/g, '').split(' ').filter(Boolean).map(w => w[0]).filter((_, k, a) => k === 0 || k === a.length - 1).join('')}
                        </span>
                        <span className="absolute left-2 top-2 rounded-full bg-white px-2 py-1 text-[9px] sm:left-4 sm:top-4 sm:px-3 sm:text-[10px] font-extrabold uppercase tracking-widest text-navy-900">
                          {p.badge}
                        </span>
                      </div>
                      <h3 className="display text-2xl text-white sm:text-3xl">{p.name}</h3>
                      <p className="mt-1 text-xs font-bold uppercase tracking-[.18em] text-sky">{p.role}</p>
                      <p className="mt-3 text-sm text-muted">{p.highlight}</p>
                      {p.link && (
                        <a href={p.link} target="_blank" rel="noopener noreferrer" className="mt-auto pt-4 text-xs font-semibold text-sky hover:text-white">
                          Vezi postarea pe Instagram →
                        </a>
                      )}
                    </article>
                  </SpotlightCard>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* ───────────── LOT ───────────── */}
        <section id="lot" aria-labelledby="lot-title" className="bg-navy-950 py-20 sm:py-28">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <SectionHead kicker={`Lot legitimat · ${squad.length} jucători`} title="Echipa" id="lot-title">
              <dl className="grid grid-cols-2 gap-x-8 gap-y-2 text-sm">
                <dt className="text-muted">Antrenor</dt>
                <dd className="font-semibold text-white">{club.coach}</dd>
                <dt className="text-muted">Delegați</dt>
                <dd className="font-semibold text-white">{club.delegates.join(', ')}</dd>
                <dt className="text-muted">Culori</dt>
                <dd className="font-semibold text-white">{club.kit}</dd>
              </dl>
            </SectionHead>
            <SquadList squad={squad} results={results} photos={playerPhotos} />
          </div>
        </section>

        {/* ───────────── DESPRE ───────────── */}
        <section id="despre" aria-labelledby="despre-title" className="relative overflow-hidden bg-navy-900 py-20 sm:py-28">
          <div className="mx-auto grid max-w-7xl gap-14 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
            <div>
              <p className="section-kicker">Despre noi</p>
              <h2 id="despre-title" className="display mt-3 text-4xl sm:text-5xl lg:text-[3.5rem]">
                <GradientText colors={['#ffffff', '#A2C6E0', '#0081F9', '#A2C6E0', '#ffffff']} animationSpeed={6}>
                  Mai mult decât o echipă
                </GradientText>
              </h2>
              <div className="mt-6 space-y-5 text-lg leading-relaxed text-muted">
                <p>
                  <strong className="text-white">{club.legalName}</strong> a pornit în {club.founded} cu un gând simplu: să jucăm fotbal
                  împreună, departe de casă, dar cu casa în suflet.
                </p>
                <p>
                  Astăzi jucăm în {club.league} a campionatului județean de minifotbal Alborz din Timiș și suntem o comunitate care sărbătorește împreună — de la Ziua
                  Chișinăului la Ziua Națională a Vinului. Tricoul nostru poartă motive tradiționale, iar pe teren purtăm
                  numele Basarabiei cu mândrie.
                </p>
              </div>
            </div>
            <ul className="grid content-start gap-4 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
              {[
                { t: 'Pasiune', d: 'Jucăm fiecare minge ca pe ultima. Indiferent de scor, nu renunțăm.', i: '🔥' },
                { t: 'Comunitate', d: 'Un punct de întâlnire pentru basarabenii din România și prietenii lor.', i: '🤝' },
                { t: 'Tradiție', d: 'Valorile, portul și gustul autentic al Moldovei — și pe tricou, și în vestiar.', i: '🍇' },
                { t: 'Fair-play', d: 'Respect pentru adversari, arbitri și suporteri. Mereu.', i: '💙' }
              ].map(v => (
                <li key={v.t} className="rounded-3xl bg-white/[.04] p-6 ring-1 ring-white/10">
                  <span className="text-3xl" aria-hidden="true">{v.i}</span>
                  <h3 className="display mt-3 text-3xl text-white">{v.t}</h3>
                  <p className="mt-2 text-sm text-muted">{v.d}</p>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* ───────────── SUSȚINE ───────────── */}
        <section id="sustine" aria-labelledby="sustine-title" className="bg-navy-950 py-20 sm:py-28">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grain relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-brand via-brand-600 to-navy-800 p-8 sm:p-14">
              <div className="absolute -right-24 -top-24 opacity-15" aria-hidden="true">
                <Crest size={420} title="" />
              </div>
              <div className="relative max-w-2xl">
                <p className="section-kicker !text-white/80">Susține FC Basarabia</p>
                <h2 id="sustine-title" className="display mt-3 text-4xl text-white sm:text-5xl lg:text-[3.5rem]">
                  Redirecționează 3,5% din impozit. Gratuit.
                </h2>
                <p className="mt-5 text-lg text-white/85">
                  Prin Formularul 230 poți direcționa către club 3,5% din impozitul pe venit, fără niciun cost pentru tine.
                  Fiecare redirecționare ajută clubul să crească.
                </p>
                <ol className="mt-8 grid gap-3 sm:grid-cols-3">
                  {['Deschide formularul online', 'Completează datele (2 minute)', 'Semnează și trimite'].map((s, i) => (
                    <li key={s} className="flex items-center gap-3 rounded-2xl bg-white/10 p-4 text-sm font-semibold text-white ring-1 ring-white/20">
                      <span className="display grid h-9 w-9 shrink-0 place-items-center rounded-full bg-white text-xl text-brand">{i + 1}</span>
                      {s}
                    </li>
                  ))}
                </ol>
                <div className="mt-10 flex flex-wrap gap-4">
                  <Magnet padding={50} magnetStrength={4}>
                    <a
                      href={club.formular230}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 rounded-full bg-white px-7 py-4 font-bold text-navy-900 shadow-xl transition hover:bg-sky"
                    >
                      Completează Formularul 230
                    </a>
                  </Magnet>
                  <a
                    href={club.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-full px-6 py-4 font-semibold text-white ring-1 ring-white/40 transition hover:bg-white/10"
                  >
                    Devino partener
                  </a>
                </div>
              </div>
            </div>

            <div className="mt-14">
              <p className="section-kicker text-center">Cu sprijinul</p>
              <ul className="mt-6 flex flex-wrap items-center justify-center gap-4">
                {sponsors.map(s => (
                  <li key={s.name} className="rounded-2xl bg-white/[.04] px-8 py-5 text-center ring-1 ring-white/10">
                    <span className="display block text-4xl tracking-wide text-white">{s.name}</span>
                    <span className="text-[10px] font-bold uppercase tracking-[.2em] text-muted">{s.note}</span>
                  </li>
                ))}
                <li>
                  <a href={club.instagram} target="_blank" rel="noopener noreferrer" className="block rounded-2xl border border-dashed border-white/20 px-8 py-5 text-center text-sm font-semibold text-muted transition hover:border-sky hover:text-white">
                    Locul tău aici?
                    <span className="block text-[10px] font-bold uppercase tracking-[.2em]">Scrie-ne</span>
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* ───────────── CONTACT ───────────── */}
        <section id="contact" aria-labelledby="contact-title" className="bg-navy-900 py-20 sm:py-28">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <SectionHead kicker="Contact" title="Ne vedem pe teren" id="contact-title">
              <p className="max-w-sm text-muted">Scrie-ne, urmărește-ne sau vino direct la meci. Orice susținere contează.</p>
            </SectionHead>

            {/* Devino suporter — grupul de WhatsApp */}
            <div className="relative mb-5 overflow-hidden rounded-3xl bg-gradient-to-br from-brand via-navy-700 to-navy-900 p-8 ring-1 ring-white/10 sm:p-10">
              <div aria-hidden="true" className="absolute -right-10 -top-10 opacity-[.08]">
                <Crest size={260} />
              </div>
              <div className="relative flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
                <div className="max-w-2xl">
                  <p className="text-[11px] font-bold uppercase tracking-[.2em] text-sky">Comunitatea FC Basarabia</p>
                  <h3 className="display mt-2 text-4xl text-white sm:text-5xl">Devino suporter FC Basarabia</h3>
                  <p className="mt-3 text-white/80">
                    Intră în grupul suporterilor pe WhatsApp: programul meciurilor, rezultate pe loc, poze și invitații la evenimentele
                    comunității. Vino în tribună și susține-ne!
                  </p>
                </div>
                <a
                  href={club.supporters}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex shrink-0 items-center justify-center gap-3 rounded-full bg-white px-7 py-4 font-bold text-navy-950 shadow-lg shadow-navy-950/30 transition hover:bg-sky"
                >
                  <WhatsAppIcon size={22} />
                  Intră în grupul suporterilor
                </a>
              </div>
            </div>

            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-6">
              <ContactCard className="lg:col-span-3" href={club.ground.mapsUrl} icon={<PinIcon size={28} />} title="Teren" cta="Deschide în Google Maps →">
                <address className="not-italic">{club.ground.street}, {club.ground.city}</address>
              </ContactCard>
              <ContactCard className="lg:col-span-3" href={`mailto:${club.email}`} icon={<MailIcon size={28} />} title="E-mail" cta="Scrie-ne →" external={false}>
                <span className="break-all">{club.email}</span> — parteneriate, presă, sponsorizări.
              </ContactCard>
              <ContactCard className="lg:col-span-2" href={club.instagram} icon={<InstagramIcon size={28} />} title="Instagram" cta="Urmărește-ne →">
                {club.instagramHandle} — noutăți, matchday și votul pentru Fan Favorite.
              </ContactCard>
              <ContactCard className="lg:col-span-2" href={club.facebook} icon={<FacebookIcon size={28} />} title="Facebook" cta="Dă like paginii →">
                FC Basarabia pe Facebook — anunțuri, poze și evenimentele comunității.
              </ContactCard>
              <ContactCard className="sm:col-span-2 lg:col-span-2" href={club.youtube} icon={<YouTubeIcon size={28} />} title="YouTube" cta="Abonează-te →">
                {club.youtubeHandle} — rezumate, goluri și momente de la meciuri.
              </ContactCard>
            </div>
          </div>
        </section>
      </main>

      <footer className="relative bg-navy-950 pt-14 pb-10">
        <div className="stripe-band absolute inset-x-0 top-0" aria-hidden="true" />
        <div className="mx-auto flex max-w-7xl flex-col items-center gap-6 px-4 text-center sm:px-6 lg:px-8">
          <Crest size={72} />
          <p className="display text-4xl text-white">Hai, FC Basarabia!</p>
          <ul className="flex items-center gap-3" aria-label="Rețele sociale">
            {[
              { href: club.instagram, label: 'Instagram', icon: <InstagramIcon size={18} /> },
              { href: club.facebook, label: 'Facebook', icon: <FacebookIcon size={18} /> },
              { href: club.youtube, label: 'YouTube', icon: <YouTubeIcon size={18} /> },
              { href: club.supporters, label: 'Grupul suporterilor pe WhatsApp', icon: <WhatsAppIcon size={18} /> },
              { href: `mailto:${club.email}`, label: 'E-mail', icon: <MailIcon size={18} /> }
            ].map(l => (
              <li key={l.label}>
                <a
                  href={l.href}
                  target={l.href.startsWith('mailto:') ? undefined : '_blank'}
                  rel="noopener noreferrer"
                  aria-label={l.label}
                  title={l.label}
                  className="grid h-11 w-11 place-items-center rounded-full bg-white/[.06] text-white/80 ring-1 ring-white/10 transition hover:bg-brand hover:text-white"
                >
                  {l.icon}
                </a>
              </li>
            ))}
          </ul>
          <p className="text-sm text-muted">
            © {new Date().getFullYear()} {club.legalName}. {club.tagline}
          </p>
        </div>
      </footer>
    </>
  );
}

function PinIcon({ size = 16, color = '#A2C6E0' }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" aria-hidden="true">
      <path d="M12 22s7-6.2 7-12a7 7 0 1 0-14 0c0 5.8 7 12 7 12z" />
      <circle cx="12" cy="10" r="2.5" />
    </svg>
  );
}

function InstagramIcon({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={size > 20 ? '#A2C6E0' : 'currentColor'} strokeWidth="2" aria-hidden="true">
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" />
    </svg>
  );
}

function ContactCard({
  href,
  icon,
  title,
  cta,
  external = true,
  className = '',
  children
}: {
  href: string;
  icon: React.ReactNode;
  title: string;
  cta: string;
  external?: boolean;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <a
      href={href}
      {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
      className={`group flex flex-col rounded-3xl bg-white/[.04] p-8 ring-1 ring-white/10 transition hover:ring-sky/50 ${className}`}
    >
      {icon}
      <h3 className="display mt-4 text-3xl text-white">{title}</h3>
      <div className="mt-2 text-muted">{children}</div>
      <span className="mt-auto pt-4 text-sm font-semibold text-sky group-hover:text-white">{cta}</span>
    </a>
  );
}

const iconStroke = (size: number) => (size > 20 ? '#A2C6E0' : 'currentColor');

function MailIcon({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={iconStroke(size)} strokeWidth="2" aria-hidden="true">
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="m3 7 9 6 9-6" />
    </svg>
  );
}

function FacebookIcon({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={iconStroke(size)} strokeWidth="2" aria-hidden="true">
      <path d="M15 3h-2.5A4.5 4.5 0 0 0 8 7.5V10H5.5v4H8v7h4v-7h3l.5-4H12V7.8c0-.7.4-1 1-1h2z" />
    </svg>
  );
}

function YouTubeIcon({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={iconStroke(size)} strokeWidth="2" aria-hidden="true">
      <rect x="2.5" y="5.5" width="19" height="13" rx="4" />
      <path d="m10 9.5 5 2.5-5 2.5z" fill="currentColor" />
    </svg>
  );
}

function WhatsAppIcon({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2zm0 18.2c-1.5 0-3-.4-4.3-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8-.2-.1-.4-.1-.6.1l-.8 1c-.1.2-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.2-.4.2-.4.7-1.3.1-.2 0-.3 0-.4l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5c-.2 0-.4.1-.6.3-.2.2-.8.8-.8 2s.8 2.3 1 2.5c.1.2 1.6 2.5 4 3.5 1.5.6 2 .7 2.8.6.4-.1 1.5-.6 1.7-1.2.2-.6.2-1.1.1-1.2l-.4-.3z" />
    </svg>
  );
}
