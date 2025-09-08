import { useAuth } from "@/hooks/useAuth";
import CoreLayout from "@/layouts/Core";
import { useEffect, useState } from "react";
import { useFavoritesList } from "@/hooks/useFavorite";
import Loading from "@/components/Loading";
import LazyLoadedImage from "@/components/LazyLoadedImage";
import CircularProgressBar from "@/components/CircularProgressBar";
import { RiHeartsFill } from "react-icons/ri";
import {
  formatDateToTurkishMonthDay,
  genreIdsToNamesForMovies,
} from "@/utils/misc";
import classNames from "classnames";
import { useDevice } from "@/hooks/useDevice";
import { useFavorite } from "@/hooks/useFavorite";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

type FilterType = "all" | "movie" | "tv";

const Favorites = () => {
  const { user } = useAuth();
  const { isMobile } = useDevice();
  const {
    favorites,
    isLoading,
    fetchFavorites,
    loadMoreFavorites,
    pagination,
  } = useFavoritesList();
  const { removeFavorite } = useFavorite();
  const [activeFilter, setActiveFilter] = useState<FilterType>("all");
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      const mediaType = activeFilter === "all" ? undefined : activeFilter;
      fetchFavorites(mediaType);
    }
  }, [user, activeFilter, fetchFavorites]);

  const handleFilterChange = (filter: FilterType) => {
    setActiveFilter(filter);
  };

  const handleRemoveFavorite = async (
    mediaType: "movie" | "tv",
    mediaId: number
  ) => {
    try {
      await removeFavorite({ media_type: mediaType, media_id: mediaId });

      // Refresh the favorites list
      const mediaTypeFilter = activeFilter === "all" ? undefined : activeFilter;
      fetchFavorites(mediaTypeFilter);

      toast.success("Favorilerden kaldırıldı");
    } catch (error: any) {
      toast.error(error.message || "Bir hata oluştu");
    }
  };

  const handleLoadMore = () => {
    const mediaType = activeFilter === "all" ? undefined : activeFilter;
    loadMoreFavorites(mediaType);
  };

  const handleOpenDetails = (mediaType: "movie" | "tv", mediaId: number) => {
    if (mediaType === "movie") {
      navigate(`/movie/${mediaId}`);
    } else if (mediaType === "tv") {
      navigate(`/tv/${mediaId}`);
    }
  };

  if (!user) return;

  return (
    <CoreLayout user={user} title="Favoriler">
      <div className="flex flex-col gap-4 xl:w-3/5 lg:w-3/4 sm:w-11/12 mx-auto">
        <div className="mt-4 sm:mt-10 mb-4 max-sm:ml-2">
          <h1 className="text-5xl font-extrabold tracking-wide select-none text-light-text dark:text-dark-text">
            Favorilerim
          </h1>
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => handleFilterChange("all")}
            className={classNames(
              "px-4 py-2 rounded-xl font-medium transition-all duration-200",
              {
                "bg-primary text-white dark:bg-secondary":
                  activeFilter === "all",
                "bg-light-surface text-light-text dark:bg-dark-surface dark:text-dark-text hover:bg-primary/10 dark:hover:bg-secondary/10":
                  activeFilter !== "all",
              }
            )}
          >
            Tümü
          </button>
          <button
            onClick={() => handleFilterChange("movie")}
            className={classNames(
              "px-4 py-2 rounded-xl font-medium transition-all duration-200",
              {
                "bg-primary text-white dark:bg-secondary":
                  activeFilter === "movie",
                "bg-light-surface text-light-text dark:bg-dark-surface dark:text-dark-text hover:bg-primary/10 dark:hover:bg-secondary/10":
                  activeFilter !== "movie",
              }
            )}
          >
            Filmler
          </button>
          <button
            onClick={() => handleFilterChange("tv")}
            className={classNames(
              "px-4 py-2 rounded-xl font-medium transition-all duration-200",
              {
                "bg-primary text-white dark:bg-secondary":
                  activeFilter === "tv",
                "bg-light-surface text-light-text dark:bg-dark-surface dark:text-dark-text hover:bg-primary/10 dark:hover:bg-secondary/10":
                  activeFilter !== "tv",
              }
            )}
          >
            Diziler
          </button>
        </div>

        {/* Favorites Grid */}
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <Loading />
          </div>
        ) : favorites.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64">
            <RiHeartsFill className="w-16 h-16 text-primary dark:text-secondary mb-4" />
            <h2 className="text-2xl font-bold text-light-text dark:text-dark-text mb-2">
              Henüz favori eklememişsiniz
            </h2>
            <p className="text-light-text/70 dark:text-dark-text/70 text-center">
              Beğendiğiniz filmleri ve dizileri favorilerinize ekleyerek daha
              sonra kolayca bulabilirsiniz.
            </p>
          </div>
        ) : (
          <div
            className={classNames({
              "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2": !isMobile,
              "flex flex-col gap-2 px-2": isMobile,
            })}
          >
            {favorites.map((favorite) => (
              <div
                onClick={() =>
                  handleOpenDetails(favorite.media_type, favorite.media_id)
                }
                key={favorite.id}
                className={classNames(
                  "relative group",
                  "w-full",
                  "cursor-pointer",
                  "rounded-3xl overflow-hidden",
                  "shadow-2xl",
                  {
                    "h-[320px] sm:h-[340px] md:h-[360px] lg:h-[380px] xl:h-[400px] 2xl:h-[420px]":
                      !isMobile,
                    "h-[200px] grid grid-cols-3 gap-2": isMobile,
                  }
                )}
              >
                <LazyLoadedImage
                  skeletonClassName="w-full h-full"
                  className="w-full h-full"
                  src={`https://image.tmdb.org/t/p/w780/${favorite.poster_path}`}
                  isExist={!!favorite.poster_path}
                  alt={favorite.title}
                />
                {!isMobile && (
                  <div
                    className={classNames(
                      "absolute inset-0 w-full h-full z-50 mt-1",
                      "flex flex-col justify-between",
                      "bg-gradient-to-t from-black/90 via-black/50 to-transparent",
                      "opacity-0 group-hover:opacity-100",
                      "transition-opacity duration-300 ease-in-out"
                    )}
                  >
                    <div className="w-full flex items-center justify-between">
                      <div className="relative translate-y-3 flex flex-col gap-1 transform translate-x-[-100px] group-hover:translate-x-0 transition-transform duration-300 delay-100">
                        <h1 className="w-max whitespace-nowrap py-1 font-medium px-2 text-xs text-white bg-primary/50 dark:bg-dark-surface/75 backdrop-blur-sm">
                          {formatDateToTurkishMonthDay(
                            favorite.release_date || "Çok yakında",
                            true
                          )}
                        </h1>
                        {favorite.genre_ids &&
                          favorite.genre_ids.length > 0 && (
                            <h1 className="w-max whitespace-nowrap py-1 font-medium px-2 text-xs text-white bg-primary/50 dark:bg-dark-surface/75 backdrop-blur-sm">
                              {genreIdsToNamesForMovies(
                                favorite.genre_ids || []
                              )}
                            </h1>
                          )}
                        {favorite.media_type && (
                          <h1 className="w-max whitespace-nowrap py-1 font-medium px-2 text-xs text-white bg-primary/50 dark:bg-dark-surface/75 backdrop-blur-sm">
                            {favorite.media_type === "movie" ? "Film" : "Dizi"}
                          </h1>
                        )}
                      </div>
                      <div className="relative right-1 z-10 flex flex-col items-center gap-1 transform -translate-x-[-100px] group-hover:translate-x-0 transition-transform duration-300 delay-100">
                        {favorite.vote_average && (
                          <CircularProgressBar value={favorite.vote_average} />
                        )}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRemoveFavorite(
                              favorite.media_type,
                              favorite.media_id
                            );
                          }}
                          className={classNames(
                            "flex items-center justify-center",
                            "rounded-full border-2 border-transparent dark:border-transparent",
                            "p-1 w-8 h-8 transition duration-150",
                            "backdrop-blur-sm",
                            "bg-white text-primary",
                            "dark:bg-white dark:text-secondary",
                            "hover:scale-105"
                          )}
                        >
                          <RiHeartsFill className="w-full h-full" />
                        </button>
                      </div>
                    </div>

                    <div className="mb-2 mx-4 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300 delay-300">
                      <h2 className="text-light-primary font-bold text-lg drop-shadow-lg line-clamp-2 mb-">
                        {favorite.title}
                      </h2>
                      <p className="text-light-surface text-xs line-clamp-3 leading-relaxed">
                        {favorite.overview}
                      </p>
                    </div>
                  </div>
                )}
                {isMobile && (
                  <div className="flex flex-col gap-1 col-span-2 overflow-auto scrollbar-hide">
                    <div className="flex items-center justify-between">
                      <h1 className="text-light-text dark:text-dark-text font-bold text-xl">
                        {favorite.title}
                      </h1>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRemoveFavorite(
                            favorite.media_type,
                            favorite.media_id
                          );
                        }}
                        className="p-1 text-red-500 hover:text-red-600 transition-colors"
                      >
                        <RiHeartsFill className="w-5 h-5" />
                      </button>
                    </div>
                    <h1 className="text-light-text dark:text-dark-text text-xs font-medium">
                      {formatDateToTurkishMonthDay(
                        favorite.release_date || "",
                        true
                      )}
                    </h1>
                    <h1 className="text-primary/80 dark:text-secondary/80 text-xs font-medium">
                      {genreIdsToNamesForMovies(favorite.genre_ids || [])} •{" "}
                      {favorite.media_type === "movie" ? "Film" : "Dizi"}
                    </h1>
                    <h1 className="text-light-text/70 dark:text-dark-text/70 text-xs">
                      {favorite.overview}
                    </h1>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Load More Button */}
        {pagination.current_page < pagination.last_page && (
          <div className="w-full flex items-center mt-16">
            {!isLoading ? (
              <button
                onClick={handleLoadMore}
                className={classNames(
                  "mx-auto p-2 px-8 rounded-3xl h-12",
                  "transition",
                  "border-2 border-primary dark:border-secondary",
                  "bg-transparent hover:bg-primary dark:hover:bg-secondary",
                  "text-primary dark:text-secondary hover:text-light-primary dark:hover:text-dark-text"
                )}
              >
                <h1 className="font-medium">Daha fazla yükle...</h1>
              </button>
            ) : (
              <div className="h-12 flex w-full items-center">
                <Loading />
              </div>
            )}
          </div>
        )}
      </div>
    </CoreLayout>
  );
};

export default Favorites;
