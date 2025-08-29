import LazyLoadedImage from "@/Components/LazyLoadedImage";
import LoadingDot from "@/Components/LoadingDot";
import { iShow } from "@/types/discover.type";
import classNames from "classnames";
import { MdFullscreen } from "react-icons/md";

type ShowListProps = {
    isLoading: boolean;
    shows: iShow[];
    onSelect: (show: iShow) => void;
};

const ShowList = ({ isLoading, shows, onSelect }: ShowListProps) => {
    return (
        <>
            <>
                {isLoading && (
                    <div className="flex items-center justify-center w-full mt-16">
                        <LoadingDot />
                    </div>
                )}
            </>
            <>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-4 md:gap-6">
                    {!isLoading &&
                        shows &&
                        shows.length > 0 &&
                        shows.map((show, i) => {
                            const title = show.title || show.name;
                            const release_date =
                                show.release_date || show.first_air_date;
                            return (
                                <div
                                    key={i}
                                    onClick={() => onSelect(show)}
                                    className={classNames(
                                        "w-full rounded-3xl relative flex cursor-pointer overflow-hidden items-center justify-center",
                                        "group shadow"
                                    )}
                                >
                                    <LazyLoadedImage
                                        skeletonClassName={
                                            "h-[300px] sm:h-[320px] md:h-[340px] lg:h-[360px]"
                                        }
                                        className="w-full h-full"
                                        src={`https://image.tmdb.org/t/p/w780/${show.poster_path}`}
                                        alt="movie-poster"
                                        isExist={!!show.poster_path}
                                    />
                                    <div className="translate-x-full group-hover:translate-x-0 opacity-0 group-hover:opacity-100 transition duration-300 absolute top-2 right-2 bg-white/75 rounded-lg p-1">
                                        <MdFullscreen className="w-4 h-4 text-black" />
                                    </div>
                                </div>
                            );
                        })}
                </div>
            </>
        </>
    );
};
export default ShowList;
