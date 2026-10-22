/**
 * Actualizare automată Liga III-B din alborzminifotbal.ro
 *
 * Descarcă clasamentul, programul, lotul FC Basarabia și golgheterii, le transformă în src/data/league-auto.json.
 * Site-ul citește clasamentul, rezultatele, programul, forma echipelor și statisticile jucătorilor din acel fișier.
 *
 * Rulare manuală:  npm run update-league
 * Rulare automată: .github/workflows/update-league.yml (GitHub Actions, de câteva ori pe zi)
 *
 * Dacă site-ul ligii nu răspunde sau își schimbă structura, scriptul se oprește cu eroare
 * și NU atinge datele existente — site-ul rămâne cu ultimul clasament bun.
 */
import { readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';

const BASE = 'https://www.alborzminifotbal.ro';
const STANDINGS_URL = `${BASE}/clasament-liga-III-B.html`;
const PROGRAM_URL = `${BASE}/program-liga-III-B.html`;
const SQUAD_URL = `${BASE}/echipe-lot-fc basarabia .html`;
const SCORERS_URL = `${BASE}/golgeteri-Liga III B.html`;
const OUR_TEAM = 'FC BASARABIA';
const OUT = fileURLToPath(new URL('../src/data/league-auto.json', import.meta.url));

/** Numele de pe site-ul ligii (MAJUSCULE, fără diacritice) → cum le afișăm noi */
const NAMES = {
  'ATHLETIC': 'Athletic',
  'AS FC REAL TIMISOARA': 'AS FC Real Timișoara',
  'COPIII ZAPEZII': 'Copiii Zăpezii',
  'UCECOM': 'UCECOM',
  'NOVUM TEAM': 'Novum Team',
  'FC BASARABIA': 'FC Basarabia',
  'PLOPI': 'Plopi',
  'FC TERRA TIM': 'FC Terra Tim',
  'HUSENII': 'Husenii',
  'AS VIITORUL IOHANISFELD': 'AS Viitorul Iohanisfeld',
  'VITABOLIC CREW': 'Vitabolic Crew',
  'BIZCAFFE': 'BizCaffe',
  'B 32 ARMY': 'B 32 Army',
  'TMT': 'TMT',
  'ZF LIFETEC': 'ZF Lifetec',
  'LEX TM': 'Lex TM'
};

const clean = s =>
  s.replace(/<[^>]*>/g, ' ').replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&').replace(/\s+/g, ' ').trim();

/** Echipă nouă, necunoscută → „Title Case” ca să arate decent până o adăugăm în NAMES */
const teamName = raw => {
  const key = clean(raw).toUpperCase();
  if (NAMES[key]) return NAMES[key];
  console.warn(`! Echipă nouă, fără nume în NAMES: "${key}"`);
  return key.toLowerCase().replace(/(^|\s)\S/g, c => c.toUpperCase());
};

/** Descarcă o pagină; reîncearcă de 3 ori dacă site-ul ligii răspunde cu eroare sau cu o pagină incompletă */
async function get(url) {
  let last;
  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      const res = await fetch(encodeURI(url), { headers: { 'user-agent': 'fc-basarabia-site (actualizare clasament)' } });
      if (!res.ok) throw new Error(`${url} → HTTP ${res.status}`);
      const html = await res.text();
      if (!html.includes('id="mainContent"')) throw new Error(`${url} → pagină incompletă`);
      return html;
    } catch (e) {
      last = e;
      await new Promise(r => setTimeout(r, 2000 * attempt));
    }
  }
  throw last;
}

const mainContent = html => {
  const i = html.indexOf('id="mainContent"');
  if (i < 0) throw new Error('Nu găsesc #mainContent — s-a schimbat structura site-ului?');
  return html.slice(i);
};

const cells = rowHtml => [...rowHtml.matchAll(/<td[^>]*>([\s\S]*?)<\/td>/g)].map(m => m[1]);

/**
 * Zona din clasament, după culoarea rândului de pe site-ul ligii:
 * portocaliu = promovare directă, portocaliu deschis = baraj de promovare,
 * verde deschis = baraj de menținere, verde = retrogradare.
 */
