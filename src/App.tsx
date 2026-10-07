import React, {
  useEffect,
  useState,
} from 'react';

import {
  AnimatePresence,
  motion,
} from 'motion/react';

import WelcomeScreen from './components/WelcomeScreen';
import HomePage from './components/HomePage';
import BudgetPage from './components/BudgetPage';
import ServicesPage from './components/ServicesPage';
import Seo from './components/Seo';
import StructuredData from './components/StructuredData';
import NotFoundPage from './components/NotFoundPage';
import PrivacyPage from './components/PrivacyPage';

import {
  organizationStructuredData,
  servicesPageStructuredData,
} from './seo/structuredData';

import {
  homeSeo,
  privacySeo,
  servicesHubSeo,
} from './seo/seoConfig';

interface AppProps {
  initialPathname?: string;
}

export default function App({
  initialPathname,
}: AppProps) {
  const [theme, setTheme] =
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

  const handleEnterSite =
    () => {
      setCurrentScreen(
        'entered',
      );
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
    pathname !== '/'
      ? pathname.replace(
          /\/+$/,
          '',
        )
      : '/';

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
          />
        )}

        <AnimatePresence mode="wait">
          {currentScreen ===
            'welcome' && (
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
                duration: 0.5,
              }}
              className="fixed inset-0 z-[100] w-full"
            >
              <WelcomeScreen
                theme={
                  theme
                }
                
                onEnter={
                  handleEnterSite
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
              <BudgetPage
                onBackToHome={
                  handleBackToHome
                }
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}