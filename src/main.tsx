import { StrictMode } from 'react';
import {
  createRoot,
  hydrateRoot,
} from 'react-dom/client';

import App, {
  getRouteKey,
  preloadPageForPath,
} from './App.tsx';
import './index.css';

const container =
  document.getElementById('root');

if (!container) {
  throw new Error(
    'Root element not found.',
  );
}

const app = (
  <StrictMode>
    <App />
  </StrictMode>
);

/*
 * Load the current page's chunk first so the hydrated tree matches the
 * prerendered HTML exactly (see lazyPage.tsx).
 */
preloadPageForPath(
  window.location.pathname,
)
  .catch(() => {})
  .then(() => {
    const prerenderedForThisRoute =
      container.hasChildNodes() &&
      container.dataset.route ===
        getRouteKey(
          window.location.pathname,
        );

    if (prerenderedForThisRoute) {
      hydrateRoot(
        container,
        app,
      );
      return;
    }

    // Missing or foreign markup (e.g. SPA fallback): render from scratch.
    container.replaceChildren();

    createRoot(
      container,
    ).render(app);
  });