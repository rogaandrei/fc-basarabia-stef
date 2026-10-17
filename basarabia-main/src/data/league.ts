/**
 * Toate meciurile jucate în Liga III-B (sursa: alborzminifotbal.ro/program-liga-III-B.html).
 * Folosite pentru coloana „Ultimele 5” din clasament. Adaugă etapele noi la final.
 */
export type LeagueMatch = { round: number; date: string; home: string; away: string; hg: number; ag: number };

export const leagueMatches: LeagueMatch[] = [
  { round: 1, date: '2026-08-30', home: 'BizCaffe', away: 'Athletic', hg: 3, ag: 3 },
  { round: 1, date: '2026-08-30', home: 'Plopi', away: 'AS Viitorul Iohanisfeld', hg: 3, ag: 6 },
  { round: 1, date: '2026-08-30', home: 'Novum Team', away: 'TMT', hg: 4, ag: 2 },
  { round: 1, date: '2026-08-30', home: 'ZF Lifetec', away: 'AS FC Real Timișoara', hg: 2, ag: 5 },
  { round: 1, date: '2026-08-30', home: 'Husenii', away: 'UCECOM', hg: 1, ag: 4 },
  { round: 1, date: '2026-08-30', home: 'FC Basarabia', away: 'Lex TM', hg: 5, ag: 4 },
  { round: 1, date: '2026-08-30', home: 'FC Terra Tim', away: 'Vitabolic Crew', hg: 3, ag: 3 },
  { round: 1, date: '2026-08-30', home: 'B 32 Army', away: 'Copiii Zăpezii', hg: 0, ag: 4 },
  { round: 2, date: '2026-09-05', home: 'Athletic', away: 'Copiii Zăpezii', hg: 4, ag: 3 },
  { round: 2, date: '2026-09-05', home: 'Vitabolic Crew', away: 'B 32 Army', hg: 5, ag: 2 },
  { round: 2, date: '2026-09-05', home: 'Lex TM', away: 'FC Terra Tim', hg: 2, ag: 3 },
  { round: 2, date: '2026-09-05', home: 'UCECOM', away: 'FC Basarabia', hg: 5, ag: 4 },
  { round: 2, date: '2026-09-05', home: 'AS FC Real Timișoara', away: 'Husenii', hg: 11, ag: 5 },
  { round: 2, date: '2026-09-05', home: 'TMT', away: 'ZF Lifetec', hg: 1, ag: 7 },
  { round: 2, date: '2026-09-05', home: 'AS Viitorul Iohanisfeld', away: 'Novum Team', hg: 4, ag: 4 },
  { round: 2, date: '2026-09-05', home: 'BizCaffe', away: 'Plopi', hg: 3, ag: 3 },
  { round: 3, date: '2026-09-13', home: 'Plopi', away: 'Athletic', hg: 4, ag: 2 },
  { round: 3, date: '2026-09-13', home: 'Novum Team', away: 'BizCaffe', hg: 2, ag: 1 },
  { round: 3, date: '2026-09-13', home: 'ZF Lifetec', away: 'AS Viitorul Iohanisfeld', hg: 0, ag: 4 },
  { round: 3, date: '2026-09-13', home: 'Husenii', away: 'TMT', hg: 3, ag: 3 },
  { round: 3, date: '2026-09-13', home: 'FC Basarabia', away: 'AS FC Real Timișoara', hg: 6, ag: 1 },
  { round: 3, date: '2026-09-13', home: 'FC Terra Tim', away: 'UCECOM', hg: 3, ag: 1 },
  { round: 3, date: '2026-09-13', home: 'B 32 Army', away: 'Lex TM', hg: 0, ag: 2 },
  { round: 3, date: '2026-09-13', home: 'Copiii Zăpezii', away: 'Vitabolic Crew', hg: 6, ag: 4 },
  { round: 4, date: '2026-09-19', home: 'Athletic', away: 'Vitabolic Crew', hg: 6, ag: 0 },
  { round: 4, date: '2026-09-19', home: 'Lex TM', away: 'Copiii Zăpezii', hg: 0, ag: 3 },
  { round: 4, date: '2026-09-19', home: 'UCECOM', away: 'B 32 Army', hg: 2, ag: 0 },
  { round: 4, date: '2026-09-19', home: 'AS FC Real Timișoara', away: 'FC Terra Tim', hg: 9, ag: 1 },
  { round: 4, date: '2026-09-19', home: 'TMT', away: 'FC Basarabia', hg: 0, ag: 3 },
  { round: 4, date: '2026-09-19', home: 'AS Viitorul Iohanisfeld', away: 'Husenii', hg: 4, ag: 6 },
  { round: 4, date: '2026-09-19', home: 'BizCaffe', away: 'ZF Lifetec', hg: 2, ag: 1 },
  { round: 4, date: '2026-09-19', home: 'Plopi', away: 'Novum Team', hg: 1, ag: 0 },
  { round: 5, date: '2026-09-27', home: 'Novum Team', away: 'Athletic', hg: 3, ag: 4 },
  { round: 5, date: '2026-09-27', home: 'ZF Lifetec', away: 'Plopi', hg: 2, ag: 5 },
  { round: 5, date: '2026-09-27', home: 'Husenii', away: 'BizCaffe', hg: 2, ag: 1 },
  { round: 5, date: '2026-09-27', home: 'FC Basarabia', away: 'AS Viitorul Iohanisfeld', hg: 2, ag: 3 },
  { round: 5, date: '2026-09-27', home: 'FC Terra Tim', away: 'TMT', hg: 5, ag: 1 },
  { round: 5, date: '2026-09-27', home: 'B 32 Army', away: 'AS FC Real Timișoara', hg: 2, ag: 4 },
  { round: 5, date: '2026-09-27', home: 'Copiii Zăpezii', away: 'UCECOM', hg: 3, ag: 5 },
  { round: 5, date: '2026-09-27', home: 'Vitabolic Crew', away: 'Lex TM', hg: 7, ag: 4 },
  { round: 6, date: '2026-10-03', home: 'Athletic', away: 'Lex TM', hg: 9, ag: 2 },
  { round: 6, date: '2026-10-03', home: 'UCECOM', away: 'Vitabolic Crew', hg: 6, ag: 2 },
  { round: 6, date: '2026-10-03', home: 'AS FC Real Timișoara', away: 'Copiii Zăpezii', hg: 3, ag: 6 },
  { round: 6, date: '2026-10-03', home: 'TMT', away: 'B 32 Army', hg: 1, ag: 4 },
  { round: 6, date: '2026-10-03', home: 'AS Viitorul Iohanisfeld', away: 'FC Terra Tim', hg: 1, ag: 6 },
  { round: 6, date: '2026-10-03', home: 'BizCaffe', away: 'FC Basarabia', hg: 2, ag: 2 },
  { round: 6, date: '2026-10-03', home: 'Plopi', away: 'Husenii', hg: 3, ag: 5 },
  { round: 6, date: '2026-10-03', home: 'Novum Team', away: 'ZF Lifetec', hg: 3, ag: 2 },
  { round: 7, date: '2026-10-09', home: 'ZF Lifetec', away: 'Athletic', hg: 1, ag: 5 },
  { round: 7, date: '2026-10-09', home: 'Husenii', away: 'Novum Team', hg: 3, ag: 4 },
  { round: 7, date: '2026-10-09', home: 'FC Basarabia', away: 'Plopi', hg: 2, ag: 2 },
  { round: 7, date: '2026-10-09', home: 'FC Terra Tim', away: 'BizCaffe', hg: 1, ag: 5 },
  { round: 7, date: '2026-10-09', home: 'B 32 Army', away: 'AS Viitorul Iohanisfeld', hg: 4, ag: 3 },
  { round: 7, date: '2026-10-09', home: 'Copiii Zăpezii', away: 'TMT', hg: 3, ag: 1 },
  { round: 7, date: '2026-10-09', home: 'Vitabolic Crew', away: 'AS FC Real Timișoara', hg: 4, ag: 8 },
  { round: 7, date: '2026-10-09', home: 'Lex TM', away: 'UCECOM', hg: 0, ag: 1 },
  { round: 8, date: '2026-10-11', home: 'Athletic', away: 'UCECOM', hg: 2, ag: 0 },
  { round: 8, date: '2026-10-11', home: 'AS FC Real Timișoara', away: 'Lex TM', hg: 3, ag: 0 },
  { round: 8, date: '2026-10-11', home: 'TMT', away: 'Vitabolic Crew', hg: 8, ag: 8 },
  { round: 8, date: '2026-10-11', home: 'AS Viitorul Iohanisfeld', away: 'Copiii Zăpezii', hg: 5, ag: 5 },
  { round: 8, date: '2026-10-11', home: 'BizCaffe', away: 'B 32 Army', hg: 4, ag: 4 },
  { round: 8, date: '2026-10-11', home: 'Plopi', away: 'FC Terra Tim', hg: 4, ag: 2 },
  { round: 8, date: '2026-10-11', home: 'Novum Team', away: 'FC Basarabia', hg: 7, ag: 2 },
  { round: 8, date: '2026-10-11', home: 'ZF Lifetec', away: 'Husenii', hg: 1, ag: 4 },
];

export type FormItem = { result: 'V' | 'E' | 'Î'; match: LeagueMatch };

/** Ultimele n meciuri ale unei echipe, de la cel mai vechi la cel mai recent */
export function lastForm(team: string, n = 5): FormItem[] {
  return leagueMatches
    .filter(m => m.home === team || m.away === team)
    .sort((a, b) => a.round - b.round)
    .slice(-n)
    .map(m => {
      const gf = m.home === team ? m.hg : m.ag;
      const ga = m.home === team ? m.ag : m.hg;
      return { result: gf > ga ? 'V' : gf === ga ? 'E' : 'Î', match: m };
    });
}
