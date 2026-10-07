import {
  servicesHubSeo,
  servicesSeo,
} from './seoConfig';

const SITE_URL =
  'https://www.axion-enterprise.com';

const ORGANIZATION_ID =
  `${SITE_URL}/#organization`;

export const organizationStructuredData = {
  '@context': 'https://schema.org',
  '@type': 'Organization',

  '@id': ORGANIZATION_ID,

  name: 'AXION',

  url: `${SITE_URL}/`,

  logo: {
    '@type': 'ImageObject',
    url: `${SITE_URL}/assets/logo.png`,
  },

  description:
    'A AXION desenvolve websites, plataformas, sistemas internos, automações, marketing digital e soluções de inteligência artificial adaptadas às necessidades reais das empresas.',
};

export const servicesPageStructuredData = {
  '@context': 'https://schema.org',

  '@type': 'ItemList',

  '@id':
    `${SITE_URL}/servicos#services`,

  url:
    `${SITE_URL}/servicos`,

  name: 'Serviços AXION',

  description:
    servicesHubSeo.description,

  itemListElement:
    Object.entries(
      servicesSeo,
    ).map(
      (
        [slug, service],
        index,
      ) => ({
        '@type': 'ListItem',

        position:
          index + 1,

        item: {
          '@type': 'Service',

          name:
            service.title.replace(
              ' | AXION',
              '',
            ),

          description:
            service.description,

          identifier:
            slug,

          provider: {
            '@id':
              ORGANIZATION_ID,
          },
        },
      }),
    ),
};