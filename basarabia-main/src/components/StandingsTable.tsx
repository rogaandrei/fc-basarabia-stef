/* eslint-disable @next/next/no-img-element */
import { club, standings, standingsRound, isOurs, ZONES, type Zone } from '@/data/club';

/** Locurile dintr-o zonă, ex. „1–3”, „4”, „14–16” */
function places(zone: Zone) {
  const idx = standings.map((r, i) => (r.zone === zone ? i + 1 : 0)).filter(Boolean);
  if (!idx.length) return '';
  const a = idx[0];
  const b = idx[idx.length - 1];
  return a === b ? `locul ${a}` : `locurile ${a}–${b}`;
}

export default function StandingsTable() {
  const zonesShown = (Object.keys(ZONES) as Zone[]).filter(z => standings.some(r => r.zone === z));

  return (
    <>
      <div className="overflow-x-auto rounded-3xl ring-1 ring-white/10">
        <table className="w-full text-left text-[13px] tabular-nums sm:min-w-[560px] sm:text-sm">
          <caption className="sr-only">
            Clasament {club.league} după etapa {standingsRound}
          </caption>
          <thead className="bg-navy-900 text-[11px] font-bold uppercase tracking-[.16em] text-muted">
            <tr>
              <th scope="col" className="w-9 px-2 py-3 text-center sm:w-12 sm:px-4">#</th>
              <th scope="col" className="px-1.5 py-3 sm:px-2">Echipa</th>
              <th scope="col" className="px-1.5 py-3 sm:px-2 text-center" title="Meciuri jucate">M</th>
              <th scope="col" className="px-1.5 py-3 sm:px-2 text-center" title="Victorii">V</th>
              <th scope="col" className="px-1.5 py-3 sm:px-2 text-center" title="Egaluri">E</th>
              <th scope="col" className="px-1.5 py-3 sm:px-2 text-center" title="Înfrângeri">Î</th>
              <th scope="col" className="hidden px-1.5 py-3 sm:px-2 text-center sm:table-cell" title="Goluri marcate:primite">Golaveraj</th>
              <th scope="col" className="px-1.5 py-3 sm:px-2 text-center" title="Diferența de goluri">+/-</th>
              <th scope="col" className="px-2 py-3 text-center sm:px-4">Pct</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {standings.map((row, i) => {
              const ours = isOurs(row.team);
              const zone = row.zone ? ZONES[row.zone] : null;
              const diff = row.gf - row.ga;
              return (
                <tr
                  key={row.team}
                  aria-current={ours ? 'true' : undefined}
                  className={`transition-colors ${
                    ours ? 'bg-brand/20 font-bold text-white' : `${zone?.tint ?? ''} text-ink/85 hover:bg-white/[.03]`
                  }`}
                >
                  <td className="relative px-2 py-3 text-center sm:px-4">
                    {zone && <span className={`absolute inset-y-1.5 left-0 w-1.5 rounded-r ${zone.bar}`} aria-hidden="true" />}
                    {i + 1}
                    {zone && <span className="sr-only"> ({zone.label})</span>}
                  </td>
                  <th scope="row" className="px-1.5 py-3 sm:px-2 font-semibold">
                    <span className="flex items-center gap-2 leading-tight">
                      {ours && <img src="/logo-128.webp" width={22} height={22} alt="" className="shrink-0" />}
                      {row.team}
                    </span>
                  </th>
                  <td className="px-1.5 py-3 sm:px-2 text-center">{row.p}</td>
                  <td className="px-1.5 py-3 sm:px-2 text-center">{row.w}</td>
                  <td className="px-1.5 py-3 sm:px-2 text-center">{row.d}</td>
                  <td className="px-1.5 py-3 sm:px-2 text-center">{row.l}</td>
                  <td className="hidden px-1.5 py-3 sm:px-2 text-center sm:table-cell">
                    {row.gf}:{row.ga}
                  </td>
                  <td className={`px-1.5 py-3 sm:px-2 text-center ${diff > 0 ? 'text-emerald-300' : diff < 0 ? 'text-rose-300' : ''}`}>
                    {diff > 0 ? `+${diff}` : diff}
                  </td>
                  <td className="display px-2 py-3 text-center text-xl text-white sm:px-4">{row.pts}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Legenda culorilor */}
      <ul className="mt-5 grid grid-cols-2 gap-2 sm:gap-3 lg:grid-cols-4" aria-label="Legenda clasamentului">
        {zonesShown.map(z => (
          <li key={z} className="flex items-center gap-3 rounded-2xl bg-white/[.03] px-3 py-3 ring-1 ring-white/10 sm:px-4">
            <span className={`h-8 w-1.5 shrink-0 rounded ${ZONES[z].bar}`} aria-hidden="true" />
            <span className="text-sm leading-tight">
              <span className="block text-[13px] font-semibold text-white sm:text-sm">{ZONES[z].label}</span>
              <span className="block text-xs capitalize text-muted">{places(z)}</span>
            </span>
          </li>
        ))}
      </ul>
    </>
  );
}
