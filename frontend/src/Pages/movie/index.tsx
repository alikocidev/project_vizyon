import { useAuth } from "@/hooks/useAuth";
import CoreLayout from "@/layouts/Core";
import { useEffect, useState } from "react";
import Tabs from "./partials/Tabs";
import { Movie as MovieProps, TabListProps } from "@/types/movie.type";
import classNames from "classnames";
import LazyLoadedImage from "@/components/LazyLoadedImage";
import CircularProgressBar from "@/components/CircularProgressBar";
import {
  getMovieGoat,
  getMoviePopular,
  getMovieTheaters,
  getMovieTrending,
  getMovieUpComings,
} from "@/services/movie";
import {
  formatDateToTurkishMonthDay,
  genreIdsToNamesForMovies,
} from "@/utils/misc";
import Loading from "@/components/Loading";
import { RiHeartsFill, RiHeart3Line } from "react-icons/ri";
import { useDevice } from "@/hooks/useDevice";
import { useFavorite } from "@/hooks/useFavorite";
import toast from "react-hot-toast";

const TABS: Record<TabListProps, string> = {
  popular: "Popüler",
  theaters: "Vizyondakiler",
  upcomings: "Çok Yakında",
  trending: "Son Trendler",
  goat: "En İyiler",
};

const fetchFunc = (activeTab: TabListProps, page: number) => {
  switch (activeTab) {
    case "theaters":
      return getMovieTheaters(page);
    case "upcomings":
      return getMovieUpComings(page);
    case "popular":
      return getMoviePopular(page);
    case "trending":
      return getMovieTrending(page, "week");
    case "goat":
      return getMovieGoat(page);
    default:
      return Promise.resolve([]);
  }
};

