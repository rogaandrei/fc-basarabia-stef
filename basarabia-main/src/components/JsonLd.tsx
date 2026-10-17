import { club, fixtures, results, squad, SITE_URL } from '@/data/club';

const address = {
  '@type': 'PostalAddress',
  streetAddress: club.ground.street,
  addressLocality: club.ground.city,
  addressRegion: club.ground.region,
  addressCountry: club.ground.country
};

const place = { '@type': 'Place', name: club.ground.name, address };

const team = {
  '@type': 'SportsTeam',
  '@id': `${SITE_URL}/#team`,
  name: club.name,
  alternateName: [club.legalName, 'Basarabia'],
  sport: 'Minifotbal (Soccer)',
  foundingDate: String(club.founded),
  slogan: club.tagline,
  url: SITE_URL,
  logo: `${SITE_URL}/logo-512.png`,
  image: `${SITE_URL}/opengraph-image`,
  memberOf: { '@type': 'SportsOrganization', name: `${club.competition} — ${club.league}`, url: club.leagueUrl },
  coach: { '@type': 'Person', name: club.coach },
  athlete: squad.map(p => ({ '@type': 'Person', name: p.name })),
  location: place,
  sameAs: [club.instagram, club.formular230],
  sponsor: { '@type': 'Organization', name: 'Banu Sport' }
};

const toEvent = (e: { date: string; home: string; away: string }, extra: Record<string, unknown> = {}) => ({
  '@type': 'SportsEvent',
  name: `${e.home} vs ${e.away} — ${club.league}`,
  startDate: e.date,
  sport: 'Soccer',
  eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
  location: place,
  homeTeam: { '@type': 'SportsTeam', name: e.home },
  awayTeam: { '@type': 'SportsTeam', name: e.away },
  organizer: { '@id': `${SITE_URL}/#team` },
  ...extra
});

export default function JsonLd() {
  const graph = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebSite',
        '@id': `${SITE_URL}/#website`,
        url: SITE_URL,
        name: club.name,
        inLanguage: 'ro-RO',
        publisher: { '@id': `${SITE_URL}/#team` }
      },
      team,
      ...fixtures.map(f => toEvent(f, { eventStatus: 'https://schema.org/EventScheduled' })),
      ...results.map(r => toEvent(r, { eventStatus: 'https://schema.org/EventScheduled', description: `Scor final: ${r.home} ${r.homeGoals}–${r.awayGoals} ${r.away}` }))
    ]
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(graph).replace(/</g, '\\u003c') }}
    />
  );
}
