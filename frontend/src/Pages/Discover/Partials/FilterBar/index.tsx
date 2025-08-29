import MultiRangeSlider from "@/Components/MultiRangeSlider";
import SelectMenu from "@/Components/SelectMenu";
import { Tmdb_MovieGenres, Tmdb_TvGenres } from "@/Utils/misc";
import {
    iFilterGenres,
    iFilterKeys,
    iFilterOriginalLanguage,
    iFilterSortBy,
} from "@/types/discover.type";
import { iGenre } from "@/types/movie.type";
import classNames from "classnames";
import { useEffect, useState } from "react";

interface iFilterBar {
    onChange: (filter: iFilterKeys) => void;
}

const _t_sort_by = (key: iFilterSortBy) => {
    switch (key) {
        case "popularity.asc":
            return "Artan Popülerlik";
        case "popularity.desc":
            return "Azalan Popülerlik";
        case "primary_release_date.asc":
            return "Artan Yayın Tarihi";
        case "primary_release_date.desc":
            return "Azalan Yayın Tarihi";
        case "title.asc":
            return "Başlık (A-Z)";
        case "title.desc":
            return "Başlık (Z-A)";
        case "vote_average.asc":
            return "Artan Oy Ortalaması";
        case "vote_average.desc":
            return "Azalan Oy Ortalaması";
        default:
            return "";
    }
};

