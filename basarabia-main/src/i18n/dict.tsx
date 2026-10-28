/**
 * Textele site-ului în 2 limbi: română (implicit) și engleză.
 * Paginile: /  (RO) · /en/  (EN)
 * Ca să schimbi un text, îl modifici aici, în limba dorită.
 * Numele echipelor și ale jucătorilor rămân la fel în toate limbile.
 */
export type Lang = 'ro' | 'en';
export const LANGS: Lang[] = ['ro', 'en'];
export const LANG_PATH: Record<Lang, string> = { ro: '/', en: '/en/' };
export const LANG_LABEL: Record<Lang, string> = { ro: 'RO', en: 'EN' };
export const LANG_NAME: Record<Lang, string> = { ro: 'Română', en: 'English' };
export const LOCALE: Record<Lang, string> = { ro: 'ro-RO', en: 'en-GB' };
export const OG_LOCALE: Record<Lang, string> = { ro: 'ro_RO', en: 'en_GB' };

/** Rezultatul unui meci, din perspectiva unei echipe (cheile interne rămân V/E/Î) */
export type Outcome = 'V' | 'E' | 'Î';

/** Pluralul pentru „gol” în fiecare limbă */
export function goalsWord(lang: Lang, n: number) {
  if (lang === 'ro') return `${n} ${n === 1 ? 'gol' : 'goluri'}`;
  return `${n} ${n === 1 ? 'goal' : 'goals'}`;
}

