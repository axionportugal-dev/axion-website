import React from 'react';
import { renderToString } from 'react-dom/server';

import App from './App';

import {
  homeSeo,
  servicesHubSeo,
  servicesSeo,
} from './seo/seoConfig';

export const prerenderRoutes = [
  '/',
  '/servicos',
  ...Object.keys(servicesSeo).map(
    (slug) => `/servicos/${slug}`,
  ),
];

export function getSeoForPath(
  pathname: string,
) {
  if (pathname === '/servicos') {
    return servicesHubSeo;
  }

  if (pathname.startsWith('/servicos/')) {
    const slug = pathname
      .replace('/servicos/', '')
      .split('/')[0];

    return (
      servicesSeo[slug] ??
      servicesHubSeo
    );
  }

  return homeSeo;
}

export function render(
  pathname: string,
) {
  return renderToString(
    <App
      initialPathname={pathname}
    />,
  );
}
