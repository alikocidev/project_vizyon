import useTheme from "@/Hooks/theme/useTheme";
import LazyLoad, { LazyLoadProps } from "react-lazyload";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

interface LazyLoadedImageProps extends LazyLoadProps {
    src: string | undefined;
    alt: string;
    imgClassName?: string;
    skeletonClassName?: string;
    isExist?: boolean;
}

const LazyLoadedImage: React.FC<LazyLoadedImageProps> = ({
    src,
    alt,
    imgClassName,
    skeletonClassName,
    isExist = true,
    ...lazyLoadProps
}) => {
    const { theme } = useTheme();

    return isExist ? (
        <LazyLoad
            debounce
            offset={100}
            placeholder={
                <>
                    <Skeleton
                        baseColor={theme == "dark" ? "#111216" : "white"}
                        highlightColor={theme == "dark" ? "#27272a" : "#dbdbdb"}
                        borderRadius={0}
                        className={skeletonClassName}
                    />
                </>
            }
            {...lazyLoadProps}
        >
            <img
                src={src}
                alt={alt}
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
                className={imgClassName}
            />
        </LazyLoad>
    ) : (
        <></>
    );
};

export default LazyLoadedImage;
