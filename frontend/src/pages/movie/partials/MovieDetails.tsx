import { useAuth } from "@/hooks/useAuth";
import { useDevice } from "@/hooks/useDevice";
import { useFavorite } from "@/hooks/useFavorite";
import CoreLayout from "@/layouts/Core";
import { getMovieDetail } from "@/services/movie";
import { MovieDetail } from "@/types/movie.type";
import { formatDateToTurkishMonthDay } from "@/utils/misc";
import classNames from "classnames";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import {
  RiHeartsFill,
  RiHeart3Line,
  RiPlayFill,
  RiStarFill,
  RiTimeLine,
  RiCalendarLine,
  RiGlobalLine,
  RiMoneyDollarCircleLine,
  RiAwardLine,
} from "react-icons/ri";
import { useParams, useNavigate } from "react-router-dom";
import LazyLoadedImage from "@/components/LazyLoadedImage";
import CircularProgressBar from "@/components/CircularProgressBar";
import Loading from "@/components/Loading";
import { MetaHead, StructuredData } from "@/components/SEO";

export const MovieDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { isMobile } = useDevice();
  const { toggleFavorite, checkFavorite } = useFavorite();

  const [movie, setMovie] = useState<MovieDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);
  const [activeTab, setActiveTab] = useState<"overview" | "cast" | "media">(
    "overview"
  );

  useEffect(() => {
    const fetchMovieDetail = async () => {
      if (!id) return;

      try {
        setLoading(true);
        const movieData = await getMovieDetail(parseInt(id));
        setMovie(movieData);

        console.log(movieData);

        // Check if movie is favorite
        if (user) {
          const favorite = await checkFavorite({
            media_type: "movie",
            media_id: parseInt(id),
          });
          setIsFavorite(favorite);
        }
      } catch (error) {
        console.error("Error fetching movie details:", error);
        toast.error("Film detayları yüklenemedi");
        navigate("/movie");
      } finally {
        setLoading(false);
      }
    };

    fetchMovieDetail();
  }, [id, user, navigate, checkFavorite]);

  const handleFavoriteClick = async () => {
    if (!user) {
      toast.error("Favorilere eklemek için giriş yapmanız gerekiyor");
      return;
    }

    if (!movie) return;

    try {
      const favoriteData = {
        media_type: "movie" as const,
        media_id: movie.id,
        title: movie.title,
        poster_path: movie.poster_path,
        release_date: movie.release_date,
        vote_average: movie.vote_average,
        genre_ids: movie.genre_ids || [],
        overview: movie.overview,
      };

      setIsFavorite(!isFavorite);
      await toggleFavorite(favoriteData, isFavorite);

      if (isFavorite) {
        toast.success("Favorilerden kaldırıldı");
      } else {
        toast.success("Favorilere eklendi");
      }
    } catch (error: any) {
      setIsFavorite(isFavorite); // Revert state on error
      toast.error(error.message || "Bir hata oluştu");
    }
  };

  const handlePlayTrailer = () => {
    if (movie?.videos?.results && movie.videos.results.length > 0) {
      const trailer =
        movie.videos.results.find((v) => v.type === "Trailer") ||
        movie.videos.results[0];
      window.open(`https://www.youtube.com/watch?v=${trailer.key}`, "_blank");
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("tr-TR", {
      style: "currency",
      currency: "USD",
      notation: "compact",
      maximumFractionDigits: 1,
    }).format(amount);
  };

  const formatRuntime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}s ${mins}dk`;
  };

  if (loading) {
    return (
      <CoreLayout user={user} title="Film Detayı">
        <div className="flex justify-center items-center min-h-screen">
          <Loading />
        </div>
      </CoreLayout>
    );
  }

  if (!movie) {
    return (
      <CoreLayout user={user} title="Film Bulunamadı">
        <div className="flex justify-center items-center min-h-screen">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-light-text dark:text-dark-text mb-4">
              Film bulunamadı
            </h1>
            <button
              onClick={() => navigate("/movie")}
              className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition"
            >
              Filmlere Dön
            </button>
          </div>
        </div>
      </CoreLayout>
    );
  }

  return (
    <>
      {movie && (
        <>
          <MetaHead
            title={`${movie.title} (${new Date(movie.release_date).getFullYear()})`}
            description={`${movie.overview || 'Film hakkında bilgi bulunmuyor.'} IMDb: ${movie.vote_average}/10 • ${movie.runtime ? `${Math.floor(movie.runtime / 60)}s ${movie.runtime % 60}dk` : ''} • ${formatDateToTurkishMonthDay(movie.release_date, true)}`}
            image={movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : undefined}
            url={`/movie/${movie.id}`}
            type="article"
            keywords={`${movie.title}, ${movie.original_title}, film, sinema, ${movie.genres?.map(g => g.name).join(', ')}, ${new Date(movie.release_date).getFullYear()}`}
            publishedTime={movie.release_date}
          />
          
          <StructuredData
            type="Movie"
            data={movie}
          />
        </>
      )}
      
      <CoreLayout user={user} title={movie.title}>
        <div className="relative">
          {/* Hero Section with Backdrop */}
          <div className="relative h-screen max-h-[80vh] overflow-hidden">
            {/* Backdrop Image */}
            <div className="absolute inset-0">
              <LazyLoadedImage
                src={`https://image.tmdb.org/t/p/original/${movie.backdrop_path}`}
                alt={movie.title}
                isExist={!!movie.backdrop_path}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-black/20" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent" />
            </div>

            {/* Content Overlay */}
            <div className="absolute inset-0 flex items-center">
              <div className="container mx-auto px-4">
                <div
                  className={classNames("grid gap-8", {
                    "grid-cols-1": isMobile,
                    "grid-cols-12": !isMobile,
                  })}
                >
                  {/* Poster */}
                  <div
                    className={classNames("flex justify-center", {
                      "order-1": isMobile,
                      "col-span-4 lg:col-span-3": !isMobile,
                    })}
                  >
                    <div className="relative group">
                      <div className="w-64 h-96 rounded-2xl overflow-hidden shadow-2xl transform group-hover:scale-105 transition-transform duration-300">
                        <LazyLoadedImage
                          src={`https://image.tmdb.org/t/p/w500/${movie.poster_path}`}
                          alt={movie.title}
                          isExist={!!movie.poster_path}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Movie Info */}
                  <div
                    className={classNames("text-white", {
                      "order-2 text-center": isMobile,
                      "col-span-8 lg:col-span-9 flex flex-col justify-center":
                      !isMobile,
                  })}
                >
                  <div className="space-y-6">
                    {/* Title and Year */}
                    <div>
                      <h1 className="text-4xl lg:text-6xl font-bold mb-2 drop-shadow-lg">
                        {movie.title}
                      </h1>
                      {movie.original_title !== movie.title && (
                        <p className="text-xl text-gray-300 italic">
                          {movie.original_title}
                        </p>
                      )}
                      {movie.tagline && (
                        <p className="text-lg text-gray-400 mt-2 italic">
                          "{movie.tagline}"
                        </p>
                      )}
                    </div>

                    {/* Quick Stats */}
                    <div className="flex flex-wrap gap-4 items-center">
                      <div className="flex items-center gap-2">
                        <CircularProgressBar value={movie.vote_average} />
                        <span className="text-sm font-medium">
                          {movie.vote_count.toLocaleString()} oy
                        </span>
                      </div>

                      {movie.runtime && (
                        <div className="flex items-center gap-1 text-sm">
                          <RiTimeLine className="w-4 h-4" />
                          {formatRuntime(movie.runtime)}
                        </div>
                      )}

                      <div className="flex items-center gap-1 text-sm">
                        <RiCalendarLine className="w-4 h-4" />
                        {formatDateToTurkishMonthDay(movie.release_date, true)}
                      </div>

                      {movie.genres && movie.genres.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {movie.genres.slice(0, 3).map((genre) => (
                            <span
                              key={genre.id}
                              className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-xs font-medium"
                            >
                              {genre.name}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-wrap gap-4">
                      {movie.videos?.results &&
                        movie.videos.results.length > 0 && (
                          <button
                            onClick={handlePlayTrailer}
                            className="flex items-center gap-2 bg-white text-black px-6 py-3 rounded-lg font-semibold hover:bg-gray-200 transition transform hover:scale-105"
                          >
                            <RiPlayFill className="w-5 h-5" />
                            Fragman İzle
                          </button>
                        )}

                      <button
                        onClick={handleFavoriteClick}
                        className={classNames(
                          "flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition transform hover:scale-105",
                          {
                            "bg-red-600 text-white hover:bg-red-700":
                              isFavorite,
                            "bg-white/20 backdrop-blur-sm text-white hover:bg-white/30":
                              !isFavorite,
                          }
                        )}
                      >
                        {isFavorite ? (
                          <RiHeartsFill className="w-5 h-5" />
                        ) : (
                          <RiHeart3Line className="w-5 h-5" />
                        )}
                        {isFavorite ? "Favorilerden Çıkar" : "Favorilere Ekle"}
                      </button>
                    </div>

                    {/* Overview */}
                    <div className="max-w-4xl">
                      <h3 className="text-xl font-semibold mb-3">Özet</h3>
                      <p className="text-gray-200 leading-relaxed text-lg">
                        {movie.overview}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Detailed Information Section */}
        <div className="bg-light-primary dark:bg-dark-primary min-h-screen">
          <div className="container mx-auto px-4 py-16">
            {/* Tab Navigation */}
            <div className="flex flex-wrap gap-4 mb-8 border-b border-light-surface dark:border-dark-surface">
              {[
                { key: "overview", label: "Genel Bakış" },
                { key: "cast", label: "Oyuncular" },
                { key: "media", label: "Medya" },
              ].map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key as any)}
                  className={classNames(
                    "px-6 py-3 font-semibold border-b-2 transition",
                    {
                      "border-primary text-primary dark:border-secondary dark:text-secondary":
                        activeTab === tab.key,
                      "border-transparent text-light-text/70 dark:text-dark-text/70 hover:text-light-text dark:hover:text-dark-text":
                        activeTab !== tab.key,
                    }
                  )}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Tab Content */}
            <div className="space-y-8">
              {activeTab === "overview" && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  {/* Movie Stats */}
                  <div className="lg:col-span-2 space-y-8">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {movie.budget > 0 && (
                        <div className="bg-light-surface dark:bg-dark-secondary p-4 rounded-lg text-center">
                          <RiMoneyDollarCircleLine className="w-8 h-8 mx-auto mb-2 text-primary dark:text-secondary" />
                          <div className="text-2xl font-bold text-light-text dark:text-dark-text">
                            {formatCurrency(movie.budget)}
                          </div>
                          <div className="text-sm text-light-text/70 dark:text-dark-text/70">
                            Bütçe
                          </div>
                        </div>
                      )}

                      {movie.revenue > 0 && (
                        <div className="bg-light-surface dark:bg-dark-secondary p-4 rounded-lg text-center">
                          <RiAwardLine className="w-8 h-8 mx-auto mb-2 text-primary dark:text-secondary" />
                          <div className="text-2xl font-bold text-light-text dark:text-dark-text">
                            {formatCurrency(movie.revenue)}
                          </div>
                          <div className="text-sm text-light-text/70 dark:text-dark-text/70">
                            Hasılat
                          </div>
                        </div>
                      )}

                      <div className="bg-light-surface dark:bg-dark-secondary p-4 rounded-lg text-center">
                        <RiStarFill className="w-8 h-8 mx-auto mb-2 text-yellow-500" />
                        <div className="text-2xl font-bold text-light-text dark:text-dark-text">
                          {movie.vote_average.toFixed(1)}
                        </div>
                        <div className="text-sm text-light-text/70 dark:text-dark-text/70">
                          Puan
                        </div>
                      </div>

                      <div className="bg-light-surface dark:bg-dark-secondary p-4 rounded-lg text-center">
                        <RiGlobalLine className="w-8 h-8 mx-auto mb-2 text-primary dark:text-secondary" />
                        <div className="text-2xl font-bold text-light-text dark:text-dark-text">
                          {movie.vote_count.toLocaleString()}
                        </div>
                        <div className="text-sm text-light-text/70 dark:text-dark-text/70">
                          Oy Sayısı
                        </div>
                      </div>
                    </div>

                    {/* Production Info */}
                    {movie.production_companies &&
                      movie.production_companies.length > 0 && (
                        <div>
                          <h3 className="text-xl font-semibold text-light-text dark:text-dark-text mb-4">
                            Yapım Şirketleri
                          </h3>
                          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                            {movie.production_companies.map((company) => (
                              <div
                                key={company.id}
                                className="bg-light-surface dark:bg-dark-secondary p-4 rounded-lg text-center flex flex-col items-center justify-center"
                              >
                                {company.logo_path ? (
                                  <div className="max-h-20 max-w-20 flex items-center justify-center overflow-hidden mx-auto">
                                    <LazyLoadedImage
                                      src={`https://image.tmdb.org/t/p/w200/${company.logo_path}`}
                                      alt={company.name}
                                      isExist={!!company.logo_path}
                                      className="max-w-full max-h-full object-contain"
                                    />
                                  </div>
                                ) : (
                                  <p className="text-sm font-medium text-light-text dark:text-dark-text">
                                    {company.name}
                                  </p>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                  </div>

                  {/* Sidebar Info */}
                  <div className="space-y-6">
                    <div className="bg-light-surface dark:bg-dark-secondary p-6 rounded-lg">
                      <h3 className="text-lg font-semibold text-light-text dark:text-dark-text mb-4">
                        Film Bilgileri
                      </h3>
                      <div className="space-y-3 text-sm">
                        <div>
                          <span className="text-light-text/70 dark:text-dark-text/70">
                            Durum:
                          </span>
                          <span className="ml-2 text-light-text dark:text-dark-text font-medium">
                            {movie.status}
                          </span>
                        </div>
                        {movie.spoken_languages &&
                          movie.spoken_languages.length > 0 && (
                            <div>
                              <span className="text-light-text/70 dark:text-dark-text/70">
                                Dil:
                              </span>
                              <span className="ml-2 text-light-text dark:text-dark-text font-medium">
                                {movie.spoken_languages
                                  .map((lang) => lang.name)
                                  .join(", ")}
                              </span>
                            </div>
                          )}
                        {movie.imdb_id && (
                          <div>
                            <span className="text-light-text/70 dark:text-dark-text/70">
                              IMDb:
                            </span>
                            <a
                              href={`https://www.imdb.com/title/${movie.imdb_id}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="ml-2 text-primary dark:text-secondary font-medium hover:underline"
                            >
                              {movie.imdb_id}
                            </a>
                          </div>
                        )}
                        {movie.homepage && (
                          <div>
                            <span className="text-light-text/70 dark:text-dark-text/70">
                              Website:
                            </span>
                            <a
                              href={movie.homepage}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="ml-2 text-primary dark:text-secondary font-medium hover:underline break-all"
                            >
                              Resmi Site
                            </a>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "cast" && movie.credits && (
                <div className="space-y-8">
                  {/* Cast */}
                  {movie.credits.cast && movie.credits.cast.length > 0 && (
                    <div>
                      <h3 className="text-2xl font-semibold text-light-text dark:text-dark-text mb-6">
                        Oyuncular
                      </h3>
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                        {movie.credits.cast.slice(0, 12).map((person) => (
                          <div
                            key={person.id}
                            className="bg-light-surface dark:bg-dark-secondary rounded-lg overflow-hidden hover:transform hover:scale-105 transition"
                          >
                            <div className="aspect-[3/4]">
                              <LazyLoadedImage
                                src={`https://image.tmdb.org/t/p/w300/${person.profile_path}`}
                                alt={person.name}
                                isExist={!!person.profile_path}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div className="p-3">
                              <p className="font-semibold text-light-text dark:text-dark-text text-sm truncate">
                                {person.name}
                              </p>
                              <p className="text-light-text/70 dark:text-dark-text/70 text-xs truncate">
                                {person.character}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Crew */}
                  {movie.credits.crew && movie.credits.crew.length > 0 && (
                    <div>
                      <h3 className="text-2xl font-semibold text-light-text dark:text-dark-text mb-6">
                        Ekip
                      </h3>
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                        {movie.credits.crew
                          .filter((person) =>
                            [
                              "Director",
                              "Producer",
                              "Writer",
                              "Screenplay",
                            ].includes(person.job)
                          )
                          .slice(0, 12)
                          .map((person) => (
                            <div
                              key={`${person.id}-${person.job}`}
                              className="bg-light-surface dark:bg-dark-secondary rounded-lg overflow-hidden hover:transform hover:scale-105 transition"
                            >
                              <div className="aspect-[3/4]">
                                <LazyLoadedImage
                                  src={`https://image.tmdb.org/t/p/w300/${person.profile_path}`}
                                  alt={person.name}
                                  isExist={!!person.profile_path}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                              <div className="p-3">
                                <p className="font-semibold text-light-text dark:text-dark-text text-sm truncate">
                                  {person.name}
                                </p>
                                <p className="text-light-text/70 dark:text-dark-text/70 text-xs truncate">
                                  {person.job}
                                </p>
                              </div>
                            </div>
                          ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {activeTab === "media" && (
                <div className="space-y-12">
                  {/* Images Section */}
                  <div>
                    <h3 className="text-2xl font-semibold text-light-text dark:text-dark-text mb-6">
                      Görseller
                    </h3>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                      {/* Poster Image */}
                      {movie.poster_path && (
                        <div className="bg-light-surface dark:bg-dark-secondary rounded-lg overflow-hidden hover:transform hover:scale-105 transition cursor-pointer">
                          <div className="aspect-[2/3]">
                            <LazyLoadedImage
                              src={`https://image.tmdb.org/t/p/w500/${movie.poster_path}`}
                              alt={`${movie.title} - Poster`}
                              isExist={!!movie.poster_path}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Videos Section */}
                  <div>
                    <h3 className="text-2xl font-semibold text-light-text dark:text-dark-text mb-6">
                      Videolar
                    </h3>
                    {movie.videos && movie.videos.results.length > 0 ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {movie.videos.results.slice(0, 9).map((video) => (
                          <div
                            key={video.id}
                            className="bg-light-surface dark:bg-dark-secondary rounded-lg overflow-hidden hover:transform hover:scale-105 transition cursor-pointer"
                            onClick={() =>
                              window.open(
                                `https://www.youtube.com/watch?v=${video.key}`,
                                "_blank"
                              )
                            }
                          >
                            <div className="relative aspect-video">
                              <img
                                src={`https://img.youtube.com/vi/${video.key}/maxresdefault.jpg`}
                                alt={video.name}
                                className="w-full h-full object-cover"
                              />
                              <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                                <RiPlayFill className="w-12 h-12 text-white" />
                              </div>
                            </div>
                            <div className="p-4">
                              <p className="font-semibold text-light-text dark:text-dark-text line-clamp-2">
                                {video.name}
                              </p>
                              <p className="text-light-text/70 dark:text-dark-text/70 text-sm mt-1">
                                {video.type}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-12">
                        <p className="text-light-text/70 dark:text-dark-text/70">
                          Bu film için video bulunamadı.
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </CoreLayout>
    </>
  );
};
