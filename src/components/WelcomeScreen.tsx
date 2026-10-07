import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowRight } from 'lucide-react';
import Logo from './Logo';
import FloatingTriangles from './FloatingTriangles';

interface WelcomeScreenProps {
  onEnter: () => void;
  theme: 'light' | 'dark';
  
}

export default function WelcomeScreen({ onEnter, theme }: WelcomeScreenProps) {
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [loadingStateText, setLoadingStateText] = useState('Carregando marca...');
  const [isLoaded, setIsLoaded] = useState(false);
  const [clickBurst, setClickBurst] = useState<{ x: number; y: number; id: number }[]>([]);

  // Simulation of the high-speed premium loader
  useEffect(() => {
    const loadingTexts = [
      'Analisando identidade visual...',
      'Renderizando geometrias 3D...',
      'Sincronizando paleta de cores...',
      'Otimizando transições fluidas...',
      'Inicializando portal Axion...'
    ];

    let currentProgress = 0;
    const interval = setInterval(() => {
      // Human-like progressive steps
      const increment = Math.floor(Math.random() * 12) + 6;
      currentProgress = Math.min(100, currentProgress + increment);
      setLoadingProgress(currentProgress);

      // Dynamically cycle through professional marketing/engineering statuses
      const textIdx = Math.min(
        loadingTexts.length - 1,
        Math.floor((currentProgress / 100) * loadingTexts.length)
      );
      setLoadingStateText(loadingTexts[textIdx]);

      if (currentProgress >= 100) {
        clearInterval(interval);
        setTimeout(() => {
          setIsLoaded(true);
        }, 300);
      }
    }, 120);

    return () => clearInterval(interval);
  }, []);




  const handleEnterClick = (e: React.MouseEvent) => {
    
    
    // Create click splash particles at position
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const newBurst = {
      x,
      y,
      id: Date.now()
    };
    
    setClickBurst((prev) => [...prev, newBurst]);

    // Delay the actual entrance transition slightly to let the chime play & visual ripple expand
    setTimeout(() => {
      onEnter();
    }, 900);
  };

  return (
    <div 
      className={`relative min-h-screen w-full flex flex-col items-center justify-center overflow-hidden transition-colors duration-700 ${
        theme === 'dark' 
          ? 'bg-gradient-to-tr from-[#0b1329] via-[#0f172a] to-[#1e293b] text-white' 
          : 'bg-gradient-to-tr from-[#d3e4ed] via-[#f1f5f9] to-[#cbd5e1] text-slate-900'
      }`}
    >
      {/* Floating Geometric Elements (Parallax + Custom mouse tracking) */}
      <FloatingTriangles theme={theme} />

      {/* Background radial soft light center */}
      <div 
        className="absolute inset-0 z-0 pointer-events-none"
        style={{
          background: theme === 'dark'
            ? 'radial-gradient(circle at 50% 50%, rgba(56,189,248,0.06) 0%, transparent 60%)'
            : 'radial-gradient(circle at 50% 50%, rgba(14,165,233,0.04) 0%, transparent 70%)',
        }}
      />

      {/* Floating Top Controls Header (Frosted Glass Glassmorphism) */}
      <motion.header 
        className="absolute top-0 left-0 w-full z-30 px-6 py-4 flex items-center"
        initial={{ y: -30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        <div className="flex items-center space-x-2">
          {/* Live indicator tag */}
          <span className="flex h-2.5 w-2.5 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
          </span>
          <span className={`text-[10px] tracking-[0.2em] uppercase font-bold ${theme === 'dark' ? 'text-sky-300' : 'text-slate-500'}`}>
            Welcome Phase v1.0
          </span>
        </div>

        
      </motion.header>

      {/* Main Core View Area */}
      <div className="relative z-10 w-full max-w-4xl px-6 flex flex-col items-center">
        
        

        <AnimatePresence mode="wait">
          {!isLoaded ? (
            /* PRE-LOADER SEQUENCING - ULTRA CLEAN MINIMALIST EDITION */
            <motion.div
              key="loader"
              initial={{ opacity: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.4, ease: 'easeOut' }}
              className="flex flex-col items-center justify-center w-full min-h-[200px]"
            >
              {/* Minimalist Percentage Label */}
              <motion.div 
                className={`text-[10px] tracking-[0.35em] font-bold uppercase mb-4 ${
                  theme === 'dark' ? 'text-sky-400' : 'text-slate-800'
                }`}
                animate={{ opacity: [0.6, 1, 0.6] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
              >
                CARREGANDO • {loadingProgress}%
              </motion.div>

              {/* Ultra-thin Minimalist 1px Line Loader */}
              <div className={`w-40 h-[1px] relative overflow-hidden mb-6 ${
                theme === 'dark' ? 'bg-slate-800' : 'bg-slate-300/60'
              }`}>
                <motion.div 
                  className={`h-full absolute left-0 top-0 transition-all duration-150 ease-out ${
                    theme === 'dark' ? 'bg-sky-400' : 'bg-slate-900'
                  }`}
                  style={{ width: `${loadingProgress}%` }}
                />
              </div>

              {/* Minimalist low-contrast status message */}
              <motion.p
                key={loadingStateText}
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.6 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className={`text-[9px] tracking-[0.25em] uppercase font-semibold text-center ${
                  theme === 'dark' ? 'text-slate-500' : 'text-slate-600'
                }`}
              >
                {loadingStateText}
              </motion.p>
            </motion.div>
          ) : (
            /* ACTIVE WELCOME SCREEN - MINIMALIST LUXURY EDITION */
            <motion.div
              key="welcome-core"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, ease: 'easeOut' }}
              className="flex flex-col items-center w-full text-center"
            >
              {/* SVG Glowing Axion Logo */}
              <Logo theme={theme} className="mb-14" />

              {/* Enter Site Button - Smooth & Minimalist Glassmorphism */}
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="relative"
              >
                <motion.button
                  whileHover={{ 
                    scale: 1.03,
                    letterSpacing: '0.3em',
                  }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleEnterClick}
                  className={`relative px-12 py-4 rounded-full font-bold tracking-[0.22em] text-[11px] uppercase transition-all duration-500 flex items-center justify-center space-x-2.5 cursor-pointer select-none overflow-hidden border ${
                    theme === 'dark'
                      ? 'bg-white/[0.02] border-white/10 hover:border-sky-400 text-white hover:text-sky-300 hover:bg-sky-400/[0.04]'
                      : 'bg-black/[0.01] border-slate-900/10 hover:border-slate-900 text-slate-800 hover:bg-slate-900/[0.02]'
                  }`}
                  style={{
                    boxShadow: 'none',
                  }}
                >
                  <span>ENTRAR PORTAL</span>
                  <ArrowRight size={12} className="opacity-60 group-hover:translate-x-1 transition-transform duration-500" />
                </motion.button>

                {/* Tactical coordinate splash feedback on click */}
                {clickBurst.map((burst) => (
                  <div
                    key={burst.id}
                    className="absolute pointer-events-none"
                    style={{ left: burst.x, top: burst.y }}
                  >
                    {[...Array(6)].map((_, i) => {
                      const angle = (i * Math.PI) / 3;
                      const distance = 30 + Math.random() * 20;
                      return (
                        <motion.span
                          key={i}
                          className="absolute w-1 h-1 rounded-full bg-sky-400/80 block"
                          initial={{ x: 0, y: 0, scale: 1, opacity: 1 }}
                          animate={{
                            x: Math.cos(angle) * distance,
                            y: Math.sin(angle) * distance,
                            scale: 0,
                            opacity: 0,
                          }}
                          transition={{ duration: 0.6, ease: 'easeOut' }}
                        />
                      );
                    })}
                  </div>
                ))}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Floating Interactive Footer (frosted glass tag) */}
      <motion.footer 
        className={`absolute bottom-6 z-20 text-center px-4 py-2 text-[9px] tracking-[0.3em] font-semibold uppercase ${
          theme === 'dark'
            ? 'text-slate-500'
            : 'text-slate-500'
        }`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.6 }}
        transition={{ delay: 1.2, duration: 1 }}
      >
        © 2026 Axion Portugal • AXIONPORTUGAL@GMAIL.COM
      </motion.footer>
    </div>
  );
}
