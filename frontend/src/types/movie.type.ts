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

export interface MovieDetail extends Movie {
  belongs_to_collection?: {
    id: number;
    name: string;
    poster_path: string;
    backdrop_path: string;
  };
  budget: number;
  genres: Genre[];
  homepage: string;
  imdb_id: string;
  production_companies: {
    id: number;
    logo_path: string;
    name: string;
    origin_country: string;
  }[];
  production_countries: {
    iso_3166_1: string;
    name: string;
  }[];
  revenue: number;
  runtime: number;
  spoken_languages: {
    iso_639_1: string;
    name: string;
  }[];
  status: string;
  tagline: string;
  credits?: {
    cast: {
      id: number;
      name: string;
      character: string;
      profile_path: string;
      order: number;
    }[];
    crew: {
      id: number;
      name: string;
      job: string;
      profile_path: string;
    }[];
  };
  videos?: {
    results: {
      id: string;
      iso_639_1: string;
      iso_3166_1: string;
      key: string;
      name: string;
      site: string;
      size: number;
      type: string;
      official: boolean;
      published_at: string;
    }[];
  };
  recommendations?: {
    results: Movie[];
  };
  similar?: {
    results: Movie[];
  };
}
