import {
    GetMovieVideosResponse,
    GetMovieTheatersResponse,
    GetMovieUpComingsResponse,
    GetMoviePopularResponse,
} from "@/types/movie.type";
import apiClient from "./api";

export const getMovieTheaters = async (
    page: number
): Promise<GetMovieTheatersResponse> => {
    try {
        const response = await apiClient.get(`movie/theaters`, {
            params: { page },
        });
        const result: GetMovieTheatersResponse = response.data;
        return result;
    } catch (error) {
        console.error("Fetch error:", error);
        throw new Error("Services movie error.");
    }
};

export const getMovieUpComings = async (
    page: number
): Promise<GetMovieUpComingsResponse> => {
    try {
        const response = await apiClient.get(`movie/upcomings`, {
            params: { page },
        });
        const result: GetMovieUpComingsResponse = response.data;
        return result;
    } catch (error) {
        console.error("Fetch error:", error);
        throw new Error("Services movie error.");
    }
};

export const getMovieVideos = async (
    movieId: number
): Promise<GetMovieVideosResponse> => {
    try {
        const response = await apiClient.get(`movie/${movieId}/videos`);
        const result: GetMovieVideosResponse = response.data;
        return result;
    } catch (error) {
        console.error("Fetch error:", error);
        throw new Error("Services movie error.");
    }
};

export const getMoviePopular = async (
    page: number
): Promise<GetMoviePopularResponse> => {
    try {
        const response = await apiClient.get("movie/popular", {
            params: { page },
        });
        const result: GetMoviePopularResponse = response.data;
        return result;
    } catch (error) {
        console.error("Fetch error:", error);
        throw new Error("Services movie error.");
    }
};

export const getMovieGoat = async (
    page: number
): Promise<GetMoviePopularResponse> => {
    try {
        const response = await apiClient.get("movie/goat", {
            params: { page },
        });
        const result: GetMoviePopularResponse = response.data;
        return result;
    } catch (error) {
        console.error("Fetch error:", error);
        throw new Error("Services movie error.");
    }
};
