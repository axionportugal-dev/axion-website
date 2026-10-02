import {
  servicesHubSeo,
  servicesSeo,
} from './seoConfig';

export const organizationStructuredData = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'AXION',
  description:
    'A AXION desenvolve websites, plataformas, sistemas internos, automações, marketing digital e soluções de inteligência artificial adaptadas às necessidades reais das empresas.',
};

export const servicesPageStructuredData = {
  '@context': 'https://schema.org',
  '@type': 'ItemList',
  name: 'Serviços AXION',
  description:
    servicesHubSeo.description,

  itemListElement: Object.entries(
    servicesSeo,
  ).map(
    ([slug, service], index) => ({
      '@type': 'ListItem',
      position: index + 1,

      item: {
        '@type': 'Service',
        name: service.title.replace(
          ' | AXION',
          '',
        ),

        description:
          service.description,

        identifier: slug,

        provider: {
          '@type': 'Organization',
          name: 'AXION',
        },
      },
    }),
  ),
};

export const getServiceStructuredData = (
  slug: string,
) => {
  const service =
    servicesSeo[slug];

  if (!service) {
    return null;
  }

  return {
    '@context': 'https://schema.org',
    '@type': 'Service',

    name: service.title.replace(
      ' | AXION',
      '',
    ),

    description:
      service.description,

    identifier: slug,

    provider: {
      '@type': 'Organization',
      name: 'AXION',
    },
  };
};