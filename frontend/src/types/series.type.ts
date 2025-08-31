import { FilterOriginalLanguage } from "./discover.type";

export interface Series {
  backdrop_path: string;
  first_air_date: string;
  genre_ids: number[];
  id: number;
  name: string;
  origin_country: string[];
  original_language: FilterOriginalLanguage;
  original_name: string;
  overview: string;
  popularity: number;
  poster_path: string;
  vote_average: number;
  vote_count: number;
}

export interface UpComingSeries {
  name: string;
  meta: {
    [key: string]: any;
    season: string;
    link: string;
    image: string;
  };
}
