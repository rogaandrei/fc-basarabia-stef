import auto from './league-auto.json';
import instagram from './instagram-auto.json';

/**
 * Toate datele clubului într-un singur loc.
 * Clasamentul, rezultatele și programul se actualizează AUTOMAT din site-ul ligii
 * (scripts/update-league.mjs → league-auto.json), inclusiv marcatorii de la etapa 10.
 * Sursă oficială: https://www.alborzminifotbal.ro (Liga III-B)
 */

export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || 'https://fcbasarabia.ro').replace(/\/$/, '');

export const club = {
  name: 'FC Basarabia',
  legalName: 'Asociația Fotbal Club Basarabia',
  shortName: 'Basarabia',
  tagline: 'Pasiune din Basarabia, victorie în România.',
  founded: 2023,
  league: 'Liga III-B',
  competition: 'Campionatul Județean de Minifotbal Alborz – Timiș',
  sport: 'Minifotbal',
  kit: 'Gri / Albastru',
  coach: 'Daniel Guma',
  delegates: ['Daniel Guma', 'Stefan Ciocirlan'],
  ground: {
    name: 'Baza sportivă Calea Buziașului',
    street: 'Calea Buziașului 9E',
    city: 'Timișoara',
    region: 'Timiș',
    country: 'RO',
    mapsUrl: 'https://www.google.com/maps/search/?api=1&query=Calea+Buzia%C8%99ului+9E+Timi%C8%99oara'
  },
  instagram: 'https://www.instagram.com/fc__basarabia/',
  instagramHandle: '@fc__basarabia',
  facebook: 'https://www.facebook.com/fcbasarabia',
  youtube: 'https://www.youtube.com/@FCBASARABIA',
  youtubeHandle: '@FCBASARABIA',
  /** Grupul de WhatsApp al suporterilor */
  supporters: 'https://chat.whatsapp.com/IPc7jmt2gsEHcmtbvJUh1o',
  formular230: 'https://formular230.ro/asociatia-fotbal-club-basarabia',
  leagueUrl: 'https://www.alborzminifotbal.ro/clasament-liga-III-B.html',
  programUrl: 'https://www.alborzminifotbal.ro/program-liga-III-B.html',
  email: 'fcbasarabia@gmail.com',
  colors: { navy: '#021535', blue: '#0A6DFE', sky: '#8EC5FF', white: '#FFFFFF' }
} as const;

export type Result = {
  round: number;
  date: string; // ISO cu fus orar
  home: string;
  away: string;
  homeGoals: number;
  awayGoals: number;
  scorers?: string[];
};

const OUR_TEAM = 'FC Basarabia';
const ourMatches = auto.matches.filter(m => m.home === OUR_TEAM || m.away === OUR_TEAM);

/** Marcatori trecuți de mână (etapele vechi). Ex: 4: ['Danu Garbuz ×2', 'Daniel Guma'] */
const manualScorers: Record<number, string[]> = {
  9: ['Danu Garbuz ×2', 'Viorel Ciugureanu ×2', 'Andrei Cebotari ×2'],
  8: ['Danu Garbuz ×2'],
  7: ['Andrei Cebotari', 'Nicolae Prisac'],
  6: ['Daniel Guma', 'Danu Garbuz'],
  5: ['Viorel Ciugureanu', 'Ghenadii Rudei']
};

/**
 * Marcatorii pe etape: de la etapa 10 AUTOMAT (din diferența de goluri pe site-ul ligii,
 * vezi scripts/update-league.mjs). Ce scrii în manualScorers are prioritate — util pentru
 * etapele vechi sau ca să corectezi ceva.
 */
const autoScorers = (auto as { autoScorers?: Record<string, { name: string; goals: number }[]> }).autoScorers ?? {};
export const scorersByRound: Record<number, string[]> = {
  ...Object.fromEntries(
    Object.entries(autoScorers).map(([r, list]) => [Number(r), list.map(x => (x.goals > 1 ? `${x.name} ×${x.goals}` : x.name))])
  ),
  ...manualScorers
};

/** Cele mai recente primele (automat din site-ul ligii) */
export const results: Result[] = ourMatches
  .filter(m => m.hg !== null && m.ag !== null)
  .map(m => ({
    round: m.round,
    date: m.kickoff,
    home: m.home,
    away: m.away,
    homeGoals: m.hg as number,
    awayGoals: m.ag as number,
    scorers: scorersByRound[m.round]
  }))
  .sort((x, y) => y.round - x.round);

