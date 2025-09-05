import LazyLoadedImage from "@/components/LazyLoadedImage";
import ScrollContainer from "@/components/ScrollContainer";
import { getPlatformContent } from "@/services/platforms";
import { PlatformTypes } from "@/types/platform.type";
import classNames from "classnames";
import { useEffect, useState } from "react";

const PLATFORM_LIST: { name: PlatformTypes; label: string }[] = [
  { name: "prime", label: "Amazon" },
  { name: "netflix", label: "Netflix" },
  { name: "disney", label: "Disney+" },
  { name: "hbo", label: "HBO" },
];

type PlatformState = Record<
  PlatformTypes,
  { shows: any[]; isLoad: boolean; error?: boolean }
>;

const PlatformContents = () => {
  const [platforms, setPlatforms] = useState<PlatformState>(() =>
    PLATFORM_LIST.reduce((acc, cur) => {
      acc[cur.name] = { shows: [], isLoad: false };
      return acc;
    }, {} as PlatformState)
  );
  const [active, setActive] = useState<PlatformTypes>(PLATFORM_LIST[0].name);
  const [isLoading, setIsLoading] = useState(false);

  const fetchPlatformContent = async (platformName: PlatformTypes) => {
    setIsLoading(true);
    try {
      const response = await getPlatformContent(platformName);
      setPlatforms((prev) => ({
        ...prev,
        [platformName]: {
          shows: Array.isArray(response?.shows) ? response.shows : [],
          isLoad: true,
        },
      }));
    } catch (error) {
      setPlatforms((prev) => ({
        ...prev,
        [platformName]: { shows: [], isLoad: true, error: true },
      }));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPlatformContent(active);
  }, []);

  const handleChangePlatform = (platformName: PlatformTypes) => {
    if (isLoading || active === platformName) return;
    setActive(platformName);
    if (!platforms[platformName]?.isLoad) {
      fetchPlatformContent(platformName);
    }
  };

  const renderPlatformTabs = () => (
    <div className="w-min overflow-auto scrollbar-hide flex items-center border rounded-3xl border-primary/50 dark:border-secondary/50">
      {PLATFORM_LIST.map((platformItem) => (
        <div
          key={platformItem.name}
          onClick={() => handleChangePlatform(platformItem.name)}
          className={classNames(
            "px-4 py-0.5 rounded-3xl cursor-pointer",
            "transition-colors relative",
            {
              "bg-primary-gradient dark:bg-secondary-gradient":
                active === platformItem.name,
              "opacity-50 cursor-wait":
                isLoading && active === platformItem.name,
            }
          )}
        >
          <h1 className="font-semibold tracking-wide text-white">
            {platformItem.label}
          </h1>
          {isLoading && active === platformItem.name && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
            </div>
          )}
        </div>
      ))}
    </div>
  );

  const renderContentList = () => {
    const current = platforms[active];
    if (isLoading) return renderSkeletons();
    if (current?.shows?.length > 0) {
      return (
        <div className="w-full overflow-auto">
          <ScrollContainer className="flex gap-4 pt-2 pb-8">
            {current.shows.map((content, contentIndex) => {
              const imageSet = content.imageSet?.horizontalPoster;
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
                  <div className="mt-2 text-light-primary dark:text-dark-text text-center">
                    <h1 className="text-lg font-semibold text-ellipsis overflow-hidden">
                      {content.title}
                    </h1>
                    <h1 className="font-medium text-xs text-white/50 dark:text-dark-text/50 text-ellipsis overflow-hidden">
                      {content.originalTitle}
                    </h1>
                  </div>
                </div>
              );
            })}
          </ScrollContainer>
        </div>
      );
    }
    if (current?.isLoad && (!current.shows || current.shows.length === 0)) {
      return (
        <div className="mt-4 text-center">
          <p className="text-light-text/70 dark:text-dark-text/70">
            Bu platform için henüz içerik bulunamadı.
          </p>
        </div>
      );
    }
    return null;
  };

  const renderSkeletons = () => (
    <div className="w-full overflow-auto">
      <ScrollContainer className="flex gap-4 pt-2 pb-8">
        {Array.from({ length: 6 }).map((_, skeletonIndex) => (
          <div key={skeletonIndex} className="flex flex-col items-center">
            <div className="w-72 h-40 rounded-lg overflow-hidden shadow bg-light-surface dark:bg-dark-surface animate-pulse"></div>
            <div className="mt-2 text-center w-full">
              <div className="h-5 bg-light-surface dark:bg-dark-surface rounded animate-pulse mb-1 w-3/4 mx-auto"></div>
              <div className="h-3 bg-light-surface dark:bg-dark-surface rounded animate-pulse w-1/2 mx-auto"></div>
            </div>
          </div>
        ))}
      </ScrollContainer>
    </div>
  );

  return (
    <div
      className={classNames(
        "relative",
        "w-full",
        "animate-fade-in",
        "bg-light-surface dark:bg-dark-primary",
        "bg-cover bg-no-repeat transition-[background] bg-[center_center]"
      )}
      style={{
        backgroundImage: `url(assets/images/platforms/${active}/background.jpg)`,
      }}
    >
      <div className="absolute inset-0 bg-primary/70 dark:bg-dark-secondary/80 z-10"></div>
      <div className="absolute right-8 top-4">
        <img
          width={52}
          src={`assets/images/platforms/${active}/logo.png`}
          alt="platform-logo"
        />
      </div>
      <div
        className={classNames(
          "relative xl:w-3/5 lg:w-3/4 sm:w-11/12 mx-auto",
          "overflow-auto z-10 px-4 py-4",
          "flex flex-col justify-between",
          "min-h-[24rem] h-[24rem]"
        )}
      >
        <div className="flex max-md:flex-col md:items-center gap-4 pr-4">
          <div className="lg:mr-14">
            <h1 className="text-xl font-semibold tracking-wide text-white">
              Son Zamanlarda{" "}
              {PLATFORM_LIST.find((p) => p.name === active)?.label}
            </h1>
          </div>
          {renderPlatformTabs()}
        </div>
        {renderContentList()}
      </div>
    </div>
  );
};
export default PlatformContents;
