/**
 * Toate datele clubului într-un singur loc.
 * Actualizează rezultatele / programul / clasamentul aici și reconstruiește site-ul (npm run build).
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

/** Cele mai recente primele */
export const results: Result[] = [
  { round: 8, date: '2026-10-11T20:00:00+03:00', home: 'Novum Team', away: 'FC Basarabia', homeGoals: 7, awayGoals: 2, scorers: ['Danu Garbuz ×2'] },
  { round: 7, date: '2026-10-09T20:00:00+03:00', home: 'FC Basarabia', away: 'Plopi', homeGoals: 2, awayGoals: 2, scorers: ['Andrei Cebotari', 'Nicolae Prisac'] },
  { round: 6, date: '2026-10-03T14:00:00+03:00', home: 'BizCaffe', away: 'FC Basarabia', homeGoals: 2, awayGoals: 2, scorers: ['Daniel Guma', 'Danu Garbuz'] },
  { round: 5, date: '2026-09-27T17:00:00+03:00', home: 'FC Basarabia', away: 'AS Viitorul Iohanisfeld', homeGoals: 2, awayGoals: 3, scorers: ['Viorel Ciugureanu', 'Ghenadii Rudei'] },
  { round: 4, date: '2026-09-19T13:00:00+03:00', home: 'TMT', away: 'FC Basarabia', homeGoals: 0, awayGoals: 3 },
  { round: 3, date: '2026-09-13T18:00:00+03:00', home: 'FC Basarabia', away: 'AS FC Real Timișoara', homeGoals: 6, awayGoals: 1 },
  { round: 2, date: '2026-09-05T12:00:00+03:00', home: 'UCECOM', away: 'FC Basarabia', homeGoals: 5, awayGoals: 4 },
  { round: 1, date: '2026-08-30T19:00:00+03:00', home: 'FC Basarabia', away: 'Lex TM', homeGoals: 5, awayGoals: 4 }
];

export type Fixture = {
  round: number;
  date: string; // ISO cu fus orar (ora României)
  home: string;
  away: string;
};

/** Programul oficial — poate suferi modificări (verificați lunea pe site-ul ligii) */
export const fixtures: Fixture[] = [
  { round: 9, date: '2026-10-17T10:00:00+03:00', home: 'FC Basarabia', away: 'ZF Lifetec' },
  { round: 10, date: '2026-10-25T21:00:00+02:00', home: 'Husenii', away: 'FC Basarabia' },
  { round: 11, date: '2026-10-31T09:00:00+02:00', home: 'FC Basarabia', away: 'Athletic' },
  { round: 12, date: '2026-11-08T21:00:00+02:00', home: 'FC Basarabia', away: 'FC Terra Tim' },
  { round: 13, date: '2026-11-14T10:00:00+02:00', home: 'B 32 Army', away: 'FC Basarabia' },
  { round: 14, date: '2026-11-22T20:00:00+02:00', home: 'FC Basarabia', away: 'Copiii Zăpezii' },
  { round: 15, date: '2026-11-28T11:00:00+02:00', home: 'Vitabolic Crew', away: 'FC Basarabia' }
];

export type Row = { team: string; p: number; w: number; d: number; l: number; gf: number; ga: number; pts: number };

