import useTheme from "@/hooks/useTheme";
import LazyLoad, { LazyLoadProps } from "react-lazyload";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { useState } from "react";

interface LazyLoadedImageProps extends LazyLoadProps {
  src: string | undefined;
  alt: string;
  imgClassName?: string;
  skeletonClassName?: string;
  isExist?: boolean;
  onImageError?: () => void;
}

const LazyLoadedImage: React.FC<LazyLoadedImageProps> = ({ src, alt, imgClassName, skeletonClassName, isExist = true, onImageError, ...lazyLoadProps }) => {
  const { theme } = useTheme();
  const [imageError, setImageError] = useState(false);

  const handleImageError = () => {
    setImageError(true);
    onImageError?.();
  };

  if (!isExist || imageError) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gray-200 dark:bg-gray-800">
        <svg
          className="w-16 h-16 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>
      </div>
    );
  }

  return (
    <LazyLoad
      debounce
      offset={100}
      placeholder={
        <Skeleton
          baseColor={theme == "dark" ? "#111216" : "white"}
          highlightColor={theme == "dark" ? "#27272a" : "#dbdbdb"}
          borderRadius={0}
          className={skeletonClassName}
        />
      }
      {...lazyLoadProps}
    >
      <img
        src={src}
        alt={alt}
        style={{ width: "100%", height: "100%", objectFit: "cover" }}
        className={imgClassName}
        onError={handleImageError}
      />
    </LazyLoad>
  );
};

export default LazyLoadedImage;
