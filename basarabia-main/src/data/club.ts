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
  delegates: ['Daniel Guma', 'Stefan Cocirlan'],
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
  formular230: 'https://formular230.ro/asociatia-fotbal-club-basarabia',
  leagueUrl: 'https://www.alborzminifotbal.ro/clasament-liga-III-B.html',
  programUrl: 'https://www.alborzminifotbal.ro/program-liga-III-B.html',
  // TODO: adaugă un e-mail / telefon oficial dacă există
  email: '',
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

export type Row = { team: string; p: number; w: number; d: number; l: number; gf: number; ga: number; pts: number };

/** Clasament Liga III-B — automat din site-ul ligii */
export const standingsRound: number = auto.round;
export const standings: Row[] = auto.standings;

export type Player = { name: string; goals: number; yellow: number; red: number; leagueRank: number | null };

/** Lotul legitimat + goluri/cartonașe — automat din pagina echipei pe site-ul ligii */
export const squad: Player[] = auto.squad;
/** Câți jucători au marcat în toată Liga III-B (pentru „locul X din Y”) */
export const leagueScorersCount: number = auto.leagueScorers;

export type Spotlight = { name: string; role: string; highlight: string; badge: string; link?: string };

const goalsText = (g: number) => `${g} ${g === 1 ? 'gol' : 'goluri'}`;

/** Locul în echipă după goluri (la egalitate, același loc) */
export const teamScorerRank = (p: Player) => (p.goals > 0 ? 1 + squad.filter(o => o.goals > p.goals).length : null);

/** Golgheterul (golgheterii, la egalitate) echipei — calculat automat din goluri */
export const topScorers = squad.filter(p => p.goals > 0 && teamScorerRank(p) === 1);

type AwardPost = { name: string; date: string; permalink: string | null; opponent: string | null };
const ig = instagram as { fanFavorite?: AwardPost; potm?: AwardPost };

/** Rolul afișat sub nume pentru anumiți jucători (în rest se calculează din goluri) */
const roles: Record<string, string> = { 'Daniel Guma': 'Antrenor-jucător' };

/**
 * Fan Favorite + Player of the Match — AUTOMAT din postările @fc__basarabia
 * (scripts/update-instagram.mjs → instagram-auto.json). Golgheterul vine din goluri.
 */
const awards: { name: string; badge: string; note?: string; link?: string }[] = [
  ig.fanFavorite && { name: ig.fanFavorite.name, badge: 'Fan Favorite', note: 'ales Fan Favorite de fani', link: ig.fanFavorite.permalink ?? undefined },
  ig.potm && {
    name: ig.potm.name,
    badge: 'Player of the Match',
    note: ig.potm.opponent ? `Player of the Match vs ${ig.potm.opponent}` : 'Player of the Match',
    link: ig.potm.permalink ?? undefined
  }
]
  .filter((a): a is NonNullable<typeof a> => Boolean(a));

const SPOTLIGHT_CARDS = 4;

function buildSpotlight(): Spotlight[] {
  const byGoals = [...squad].sort((a, b) => b.goals - a.goals);
  const picked: Player[] = [];
  const add = (p?: Player) => p && !picked.includes(p) && picked.length < SPOTLIGHT_CARDS && picked.push(p);
  topScorers.forEach(add);
  awards.forEach(a => add(squad.find(p => p.name === a.name)));
  byGoals.filter(p => p.goals > 0).forEach(add);

  return picked
    .sort((a, b) => b.goals - a.goals)
    .map(p => {
      const mine = awards.filter(a => a.name === p.name); // poate avea ambele premii
      const rank = teamScorerRank(p);
      const isTop = rank === 1;
      const stats = [
        p.goals > 0 ? `${goalsText(p.goals)} în campionat` : null,
        p.leagueRank ? `locul ${p.leagueRank} în Liga III-B` : null
      ].filter(Boolean).join(' · ');
      const notes = mine.map(a => a.note).filter(Boolean).join(' · ');
      return {
        name: p.name,
        role: isTop ? 'Golgheterul echipei' : roles[p.name] ?? (rank ? `Locul ${rank} la marcatori` : 'Jucător'),
        highlight: [stats, notes].filter(Boolean).join(' · '),
        badge: mine.length
          ? mine.map(a => (mine.length > 1 && a.badge === 'Player of the Match' ? 'POTM' : a.badge)).join(' · ')
          : isTop ? 'Golgheter' : 'Marcator',
        link: mine.find(a => a.link)?.link
      };
    });
}

/** Cardurile „Jucători în formă” — se reordonează singure după goluri */
export const spotlightPlayers: Spotlight[] = buildSpotlight();

export const sponsors = [{ name: 'Banu Sport', note: 'Partener oficial' }];

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
