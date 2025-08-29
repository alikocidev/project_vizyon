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
    const [Platforms, setPlatforms] = useState<iPlatform[]>([
        { name: "prime", label: "Amazon", shows: [], isLoad: false },
        { name: "netflix", label: "Netflix", shows: [], isLoad: false },
        { name: "disney", label: "Disney+", shows: [], isLoad: false },
        { name: "blutv", label: "BluTv", shows: [], isLoad: false },
    ]);
    const [sPlatform, setSelectedPlatform] = useState<iPlatform>(platform);
    const [wait, setWait] = useState<boolean>(false);

    useEffect(() => {
        const _platform = Platforms.find((p) => p.name === platform.name);
        const updatedPlatform: iPlatform = {
            ..._platform,
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
        if (wait) return;
        const platform = Platforms.find((p) => p.name === platformName);
        if (platform) {
            if (!platform.isLoad) {
                setWait(true);
                const response = await GetPlatformContent(platform.name);
                setWait(false);
                const updatedPlatform: iPlatform = {
                    ...platform,
                    shows: response.shows,
                    isLoad: true,
                };
                setPlatforms((prevPlatforms) =>
                    prevPlatforms.map((p) =>
                        p.name === platformName ? updatedPlatform : p
                    )
                );
                setSelectedPlatform(updatedPlatform);
            } else {
                setSelectedPlatform(platform);
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
                    backgroundImage: `url(assets/images/platforms/${sPlatform.name}/background.jpg)`,
                }}
            >
                <>
                    <div className="absolute inset-0 bg-royal-950/70 dark:bg-black/50 z-10"></div>
                    <div className="absolute right-2 top-2">
                        <img
                            width={52}
                            src={`assets/images/platforms/${sPlatform.name}/logo.png`}
                            alt="platform-logo"
                        />
                    </div>
                </>
                <div className="relative w-full z-10 pl-4 py-4 flex flex-col justify-between min-h-[24rem]">
                    <div className="flex max-md:flex-col md:items-center gap-4 pr-4">
                        <div className="lg:mr-14">
                            <h1 className="text-xl font-semibold tracking-wide text-white">
                                Son Zamanlarda {sPlatform.label}
                            </h1>
                        </div>
                        <div className="w-min overflow-auto scrollbar-hide flex items-center border rounded-3xl border-royal-500 dark:border-white/30">
                            {Platforms.map((platform, i) => (
                                <div
                                    key={i}
                                    onClick={() =>
                                        handleChangePlatform(platform.name)
                                    }
                                    className={classNames(
                                        "px-4 py-0.5 rounded-3xl cursor-pointer",
                                        "transition-colors",
                                        {
                                            "bg-linear-3 dark:bg-linear-1":
                                                sPlatform.name == platform.name,
                                        }
                                    )}
                                >
                                    <h1 className="font-semibold tracking-wide text-white">
                                        {platform.label}
                                    </h1>
                                </div>
                            ))}
                        </div>
                    </div>
                    {sPlatform.shows.length > 0 && (
                        <div className="edge_fade_blur after:bg-fade-royal dark:after:bg-fade-dark mt-4">
                            <div className="w-full overflow-auto">
                                <ScrollContainer className="flex gap-4 pt-2 pb-8">
                                    {sPlatform.shows.map((content, i) => {
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
                                                key={i}
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
                </div>
            </div>
        </>
    );
};
export default PlatformContents;