export type Fixture = {
  round: number;
  date: string; // ISO cu fus orar (ora României)
  home: string;
  away: string;
};

/** Programul oficial — automat din site-ul ligii (poate suferi modificări) */
export const fixtures: Fixture[] = ourMatches
  .filter(m => m.hg === null)
  .map(m => ({ round: m.round, date: m.kickoff, home: m.home, away: m.away }))
  .sort((x, y) => x.round - y.round);

export type Zone = 'promo' | 'promoPlayoff' | 'relegPlayoff' | 'releg';
export type Row = { team: string; p: number; w: number; d: number; l: number; gf: number; ga: number; pts: number; zone?: Zone | null };

/** Zonele din clasament (culorile vin de pe site-ul ligii, la fel ca locurile) */
export const ZONES: Record<Zone, { label: string; bar: string; tint: string }> = {
  promo: { label: 'Promovare directă în Liga II', bar: 'bg-emerald-400', tint: 'bg-emerald-400/[.06]' },
  promoPlayoff: { label: 'Baraj de promovare în Liga II', bar: 'bg-sky', tint: 'bg-sky/[.06]' },
  relegPlayoff: { label: 'Baraj de menținere în Liga III', bar: 'bg-amber-400', tint: 'bg-amber-400/[.06]' },
  releg: { label: 'Retrogradare în Liga IV', bar: 'bg-rose-500', tint: 'bg-rose-500/[.07]' }
};

/** Clasament Liga III-B — automat din site-ul ligii */
export const standingsRound: number = auto.round;
export const standings: Row[] = auto.standings as Row[];

export type Player = { name: string; goals: number; yellow: number; red: number; leagueRank: number | null };

/** Lotul legitimat + goluri/cartonașe — automat din pagina echipei pe site-ul ligii */
export const squad: Player[] = auto.squad;
/**
 * Poziția pe teren — se completează de mână.
 * Poziții: Portar, Fundaș, Mijlocaș, Atacant (sau orice text vrei).
 * Ex: 'Danu Garbuz': { position: 'Atacant' },
 */
export type PlayerDetails = { position?: string };
export const playerDetails: Record<string, PlayerDetails> = {
  'Danu Garbuz': { position: 'Atacant' },
  'Viorel Ciugureanu': { position: 'Atacant' },
  'Andrei Cebotari': { position: 'Mijlocaș' },
  'Virgiliu Bubulici': { position: 'Mijlocaș' },
  'Daniel Guma': { position: 'Mijlocaș' },
  'Ghenadii Rudei': { position: 'Atacant' },
  'Nicolae Prisac': { position: 'Atacant' },
  'Alexei Chirpii': { position: 'Atacant' },
  'Marin Podelniuc': { position: 'Fundaș' },
  'Nicu Zaporojan': { position: 'Mijlocaș' },
  'Teodor Negru': { position: 'Atacant' },
  'Andrei Roga': { position: 'Fundaș' },
  'Denis Bandol': { position: 'Fundaș' },
  'Flavius Alexandru Vacarita': { position: 'Atacant' },
  'Ion Mocanu': { position: 'Portar' },
  'Laurentiu Stici': { position: 'Fundaș' },
  'Sergiu Andronic': { position: 'Portar' },
  'Sergiu Dohotaru': { position: 'Fundaș' },
};

/** Câți jucători au marcat în toată Liga III-B (pentru „locul X din Y”) */
export const leagueScorersCount: number = auto.leagueScorers;

export type Spotlight = { name: string; role: string; highlight: string; badge: string; link?: string; image?: string };

const goalsText = (g: number) => `${g} ${g === 1 ? 'gol' : 'goluri'}`;

/** Locul în echipă după goluri (la egalitate, același loc) */
export const teamScorerRank = (p: Player) => (p.goals > 0 ? 1 + squad.filter(o => o.goals > p.goals).length : null);

/** Golgheterul (golgheterii, la egalitate) echipei — calculat automat din goluri */
export const topScorers = squad.filter(p => p.goals > 0 && teamScorerRank(p) === 1);

type AwardPost = { name: string; names?: string[]; label?: string | null; date: string; permalink: string | null; opponent: string | null; image?: string | null };
const ig = instagram as { fanFavorite?: AwardPost; potm?: AwardPost };

/** Rolul afișat sub nume pentru anumiți jucători (în rest se calculează din goluri) */
const roles: Record<string, string> = { 'Daniel Guma': 'Antrenor-jucător' };

