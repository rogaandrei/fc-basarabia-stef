/* eslint-disable @next/next/no-img-element */
/** Sigla oficială FC Basarabia (public/logo-*.webp) */
export default function Crest({ size = 48, className = '', title = 'Sigla FC Basarabia', priority = false }: { size?: number; className?: string; title?: string; priority?: boolean }) {
  const src = size <= 64 ? '/logo-128.webp' : size <= 160 ? '/logo-256.webp' : '/logo-512.webp';
  return (
    <img
      src={src}
      srcSet="/logo-128.webp 128w, /logo-256.webp 256w, /logo-512.webp 512w"
      sizes={`${size}px`}
      width={size}
      height={size}
      alt={title}
      aria-hidden={title ? undefined : true}
      loading={priority ? 'eager' : 'lazy'}
      decoding="async"
      className={`shrink-0 select-none ${className}`}
      draggable={false}
    />
  );
}
