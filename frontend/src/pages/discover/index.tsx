import { useAuth } from "@/hooks/useAuth";
import { useDevice } from "@/hooks/useDevice";
import CoreLayout from "@/layouts/Core";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Movie } from "@/types/movie.type";
import {
  discoverMovies,
  searchMovies,
  DiscoverFilters as DiscoverFiltersType,
} from "@/services/discover";
import classNames from "classnames";
import LazyLoadedImage from "@/components/LazyLoadedImage";
import CircularProgressBar from "@/components/CircularProgressBar";
import Loading from "@/components/Loading";
import { RiHeartsFill, RiHeart3Line } from "react-icons/ri";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  formatDateToTurkishMonthDay,
  genreIdsToNamesForMovies,
} from "@/utils/misc";
import { useFavorite } from "@/hooks/useFavorite";
import DiscoverFilters from "./partials/DiscoverFilters";

const Discover = () => {
  const { user } = useAuth();
  const { isMobile } = useDevice();
  const { toggleFavorite, checkFavorite } = useFavorite();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [favoriteStates, setFavoriteStates] = useState<Record<number, boolean>>(
    {}
  );
  const [showLoadMoreButton, setShowLoadMoreButton] = useState(false);
  const [noLimit, setNoLimit] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [isSearchMode, setIsSearchMode] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const [filters, setFilters] = useState<DiscoverFiltersType>({
    sort_by: "popularity.desc",
    with_genres: "",
    primary_release_date_year_min: "",
    primary_release_date_year_max: "",
    vote_average_min: "",
    vote_average_max: "",
    with_original_language: "",
  });

  const fetchMovies = async (isNewSearch = false) => {
    setLoading(true);
    if (isNewSearch) {
      setMovies([]);
      setFavoriteStates({});
      setShowLoadMoreButton(false);
      setPage(1);
    }

    try {
      const currentPage = isNewSearch ? 1 : page;
      let newMovies: Movie[] = [];

      if (isSearchMode && searchQuery) {
        // Search modunda
        newMovies = await searchMovies(searchQuery, currentPage);
      } else {
        // Discover modunda
        newMovies = await discoverMovies(filters, currentPage);
      }

      if (isNewSearch) {
        setMovies(newMovies);
      } else {
        setMovies((prev) => [...prev, ...newMovies]);
      }

      // Check favorite status for new movies if user is authenticated
      if (user && newMovies.length > 0) {
        const favoritePromises = newMovies.map(async (movie: Movie) => {
          const isFavorite = await checkFavorite({
            media_type: "movie",
            media_id: movie.id,
          });
          return { id: movie.id, isFavorite };
        });

        const favoriteResults = await Promise.all(favoritePromises);
        const newFavoriteStates = favoriteResults.reduce(
          (
            acc: Record<number, boolean>,
            { id, isFavorite }: { id: number; isFavorite: boolean }
          ) => {
            acc[id] = isFavorite;
            return acc;
          },
          {} as Record<number, boolean>
        );

        if (isNewSearch) {
          setFavoriteStates(newFavoriteStates);
        } else {
          setFavoriteStates((prev) => ({ ...prev, ...newFavoriteStates }));
        }
      }

      if (newMovies.length === 0) {
        setNoLimit(true);
      } else {
        setTimeout(() => {
          setShowLoadMoreButton(true);
        }, 300);
      }
    } catch (error) {
      console.error("Error fetching movies:", error);
      toast.error("Filmler yüklenemedi");
    } finally {
      setLoading(false);
      setNoLimit(false);
    }
  };

  const handlePageChange = () => {
    const newPage = page + 1;
    setPage(newPage);
    setShowLoadMoreButton(false);
    fetchMovies(false);
  };

  const handleFilterChange = (newFilters: DiscoverFiltersType) => {
    setFilters(newFilters);
    fetchMovies(true);
  };

  const handleNavigateDetail = (e: React.MouseEvent, movieId: number) => {
    e.stopPropagation();
    navigate(`/movie/${movieId}`);
  };

  const handleFavoriteClick = async (movie: Movie, event: React.MouseEvent) => {
    event.stopPropagation();

    if (!user) {
      toast.error("Favorilere eklemek için giriş yapmanız gerekiyor");
      return;
    }

    const movieId = movie.id;
    const currentIsFavorite = favoriteStates[movieId] || false;

    try {
      const favoriteData = {
        media_type: "movie" as const,
        media_id: movieId,
        title: movie.title,
        poster_path: movie.poster_path,
        release_date: movie.release_date,
        vote_average: movie.vote_average,
        genre_ids: movie.genre_ids,
        overview: movie.overview,
      };

      setFavoriteStates((prev) => ({ ...prev, [movieId]: !currentIsFavorite }));
      await toggleFavorite(favoriteData, currentIsFavorite);

      if (currentIsFavorite) {
        toast.success("Favorilerden kaldırıldı");
      } else {
        toast.success("Favorilere eklendi");
      }
    } catch (error: any) {
      setFavoriteStates((prev) => ({ ...prev, [movieId]: currentIsFavorite }));
      toast.error(error.message || "Bir hata oluştu");
    }
  };

  // URL parametrelerini kontrol et
  useEffect(() => {
    const searchParam = searchParams.get("s");
    if (searchParam) {
      setIsSearchMode(true);
      setSearchQuery(searchParam);
    } else {
      setIsSearchMode(false);
      setSearchQuery("");
    }
  }, [searchParams]);

  useEffect(() => {
    fetchMovies(true);
  }, [filters, isSearchMode, searchQuery]);

  return (
    <CoreLayout user={user} title="Keşfet">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl lg:text-5xl font-extrabold tracking-wide text-light-text dark:text-dark-text mb-4">
            {isSearchMode ? `"${searchQuery}" için Arama Sonuçları` : "Keşfet"}
          </h1>
          <p className="text-light-text/70 dark:text-dark-text/70 text-lg">
            {isSearchMode
              ? `"${searchQuery}" araması için bulunan filmler`
              : "Filtrelerle istediğiniz filmleri keşfedin"}
          </p>
        </div>

        <div
          className={classNames("grid gap-8", {
            "grid-cols-1": isMobile || isSearchMode,
            "grid-cols-12": !isMobile && !isSearchMode,
          })}
        >
          {/* Filters Sidebar - Sadece search modunda değilken göster */}
          {!isSearchMode && (
            <div
              className={classNames("space-y-6", {
                "order-1": isMobile,
                "col-span-3": !isMobile,
              })}
            >
              {/* Mobile Filter Toggle */}
              {isMobile && (
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="w-full flex items-center justify-center gap-2 bg-primary dark:bg-secondary text-white px-4 py-3 rounded-lg font-medium hover:bg-primary/90 dark:hover:bg-secondary/90 transition"
                >
                  <span>
                    {showFilters ? "Filtreleri Gizle" : "Filtreleri Göster"}
                  </span>
                </button>
              )}

              {/* Filters */}
              <div
                className={classNames("", {
                  hidden: isMobile && !showFilters,
                  block: !isMobile || showFilters,
                })}
              >
                <DiscoverFilters
                  filters={filters}
                  onFiltersChange={handleFilterChange}
                  isLoading={loading}
                />
              </div>
            </div>
          )}

          {/* Movies Grid */}
          <div
            className={classNames("space-y-6", {
              "order-2": isMobile,
              "col-span-9": !isMobile && !isSearchMode,
              "col-span-12": !isMobile && isSearchMode,
            })}
          >
            {/* Movies Grid */}
            <div
              className={classNames("grid gap-4", {
                "grid-cols-2 gap-2": isMobile,
                "grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5":
                  !isMobile && !isSearchMode,
                "grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7":
                  !isMobile && isSearchMode,
              })}
            >
              {movies.map((movie, i) => (
                <div
                  key={`${movie.id}-${i}`}
                  onClick={(e) => handleNavigateDetail(e, movie.id)}
                  className={classNames(
                    "relative group border border-light-text/5 dark:border-dark-text/5",
                    "w-full cursor-pointer rounded-2xl overflow-hidden shadow-lg",
                    "hover:shadow-2xl transition-all duration-300 hover:-translate-y-1",
                    {
                      "h-[280px] sm:h-[320px]": !isMobile,
                      "h-[250px]": isMobile,
                    }
                  )}
                >
                  <LazyLoadedImage
                    skeletonClassName="w-full h-full"
                    className="w-full h-full object-cover"
                    src={`https://image.tmdb.org/t/p/w500/${movie.poster_path}`}
                    isExist={!!movie.poster_path}
                    alt={movie.title}
                  />

                  {/* Hover Overlay */}
                  <div
                    className={classNames(
                      "absolute inset-0 w-full h-full z-50",
                      "flex flex-col justify-between",
                      "bg-gradient-to-t from-black/95 via-black/60 to-transparent",
                      "opacity-0 group-hover:opacity-100",
                      "transition-opacity duration-300 ease-in-out"
                    )}
                  >
                    {/* Top Section - Rating & Favorite */}
                    <div className="w-full flex items-center justify-between p-3">
                      <div className="flex flex-col gap-2 transform translate-x-[-100px] group-hover:translate-x-0 transition-transform duration-300 delay-100">
                        <div className="w-max whitespace-nowrap py-1 font-medium px-2 text-xs text-white bg-black/50 backdrop-blur-sm rounded">
                          {formatDateToTurkishMonthDay(
                            movie.release_date,
                            true
                          )}
                        </div>
                        <div className="w-max whitespace-nowrap py-1 font-medium px-2 text-xs text-white bg-black/50 backdrop-blur-sm rounded">
                          {genreIdsToNamesForMovies(movie.genre_ids)
                            .split(", ")
                            .slice(0, 2)
                            .join(", ")}
                        </div>
                      </div>

                      <div className="flex flex-col items-center gap-2 transform translate-x-[100px] group-hover:translate-x-0 transition-transform duration-300 delay-100">
                        <CircularProgressBar value={movie.vote_average} />
                        <button
                          onClick={(e) => handleFavoriteClick(movie, e)}
                          className={classNames(
                            "flex items-center justify-center rounded-full border-2 border-transparent",
                            "p-1 w-8 h-8 transition duration-150",
                            {
                              "bg-red-500/90 text-white":
                                favoriteStates[movie.id],
                              "bg-white/20 text-white/80 backdrop-blur-sm":
                                !favoriteStates[movie.id],
                            },
                            "hover:bg-white hover:text-red-500"
                          )}
                        >
                          {favoriteStates[movie.id] ? (
                            <RiHeartsFill className="w-full h-full" />
                          ) : (
                            <RiHeart3Line className="w-full h-full" />
                          )}
                        </button>
                      </div>
                    </div>

                    {/* Bottom Section - Movie Info */}
                    <div className="p-3 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300 delay-200">
                      <h2 className="text-white font-bold text-sm sm:text-base line-clamp-2 mb-1">
                        {movie.title}
                      </h2>
                      <p className="text-white/80 text-xs line-clamp-2 leading-relaxed">
                        {movie.overview}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Loading */}
            {loading && (
              <div className="flex justify-center py-8">
                <Loading />
              </div>
            )}

            {/* Load More Button */}
            {!noLimit &&
              !loading &&
              showLoadMoreButton &&
              movies.length > 0 && (
                <div className="flex justify-center">
                  <button
                    onClick={handlePageChange}
                    className="px-8 py-3 bg-transparent border-2 border-primary dark:border-secondary text-primary dark:text-secondary rounded-full font-medium hover:bg-primary dark:hover:bg-secondary hover:text-white transition"
                  >
                    Daha Fazla Yükle
                  </button>
                </div>
              )}

            {/* No Movies */}
            {!loading && movies.length === 0 && (
              <div className="text-center py-12">
                <p className="text-light-text/70 dark:text-dark-text/70 text-lg">
                  {isSearchMode
                    ? `"${searchQuery}" araması için sonuç bulunamadı.`
                    : "Seçtiğiniz filtrelere uygun film bulunamadı."}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </CoreLayout>
  );
};

export default Discover;
