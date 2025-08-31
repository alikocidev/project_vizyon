import { Movie } from "./movie.type";
import { Series } from "./series.type";

export type FilterSortBy =
  | "popularity.asc"
  | "popularity.desc"
  | "primary_release_date.asc"
  | "primary_release_date.desc"
  | "title.asc"
  | "title.desc"
  | "vote_average.asc"
  | "vote_average.desc";

export type FilterOriginalLanguage =
  | "en" // English
  | "fr" // French
  | "es" // Spanish
  | "de" // German
  | "it" // Italian
  | "ja" // Japanese
  | "ko" // Korean
  | "zh" // Chinese
  | "pt" // Portuguese
  | "ru" // Russian
  | "hi" // Hindi
  | "ar" // Arabic
  | "bn" // Bengali
  | "cs" // Czech
  | "da" // Danish
  | "el" // Greek
  | "he" // Hebrew
  | "hu" // Hungarian
  | "id" // Indonesian
  | "ms" // Malay
  | "nl" // Dutch
  | "no" // Norwegian
  | "pl" // Polish
  | "ro" // Romanian
  | "sv" // Swedish
  | "ta" // Tamil
  | "th" // Thai
  | "tr" // Turkish
  | "uk" // Ukrainian
  | "vi" // Vietnamese
  | null;

export type FilterGenres = number;

export interface FilterKeys {
  show_type: "movie" | "tv";
  sort_by: FilterSortBy;
  primary_release_date_year_min: number;
  primary_release_date_year_max: number;
  with_genres: FilterGenres[];
  with_original_language: FilterOriginalLanguage | undefined;
  vote_average_min: number;
  vote_average_max: number;
}

export interface Show extends Movie, Series {}
