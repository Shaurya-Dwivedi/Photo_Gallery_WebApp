import { useState, useEffect } from 'react';

export default function PhotoCard({ photo, isFavourite, onToggleFavourite, index }) {
  const [animating, setAnimating] = useState(false);
  const [loaded, setLoaded] = useState(false);
  // React-controlled entrance: immune to CSS animation restarts on DevTools resize
  const [show, setShow] = useState(false);

  useEffect(() => {
    const id = setTimeout(() => setShow(true), Math.min(index * 40, 400));
    return () => clearTimeout(id);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // intentionally empty — run once on mount only

  const handleHeart = () => {
    setAnimating(true);
    onToggleFavourite(photo.id);
    setTimeout(() => setAnimating(false), 350);
  };

  return (
    <div
      className={`group relative rounded-xl overflow-hidden bg-[var(--color-surface-light)] ring-1 ring-white/[0.06] transition-all duration-[350ms] ease-out hover:shadow-xl hover:shadow-black/30 ${
        show ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3'
      }`}
    >
      {/* ── Image ──────────────────────────────────── */}
      <div className="relative aspect-[4/3] overflow-hidden bg-[var(--color-surface-lighter)]">
        {!loaded && <div className="absolute inset-0 skeleton" />}
        <img
          src={`https://picsum.photos/id/${photo.id}/600/450`}
          alt={`Photo by ${photo.author}`}
          className={`w-full h-full object-cover transition-all duration-500 group-hover:scale-[1.04] ${loaded ? 'opacity-100' : 'opacity-0'}`}
          onLoad={() => setLoaded(true)}
          onError={() => setLoaded(true)}
        />

        {/* Heart overlay */}
        <button
          onClick={handleHeart}
          aria-label={isFavourite ? `Unfavourite photo by ${photo.author}` : `Favourite photo by ${photo.author}`}
          className={`absolute top-2.5 right-2.5 p-2 rounded-full backdrop-blur-md transition-all duration-200 cursor-pointer
            ${isFavourite
              ? 'bg-[var(--color-accent)]/20 text-[var(--color-accent)]'
              : 'bg-black/30 text-white/60 lg:opacity-0 group-hover:opacity-100 hover:text-white'
            }
            ${animating ? 'heart-animate' : ''}
          `}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill={isFavourite ? 'currentColor' : 'none'}
            stroke="currentColor"
            strokeWidth={isFavourite ? 0 : 2}
            className="w-[18px] h-[18px]"
          >
            <path d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
          </svg>
        </button>
      </div>

      {/* ── Info ────────────────────────────────────── */}
      <div className="px-3.5 py-3">
        <p className="text-[13px] font-semibold text-[var(--color-text)] truncate leading-tight">
          {photo.author}
        </p>
        <p className="text-[11px] text-[var(--color-text-muted)] mt-0.5">
          #{photo.id}
        </p>
      </div>
    </div>
  );
}
