/**
 * Fan Favorite + Player of the Match — automat din postările @fc__basarabia
 *
 * Citește ultimele postări prin Instagram API și caută în descriere:
 *   • „Fan Favorite” / #FanFavorite                       → Fan Favorite
 *   • „MVP” / „Player of the Match” / #POTM / „Omul meciului” → Player of the Match (unul sau mai mulți)
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
import { readFile, writeFile, mkdir, readdir, unlink } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';

const OUT = fileURLToPath(new URL('../src/data/instagram-auto.json', import.meta.url));
const LEAGUE = fileURLToPath(new URL('../src/data/league-auto.json', import.meta.url));
/** Pozele postărilor (MVP / Fan Favorite) se salvează aici — linkurile Instagram expiră, deci le descărcăm */
const IMG_DIR = fileURLToPath(new URL('../public/instagram/', import.meta.url));

const AWARDS = {
  fanFavorite: [/fan\s*favou?rite/i, /#fanfav/i],
  potm: [/\bmvp\b/i, /player\s*of\s*the\s*match/i, /#?\bpotm\b/i, /omul\s+meciului/i, /jucătorul\s+meciului|jucatorul\s+meciului/i]
};

const fold = s =>
  s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/[^a-z0-9@#\s]/g, ' ').replace(/\s+/g, ' ');

/** Unde apare jucătorul în text (prenume+nume în orice ordine): { pos, len } sau pos -1 */
function matchPlayer(text, name) {
  const words = fold(name).split(' ').filter(Boolean);
  if (words.length < 2) return { pos: -1, len: 0 };
  const first = words.slice(0, -1).join(' ');
  const last = words.at(-1);
  const variants = [`${first} ${last}`, `${last} ${first}`, `${words[0]} ${last}`, `${last} ${words[0]}`];
  let best = { pos: -1, len: 0 };
  for (const v of variants) {
    const m = new RegExp(`(^|[^a-z])(${v})(?=[^a-z]|$)`).exec(text);
    if (m) {
      const pos = m.index + m[1].length;
      if (best.pos < 0 || pos < best.pos) best = { pos, len: v.length };
    }
  }
  return best;
}

/**
 * Jucătorii la care se referă premiul (pot fi mai mulți, ex. „MVP: Danu Garbuz și Viorel Ciugureanu”).
 * Se iau toți jucătorii din lot scriși pe primul rând de după cuvântul-cheie care conține nume;
 * dacă nu e niciunul după, se ia primul nume din toată descrierea.
 */
export function detect(caption, squad, patterns) {
  const hits = patterns.map(p => ({ i: caption.search(p), m: caption.match(p)?.[0] })).filter(h => h.i >= 0);
  if (!hits.length) return null;
  const first = hits.sort((a, b) => a.i - b.i)[0];
  /** Toți jucătorii dintr-un text, cu poziția și lungimea potrivirii */
  const namesIn = text => {
    const t = fold(text);
    return squad
      .map(p => ({ name: p.name, ...matchPlayer(t, p.name) }))
      .filter(x => x.pos >= 0)
      .sort((a, b) => a.pos - b.pos);
  };
  // după primul nume, mai luăm doar numele legate de el prin „și”, „&”, „+”, „,”, „and”
  const chain = (text, found) => {
    const t = fold(text);
    const out = [found[0]];
    for (const next of found.slice(1)) {
      const prev = out.at(-1);
      const between = t.slice(prev.pos + prev.len, next.pos);
      if (/^(\s|,|&|\+|\/|-|si|and)*$/.test(between.replace(/\b(si|and)\b/g, ' si '))) out.push(next);
      else break;
    }
    return out.map(x => x.name);
  };
  const label = /mvp/i.test(first.m) ? 'MVP' : null;
  const lines = caption.slice(first.i + first.m.length).split(/\n/);
  for (const line of lines) {
    const found = namesIn(line);
    if (found.length) return { names: chain(line, found), label };
  }
  const any = namesIn(caption);
  return any.length ? { names: [any[0].name], label } : null;
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
  const fields = 'id,caption,timestamp,permalink,media_type,media_url,thumbnail_url,children{media_type,media_url,thumbnail_url}';
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

/** Prima poză din postare (la carusel — primul element; la video — coperta) */
export function imageOf(post) {
  const first = post.children?.data?.[0] ?? post;
  return first.media_type === 'VIDEO' ? first.thumbnail_url ?? post.thumbnail_url : first.media_url ?? post.media_url;
}

/** Descarcă poza unui premiu în public/instagram/<cheie>-<id>.jpg și întoarce calea pentru site */
export async function saveImage(key, award) {
  if (!award?.imageSrc || !award.postId) return award?.image ?? null;
  const file = `${key}-${award.postId}.jpg`;
  const existing = await readdir(IMG_DIR).catch(() => []);
  if (!existing.includes(file)) {
    const res = await fetch(award.imageSrc);
    if (!res.ok) throw new Error(`Nu pot descărca poza pentru ${key}: HTTP ${res.status}`);
    await mkdir(IMG_DIR, { recursive: true });
    await writeFile(IMG_DIR + file, Buffer.from(await res.arrayBuffer()));
  }
  // șterge pozele vechi ale aceluiași premiu
  for (const f of existing) if (f.startsWith(`${key}-`) && f !== file) await unlink(IMG_DIR + f).catch(() => {});
  return `/instagram/${file}`;
}

export function pickAwards(posts, squad, matches) {
  const out = {};
  for (const [key, patterns] of Object.entries(AWARDS)) {
    for (const post of posts) {
      const found = detect(post.caption, squad, patterns);
      if (!found) continue;
      out[key] = {
        name: found.names[0],
        names: found.names,
        label: found.label,
        date: post.timestamp.slice(0, 10),
        permalink: post.permalink,
        postId: post.id,
        imageSrc: imageOf(post),
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
  for (const key of ['fanFavorite', 'potm']) {
    if (!data[key]) continue;
    data[key].image = await saveImage(key, data[key]);
    delete data[key].imageSrc; // linkul Instagram expiră — păstrăm doar fișierul descărcat
  }
  const json = JSON.stringify(data, null, 2) + '\n';

  if (json === JSON.stringify(previous, null, 2) + '\n') console.log('Instagram: nicio schimbare.');
  else {
    await writeFile(OUT, json);
    console.log(`✓ Instagram: Fan Favorite = ${data.fanFavorite?.name ?? '—'}, POTM = ${data.potm?.name ?? '—'}`);
  }
}
