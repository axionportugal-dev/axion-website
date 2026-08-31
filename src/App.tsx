import React, { lazy, Suspense, useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import WelcomeScreen from './components/WelcomeScreen';
import HomePage from './components/HomePage';
import BudgetPage from './components/BudgetPage';
import ServicesPage from './components/ServicesPage';

const AdminPage = lazy(() => import('./components/AdminPage'));

export default function App() {
  // Brand defaults to 'light' mode as requested, fully synchronized with 'dark' mode.
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [pathname, setPathname] = useState(() => window.location.pathname);
  const [homeStep, setHomeStep] = useState(0);
  
  // Navigation screen states: 'welcome' | 'entered' | 'budget'
  const [currentScreen, setCurrentScreen] = useState<'welcome' | 'entered' | 'budget'>('welcome');

  // Sync background attributes on change
  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [theme]);

  useEffect(() => {
    const handlePopState = () => {
      setPathname(window.location.pathname);
      if (window.location.pathname === '/') {
        setCurrentScreen('entered');
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigateToPath = (nextPath: string) => {
    if (window.location.pathname !== nextPath) {
      window.history.pushState({}, '', nextPath);
      setPathname(nextPath);
    }

    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
  };

  const handleEnterSite = () => {
    setCurrentScreen('entered');
  };

  const handleBackToWelcome = () => {
    setCurrentScreen('welcome');
  };

  const handleNavigateToBudget = () => {
    setCurrentScreen('budget');
  };

  const handleNavigateToServices = () => {
    navigateToPath('/servicos');
  };

  const handleNavigateToService = (slug: string) => {
    const nextPath = `/servicos/${slug}`;

    if (window.location.pathname !== nextPath) {
      window.history.pushState({}, '', nextPath);
      setPathname(nextPath);
    }
  };

  const handleNavigateToServicesHub = () => {
    navigateToPath('/servicos');
  };

  const handleNavigateFromServicesToHome = () => {
    navigateToPath('/');
    setHomeStep(0);
    setCurrentScreen('entered');
  };

  const handleNavigateFromServicesToHomeSection = (index: number) => {
    navigateToPath('/');
    setHomeStep(index);
    setCurrentScreen('entered');
  };

  const handleNavigateFromServicesToBudget = () => {
    navigateToPath('/');
    setCurrentScreen('budget');
  };

  const handleBackToHome = () => {
    setCurrentScreen('entered');
  };

  const isAdminRoute = pathname === '/admin' || pathname.startsWith('/admin/');
  const isServicesRoute = pathname === '/servicos' || pathname.startsWith('/servicos/');
  const activeServiceSlug = pathname.startsWith('/servicos/') ? pathname.replace('/servicos/', '').split('/')[0] : undefined;

  if (isAdminRoute) {
    return (
      <Suspense
        fallback={(
          <div className="min-h-screen w-full bg-slate-950 text-white flex items-center justify-center">
            <span className="text-[9px] font-mono tracking-[0.3em] uppercase text-sky-400">A preparar AXION Studio</span>
          </div>
        )}
      >
        <AdminPage />
      </Suspense>
    );
  }

  if (isServicesRoute) {
    return (
      <ServicesPage
        activeSlug={activeServiceSlug}
        onNavigateHome={handleNavigateFromServicesToHome}
        onNavigateHomeSection={handleNavigateFromServicesToHomeSection}
        onNavigateBudget={handleNavigateFromServicesToBudget}
        onNavigateService={handleNavigateToService}
        onNavigateServicesHub={handleNavigateToServicesHub}
      />
    );
  }

  return (
    <div className={`min-h-screen w-full font-sans antialiased selection:bg-sky-500/30 selection:text-sky-900 transition-all duration-700`}>
      <AnimatePresence mode="wait">
        {currentScreen === 'welcome' && (
          <motion.div
            key="welcome-screen-wrapper"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="w-full"
          >
            <WelcomeScreen
              theme={theme}
              setTheme={setTheme}
              onEnter={handleEnterSite}
            />
          </motion.div>
        )}

        {currentScreen === 'entered' && (
          <motion.div
            key="home-page-wrapper"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="w-full"
          >
            <HomePage
              initialStep={homeStep}
              onBack={handleBackToWelcome}
              onNavigateToBudget={handleNavigateToBudget}
              onNavigateToServices={handleNavigateToServices}
            />
          </motion.div>
        )}

        {currentScreen === 'budget' && (
          <motion.div
            key="budget-page-wrapper"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="w-full"
          >
            <BudgetPage
              onBackToHome={handleBackToHome}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
