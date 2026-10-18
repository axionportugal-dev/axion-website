import { useEffect, useState } from 'react';
import {
  AnimatePresence,
  motion,
  useReducedMotion,
} from 'motion/react';
import FloatingTriangles from './FloatingTriangles';
import {
  AXION_MARK_PATH,
  AXION_MARK_VIEWBOX,
} from './axionMark';

interface WelcomeScreenProps {
  theme: 'light' | 'dark';
  // The morph starts: activate the home page underneath.
  onReveal: () => void;
  // The mark has landed on the hero logo: show the full wordmark.
  onLand: () => void;
  // The intro is over: the overlay can be removed.
  onDone: () => void;
}

/*
 * OPENING INTRO
 *
 * 1. loading  - progress bar on a light background, centred on the exact
 *               height of the hero logo's "A".
 * 2. logo     - a large dark "A" appears, centred horizontally, already on
 *               that height.
 * 3. morph    - no button: the light background dissolves into the dark
 *               hero while the "A" shrinks, turns white and slides left
 *               until it sits exactly on the "A" of the hero wordmark.
 * 4. land     - the hero wordmark fades in under it and the intro hands
 *               over to the page, ready to scroll.
 *
 * All geometry comes from the live hero logo ([data-hero-logo]), so it
 * lines up at every screen size.
 */

// The "A" inside public/assets/logowhite.png (1920x1080), measured from
// the PNG's alpha channel.
const WORDMARK = {
  width: 1920,
  height: 1080,
  markLeft: 568,
  markTop: 399,
  markWidth: 219,
  markHeight: 240,
};

const LOADING_TICK_MS = 120;
const APPEAR_SECONDS = 0.9;
const HOLD_MS = 650;
const MORPH_SECONDS = 1.35;
const MORPH_EASE = [0.65, 0, 0.35, 1] as const;
const LAND_FADE_SECONDS = 0.6;
// Hero tagline (delay 0.25 + 0.55s) and scroll hint (0.5 + 0.5s) after landing.
const HAND_OVER_AFTER_LAND_MS = 1100;

const LOADING_TEXTS = [
  'Analisando identidade visual...',
  'Renderizando geometrias 3D...',
  'Sincronizando paleta de cores...',
  'Otimizando transições fluidas...',
  'Inicializando portal Axion...',
];

interface MarkTarget {
  // Centre and size of the hero "A", in viewport pixels.
  centerX: number;
  centerY: number;
  width: number;
  height: number;
  viewportWidth: number;
  viewportHeight: number;
}

type Phase =
  | 'loading'
  | 'logo'
  | 'morph'
  | 'land';

/*
 * The hero logo's resting box. getBoundingClientRect would include the
 * logo's own entrance animation (it scales in from 0.82) and the mouse
 * parallax; the offset chain gives the untransformed layout position,
 * which is exactly where the logo ends up.
 */
const layoutRect = (element: HTMLElement) => {
  let left = 0;
  let top = 0;
  let node: HTMLElement | null = element;

  while (node) {
    left += node.offsetLeft;
    top += node.offsetTop;
    node = node.offsetParent as HTMLElement | null;
  }

  return {
    left,
    top,
    width: element.offsetWidth,
    height: element.offsetHeight,
  };
};

const measureHeroMark = (): MarkTarget => {
  const viewportWidth = window.innerWidth;
  const viewportHeight = window.innerHeight;
  const logo = document.querySelector<HTMLElement>(
    '[data-hero-logo]',
  );

  if (logo) {
    const rect = layoutRect(logo);

    if (rect.width > 0 && rect.height > 0) {
      // The wordmark image is drawn with object-contain inside the box.
      const scale = Math.min(
        rect.width / WORDMARK.width,
        rect.height / WORDMARK.height,
      );
      const left =
        rect.left +
        (rect.width - WORDMARK.width * scale) / 2;
      const top =
        rect.top +
        (rect.height - WORDMARK.height * scale) / 2;

      return {
        centerX:
          left +
          (WORDMARK.markLeft +
            WORDMARK.markWidth / 2) *
            scale,
        centerY:
          top +
          (WORDMARK.markTop +
            WORDMARK.markHeight / 2) *
            scale,
        width: WORDMARK.markWidth * scale,
        height: WORDMARK.markHeight * scale,
        viewportWidth,
        viewportHeight,
      };
    }
  }

  // Fallback (hero not laid out yet): roughly where the hero puts it.
  const height = Math.min(
    viewportHeight * 0.12,
    viewportWidth * 0.14,
  );

  return {
    centerX: viewportWidth * 0.36,
    centerY: viewportHeight * 0.47,
    width: height * (WORDMARK.markWidth / WORDMARK.markHeight),
    height,
    viewportWidth,
    viewportHeight,
  };
};

