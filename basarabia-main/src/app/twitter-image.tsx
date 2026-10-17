import { ImageResponse } from 'next/og';
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { club } from '@/data/club';

export const dynamic = 'force-static';
export const alt = `${club.name} — ${club.tagline}`;
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function OG() {
  const dir = join(process.cwd(), 'node_modules/@fontsource/bebas-neue/files');
  const bebas = await readFile(join(dir, 'bebas-neue-latin-400-normal.woff'));
  const bebasExt = await readFile(join(dir, 'bebas-neue-latin-ext-400-normal.woff'));
  const logo = `data:image/png;base64,${(await readFile(join(process.cwd(), 'public/logo-512.png'))).toString('base64')}`;
  const stripes = 'repeating-linear-gradient(-55deg, #A2C6E0 0 14px, #fff 14px 22px, #0081F9 22px 36px, #0a2042 36px 50px)';
  return new ImageResponse(
    (
      <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', background: 'linear-gradient(135deg,#061630 0%,#0a2042 60%,#102b56 100%)', fontFamily: 'Bebas, BebasExt' }}>
        <div style={{ height: 22, width: '100%', backgroundImage: stripes }} />
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', padding: '0 70px', gap: 56 }}>
          <img src={logo} width={340} height={340} alt="" />
          <div style={{ display: 'flex', flexDirection: 'column', color: '#fff' }}>
            <div style={{ fontSize: 34, color: '#A2C6E0', letterSpacing: 4 }}>{`MINIFOTBAL · ${club.league.toUpperCase()} · TIMIȘOARA`}</div>
            <div style={{ fontSize: 150, lineHeight: 0.9, marginTop: 10 }}>FC BASARABIA</div>
            <div style={{ fontSize: 50, lineHeight: 1.05, marginTop: 18, maxWidth: 660 }}>PASIUNE DIN BASARABIA, VICTORIE ÎN ROMÂNIA.</div>
          </div>
        </div>
        <div style={{ height: 22, width: '100%', backgroundImage: stripes }} />
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: 'Bebas', data: bebas, style: 'normal', weight: 400 },
        { name: 'BebasExt', data: bebasExt, style: 'normal', weight: 400 }
      ]
    }
  );
}