const ro = {
  meta: {
    title: 'FC Basarabia — Minifotbal Timișoara | Liga III-B',
    description:
      'FC Basarabia — echipa de minifotbal a basarabenilor din Timișoara, fondată în 2023. Program, rezultate și clasament Liga III-B Alborz Timiș, lotul echipei și cum poți susține clubul (Formular 230 – 3,5%).'
  },
  league: 'Liga III-B',
  competition: 'Campionatul Județean de Minifotbal Alborz – Timiș',
  tagline: 'Pasiune din Basarabia, victorie în România.',
  kit: 'Gri / Albastru',
  chant: 'Hai, FC Basarabia!',
  nav: {
    aria: 'Navigare principală',
    home: 'acasă',
    links: { meciuri: 'Meciuri', rezultate: 'Rezultate', clasament: 'Clasament', lot: 'Echipa', despre: 'Despre', contact: 'Contact' },
    support: 'Susține clubul',
    open: 'Deschide meniul',
    close: 'Închide meniul',
    language: 'Limba'
  },
  hero: {
    kicker: 'Minifotbal · Liga III-B · Timișoara',
    line1: 'Pasiune din Basarabia,',
    line2: 'victorie în România.',
    intro: (league: string) => (
      <>
        Suntem <strong className="font-semibold text-white">FC Basarabia</strong>, echipa basarabenilor din Timișoara. Jucăm minifotbal
        în {league}, luptăm pentru fiecare minge și ducem cu noi, pe teren, povestea de acasă.
      </>
    ),
    fixturesCta: 'Programul meciurilor',
    nextMatch: 'Următorul meci',
    round: (n: number) => `Etapa ${n}`,
    vs: 'contra',
    at: (t: string) => `ora ${t}`
  },
  countdown: { units: ['zile', 'ore', 'min', 'sec'], live: 'Meciul a început — Hai, FC Basarabia!' },
  ticker: ['Hai FC Basarabia ✦ Liga III-B ✦ ', 'Pasiune ✦ Comunitate ✦ Victorie ✦ '],
  stats: {
    aria: 'Sezonul în cifre',
    kicker: (league: string, round: number) => `Sezonul curent · ${league} · după etapa ${round}`,
    position: 'Loc în clasament',
    points: 'Puncte',
    goals: 'Goluri marcate',
    wdl: 'Victorii · Egaluri · Înfrângeri'
  },
  fixtures: {
    kicker: 'Program tur',
    title: 'Meciurile care urmează',
    sub: (place: string) => `Toate meciurile se joacă pe ${place}. Vino cu prietenii și susține echipa!`,
    row: (round: number, date: string, time: string) => `Etapa ${round} · ${date} · ora ${time}`,
    home: 'Gazde',
    away: 'Oaspeți',
    addToCal: 'În calendar',
    note: (league: React.ReactNode, ig: React.ReactNode) => (
      <>
        Programul poate suferi modificări. Varianta oficială e pe {league} și pe {ig}.
      </>
    ),
    leagueSite: 'site-ul ligii'
  },
  calendar: {
    title: 'Meciurile în calendarul tău',
    text: 'Abonează-te o dată și toate meciurile FC Basarabia apar singure în calendar, cu reminder cu 2 ore înainte. Dacă se schimbă programul, se actualizează automat.',
    download: 'Descarcă .ics'
  },
  results: {
    kicker: 'Final de meci',
    title: 'Rezultate',
    round: (n: number, d: string) => `Etapa ${n} · ${d}`,
    roundShort: (n: number, d: string) => `Et. ${n} · ${d}`,
    scorersSr: 'Marcatori FC Basarabia: '
  },
  outcome: { V: 'Victorie', E: 'Egal', Î: 'Înfrângere' } as Record<Outcome, string>,
  outcomeLetter: { V: 'V', E: 'E', Î: 'Î' } as Record<Outcome, string>,
  standings: {
    title: (league: string) => `Clasament ${league}`,
    caption: (league: string, round: number) => `Clasament ${league} după etapa ${round}, cu forma din ultimele 5 meciuri`,
    cols: { team: 'Echipa', p: 'M', w: 'V', d: 'E', l: 'Î', goals: 'Golaveraj', form: 'Forma echipei', pts: 'Pct' },
    colTitles: { p: 'Meciuri', w: 'Victorii', d: 'Egaluri', l: 'Înfrângeri', goals: 'Goluri marcate:primite' },
    formAria: (team: string) => `Forma ${team}, de la cel mai vechi la cel mai recent meci`,
    legendAria: 'Legenda clasamentului',
    zones: {
      promo: 'Promovare directă în Liga II',
      promoPlayoff: 'Baraj de promovare în Liga II',
      relegPlayoff: 'Baraj de menținere în Liga III',
      releg: 'Retrogradare în Liga IV'
    },
    place: (a: number) => `locul ${a}`,
    places: (a: number, b: number) => `locurile ${a}–${b}`,
    formNote: 'Forma echipei (ultimele 5 meciuri): treci cu mouse-ul (sau atinge) un cerc ca să vezi scorul.',
    tooltipRound: (n: number, d: string) => `Etapa ${n} · ${d}`,
    source: 'Sursa: alborzminifotbal.ro →'
  },
  spotlight: {
    kicker: 'Lotul',
    title: 'Jucători în formă',
    badges: { mvp: 'MVP', fan: 'Fan Favorite', top: 'Golgheter' },
    roles: { mvp: 'MVP-ul meciului', fan: 'Ales de fani', top: 'Golgheterul echipei', playerCoach: 'Antrenor-jucător' },
    mvpVs: (opp: string) => `MVP vs ${opp}`,
    fanVoted: 'Votat Fan Favorite de suporteri',
    inLeague: (goals: string) => `${goals} în campionat`,
    leagueRank: (n: number, league: string) => `locul ${n} în ${league}`,
    tied: (names: string) => ` (la egalitate cu ${names})`,
    viewPost: 'Vezi postarea pe Instagram →'
  },
  squad: {
    kicker: (n: number) => `Lot legitimat · ${n} jucători`,
    title: 'Echipa',
    coach: 'Antrenor',
    delegates: 'Delegați',
    colors: 'Culori',
    viewStats: 'Vezi statistici',
    registered: 'FC Basarabia · Lot legitimat',
    photo: (n: string) => `Fotografie ${n}`,
    close: 'Închide',
    stat: { goals: 'Goluri', yellow: 'Galbene', red: 'Roșii' },
    teamRank: (rank: number, share: number) => (
      <>
        Locul <strong className="text-white">{rank}</strong> în topul marcatorilor echipei · <strong className="text-white">{share}%</strong> din
        golurile noastre
      </>
    ),
    leagueRank: (rank: number, total: number, league: string) => (
      <>
        Locul <strong className="text-white">{rank}</strong> din {total} marcatori în golgheterii {league}
      </>
    ),
    noGoals: 'Încă fără gol în acest sezon — vine și primul!',
    scoredIn: 'A marcat în',
    roundShort: (n: number) => `Et. ${n} · `,
    partial: 'Marcatorii pe meci sunt trecuți doar pentru unele etape.'
  },
  positions: { Portar: 'Portar', Fundaș: 'Fundaș', Mijlocaș: 'Mijlocaș', Atacant: 'Atacant' } as Record<string, string>,
  about: {
    kicker: 'Despre noi',
    title: 'Mai mult decât o echipă',
    p1: (legal: string, year: number) => (
      <>
        <strong className="text-white">{legal}</strong> a pornit în {year} cu un gând simplu: să jucăm fotbal împreună, departe de casă, dar cu
        casa în suflet.
      </>
    ),
    p2: (league: string) =>
      `Astăzi jucăm în ${league} a campionatului județean de minifotbal Alborz din Timiș și suntem o comunitate care sărbătorește împreună — de la Ziua Chișinăului la Ziua Națională a Vinului. Tricoul nostru poartă motive tradiționale, iar pe teren purtăm numele Basarabiei cu mândrie.`,
    values: [
      { t: 'Pasiune', d: 'Jucăm fiecare minge ca pe ultima. Indiferent de scor, nu renunțăm.', i: '🔥' },
      { t: 'Comunitate', d: 'Un punct de întâlnire pentru basarabenii din România și prietenii lor.', i: '🤝' },
      { t: 'Tradiție', d: 'Valorile, portul și gustul autentic al Moldovei — și pe tricou, și în vestiar.', i: '🍇' },
      { t: 'Fair-play', d: 'Respect pentru adversari, arbitri și suporteri. Mereu.', i: '💙' }
    ]
  },
  support: {
    kicker: 'Susține FC Basarabia',
    title: 'Redirecționează 3,5% din impozit. Gratuit.',
    text: 'Prin Formularul 230 poți direcționa către club 3,5% din impozitul pe venit, fără niciun cost pentru tine. Fiecare redirecționare ajută clubul să crească.',
    steps: ['Deschide formularul online', 'Completează datele (2 minute)', 'Semnează și trimite'],
    cta: 'Completează Formularul 230',
    partner: 'Devino partener',
    sponsorsKicker: 'Cu sprijinul',
    sponsorNote: 'Partener oficial',
    yourPlace: 'Locul tău aici?',
    writeUs: 'Scrie-ne'
  },
  contact: {
    kicker: 'Contact',
    title: 'Ne vedem pe teren',
    sub: 'Scrie-ne, urmărește-ne sau vino direct la meci. Orice susținere contează.',
    community: 'Comunitatea FC Basarabia',
    supporterTitle: 'Devino suporter FC Basarabia',
    supporterText:
      'Intră în grupul suporterilor pe WhatsApp: programul meciurilor, rezultate pe loc, poze și invitații la evenimentele comunității. Vino în tribună și susține-ne!',
    supporterCta: 'Intră în grupul suporterilor',
    ground: 'Teren',
    groundCta: 'Deschide în Google Maps →',
    emailText: 'parteneriate, presă, sponsorizări.',
    emailCta: 'Scrie-ne →',
    igText: 'noutăți, poze și culise de la fiecare meci.',
    igCta: 'Urmărește-ne →',
    fbText: 'FC Basarabia pe Facebook — anunțuri, poze și evenimentele comunității.',
    fbCta: 'Dă like paginii →',
    ytText: 'rezumate, goluri și momente de la meciuri.',
    ytCta: 'Abonează-te →'
  },
  footer: { social: 'Rețele sociale', whatsapp: 'Grupul suporterilor pe WhatsApp' }
};