const Movie = () => {
  const { user } = useAuth();
  const { isMobile } = useDevice();
  const { toggleFavorite, checkFavorite } = useFavorite();

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<TabListProps>("popular");
  const [movies, setMovies] = useState<MovieProps[]>([]);
  const [page, setPage] = useState<number>(1);
  const [favoriteStates, setFavoriteStates] = useState<Record<number, boolean>>(
    {}
  );

  const [noLimit, setNoLimit] = useState<boolean>(false);

  const fetchMovies = async () => {
    setIsLoading(true);
    setMovies([]);
    setFavoriteStates({});
    fetchFunc(activeTab, 1)
      .then(async (newMovies) => {
        setMovies(newMovies);

        // Check favorite status for each movie if user is authenticated
        if (user && newMovies.length > 0) {
          const favoritePromises = newMovies.map(async (movie) => {
            const isFavorite = await checkFavorite({
              media_type: "movie",
              media_id: movie.id,
            });
            return { id: movie.id, isFavorite };
          });

          const favoriteResults = await Promise.all(favoritePromises);
          const newFavoriteStates = favoriteResults.reduce(
            (acc, { id, isFavorite }) => {
              acc[id] = isFavorite;
              return acc;
            },
            {} as Record<number, boolean>
          );

          setFavoriteStates(newFavoriteStates);
        }
      })
      .finally(() => {
        setPage(1);
        setIsLoading(false);
        setNoLimit(false);
      });
  };

  const handlePageChange = () => {
    const newPage = page + 1;
    setIsLoading(true);
    fetchFunc(activeTab, newPage)
      .then(async (newMovies) => {
        setMovies((prevMovies) => [...prevMovies, ...newMovies]);
        setPage(newPage);
        if (newMovies.length === 0) {
          setNoLimit(true);
        } else {
          // Check favorite status for new movies if user is authenticated
          if (user && newMovies.length > 0) {
            const favoritePromises = newMovies.map(async (movie) => {
              const isFavorite = await checkFavorite({
                media_type: "movie",
                media_id: movie.id,
              });
              return { id: movie.id, isFavorite };
            });

            const favoriteResults = await Promise.all(favoritePromises);
            const newFavoriteStates = favoriteResults.reduce(
              (acc, { id, isFavorite }) => {
                acc[id] = isFavorite;
                return acc;
              },
              {} as Record<number, boolean>
            );

            setFavoriteStates((prev) => ({ ...prev, ...newFavoriteStates }));
          }
        }
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  useEffect(() => {
    fetchMovies();
  }, [activeTab]);

  const handleFavoriteClick = async (
    movie: MovieProps,
    event: React.MouseEvent
  ) => {
    event.stopPropagation(); // Prevent triggering parent click events

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

      // Update local state
      setFavoriteStates((prev) => ({ ...prev, [movieId]: !currentIsFavorite }));

      await toggleFavorite(favoriteData, currentIsFavorite);

      if (currentIsFavorite) {
        toast.success("Favorilerden kaldırıldı");
      } else {
        toast.success("Favorilere eklendi");
      }
    } catch (error: any) {
      toast.error(error.message || "Bir hata oluştu");
    }
  };

  return (
    <CoreLayout user={user} title="Movie">
      <div className="flex flex-col gap-4 xl:w-3/5 lg:w-3/4 sm:w-11/12 mx-auto">
        <div className="mt-4 sm:mt-10 mb-4 max-sm:ml-2">
          <h1 className="text-5xl font-extrabold tracking-wide select-none text-light-text dark:text-dark-text">
            {TABS[activeTab]}
          </h1>
        </div>
        <Tabs
          tabs={TABS}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          isLoading={isLoading}
        />
        <div
          className={classNames({
            "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2": !isMobile,
            "flex flex-col gap-2 px-2": isMobile,
          })}
        >
          {movies &&
            movies.length > 0 &&
            movies.map((movie, i) => (
              <div
                key={i}
                className={classNames(
                  "relative group border border-light-text/5 dark:border-dark-text/5",
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
                  src={`https://image.tmdb.org/t/p/w780/${movie.poster_path}`}
                  isExist={!!movie.poster_path}
                  alt={movie.title}
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
                      <div className="relative flex flex-col gap-1 transform translate-x-[-100px] group-hover:translate-x-0 transition-transform duration-300 delay-100">
                        <h1 className="w-max whitespace-nowrap py-1 font-medium px-2 text-xs text-white bg-primary/50 dark:bg-dark-surface/75 backdrop-blur-sm">
                          {formatDateToTurkishMonthDay(
                            movie.release_date,
                            true
                          )}
                        </h1>
                        <h1 className="w-max whitespace-nowrap py-1 font-medium px-2 text-xs text-white bg-primary/50 dark:bg-dark-surface/75 backdrop-blur-sm">
                          {genreIdsToNamesForMovies(movie.genre_ids)}
                        </h1>
                      </div>
                      <div className="relative right-1 z-10 flex flex-col items-center gap-1 transform -translate-x-[-100px] group-hover:translate-x-0 transition-transform duration-300 delay-100">
                        <CircularProgressBar value={movie.vote_average} />
                        <button
                          onClick={(e) => handleFavoriteClick(movie, e)}
                          className={classNames(
                            "flex items-center justify-center",
                            "rounded-full border-2 border-transparent dark:border-transparent",
                            "p-1 w-8 h-8 transition duration-150",
                            {
                              "bg-red-500/90 text-white":
                                favoriteStates[movie.id],
                              "bg-primary/50 text-white/80 dark:bg-dark-secondary/80 dark:text-dark-text/80":
                                !favoriteStates[movie.id],
                            },
                            "hover:bg-white hover:text-primary",
                            "dark:hover:text-secondary dark:hover:bg-white"
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

                    <div className="mb-2 mx-4 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300 delay-300">
                      <h2 className="text-light-primary font-bold text-lg drop-shadow-lg line-clamp-2 mb-">
                        {movie.title}
                      </h2>
                      <p className="text-light-surface text-xs line-clamp-3 leading-relaxed">
                        {movie.overview}
                      </p>
                    </div>
                  </div>
                )}
                {isMobile && (
                  <>
                    <div className="flex flex-col gap-1 col-span-2 overflow-auto scrollbar-hide">
                      <h1 className="text-light-text dark:text-dark-text font-bold text-xl">
                        {movie.title}
                      </h1>
                      <h1 className="text-light-text dark:text-dark-text text-xs font-medium">
                        {formatDateToTurkishMonthDay(movie.release_date, true)}
                      </h1>
                      <h1 className="text-primary/80 dark:text-secondary/80 text-xs font-medium">
                        {genreIdsToNamesForMovies(movie.genre_ids)}
                      </h1>
                      <h1 className="text-light-text/70 dark:text-dark-text/70 text-xs">
                        {movie.overview}
                      </h1>
                    </div>
                    <button
                      onClick={(e) => handleFavoriteClick(movie, e)}
                      className={classNames(
                        "absolute top-2 right-2",
                        "flex items-center justify-center",
                        "rounded-full border-2 border-transparent dark:border-transparent",
                        "p-1 w-6 h-6 transition duration-150",
                        {
                          "bg-red-500/90 text-white": favoriteStates[movie.id],
                          "bg-primary/50 text-white/80 dark:bg-dark-primary/80 dark:text-dark-text/80":
                            !favoriteStates[movie.id],
                        },
                        "hover:bg-white hover:text-primary",
                        "dark:hover:text-secondary dark:hover:bg-white"
                      )}
                    >
                      {favoriteStates[movie.id] ? (
                        <RiHeartsFill className="w-full h-full" />
                      ) : (
                        <RiHeart3Line className="w-full h-full" />
                      )}
                    </button>
                  </>
                )}
              </div>
            ))}
        </div>
        <div className="w-full flex items-center mt-16">
          {!noLimit &&
            (!isLoading ? (
              <button
                onClick={handlePageChange}
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
            ))}
        </div>
      </div>
    </CoreLayout>
  );
};

export default Movie;
