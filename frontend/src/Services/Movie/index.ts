import {
    iGetMovieVideosResponse,
    iGetMovieTheatersResponse,
    iGetMovieUpComingsResponse,
    iGetMoviePopularResponse,
} from "@/types/movie.type";
import apiClient from "@/Services";

export const GetMovieTheaters = async (
    page: number
): Promise<iGetMovieTheatersResponse> => {
    try {
        const response = await apiClient.get(`movie/theaters`, {
            params: { page },
        });
        const result: iGetMovieTheatersResponse = response.data;
        return result;
    } catch (error) {
        console.error("Fetch error:", error);
        throw new Error("Services movie error.");
    }
};

export const GetMovieUpComings = async (
    page: number
): Promise<iGetMovieUpComingsResponse> => {
    try {
        const response = await apiClient.get(`movie/upcomings`, {
            params: { page },
        });
        const result: iGetMovieUpComingsResponse = response.data;
        return result;
    } catch (error) {
        console.error("Fetch error:", error);
        throw new Error("Services movie error.");
    }
};

export const GetMovieVideos = async (
    movieId: number
): Promise<iGetMovieVideosResponse> => {
    try {
        const response = await apiClient.get(`movie/${movieId}/videos`);
        const result: iGetMovieVideosResponse = response.data;
        return result;
    } catch (error) {
        console.error("Fetch error:", error);
        throw new Error("Services movie error.");
    }
};

export const GetMoviePopular = async (
    page: number
): Promise<iGetMoviePopularResponse> => {
    try {
        const response = await apiClient.get("movie/popular", {
            params: { page },
        });
        const result: iGetMoviePopularResponse = response.data;
        return result;
    } catch (error) {
        console.error("Fetch error:", error);
        throw new Error("Services movie error.");
    }
};

export const GetMovieGoat = async (
    page: number
): Promise<iGetMoviePopularResponse> => {
    try {
        const response = await apiClient.get("movie/goat", {
            params: { page },
        });
        const result: iGetMoviePopularResponse = response.data;
        return result;
    } catch (error) {
        console.error("Fetch error:", error);
        throw new Error("Services movie error.");
    }
};
