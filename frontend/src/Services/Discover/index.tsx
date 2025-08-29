import apiClient from "@/Services";
import { iFilterKeys } from "@/types/discover.type";
import { iShow } from "@/types/discover.type";

export const DiscoverNewThings = async (
    filters: iFilterKeys,
    page: number = 1
): Promise<iShow[]> => {
    try {
        const response = await apiClient.get(`/discover/${filters.show_type}`, {
            params: {
                page,
                show_type: filters.show_type,
                sort_by: filters.sort_by,
                primary_release_date_year_max:
                    filters.primary_release_date_year_max,
                primary_release_date_year_min:
                    filters.primary_release_date_year_min,
                with_genres: filters.with_genres.join(","),
                with_original_language: filters.with_original_language,
                vote_average_max: filters.vote_average_max,
                vote_average_min: filters.vote_average_min,
            },
        });
        const result: iShow[] = response.data;
        return result;
    } catch (error) {
        console.error("Fetch error:", error);
        throw new Error("Services discover error.");
    }
};

export const SearchNewThings = async (
    type: "movie" | "tv",
    query: string,
    page: number = 1
): Promise<iShow[]> => {
    try {
        const response = await apiClient.get(`/search/${type}`, {
            params: {
                page,
                query,
            },
        });
        const result: iShow[] = response.data;
        return result;
    } catch (error) {
        console.error("Fetch error:", error);
        throw new Error("Services search error.");
    }
};
