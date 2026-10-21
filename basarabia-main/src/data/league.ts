import auto from './league-auto.json';

/**
 * Toate meciurile jucate în Liga III-B — se actualizează AUTOMAT din
 * alborzminifotbal.ro (vezi scripts/update-league.mjs → league-auto.json).
 * Folosite pentru coloana „Ultimele 5” din clasament.
 */
export type LeagueMatch = { round: number; date: string; home: string; away: string; hg: number; ag: number };

export const leagueMatches: LeagueMatch[] = auto.matches
  .filter(m => m.hg !== null && m.ag !== null)
  .map(m => ({ round: m.round, date: m.date, home: m.home, away: m.away, hg: m.hg as number, ag: m.ag as number }));

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
