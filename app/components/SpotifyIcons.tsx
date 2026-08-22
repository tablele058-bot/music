export const Icons = {
  Home: (p: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" fill="currentColor" {...p}><path d="M12 3 2 12h3v8h6v-6h2v6h6v-8h3L12 3z" /></svg>
  ),
  Search: (p: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} {...p}><circle cx="11" cy="11" r="7" /><path d="M21 21 16.5 16.5" /></svg>
  ),
  Library: (p: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" fill="currentColor" {...p}><path d="M14 3v10.5a3.5 3.5 0 1 1-2 0V6.5l-7 2v10.5a3.5 3.5 0 1 1-2 0V5l9-3 2 .7z" /></svg>
  ),
  Plus: (p: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} {...p}><path d="M12 5v14M5 12h14" /></svg>
  ),
  Play: (p: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" fill="currentColor" {...p}><path d="M8 5.14v14l11-7-11-7z" /></svg>
  ),
  Pause: (p: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" fill="currentColor" {...p}><path d="M6 5h4v14H6zM14 5h4v14h-4z" /></svg>
  ),
  Next: (p: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" fill="currentColor" {...p}><path d="M6 18 14 12 6 6v12zM16 6h2v12h-2z" /></svg>
  ),
  Prev: (p: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" fill="currentColor" {...p}><path d="M18 6 10 12l8 6V6zM6 6h2v12H6z" /></svg>
  ),
  Shuffle: (p: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} {...p}><path d="M16 3h5v5M4 20l7-7M21 3l-7 7M16 21h5v-5M4 4l5 5M21 14l-5 5" /></svg>
  ),
  Repeat: (p: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} {...p}><path d="M17 1 21 5 17 9M21 5H9a4 4 0 0 0-4 4v1M7 23l-4-4 4-4M3 19h12a4 4 0 0 0 4-4v-1" /></svg>
  ),
  Heart: (p: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} {...p}><path d="M12 21s-6-4.35-8.5-8.02A4.5 4.5 0 0 1 12 5a4.5 4.5 0 0 1 8.5 7.98C18 16.65 12 21 12 21z" /></svg>
  ),
  Volume: (p: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} {...p}><path d="M11 5 6 9H2v6h4l5 4V5z" /><path d="M15.54 8.46a5 5 0 0 1 0 7.08M19 5a9 9 0 0 1 0 14" /></svg>
  ),
};
