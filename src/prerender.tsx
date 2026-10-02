import React from 'react';
import { renderToString } from 'react-dom/server';

import App from './App';

import {
  homeSeo,
  servicesHubSeo,
  servicesSeo,
} from './seo/seoConfig';

interface PrerenderData {
  url: string;
}

const serviceRoutes = Object.keys(
  servicesSeo,
).map(
  (slug) => `/servicos/${slug}`,
);

const getSeoForPath = (
  pathname: string,
) => {
  if (pathname === '/servicos') {
    return servicesHubSeo;
  }

  if (
    pathname.startsWith(
      '/servicos/',
    )
  ) {
    const slug = pathname
      .replace('/servicos/', '')
      .split('/')[0];

    return (
      servicesSeo[slug] ??
      servicesHubSeo
    );
  }

  return homeSeo;
};

export async function prerender(
  data: PrerenderData,
) {
  const pathname =
    new URL(
      data.url,
      'https://axion.local',
    ).pathname;

  const seo =
    getSeoForPath(pathname);

  const html =
    renderToString(
      <App
        initialPathname={
          pathname
        }
      />,
    );

  return {
    html,

    links: new Set([
      '/',
      '/servicos',
      ...serviceRoutes,
    ]),

    head: {
      lang: 'pt-PT',

      title: seo.title,

      elements: new Set([
        {
          type: 'meta',
          props: {
            name: 'description',
            content:
              seo.description,
          },
        },

        {
          type: 'meta',
          props: {
            name: 'robots',
            content:
              'index, follow',
          },
        },

        {
          type: 'meta',
          props: {
            property: 'og:title',
            content:
              seo.title,
          },
        },

        {
          type: 'meta',
          props: {
            property:
              'og:description',
            content:
              seo.description,
          },
        },

        {
          type: 'meta',
          props: {
            property: 'og:type',
            content: 'website',
          },
        },

        {
          type: 'meta',
          props: {
            property: 'og:locale',
            content: 'pt_PT',
          },
        },

        {
          type: 'meta',
          props: {
            name: 'twitter:card',
            content:
              'summary_large_image',
          },
        },

        {
          type: 'meta',
          props: {
            name: 'twitter:title',
            content:
              seo.title,
          },
        },

        {
          type: 'meta',
          props: {
            name:
              'twitter:description',
            content:
              seo.description,
          },
        },
      ]),
    },
  };
}