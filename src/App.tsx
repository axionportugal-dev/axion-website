import {
  Suspense,
  useEffect,
  useState,
} from 'react';

import {
  AnimatePresence,
  motion,
} from 'motion/react';

import WelcomeScreen from './components/WelcomeScreen';
import Seo from './components/Seo';
import StructuredData from './components/StructuredData';
import NotFoundPage from './components/NotFoundPage';
import PageLoadBoundary from './components/PageLoadBoundary';
import { lazyPage } from './lazyPage';

import {
  organizationStructuredData,
  servicesPageStructuredData,
} from './seo/structuredData';

import {
  homeSeo,
  privacySeo,
  servicesHubSeo,
} from './seo/seoConfig';

/*
 * Each page is its own chunk, so visiting one page does not download
 * the code (and particle engines) of the others.
 */
const HomePage = lazyPage(
  () => import('./components/HomePage'),
);
const ServicesPage = lazyPage(
  () => import('./components/ServicesPage'),
);
const PrivacyPage = lazyPage(
  () => import('./components/PrivacyPage'),
);
const BudgetPage = lazyPage(
  () => import('./components/BudgetPage'),
);

const allPages = [
  HomePage,
  ServicesPage,
  PrivacyPage,
  BudgetPage,
];

const normalizePathname = (
  pathname: string,
) =>
  pathname !== '/'
    ? pathname.replace(/\/+$/, '')
    : '/';

/*
 * Used by the prerenderer: every page must render synchronously.
 */
export const preloadAllPages = () =>
  Promise.all(
    allPages.map((page) =>
      page.preload(),
    ),
  );

/*
 * Identifies which prerendered page some HTML belongs to. The prerenderer
 * writes it on #root (data-route) and main.tsx only hydrates when it
 * matches the current URL, so a host that serves the wrong HTML (e.g. an
 * SPA fallback to index.html) never causes a hydration mismatch.
 */
export const getRouteKey = (
  pathname: string,
) => {
  const normalized =
    normalizePathname(pathname);

  return normalized === '/' ||
    normalized === '/servicos' ||
    normalized === '/privacidade'
    ? normalized
    : 'not-found';
};

/*
 * Used before hydration: load only the chunk the prerendered HTML needs.
 */
export const preloadPageForPath = (
  pathname: string,
) => {
  const normalized =
    normalizePathname(pathname);

  if (normalized === '/servicos') {
    return ServicesPage.preload(true);
  }

  if (normalized === '/privacidade') {
    return PrivacyPage.preload(true);
  }

  if (normalized === '/') {
    return HomePage.preload(true);
  }

  return Promise.resolve();
};

interface AppProps {
  initialPathname?: string;
}