export default function WelcomeScreen({
  theme,
  onReveal,
  onLand,
  onDone,
}: WelcomeScreenProps) {
  const prefersReducedMotion =
    useReducedMotion();
  const [loadingProgress, setLoadingProgress] =
    useState(0);
  const [loadingStateText, setLoadingStateText] =
    useState(LOADING_TEXTS[0]);
  const [phase, setPhase] =
    useState<Phase>('loading');
  const [target, setTarget] =
    useState<MarkTarget | null>(null);

  // Measure the hero mark now and whenever the viewport changes.
  useEffect(() => {
    const update = () =>
      setTarget(measureHeroMark());

    update();

    // The hero logo settles (fonts, its own entrance) shortly after mount.
    const settle = window.setTimeout(
      update,
      900,
    );

    window.addEventListener('resize', update);

    return () => {
      window.clearTimeout(settle);
      window.removeEventListener(
        'resize',
        update,
      );
    };
  }, []);

  // 1. Simulated loader.
  useEffect(() => {
    let progress = 0;

    const interval = window.setInterval(() => {
      progress = Math.min(
        100,
        progress +
          Math.floor(Math.random() * 12) +
          6,
      );

      setLoadingProgress(progress);
      setLoadingStateText(
        LOADING_TEXTS[
          Math.min(
            LOADING_TEXTS.length - 1,
            Math.floor(
              (progress / 100) *
                LOADING_TEXTS.length,
            ),
          )
        ],
      );

      if (progress >= 100) {
        window.clearInterval(interval);
        window.setTimeout(() => {
          setTarget(measureHeroMark());
          setPhase('logo');
        }, 300);
      }
    }, LOADING_TICK_MS);

    return () => window.clearInterval(interval);
  }, []);

  // 2 -> 3 -> 4: timed hand-off, no button.
  useEffect(() => {
    if (phase === 'logo') {
      const timer = window.setTimeout(
        () => {
          setTarget(measureHeroMark());
          onReveal();
          setPhase('morph');
        },
        prefersReducedMotion
          ? 200
          : APPEAR_SECONDS * 1000 + HOLD_MS,
      );

      return () => window.clearTimeout(timer);
    }

    if (phase === 'land') {
      onLand();

      // Hand over only once the hero's tagline and scroll hint have
      // finished appearing, so a scroll can never overlap them.
      const timer = window.setTimeout(
        onDone,
        HAND_OVER_AFTER_LAND_MS,
      );

      return () => window.clearTimeout(timer);
    }

    return undefined;
    // The callbacks are stable for the intro's lifetime.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase, prefersReducedMotion]);

  const isDark = theme === 'dark';
  const backgroundVisible =
    phase === 'loading' || phase === 'logo';

  // Large starting "A": bigger than the old logo, capped for small screens.
  const bigHeight = target
    ? Math.max(
        140,
        Math.min(
          target.viewportHeight * 0.3,
          target.viewportWidth * 0.46,
          300,
        ),
      )
    : 0;
  const startScale = target
    ? bigHeight / target.height
    : 1;
  const startOffsetX = target
    ? target.viewportWidth / 2 - target.centerX
    : 0;

  const markState =
    phase === 'loading'
      ? {
          opacity: 0,
          x: startOffsetX,
          scale: startScale * 0.94,
        }
      : phase === 'logo'
        ? {
            opacity: 1,
            x: startOffsetX,
            scale: startScale,
          }
        : phase === 'morph'
          ? { opacity: 1, x: 0, scale: 1 }
          : { opacity: 0, x: 0, scale: 1 };

  const markTransition =
    phase === 'logo'
      ? {
          duration: APPEAR_SECONDS,
          ease: 'easeOut' as const,
        }
      : phase === 'morph'
        ? {
            duration: prefersReducedMotion
              ? 0.01
              : MORPH_SECONDS,
            ease: MORPH_EASE,
          }
        : phase === 'land'
          ? {
              duration: LAND_FADE_SECONDS,
              delay: 0.15,
            }
          : { duration: 0 };

  const isWhite =
    phase === 'morph' || phase === 'land';

  return (
    <div className="pointer-events-none relative min-h-screen w-full overflow-hidden">
      {/* Light backdrop: dissolves into the dark hero during the morph */}
      <motion.div
        className={`absolute inset-0 ${
          isDark
            ? 'bg-gradient-to-tr from-[#0b1329] via-[#0f172a] to-[#1e293b]'
            : 'bg-gradient-to-tr from-[#d3e4ed] via-[#f1f5f9] to-[#cbd5e1]'
        }`}
        initial={false}
        animate={{
          opacity: backgroundVisible ? 1 : 0,
        }}
        transition={{
          duration: prefersReducedMotion
            ? 0.01
            : MORPH_SECONDS * 0.85,
          ease: 'easeInOut',
        }}
      >
        <FloatingTriangles theme={theme} />

        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background: isDark
              ? 'radial-gradient(circle at 50% 50%, rgba(56,189,248,0.06) 0%, transparent 60%)'
              : 'radial-gradient(circle at 50% 50%, rgba(14,165,233,0.04) 0%, transparent 70%)',
          }}
        />

        <motion.header
          className="absolute left-0 top-0 z-30 flex w-full items-center px-6 py-4"
          initial={{ y: -30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <div className="flex items-center space-x-2">
            <span className="relative flex h-2.5 w-2.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-500" />
            </span>
            <span
              className={`text-[10px] font-bold uppercase tracking-[0.2em] ${
                isDark ? 'text-sky-300' : 'text-slate-500'
              }`}
            >
              Welcome Phase v1.0
            </span>
          </div>
        </motion.header>

        <motion.footer
          className="absolute bottom-6 left-1/2 z-20 w-full -translate-x-1/2 px-4 py-2 text-center text-[9px] font-semibold uppercase tracking-[0.3em] text-slate-500"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.6 }}
          transition={{ delay: 1.2, duration: 1 }}
        >
          © 2026 Axion Portugal • AXIONPORTUGAL@GMAIL.COM
        </motion.footer>
      </motion.div>

      {/* 1. Loader: the bar line itself sits on the hero mark's height */}
      <AnimatePresence>
        {phase === 'loading' && target && (
          <motion.div
            key="loader"
            className="absolute left-1/2 z-10 h-px w-40 -translate-x-1/2"
            style={{ top: target.centerY - 0.5 }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
          >
            <motion.div
              className={`absolute bottom-[calc(100%+16px)] left-1/2 -translate-x-1/2 whitespace-nowrap text-[10px] font-bold uppercase tracking-[0.35em] ${
                isDark ? 'text-sky-400' : 'text-slate-800'
              }`}
              animate={{ opacity: [0.6, 1, 0.6] }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            >
              CARREGANDO • {loadingProgress}%
            </motion.div>

            <div
              className={`relative h-full w-full overflow-hidden ${
                isDark ? 'bg-slate-800' : 'bg-slate-300/60'
              }`}
            >
              <div
                className={`absolute left-0 top-0 h-full transition-all duration-150 ease-out ${
                  isDark ? 'bg-sky-400' : 'bg-slate-900'
                }`}
                style={{ width: `${loadingProgress}%` }}
              />
            </div>

            <p
              className={`absolute left-1/2 top-[calc(100%+24px)] -translate-x-1/2 whitespace-nowrap text-center text-[9px] font-semibold uppercase tracking-[0.25em] opacity-60 ${
                isDark ? 'text-slate-500' : 'text-slate-600'
              }`}
            >
              {loadingStateText}
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 2-4. The mark: sized and placed exactly like the hero "A" */}
      {target && (
        <motion.svg
          aria-hidden="true"
          viewBox={AXION_MARK_VIEWBOX}
          className="absolute z-20 overflow-visible"
          style={{
            left: target.centerX - target.width / 2,
            top: target.centerY - target.height / 2,
            width: target.width,
            height: target.height,
            filter: 'drop-shadow(0 10px 14px rgba(15,23,42,0.18))',
          }}
          initial={false}
          animate={markState}
          transition={markTransition}
          onAnimationComplete={() => {
            if (phase === 'morph') {
              setPhase('land');
            }
          }}
        >
          <defs>
            <linearGradient
              id="axion-intro-mark"
              x1="0"
              y1="0"
              x2="1"
              y2="1"
            >
              <motion.stop
                offset="0%"
                initial={false}
                animate={{
                  stopColor: isWhite
                    ? '#ffffff'
                    : '#4a5566',
                }}
                transition={{
                  duration: MORPH_SECONDS * 0.8,
                  ease: 'easeInOut',
                }}
              />
              <motion.stop
                offset="100%"
                initial={false}
                animate={{
                  stopColor: isWhite
                    ? '#ffffff'
                    : '#262d36',
                }}
                transition={{
                  duration: MORPH_SECONDS * 0.8,
                  ease: 'easeInOut',
                }}
              />
            </linearGradient>
          </defs>

          <path
            d={AXION_MARK_PATH}
            fill="url(#axion-intro-mark)"
            fillRule="evenodd"
          />
        </motion.svg>
      )}
    </div>
  );
}
