import apiClient from "@/Services";
import { iGetTrendingMovieResponse } from "@/types/trending.type";

export const GetTrendingMovie = async (
    page: number,
    window: "week" | "day"
): Promise<iGetTrendingMovieResponse> => {
    try {
        const response = await apiClient.get(`/trending/movie/${window}`, {
            params: { page },
        });
        const result: iGetTrendingMovieResponse = response.data;
        return result;
    } catch (error) {
        console.error("Fetch error:", error);
        throw new Error("Services trending error.");
    }
};