export default function App({
  initialPathname,
}: AppProps) {
  const [theme] =
    useState<'light' | 'dark'>(
      'light',
    );

  const [
    pathname,
    setPathname,
  ] = useState(
    () =>
      initialPathname ??
      (
        typeof window !==
        'undefined'
          ? window.location
              .pathname
          : '/'
      ),
  );

  const [
    homeStep,
    setHomeStep,
  ] = useState(0);

  const [
    currentScreen,
    setCurrentScreen,
  ] = useState<
    'welcome' |
    'entered' |
    'budget'
  >('welcome');

  /*
   * The opening intro outlives the 'welcome' screen: once its mark starts
   * morphing onto the hero logo the home page is already 'entered', but
   * the overlay stays until the mark has landed and faded.
   */
  const [
    introPhase,
    setIntroPhase,
  ] = useState<
    'idle' |
    'morphing' |
    'landed'
  >('idle');

  const isIntroOverlayVisible =
    currentScreen === 'welcome' ||
    introPhase !== 'idle';

  const isHeroLogoVisible =
    currentScreen !== 'welcome' &&
    introPhase !== 'morphing';

  /*
   * Prefetch the remaining pages once the browser is idle, so
   * navigating never waits on the network.
   */
  useEffect(() => {
    const prefetch = () => {
      allPages.forEach((page) => {
        page.preload().catch(() => {});
      });
    };

    if (
      typeof window.requestIdleCallback ===
      'function'
    ) {
      const handle =
        window.requestIdleCallback(
          prefetch,
          { timeout: 4000 },
        );

      return () =>
        window.cancelIdleCallback(handle);
    }

    const timeout =
      window.setTimeout(prefetch, 2500);

    return () =>
      window.clearTimeout(timeout);
  }, []);

  /*
   * Synchronize theme with
   * the document root.
   */
  useEffect(() => {
    const root =
      window.document
        .documentElement;

    if (theme === 'dark') {
      root.classList.add(
        'dark',
      );
    } else {
      root.classList.remove(
        'dark',
      );
    }
  }, [theme]);

  /*
   * Browser back / forward.
   */
  useEffect(() => {
    const handlePopState =
      () => {
        setPathname(
          window.location
            .pathname,
        );

        if (
          window.location
            .pathname === '/'
        ) {
          setCurrentScreen(
            'entered',
          );
        }
      };

    window.addEventListener(
      'popstate',
      handlePopState,
    );

    return () => {
      window.removeEventListener(
        'popstate',
        handlePopState,
      );
    };
  }, []);

  const navigateToPath = (
    nextPath: string,
  ) => {
    if (
      window.location
        .pathname !== nextPath
    ) {
      window.history.pushState(
        {},
        '',
        nextPath,
      );

      setPathname(nextPath);
    }

    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'auto',
    });
  };

  const handleIntroReveal =
    () => {
      setCurrentScreen(
        'entered',
      );
      setIntroPhase('morphing');
    };

  const handleIntroLand =
    () => {
      setIntroPhase('landed');
    };

  const handleIntroDone =
    () => {
      setIntroPhase('idle');
    };

  const handleBackToWelcome =
    () => {
      setHomeStep(0);

      setCurrentScreen(
        'welcome',
      );
    };

  const handleNavigateToBudget =
    () => {
      setCurrentScreen(
        'budget',
      );
    };

  const handleNavigateToServices =
    () => {
      navigateToPath(
        '/servicos',
      );
    };

  /*
   * Navigate from the Home
   * directly to one section
   * of the single Services page.
   *
   * IMPORTANT:
   * /servicos#websites
   * is still /servicos.
   *
   * We do NOT create
   * /servicos/websites.
   */
  const handleNavigateToService = (
    slug: string,
  ) => {
    const nextUrl =
      `/servicos#${slug}`;

    window.history.pushState(
      {},
      '',
      nextUrl,
    );

    setPathname(
      '/servicos',
    );
  };

  const handleNavigateToServicesHub =
    () => {
      navigateToPath(
        '/servicos',
      );
    };

  const handleNavigateFromServicesToHome =
    () => {
      navigateToPath('/');

      setHomeStep(0);

      setCurrentScreen(
        'entered',
      );
    };

  const handleNavigateFromServicesToHomeSection =
    (
      index: number,
    ) => {
      navigateToPath('/');

      setHomeStep(index);

      setCurrentScreen(
        'entered',
      );
    };

  const handleNavigateFromServicesToBudget =
    () => {
      navigateToPath('/');

      setCurrentScreen(
        'budget',
      );
    };

  const handleBackToHome =
    () => {
      setCurrentScreen(
        'entered',
      );
    };

  /*
   * Normalize trailing slashes:
   *
   * /servicos/
   * becomes
   * /servicos
   */
  const normalizedPathname =
    normalizePathname(pathname);

  /*
   * Public routes currently:
   *
   * /
   * /servicos
   *
   * Everything else is 404.
   */
  const isServicesRoute =
    normalizedPathname ===
    '/servicos';
  
  const isPrivacyRoute =
    normalizedPathname === '/privacidade';


  const isKnownRoute =
    normalizedPathname === '/' ||
    isServicesRoute ||
    isPrivacyRoute;

  /*
   * 404
   */
  if (!isKnownRoute) {
    return (
      <>
        <Seo
          title="Página não encontrada | AXION"
          description="A página que procura não existe ou deixou de estar disponível."
          robots="noindex, follow"
        />

        <NotFoundPage />
      </>
    );
  }

  /*
   * SERVICES
   *
   * There is only ONE
   * Services page.
   */
  if (isServicesRoute) {
    return (
      <>
        <Seo
          title={
            servicesHubSeo.title
          }
          description={
            servicesHubSeo.description
          }

          canonical="https://www.axion-enterprise.com/servicos"
        />

        <StructuredData
          data={
            servicesPageStructuredData
          }
        />

        <PageLoadBoundary><Suspense fallback={null}>
        <ServicesPage
          onNavigateHome={
            handleNavigateFromServicesToHome
          }
          onNavigateHomeSection={
            handleNavigateFromServicesToHomeSection
          }
          onNavigateBudget={
            handleNavigateFromServicesToBudget
          }
          onNavigateServicesHub={
            handleNavigateToServicesHub
          }
        />
        </Suspense></PageLoadBoundary>
      </>
    );
  }

  if (isPrivacyRoute) {
  return (
    <>
      <Seo
        title={
          privacySeo.title
        }
        description={
          privacySeo.description
        }
        canonical="https://www.axion-enterprise.com/privacidade"
      />

      <PageLoadBoundary><Suspense fallback={null}>
      <PrivacyPage
        onBackToHome={() => {
          window.history.pushState(
            {},
            '',
            '/',
          );

          setPathname('/');
        }}
      />
      </Suspense></PageLoadBoundary>
    </>
  );
}

  /*
   * HOME
   */
  return (
    <>
      <Seo
        title={
          homeSeo.title
        }
        description={
          homeSeo.description
        }

        canonical="https://www.axion-enterprise.com/"
      />

      <StructuredData
        data={
          organizationStructuredData
        }
      />

      <div className="min-h-screen w-full font-sans antialiased selection:bg-sky-500/30 selection:text-sky-900 transition-all duration-700">
        {currentScreen !==
          'budget' && (
          <PageLoadBoundary><Suspense fallback={null}>
          <HomePage
            initialStep={
              homeStep
            }
            isActive={
              currentScreen ===
              'entered'
            }
            onBack={
              handleBackToWelcome
            }
            onNavigateToBudget={
              handleNavigateToBudget
            }
            onNavigateToServices={
              handleNavigateToServices
            }
            onNavigateToService={
              handleNavigateToService
            }
            heroLogoVisible={
              isHeroLogoVisible
            }
            interactionLocked={
              isIntroOverlayVisible
            }
          />
          </Suspense></PageLoadBoundary>
        )}

        <AnimatePresence mode="wait">
          {isIntroOverlayVisible && (
            <motion.div
              key="welcome-screen-wrapper"
              initial={{
                opacity: 1,
              }}
              animate={{
                opacity: 1,
              }}
              exit={{
                opacity: 0,
              }}
              transition={{
                duration: 0.2,
              }}
              className="pointer-events-none fixed inset-0 z-[100] w-full"
            >
              <WelcomeScreen
                theme={
                  theme
                }
                onReveal={
                  handleIntroReveal
                }
                onLand={
                  handleIntroLand
                }
                onDone={
                  handleIntroDone
                }
              />
            </motion.div>
          )}

          {currentScreen ===
            'budget' && (
            <motion.div
              key="budget-page-wrapper"
              initial={{
                opacity: 0,
              }}
              animate={{
                opacity: 1,
              }}
              exit={{
                opacity: 0,
              }}
              transition={{
                duration: 0.5,
              }}
              className="w-full"
            >
              <PageLoadBoundary><Suspense fallback={null}>
                <BudgetPage
                  onBackToHome={
                    handleBackToHome
                  }
                />
              </Suspense></PageLoadBoundary>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}