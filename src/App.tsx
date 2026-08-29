import React, { lazy, Suspense, useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import WelcomeScreen from './components/WelcomeScreen';
import HomePage from './components/HomePage';
import BudgetPage from './components/BudgetPage';

const AdminPage = lazy(() => import('./components/AdminPage'));

export default function App() {
  // Brand defaults to 'light' mode as requested, fully synchronized with 'dark' mode.
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  
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

  const handleEnterSite = () => {
    setCurrentScreen('entered');
  };

  const handleBackToWelcome = () => {
    setCurrentScreen('welcome');
  };

  const handleNavigateToBudget = () => {
    setCurrentScreen('budget');
  };

  const handleBackToHome = () => {
    setCurrentScreen('entered');
  };

  const isAdminRoute = window.location.pathname === '/admin' || window.location.pathname.startsWith('/admin/');

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
              onBack={handleBackToWelcome}
              onNavigateToBudget={handleNavigateToBudget}
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
