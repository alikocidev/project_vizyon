import { useState, useEffect } from "react";
import classNames from "classnames";
import { Movie } from "@/types/movie.type";
import { MdArrowForwardIos } from "react-icons/md";
import { formatDateToTurkishMonthDay, genreIdsToNamesForMovies } from "@/utils/misc";
import LazyLoadedImage from "@/components/LazyLoadedImage";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
"react-loading-skeleton/dist/skeleton.css";
import React from "react";
import apiClient from "@/services/api";
import useTheme from "@/hooks/useTheme";

interface MovieButtonProps {
  movie: Movie;
  isLoading?: boolean;
}
interface MovieGridProps {
  movies: Movie[];
  isLoading?: boolean;
}

const Theaters = () => {
  const moviesPerPage = 4;
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [theaters, setTheaters] = useState<Movie[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { theme } = useTheme();

  useEffect(() => {
    const fetchTheaters = async () => {
      try {
        setIsLoading(true);
        const response = await apiClient.get("/movie/theaters");
        setTheaters(response.data || []);
      } catch (error) {
        console.error("Error fetching theaters:", error);
        setTheaters([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTheaters();
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.1,
      },
    },
    exit: {
      opacity: 0,
      transition: { duration: 0.2 },
    },
  };

  const movieVariants = {
    hidden: {
      x: 100,
    },
    visible: {
      x: 0,
      transition: {
        type: "spring" as const,
        damping: 20,
        stiffness: 300,
      },
    },
  };

  const handlePageChange = async (e: React.MouseEvent<HTMLButtonElement>, isForward: boolean) => {
    e.preventDefault();
    if (isLoading) return;

    const totalPages = Math.ceil(theaters.length / moviesPerPage);
    if (isForward) {
      setCurrentPage(currentPage === totalPages ? 1 : currentPage + 1);
    } else {
      setCurrentPage(currentPage === 1 ? totalPages : currentPage - 1);
    }
  };

  const MovieButton: React.FC<MovieButtonProps> = ({ movie, isLoading = false }) => {
    if (isLoading) {
      return (
        <SkeletonTheme baseColor={theme == "dark" ? "#111216" : "white"} highlightColor={theme == "dark" ? "#27272a" : "#dbdbdb"}>
          <motion.div className="flex relative group" variants={movieVariants} initial="hidden" animate="visible">
            <div className="flex w-full h-full relative overflow-hidden">
              <div className="w-full h-[420px] dark:bg-dark-primary dark:animate-pulse">
                <Skeleton height={"100%"} className="w-full dark:!bg-dark-primary rounded-none" />
              </div>
            </div>
          </motion.div>
        </SkeletonTheme>
      );
    }

    return movie ? (
      <motion.div variants={movieVariants} initial="hidden" animate="visible" className="flex relative group cursor-pointer">
        <Link to={`/movie/${movie.id}`} className="w-full h-full block">
          <div className="flex w-full h-full relative overflow-hidden shadow-lg">
            <LazyLoadedImage
              className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
              src={`https://image.tmdb.org/t/p/w780/${movie.poster_path}`}
              alt={movie.title}
              skeletonClassName="h-[420px]"
              isExist={!!movie.poster_path}
            />

            {/* Hover Overlay */}
            <div
              className={classNames(
                "absolute w-full h-full inset-0",
                "flex flex-col justify-between",
                "bg-gradient-to-t from-black/90 via-black/50 to-transparent",
                "opacity-0 group-hover:opacity-100",
                "transition-opacity duration-300 ease-in-out"
              )}
            >
              {/* Top Info */}
              <div className="mt-1 flex-col gap-2 w-full flex px-1">
                <div className="transform translate-x-[-100px] group-hover:translate-x-0 transition-transform duration-300 delay-100">
                  <h1 className="w-min whitespace-nowrap py-1 px-2 text-sm border-l-2 border-primary bg-primary/80 dark:border-secondary dark:bg-secondary/80 text-white font-bold rounded-r">
                    {formatDateToTurkishMonthDay(movie.release_date)}
                  </h1>
                </div>
                <div className="transform translate-x-[-100px] group-hover:translate-x-0 transition-transform duration-300 delay-200">
                  <h1 className="w-min whitespace-nowrap py-1 px-2 text-xs border-l-2 border-white/60 bg-white/20 backdrop-blur-sm text-white overflow-hidden max-w-[85%] text-ellipsis rounded-r">
                    {genreIdsToNamesForMovies(movie.genre_ids)}
                  </h1>
                </div>
              </div>

              {/* Bottom Info */}
              <div className="mb-1 mx-4 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300 delay-300">
                <h2 className="text-light-primary font-bold text-lg drop-shadow-lg line-clamp-2 mb-">{movie.title}</h2>
                <p className="text-light-surface text-xs line-clamp-3 leading-relaxed">{movie.overview}</p>
              </div>
            </div>
          </div>
        </Link>
      </motion.div>
    ) : null;
  };

  const MovieGrid: React.FC<MovieGridProps> = ({ movies, isLoading = false }) => {
    const startIndex = (currentPage - 1) * moviesPerPage;
    const endIndex = startIndex + moviesPerPage;
    const moviesToDisplay = movies.slice(startIndex, endIndex);

    if (isLoading) {
      return (
        <motion.div
          className="w-full relative max-sm:px-2 min-h-[620px] md:min-h-[420px]"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <div className="h-full grid grid-cols-2 md:grid-cols-4 overflow-hidden">
            {Array.from({ length: moviesPerPage }).map((_, skeletonIndex) => (
              <MovieButton key={skeletonIndex} movie={{} as Movie} isLoading={true} />
            ))}
          </div>
        </motion.div>
      );
    }

    return (
      <div className="w-full relative max-sm:px-2 min-h-[620px] md:min-h-[420px]">
        <button
          onClick={(e) => handlePageChange(e, false)}
          disabled={isLoading}
          className={classNames(
            "absolute left-0 top-0 z-50 h-full",
            "p-1.5 rounded-r transition",
            "bg-primary/25 dark:bg-secondary/25",
            "text-white dark:text-white",
            "opacity-50 hover:opacity-100 disabled:opacity-0 disabled:cursor-not-allowed"
          )}
        >
          <MdArrowForwardIos className="rotate-180" />
        </button>
        <motion.div
          key={currentPage}
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          className="h-full grid grid-cols-2 md:grid-cols-4 overflow-hidden"
        >
          {moviesToDisplay.map((movie, movieIndex) => (
            <MovieButton key={`${movie.id}-${movieIndex}`} movie={movie} />
          ))}
        </motion.div>
        <button
          onClick={(e) => handlePageChange(e, true)}
          disabled={isLoading}
          className={classNames(
            "absolute right-0 top-0 z-50 h-full rotate-180",
            "p-1.5 rounded-r transition",
            "bg-primary/25 dark:bg-secondary/25",
            "text-white dark:text-white",
            "opacity-50 hover:opacity-100 disabled:opacity-0 disabled:cursor-not-allowed"
          )}
        >
          <MdArrowForwardIos className="rotate-180" />
        </button>
      </div>
    );
  };

  return (
    <>
      <motion.div
        className="px-2 sm:px-0 mt-4 sm:mt-6 mb-4"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center justify-between">
          <Link to="/movies/theaters">
            <h1 className="text-light-text dark:text-dark-text drop-shadow-sm font-extrabold text-2xl sm:text-2xl">Vizyondakiler</h1>
          </Link>
        </div>
      </motion.div>
      {(theaters && theaters.length > 0) || isLoading ? (
        <MovieGrid movies={theaters} isLoading={isLoading} />
      ) : (
        <motion.div
          className="w-full relative max-sm:px-2 min-h-[420px] flex items-center justify-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="text-center">
            <motion.h3
              className="text-light-text dark:text-dark-text text-lg font-semibold"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              Şu anda vizyonda film bulunmuyor
            </motion.h3>
            <motion.p
              className="text-light-text/70 dark:text-dark-text/70 text-sm mt-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              Yeni filmler için daha sonra tekrar kontrol edin.
            </motion.p>
          </div>
        </motion.div>
      )}
    </>
  );
};

export default React.memo(Theaters);
