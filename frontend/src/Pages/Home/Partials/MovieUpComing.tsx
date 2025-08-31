import LazyLoadedImage from "@/components/LazyLoadedImage";
import Modal from "@/components/Modal";
import ScrollContainer from "@/components/ScrollContainer";
import { getMovieVideos } from "@/services/movie";
import { Movie } from "@/types/movie.type";
import { Link } from "react-router-dom";
import classNames from "classnames";
import { useState, useEffect } from "react";
import ReactPlayer from "react-player";
import apiClient from "@/services/api";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
"react-loading-skeleton/dist/skeleton.css";
import useTheme from "@/hooks/useTheme";

const MovieUpComing = () => {
  const { theme } = useTheme();
  const [upComings, setUpComings] = useState<Movie[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [selectedTrailer, setSelectedTrailer] = useState<string | undefined>(undefined);
  const [fetchVideos, setFetchVideos] = useState<number | null>(null);

  useEffect(() => {
    const fetchUpComings = async () => {
      try {
        setIsLoading(true);
        const response = await apiClient.get("/movie/upcomings");
        setUpComings(response.data || []);
      } catch (error) {
        console.error("Error fetching upcoming movies:", error);
        setUpComings([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUpComings();
  }, []);

  const handleOpenTrailerFrame = (id: number) => {
    setFetchVideos(id);
    getMovieVideos(id).then((videos) => {
      if (videos.length > 0) {
        const filteredData = videos.filter((item: any) => item.type === "Trailer" && item.site === "YouTube");
        if (filteredData.length > 0) {
          setSelectedTrailer(filteredData[0].key);
        }
      }
      setFetchVideos(null);
    });
  };

  const GridMember: React.FC<{ movie: Movie }> = ({ movie }) => {
    const image = movie.backdrop_path ?? movie.poster_path;

    const handleTrailerClick = (e: React.MouseEvent) => {
      // Event bubbling'i durdur
      e.stopPropagation();
      handleOpenTrailerFrame(movie.id);
    };

    return (
      <div className={classNames("flex", "relative min-w-48 max-w-48 group hover:-translate-y-2 transition duration-500", "cursor-pointer")}>
        <LazyLoadedImage
          className="w-full h-full rounded-2xl overflow-hidden"
          src={`https://image.tmdb.org/t/p/w780/${movie.poster_path}`}
          alt={movie.title}
          skeletonClassName="h-[264px]"
          isExist={!!movie.poster_path}
        />
        <div
          onClick={handleTrailerClick}
          className={classNames(
            "absolute bottom-0 left-1/2",
            "-translate-x-1/2 translate-y-1/4",
            "flex justify-center items-center",
            "transition duration-500",
            "group-hover:opacity-10 hover:!opacity-100",
            "z-10"
          )}
        >
          <div
            className={classNames("w-[4.5rem] h-[4.5rem] sm:w-[5.5rem] sm:h-[5.5rem] absolute rounded-full", {
              "border-4 border-primary dark:border-secondary border-dashed animate-[spin_10s_linear_infinite]": movie.id === fetchVideos,
              "bg-linear-light dark:bg-linear-dark group-hover:animate-[spin_2s_linear_infinite]": movie.id !== fetchVideos,
            })}
          ></div>
          <div className="rounded-full w-16 sm:w-20 h-16 sm:h-20 overflow-hidden border border-transparent z-10">
            <img className="w-full h-full object-cover" src={`https://image.tmdb.org/t/p/w200/${image}`} alt="movie-poster" />
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      <div className="w-full relative max-sm:px-2 sm:my-10">
        <div className="px-2 sm:px-0 mt-4 sm:mt-6 mb-2 sm:mb-4">
          <Link to="/movies/upcoming" className="flex items-center gap-2 w-min whitespace-nowrap">
            <h1 className="text-light-text dark:text-dark-text drop-shadow-sm font-extrabold text-2xl sm:text-3xl">Yakın Zamandakiler</h1>
          </Link>
        </div>
        <div className="edge_fade_blur dark:after:bg-fade-dark">
          <ScrollContainer className="flex gap-4 pt-2 pb-14">
            {isLoading ? (
              <SkeletonTheme baseColor={theme == "dark" ? "#111216" : "white"} highlightColor={theme == "dark" ? "#27272a" : "#dbdbdb"}>
                {Array.from({ length: 6 }).map((_, index) => (
                  <div key={index} className="flex-shrink-0">
                    <Skeleton height={300} width={200} className="rounded-lg" />
                    <Skeleton height={20} width={180} className="mt-2" />
                    <Skeleton height={16} width={150} className="mt-1" />
                  </div>
                ))}
              </SkeletonTheme>
            ) : (
              upComings &&
              upComings.length > 0 &&
              upComings.filter((movie) => movie.poster_path).map((movie, index) => <GridMember key={index} movie={movie} />)
            )}
          </ScrollContainer>
        </div>
      </div>
      <>
        <Modal show={!!selectedTrailer} onClose={() => setSelectedTrailer(undefined)} closeable className="max-w-4xl">
          <ReactPlayer width="100%" height="480px" url={`https://www.youtube.com/watch?v=${selectedTrailer}`} controls />
        </Modal>
      </>
    </>
  );
};

export default MovieUpComing;
