import { Helmet } from 'react-helmet-async';

interface StructuredDataProps {
  type: 'Movie' | 'TVSeries' | 'WebPage' | 'Organization';
  data: any;
}

const StructuredData = ({ type, data }: StructuredDataProps) => {
  const generateMovieStructuredData = (movie: any) => ({
    "@context": "https://schema.org",
    "@type": "Movie",
    "name": movie.title,
    "alternateName": movie.original_title !== movie.title ? movie.original_title : undefined,
    "description": movie.overview,
    "image": movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : undefined,
    "datePublished": movie.release_date,
    "genre": movie.genres?.map((g: any) => g.name) || [],
    "duration": movie.runtime ? `PT${movie.runtime}M` : undefined,
    "aggregateRating": movie.vote_average ? {
      "@type": "AggregateRating",
      "ratingValue": movie.vote_average,
      "ratingCount": movie.vote_count,
      "bestRating": 10,
      "worstRating": 0
    } : undefined,
    "director": movie.credits?.crew?.filter((person: any) => person.job === "Director").map((director: any) => ({
      "@type": "Person",
      "name": director.name
    })),
    "actor": movie.credits?.cast?.slice(0, 10).map((actor: any) => ({
      "@type": "Person",
      "name": actor.name
    })),
    "productionCompany": movie.production_companies?.map((company: any) => ({
      "@type": "Organization",
      "name": company.name
    })),
    "url": movie.homepage,
    "sameAs": movie.imdb_id ? `https://www.imdb.com/title/${movie.imdb_id}` : undefined
  });

  const generateTVSeriesStructuredData = (series: any) => ({
    "@context": "https://schema.org",
    "@type": "TVSeries",
    "name": series.name,
    "alternateName": series.original_name !== series.name ? series.original_name : undefined,
    "description": series.overview,
    "image": series.poster_path ? `https://image.tmdb.org/t/p/w500${series.poster_path}` : undefined,
    "datePublished": series.first_air_date,
    "genre": series.genres?.map((g: any) => g.name) || [],
    "aggregateRating": series.vote_average ? {
      "@type": "AggregateRating",
      "ratingValue": series.vote_average,
      "ratingCount": series.vote_count,
      "bestRating": 10,
      "worstRating": 0
    } : undefined,
    "numberOfSeasons": series.number_of_seasons,
    "numberOfEpisodes": series.number_of_episodes
  });

  const generateWebPageStructuredData = (page: any) => ({
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": page.title,
    "description": page.description,
    "url": page.url,
    "isPartOf": {
      "@type": "WebSite",
      "name": "Project Vizyon",
      "url": import.meta.env.VITE_APP_URL || "http://localhost:3000"
    }
  });

  const generateOrganizationStructuredData = () => ({
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Project Vizyon",
    "description": "Film ve Dizi Keşif Platformu",
    "url": import.meta.env.VITE_APP_URL || "http://localhost:3000",
    "logo": `${import.meta.env.VITE_APP_URL || "http://localhost:3000"}/favicon.svg`,
    "sameAs": [
      // Sosyal medya linklerinizi buraya ekleyebilirsiniz
    ]
  });

  let structuredData;

  switch (type) {
    case 'Movie':
      structuredData = generateMovieStructuredData(data);
      break;
    case 'TVSeries':
      structuredData = generateTVSeriesStructuredData(data);
      break;
    case 'WebPage':
      structuredData = generateWebPageStructuredData(data);
      break;
    case 'Organization':
      structuredData = generateOrganizationStructuredData();
      break;
    default:
      return null;
  }

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(structuredData, null, 2)}
      </script>
    </Helmet>
  );
};

export default StructuredData;
