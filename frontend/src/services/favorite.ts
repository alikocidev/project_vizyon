import apiClient from "./api";
import type {
  AddFavoriteRequest,
  RemoveFavoriteRequest,
  CheckFavoriteRequest,
  FavoritesResponse,
  FavoriteCountResponse,
  CheckFavoriteResponse,
  Favorite,
} from "@/types/favorite.type";

// Get user's favorites
export const getFavorites = async (
  mediaType?: 'movie' | 'tv',
  page = 1,
  perPage = 20
): Promise<FavoritesResponse> => {
  try {
    const params = new URLSearchParams({
      page: page.toString(),
      per_page: perPage.toString(),
    });
    
    if (mediaType) {
      params.append('media_type', mediaType);
    }

    const response = await apiClient.get(`/favorites?${params.toString()}`);
    return response.data;
  } catch (error) {
    console.error("Fetch error:favorites:get");
    throw error;
  }
};

// Add to favorites
export const addToFavorites = async (
  data: AddFavoriteRequest
): Promise<{ message: string; favorite: Favorite }> => {
  try {
    const response = await apiClient.post("/favorites", data);
    return response.data;
  } catch (error) {
    console.error("Fetch error:favorites:add");
    throw error;
  }
};

// Remove from favorites
export const removeFromFavorites = async (
  data: RemoveFavoriteRequest
): Promise<{ message: string }> => {
  try {
    const response = await apiClient.delete("/favorites", { data });
    return response.data;
  } catch (error) {
    console.error("Fetch error:favorites:remove");
    throw error;
  }
};

// Check if item is in favorites
export const checkIsFavorite = async (
  data: CheckFavoriteRequest
): Promise<CheckFavoriteResponse> => {
  try {
    const response = await apiClient.post("/favorites/check", data);
    return response.data;
  } catch (error) {
    console.error("Fetch error:favorites:check");
    throw error;
  }
};

// Get favorite counts
export const getFavoriteCounts = async (): Promise<FavoriteCountResponse> => {
  try {
    const response = await apiClient.get("/favorites/count");
    return response.data;
  } catch (error) {
    console.error("Fetch error:favorites:count");
    throw error;
  }
};
