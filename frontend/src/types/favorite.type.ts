export interface Favorite {
  id: number;
  user_id: number;
  media_type: 'movie' | 'tv';
  media_id: number;
  title: string;
  poster_path: string | null;
  release_date: string | null;
  vote_average: number | null;
  genre_ids: number[] | null;
  overview: string | null;
  created_at: string;
  updated_at: string;
}

export interface AddFavoriteRequest {
  media_type: 'movie' | 'tv';
  media_id: number;
  title: string;
  poster_path?: string;
  release_date?: string;
  vote_average?: number;
  genre_ids?: number[];
  overview?: string;
}

export interface RemoveFavoriteRequest {
  media_type: 'movie' | 'tv';
  media_id: number;
}

export interface CheckFavoriteRequest {
  media_type: 'movie' | 'tv';
  media_id: number;
}

export interface FavoritesResponse {
  favorites: Favorite[];
  pagination: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
}

export interface FavoriteCountResponse {
  total: number;
  movies: number;
  tv_shows: number;
}

export interface CheckFavoriteResponse {
  is_favorite: boolean;
}
