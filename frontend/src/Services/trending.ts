import { GetTrendingMovieResponse } from "@/types/movie.type";
import apiClient from "./api";

export const getMovieTrending = async (page: number, window: "week" | "day"): Promise<GetTrendingMovieResponse> => {
  try {
    const response = await apiClient.get(`/trending/movie/${window}`, {
      params: { page },
    });
    const result: GetTrendingMovieResponse = response.data;
    return result;
  } catch (error) {
    console.error("Fetch error:", error);
    throw new Error("Services trending error.");
  }
};
