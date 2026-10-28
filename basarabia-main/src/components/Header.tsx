'use client';

import { useEffect, useState } from 'react';
import Crest from './Crest';
import { club } from '@/data/club';
import { t, LANGS, LANG_PATH, LANG_LABEL, LANG_NAME, type Lang } from '@/i18n/dict';

const ANCHORS = ['meciuri', 'rezultate', 'clasament', 'lot', 'despre', 'contact'] as const;

/** Comutatorul de limbă RO · RU · EN */
function LangSwitch({ lang, big = false }: { lang: Lang; big?: boolean }) {
  return (
    <ul aria-label={t(lang).nav.language} className={`flex w-fit items-center rounded-full bg-white/[.06] p-1 ring-1 ring-white/10 ${big ? 'gap-1 text-base' : 'text-xs'}`}>
      {LANGS.map(l => (
        <li key={l}>
          <a
            href={LANG_PATH[l]}
            hrefLang={l}
            lang={l}
            title={LANG_NAME[l]}
            aria-current={l === lang ? 'page' : undefined}
            className={`block rounded-full font-bold tracking-wider transition ${big ? 'px-4 py-2' : 'px-2.5 py-1'} ${
              l === lang ? 'bg-white text-navy-950' : 'text-white/70 hover:text-white'
            }`}
          >
            {LANG_LABEL[l]}
          </a>
        </li>
      ))}
    </ul>
  );
}

export default function Header({ lang = 'ro' }: { lang?: Lang }) {
  const d = t(lang);
  const links = ANCHORS.map(a => ({ href: `#${a}`, label: d.nav.links[a] }));
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
  }, [open]);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-[background,box-shadow,backdrop-filter] duration-300 ${
        scrolled || open ? 'bg-navy-950/80 shadow-[0_1px_0_rgba(142,197,255,.12)] backdrop-blur-xl' : 'bg-transparent'
      }`}
    >
      <nav aria-label={d.nav.aria} className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:h-20 lg:px-8">
        <a href="#top" className="flex items-center gap-3" aria-label={`${club.name} — ${d.nav.home}`}>
          <Crest size={40} priority />
          <span className="display text-2xl text-white">{club.name}</span>
        </a>

        <ul className="hidden items-center gap-6 md:flex lg:gap-8">
          {links.map(l => (
            <li key={l.href}>
              <a href={l.href} className="text-sm font-semibold text-muted transition-colors hover:text-white">
                {l.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="hidden items-center gap-4 md:flex">
          <LangSwitch lang={lang} />
          <a
            href="#sustine"
            className="inline-flex rounded-full bg-brand px-5 py-2.5 text-sm font-bold text-white shadow-[0_8px_30px_-8px_rgba(10,109,254,.8)] transition hover:bg-brand-600"
          >
            {d.nav.support}
          </a>
        </div>

        <button
          type="button"
          className="inline-flex h-11 w-11 items-center justify-center rounded-full text-white md:hidden"
          aria-expanded={open}
          aria-controls="mobile-menu"
          aria-label={open ? d.nav.close : d.nav.open}
          onClick={() => setOpen(o => !o)}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
            {open ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
          </svg>
        </button>
      </nav>

      <div id="mobile-menu" hidden={!open} className="h-[calc(100dvh-4rem)] border-t border-white/10 bg-navy-950 px-6 py-8 md:hidden">
        <ul className="flex flex-col gap-2">
          {[...links, { href: '#sustine', label: d.nav.support }].map(l => (
            <li key={l.href}>
              <a href={l.href} onClick={() => setOpen(false)} className="display block py-2 text-5xl text-white">
                {l.label}
              </a>
            </li>
          ))}
        </ul>
        <div className="mt-8">
          <LangSwitch lang={lang} big />
        </div>
      </div>
    </header>
  );
}
