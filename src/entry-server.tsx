import React from 'react';
import { renderToString } from 'react-dom/server';

import App from './App';

import {
  homeSeo,
  privacySeo,
  servicesHubSeo,
} from './seo/seoConfig';

export const prerenderRoutes = [
  '/',
  '/servicos',
  '/privacidade',

];

export function getSeoForPath(
  pathname: string,
) {
  if (pathname === '/servicos') {
    return servicesHubSeo;
  }
  if (
    pathname === '/privacidade'
  ) {
    return privacySeo;
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