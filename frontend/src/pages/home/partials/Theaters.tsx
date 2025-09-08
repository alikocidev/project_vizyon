import { useState, useEffect } from "react";
import classNames from "classnames";
import { Movie } from "@/types/movie.type";
import {
  formatDateToTurkishMonthDay,
  genreIdsToNamesForMovies,
} from "@/utils/misc";
import LazyLoadedImage from "@/components/LazyLoadedImage";
import { useNavigate } from "react-router-dom";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
("react-loading-skeleton/dist/skeleton.css");
import React from "react";
import useTheme from "@/hooks/useTheme";
import ScrollContainer, {
  useScrollContext,
} from "@/components/ScrollContainer";
import { getMovieTheaters } from "@/services/movie";

const Theaters = () => {
  const [theaters, setTheaters] = useState<Movie[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { theme } = useTheme();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTheaters = () => {
      setIsLoading(true);
      getMovieTheaters(1)
        .then((response) => {
          setTheaters(response || []);
          setIsLoading(false);
        })
        .catch((error) => {
          console.error("Error fetching theaters movies:", error);
        });
    };

    fetchTheaters();
  }, []);

  const GridMember: React.FC<{ movie: Movie }> = ({ movie }) => {
    const { hasMoved } = useScrollContext();

    const handleRedirectDetail = (id: number) => {
      if (hasMoved) return;
      navigate(`/movie/${id}`);
    };

    const handleMainClick = (e: React.MouseEvent) => {
      if (hasMoved) {
        e.preventDefault();
        e.stopPropagation();
        return;
      }

      handleRedirectDetail(movie.id);
    };

    return (
      <div
        onClick={handleMainClick}
        className={classNames("relative group w-full min-w-72 cursor-pointer")}
      >
        <div className="flex w-full h-full relative rounded-3xl overflow-hidden">
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
              "absolute left-0 top-0 w-full h-full",
              "flex flex-col justify-between",
              "bg-gradient-to-t from-black/90 via-black/50 to-transparent",
              "opacity-0 group-hover:opacity-100",
              "transition-opacity duration-300 ease-in-out"
            )}
          >
            {/* Top Info */}
            <div className="mt-6 flex-col gap-2 w-full flex">
              <div className="transform translate-x-[-100px] group-hover:translate-x-0 transition-transform duration-300 delay-100">
                <h1 className="w-min whitespace-nowrap py-1 px-2 text-xs border-l-2 border-primary/60 bg-primary/50 dark:border-dark-surface dark:bg-dark-surface/75 backdrop-blur-sm text-white overflow-hidden max-w-[85%] text-ellipsis rounded-r">
                  {formatDateToTurkishMonthDay(movie.release_date)}
                </h1>
              </div>
              <div className="transform translate-x-[-100px] group-hover:translate-x-0 transition-transform duration-300 delay-200">
                <h1 className="w-min whitespace-nowrap py-1 px-2 text-xs border-l-2 border-white/60 bg-white/20 dark:border-dark-surface dark:bg-dark-surface/75 backdrop-blur-sm text-white overflow-hidden max-w-[85%] text-ellipsis rounded-r">
                  {genreIdsToNamesForMovies(movie.genre_ids)}
                </h1>
              </div>
            </div>

            {/* Bottom Info */}
            <div className="mb-1 mx-4 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300 delay-300">
              <h2 className="text-light-primary font-bold text-lg drop-shadow-lg line-clamp-2 mb-">
                {movie.title}
              </h2>
              <p className="text-light-surface text-xs line-clamp-3 leading-relaxed">
                {movie.overview}
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      <div className="w-full relative max-sm:px-2 sm:my-10">
        <div className="px-2 sm:px-0 mt-4 sm:mt-6 mb-2 sm:mb-4">
          <h1 className="text-light-text dark:text-dark-text drop-shadow-sm font-extrabold text-2xl sm:text-3xl">
            Vizyondakiler
          </h1>
        </div>
        <div className="edge_fade_blur dark:after:bg-fade-dark">
          <ScrollContainer className="flex gap-4 pt-2">
            {isLoading ? (
              <SkeletonTheme
                baseColor={theme == "dark" ? "#111216" : "white"}
                highlightColor={theme == "dark" ? "#27272a" : "#dbdbdb"}
              >
                {Array.from({ length: 6 }).map((_, index) => (
                  <div key={index} className="flex-shrink-0">
                    <Skeleton
                      height={300}
                      width={200}
                      className="rounded-lg mr-4"
                    />
                    <Skeleton height={20} width={180} className="mt-2" />
                    <Skeleton height={16} width={150} className="mt-1" />
                  </div>
                ))}
              </SkeletonTheme>
            ) : (
              theaters &&
              theaters.length > 0 &&
              theaters
                .filter((movie) => movie.poster_path)
                .map((movie, index) => <GridMember key={index} movie={movie} />)
            )}
          </ScrollContainer>
        </div>
      </div>
    </>
  );
};

export default React.memo(Theaters);