/** Clasament Liga III-B după etapa 8 */
export const standingsRound = 8;
export const standings: Row[] = [
  { team: 'Athletic', p: 8, w: 6, d: 1, l: 1, gf: 35, ga: 16, pts: 19 },
  { team: 'AS FC Real Timișoara', p: 8, w: 6, d: 0, l: 2, gf: 44, ga: 26, pts: 18 },
  { team: 'UCECOM', p: 8, w: 6, d: 0, l: 2, gf: 24, ga: 15, pts: 18 },
  { team: 'Copiii Zăpezii', p: 8, w: 5, d: 1, l: 2, gf: 33, ga: 22, pts: 16 },
  { team: 'Novum Team', p: 8, w: 5, d: 1, l: 2, gf: 27, ga: 19, pts: 16 },
  { team: 'Plopi', p: 8, w: 4, d: 2, l: 2, gf: 25, ga: 22, pts: 14 },
  { team: 'Husenii', p: 8, w: 4, d: 1, l: 3, gf: 29, ga: 31, pts: 13 },
  { team: 'FC Terra Tim', p: 8, w: 4, d: 1, l: 3, gf: 24, ga: 26, pts: 13 },
  { team: 'FC Basarabia', p: 8, w: 3, d: 2, l: 3, gf: 26, ga: 24, pts: 11 },
  { team: 'AS Viitorul Iohanisfeld', p: 8, w: 3, d: 2, l: 3, gf: 30, ga: 30, pts: 11 },
  { team: 'BizCaffe', p: 8, w: 2, d: 4, l: 2, gf: 21, ga: 18, pts: 10 },
  { team: 'Vitabolic Crew', p: 8, w: 2, d: 2, l: 4, gf: 33, ga: 43, pts: 8 },
  { team: 'B 32 Army', p: 8, w: 2, d: 1, l: 5, gf: 16, ga: 25, pts: 7 },
  { team: 'ZF Lifetec', p: 8, w: 1, d: 0, l: 7, gf: 16, ga: 29, pts: 3 },
  { team: 'Lex TM', p: 8, w: 1, d: 0, l: 7, gf: 14, ga: 31, pts: 3 },
  { team: 'TMT', p: 8, w: 0, d: 2, l: 6, gf: 17, ga: 37, pts: 2 }
];

export type Player = { name: string; goals: number; yellow: number; red: number };

/** Lotul legitimat (goluri din clasamentul golgheterilor Liga III-B) */
export const squad: Player[] = [
  { name: 'Danu Garbuz', goals: 5, yellow: 0, red: 0 },
  { name: 'Viorel Ciugureanu', goals: 4, yellow: 0, red: 0 },
  { name: 'Andrei Cebotari', goals: 3, yellow: 1, red: 0 },
  { name: 'Virgiliu Bubulici', goals: 3, yellow: 1, red: 0 },
  { name: 'Daniel Guma', goals: 2, yellow: 0, red: 0 },
  { name: 'Alexei Chirpii', goals: 1, yellow: 0, red: 0 },
  { name: 'Teodor Negru', goals: 1, yellow: 0, red: 0 },
  { name: 'Marin Podelniuc', goals: 1, yellow: 0, red: 0 },
  { name: 'Nicolae Prisac', goals: 1, yellow: 0, red: 0 },
  { name: 'Ghenadii Rudei', goals: 1, yellow: 0, red: 1 },
  { name: 'Sergiu Andronic', goals: 0, yellow: 0, red: 0 },
  { name: 'Denis Bandol', goals: 0, yellow: 0, red: 0 },
  { name: 'Sergiu Dohotaru', goals: 0, yellow: 0, red: 0 },
  { name: 'Ion Mocanu', goals: 0, yellow: 1, red: 0 },
  { name: 'Andrei Roga', goals: 0, yellow: 0, red: 0 },
  { name: 'Laurentiu Stici', goals: 0, yellow: 0, red: 0 },
  { name: 'Flavius Alexandru Vacarita', goals: 0, yellow: 0, red: 0 },
  { name: 'Nicu Zaporojan', goals: 0, yellow: 0, red: 0 }
];

export type Spotlight = { name: string; role: string; highlight: string; badge: string };

export const spotlightPlayers: Spotlight[] = [
  { name: 'Danu Garbuz', role: 'Golgheterul echipei', highlight: '5 goluri în campionat · ales Fan Favorite', badge: 'Fan Favorite' },
  { name: 'Daniel Guma', role: 'Antrenor-jucător', highlight: 'Gol și prestație de nota 10 vs BizCaffe', badge: 'Player of the Match' },
  { name: 'Viorel Ciugureanu', role: 'Marcator', highlight: '4 goluri în campionat', badge: 'Golgheter' },
  { name: 'Andrei Cebotari', role: 'Marcator', highlight: '3 goluri, inclusiv vs Plopi', badge: 'Golgheter' }
];

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
