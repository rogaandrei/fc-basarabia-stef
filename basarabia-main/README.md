# FC Basarabia — site oficial

Landing page static, rapid și optimizat SEO, construit cu **Next.js 15 (static export) + Tailwind CSS 4** și componente **React Bits**.

## Pornire

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # generează site-ul static în /out
```

Folderul `out/` se poate urca pe orice hosting static: **Vercel**, **Netlify**, **Cloudflare Pages**, GitHub Pages sau cPanel (prin FTP).

Setează domainul real înainte de build (pentru canonical, sitemap, Open Graph):

```bash
NEXT_PUBLIC_SITE_URL=https://domeniul-vostru.ro npm run build
```

## Actualizarea conținutului

Totul e în **`src/data/club.ts`**:

- `results` — rezultate (cele mai noi primele)
- `standings` + `standingsRound` — clasamentul Liga III-B
- `squad` — lotul (goluri, cartonașe)
- `fixtures` — program (meciurile trecute dispar automat la build)
- `spotlightPlayers` — jucători în evidență (Fan Favorite, Player of the Match)
- `sponsors` — parteneri
- `club.email` — completați-l dacă aveți unul oficial

Statisticile (loc, puncte, goluri) se calculează automat din `standings`. Sursa oficială: https://www.alborzminifotbal.ro — refaceți build-ul după fiecare etapă.

## Sigla

`src/components/Crest.tsx` este o emblemă provizorie în stilul siglei. Înlocuiți-o cu sigla oficială (SVG ideal) și actualizați `src/app/icon.svg`.

## Ce e inclus pentru SEO

- `lang="ro"`, titlu/descriere/keywords, canonical, Open Graph + Twitter card
- Imagine OG generată automat (`/opengraph-image`) cu culorile clubului
- Date structurate JSON-LD: `SportsTeam`, `WebSite`, `SportsEvent` (meciuri + rezultate)
- `sitemap.xml`, `robots.txt`, `manifest.webmanifest`, favicon + apple-touch-icon
- HTML pre-randat (conținutul e vizibil pentru Google fără JavaScript)
- Fonturi self-hosted cu preload, fără request-uri externe; `prefers-reduced-motion` respectat

## Componente React Bits folosite

`SplitText` (titlul din hero), `ShinyText`, `Aurora` (fundal hero, încărcat lazy), `ScrollVelocity` (banda „Hai FC Basarabia”), `CountUp`, `SpotlightCard` (rezultate, jucători), `Magnet` (butoane CTA), `GradientText`.
Sursele sunt în `src/components/reactbits/`.

## După lansare

1. Adăugați site-ul în **Google Search Console** și trimiteți `sitemap.xml`.
2. Puneți linkul site-ului în bio-ul de Instagram.
3. Creați un profil **Google Business** cu adresa terenului.
# basarabia
