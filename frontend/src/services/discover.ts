import { FilterKeys } from "@/types/discover.type";
import { Show } from "@/types/discover.type";
import { Movie } from "@/types/movie.type";
import apiClient from "./api";

export interface DiscoverFilters {
  sort_by: string;
  with_genres: string;
  primary_release_date_year_min: string;
  primary_release_date_year_max: string;
  vote_average_min: string;
  vote_average_max: string;
  with_original_language: string;
}

export const discoverMovies = async (
  filters: DiscoverFilters,
  page: number = 1
): Promise<Movie[]> => {
  try {
    const response = await apiClient.get("/discover/movie", {
      params: {
        page,
        ...filters,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Discover fetch error:", error);
    throw error;
  }
};

export const discoverNewThings = async (
  filters: FilterKeys,
  page: number = 1
): Promise<Show[]> => {
  try {
    const response = await apiClient.get(`/discover/${filters.show_type}`, {
      params: {
        page,
        show_type: filters.show_type,
        sort_by: filters.sort_by,
        primary_release_date_year_max: filters.primary_release_date_year_max,
        primary_release_date_year_min: filters.primary_release_date_year_min,
        with_genres: filters.with_genres.join(","),
        with_original_language: filters.with_original_language,
        vote_average_max: filters.vote_average_max,
        vote_average_min: filters.vote_average_min,
      },
    });
    const result: Show[] = response.data;
    return result;
  } catch (error) {
    console.error("Fetch error:discover:newThings");
    throw error;
  }
};

export const searchNewThings = async (
  type: "movie" | "tv",
  query: string,
  page: number = 1
): Promise<Show[]> => {
  try {
    const response = await apiClient.get(`/search/${type}`, {
      params: {
        page,
        query,
      },
    });
    const result: Show[] = response.data;
    return result;
  } catch (error) {
    console.error("Fetch error:discover:searchNewThings");
    throw error;
  }
};

export const searchMovies = async (
  query: string,
  page: number = 1
): Promise<Movie[]> => {
  try {
    const response = await apiClient.get("/search/movie", {
      params: {
        page,
        query,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Search fetch error:", error);
    throw error;
  }
};
