import LazyLoadedImage from "@/Components/LazyLoadedImage";
import ScrollContainer from "@/Components/ScrollContainer";
import { GetPlatformContent } from "@/Services/Platforms";
import { iPlatform } from "@/types/platform.type";
import classNames from "classnames";
import { useEffect, useState } from "react";

interface iPlatformComponent {
    platform: iPlatform;
}

const PlatformContents = ({ platform }: iPlatformComponent) => {
    const [platforms, setPlatforms] = useState<iPlatform[]>([
        { name: "prime", label: "Amazon", shows: [], isLoad: false },
        { name: "netflix", label: "Netflix", shows: [], isLoad: false },
        { name: "disney", label: "Disney+", shows: [], isLoad: false },
        { name: "hbo", label: "HBO", shows: [], isLoad: false },
    ]);
    const [selectedPlatform, setSelectedPlatform] = useState<iPlatform>(platform);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    useEffect(() => {
        const existingPlatform = platforms.find((p) => p.name === platform.name);
        const updatedPlatform: iPlatform = {
            ...existingPlatform,
            ...platform,
            shows: platform.shows,
            isLoad: true,
        };
        setPlatforms((prevPlatforms) =>
            prevPlatforms.map((p) =>
                p.name === platform.name ? updatedPlatform : p
            )
        );
    }, []);

    const handleChangePlatform = async (platformName: string) => {
        if (isLoading) return;
        const targetPlatform = platforms.find((p) => p.name === platformName);
        if (targetPlatform) {
            // Hemen platform değiştir (UI responsiveness için)
            setSelectedPlatform(targetPlatform);
            
            if (!targetPlatform.isLoad) {
                setIsLoading(true);
                try {
                    const response = await GetPlatformContent(targetPlatform.name);
                    const updatedPlatform: iPlatform = {
                        ...targetPlatform,
                        shows: response.shows,
                        isLoad: true,
                    };
                    setPlatforms((prevPlatforms) =>
                        prevPlatforms.map((p) =>
                            p.name === platformName ? updatedPlatform : p
                        )
                    );
                    setSelectedPlatform(updatedPlatform);
                } catch (error) {
                    console.error('Platform content loading error:', error);
                    // Hata durumunda boş shows array ile platform'u güncelle
                    const errorPlatform: iPlatform = {
                        ...targetPlatform,
                        shows: [],
                        isLoad: true,
                    };
                    setPlatforms((prevPlatforms) =>
                        prevPlatforms.map((p) =>
                            p.name === platformName ? errorPlatform : p
                        )
                    );
                    setSelectedPlatform(errorPlatform);
                } finally {
                    setIsLoading(false);
                }
            }
        }
    };

    return (
        <>
            <div
                className={classNames(
                    "relative",
                    "w-full",
                    "animate-fade-in",
                    "bg-dbdbdb dark:bg-111216",
                    "bg-cover bg-no-repeat transition-[background] bg-[center_center]"
                )}
                style={{
                    backgroundImage: `url(assets/images/platforms/${selectedPlatform.name}/background.jpg)`,
                }}
            >
                <>
                    <div className="absolute inset-0 bg-royal-950/70 dark:bg-black/50 z-10"></div>
                    <div className="absolute left-2 bottom-2">
                        <img
                            width={52}
                            src={`assets/images/platforms/${selectedPlatform.name}/logo.png`}
                            alt="platform-logo"
                        />
                    </div>
                </>
                <div className="relative w-full z-10 pl-4 py-4 flex flex-col justify-between min-h-[24rem] h-[24rem]">
                    <div className="flex max-md:flex-col md:items-center gap-4 pr-4">
                        <div className="lg:mr-14">
                            <h1 className="text-xl font-semibold tracking-wide text-white">
                                Son Zamanlarda {selectedPlatform.label}
                            </h1>
                        </div>
                        <div className="w-min overflow-auto scrollbar-hide flex items-center border rounded-3xl border-royal-500 dark:border-white/30">
                            {platforms.map((platformItem, index) => (
                                <div
                                    key={index}
                                    onClick={() =>
                                        handleChangePlatform(platformItem.name)
                                    }
                                    className={classNames(
                                        "px-4 py-0.5 rounded-3xl cursor-pointer",
                                        "transition-colors relative",
                                        {
                                            "bg-linear-3 dark:bg-linear-1":
                                                selectedPlatform.name === platformItem.name,
                                            "opacity-50 cursor-wait": isLoading && selectedPlatform.name === platformItem.name,
                                        }
                                    )}
                                >
                                    <h1 className="font-semibold tracking-wide text-white">
                                        {platformItem.label}
                                    </h1>
                                    {isLoading && selectedPlatform.name === platformItem.name && (
                                        <div className="absolute inset-0 flex items-center justify-center">
                                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                    {selectedPlatform.shows.length > 0 && !isLoading && (
                        <div className="edge_fade_blur after:bg-fade-royal dark:after:bg-fade-dark mt-4">
                            <div className="w-full overflow-auto">
                                <ScrollContainer className="flex gap-4 pt-2 pb-8">
                                    {selectedPlatform.shows.map((content, contentIndex) => {
                                        const imageSet =
                                            content.imageSet?.horizontalPoster;
                                        let image = undefined;

                                        if (imageSet) {
                                            image =
                                                imageSet.w720 ||
                                                imageSet.w600 ||
                                                imageSet.w480 ||
                                                imageSet.w360 ||
                                                imageSet.w240 ||
                                                undefined;
                                        }

                                        return (
                                            <div
                                                key={contentIndex}
                                                className="flex flex-col items-center cursor-pointer"
                                            >
                                                <div className="w-72 rounded-lg overflow-hidden shadow">
                                                    <LazyLoadedImage
                                                        src={image}
                                                        alt="platform-content-image"
                                                        skeletonClassName="h-40"
                                                        className="h-40"
                                                        isExist={!!image}
                                                    />
                                                </div>
                                                <div className="mt-2 text-white dark:text-current text-center">
                                                    <h1 className="text-lg font-semibold text-ellipsis overflow-hidden">
                                                        {content.title}
                                                    </h1>
                                                    <h1 className="font-medium text-xs text-opacity-50 text-white text-ellipsis overflow-hidden">
                                                        {content.originalTitle}
                                                    </h1>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </ScrollContainer>
                            </div>
                        </div>
                    )}
                    {isLoading && (
                        <div className="edge_fade_blur after:bg-fade-royal dark:after:bg-fade-dark mt-4">
                            <div className="w-full overflow-auto">
                                <ScrollContainer className="flex gap-4 pt-2 pb-8">
                                    {Array.from({ length: 6 }).map((_, skeletonIndex) => (
                                        <div
                                            key={skeletonIndex}
                                            className="flex flex-col items-center"
                                        >
                                            <div className="w-72 h-40 rounded-lg overflow-hidden shadow bg-gray-300 dark:bg-gray-700 animate-pulse">
                                                {/* Skeleton image */}
                                            </div>
                                            <div className="mt-2 text-center w-full">
                                                <div className="h-5 bg-gray-300 dark:bg-gray-700 rounded animate-pulse mb-1 w-3/4 mx-auto"></div>
                                                <div className="h-3 bg-gray-300 dark:bg-gray-700 rounded animate-pulse w-1/2 mx-auto"></div>
                                            </div>
                                        </div>
                                    ))}
                                </ScrollContainer>
                            </div>
                        </div>
                    )}
                    {!isLoading && selectedPlatform.shows.length === 0 && selectedPlatform.isLoad && (
                        <div className="mt-4 text-center">
                            <p className="text-white/70 dark:text-white/50">
                                Bu platform için henüz içerik bulunamadı.
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};
export default PlatformContents;