const ZONE_COLORS = { 'ff9900': 'promo', 'ffc65b': 'promoPlayoff', 'bfffd2': 'relegPlayoff', '99cc99': 'releg' };
const zoneOf = trHtml => {
  const c = trHtml.match(/background:\s*#([0-9a-f]{6})/i)?.[1]?.toLowerCase();
  return ZONE_COLORS[c] ?? null;
};

function parseStandings(html) {
  const body = mainContent(html);
  const table = body.slice(0, body.indexOf('</table>'));
  const rows = [];
  for (const [, open, tr] of table.matchAll(/(<tr[^>]*>)([\s\S]*?)<\/tr>/g)) {
    const c = cells(tr);
    if (c.length < 9) continue;
    const [pos, team, p, w, d, l, gf, ga, pts] = [c[0], c[1], ...c.slice(2, 9)].map((v, i) => (i === 1 ? teamName(v) : Number(clean(v))));
    if ([pos, p, w, d, l, gf, ga, pts].some(n => !Number.isFinite(n))) throw new Error(`Rând de clasament invalid: ${clean(tr)}`);
    rows.push({ team, p, w, d, l, gf, ga, pts, zone: zoneOf(open) });
  }
  if (rows.length < 4) throw new Error(`Clasament prea scurt (${rows.length} rânduri)`);
  return rows;
}

/** Ora României (EET/EEST) → offset corect pentru data respectivă, ex. „+03:00” */
function bucharestOffset(y, m, d, h) {
  const probe = new Date(Date.UTC(y, m - 1, d, h - 2));
  const name = new Intl.DateTimeFormat('en-US', { timeZone: 'Europe/Bucharest', timeZoneName: 'longOffset' })
    .formatToParts(probe)
    .find(p => p.type === 'timeZoneName').value; // „GMT+03:00”
  return name.replace('GMT', '') || '+00:00';
}

function parseProgram(html) {
  const body = mainContent(html);
  const parts = body.split(/(Etapa\s+\d+\s*-\s*[\d.]*)/);
  const matches = [];
  for (let i = 1; i < parts.length; i += 2) {
    const round = Number(parts[i].match(/Etapa\s+(\d+)/)[1]);
    for (const [, tr] of parts[i + 1].matchAll(/<tr[^>]*>([\s\S]*?)<\/tr>/g)) {
      const c = cells(tr);
      if (c.length < 6) continue;
      const home = teamName(c[1]);
      const away = teamName(c[2]);
      const score = clean(c[3]).match(/^(\d+)\s*-\s*(\d+)$/);
      const dm = clean(c[4]).match(/^(\d{2})\.(\d{2})\.(\d{4})$/);
      if (!dm) continue;
      const [dd, mm, yyyy] = [dm[1], dm[2], dm[3]].map(Number);
      const hour = Number(clean(c[5]).match(/^(\d{1,2})/)?.[1] ?? 12);
      const date = `${yyyy}-${dm[2]}-${dm[1]}`;
      const kickoff = `${date}T${String(hour).padStart(2, '0')}:00:00${bucharestOffset(yyyy, mm, dd, hour)}`;
      matches.push({
        round,
        date,
        kickoff,
        home,
        away,
        hg: score ? Number(score[1]) : null,
        ag: score ? Number(score[2]) : null
      });
    }
  }
  if (!matches.length) throw new Error('Nu am găsit niciun meci în program');
  return matches;
}

/** „GARBUZ DANU” → „Danu Garbuz” (pe site-ul ligii numele de familie e primul) */
const personName = raw => {
  const words = clean(raw).toLowerCase().split(' ').filter(Boolean)
    .map(w => w.replace(/(^|-)\S/g, c => c.toUpperCase()));
  return [...words.slice(1), words[0]].join(' ');
};

function parseScorers(html) {
  const body = mainContent(html);
  const table = body.slice(0, body.indexOf('</table>'));
  const rows = [];
  for (const [, tr] of table.matchAll(/<tr[^>]*>([\s\S]*?)<\/tr>/g)) {
    const c = cells(tr);
    if (c.length < 4) continue;
    const pos = Number(clean(c[0]));
    const goals = Number(clean(c[2]));
    if (!Number.isFinite(pos) || !Number.isFinite(goals) || !clean(c[0])) continue;
    rows.push({ pos, name: clean(c[1]).toUpperCase(), goals, team: clean(c[3]).toUpperCase() });
  }
  if (rows.length < 5) throw new Error(`Clasament golgheteri prea scurt (${rows.length} rânduri)`);
  return rows;
}

function parseSquad(html, scorers) {
  const body = mainContent(html);
  const start = body.indexOf('Nume Jucator');
  if (start < 0) throw new Error('Nu găsesc tabelul cu lotul echipei');
  const table = body.slice(start, body.indexOf('</table>', start));
  const squad = [];
  for (const [, tr] of table.matchAll(/<tr[^>]*>([\s\S]*?)<\/tr>/g)) {
    const c = cells(tr);
    if (c.length < 6) continue;
    const raw = clean(c[1]).toUpperCase();
    const [goals, yellow, red] = [c[3], c[4], c[5]].map(v => Number(clean(v)));
    if ([goals, yellow, red].some(n => !Number.isFinite(n))) throw new Error(`Rând de lot invalid: ${clean(tr)}`);
    const s = scorers.find(r => r.name === raw && r.team === OUR_TEAM);
    // loc „la egalitate”: 1 + câți jucători din ligă au marcat mai mult
    const leagueRank = s ? 1 + scorers.filter(r => r.goals > s.goals).length : null;
    squad.push({ name: personName(raw), goals, yellow, red, leagueRank });
  }
  if (squad.length < 5) throw new Error(`Lot prea scurt (${squad.length} jucători)`);
  return squad.sort((a, b) => b.goals - a.goals || a.name.localeCompare(b.name, 'ro'));
}

const [standingsHtml, programHtml, squadHtml, scorersHtml] = await Promise.all(
  [STANDINGS_URL, PROGRAM_URL, SQUAD_URL, SCORERS_URL].map(get)
);
const standings = parseStandings(standingsHtml);
const matches = parseProgram(programHtml);
const scorers = parseScorers(scorersHtml);
const squad = parseSquad(squadHtml, scorers);
const round = Math.max(...standings.map(r => r.p));

const previous = await readFile(OUT, 'utf8').catch(() => '');

/**
 * Marcatori pe meci — calculați din diferența de goluri.
 * Site-ul ligii dă doar totalul pe sezon, dar FC Basarabia joacă un singur meci pe etapă:
 * golurile apărute la un jucător între „după etapa X” și „după etapa Y” sunt din meciul etapei Y.
 * `goalSnapshots[etapă]` = golurile fiecărui jucător după ultima noastră etapă jucată
 * (se rescrie la fiecare rulare, ca să prindă și actualizările întârziate ale ligii).
 */
const prevData = previous ? JSON.parse(previous) : {};
const ourPlayed = matches.filter(m => (m.home === 'FC Basarabia' || m.away === 'FC Basarabia') && m.hg !== null);
const lastOurRound = Math.max(0, ...ourPlayed.map(m => m.round));
const goalSnapshots = { ...(prevData.goalSnapshots ?? {}) };
if (lastOurRound) goalSnapshots[lastOurRound] = Object.fromEntries(squad.map(p => [p.name, p.goals]));

const autoScorers = {};
const snapRounds = Object.keys(goalSnapshots).map(Number).sort((a, b) => a - b);
for (let i = 1; i < snapRounds.length; i++) {
  const before = goalSnapshots[snapRounds[i - 1]];
  const after = goalSnapshots[snapRounds[i]];
  const list = Object.entries(after)
    .map(([name, g]) => ({ name, goals: g - (before[name] ?? 0) }))
    .filter(x => x.goals > 0)
    .sort((a, b) => b.goals - a.goals);
  if (list.length) autoScorers[snapRounds[i]] = list;
}

const data = { source: STANDINGS_URL, round, standings, matches, squad, leagueScorers: scorers.length, goalSnapshots, autoScorers };
const json = JSON.stringify(data, null, 2) + '\n';

if (previous === json) {
  console.log(`Nicio schimbare (după etapa ${round}).`);
} else {
  await writeFile(OUT, json);
  const played = matches.filter(m => m.hg !== null).length;
  console.log(`✓ Actualizat: clasament după etapa ${round}, ${played} meciuri jucate, ${matches.length - played} programate.`);
}
