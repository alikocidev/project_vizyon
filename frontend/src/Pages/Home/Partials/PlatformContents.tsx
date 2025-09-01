import LazyLoadedImage from "@/components/LazyLoadedImage";
import ScrollContainer from "@/components/ScrollContainer";
import { getPlatformContent } from "@/services/platforms";
import { Platform } from "@/types/platform.type";
import classNames from "classnames";
import { useEffect, useState } from "react";
import apiClient from "@/services/api";

const PlatformContents = () => {
  const [platforms, setPlatforms] = useState<Platform[]>([
    { name: "prime", label: "Amazon", shows: [], isLoad: false },
    { name: "netflix", label: "Netflix", shows: [], isLoad: false },
    { name: "disney", label: "Disney+", shows: [], isLoad: false },
    { name: "hbo", label: "HBO", shows: [], isLoad: false },
  ]);
  const [selectedPlatform, setSelectedPlatform] = useState<Platform>(platforms[1]); // Netflix default
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchInitialPlatform = async () => {
      try {
        setIsLoading(true);
        const response = await apiClient.get("/platform/netflix/popular");
        const netflixPlatform: Platform = {
          name: "netflix",
          label: "Netflix",
          shows: response.data?.shows || [],
          isLoad: true,
        };
        setSelectedPlatform(netflixPlatform);
        setPlatforms((prevPlatforms) => prevPlatforms.map((p) => (p.name === "netflix" ? netflixPlatform : p)));
      } catch (error) {
        console.error("Error fetching Netflix platform:", error);
        // Set empty Netflix platform on error
        const emptyNetflix: Platform = {
          name: "netflix",
          label: "Netflix",
          shows: [],
          isLoad: true,
        };
        setSelectedPlatform(emptyNetflix);
        setPlatforms((prevPlatforms) => prevPlatforms.map((p) => (p.name === "netflix" ? emptyNetflix : p)));
      } finally {
        setIsLoading(false);
      }
    };

    fetchInitialPlatform();
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
          const response = await getPlatformContent(targetPlatform.name);
          const updatedPlatform: Platform = {
            ...targetPlatform,
            shows: response.shows,
            isLoad: true,
          };
          setPlatforms((prevPlatforms) => prevPlatforms.map((p) => (p.name === platformName ? updatedPlatform : p)));
          setSelectedPlatform(updatedPlatform);
        } catch (error) {
          console.error("Platform content loading error:", error);
          // Hata durumunda boş shows array ile platform'u güncelle
          const errorPlatform: Platform = {
            ...targetPlatform,
            shows: [],
            isLoad: true,
          };
          setPlatforms((prevPlatforms) => prevPlatforms.map((p) => (p.name === platformName ? errorPlatform : p)));
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
          "bg-light-surface dark:bg-dark-primary",
          "bg-cover bg-no-repeat transition-[background] bg-[center_center]"
        )}
        style={{
          backgroundImage: `url(assets/images/platforms/${selectedPlatform.name}/background.jpg)`,
        }}
      >
        <>
          <div className="absolute inset-0 bg-primary/70 dark:bg-dark-secondary/80 z-10"></div>
          <div className="absolute right-8 top-4">
            <img width={52} src={`assets/images/platforms/${selectedPlatform.name}/logo.png`} alt="platform-logo" />
          </div>
        </>
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
              <h1 className="text-xl font-semibold tracking-wide text-white">Son Zamanlarda {selectedPlatform.label}</h1>
            </div>
            <div className="w-min overflow-auto scrollbar-hide flex items-center border rounded-3xl border-primary dark:border-dark-surface">
              {platforms.map((platformItem, index) => (
                <div
                  key={index}
                  onClick={() => handleChangePlatform(platformItem.name)}
                  className={classNames("px-4 py-0.5 rounded-3xl cursor-pointer", "transition-colors relative", {
                    "bg-primary-gradient dark:bg-secondary-gradient": selectedPlatform.name === platformItem.name,
                    "opacity-50 cursor-wait": isLoading && selectedPlatform.name === platformItem.name,
                  })}
                >
                  <h1 className="font-semibold tracking-wide text-white">{platformItem.label}</h1>
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
            <div className="w-full overflow-auto">
              <ScrollContainer className="flex gap-4 pt-2 pb-8">
                {selectedPlatform.shows.map((content, contentIndex) => {
                  const imageSet = content.imageSet?.horizontalPoster;
                  let image = undefined;

                  if (imageSet) {
                    image = imageSet.w720 || imageSet.w600 || imageSet.w480 || imageSet.w360 || imageSet.w240 || undefined;
                  }

                  return (
                    <div key={contentIndex} className="flex flex-col items-center cursor-pointer">
                      <div className="w-72 rounded-lg overflow-hidden shadow">
                        <LazyLoadedImage src={image} alt="platform-content-image" skeletonClassName="h-40" className="h-40" isExist={!!image} />
                      </div>
                      <div className="mt-2 text-light-primary dark:text-dark-text text-center">
                        <h1 className="text-lg font-semibold text-ellipsis overflow-hidden">{content.title}</h1>
                        <h1 className="font-medium text-xs text-light-text/50 dark:text-dark-text/50 text-ellipsis overflow-hidden">
                          {content.originalTitle}
                        </h1>
                      </div>
                    </div>
                  );
                })}
              </ScrollContainer>
            </div>
          )}
          {isLoading && (
            <div className="w-full overflow-auto">
              <ScrollContainer className="flex gap-4 pt-2 pb-8">
                {Array.from({ length: 6 }).map((_, skeletonIndex) => (
                  <div key={skeletonIndex} className="flex flex-col items-center">
                    <div className="w-72 h-40 rounded-lg overflow-hidden shadow bg-light-surface dark:bg-dark-surface animate-pulse">
                      <></>
                    </div>
                    <div className="mt-2 text-center w-full">
                      <div className="h-5 bg-light-surface dark:bg-dark-surface rounded animate-pulse mb-1 w-3/4 mx-auto"></div>
                      <div className="h-3 bg-light-surface dark:bg-dark-surface rounded animate-pulse w-1/2 mx-auto"></div>
                    </div>
                  </div>
                ))}
              </ScrollContainer>
            </div>
          )}
          {!isLoading && selectedPlatform.shows.length === 0 && selectedPlatform.isLoad && (
            <div className="mt-4 text-center">
              <p className="text-light-text/70 dark:text-dark-text/70">Bu platform için henüz içerik bulunamadı.</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
};
export default PlatformContents;
