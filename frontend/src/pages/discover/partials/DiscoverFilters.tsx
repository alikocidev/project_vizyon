import { useState } from "react";
import classNames from "classnames";
import { DiscoverFilters as DiscoverFiltersType } from "@/services/discover";
import { Tmdb_MovieGenres } from "@/utils/misc";

interface DiscoverFiltersProps {
  filters: DiscoverFiltersType;
  onFiltersChange: (filters: DiscoverFiltersType) => void;
  isLoading: boolean;
}

const sortOptions = [
  { value: "popularity.desc", label: "Popülerlik (Azalan)" },
  { value: "popularity.asc", label: "Popülerlik (Artan)" },
  { value: "release_date.desc", label: "Çıkış Tarihi (Yeni)" },
  { value: "release_date.asc", label: "Çıkış Tarihi (Eski)" },
  { value: "vote_average.desc", label: "Puan (Yüksek)" },
  { value: "vote_average.asc", label: "Puan (Düşük)" },
  { value: "vote_count.desc", label: "Oy Sayısı (Çok)" },
  { value: "vote_count.asc", label: "Oy Sayısı (Az)" },
];

const languageOptions = [
  { value: "", label: "Tüm Diller" },
  { value: "tr", label: "Türkçe" },
  { value: "en", label: "İngilizce" },
  { value: "fr", label: "Fransızca" },
  { value: "es", label: "İspanyolca" },
  { value: "de", label: "Almanca" },
  { value: "it", label: "İtalyanca" },
  { value: "ja", label: "Japonca" },
  { value: "ko", label: "Korece" },
];

const DiscoverFilters: React.FC<DiscoverFiltersProps> = ({
  filters,
  onFiltersChange,
  isLoading,
}) => {
  const [localFilters, setLocalFilters] =
    useState<DiscoverFiltersType>(filters);

  const handleInputChange = (key: keyof DiscoverFiltersType, value: string) => {
    const newFilters = { ...localFilters, [key]: value };
    setLocalFilters(newFilters);
  };

  const applyFilters = () => {
    onFiltersChange(localFilters);
  };

  const resetFilters = () => {
    const defaultFilters: DiscoverFiltersType = {
      sort_by: "popularity.desc",
      with_genres: "",
      primary_release_date_year_min: "",
      primary_release_date_year_max: "",
      vote_average_min: "",
      vote_average_max: "",
      with_original_language: "",
    };
    setLocalFilters(defaultFilters);
    onFiltersChange(defaultFilters);
  };

  const currentYear = new Date().getFullYear();

  return (
    <div className="space-y-6 sticky top-20">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-light-text dark:text-dark-text">
          Filtreler
        </h2>
        <button
          onClick={resetFilters}
          disabled={isLoading}
          className="text-sm text-primary dark:text-secondary hover:underline disabled:opacity-50"
        >
          Sıfırla
        </button>
      </div>

      {/* Sort By */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-light-text dark:text-dark-text">
          Sıralama
        </label>
        <select
          value={localFilters.sort_by}
          onChange={(e) => handleInputChange("sort_by", e.target.value)}
          disabled={isLoading}
          className="w-full px-3 py-2 border border-light-surface dark:border-dark-surface rounded-md bg-light-primary dark:bg-dark-primary text-light-text dark:text-dark-text focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-secondary disabled:opacity-50"
        >
          {sortOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      {/* Genres */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-light-text dark:text-dark-text">
          Türler
        </label>
        <select
          value={localFilters.with_genres}
          onChange={(e) => handleInputChange("with_genres", e.target.value)}
          disabled={isLoading}
          className="w-full px-3 py-2 border border-light-surface dark:border-dark-surface rounded-md bg-light-primary dark:bg-dark-primary text-light-text dark:text-dark-text focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-secondary disabled:opacity-50"
        >
          <option value="">Tüm Türler</option>
          {Tmdb_MovieGenres.map((genre) => (
            <option key={genre.id} value={genre.id.toString()}>
              {genre.name}
            </option>
          ))}
        </select>
      </div>

      {/* Release Year Range */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-light-text dark:text-dark-text">
          Çıkış Yılı
        </label>
        <div className="grid grid-cols-2 gap-2">
          <input
            type="number"
            placeholder="Min"
            min="1900"
            max={currentYear}
            value={localFilters.primary_release_date_year_min}
            onChange={(e) =>
              handleInputChange("primary_release_date_year_min", e.target.value)
            }
            disabled={isLoading}
            className="px-3 py-2 border border-light-surface dark:border-dark-surface rounded-md bg-light-primary dark:bg-dark-primary text-light-text dark:text-dark-text focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-secondary disabled:opacity-50"
          />
          <input
            type="number"
            placeholder="Max"
            min="1900"
            max={currentYear}
            value={localFilters.primary_release_date_year_max}
            onChange={(e) =>
              handleInputChange("primary_release_date_year_max", e.target.value)
            }
            disabled={isLoading}
            className="px-3 py-2 border border-light-surface dark:border-dark-surface rounded-md bg-light-primary dark:bg-dark-primary text-light-text dark:text-dark-text focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-secondary disabled:opacity-50"
          />
        </div>
      </div>

      {/* Vote Average Range */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-light-text dark:text-dark-text">
          Puan Aralığı
        </label>
        <div className="grid grid-cols-2 gap-2">
          <input
            type="number"
            placeholder="Min"
            min="0"
            max="10"
            step="0.1"
            value={localFilters.vote_average_min}
            onChange={(e) =>
              handleInputChange("vote_average_min", e.target.value)
            }
            disabled={isLoading}
            className="px-3 py-2 border border-light-surface dark:border-dark-surface rounded-md bg-light-primary dark:bg-dark-primary text-light-text dark:text-dark-text focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-secondary disabled:opacity-50"
          />
          <input
            type="number"
            placeholder="Max"
            min="0"
            max="10"
            step="0.1"
            value={localFilters.vote_average_max}
            onChange={(e) =>
              handleInputChange("vote_average_max", e.target.value)
            }
            disabled={isLoading}
            className="px-3 py-2 border border-light-surface dark:border-dark-surface rounded-md bg-light-primary dark:bg-dark-primary text-light-text dark:text-dark-text focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-secondary disabled:opacity-50"
          />
        </div>
      </div>

      {/* Language */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-light-text dark:text-dark-text">
          Dil
        </label>
        <select
          value={localFilters.with_original_language}
          onChange={(e) =>
            handleInputChange("with_original_language", e.target.value)
          }
          disabled={isLoading}
          className="w-full px-3 py-2 border border-light-surface dark:border-dark-surface rounded-md bg-light-primary dark:bg-dark-primary text-light-text dark:text-dark-text focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-secondary disabled:opacity-50"
        >
          {languageOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      {/* Apply Button */}
      <button
        onClick={applyFilters}
        disabled={isLoading}
        className={classNames(
          "w-full py-3 px-4 rounded-lg font-medium transition",
          "bg-primary dark:bg-secondary text-white",
          "hover:bg-primary/90 dark:hover:bg-secondary/90",
          "disabled:opacity-50 disabled:cursor-not-allowed",
          {
            "animate-pulse": isLoading,
          }
        )}
      >
        {isLoading ? "Filtreleniyor..." : "Filtreleri Uygula"}
      </button>
    </div>
  );
};

export default DiscoverFilters;
