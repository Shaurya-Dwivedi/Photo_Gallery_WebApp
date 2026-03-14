export default function SearchBar({ query, onQueryChange }) {
  return (
    <div className="sticky top-16 sm:top-[74px] z-10 w-full max-w-lg mx-auto py-2  rounded-xl">
      {/* Search icon */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={2}
        stroke="currentColor"
        className="absolute left-4 top-1/2 -translate-y-1/2 w-[18px] h-[18px] text-[var(--color-text-muted)] pointer-events-none"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
        />
      </svg>

      <input
        id="search-input"
        type="text"
        value={query}
        onChange={onQueryChange}
        placeholder="Search by author name…"
        autoComplete="off"
        className="w-full h-12 pl-11 pr-10 rounded-xl bg-[var(--color-surface-light)] border border-[var(--color-surface-lighter)] text-[15px] text-[var(--color-text)] placeholder:text-[var(--color-text-muted)]/60 focus:outline-none focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/25 transition-all duration-200"
      />

      {/* Clear button — only when there is text */}
      {query && (
        <button
          type="button"
          onClick={() => onQueryChange({ target: { value: '' } })}
          className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 rounded-md text-[var(--color-text-muted)] hover:text-[var(--color-text)] hover:bg-white/[0.06] transition-colors cursor-pointer"
          aria-label="Clear search"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-3.5 h-3.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
          </svg>
        </button>
      )}
    </div>
  );
}
