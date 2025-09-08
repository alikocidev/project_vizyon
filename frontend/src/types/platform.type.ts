export type PlatformTypes = "prime" | "netflix" | "disney" | "hbo";

type ShowGenreIds =
  | "action"
  | "adventure"
  | "animation"
  | "comedy"
  | "crime"
  | "documentary"
  | "drama"
  | "family"
  | "fantasy"
  | "history"
  | "horror"
  | "music"
  | "mystery"
  | "news"
  | "reality"
  | "romance"
  | "scifi"
  | "talk"
  | "thriller"
  | "war"
  | "western";

interface ShowGenres {
  id: ShowGenreIds;
  name: string;
}

interface PlatformImage {
  w240: string;
  w360: string;
  w480: string;
  w600: string;
  w720: string;
  w1080?: string;
  w1440?: string;
}

interface ShowImageSet {
  verticalPoster: PlatformImage;
  horizontalPoster: PlatformImage;
  verticalBackdrop?: PlatformImage;
  horizontalBackdrop?: PlatformImage;
}

interface ShowSeason {
  itemType: "season";
  titleAirYear: string;
  firstAirYear: number;
  lastAirYear: number;
  streamingOptions: any;
  episodes?: {
    itemType: "episode";
    title: string;
    streamingOptions: any;
    airYear: number;
  }[];
}

export interface PlatformShows {
  itemType: "show";
  showType: "movie" | "series";
  title: string;
  streamingOptions: any;
  id: string;
  imdbId: string;
  tmdbId: string;
  originalTitle: string;
  genres: ShowGenres[];
  cast: string[];
  overview: string;
  rating: number;
  imageSet: ShowImageSet;
  releaseYear?: number;
  firstAirYear?: number;
  lastAirYear?: number;
  directors?: string[];
  creators?: string[];
  seasonCount?: number;
  episodeCount?: number;
  seasons?: ShowSeason[];
}

export interface Platform {
  name: PlatformTypes;
  label: string;
  shows: PlatformShows[];
  isLoad?: boolean;
  hasMore?: boolean;
  nextCursor?: string;
}
