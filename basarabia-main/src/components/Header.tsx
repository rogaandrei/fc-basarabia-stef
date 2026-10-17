'use client';

import { useEffect, useState } from 'react';
import Crest from './Crest';
import { club } from '@/data/club';

const links = [
  { href: '#meciuri', label: 'Meciuri' },
  { href: '#rezultate', label: 'Rezultate' },
  { href: '#clasament', label: 'Clasament' },
  { href: '#lot', label: 'Echipa' },
  { href: '#despre', label: 'Despre' },
  { href: '#contact', label: 'Contact' }
];

export default function Header() {
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
      <nav aria-label="Navigare principală" className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:h-20 lg:px-8">
        <a href="#top" className="flex items-center gap-3" aria-label={`${club.name} — acasă`}>
          <Crest size={40} priority />
          <span className="display text-2xl text-white">{club.name}</span>
        </a>

        <ul className="hidden items-center gap-8 md:flex">
          {links.map(l => (
            <li key={l.href}>
              <a href={l.href} className="text-sm font-semibold text-muted transition-colors hover:text-white">
                {l.label}
              </a>
            </li>
          ))}
        </ul>

        <a
          href="#sustine"
          className="hidden rounded-full bg-brand px-5 py-2.5 text-sm font-bold text-white shadow-[0_8px_30px_-8px_rgba(10,109,254,.8)] transition hover:bg-brand-600 md:inline-flex"
        >
          Susține clubul
        </a>

        <button
          type="button"
          className="inline-flex h-11 w-11 items-center justify-center rounded-full text-white md:hidden"
          aria-expanded={open}
          aria-controls="mobile-menu"
          aria-label={open ? 'Închide meniul' : 'Deschide meniul'}
          onClick={() => setOpen(o => !o)}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
            {open ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
          </svg>
        </button>
      </nav>

      <div id="mobile-menu" hidden={!open} className="h-[calc(100dvh-4rem)] border-t border-white/10 bg-navy-950 px-6 py-8 md:hidden">
        <ul className="flex flex-col gap-2">
          {[...links, { href: '#sustine', label: 'Susține clubul' }].map(l => (
            <li key={l.href}>
              <a href={l.href} onClick={() => setOpen(false)} className="display block py-2 text-5xl text-white">
                {l.label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </header>
  );
}
