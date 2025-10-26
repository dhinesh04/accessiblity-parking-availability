import { useState, useEffect } from 'react';

export function useFavorites() {
  const [favorites, setFavorites] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('favorite_parking_lots');
      return saved ? JSON.parse(saved) : [];
    } catch (error) {
      console.error('Error loading favorites:', error);
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('favorite_parking_lots', JSON.stringify(favorites));
    } catch (error) {
      console.error('Error saving favorites:', error);
    }
  }, [favorites]);

  const addFavorite = (lotId: string) => {
    setFavorites((prev) => {
      if (prev.includes(lotId)) return prev;
      return [...prev, lotId];
    });
  };

  const removeFavorite = (lotId: string) => {
    setFavorites((prev) => prev.filter((id) => id !== lotId));
  };

  const toggleFavorite = (lotId: string) => {
    if (favorites.includes(lotId)) {
      removeFavorite(lotId);
    } else {
      addFavorite(lotId);
    }
  };

  const isFavorite = (lotId: string) => favorites.includes(lotId);

  return {
    favorites,
    addFavorite,
    removeFavorite,
    toggleFavorite,
    isFavorite,
  };
}
