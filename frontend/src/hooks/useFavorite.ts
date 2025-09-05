import { useState, useCallback } from "react";
import {
  addToFavorites,
  removeFromFavorites,
  checkIsFavorite,
  getFavorites,
  getFavoriteCounts,
} from "@/services/favorite";
import type {
  AddFavoriteRequest,
  RemoveFavoriteRequest,
  CheckFavoriteRequest,
  Favorite,
  FavoriteCountResponse,
} from "@/types/favorite.type";

export const useFavorite = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Add to favorites
  const addFavorite = useCallback(async (data: AddFavoriteRequest) => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await addToFavorites(data);
      return result;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || "Favorilere eklenirken hata oluştu";
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Remove from favorites
  const removeFavorite = useCallback(async (data: RemoveFavoriteRequest) => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await removeFromFavorites(data);
      return result;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || "Favorilerden kaldırılırken hata oluştu";
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Check if item is favorite
  const checkFavorite = useCallback(async (data: CheckFavoriteRequest) => {
    try {
      const result = await checkIsFavorite(data);
      return result.is_favorite;
    } catch (error: any) {
      console.error("Favorite check error:", error);
      return false;
    }
  }, []);

  // Toggle favorite status
  const toggleFavorite = useCallback(async (
    data: AddFavoriteRequest,
    currentIsFavorite: boolean
  ) => {
    if (currentIsFavorite) {
      return await removeFavorite({
        media_type: data.media_type,
        media_id: data.media_id,
      });
    } else {
      return await addFavorite(data);
    }
  }, [addFavorite, removeFavorite]);

  return {
    addFavorite,
    removeFavorite,
    checkFavorite,
    toggleFavorite,
    isLoading,
    error,
  };
};

// Hook for managing favorites list
export const useFavoritesList = () => {
  const [favorites, setFavorites] = useState<Favorite[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    current_page: 1,
    last_page: 1,
    per_page: 20,
    total: 0,
  });

  const fetchFavorites = useCallback(async (
    mediaType?: 'movie' | 'tv',
    page = 1,
    perPage = 20,
    append = false
  ) => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await getFavorites(mediaType, page, perPage);
      if (append) {
        setFavorites(prev => [...prev, ...result.favorites]);
      } else {
        setFavorites(result.favorites);
      }
      setPagination(result.pagination);
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || "Favoriler yüklenirken hata oluştu";
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const refreshFavorites = useCallback((mediaType?: 'movie' | 'tv') => {
    return fetchFavorites(mediaType, 1, pagination.per_page, false);
  }, [fetchFavorites, pagination.per_page]);

  const loadMoreFavorites = useCallback((mediaType?: 'movie' | 'tv') => {
    if (pagination.current_page < pagination.last_page) {
      return fetchFavorites(mediaType, pagination.current_page + 1, pagination.per_page, true);
    }
  }, [fetchFavorites, pagination]);

  return {
    favorites,
    isLoading,
    error,
    pagination,
    fetchFavorites,
    refreshFavorites,
    loadMoreFavorites,
  };
};

// Hook for favorite counts
export const useFavoriteCounts = () => {
  const [counts, setCounts] = useState<FavoriteCountResponse>({
    total: 0,
    movies: 0,
    tv_shows: 0,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCounts = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await getFavoriteCounts();
      setCounts(result);
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || "Sayılar yüklenirken hata oluştu";
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    counts,
    isLoading,
    error,
    fetchCounts,
  };
};
