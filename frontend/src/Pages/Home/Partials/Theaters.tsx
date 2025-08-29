import { useState } from "react";
import classNames from "classnames";
import { iMovie } from "@/types/movie.type";
import { MdArrowForwardIos } from "react-icons/md";
import {
    formatDateToTurkishMonthDay,
    genreIdsToNamesForMovies,
} from "@/Utils/misc";
import LazyLoadedImage from "@/Components/LazyLoadedImage";
import { Link } from "react-router-dom";

interface MovieButtonProps {
    movie: iMovie;
}
interface MovieGridProps {
    movies: iMovie[];
}

interface iTheatersPage {
    theaters: iMovie[];
}

const Theaters = ({ theaters }: iTheatersPage) => {
    const moviesPerPage = 4;
    const [page, setPage] = useState<number>(1);

    const handlePageClick = (
        e: React.MouseEvent<HTMLButtonElement>,
        forward: boolean
    ) => {
        e.preventDefault();
        const totalPages = Math.ceil(theaters.length / moviesPerPage);
        if (forward) {
            setPage(page === totalPages ? 1 : page + 1);
        } else {
            setPage(page === 1 ? totalPages : page - 1);
        }
    };

    const MovieButton: React.FC<MovieButtonProps> = ({ movie }) =>
        movie && (
            <div className={classNames("flex relative group cursor-pointer")}>
                <div className="flex w-full h-full relative overflow-hidden">
                    <LazyLoadedImage
                        className="w-full h-full group-hover:scale-[1.025] transition duration-500"
                        src={`https://image.tmdb.org/t/p/w780/${movie.poster_path}`}
                        alt={movie.title}
                        skeletonClassName="h-[420px]"
                        isExist={!!movie.poster_path}
                    />
                    <div
                        className={classNames(
                            "absolute w-full h-full inset-0",
                            "flex flex-col justify-between",
                            "transition -translate-x-full duration-500",
                            "opacity-0",
                            "group-hover:translate-x-0 group-hover:opacity-100"
                        )}
                    >
                        <div className="mt-4 flex-col gap-1 w-full flex">
                            <h1 className="w-min whitespace-nowrap py-0.5 px-1 text-sm border-l-2 border-primary bg-primary/75 dark:border-secondary dark:bg-secondary/75 text-white font-bold">
                                {formatDateToTurkishMonthDay(
                                    movie.release_date
                                )}
                            </h1>
                            <h1 className="w-min whitespace-nowrap p-1 text-xs border-l-2 border-light-text bg-light-text/75 dark:border-dark-text dark:bg-dark-text/75 text-white overflow-hidden max-w-[75%] text-ellipsis">
                                {genreIdsToNamesForMovies(movie.genre_ids)}
                            </h1>
                        </div>
                    </div>
                </div>
            </div>
        );

    const MovieGrid: React.FC<MovieGridProps> = ({ movies }) => {
        const startIndex = (page - 1) * moviesPerPage;
        const endIndex = startIndex + moviesPerPage;
        const moviesToDisplay = movies.slice(startIndex, endIndex);

        return (
            <div className="w-full relative max-sm:px-2 min-h-[620px] md:min-h-[420px]">
                <div
                    className={classNames(
                        "h-full grid grid-cols-2 md:grid-cols-4 animate-fade-in overflow-hidden rounded-2xl"
                    )}
                >
                    {moviesToDisplay.map((movie, index) => (
                        <MovieButton key={index} movie={movie} />
                    ))}
                </div>
            </div>
        );
    };

    return (
        <>
            <div className="px-2 sm:px-0 mt-4 sm:mt-6 mb-4">
                <div className="flex items-center justify-between">
                    <Link to="/movies/theaters">
                        <h1 className="text-light-text dark:text-dark-text drop-shadow-sm font-extrabold text-2xl sm:text-2xl hover:text-primary dark:hover:text-secondary transition duration-150 ease-in-out">
                            Vizyondakiler
                        </h1>
                    </Link>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={(e) => handlePageClick(e, false)}
                            className={classNames(
                                "p-1.5 rounded transition duration-150 ease-in-out",
                                "bg-primary hover:bg-primary/90 dark:bg-secondary dark:hover:bg-secondary/90",
                                "text-white dark:text-white"
                            )}
                        >
                            <MdArrowForwardIos className="rotate-180" />
                        </button>
                        <button
                            onClick={(e) => handlePageClick(e, true)}
                            className={classNames(
                                "p-1.5 rounded transition duration-150 ease-in-out",
                                "bg-primary hover:bg-primary/90 dark:bg-secondary dark:hover:bg-secondary/90",
                                "text-white dark:text-white"
                            )}
                        >
                            <MdArrowForwardIos />
                        </button>
                    </div>
                </div>
            </div>
            {theaters && theaters.length > 0 && <MovieGrid movies={theaters} />}
        </>
    );
};

export default Theaters;
