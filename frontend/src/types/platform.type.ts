export type PlatformTypes = "prime" | "netflix" | "disney" | "blutv";

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

interface iShowGenres {
    id: ShowGenreIds;
    name: string;
}

interface _iImage {
    w240: string;
    w360: string;
    w480: string;
    w600: string;
    w720: string;
    w1080?: string;
    w1440?: string;
}

interface iShowImageSet {
    verticalPoster: _iImage;
    horizontalPoster: _iImage;
    verticalBackdrop?: _iImage;
    horizontalBackdrop?: _iImage;
}

interface iShowSeason {
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

export interface iPlatformShows {
    itemType: "show";
    showType: "movie" | "series";
    title: string;
    streamingOptions: any;
    id: string;
    imdbId: string;
    tmdbId: string;
    originalTitle: string;
    genres: iShowGenres[];
    cast: string[];
    overview: string;
    rating: number;
    imageSet: iShowImageSet;
    releaseYear?: number;
    firstAirYear?: number;
    lastAirYear?: number;
    directors?: string[];
    creators?: string[];
    seasonCount?: number;
    episodeCount?: number;
    seasons?: iShowSeason[];
}

export interface iPlatform {
    name: PlatformTypes;
    label: string;
    shows: iPlatformShows[];
    isLoad?: boolean;
    hasMore?: boolean;
    nextCursor?: string;
}
