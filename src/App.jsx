import Gallery from '../pdf/components/Gallery';

export default function App() {
  return (
    <div className="min-h-screen bg-[var(--color-surface)]">
      {/* ── Header ────────────────────────────────────── */}
      <header className="sticky top-0 z-20 backdrop-blur-xl bg-[var(--color-surface)]/80 border-b border-white/[0.06]">
        <div className="max-w-6xl mx-auto px-6 sm:px-8 py-4 flex items-center justify-between">
          <h1
            className="text-xl sm:text-2xl font-extrabold tracking-tight"
            style={{ fontFamily: 'Outfit, sans-serif' }}
          >
            <span className="bg-gradient-to-r from-[var(--color-primary-light)] to-[var(--color-accent)] bg-clip-text text-transparent">
              Photo Gallery
            </span>
          </h1>
          <span className="text-[11px] tracking-wide uppercase text-[var(--color-text-muted)] hidden sm:inline">
            Powered by Picsum
          </span>
        </div>
      </header>

      {/* ── Main ──────────────────────────────────────── */}
      <main className="max-w-6xl mx-auto px-6 sm:px-8 py-8 sm:py-10">
        <Gallery />
      </main>
    </div>
  );
}
