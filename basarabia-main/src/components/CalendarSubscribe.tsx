'use client';

import { useEffect, useState } from 'react';
import { t, type Lang } from '@/i18n/dict';

/** Butoanele de abonare la calendarul meciurilor (se actualizează singur în telefon / Google) */
export default function CalendarSubscribe({ fallbackHost, lang = 'ro' }: { fallbackHost: string; lang?: Lang }) {
  const d = t(lang).calendar;
  const [host, setHost] = useState(fallbackHost);
  useEffect(() => setHost(window.location.host), []);

  const https = `https://${host}/calendar.ics`;
  const webcal = `webcal://${host}/calendar.ics`;
  const links = [
    { label: 'Google Calendar', href: `https://calendar.google.com/calendar/r?cid=${encodeURIComponent(webcal)}` },
    { label: 'iPhone / Apple', href: webcal },
    {
      label: 'Outlook',
      href: `https://outlook.live.com/calendar/0/addfromweb?url=${encodeURIComponent(https)}&name=${encodeURIComponent('FC Basarabia')}`
    },
    { label: d.download, href: '/calendar.ics', download: true }
  ];

  return (
    <div className="mb-5 flex flex-col gap-4 rounded-3xl bg-white/[.04] p-6 ring-1 ring-white/10 sm:p-8 lg:flex-row lg:items-center lg:justify-between">
      <div className="flex items-start gap-4">
        <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-brand text-white" aria-hidden="true">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="4.5" width="18" height="16" rx="3" />
            <path d="M3 9.5h18M8 2.5v4M16 2.5v4M12 13v5M9.5 15.5h5" />
          </svg>
        </span>
        <div>
          <h3 className="display text-2xl text-white sm:text-3xl">{d.title}</h3>
          <p className="mt-1 max-w-md text-sm text-muted">{d.text}</p>
        </div>
      </div>
      <ul className="flex flex-wrap gap-2">
        {links.map(l => (
          <li key={l.label}>
            <a
              href={l.href}
              {...(l.download ? { download: 'fc-basarabia-meciuri.ics' } : { target: '_blank', rel: 'noopener noreferrer' })}
              className="inline-flex items-center rounded-full bg-white/10 px-4 py-2 text-sm font-semibold text-white ring-1 ring-white/15 transition hover:bg-brand hover:ring-brand"
            >
              {l.label}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
