import { allMatches, buildIcs } from '@/lib/calendar';

export const dynamic = 'force-static';

/** Calendarul complet, la care te poți abona: /calendar.ics */
export function GET() {
  return new Response(buildIcs(allMatches), {
    headers: { 'Content-Type': 'text/calendar; charset=utf-8' }
  });
}
