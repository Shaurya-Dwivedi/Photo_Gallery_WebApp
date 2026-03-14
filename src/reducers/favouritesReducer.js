const STORAGE_KEY = 'photo-gallery-favourites';

function loadFavourites() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

function saveFavourites(favourites) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(favourites));
  } catch {
    // silently fail if localStorage is full or unavailable
  }
}

export const initialState = {
  favourites: loadFavourites(),
};

export function favouritesReducer(state, action) {
  switch (action.type) {
    case 'TOGGLE_FAVOURITE': {
      const photoId = action.payload;
      const isFavourited = state.favourites.includes(photoId);
      const updatedFavourites = isFavourited
        ? state.favourites.filter((id) => id !== photoId)
        : [...state.favourites, photoId];

      saveFavourites(updatedFavourites);

      return { ...state, favourites: updatedFavourites };
    }
    default:
      return state;
  }
}
