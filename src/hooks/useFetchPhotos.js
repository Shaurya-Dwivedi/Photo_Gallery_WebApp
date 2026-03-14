import { useState, useEffect } from 'react';

const API_URL = 'https://picsum.photos/v2/list?limit=30';

/**
 * Custom hook that fetches photos from Lorem Picsum.
 * Returns { photos, loading, error }.
 *
 * Includes a minimum display time for the loading state so the
 * spinner is always visible (avoids a confusing flash).
 */
export default function useFetchPhotos() {
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const controller = new AbortController();
    let cancelled = false;

    const fetchPhotos = async () => {
      setLoading(true);
      setError(null);

      // Guarantee the spinner shows for at least 600ms
      const minDelay = new Promise((r) => setTimeout(r, 600));

      try {
        const [response] = await Promise.all([
          fetch(API_URL, { signal: controller.signal }),
          minDelay,
        ]);

        if (!response.ok) {
          throw new Error(`Failed to fetch photos (HTTP ${response.status})`);
        }

        const data = await response.json();

        if (!cancelled) {
          setPhotos(data);
        }
      } catch (err) {
        if (!cancelled && err.name !== 'AbortError') {
          setError(err.message || 'Something went wrong while fetching photos.');
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    fetchPhotos();

    return () => {
      cancelled = true;
      controller.abort();
    };
  }, []);

  return { photos, loading, error };
}
