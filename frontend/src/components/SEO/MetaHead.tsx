import { Helmet } from 'react-helmet-async';

interface MetaHeadProps {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
  type?: 'website' | 'article';
  keywords?: string;
  author?: string;
  publishedTime?: string;
  modifiedTime?: string;
  noindex?: boolean;
}

const MetaHead = ({
  title = 'Project Vizyon - Film ve Dizi Keşif Platformu',
  description = 'En yeni filmler, vizyondaki filmler, popüler diziler ve platform içerikleri ile film dünyasını keşfedin. Project Vizyon ile favori içeriklerinizi bulun.',
  image = '/images/og-default.jpg',
  url,
  type = 'website',
  keywords = 'film, dizi, sinema, vizyon, netflix, disney+, amazon prime, hbo, tmdb, imdb, popüler filmler',
  author = 'Project Vizyon',
  publishedTime,
  modifiedTime,
  noindex = false,
}: MetaHeadProps) => {
  const siteName = 'Project Vizyon';
  const fullTitle = title.includes(siteName) ? title : `${title} | ${siteName}`;
  const canonicalUrl = url ? `${import.meta.env.VITE_APP_URL || 'http://localhost:3000'}${url}` : window.location.href;
  const fullImageUrl = image.startsWith('http') ? image : `${import.meta.env.VITE_APP_URL || 'http://localhost:3000'}${image}`;

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <meta name="author" content={author} />
      <link rel="canonical" href={canonicalUrl} />
      
      {/* Robots */}
      {noindex && <meta name="robots" content="noindex, nofollow" />}
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={fullImageUrl} />
      <meta property="og:site_name" content={siteName} />
      <meta property="og:locale" content="tr_TR" />
      
      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={canonicalUrl} />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={fullImageUrl} />
      
      {/* Article specific */}
      {type === 'article' && publishedTime && (
        <meta property="article:published_time" content={publishedTime} />
      )}
      {type === 'article' && modifiedTime && (
        <meta property="article:modified_time" content={modifiedTime} />
      )}
      {type === 'article' && (
        <meta property="article:author" content={author} />
      )}
    </Helmet>
  );
};

export default MetaHead;
