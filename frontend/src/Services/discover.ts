import { FilterKeys } from "@/types/discover.type";
import { Show } from "@/types/discover.type";
import apiClient from "./api";

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