export type Dict = typeof ro;

const en: Dict = {
  meta: {
    title: 'FC Basarabia — Minifootball in Timișoara | Liga III-B',
    description:
      'FC Basarabia — the minifootball team of Basarabians in Timișoara, founded in 2023. Fixtures, results and the Liga III-B (Alborz, Timiș) table, the squad and how to support the club.'
  },
  league: 'Liga III-B',
  competition: 'Alborz Timiș County Minifootball Championship',
  tagline: 'Passion from Basarabia, victory in Romania.',
  kit: 'Grey / Blue',
  chant: 'Come on, FC Basarabia!',
  nav: {
    aria: 'Main navigation',
    home: 'home',
    links: { meciuri: 'Fixtures', rezultate: 'Results', clasament: 'Table', lot: 'Squad', despre: 'About', contact: 'Contact' },
    support: 'Support the club',
    open: 'Open menu',
    close: 'Close menu',
    language: 'Language'
  },
  hero: {
    kicker: 'Minifootball · Liga III-B · Timișoara',
    line1: 'Passion from Basarabia,',
    line2: 'victory in Romania.',
    intro: (league: string) => (
      <>
        We are <strong className="font-semibold text-white">FC Basarabia</strong>, the Basarabian team of Timișoara. We play minifootball in{' '}
        {league}, fight for every ball and carry the story of home onto the pitch.
      </>
    ),
    fixturesCta: 'Match schedule',
    nextMatch: 'Next match',
    round: (n: number) => `Matchday ${n}`,
    vs: 'versus',
    at: (t: string) => t
  },
  countdown: { units: ['days', 'hrs', 'min', 'sec'], live: 'Kick-off! Come on, FC Basarabia!' },
  ticker: ['Come on FC Basarabia ✦ Liga III-B ✦ ', 'Passion ✦ Community ✦ Victory ✦ '],
  stats: {
    aria: 'The season in numbers',
    kicker: (league: string, round: number) => `Current season · ${league} · after matchday ${round}`,
    position: 'League position',
    points: 'Points',
    goals: 'Goals scored',
    wdl: 'Wins · Draws · Losses'
  },
  fixtures: {
    kicker: 'Fixtures',
    title: 'Upcoming matches',
    sub: (place: string) => `All matches are played at ${place}. Bring your friends and support the team!`,
    row: (round: number, date: string, time: string) => `Matchday ${round} · ${date} · ${time}`,
    home: 'Home',
    away: 'Away',
    addToCal: 'Add to calendar',
    note: (league: React.ReactNode, ig: React.ReactNode) => (
      <>
        The schedule may change. The official version is on the {league} and on {ig}.
      </>
    ),
    leagueSite: 'league website'
  },
  calendar: {
    title: 'Matches in your calendar',
    text: 'Subscribe once and every FC Basarabia match appears in your calendar automatically, with a reminder 2 hours before. If the schedule changes, it updates by itself.',
    download: 'Download .ics'
  },
  results: {
    kicker: 'Full time',
    title: 'Results',
    round: (n: number, d: string) => `Matchday ${n} · ${d}`,
    roundShort: (n: number, d: string) => `MD ${n} · ${d}`,
    scorersSr: 'FC Basarabia scorers: '
  },
  outcome: { V: 'Win', E: 'Draw', Î: 'Loss' },
  outcomeLetter: { V: 'W', E: 'D', Î: 'L' },
  standings: {
    title: (league: string) => `${league} table`,
    caption: (league: string, round: number) => `${league} table after matchday ${round}, with each team's form over the last 5 matches`,
    cols: { team: 'Team', p: 'P', w: 'W', d: 'D', l: 'L', goals: 'Goals', form: 'Form', pts: 'Pts' },
    colTitles: { p: 'Played', w: 'Won', d: 'Drawn', l: 'Lost', goals: 'Goals for:against' },
    formAria: (team: string) => `${team} form, from oldest to most recent match`,
    legendAria: 'Table key',
    zones: {
      promo: 'Direct promotion to Liga II',
      promoPlayoff: 'Promotion play-off (Liga II)',
      relegPlayoff: 'Relegation play-off (Liga III)',
      releg: 'Relegation to Liga IV'
    },
    place: (a: number) => `place ${a}`,
    places: (a: number, b: number) => `places ${a}–${b}`,
    formNote: 'Form (last 5 matches): hover over or tap a circle to see the score.',
    tooltipRound: (n: number, d: string) => `Matchday ${n} · ${d}`,
    source: 'Source: alborzminifotbal.ro →'
  },
  spotlight: {
    kicker: 'The squad',
    title: 'Players in form',
    badges: { mvp: 'MVP', fan: 'Fan Favourite', top: 'Top scorer' },
    roles: { mvp: 'Player of the match', fan: 'Chosen by the fans', top: "Team's top scorer", playerCoach: 'Player-coach' },
    mvpVs: (opp: string) => `MVP vs ${opp}`,
    fanVoted: 'Voted Fan Favourite by the supporters',
    inLeague: (goals: string) => `${goals} in the league`,
    leagueRank: (n: number, league: string) => `no. ${n} in ${league}`,
    tied: (names: string) => ` (level with ${names})`,
    viewPost: 'View the Instagram post →'
  },
  squad: {
    kicker: (n: number) => `Registered squad · ${n} players`,
    title: 'The squad',
    coach: 'Coach',
    delegates: 'Team officials',
    colors: 'Colours',
    viewStats: 'View stats',
    registered: 'FC Basarabia · Registered squad',
    photo: (n: string) => `Photo of ${n}`,
    close: 'Close',
    stat: { goals: 'Goals', yellow: 'Yellow', red: 'Red' },
    teamRank: (rank: number, share: number) => (
      <>
        No. <strong className="text-white">{rank}</strong> among the team&apos;s scorers · <strong className="text-white">{share}%</strong> of our
        goals
      </>
    ),
    leagueRank: (rank: number, total: number, league: string) => (
      <>
        No. <strong className="text-white">{rank}</strong> of {total} scorers in {league}
      </>
    ),
    noGoals: 'No goals yet this season — the first one is on its way!',
    scoredIn: 'Scored in',
    roundShort: (n: number) => `MD ${n} · `,
    partial: 'Match scorers are listed for some matchdays only.'
  },
  positions: { Portar: 'Goalkeeper', Fundaș: 'Defender', Mijlocaș: 'Midfielder', Atacant: 'Forward' },
  about: {
    kicker: 'About us',
    title: 'More than a team',
    p1: (legal: string, year: number) => (
      <>
        <strong className="text-white">{legal}</strong> started in {year} with a simple idea: to play football together, far from home but with home
        in our hearts.
      </>
    ),
    p2: (league: string) =>
      `Today we play in ${league} of the Alborz Timiș County Minifootball Championship, and we are a community that celebrates together — from Chișinău Day to National Wine Day. Our shirt carries traditional patterns, and on the pitch we wear the name of Basarabia with pride.`,
    values: [
      { t: 'Passion', d: 'We play every ball as if it were the last. Whatever the score, we never give up.', i: '🔥' },
      { t: 'Community', d: 'A meeting point for Basarabians in Romania and their friends.', i: '🤝' },
      { t: 'Tradition', d: 'The values, costume and authentic taste of Moldova — on the shirt and in the dressing room.', i: '🍇' },
      { t: 'Fair play', d: 'Respect for opponents, referees and supporters. Always.', i: '💙' }
    ]
  },
  support: {
    kicker: 'Support FC Basarabia',
    title: 'Redirect 3.5% of your income tax. For free.',
    text: 'If you pay income tax in Romania, Form 230 lets you direct 3.5% of it to the club at no cost to you. Every redirection helps the club grow.',
    steps: ['Open the online form', 'Fill in your details (2 minutes)', 'Sign and send'],
    cta: 'Fill in Form 230',
    partner: 'Become a partner',
    sponsorsKicker: 'Supported by',
    sponsorNote: 'Official partner',
    yourPlace: 'Your brand here?',
    writeUs: 'Get in touch'
  },
  contact: {
    kicker: 'Contact',
    title: 'See you on the pitch',
    sub: 'Write to us, follow us or come straight to a match. Every bit of support counts.',
    community: 'The FC Basarabia community',
    supporterTitle: 'Become an FC Basarabia supporter',
    supporterText:
      "Join the supporters' group on WhatsApp: match schedule, live results, photos and invitations to community events. Come to the stands and cheer us on!",
    supporterCta: "Join the supporters' group",
    ground: 'Pitch',
    groundCta: 'Open in Google Maps →',
    emailText: 'partnerships, press, sponsorship.',
    emailCta: 'Write to us →',
    igText: 'news, photos and behind the scenes from every match.',
    igCta: 'Follow us →',
    fbText: 'FC Basarabia on Facebook — announcements, photos and community events.',
    fbCta: 'Like the page →',
    ytText: 'highlights, goals and match moments.',
    ytCta: 'Subscribe →'
  },
  footer: { social: 'Social media', whatsapp: "Supporters' group on WhatsApp" }
};

export const DICT: Record<Lang, Dict> = { ro, en };
export const t = (lang: Lang) => DICT[lang];

/** Formatarea datelor în limba paginii, la ora României */
export function fmtFor(lang: Lang) {
  const loc = LOCALE[lang];
  const tz = 'Europe/Bucharest';
  const long = new Intl.DateTimeFormat(loc, { weekday: 'long', day: 'numeric', month: 'long', timeZone: tz });
  const short = new Intl.DateTimeFormat(loc, { day: '2-digit', month: 'short', timeZone: tz });
  const time = new Intl.DateTimeFormat(loc, { hour: '2-digit', minute: '2-digit', hour12: false, timeZone: tz });
  const day = new Intl.DateTimeFormat(loc, { day: '2-digit', timeZone: tz });
  const mon = new Intl.DateTimeFormat(loc, { month: 'short', timeZone: tz });
  return {
    long: (iso: string) => long.format(new Date(iso)),
    short: (iso: string) => short.format(new Date(iso)).replace('.', ''),
    time: (iso: string) => time.format(new Date(iso)),
    day: (iso: string) => day.format(new Date(iso)),
    mon: (iso: string) => mon.format(new Date(iso)).replace('.', '')
  };
}
