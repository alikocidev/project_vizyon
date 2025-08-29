import { useEffect, useState } from "react";
import ReactPlayer from "react-player";
import Modal from "@/Components/Modal";
import ScrollContainer from "@/Components/ScrollContainer";
import { iUpComingSeries } from "@/types/series.type";

const LatestSeriesTrailers = () => {
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [lastSeries, ,] = useState<iUpComingSeries[]>([]);
    const [selectedTrailer, setSelectedTrailer] = useState<string | null>(null);

    useEffect(() => {
        setIsLoading(false);
    }, []);

    const OpenTrailerFrame = (url: string) => {
        setSelectedTrailer(url);
    };

    return (
        !isLoading && (
            <>
                <div className="px-2 sm:px-0 mt-4 sm:mt-6 mb-2 sm:mb-4">
                    <h1 className="text-royal-950 dark:text-FFF2D7 drop-shadow-sm font-extrabold text-2xl sm:text-3xl">
                        Son Fragmanlar
                    </h1>
                </div>
                <div className="max-sm:px-2 relative">
                    <div className="edge_fade_blur dark:after:bg-fade-dark">
                        <ScrollContainer className="w-full flex items-center pt-4 px-2 gap-6">
                            {lastSeries.map((serie, i) => (
                                <div
                                    key={i}
                                    onClick={() =>
                                        OpenTrailerFrame(serie.meta.link)
                                    }
                                    className="flex flex-col justify-center items-center relative group cursor-pointer"
                                >
                                    <div className="relative flex justify-center items-center">
                                        <div className="group-hover:animate-[spin_2s_linear_infinite] w-[6.5rem] h-[6.5rem] absolute rounded-full bg-linear-light dark:bg-linear-dark"></div>
                                        <div className="w-[6rem] h-[6rem] rounded-full z-10 border-4 border-F7F2EB dark:border-111216">
                                            <img
                                                className="rounded-full"
                                                src={serie.meta.image}
                                                alt="serie-thumbnail"
                                            />
                                        </div>
                                    </div>
                                    <div className="max-w-32 whitespace-nowrap mt-2.5">
                                        <h1 className="text-base font-medium text-ellipsis overflow-hidden">
                                            {serie.name}
                                        </h1>
                                    </div>
                                    <h1 className="text-gray-600 text-sm">
                                        Sezon {serie.meta.season}
                                    </h1>
                                </div>
                            ))}
                        </ScrollContainer>
                    </div>
                </div>
                <>
                    <Modal
                        show={!!selectedTrailer}
                        onClose={() => setSelectedTrailer(null)}
                        closeable
                        className="max-w-4xl"
                    >
                        <ReactPlayer
                            width="100%"
                            height="480px"
                            url={`https://www.youtube.com/watch?v=${selectedTrailer}`}
                            controls
                        />
                    </Modal>
                </>
            </>
        )
    );
};

export default LatestSeriesTrailers;
