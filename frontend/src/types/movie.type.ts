import { iFilterOriginalLanguage } from "./discover.type";

export interface iGenre {
    id: number;
    name: string;
}

export interface iMovie {
    adult: boolean;
    backdrop_path: string;
    genre_ids: number[];
    id: number;
    original_language: iFilterOriginalLanguage;
    original_title: string;
    overview: string;
    popularity: number;
    poster_path: string;
    release_date: string;
    title: string;
    video: string | boolean;
    vote_average: number;
    vote_count: number;
}

export interface iServiceMovieDiscoverResponse {
    page: number;
    results: iMovie[];
    total_pages: number;
    total_results: number;
}

export type iGetMovieTheatersResponse = iMovie[];
export type iGetMovieUpComingsResponse = iMovie[];
export type iGetMoviePopularResponse = iMovie[];

export type iGetMovieVideosResponse = {
    iso_639_1: string;
    iso_3166_1: string;
    name: string;
    key: string;
    site: string;
    size: number;
    type: string;
    official: boolean;
    published_at: string;
    id: number;
}[];
