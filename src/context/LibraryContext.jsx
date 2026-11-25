import { createContext, useCallback, useContext, useMemo, useState } from 'react';

const LibraryContext = createContext(null);
const SAVED_KEY = 'orbital-saved-media';
const RECENT_KEY = 'orbital-recent-media';

function readStorage(key) {
  try {
    const value = JSON.parse(localStorage.getItem(key) || '[]');
    return Array.isArray(value) ? value : [];
  } catch {
    return [];
  }
}

function persist(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // The current session continues to work if storage is unavailable.
  }
}

export function LibraryProvider({ children }) {
  const [saved, setSaved] = useState(readStorage(SAVED_KEY));
  const [recent, setRecent] = useState(readStorage(RECENT_KEY));

  const toggleSaved = useCallback((media) => {
    if (!media?.nasaId) return;
    setSaved((current) => {
      const exists = current.some((item) => item.nasaId === media.nasaId);
      const next = exists
        ? current.filter((item) => item.nasaId !== media.nasaId)
        : [{ ...media, savedAt: new Date().toISOString() }, ...current];
      persist(SAVED_KEY, next);
      return next;
    });
  }, []);

  const addRecent = useCallback((media) => {
    if (!media?.nasaId) return;
    setRecent((current) => {
      const next = [
        { ...media, viewedAt: new Date().toISOString() },
        ...current.filter((item) => item.nasaId !== media.nasaId),
      ].slice(0, 60);
      persist(RECENT_KEY, next);
      return next;
    });
  }, []);

  const removeRecent = useCallback((nasaId) => {
    setRecent((current) => {
      const next = current.filter((item) => item.nasaId !== nasaId);
      persist(RECENT_KEY, next);
      return next;
    });
  }, []);

  const clearRecent = useCallback(() => {
    setRecent([]);
    persist(RECENT_KEY, []);
  }, []);

  const isSaved = useCallback((nasaId) => saved.some((item) => item.nasaId === nasaId), [saved]);

  const value = useMemo(() => ({
    saved,
    recent,
    toggleSaved,
    addRecent,
    removeRecent,
    clearRecent,
    isSaved,
  }), [saved, recent, toggleSaved, addRecent, removeRecent, clearRecent, isSaved]);

  return <LibraryContext.Provider value={value}>{children}</LibraryContext.Provider>;
}

export function useLibrary() {
  const context = useContext(LibraryContext);
  if (!context) throw new Error('useLibrary must be used inside LibraryProvider');
  return context;
}
