import { useAuth } from "@/hooks/useAuth";
import CoreLayout from "@/layouts/Core";
import { useEffect, useState } from "react";
import Tabs from "./partials/Tabs";
import { Movie as MovieProps, TabListProps } from "@/types/movie.type";
import classNames from "classnames";
import LazyLoadedImage from "@/components/LazyLoadedImage";
import CircularProgressBar from "@/components/CircularProgressBar";
import { getMovieGoat, getMoviePopular, getMovieTheaters, getMovieTrending, getMovieUpComings } from "@/services/movie";
import { formatDateToTurkishMonthDay, genreIdsToNamesForMovies } from "@/utils/misc";
import Loading from "@/components/Loading";
import { RiHeartsFill } from "react-icons/ri";
import { useDevice } from "@/hooks/useDevice";

const keyToName: Record<TabListProps, string> = {
  theaters: "Vizyondakiler",
  upcomings: "Çok Yakında",
  popular: "Popüler",
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
  const isMobile = useDevice();

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<TabListProps>("popular");
  const [movies, setMovies] = useState<MovieProps[]>([]);
  const [page, setPage] = useState<number>(1);

  const [noLimit, setNoLimit] = useState<boolean>(false);

  const fetchMovies = async () => {
    setIsLoading(true);
    setMovies([]);
    fetchFunc(activeTab, 1)
      .then((newMovies) => {
        setMovies(newMovies);
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
      .then((newMovies) => {
        setMovies((prevMovies) => [...prevMovies, ...newMovies]);
        setPage(newPage);
        if (newMovies.length === 0) {
          setNoLimit(true);
        }
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  useEffect(() => {
    fetchMovies();
  }, [activeTab]);

  return (
    <CoreLayout user={user} title="Movie">
      <div className="flex flex-col gap-4 xl:w-3/5 lg:w-3/4 sm:w-11/12 mx-auto">
        <div className="mt-4 sm:mt-10 mb-4 max-sm:ml-2">
          <h1 className="text-5xl font-extrabold tracking-wide select-none text-light-text dark:text-dark-text">{keyToName[activeTab]}</h1>
        </div>
        <Tabs activeTab={activeTab} setActiveTab={setActiveTab} isLoading={isLoading} />
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
                className={classNames("group", "relative w-full", "cursor-pointer", "rounded-3xl overflow-hidden", "shadow-2xl", {
                  "h-[320px] sm:h-[340px] md:h-[360px] lg:h-[380px] xl:h-[400px] 2xl:h-[420px]": !isMobile,
                  "h-[640px]": isMobile,
                })}
              >
                <LazyLoadedImage
                  skeletonClassName="w-full h-full"
                  className="absolute inset-0 z-0"
                  src={`https://image.tmdb.org/t/p/w780/${movie.poster_path}`}
                  isExist={!!movie.poster_path}
                  alt={movie.title}
                />
                <div
                  className={classNames(
                    "relative w-full h-full z-50 mt-1",
                    "flex flex-col justify-between",
                    "bg-gradient-to-t from-black/90 via-black/50 to-transparent",
                    "opacity-0 group-hover:opacity-100",
                    "transition-opacity duration-300 ease-in-out"
                  )}
                >
                  <div className="w-full flex items-center justify-between">
                    <div className="relative flex flex-col gap-1 transform translate-x-[-100px] group-hover:translate-x-0 transition-transform duration-300 delay-100">
                      <h1 className="w-max whitespace-nowrap py-1 font-medium px-2 text-xs text-white bg-primary/50 dark:bg-dark-surface/75 backdrop-blur-sm">
                        {formatDateToTurkishMonthDay(movie.release_date, true)}
                      </h1>
                      <h1 className="w-max whitespace-nowrap py-1 font-medium px-2 text-xs text-white bg-primary/50 dark:bg-dark-surface/75 backdrop-blur-sm">
                        {genreIdsToNamesForMovies(movie.genre_ids)}
                      </h1>
                    </div>
                    <div className="relative right-1 z-10 flex flex-col items-center gap-1 transform -translate-x-[-100px] group-hover:translate-x-0 transition-transform duration-300 delay-100">
                      <CircularProgressBar value={movie.vote_average} />
                      <button
                        className={classNames(
                          "flex items-center justify-center",
                          "rounded-full border-2 border-transparent dark:border-transparent",
                          "p-1 w-8 h-8 transition duration-150",
                          "bg-primary/50 text-white/80 dark:bg-dark-secondary/80 dark:text-dark-text/80",
                          "hover:bg-white hover:text-primary",
                          "dark:hover:text-secondary dark:hover:bg-white"
                        )}
                      >
                        <RiHeartsFill className="w-full h-full" />
                      </button>
                    </div>
                  </div>

                  <div className="mb-2 mx-4 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300 delay-300">
                    <h2 className="text-light-primary font-bold text-lg drop-shadow-lg line-clamp-2 mb-">{movie.title}</h2>
                    <p className="text-light-surface text-xs line-clamp-3 leading-relaxed">{movie.overview}</p>
                  </div>
                </div>
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
