import { Helmet } from 'react-helmet-async';

interface PersonSchemaProps {
  name?: string;
  jobTitle?: string;
  description?: string;
  image?: string;
  url?: string;
  sameAs?: string[];
}

export const PersonSchema = ({
  name = 'Janice Correia',
  jobTitle = 'Especialista em Comunicação Estratégica e Experiência do Cliente',
  description = 'Comunicóloga, palestrante e mentora especializada em comunicação assertiva, oratória e experiência do cliente.',
  image = 'https://janicecorreia.com.br/hero-image.jpg',
  url = 'https://janicecorreia.com.br',
  sameAs = [
    'https://linkedin.com/in/janicecorreia',
    'https://instagram.com/janicecorreia',
  ],
}: PersonSchemaProps) => {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name,
    jobTitle,
    description,
    image,
    url,
    sameAs,
  };

  return (
    <Helmet>
      <script type="application/ld+json">{JSON.stringify(schema)}</script>
    </Helmet>
  );
};

interface OrganizationSchemaProps {
  name?: string;
  description?: string;
  url?: string;
  logo?: string;
  contactPoint?: {
    telephone?: string;
    contactType?: string;
    email?: string;
  };
}

export const OrganizationSchema = ({
  name = 'Janice Correia - Comunicação Estratégica',
  description = 'Serviços profissionais de comunicação empresarial, palestras e mentorias executivas.',
  url = 'https://janicecorreia.com.br',
  logo = 'https://janicecorreia.com.br/logo.png',
  contactPoint = {
    telephone: '+55-11-99999-9999',
    contactType: 'customer service',
    email: 'contato@janicecorreia.com.br',
  },
}: OrganizationSchemaProps) => {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'ProfessionalService',
    name,
    description,
    url,
    logo,
    contactPoint: {
      '@type': 'ContactPoint',
      ...contactPoint,
    },
  };

  return (
    <Helmet>
      <script type="application/ld+json">{JSON.stringify(schema)}</script>
    </Helmet>
  );
};

interface ArticleSchemaProps {
  headline: string;
  description: string;
  image: string;
  datePublished: string;
  dateModified?: string;
  author?: string;
  url: string;
}

export const ArticleSchema = ({
  headline,
  description,
  image,
  datePublished,
  dateModified,
  author = 'Janice Correia',
  url,
}: ArticleSchemaProps) => {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline,
    description,
    image,
    datePublished,
    dateModified: dateModified || datePublished,
    author: {
      '@type': 'Person',
      name: author,
    },
    publisher: {
      '@type': 'Organization',
      name: 'Janice Correia',
      logo: {
        '@type': 'ImageObject',
        url: 'https://janicecorreia.com.br/logo.png',
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': url,
    },
  };

  return (
    <Helmet>
      <script type="application/ld+json">{JSON.stringify(schema)}</script>
    </Helmet>
  );
};
