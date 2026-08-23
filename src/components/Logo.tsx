import React, { useState } from 'react';
import { motion } from 'motion/react';

interface LogoProps {
  className?: string;
  glow?: boolean;
  theme: 'light' | 'dark';
}

export default function Logo({ className = '', glow = true, theme }: LogoProps) {
  const isDark = theme === 'dark';
  
  // Track independent image loading states for light and dark logo PNG assets
  const [logoError, setLogoError] = useState(false);
  const [logoWhiteError, setLogoWhiteError] = useState(false);

  const hasError = isDark ? logoWhiteError : logoError;
  const logoSrc = isDark ? "/assets/logowhite.png" : "/assets/logo.png";
  const setError = isDark ? setLogoWhiteError : setLogoError;

  // If className has no width or height utilities, apply the default hero size
  const hasSize = /\b(w|h)-\d+/.test(className) || /\b(w|h)-auto/.test(className) || /\b(w|h)-full/.test(className);
  const sizeClasses = hasSize ? '' : 'w-44 h-44 md:w-56 md:h-56';

  return (
    <div className={`relative flex flex-col items-center justify-center ${sizeClasses} ${className}`}>
      <div className="relative flex items-center justify-center w-full h-full">
        
        {/* Glow effect for Dark Mode (glowing ice blue/cyan - restricted to background backlight only) */}
        {glow && isDark && (
          <motion.div
            className="absolute inset-0 blur-3xl opacity-40 rounded-full"
            style={{
              background: 'radial-gradient(circle, rgba(56,189,248,0.3) 0%, rgba(14,165,233,0.05) 60%, transparent 100%)',
              width: '280px',
              height: '280px',
            }}
            animate={{
              opacity: [0.35, 0.5, 0.35],
              scale: [0.96, 1.04, 0.96],
            }}
            transition={{
              duration: 5,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
        )}

        {/* Glow effect for Light Mode (soft, deep shadow backdrop) */}
        {glow && !isDark && (
          <motion.div
            className="absolute inset-0 blur-2xl opacity-15 rounded-full"
            style={{
              background: 'radial-gradient(circle, rgba(15,23,42,0.1) 0%, transparent 80%)',
              width: '220px',
              height: '220px',
            }}
            animate={{
              opacity: [0.12, 0.22, 0.12],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
        )}

        {/* Dynamic Logo Image with high-performance SVG fallback - scaled to fit wrapper container */}
        {!hasError ? (
          <motion.img
            src={logoSrc}
            alt="Axion Logo"
            className="w-full h-full object-contain relative z-10 filter drop-shadow-lg select-none pointer-events-none"
            onError={() => setError(true)}
            referrerPolicy="no-referrer"
            initial={{ opacity: 0, scale: 0.94 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.9, ease: 'easeOut' }}
          />
        ) : (
          <svg
            viewBox="0 0 240 200"
            className="w-full h-full relative z-10 filter drop-shadow-sm select-none pointer-events-none"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Left Hook Component */}
            <motion.path
              d="M 90 76 L 104 76 L 123 114 L 109 114 Z M 90 76 L 56 134 C 52 141, 56 150, 64 150 L 124 150 L 114 130 L 80 130 L 100 96 L 90 76 Z"
              fill={isDark ? '#e2e8f0' : '#1e293b'} // pure monochrome slate-white for dark mode SVG fallback
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{
                pathLength: { duration: 1.5, ease: 'easeOut' },
                opacity: { duration: 0.8 },
              }}
            />

            {/* Right Parallelogram */}
            <motion.path
              d="M 124 50 L 146 50 L 196 150 L 174 150 Z"
              fill={isDark ? '#ffffff' : '#0f172a'}
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{
                pathLength: { duration: 1.5, ease: 'easeOut', delay: 0.3 },
                opacity: { duration: 0.8, delay: 0.3 },
              }}
            />

            {/* Subtle connecting pulse line inside logo */}
            <motion.path
              d="M 104 130 L 114 130"
              stroke={isDark ? '#94a3b8' : '#0ea5e9'} // monochrome slate-grey for dark mode SVG fallback
              strokeWidth="3"
              strokeLinecap="round"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: [0.3, 1, 0.3] }}
              transition={{
                pathLength: { duration: 1, delay: 1 },
                opacity: { duration: 2, repeat: Infinity, ease: 'easeInOut' },
              }}
            />
          </svg>
        )}
      </div>
    </div>
  );
}
