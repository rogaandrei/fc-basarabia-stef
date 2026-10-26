/**
 * Calendarul meciurilor FC Basarabia (format iCalendar .ics).
 * Se generează automat din program/rezultate, deci se actualizează odată cu site-ul.
 */
import { club, fixtures, results, isOurs } from '@/data/club';

/** Durata unui meci de minifotbal în calendar (minute) */
const MATCH_MINUTES = 60;

export type CalMatch = { round: number; date: string; home: string; away: string; homeGoals?: number; awayGoals?: number };

export const allMatches: CalMatch[] = [
  ...results.map(r => ({ round: r.round, date: r.date, home: r.home, away: r.away, homeGoals: r.homeGoals, awayGoals: r.awayGoals })),
  ...fixtures
].sort((a, b) => a.round - b.round);

export const matchSlug = (m: CalMatch) => `etapa-${m.round}`;

const utc = (d: Date) => d.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
const esc = (s: string) => s.replace(/\\/g, '\\\\').replace(/;/g, '\;').replace(/,/g, '\\,').replace(/\n/g, '\\n');
const fold = (line: string) => {
  // liniile .ics trebuie împărțite la 75 de caractere
  const out: string[] = [];
  let l = line;
  while (l.length > 74) {
    out.push(l.slice(0, 74));
    l = ' ' + l.slice(74);
  }
  out.push(l);
  return out.join('\r\n');
};

const location = `${club.ground.name}, ${club.ground.street}, ${club.ground.city}`;

export function matchTitle(m: CalMatch) {
  const played = m.homeGoals != null && m.awayGoals != null;
  return played ? `${m.home} ${m.homeGoals}–${m.awayGoals} ${m.away}` : `${m.home} vs ${m.away}`;
}

function event(m: CalMatch, stamp: string) {
  const start = new Date(m.date);
  const end = new Date(start.getTime() + MATCH_MINUTES * 60_000);
  const side = isOurs(m.home) ? 'acasă' : 'în deplasare';
  return [
    'BEGIN:VEVENT',
    `UID:fcbasarabia-${club.league.replace(/\W/g, '').toLowerCase()}-etapa-${m.round}@fcbasarabia`,
    `DTSTAMP:${stamp}`,
    `DTSTART:${utc(start)}`,
    `DTEND:${utc(end)}`,
    `SUMMARY:${esc(`⚽ ${matchTitle(m)}`)}`,
    `DESCRIPTION:${esc(`${club.league} · Etapa ${m.round} · FC Basarabia joacă ${side}.\nProgramul poate suferi modificări: ${club.programUrl}`)}`,
    `LOCATION:${esc(location)}`,
    `URL:${club.programUrl}`,
    'BEGIN:VALARM',
    'TRIGGER:-PT2H',
    'ACTION:DISPLAY',
    `DESCRIPTION:${esc(`FC Basarabia joacă în 2 ore: ${matchTitle(m)}`)}`,
    'END:VALARM',
    'END:VEVENT'
  ];
}

export function buildIcs(matches: CalMatch[], name = 'FC Basarabia — meciuri') {
  const stamp = utc(new Date());
  const lines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//FC Basarabia//Meciuri//RO',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    `X-WR-CALNAME:${esc(name)}`,
    'X-WR-TIMEZONE:Europe/Bucharest',
    'REFRESH-INTERVAL;VALUE=DURATION:PT6H',
    'X-PUBLISHED-TTL:PT6H',
    ...matches.flatMap(m => event(m, stamp)),
    'END:VCALENDAR'
  ];
  return lines.map(fold).join('\r\n') + '\r\n';
}

/** Link „Adaugă în Google Calendar” pentru un singur meci */
export function googleLink(m: CalMatch) {
  const start = new Date(m.date);
  const end = new Date(start.getTime() + MATCH_MINUTES * 60_000);
  const p = new URLSearchParams({
    action: 'TEMPLATE',
    text: `⚽ ${matchTitle(m)}`,
    dates: `${utc(start)}/${utc(end)}`,
    details: `${club.league} · Etapa ${m.round}. Hai, FC Basarabia!`,
    location
  });
  return `https://calendar.google.com/calendar/render?${p.toString()}`;
}
