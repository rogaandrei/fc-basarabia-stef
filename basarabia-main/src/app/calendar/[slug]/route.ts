import { allMatches, buildIcs, matchSlug, matchTitle } from '@/lib/calendar';

export const dynamic = 'force-static';
export const dynamicParams = false;

export function generateStaticParams() {
  return allMatches.map(m => ({ slug: `${matchSlug(m)}.ics` }));
}

/** Un singur meci, de descărcat: /calendar/etapa-11.ics */
export async function GET(_req: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const m = allMatches.find(x => `${matchSlug(x)}.ics` === slug);
  if (!m) return new Response('Not found', { status: 404 });
  return new Response(buildIcs([m], matchTitle(m)), {
    headers: { 'Content-Type': 'text/calendar; charset=utf-8' }
  });
}
