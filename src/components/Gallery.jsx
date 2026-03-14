import { useState, useReducer, useCallback, useMemo } from 'react';
import useFetchPhotos from '../hooks/useFetchPhotos';
import { favouritesReducer, initialState } from '../../pdf/reducers/favouritesReducer';
import PhotoCard from './PhotoCard';
import SearchBar from './SearchBar';

export default function Gallery() {
  const { photos, loading, error } = useFetchPhotos();
  const [state, dispatch] = useReducer(favouritesReducer, initialState);
  const [searchQuery, setSearchQuery] = useState('');

  //useCallback: stable reference for SearchBar
  const handleSearchChange = useCallback((e) => {
    setSearchQuery(e.target.value);
  }, []);

  //useMemo: only recompute when photos or query change
  const filteredPhotos = useMemo(() => {
    if (!searchQuery.trim()) return photos;
    const q = searchQuery.toLowerCase();
    return photos.filter((p) => p.author.toLowerCase().includes(q));
  }, [photos, searchQuery]);

  //Stable dispatch wrapper
  const handleToggleFavourite = useCallback((photoId) => {
    dispatch({ type: 'TOGGLE_FAVOURITE', payload: photoId });
  }, []);

  /* ── Loading state ──────────────────────────────── */
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6">
        <div className="spinner-ring" />
        <p className="text-sm text-[var(--color-text-muted)] font-medium tracking-wide">
          Loading photos…
        </p>
      </div>
    );
  }

  /* ── Error state ────────────────────────────────── */
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-5 text-center px-6">
        <div className="w-16 h-16 rounded-2xl bg-[var(--color-error)]/10 flex items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-[var(--color-error)]">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
          </svg>
        </div>
        <p className="text-[var(--color-error)] font-semibold">Failed to load photos</p>
        <p className="text-sm text-[var(--color-text-muted)] max-w-sm">{error}</p>
      </div>
    );
  }

  /* ── Main gallery ───────────────────────────────── */
  return (
    <div className="space-y-6">
      {/* Search */}
      <SearchBar query={searchQuery} onQueryChange={handleSearchChange} />

      {/* Result count */}
      <p className="text-[13px] text-[var(--color-text-muted)]">
        {searchQuery ? (
          <>
            Showing{' '}
            <span className="font-semibold text-[var(--color-text)]">{filteredPhotos.length}</span>{' '}
            result{filteredPhotos.length !== 1 && 's'} for &ldquo;{searchQuery}&rdquo;
          </>
        ) : (
          <>
            <span className="font-semibold text-[var(--color-text)]">{photos.length}</span> photos
          </>
        )}
      </p>

      {/* Empty search state */}
      {filteredPhotos.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 gap-3">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-10 h-10 text-[var(--color-surface-lighter)]">
            <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
          </svg>
          <p className="text-[var(--color-text-muted)] font-medium">No photos match your search</p>
        </div>
      )}

      {/* Responsive grid: 1 → 2 → 3 → 4 columns */}
      {filteredPhotos.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5">
          {filteredPhotos.map((photo, i) => (
            <PhotoCard
              key={photo.id}
              photo={photo}
              index={i}
              isFavourite={state.favourites.includes(photo.id)}
              onToggleFavourite={handleToggleFavourite}
            />
          ))}
        </div>
      )}
    </div>
  );
}