const FilterBar: React.FC<iFilterBar> = ({ onChange }) => {
    const [show_type, setShowType] = useState<"movie" | "tv">("movie");
    const [genres, setGenres] = useState<iGenre[]>(Tmdb_MovieGenres);
    const [sort_by, setSortBy] = useState<iFilterSortBy>("popularity.desc");

    const [primary_release_date_year_min, setPrimaryReleaseDateYearMin] =
        useState<number>(1900);
    const [primary_release_date_year_max, setPrimaryReleaseDateYearMax] =
        useState<number>(new Date().getFullYear());

    const [with_genres, setWithGenres] = useState<iFilterGenres[]>([]);

    const [with_original_language, setWithOriginalLanguage] =
        useState<iFilterOriginalLanguage>();

    const [vote_average_min, setVoteAverageMin] = useState<number>(0);
    const [vote_average_max, setVoteAverageMax] = useState<number>(10);

    useEffect(() => {
        if (show_type == "movie") setGenres(Tmdb_MovieGenres);
        else setGenres(Tmdb_TvGenres);
        setWithGenres([]);
    }, [show_type]);

    useEffect(() => {
        onChange({
            show_type,
            sort_by,
            primary_release_date_year_min,
            primary_release_date_year_max,
            with_genres,
            with_original_language,
            vote_average_min,
            vote_average_max,
        });
    }, [
        show_type,
        sort_by,
        primary_release_date_year_min,
        primary_release_date_year_max,
        with_genres,
        with_original_language,
        vote_average_min,
        vote_average_max,
    ]);

    const handleChangeFilterValue = (
        value: any,
        dispatch: React.Dispatch<React.SetStateAction<any>>
    ) => {
        dispatch(value);
    };

    const handleChangeFilterVoteAverage = (min: number, max: number) => {
        handleChangeFilterValue(min, setVoteAverageMin);
        handleChangeFilterValue(max, setVoteAverageMax);
    };

    const handleChangeFilterSortBy = (selectedOption: any) => {
        if (!selectedOption) return;
        handleChangeFilterValue(selectedOption, setSortBy);
    };

    const handleChangeFilterWithOriginalLanguage = (selectedOption: any) => {
        handleChangeFilterValue(selectedOption, setWithOriginalLanguage);
    };

    const handleChangeFilterPrimaryReleaseDateYear = (
        min: number,
        max: number
    ) => {
        handleChangeFilterValue(min, setPrimaryReleaseDateYearMin);
        handleChangeFilterValue(max, setPrimaryReleaseDateYearMax);
    };

    const handleToggleFilterGenre = (id: number) => {
        const _g = with_genres;
        const new_g = _g.includes(id)
            ? _g.filter((g) => g !== id)
            : [..._g, id];
        handleChangeFilterValue(new_g, setWithGenres);
    };

    const handleChangeFilterShowType = (type: "movie" | "tv") => {
        handleChangeFilterValue(type, setShowType);
    };

    return (
        <>
            <div className="flex flex-col gap-6 md:w-40 lg:w-60">
                <div id="filter_show_type">
                    <>
                        <h1 className="font-medium mb-2">Tür Seç</h1>
                        <div className="flex items-center justify-between">
                            <button
                                onClick={() =>
                                    handleChangeFilterShowType("movie")
                                }
                                className={classNames(
                                    "w-full border p-2 border-shark-200 dark:border-shark-800",
                                    "rounded-l",
                                    "transition",
                                    {
                                        "bg-shark-200 dark:bg-shark-800":
                                            show_type == "movie",
                                    }
                                )}
                            >
                                Film
                            </button>
                            <button
                                onClick={() => handleChangeFilterShowType("tv")}
                                className={classNames(
                                    "w-full border p-2 border-shark-200 dark:border-shark-800",
                                    "rounded-r",
                                    "transition",
                                    {
                                        "bg-shark-200 dark:bg-shark-800":
                                            show_type == "tv",
                                    }
                                )}
                            >
                                Dizi
                            </button>
                        </div>
                    </>
                </div>
                <div id="filter_sort_by">
                    <>
                        <h1 className="font-medium mb-2">Sıralama Ölçütü</h1>
                        <SelectMenu
                            autoSelect
                            label="Select an option"
                            options={[
                                {
                                    label: _t_sort_by("popularity.desc"),
                                    value: "popularity.desc",
                                },
                                {
                                    label: _t_sort_by("popularity.asc"),
                                    value: "popularity.asc",
                                },
                                {
                                    label: _t_sort_by(
                                        "primary_release_date.desc"
                                    ),
                                    value: "primary_release_date.desc",
                                },
                                {
                                    label: _t_sort_by(
                                        "primary_release_date.asc"
                                    ),
                                    value: "primary_release_date.asc",
                                },
                                {
                                    label: _t_sort_by("title.desc"),
                                    value: "title.desc",
                                },
                                {
                                    label: _t_sort_by("title.asc"),
                                    value: "title.asc",
                                },
                                {
                                    label: _t_sort_by("vote_average.desc"),
                                    value: "vote_average.desc",
                                },
                                {
                                    label: _t_sort_by("vote_average.asc"),
                                    value: "vote_average.asc",
                                },
                            ]}
                            onChange={handleChangeFilterSortBy}
                        />
                    </>
                </div>
                <div id="filter_vote_average">
                    <>
                        <h1 className="font-medium mb-4">Puanı</h1>
                        <div className="relative pb-4">
                            <MultiRangeSlider
                                min={0}
                                max={10}
                                onChange={({ min, max }) =>
                                    handleChangeFilterVoteAverage(min, max)
                                }
                                step={0.1}
                            />
                        </div>
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                            <span className="text-black dark:text-white">
                                {vote_average_min}
                            </span>
                            {" ile "}
                            <span className="text-black dark:text-white">
                                {vote_average_max}
                            </span>
                            {" puan arası"}
                        </span>
                    </>
                </div>
                <div id="filter_with_original_language">
                    <>
                        <h1 className="font-medium mb-2">Lisan</h1>
                        <SelectMenu
                            label="Select an option"
                            options={[
                                { label: "Hiçbiri", value: "" },
                                {
                                    label: "İngilizce",
                                    value: "en",
                                },
                                {
                                    label: "Fransızca",
                                    value: "fr",
                                },
                                {
                                    label: "İspanyolca",
                                    value: "es",
                                },
                                {
                                    label: "Almanca",
                                    value: "de",
                                },
                                {
                                    label: "İtalyanca",
                                    value: "it",
                                },
                                {
                                    label: "Japonca",
                                    value: "ja",
                                },
                                {
                                    label: "Korece",
                                    value: "ko",
                                },
                                {
                                    label: "Çince",
                                    value: "zh",
                                },
                                {
                                    label: "Portekizce",
                                    value: "pt",
                                },
                                {
                                    label: "Rusça",
                                    value: "ru",
                                },
                                {
                                    label: "Hintçe",
                                    value: "hi",
                                },
                                {
                                    label: "Arapça",
                                    value: "ar",
                                },
                                {
                                    label: "Bengalce",
                                    value: "bn",
                                },
                                {
                                    label: "Çekçe",
                                    value: "cs",
                                },
                                {
                                    label: "Danca",
                                    value: "da",
                                },
                                {
                                    label: "Yunanca",
                                    value: "el",
                                },
                                {
                                    label: "İbranice",
                                    value: "he",
                                },
                                {
                                    label: "Macarca",
                                    value: "hu",
                                },
                                {
                                    label: "Endonezce",
                                    value: "id",
                                },
                                {
                                    label: "Malayca",
                                    value: "ms",
                                },
                                {
                                    label: "Felemenkçe",
                                    value: "nl",
                                },
                                {
                                    label: "Norveççe",
                                    value: "no",
                                },
                                {
                                    label: "Lehçe",
                                    value: "pl",
                                },
                                {
                                    label: "Rumence",
                                    value: "ro",
                                },
                                {
                                    label: "İsveççe",
                                    value: "sv",
                                },
                                {
                                    label: "Tamilce",
                                    value: "ta",
                                },
                                {
                                    label: "Tayca",
                                    value: "th",
                                },
                                {
                                    label: "Türkçe",
                                    value: "tr",
                                },
                                {
                                    label: "Ukraynaca",
                                    value: "uk",
                                },
                                {
                                    label: "Vietnamca",
                                    value: "vi",
                                },
                            ]}
                            onChange={handleChangeFilterWithOriginalLanguage}
                        />
                    </>
                </div>
                <div id="filter_primary_release_date_year">
                    <>
                        <h1 className="font-medium mb-4">Gösterim Tarihi</h1>
                        <div className="relative pb-4">
                            <MultiRangeSlider
                                min={1900}
                                max={2024}
                                onChange={({ min, max }) =>
                                    handleChangeFilterPrimaryReleaseDateYear(
                                        min,
                                        max
                                    )
                                }
                            />
                        </div>
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                            <span className="text-black dark:text-white">
                                {primary_release_date_year_min}
                            </span>
                            {" ile "}
                            <span className="text-black dark:text-white">
                                {primary_release_date_year_max}
                            </span>
                            {" yılları arası"}
                        </span>
                    </>
                </div>
                <div id="filter_genres">
                    <>
                        <h1 className="font-medium mb-4">Türlere Göre</h1>
                        <div className="grid grid-cols-2 gap-2">
                            {genres?.map((genre, i) => (
                                <button
                                    key={i}
                                    className={classNames(
                                        "px-2.5 py-1 border border-indigo-500 dark:border-shark-900",
                                        "hover:bg-indigo-500 hover:dark:bg-shark-900 hover:text-white",
                                        {
                                            "bg-indigo-500 dark:bg-shark-900 text-white":
                                                with_genres.includes(genre.id),
                                            "bg-white dark:bg-111216 text-black dark:text-gray-300":
                                                !with_genres.includes(genre.id),
                                        }
                                    )}
                                    onClick={() =>
                                        handleToggleFilterGenre(genre.id)
                                    }
                                >
                                    <span className="text-sm">
                                        {genre.name}
                                    </span>
                                </button>
                            ))}
                        </div>
                    </>
                </div>
            </div>
        </>
    );
};

export default FilterBar;