/**
 * „Jucători în formă” — un card pe premiu, în ordinea:
 *   1. MVP (din postarea de Instagram; dacă sunt 2 MVP, apar 2 carduri)
 *   2. Fan Favorite (din postarea de Instagram)
 *   3. Golgheterul echipei (calculat din goluri)
 * Totul se actualizează automat (scripts/update-instagram.mjs + update-league.mjs).
 */
function playerStats(p?: Player) {
  if (!p) return '';
  return [p.goals > 0 ? `${goalsText(p.goals)} în campionat` : null, p.leagueRank ? `locul ${p.leagueRank} în Liga III-B` : null]
    .filter(Boolean)
    .join(' · ');
}

function buildSpotlight(): Spotlight[] {
  const find = (name: string) => squad.find(p => p.name === name);
  const cards: Spotlight[] = [];

  const mvps = (ig.potm?.names ?? (ig.potm ? [ig.potm.name] : [])).slice(0, 2);
  for (const name of mvps) {
    const vs = ig.potm?.opponent ? `MVP vs ${ig.potm.opponent}` : 'MVP-ul meciului';
    cards.push({
      name,
      badge: 'MVP',
      role: roles[name] ?? 'MVP-ul meciului',
      highlight: [vs, playerStats(find(name))].filter(Boolean).join(' · '),
      link: ig.potm?.permalink ?? undefined,
      image: ig.potm?.image ?? undefined
    });
  }

  const fan = ig.fanFavorite?.names?.[0] ?? ig.fanFavorite?.name;
  if (fan) {
    cards.push({
      name: fan,
      badge: 'Fan Favorite',
      role: roles[fan] ?? 'Ales de fani',
      highlight: ['Votat Fan Favorite de suporteri', playerStats(find(fan))].filter(Boolean).join(' · '),
      link: ig.fanFavorite?.permalink ?? undefined,
      image: ig.fanFavorite?.image ?? undefined
    });
  }

  const top = topScorers[0];
  if (top) {
    const tied = topScorers.length > 1 ? ` (la egalitate cu ${topScorers.slice(1).map(p => p.name).join(', ')})` : '';
    cards.push({
      name: top.name,
      badge: 'Golgheter',
      role: 'Golgheterul echipei',
      highlight: playerStats(top) + tied
    });
  }

  return cards;
}

export const spotlightPlayers: Spotlight[] = buildSpotlight();

export type Sponsor = { name: string; note: string; url?: string; logo?: string };
export const sponsors: Sponsor[] = [
  { name: 'Banu Sport', note: 'Partener oficial', url: 'https://www.banusport.ro/', logo: '/sponsors/banu-sport.webp' }
];

export function isOurs(team: string) {
  return team === club.name;
}

export function outcome(r: Result): 'V' | 'E' | 'Î' {
  const ours = isOurs(r.home) ? r.homeGoals : r.awayGoals;
  const theirs = isOurs(r.home) ? r.awayGoals : r.homeGoals;
  return ours > theirs ? 'V' : ours === theirs ? 'E' : 'Î';
}

export const ourRow = standings.find(r => isOurs(r.team))!;
export const ourPosition = standings.findIndex(r => isOurs(r.team)) + 1;

const RO_DATE = new Intl.DateTimeFormat('ro-RO', { weekday: 'long', day: 'numeric', month: 'long', timeZone: 'Europe/Bucharest' });
const RO_SHORT = new Intl.DateTimeFormat('ro-RO', { day: '2-digit', month: 'short', timeZone: 'Europe/Bucharest' });
const RO_TIME = new Intl.DateTimeFormat('ro-RO', { hour: '2-digit', minute: '2-digit', timeZone: 'Europe/Bucharest' });
const RO_DAY = new Intl.DateTimeFormat('ro-RO', { day: '2-digit', timeZone: 'Europe/Bucharest' });
const RO_MON = new Intl.DateTimeFormat('ro-RO', { month: 'short', timeZone: 'Europe/Bucharest' });

export const fmt = {
  long: (iso: string) => RO_DATE.format(new Date(iso)),
  short: (iso: string) => RO_SHORT.format(new Date(iso)).replace('.', ''),
  time: (iso: string) => RO_TIME.format(new Date(iso)),
  day: (iso: string) => RO_DAY.format(new Date(iso)),
  mon: (iso: string) => RO_MON.format(new Date(iso)).replace('.', '')
};
