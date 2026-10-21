/**
 * Fan Favorite + Player of the Match — automat din postările @fc__basarabia
 *
 * Citește ultimele postări prin Instagram API și caută în descriere:
 *   • „Fan Favorite” / #FanFavorite                       → Fan Favorite
 *   • „Player of the Match” / #POTM / „Omul meciului”     → Player of the Match
 * apoi numele unui jucător din lot (ex. „Danu Garbuz” sau „Garbuz Danu”, cu sau fără diacritice).
 * Rezultatul merge în src/data/instagram-auto.json.
 *
 * Are nevoie de variabilele (secrete în GitHub → Settings → Secrets → Actions):
 *   IG_ACCESS_TOKEN  — cheia de acces (obligatoriu)
 *   IG_USER_ID       — doar pentru varianta prin pagina de Facebook (graph.facebook.com)
 * Fără IG_ACCESS_TOKEN scriptul nu face nimic (site-ul folosește ultimele date salvate).
 *
 * Rulare manuală:  IG_ACCESS_TOKEN=... npm run update-instagram
 */
import { readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';

const OUT = fileURLToPath(new URL('../src/data/instagram-auto.json', import.meta.url));
const LEAGUE = fileURLToPath(new URL('../src/data/league-auto.json', import.meta.url));

const AWARDS = {
  fanFavorite: [/fan\s*favou?rite/i, /#fanfav/i],
  potm: [/player\s*of\s*the\s*match/i, /#?\bpotm\b/i, /omul\s+meciului/i, /jucătorul\s+meciului|jucatorul\s+meciului/i]
};

const fold = s =>
  s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/[^a-z0-9@#\s]/g, ' ').replace(/\s+/g, ' ');

/** Poziția la care apare jucătorul în text (prenume+nume în orice ordine), sau -1 */
function findPlayer(text, name) {
  const words = fold(name).split(' ').filter(Boolean);
  if (words.length < 2) return -1;
  const first = words.slice(0, -1).join(' ');
  const last = words.at(-1);
  const variants = [`${first} ${last}`, `${last} ${first}`, `${words[0]} ${last}`, `${last} ${words[0]}`];
  const hits = variants.map(v => text.search(new RegExp(`(^|[^a-z])${v}([^a-z]|$)`))).filter(i => i >= 0);
  return hits.length ? Math.min(...hits) : -1;
}

/** Jucătorul la care se referă premiul: primul nume din lot care apare după cuvântul-cheie (sau oriunde) */
export function detect(caption, squad, patterns) {
  const text = fold(caption);
  const raw = caption;
  const kw = patterns.map(p => raw.search(p)).filter(i => i >= 0);
  if (!kw.length) return null;
  const kwPos = fold(raw.slice(0, Math.min(...kw))).length;
  const found = squad
    .map(p => ({ name: p.name, pos: findPlayer(text, p.name) }))
    .filter(x => x.pos >= 0);
  // preferăm numele scris după cuvântul-cheie
  const after = found.filter(x => x.pos >= kwPos).sort((a, b) => a.pos - b.pos);
  return (after[0] ?? found[0])?.name ?? null;
}

/** Adversarul din ultimul meci jucat până la data postării (pentru „POTM vs X”) */
function opponentBefore(matches, iso) {
  const t = new Date(iso).getTime() + 3600_000;
  const ours = matches
    .filter(m => (m.home === 'FC Basarabia' || m.away === 'FC Basarabia') && m.hg !== null)
    .filter(m => new Date(m.kickoff).getTime() <= t)
    .sort((a, b) => new Date(b.kickoff) - new Date(a.kickoff));
  const m = ours[0];
  return m ? (m.home === 'FC Basarabia' ? m.away : m.home) : null;
}

async function fetchPosts(token, userId) {
  const fields = 'caption,timestamp,permalink,media_type';
  let url = userId
    ? `https://graph.facebook.com/v21.0/${userId}/media?fields=${fields}&limit=50&access_token=${token}`
    : `https://graph.instagram.com/me/media?fields=${fields}&limit=50&access_token=${token}`;
  const posts = [];
  for (let page = 0; url && page < 3; page++) {
    const res = await fetch(url);
    const json = await res.json();
    if (!res.ok || json.error) throw new Error(`Instagram API: ${json.error?.message ?? res.status}`);
    posts.push(...json.data);
    url = json.paging?.next;
  }
  return posts.filter(p => p.caption).sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
}

/** Prelungește cheia (valabilă 60 de zile) — doar pentru varianta „Instagram Login” */
async function refreshToken(token) {
  const res = await fetch(`https://graph.instagram.com/refresh_access_token?grant_type=ig_refresh_token&access_token=${token}`);
  if (!res.ok) console.warn('! Nu am putut prelungi cheia Instagram (nu e grav dacă e o cheie permanentă).');
}

export function pickAwards(posts, squad, matches) {
  const out = {};
  for (const [key, patterns] of Object.entries(AWARDS)) {
    for (const post of posts) {
      const name = detect(post.caption, squad, patterns);
      if (!name) continue;
      out[key] = {
        name,
        date: post.timestamp.slice(0, 10),
        permalink: post.permalink,
        opponent: key === 'potm' ? opponentBefore(matches, post.timestamp) : null
      };
      break; // cea mai recentă postare câștigă
    }
  }
  return out;
}

if (process.argv[1]?.endsWith('update-instagram.mjs')) {
  const token = process.env.IG_ACCESS_TOKEN;
  if (!token) {
    console.log('IG_ACCESS_TOKEN lipsește — sar peste actualizarea din Instagram.');
    process.exit(0);
  }
  const league = JSON.parse(await readFile(LEAGUE, 'utf8'));
  const posts = await fetchPosts(token, process.env.IG_USER_ID);
  if (!process.env.IG_USER_ID) await refreshToken(token);

  const previous = JSON.parse(await readFile(OUT, 'utf8').catch(() => '{}'));
  const found = pickAwards(posts, league.squad, league.matches);
  // dacă într-o zi nu găsim o postare (ex. a fost ștearsă), păstrăm ultimul câștigător cunoscut
  const data = { ...previous, ...found };
  const json = JSON.stringify(data, null, 2) + '\n';

  if (json === JSON.stringify(previous, null, 2) + '\n') console.log('Instagram: nicio schimbare.');
  else {
    await writeFile(OUT, json);
    console.log(`✓ Instagram: Fan Favorite = ${data.fanFavorite?.name ?? '—'}, POTM = ${data.potm?.name ?? '—'}`);
  }
}
