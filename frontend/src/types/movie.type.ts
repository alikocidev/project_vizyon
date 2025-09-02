import { FilterOriginalLanguage } from "./discover.type";

export interface Genre {
  id: number;
  name: string;
}

export type TabListProps = "theaters" | "upcomings" | "popular" | "trending" | "goat";

export interface Movie {
  adult: boolean;
  backdrop_path: string;
  genre_ids: number[];
  id: number;
  original_language: FilterOriginalLanguage;
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

export interface ServiceMovieDiscoverResponse {
  page: number;
  results: Movie[];
  total_pages: number;
  total_results: number;
}

export type GetMovieTheatersResponse = Movie[];
export type GetMovieUpComingsResponse = Movie[];
export type GetMoviePopularResponse = Movie[];
export type GetTrendingMovieResponse = Movie[];

export type GetMovieVideosResponse = {
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
