import {
  lazy,
  type ComponentType,
  type ReactElement,
} from 'react';

/*
 * Route-level code splitting that stays compatible with prerendering.
 *
 * React.lazy always suspends on its first render, even if the chunk is
 * already downloaded. That would make renderToString emit the Suspense
 * fallback and break hydration. Once `preload()` has resolved, this
 * wrapper renders the real component synchronously instead.
 *
 * - entry-server awaits `preloadAllPages()` before rendering.
 * - main.tsx awaits the current route's page before hydrating.
 * - Other pages fall back to React.lazy and are prefetched when idle.
 */
/*
 * After a deploy, a tab opened on the previous version asks for page
 * chunks whose hashed file names no longer exist. Reload once to pick up
 * the new version instead of leaving the page blank. The session flag
 * stops a reload loop if the network is simply down.
 */
const RELOAD_FLAG = 'axion:chunk-reload';

const reloadOnceForNewDeploy = () => {
  if (typeof window === 'undefined') return;

  try {
    if (
      window.sessionStorage.getItem(
        RELOAD_FLAG,
      )
    ) {
      return;
    }

    window.sessionStorage.setItem(
      RELOAD_FLAG,
      '1',
    );
  } catch {
    // Storage blocked (private mode): do not risk a reload loop.
    return;
  }

  window.location.reload();
};

const clearReloadFlag = () => {
  if (typeof window === 'undefined') return;

  try {
    window.sessionStorage.removeItem(
      RELOAD_FLAG,
    );
  } catch {
    // Storage blocked: nothing to clear.
  }
};

export interface LazyPage<Props> {
  (props: Props): ReactElement;
  /*
   * `reloadOnFail`: the visitor is actually opening this page, so a failed
   * chunk (new deploy) reloads once. Background prefetches pass false and
   * simply retry later.
   */
  preload: (
    reloadOnFail?: boolean,
  ) => Promise<unknown>;
}

export function lazyPage<Props extends object>(
  loader: () => Promise<{
    default: ComponentType<Props>;
  }>,
): LazyPage<Props> {
  let Loaded: ComponentType<Props> | null =
    null;
  let pending: Promise<unknown> | null =
    null;

  const preload = (
    reloadOnFail = false,
  ) => {
    pending ??= loader().then(
      (module) => {
        Loaded = module.default;
        clearReloadFlag();
        return module;
      },
      (error: unknown) => {
        // Let a later navigation or prefetch try again.
        pending = null;
        throw error;
      },
    );

    return reloadOnFail
      ? pending.catch((error: unknown) => {
          reloadOnceForNewDeploy();
          throw error;
        })
      : pending;
  };

  // Rendering the page means the visitor is opening it.
  const Lazy = lazy(() =>
    preload(true).then(() => ({
      default: Loaded!,
    })),
  );

  const Page = (props: Props) => {
    const Component = Loaded ?? Lazy;

    return <Component {...props} />;
  };

  Page.preload = preload;

  return Page;
}
