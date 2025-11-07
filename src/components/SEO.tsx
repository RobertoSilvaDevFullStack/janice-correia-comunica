import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: 'website' | 'article';
  author?: string;
  publishedTime?: string;
  modifiedTime?: string;
}

const defaultSEO = {
  title: 'Janice Correia - Comunicação Estratégica e Experiência do Cliente',
  description: 'Especialista em comunicação assertiva, oratória e experiência do cliente. Palestras e mentorias que transformam relacionamentos corporativos e impulsionam resultados.',
  keywords: 'comunicação empresarial, oratória, experiência do cliente, palestras corporativas, mentorias executivas, comunicação assertiva, liderança, soft skills',
  image: '/hero-image.jpg',
  url: 'https://janicecorreia.com.br',
  type: 'website' as const,
};

export const SEO = ({
  title,
  description = defaultSEO.description,
  keywords = defaultSEO.keywords,
  image = defaultSEO.image,
  url = defaultSEO.url,
  type = defaultSEO.type,
  author = 'Janice Correia',
  publishedTime,
  modifiedTime,
}: SEOProps) => {
  const fullTitle = title ? `${title} | Janice Correia` : defaultSEO.title;
  const fullUrl = url.startsWith('http') ? url : `${defaultSEO.url}${url}`;
  const fullImage = image.startsWith('http') ? image : `${defaultSEO.url}${image}`;

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <meta name="author" content={author} />
      <link rel="canonical" href={fullUrl} />

      {/* Open Graph */}
      <meta property="og:type" content={type} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={fullImage} />
      <meta property="og:url" content={fullUrl} />
      <meta property="og:site_name" content="Janice Correia" />
      <meta property="og:locale" content="pt_BR" />

      {type === 'article' && publishedTime && (
        <meta property="article:published_time" content={publishedTime} />
      )}
      {type === 'article' && modifiedTime && (
        <meta property="article:modified_time" content={modifiedTime} />
      )}
      {type === 'article' && author && (
        <meta property="article:author" content={author} />
      )}

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={fullImage} />

      {/* Additional SEO */}
      <meta name="robots" content="index, follow" />
      <meta name="language" content="Portuguese" />
      <meta httpEquiv="content-language" content="pt-BR" />
    </Helmet>
  );
};
