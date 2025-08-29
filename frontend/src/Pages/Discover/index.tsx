import CoreLayout from "@/Layouts/Core";
import { PageProps } from "@/types";
import { FilterBar, ShowList } from "@/Pages/Discover/Partials";
import TextInput from "@/Components/TextInput";
import { useEffect, useState } from "react";
import { IoSearchSharp } from "react-icons/io5";
import { iFilterKeys, iShow } from "@/types/discover.type";
import { DiscoverNewThings, SearchNewThings } from "@/Services/Discover";
import classNames from "classnames";
import LoadingDot from "@/Components/LoadingDot";
import {
    deepEqual,
    genreIdsToNamesForMovies,
    genreIdsToNamesForTV,
} from "@/Utils/misc";
import Modal from "@/Components/Modal";
import { MdOutlineMenuOpen } from "react-icons/md";

interface DiscoverProps extends PageProps {
    shows: iShow[];
}

const FIRST_VALUES: iFilterKeys = {
    show_type: "movie",
    sort_by: "popularity.desc",
    primary_release_date_year_min: 1900,
    primary_release_date_year_max: 2024,
    with_genres: [] as number[],
    vote_average_min: 0,
    vote_average_max: 10,
    with_original_language: undefined,
};

const Discover = ({ auth, shows }: DiscoverProps) => {
    const [page, setPage] = useState<number>(1);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isMoreLoading, setMoreIsLoading] = useState<boolean>(false);
    const [isDiff, setIsDiff] = useState<boolean>(false);
    const [isModalShow, setIsModalShow] = useState<boolean>(false);
    const [isMobileActive, setMobile] = useState<boolean>(false);
    const [selectedShow, setSelectedShow] = useState<iShow>({} as iShow);
    const [FilterValues, setFilterValues] = useState<iFilterKeys>(FIRST_VALUES);
    const [lastFilters, setLastFilters] = useState<iFilterKeys>(FIRST_VALUES);
    const [Shows, setShows] = useState<iShow[]>(shows);

    const [searchQuery, setSearchQuery] = useState<string>(
        (route().params?.s as string) || ""
    );

    useEffect(() => {
        if (lastFilters && FilterValues) {
            setIsDiff(!deepEqual(lastFilters, FilterValues));
        }
    }, [lastFilters, FilterValues]);

    const handleSearch = () => {
        const query = searchQuery.trim().toLowerCase();
        if (query.length < 3) return;
        setIsLoading(true);
        SearchNewThings(FilterValues.show_type, query, 1)
            .then((newShows) => {
                setShows(newShows);
            })
            .finally(() => setIsLoading(false));
    };

    const handleSubmit = () => {
        setLastFilters(FilterValues);
        setIsLoading(true);
        DiscoverNewThings(FilterValues, 1)
            .then((newShows) => {
                setShows(newShows);
            })
            .finally(() => setIsLoading(false));
    };

    const handleClickMore = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        const newPage = page + 1;
        if (newPage > 10) return;
        setMoreIsLoading(true);
        if (searchQuery.trim().toLowerCase().length >= 3) {
            SearchNewThings(
                FilterValues.show_type,
                searchQuery.trim().toLowerCase(),
                newPage
            )
                .then((newShows) => {
                    setShows((prevShows) => [...prevShows, ...newShows]);
                    setPage((prevPage) => prevPage + 1);
                })
                .finally(() => setMoreIsLoading(false));
        } else {
            DiscoverNewThings(FilterValues, newPage)
                .then((newShows) => {
                    setShows((prevShows) => [...prevShows, ...newShows]);
                    setPage((prevPage) => prevPage + 1);
                })
                .finally(() => setMoreIsLoading(false));
        }
    };

    const handleOnSelectShow = (show: iShow) => {
        console.log(show);

        setSelectedShow(show);
        setIsModalShow((p) => !p);
    };

    return (
        <>
            <CoreLayout user={auth.user} title="Vizyondakiler" big>
                <div className="w-full h-full flex flex-col">
                    <div className="z-[51] w-full border-b pt-6 pb-8 max-xl:px-2 bg-F7F2EB dark:bg-111216 border-gray-200 dark:border-white/5">
                        <div className="w-full flex items-center justify-between">
                            <h1 className="text-5xl sm:text-7xl font-extrabold tracking-wide select-none">
                                Keşfet
                            </h1>
                            <div className="flex items-center max-md:hidden">
                                <TextInput
                                    id="search"
                                    type="text"
                                    name="search"
                                    className="border-2 border-gray-200 w-96 py-2.5 px-4 rounded-xl mr-2 dark:bg-shark-950 dark:placeholder:text-white focus:placeholder:text-transparent dark:focus:placeholder:text-transparent"
                                    placeholder="Aklında ki içerik ?"
                                    autoComplete="off"
                                    value={searchQuery}
                                    onChange={(e) =>
                                        setSearchQuery(e.target.value)
                                    }
                                />
                                <button
                                    onClick={handleSearch}
                                    className="p-2.5 bg-white dark:text-white dark:bg-shark-950 border-2 border-gray-200 rounded-xl dark:border-gray-700 text-indigo-500 hover:border-indigo-500 dark:hover:border-indigo-500"
                                >
                                    <IoSearchSharp className="w-6 h-6" />
                                </button>
                            </div>
                            <div className="md:hidden h-8 sm:h-10">
                                <button
                                    onClick={() => setMobile(!isMobileActive)}
                                >
                                    <MdOutlineMenuOpen className="w-8 h-8 sm:h-10 sm:w-10" />
                                </button>
                            </div>
                        </div>
                    </div>
                    <div className={classNames("relative md:hidden z-50")}>
                        <div
                            className={classNames(
                                "absolute w-full p-6 bg-F7F2EB dark:bg-0F0E0E transition",
                                "shadow border-b transition-[opacity,transform] ease-in-out duration-200",
                                {
                                    "opacity-50 translate-x-full":
                                        !isMobileActive,
                                    "opacity-100 translate-x-0": isMobileActive,
                                }
                            )}
                        >
                            <div className="flex items-center mb-4">
                                <TextInput
                                    id="search"
                                    type="text"
                                    name="search"
                                    className="border-2 border-gray-200 w-96 py-2.5 px-4 mr-2 dark:bg-shark-950 dark:placeholder:text-white focus:placeholder:text-transparent dark:focus:placeholder:text-transparent"
                                    placeholder="Aklında ki içerik ?"
                                    autoComplete="off"
                                    value={searchQuery}
                                    onChange={(e) =>
                                        setSearchQuery(e.target.value)
                                    }
                                />
                                <button
                                    onClick={handleSearch}
                                    className="p-2.5 bg-white dark:text-white dark:bg-shark-950 border-2 border-gray-200 dark:border-gray-700 text-indigo-500 hover:border-indigo-500 dark:hover:border-indigo-500"
                                >
                                    <IoSearchSharp className="w-6 h-6" />
                                </button>
                            </div>
                            <FilterBar onChange={setFilterValues} />
                        </div>
                    </div>
                    <div className="flex items-start">
                        <div className="max-md:hidden border-r border-gray-200 dark:border-white/5 pt-4 max-xl:px-2 md:pr-4 lg:pr-6">
                            <FilterBar onChange={setFilterValues} />
                        </div>
                        <div className="px-4 xl:pr-0 mt-4 w-full">
                            <ShowList
                                isLoading={isLoading}
                                shows={Shows}
                                onSelect={handleOnSelectShow}
                            />
                            <div
                                className={classNames("mt-16", {
                                    flex: !isLoading,
                                    hidden: isLoading,
                                })}
                            >
                                {!isMoreLoading ? (
                                    <button
                                        onClick={handleClickMore}
                                        className={classNames(
                                            "mx-auto p-2 px-8 rounded-3xl h-12",
                                            "transition",
                                            "focus:ring-2 focus:ring-offset-2",
                                            "bg-royal-950 hover:bg-royal-800 focus:bg-royal-800",
                                            "focus:ring-royal-800 dark:focus:ring-lotus-600",
                                            "focus:ring-offset-F7F2EB dark:focus:ring-offset-111216",
                                            "dark:bg-lotus-700 dark:hover:bg-lotus-600 dark:focus:bg-lotus-600"
                                        )}
                                    >
                                        <h1 className="text-white dark:text-FFF2D7 font-bold">
                                            Daha fazla yükle...
                                        </h1>
                                    </button>
                                ) : (
                                    <div className="h-12 flex w-full items-center justify-center">
                                        <LoadingDot />
                                    </div>
                                )}
                            </div>
                        </div>
                        {isDiff && (
                            <div className="fixed bottom-0 left-0 w-full bg-indigo-500 dark:bg-shark-950 shadow z-[51] sm:opacity-25 hover:opacity-100 transition-opacity duration-300">
                                <button
                                    onClick={handleSubmit}
                                    className="flex items-center justify-center w-full py-4"
                                >
                                    <h1 className="text-white text-xl font-extrabold uppercase">
                                        Ara
                                    </h1>
                                </button>
                            </div>
                        )}
                    </div>
                </div>
                <Modal
                    closeable
                    show={isModalShow}
                    onClose={() => setIsModalShow(false)}
                    className="sm:max-w-2xl"
                >
                    {selectedShow && (
                        <div className="flex max-sm:flex-col max-sm:items-center">
                            <label className="peer sm:min-w-72 sm:max-w-72 overflow-hidden shadow relative block">
                                <input
                                    type="checkbox"
                                    className="peer hidden"
                                />
                                <img
                                    className="w-full"
                                    src={`https://image.tmdb.org/t/p/w780/${selectedShow?.poster_path}`}
                                    alt="movie-poster"
                                />
                            </label>
                            <div className="transition duration-300 max-sm:peer-has-[:checked]:opacity-0 modal-show-info w-full flex flex-col gap-1 relative max-sm:absolute bg-white dark:bg-0F0E0E max-sm:bottom-0">
                                <div className="p-2">
                                    <button className="mb-2 font-thin text-3xl dark:text-white text-start w-full">
                                        {selectedShow.title ||
                                            selectedShow.name}
                                    </button>
                                    <div className="pt-2 max-h-40 flex overflow-auto w-full border-t dark:border-gray-500 ">
                                        <h1 className="text-xs font-medium text-gray-700 dark:text-gray-300">
                                            {selectedShow.overview}
                                        </h1>
                                    </div>
                                </div>
                                <div className="ml-2 flex flex-col text-gray-700 dark:text-gray-300 text-sm">
                                    <h1>
                                        <span className="mr-1">&#8226;</span>
                                        {selectedShow.title
                                            ? genreIdsToNamesForMovies(
                                                  selectedShow.genre_ids
                                              )
                                            : genreIdsToNamesForTV(
                                                  selectedShow.genre_ids
                                              )}
                                    </h1>
                                </div>
                                <div className="border-t dark:border-gray-700 mt-auto px-2 py-4 text-gray-700 dark:text-gray-500 text-sm flex items-center">
                                    <div className="flex items-center">
                                        <svg
                                            className="w-4 h-4 text-yellow-400"
                                            aria-hidden="true"
                                            xmlns="http://www.w3.org/2000/svg"
                                            fill="currentColor"
                                            viewBox="0 0 22 20"
                                        >
                                            <path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z" />
                                        </svg>
                                        <p className="ms-1 text-sm font-bold text-gray-900 dark:text-gray-100">
                                            {selectedShow?.vote_average?.toFixed(
                                                1
                                            )}
                                        </p>
                                        <span className="w-1 h-1 mx-1.5 bg-gray-500 rounded-full dark:bg-gray-100"></span>
                                        <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                                            {selectedShow?.vote_count} inceleme
                                        </span>
                                    </div>

                                    <h1 className="ml-auto">
                                        {selectedShow.release_date ||
                                            selectedShow.first_air_date}
                                    </h1>
                                </div>
                            </div>
                        </div>
                    )}
                </Modal>
            </CoreLayout>
        </>
    );
};

export default Discover;
