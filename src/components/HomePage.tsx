import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ArrowLeft, 
  ArrowRight, 
  X,
  ChevronDown
} from 'lucide-react';
import Logo from './Logo';
import FloatingTriangles from './FloatingTriangles';
import ServicesExperience from './home/ServicesExperience';
import AxionParticleField from './home/AxionParticleField';
import PortfolioExperience from './home/PortfolioExperience';
import EvolutionSystemDiagram, {
  type EvolutionStageKey,
} from './home/EvolutionSystemDiagram';
import SpaceBackdrop from './home/SpaceBackdrop';
import { WebsiteFooterContent } from './WebsiteFooter';
import { serviceAreas } from '../data/services';


// Type-safe string paths for custom company logos uploaded to assets
const revissantLogo = "/assets/revissant.png";
const auraEventsLogo = "/assets/auraevents.png";
const casasDoBecoLogo = "/assets/casasdobeco.png";
const revissantBackground = new URL('../../assets/revissantbackground.mp4', import.meta.url).href;
const auraBackground = new URL('../../assets/aurabackground.jpg', import.meta.url).href;
const casasDoBecoBackground = new URL('../../assets/casasdobecovideo.mp4', import.meta.url).href;
const heroBackground = new URL('../../assets/herobw.png', import.meta.url).href;





interface HomePageProps {
  initialStep?: number;
  isActive?: boolean;
  onBack: () => void;
  onNavigateToBudget: () => void;
  onNavigateToServices: () => void;
  onNavigateToService: (slug: string) => void;
}



interface EvolutionStage {
  id: string;
  label: string;
  eyebrow: string;
  title: string;
  body: string;
  points: string[];
}

const evolutionStages: Record<
  EvolutionStageKey,
  EvolutionStage
> = {
  base: {
    id: '01',
    label: 'Base',
    eyebrow:
      'Antes da estrutura',
    title:
      'Quando o crescimento acontece sem estrutura, a operação perde clareza.',
    body:
      'À medida que uma empresa cresce, é natural acumular ferramentas, ficheiros, canais e processos. O problema surge quando cada peça funciona isoladamente. A informação dispersa-se, tarefas repetem-se e torna-se mais difícil compreender a operação como um todo.',
    points: [
      'Processos manuais',
      'Informação dispersa',
      'Ferramentas isoladas',
      'Baixa visibilidade operacional',
    ],
  },

  structure: {
    id: '02',
    label: 'Estrutura',
    eyebrow:
      'Construir uma base',
    title:
      'A tecnologia começa a trabalhar a favor do negócio.',
    body:
      'A evolução não passa por substituir tudo. Passa por compreender o que já funciona, preservar aquilo que define a empresa e ligar as peças certas. Sistemas de gestão, websites, inventário, dados, clientes e operação podem passar a funcionar como partes de uma estrutura coerente.',
    points: [
      'Sistemas integrados',
      'Fluxos mais claros',
      'Informação centralizada',
      'Controlo e segurança',
    ],
  },

  evolution: {
    id: '03',
    label: 'Evolução',
    eyebrow:
      'Tecnologia como alavanca',
    title:
      'Com estrutura, a tecnologia torna-se uma alavanca de evolução.',
    body:
      'Quando a base está preparada, novas capacidades deixam de acrescentar complexidade e começam a multiplicar valor. Automação, plataformas internas, análise de dados e inteligência artificial podem apoiar equipas, acelerar decisões e abrir novas possibilidades sem descaracterizar a identidade ou a visão do negócio.',
    points: [
      'Automação inteligente',
      'Sistemas à medida',
      'Dados acionáveis',
      'AI integrada nos processos',
      'Escala com controlo',
    ],
  },
};

const transitionEase = [0.16, 1, 0.3, 1] as const;

const clamp01 = (value: number) =>
  Math.min(1, Math.max(0, value));

const rangeProgress = (
  value: number,
  start: number,
  end: number,
) => {
  if (end === start) return value >= end ? 1 : 0;

  return clamp01((value - start) / (end - start));
};


const smoothstep = (
  value: number,
) => {
  const t = clamp01(value);

  return (
    t *
    t *
    (3 - 2 * t)
  );
};
export default function HomePage({
  initialStep = 0,
  onBack,
  isActive = true,
  onNavigateToBudget,
  onNavigateToServices,
  onNavigateToService,
}: HomePageProps) {
  const [step, setStep] = useState(initialStep);

  const heroLogoRef = useRef<HTMLDivElement | null>(null);

  const servicesArrivalLockRef = useRef(false);

  const servicesWheelIdleTimerRef = useRef<number | null>(null);

  const portfolioReturnLockRef = useRef(false);

  const sectionWheelAccumulatorRef = useRef(0);
  const sectionWheelDirectionRef = useRef(0);
  const sectionWheelLockedRef = useRef(false);
  const sectionWheelIdleTimerRef = useRef<number | null>(null);


  const portfolioArrivalLockRef =
    useRef(false);

  const portfolioArrivalIdleTimerRef =
    useRef<number | null>(null);
  const portfolioReturnIdleTimerRef =
    useRef<number | null>(null);

  const initialHeroServicesProgress =
    initialStep === 1 ? 1 : 0;

  const [heroServicesProgress, setHeroServicesProgress] =
    useState(initialHeroServicesProgress);

  const heroServicesProgressRef = useRef(
    initialHeroServicesProgress,
  );

  const initialServicesPortfolioProgress =
    initialStep >= 2 ? 1 : 0;

  const [
    servicesPortfolioProgress,
    setServicesPortfolioProgress,
  ] = useState(
    initialServicesPortfolioProgress,
  );

  const servicesPortfolioProgressRef =
    useRef(
      initialServicesPortfolioProgress,
    );

  const updateServicesPortfolioProgress = (
    value: number,
  ) => {
    const nextValue =
      clamp01(value);

    servicesPortfolioProgressRef.current =
      nextValue;

    setServicesPortfolioProgress(
      nextValue,
    );
  };

  const updateHeroServicesProgress = (value: number) => {
  const nextValue = clamp01(value);

    heroServicesProgressRef.current = nextValue;
    setHeroServicesProgress(nextValue);
  };
  
  // Pop-up states for Liquid Glass capabilities description (Light mode, clean glass)
  const [activePopupIdx, setActivePopupIdx] = useState<number | null>(null);

  // Portfolio active project index for the dynamic native video slider
  const [activeProjectIdx, setActiveProjectIdx] = useState<number>(0);

  // Footer reveal after an additional scroll beyond the final homepage section
  const [isFooterVisible, setIsFooterVisible] = useState(false);

  const [
    activeEvolutionStage,
    setActiveEvolutionStage,
  ] = useState<EvolutionStageKey>(
    'base',
  );

  const currentEvolutionStage =
    evolutionStages[
      activeEvolutionStage
    ];

  // Mouse coordinate tracking for advanced 3D logo parallax depth
  const [mouseOffset, setMouseOffset] = useState({ x: 0, y: 0 });

  // Debouncing locks to make scrolling snappy and instant
  const isAnimatingRef = useRef(false);

  // Portfolio horizontal trackpad gesture state.
  // One physical swipe must move exactly one project.
  const portfolioHorizontalAccumulatorRef = useRef(0);
  const portfolioHorizontalDirectionRef = useRef(0);
  const portfolioHorizontalLockedRef = useRef(false);
  const portfolioHorizontalIdleTimerRef = useRef<number | null>(null);

  const touchStartY = useRef(0);
  const touchStartX = useRef(0);

  // Checks if the active state requires a dark background
  const isDarkBg =
  step === 0 ||
  step === 1 ||
  step === 2 ||
  step === 4;
  // Checks if the current visible overlay/view requires dark-mode headers/dots
  const isVisualDark =
  step === 0 ||
  step === 1 ||
  step === 2 ||
  step === 4;

  useEffect(() => {
    if (!isActive) {
      return;
    }

    const handleMouseMove = (e: MouseEvent) => {
      // Create subtle parallax offsets for background elements
      const x = (e.clientX - window.innerWidth / 2) * 0.03;
      const y = (e.clientY - window.innerHeight / 2) * 0.03;

      setMouseOffset({ x, y });
    };

    window.addEventListener(
      'mousemove',
      handleMouseMove,
    );

    return () => {
      window.removeEventListener(
        'mousemove',
        handleMouseMove,
      );
    };
  }, [isActive]);

  // Background giant watermark logo style mapped per step + mouse offset
  const getWatermarkStyle = () => {
    let baseScale = 2.2;
    let baseOpacity = 0.15;
    let baseY = 0;

    switch (step) {
      case 0:
        baseScale = 2.2;
        baseOpacity = 0.15;
        baseY = 0;
        break;
      case 1:
        baseScale = 2.5;
        baseOpacity = 0.11;
        baseY = -30;
        break;
      case 2:
        baseScale = 2.7;
        baseOpacity = 0.03; // extremely subtle on dark stage
        baseY = -60;
        break;
      case 3:
        baseScale = 2.9;
        baseOpacity = 0.04;
        baseY = -95;
        break;
      case 4:
        baseScale = 3;
        baseOpacity = 0.03; // dark bg
        baseY = 0;
        break;
    }

    return {
      scale: baseScale,
      opacity: baseOpacity,
      x: mouseOffset.x * 0.4,
      y: baseY + mouseOffset.y * 0.4,
    };
  };

  const nextStep = () => {
    if (activePopupIdx !== null) return;
    if (isAnimatingRef.current) return;

    if (step === 0) {
      lockAnimation();
      setIsFooterVisible(false);
      updateHeroServicesProgress(1);
      updateServicesPortfolioProgress(0);
      setStep(1);
      return;
    }

    if (step === 1) {
      lockAnimation();
      updateHeroServicesProgress(1);
      updateServicesPortfolioProgress(1);
      setIsFooterVisible(false);
      setStep(2);
      return;
    }

    if (step === 2) {
      lockAnimation();
      updateHeroServicesProgress(1);
      updateServicesPortfolioProgress(1);
      setIsFooterVisible(false);
      setStep(3);
      return;
    }

    if (step === 3) {
      lockAnimation();
      setIsFooterVisible(false);
      setStep(4);
      return;
    }

    if (step === 4 && !isFooterVisible) {
      lockAnimation();
      setIsFooterVisible(true);
    }
  };

  const keepServicesArrivalLocked = () => {
    servicesArrivalLockRef.current = true;

    if (
      servicesWheelIdleTimerRef.current !== null
    ) {
      window.clearTimeout(
        servicesWheelIdleTimerRef.current,
      );
    }

    servicesWheelIdleTimerRef.current =
      window.setTimeout(() => {
        servicesArrivalLockRef.current = false;
        servicesWheelIdleTimerRef.current = null;
      }, 260);
  };

  const keepPortfolioReturnLocked = () => {
    portfolioReturnLockRef.current = true;

    if (
      portfolioReturnIdleTimerRef.current !== null
    ) {
      window.clearTimeout(
        portfolioReturnIdleTimerRef.current,
      );
    }

    portfolioReturnIdleTimerRef.current =
      window.setTimeout(() => {
        portfolioReturnLockRef.current = false;
        portfolioReturnIdleTimerRef.current = null;
      }, 280);
  };

  const keepPortfolioArrivalLocked =
    () => {
      portfolioArrivalLockRef.current =
        true;

      if (
        portfolioArrivalIdleTimerRef.current !==
        null
      ) {
        window.clearTimeout(
          portfolioArrivalIdleTimerRef.current,
        );
      }

      portfolioArrivalIdleTimerRef.current =
        window.setTimeout(() => {
          portfolioArrivalLockRef.current =
            false;

          portfolioArrivalIdleTimerRef.current =
            null;
        }, 280);
    };

  const keepSectionWheelGestureLockedUntilIdle = () => {
    if (sectionWheelIdleTimerRef.current !== null) {
      window.clearTimeout(sectionWheelIdleTimerRef.current);
    }

    sectionWheelIdleTimerRef.current =
      window.setTimeout(() => {
        sectionWheelAccumulatorRef.current = 0;
        sectionWheelDirectionRef.current = 0;
        sectionWheelLockedRef.current = false;
        sectionWheelIdleTimerRef.current = null;
      }, 280);
  };

  const navigateDirectlyToStep = (targetStep: number) => {
    setIsFooterVisible(false);

    if (targetStep === 0) {
      updateHeroServicesProgress(0);
      updateServicesPortfolioProgress(0);
    } else if (targetStep === 1) {
      updateHeroServicesProgress(1);
      updateServicesPortfolioProgress(0);
    } else {
      // Portfolio and every later section live after the complete
      // Services -> Portfolio morph. Direct navigation must open
      // the fully formed Portfolio state, never the beginning.
      updateHeroServicesProgress(1);
      updateServicesPortfolioProgress(1);
    }

    setStep(targetStep);
  };

  const prevStep = () => {
    if (activePopupIdx !== null) return;
    if (isAnimatingRef.current) return;

    if (isFooterVisible) {
      lockAnimation();
      setIsFooterVisible(false);
      return;
    }

    if (step === 1) {
      lockAnimation();

      servicesArrivalLockRef.current = false;

      if (servicesWheelIdleTimerRef.current !== null) {
        window.clearTimeout(
          servicesWheelIdleTimerRef.current,
        );
        servicesWheelIdleTimerRef.current = null;
      }

      updateHeroServicesProgress(0);
      updateServicesPortfolioProgress(0);
      setStep(0);
      return;
    }

    if (step === 2) {
      lockAnimation();
      updateHeroServicesProgress(1);
      updateServicesPortfolioProgress(0);
      keepPortfolioReturnLocked();
      setIsFooterVisible(false);
      setStep(1);
      return;
    }

    // Evolution -> Portfolio must always restore the finished
    // Portfolio. The section-wheel lock remains active until the
    // physical gesture is idle, absorbing leftover upward momentum.
    if (step === 3) {
      lockAnimation();
      updateHeroServicesProgress(1);
      updateServicesPortfolioProgress(1);
      setIsFooterVisible(false);
      setStep(2);
      return;
    }

    if (step === 4) {
      lockAnimation();
      setIsFooterVisible(false);
      setStep(3);
    }
  };

  const lockAnimation = () => {
    isAnimatingRef.current = true;
    setTimeout(() => {
      isAnimatingRef.current = false;
    }, 550);
  };

  // Portfolio Slide helpers
  // Project navigation must not share the global section-animation lock.
  // The horizontal gesture state machine already guarantees one project
  // per physical swipe, while buttons/dots should remain immediately usable.
  const nextProject = () => {
    setActiveProjectIdx((prev) => (prev + 1) % 3);
  };

  const prevProject = () => {
    setActiveProjectIdx((prev) => (prev - 1 + 3) % 3);
  };

  // High-End touchpad swipe & vertical scroll state machine
  useEffect(() => {
    if (!isActive) {
      return;
    }
    const handleWheel = (e: WheelEvent) => {
      e.preventDefault(); // prevent standard browser viewport scroll jump


      /*
      * EVOLUTION + BUDGET
      *
      * Treat a trackpad gesture as ONE navigation intent.
      * Small movements are accumulated instead of changing
      * section immediately.
      *
      * After a section change, all remaining inertial wheel
      * events are absorbed until the trackpad becomes idle.
      */
      if (step === 3 || step === 4) {
        // Ignore predominantly horizontal gestures here.
        if (
          Math.abs(e.deltaX) >
          Math.abs(e.deltaY)
        ) {
          return;
        }

        if (
          Math.abs(e.deltaY) < 0.5
        ) {
          return;
        }

        const direction =
          Math.sign(e.deltaY);

        /*
        * If the user reverses direction during the gesture,
        * start measuring the new intention from zero.
        */
        if (
          sectionWheelDirectionRef.current !== 0 &&
          direction !==
            sectionWheelDirectionRef.current
        ) {
          sectionWheelAccumulatorRef.current =
            0;
        }

        sectionWheelDirectionRef.current =
          direction;

        /*
        * Every wheel event postpones the "gesture ended"
        * moment. This is what absorbs macOS trackpad momentum.
        */
        keepSectionWheelGestureLockedUntilIdle();

        /*
        * A section was already changed during this gesture.
        * Consume the remaining momentum.
        */
        if (
          sectionWheelLockedRef.current
        ) {
          return;
        }

        /*
        * Clamp each event.
        *
        * Safari can occasionally emit a very large delta,
        * which should not count as an entire gesture by itself.
        */
        const normalizedDelta =
          Math.sign(e.deltaY) *
          Math.min(
            Math.abs(e.deltaY),
            32,
          );

        sectionWheelAccumulatorRef.current +=
          normalizedDelta;

        /*
        * Require a deliberate gesture.
        */
        const SECTION_CHANGE_THRESHOLD =
          150;

        if (
          Math.abs(
            sectionWheelAccumulatorRef.current,
          ) <
          SECTION_CHANGE_THRESHOLD
        ) {
          return;
        }

        sectionWheelLockedRef.current =
          true;

        sectionWheelAccumulatorRef.current =
          0;

        if (direction > 0) {
          nextStep();
        } else {
          prevStep();
        }

        return;
      }

      // 1. Horizontal Portfolio trackpad gestures.
      // One physical swipe can emit dozens of wheel events on macOS.
      // We accumulate them, move exactly one project and keep the
      // gesture locked until the momentum is completely idle.
      if (
        step === 2 &&
        servicesPortfolioProgressRef.current >= 0.999 &&
        Math.abs(e.deltaX) >
          Math.abs(e.deltaY) * 0.72
      ) {
        if (Math.abs(e.deltaX) < 0.5) return;

        const horizontalDirection = Math.sign(e.deltaX);

        if (
          portfolioHorizontalDirectionRef.current !== 0 &&
          horizontalDirection !==
            portfolioHorizontalDirectionRef.current
        ) {
          portfolioHorizontalAccumulatorRef.current = 0;
        }

        portfolioHorizontalDirectionRef.current =
          horizontalDirection;

        if (
          portfolioHorizontalIdleTimerRef.current !== null
        ) {
          window.clearTimeout(
            portfolioHorizontalIdleTimerRef.current,
          );
        }

        portfolioHorizontalIdleTimerRef.current =
          window.setTimeout(() => {
            portfolioHorizontalAccumulatorRef.current = 0;
            portfolioHorizontalDirectionRef.current = 0;
            portfolioHorizontalLockedRef.current = false;
            portfolioHorizontalIdleTimerRef.current = null;
          }, 150);

        if (portfolioHorizontalLockedRef.current) return;

        const normalizedHorizontalDelta =
          horizontalDirection *
          Math.min(Math.abs(e.deltaX), 26);

        portfolioHorizontalAccumulatorRef.current +=
          normalizedHorizontalDelta;

        const PROJECT_SWIPE_THRESHOLD = 72;

        if (
          Math.abs(
            portfolioHorizontalAccumulatorRef.current,
          ) < PROJECT_SWIPE_THRESHOLD
        ) {
          return;
        }

        portfolioHorizontalLockedRef.current = true;
        portfolioHorizontalAccumulatorRef.current = 0;

        if (horizontalDirection > 0) {
          nextProject();
        } else {
          prevProject();
        }

        return;
      }

      // 2. Continuous Hero <-> Services <-> Portfolio transitions
      if (
        step === 0 ||
        step === 1 ||
        step === 2
      ) {
        if (
          Math.abs(e.deltaY) < 0.5
        ) {
          return;
        }

        const heroProgress =
          heroServicesProgressRef.current;

        const portfolioProgress =
          servicesPortfolioProgressRef.current;

        // If we have just returned from Evolution, absorb the rest
        // of that same upward physical gesture. Without this guard,
        // residual momentum immediately rewinds Portfolio to Services.
        if (
          step === 2 &&
          sectionWheelLockedRef.current &&
          Math.abs(e.deltaY) >= Math.abs(e.deltaX)
        ) {
          keepSectionWheelGestureLockedUntilIdle();
          return;
        }

        const heroSensitivity =
          0.00135;

        const portfolioSensitivity =
          0.00115;

        /*
        * HERO -> SERVICES
        */
        if (
          step === 0 &&
          e.deltaY > 0
        ) {
          const nextProgress =
            clamp01(
              heroProgress +
                e.deltaY *
                  heroSensitivity,
            );

          updateHeroServicesProgress(
            nextProgress,
          );

          if (
            nextProgress >= 0.999
          ) {
            updateHeroServicesProgress(
              1,
            );

            updateServicesPortfolioProgress(
              0,
            );

            keepServicesArrivalLocked();

            setIsFooterVisible(false);
            setStep(1);
          }

          return;
        }

        /*
        * HERO reverse while the logo is still
        * reconstructing.
        */
        if (
          step === 0 &&
          e.deltaY < 0 &&
          heroProgress > 0
        ) {
          const nextProgress =
            clamp01(
              heroProgress +
                e.deltaY *
                  heroSensitivity,
            );

          updateHeroServicesProgress(
            nextProgress,
          );

          return;
        }

        /*
        * SERVICES -> PORTFOLIO
        *
        * The same scroll now morphs:
        *
        * sphere -> cloud
        */
        if (
          step === 1 &&
          e.deltaY > 0 &&
          heroProgress >= 0.999
        ) {
          /*
          * Absorb momentum left over from Hero -> Services.
          */
          if (
            servicesArrivalLockRef.current &&
            portfolioProgress <= 0.001
          ) {
            keepServicesArrivalLocked();
            return;
          }

          const nextProgress =
            clamp01(
              portfolioProgress +
                e.deltaY *
                  portfolioSensitivity,
            );

          updateServicesPortfolioProgress(
            nextProgress,
          );

          if (
            nextProgress >= 0.999
          ) {
            updateServicesPortfolioProgress(
              1,
            );

            keepPortfolioArrivalLocked();

            setIsFooterVisible(false);
            setStep(2);
          }

          return;
        }

        /*
        * User started Services -> Portfolio but reverses
        * before reaching Portfolio.
        *
        * cloud -> sphere
        */
        if (
          step === 1 &&
          e.deltaY < 0 &&
          portfolioProgress > 0
        ) {
          const nextProgress =
            clamp01(
              portfolioProgress +
                e.deltaY *
                  portfolioSensitivity,
            );

          updateServicesPortfolioProgress(
            nextProgress,
          );

          return;
        }

        /*
        * SERVICES -> HERO
        *
        * Only possible after the sphere is fully restored.
        */
        if (
          step === 1 &&
          e.deltaY < 0 &&
          portfolioProgress <= 0.001
        ) {
          /*
          * We have just returned from Portfolio.
          *
          * Remaining upward momentum cannot send us
          * directly through Services and into Hero.
          */
          if (
            portfolioReturnLockRef.current
          ) {
            keepPortfolioReturnLocked();
            return;
          }

          servicesArrivalLockRef.current =
            false;

          if (
            servicesWheelIdleTimerRef.current !==
            null
          ) {
            window.clearTimeout(
              servicesWheelIdleTimerRef.current,
            );

            servicesWheelIdleTimerRef.current =
              null;
          }

          const nextProgress =
            clamp01(
              heroProgress +
                e.deltaY *
                  heroSensitivity,
            );

          setStep(0);
          setIsFooterVisible(false);

          updateHeroServicesProgress(
            nextProgress,
          );

          return;
        }

        /*
        * PORTFOLIO -> SERVICES
        *
        * Reverse the exact same morph:
        *
        * cloud -> sphere
        *
        * We intentionally KEEP step === 2 while this is
        * happening so the transition remains visually
        * continuous.
        */
        if (
          step === 2 &&
          e.deltaY < 0
        ) {
          /*
          * If we just arrived in Portfolio from Services,
          * an intentional reverse gesture should be allowed.
          */
          portfolioArrivalLockRef.current =
            false;

          if (
            portfolioArrivalIdleTimerRef.current !==
            null
          ) {
            window.clearTimeout(
              portfolioArrivalIdleTimerRef.current,
            );

            portfolioArrivalIdleTimerRef.current =
              null;
          }

          const nextProgress =
            clamp01(
              portfolioProgress +
                e.deltaY *
                  portfolioSensitivity,
            );

          updateServicesPortfolioProgress(
            nextProgress,
          );

          if (
            nextProgress <= 0.001
          ) {
            updateServicesPortfolioProgress(
              0,
            );

            updateHeroServicesProgress(
              1,
            );

            keepPortfolioReturnLocked();

            setIsFooterVisible(false);
            setStep(1);
          }

          return;
        }

        /*
        * User reverses direction again while still in the
        * Portfolio -> Services transition.
        *
        * sphere -> cloud again.
        */
        if (
          step === 2 &&
          e.deltaY > 0 &&
          portfolioProgress < 0.999
        ) {
          const nextProgress =
            clamp01(
              portfolioProgress +
                e.deltaY *
                  portfolioSensitivity,
            );

          updateServicesPortfolioProgress(
            nextProgress,
          );

          return;
        }

        /*
         * PORTFOLIO is fully formed.
         *
         * Once the cards are usable, small vertical trackpad noise
         * must not immediately throw the user into Evolution. First
         * absorb the momentum that completed Services -> Portfolio,
         * then require a deliberate new downward gesture.
         */
        if (
          step === 2 &&
          e.deltaY > 0 &&
          portfolioProgress >= 0.999
        ) {
          /*
           * Do not interpret a diagonal horizontal carousel gesture
           * as an attempt to leave Portfolio.
           */
          if (
            Math.abs(e.deltaY) <=
            Math.abs(e.deltaX) * 1.35
          ) {
            return;
          }

          if (portfolioArrivalLockRef.current) {
            keepPortfolioArrivalLocked();
            return;
          }

          if (
            sectionWheelDirectionRef.current !== 0 &&
            sectionWheelDirectionRef.current !== 1
          ) {
            sectionWheelAccumulatorRef.current = 0;
          }

          sectionWheelDirectionRef.current = 1;
          keepSectionWheelGestureLockedUntilIdle();

          if (sectionWheelLockedRef.current) return;

          const normalizedDelta =
            Math.min(Math.abs(e.deltaY), 22);

          sectionWheelAccumulatorRef.current +=
            normalizedDelta;

          const PORTFOLIO_EXIT_THRESHOLD = 300;

          if (
            sectionWheelAccumulatorRef.current <
            PORTFOLIO_EXIT_THRESHOLD
          ) {
            return;
          }

          sectionWheelLockedRef.current = true;
          sectionWheelAccumulatorRef.current = 0;

          nextStep();
          return;
        }

        return;
      }
      

      // 3. Existing discrete navigation for the remaining sections
      if (Math.abs(e.deltaY) < 12) return;

      if (e.deltaY > 0) {
        nextStep();
      } else {
        prevStep();
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' && step === 2) {
        e.preventDefault();
        nextProject();
      } else if (e.key === 'ArrowLeft' && step === 2) {
        e.preventDefault();
        prevProject();
      } else if (e.key === 'ArrowDown' || e.key === 'PageDown') {
        e.preventDefault();
        nextStep();
      } else if (e.key === 'ArrowUp' || e.key === 'PageUp') {
        e.preventDefault();
        prevStep();
      } else if (e.key === 'Escape') {
        setIsFooterVisible(false);
        setActivePopupIdx(null);
      }
    };

    const handleTouchStart = (e: TouchEvent) => {
      touchStartY.current = e.touches[0].clientY;
      touchStartX.current = e.touches[0].clientX;
    };

    const handleTouchMove = (e: TouchEvent) => {
      e.preventDefault(); // Lock native viewport scroll
    };

    const handleTouchEnd = (e: TouchEvent) => {
      const touchEndY = e.changedTouches[0].clientY;
      const touchEndX = e.changedTouches[0].clientX;
      
      const deltaY = touchStartY.current - touchEndY;
      const deltaX = touchStartX.current - touchEndX;

      // Check if user swiped mostly horizontally or vertically
      if (Math.abs(deltaX) > Math.abs(deltaY)) {
        if (step === 2 && Math.abs(deltaX) > 25) {
          if (deltaX > 0) {
            nextProject();
          } else {
            prevProject();
          }
        }
      } else {
        if (Math.abs(deltaY) > 25) {
          if (deltaY > 0) {
            nextStep();
          } else {
            prevStep();
          }
        }
      }
    };

    window.addEventListener('wheel', handleWheel, { passive: false });
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: false });
    window.addEventListener('touchend', handleTouchEnd, { passive: true });

    return () => {
      window.removeEventListener('wheel', handleWheel);
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
    };
  }, [isActive, step, activePopupIdx, activeProjectIdx, isFooterVisible]);

  // Section names for the interactive side tracker
  const sectionLabels = ["Início", "Serviços", "Portfólio", "Evolução", "Orçamento"];

  // Capabilities details structure for the Liquid Glass Popup Modals
  const capabilitiesData = serviceAreas;


  const particleMorphProgress = rangeProgress(
    heroServicesProgress,
    0.06,
    0.96,
  );

  const particleCanvasTakeover = rangeProgress(
    heroServicesProgress,
    0.01,
    0.05,
  );

  const heroDarkenProgress = rangeProgress(
    heroServicesProgress,
    0.18,
    0.88,
  );

  /*
  * SERVICES CONTENT
  *
  * 0.00 -> fully visible
  * 0.02 -> starts leaving
  * 0.18 -> completely gone
  *
  * The particle sphere does NOT start morphing before 0.18.
  */
  const servicesExitProgress =
    smoothstep(
      rangeProgress(
        servicesPortfolioProgress,
        0.02,
        0.18,
      ),
    );

  const servicesContentOpacity =
    1 - servicesExitProgress;

  const servicesContentScale =
    1 -
    servicesExitProgress * 0.025;


  /*
  * PORTFOLIO CONTENT
  *
  * The cloud is fully formed at progress 0.82.
  * Only after that does the Portfolio UI enter.
  *
  * Reverse scroll automatically means:
  * Portfolio UI leaves before the cloud contracts.
  */
  const portfolioEnterProgress =
    smoothstep(
      rangeProgress(
        servicesPortfolioProgress,
        0.82,
        0.98,
      ),
    );

  const portfolioContentOpacity =
    portfolioEnterProgress;

  const portfolioContentScale =
    0.97 +
    portfolioEnterProgress *
      0.03;

  const portfolioContentY =
    (1 -
      portfolioEnterProgress) *
    18;

  // Portfolio projects data featuring official uploaded logos and fast high-end sample looping videos from Google Storage CDN
  const portfolioProjects = [
    {
      id: '01',
      category: 'DESIGN DE INTERFACE & E-COMMERCE',
      title: 'REVISSANT',
      logo: revissantLogo,
      backgroundUrl: revissantBackground,
      backgroundType: 'video',
      desc: 'Uma experiência de e-commerce de alta joalharia e perfumaria premium com transições orgânicas a 120 FPS e design imersivo sob medida.',
      kpi: '+140% Conversões',
      result: 'Resultado de E-Commerce'
    },
    {
      id: '02',
      category: 'TRÁFEGO PAGO & FUNIS DE CONVERSÃO',
      title: 'AURA EVENTS',
      logo: auraEventsLogo,
      backgroundUrl: auraBackground,
      backgroundType: 'image',
      desc: 'Arquitetura e gestão de campanhas digitais e funis de vendas ultra-segmentados para festivais e conferências corporativas de prestígio internacional.',
      kpi: '-55% Custo por Lead',
      result: 'Melhoria de Retorno sobre Investimento'
    },
    {
      id: '03',
      category: 'REBRANDING & DIREÇÃO ARTÍSTICA',
      title: 'CASAS DO BECO',
      logo: casasDoBecoLogo,
      backgroundUrl: casasDoBecoBackground,
      backgroundType: 'video',
      desc: 'Reposicionamento digital e direção de arte completa para uma marca de alojamentos de charme tradicionais portugueses, alinhando a herança clássica com sofisticação contemporânea.',
      kpi: '+300k Alcance Orgânico',
      result: 'Expansão de Autoridade Orgânica'
    }
  ];

  return (
    <main
      className={`relative w-full h-screen bg-white transition-colors duration-300 overflow-hidden select-none ${
        isDarkBg ? 'text-white' : 'text-slate-900'
      }`}
    >

      
      {/* Persistent base background for Hero, Services and Portfolio */}
      <AnimatePresence initial={false}>
        {isDarkBg && (
          <motion.div
            key={
              step <= 2
                ? 'hero-services-portfolio-background-base'
                : 'dark-section-background-base'
            }
            className={`absolute inset-0 z-0 pointer-events-none ${
              step <= 2
                ? 'bg-[#010103]'
                : 'bg-slate-950'
            }`}
            initial={{ opacity: 1 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{
              duration: 0.45,
              ease: [0.16, 1, 0.3, 1],
            }}
          />
        )}
      </AnimatePresence>

      {/* Shared persistent sideral scene for Services + Portfolio */}
      {(step === 1 || step === 2) && (
        <div className="absolute inset-0 z-[1] pointer-events-none">
          <SpaceBackdrop />
        </div>
      )}

      {/* Budget deliberately stays calm and minimal.
          No triangles, giant watermark or decorative objects here. */}
      {step === 4 && (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-[1]"
          style={{
            background:
              'radial-gradient(circle at 50% 47%, rgba(14,165,233,0.055) 0%, rgba(14,165,233,0.018) 22%, transparent 46%), linear-gradient(180deg, rgba(2,6,23,0) 0%, rgba(2,6,23,0.18) 100%)',
          }}
        />
      )}

      {/* TRANSPARENT MINIMALIST HEADER */}
      <header
        className={`fixed top-0 left-0 w-full z-50 px-5 py-5 sm:px-6 md:px-8 md:py-6 flex items-center justify-between select-none pointer-events-none transition-colors duration-300 ${
          step === 3
            ? 'border-b border-slate-900/10 bg-[#f7f7f4]/95 backdrop-blur-xl lg:border-transparent lg:bg-transparent lg:backdrop-blur-none'
            : 'border-b border-transparent bg-transparent'
        }`}
      >
        {/* Left Side: Brand Logo & Text */}
        <button
          type="button"
          className="pointer-events-auto inline-flex items-center space-x-3 cursor-pointer focus:outline-none"
          onClick={() => {
            navigateDirectlyToStep(0);
          }}
          aria-label="Voltar ao início"
        >
          <Logo theme={isVisualDark ? "dark" : "light"} glow={isVisualDark} className="w-5 h-5" />
          <span className={`text-xs font-black tracking-[0.3em] uppercase ${
            isVisualDark ? 'text-white' : 'text-slate-900'
          }`}>
            AXION
          </span>
        </button>

        {/* Center Side: Index-Style Navigation Links */}
        <nav className="pointer-events-auto hidden md:flex items-center space-x-8">
        {sectionLabels.map((label, idx) => {
          const className = `text-[8px] font-mono tracking-widest uppercase transition-all duration-300 relative cursor-pointer py-1 focus:outline-none ${
            step === idx
              ? isVisualDark
                ? 'text-white font-extrabold'
                : 'text-slate-900 font-extrabold'
              : isVisualDark
                ? 'text-slate-500 hover:text-slate-300'
                : 'text-slate-400 hover:text-slate-700'
          }`;

          const content = (
            <>
              <span>{label}</span>

              {step === idx && (
                <motion.div
                  layoutId="headerUnderline"
                  className={`absolute bottom-0 left-0 right-0 h-[1.5px] ${
                    isVisualDark
                      ? 'bg-sky-400 shadow-[0_0_8px_rgba(56,189,248,0.5)]'
                      : 'bg-slate-900'
                  }`}
                />
              )}
            </>
          );

          if (idx === 1) {
            return (
              <a
                key={idx}
                href="/servicos"
                onClick={(event) => {
                  event.preventDefault();

                  if (!isAnimatingRef.current) {
                    lockAnimation();
                    navigateDirectlyToStep(1);
                  }
                }}
                className={className}
              >
                {content}
              </a>
            );
          }

          return (
            <button
              key={idx}
              type="button"
              onClick={() => {
                if (!isAnimatingRef.current) {
                  lockAnimation();
                  navigateDirectlyToStep(idx);
                }
              }}
              className={className}
            >
              {content}
            </button>
          );
        })}
      </nav>

        {/* Right Side: Back to Portal CTA Button */}
        <button
          onClick={onBack}
          className={`pointer-events-auto flex items-center space-x-2 px-4.5 py-2 rounded-full text-[8px] font-bold tracking-widest uppercase transition-all duration-300 border cursor-pointer select-none focus:outline-none ${
            isVisualDark 
              ? 'border-white/10 hover:border-white hover:bg-white/5 text-white' 
              : 'border-slate-900/10 hover:border-slate-900 hover:bg-slate-900/5 text-slate-800'
          }`}
        >
          <ArrowLeft size={10} />
          <span>Portal</span>
        </button>
      </header>

      {/* SINGLE SECTION CONTAINER WITH ENHANCED TRANSITIONS */}
      <div className="relative z-10 w-full h-full flex flex-col justify-center items-center px-6 md:px-12">
        {isActive && (
          step === 0 ||
          step === 1 ||
          step === 2
        ) && (
          <div
            className={`pointer-events-none absolute inset-0 ${
              step === 0
                ? 'z-[30]'
                : 'z-[5]'
            }`}
          >
            <AxionParticleField
              sourceElementRef={
                heroLogoRef
              }
              morphProgress={
                particleMorphProgress
              }
              servicesPortfolioProgress={
                servicesPortfolioProgress
              }
              opacity={
                step === 0
                  ? particleCanvasTakeover
                  : 1
              }
            />
          </div>
        )}
        <AnimatePresence mode="wait">
          
          {/* STEP 0: IMMERSIVE AXION BRAND FIELD */}
          {step === 0 && (
            <motion.div
              key="hero-stage"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, y: -24 }}
              transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
              className="absolute inset-0 flex items-center justify-center overflow-hidden pointer-events-auto"
            >
              {isActive && (
                <motion.img
                  src={heroBackground}
                  alt=""
                  className="absolute inset-0 h-full w-full object-cover object-center pointer-events-none"
                  initial={{ opacity: 0, scale: 1.075 }}
                  animate={{
                    opacity: 1,
                    scale: 1.035,
                    x: mouseOffset.x * 0.32,
                    y: mouseOffset.y * 0.32,
                  }}
                  transition={{
                    duration: 1.15,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                />
              )}
              <motion.div
                className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/15 to-black/70 pointer-events-none"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.7 }}
              />
              <div
                className="absolute inset-0 pointer-events-none"
                style={{ background: 'radial-gradient(circle at 50% 47%, transparent 12%, rgba(0,0,0,0.12) 52%, rgba(0,0,0,0.52) 100%)' }}
              />
              <motion.div
                className="absolute inset-0 opacity-85 mix-blend-screen pointer-events-none"
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.85 }}
                transition={{ duration: 0.8, delay: 0.15 }}
              >
                {isActive && (
                  <FloatingTriangles
                    theme="dark"
                    variant="hero"
                  />
                )}
              </motion.div>
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 z-[2] bg-black"
                style={{
                  opacity: heroDarkenProgress * 0.94,
                }}
              />

              <motion.div
                className="absolute inset-0 opacity-35 pointer-events-none"
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.35 }}
                transition={{ duration: 0.7 }}
                style={{
                  backgroundImage: 'linear-gradient(rgba(255,255,255,0.045) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.045) 1px, transparent 1px)',
                  backgroundSize: '64px 64px',
                  maskImage: 'radial-gradient(circle at 50% 48%, black 8%, transparent 70%)',
                }}
              />

              <motion.div
                className="absolute left-1/2 top-[46%] h-[34rem] w-[34rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-sky-300/10 blur-[130px] pointer-events-none"
                initial={{ opacity: 0, scale: 0.65 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              />

              <div className="absolute left-1/2 top-1/2 h-[min(72vw,43rem)] w-[min(72vw,43rem)] -translate-x-1/2 -translate-y-1/2 pointer-events-none">
                <motion.div
                  className="absolute left-1/2 top-0 h-full w-px bg-gradient-to-b from-transparent via-white/[0.09] to-transparent"
                  initial={{ scaleY: 0 }}
                  animate={{ scaleY: 1 }}
                  transition={{ duration: 0.7, delay: 0.15 }}
                />
                <motion.div
                  className="absolute left-0 top-1/2 h-px w-full bg-gradient-to-r from-transparent via-white/[0.09] to-transparent"
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ duration: 0.7, delay: 0.15 }}
                />
              </div>

              <div className="relative z-10 flex w-full max-w-6xl flex-col items-center px-6 text-center">
                <motion.div
                  className="relative"
                  initial={{ opacity: 0, scale: 0.82, filter: 'blur(10px)' }}
                  animate={{
                    opacity: 1,
                    scale: 1,
                    filter: 'blur(0px)',
                  }}
                  transition={{ duration: 0.75, delay: 0.12, ease: [0.16, 1, 0.3, 1] }}
                >
                  <motion.div
                    className="relative"
                    style={{
                      opacity: 1 - particleCanvasTakeover,
                    }}
                    ref={heroLogoRef}
                    animate={{
                      x: mouseOffset.x * 0.55,
                      y: mouseOffset.y * 0.55,
                    }}
                    transition={{ type: 'spring', stiffness: 85, damping: 24, mass: 0.65 }}
                  >
                    <div className="absolute inset-1/4 rounded-full bg-sky-300/20 blur-[80px] pointer-events-none" />
                    <Logo theme="dark" glow={false} className="h-64 w-[24rem] max-w-[88vw] sm:h-72 sm:w-[32rem] md:h-[24rem] md:w-[42rem] lg:h-[28rem] lg:w-[50rem]" />
                  </motion.div>
                </motion.div>

                <motion.div
                  className="-mt-10 sm:-mt-14 flex flex-col items-center"
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.55, delay: 0.65, ease: 'easeOut' }}
                >
                  <h1 className="max-w-2xl text-[9px] sm:text-[10px] tracking-[0.3em] font-extrabold uppercase text-slate-200 leading-relaxed drop-shadow-[0_2px_12px_rgba(0,0,0,0.7)]">
                    Design Estratégico • Performance Digital • Experiências Memoráveis
                  </h1>
                </motion.div>
              </div>

              <motion.div
                className="absolute bottom-8 left-1/2 flex -translate-x-1/2 flex-col items-center gap-2 pointer-events-none"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.9 }}
              >
                <span className="text-[8px] tracking-[0.3em] font-bold uppercase text-white/60">Scroll para navegar</span>
                <div className="w-px h-8 overflow-hidden relative bg-white/15">
                  <motion.div
                    className="absolute left-0 top-0 h-1/2 w-full bg-sky-300"
                    animate={{ y: ['-100%', '200%'] }}
                    transition={{ duration: 1.7, repeat: Infinity, ease: 'easeInOut' }}
                  />
                </div>
              </motion.div>
            </motion.div>
          )}

          {/* SHARED SERVICES <-> PORTFOLIO STAGE */}
          {(step === 1 || step === 2) && (
            <motion.div
              key="services-portfolio-shared-stage"
              initial={{ opacity: 1 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{
                duration: 0.45,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="absolute inset-0 z-10"
            >
              {/*
              * SERVICES
              *
              * Keep it mounted slightly beyond the end of its
              * fade so React never removes visible content.
              */}
              {servicesPortfolioProgress <= 0.21 && (
                <div
                  className="absolute inset-0"
                  style={{
                    opacity:
                      servicesContentOpacity,

                    transform:
                      `scale(${servicesContentScale})`,

                    transformOrigin:
                      '50% 50%',
                  }}
                >
                  <ServicesExperience
                    onNavigateToService={
                      onNavigateToService
                    }
                  />
                </div>
              )}

              {/*
              * PORTFOLIO
              *
              * Mount it BEFORE it becomes visible.
              * It therefore never suddenly appears.
              */}
              {servicesPortfolioProgress >= 0.79 && (
                <div
                  className="absolute inset-0"
                  style={{
                    opacity:
                      portfolioContentOpacity,

                    transform:
                      `translateY(${portfolioContentY}px) scale(${portfolioContentScale})`,

                    transformOrigin:
                      '50% 50%',
                  }}
                >
                  <div className="absolute inset-0 [&_h3]:hidden">
                    <PortfolioExperience
                      projects={
                        portfolioProjects
                      }
                      activeIndex={
                        activeProjectIdx
                      }
                      onSelect={
                        setActiveProjectIdx
                      }
                      onNext={
                        nextProject
                      }
                      onPrev={
                        prevProject
                      }
                    />
                  </div>
                </div>
              )}
            </motion.div>
          )}

          {/* STEP 4: MINIMAL BUDGET CTA */}
          {step === 4 && (
            <motion.section
              key="budget-home-cta-stage"
              initial={{ opacity: 0, y: 24 }}
              animate={{
                opacity: isFooterVisible ? 0.24 : 1,
                y: isFooterVisible ? -72 : 0,
                scale: isFooterVisible ? 0.975 : 1,
              }}
              exit={{ opacity: 0, y: -24 }}
              transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
              className="absolute inset-0 z-10 flex items-center justify-center px-6 pointer-events-auto select-none md:px-12"
            >
              <div className="relative flex w-full max-w-5xl flex-col items-center text-center">
                <motion.span
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.45, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
                  className="font-mono text-[8px] font-bold uppercase tracking-[0.34em] text-sky-400"
                >
                  AXION / Próximo passo
                </motion.span>

                <motion.h2
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.7, delay: 0.12, ease: [0.16, 1, 0.3, 1] }}
                  className="mt-7 max-w-4xl text-[clamp(3rem,6.1vw,6.4rem)] font-black uppercase leading-[0.86] tracking-[-0.055em] text-white"
                >
                  A próxima fase
                  <br />
                  <span className="text-sky-400">começa aqui.</span>
                </motion.h2>

                <motion.p
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.55, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
                  className="mt-7 max-w-2xl text-sm font-medium leading-[1.8] text-slate-300 md:text-[15px]"
                >
                  Conte-nos o que pretende construir, melhorar ou automatizar.
                  Ajudamos a transformar essa necessidade numa solução clara, segura e preparada para crescer.
                </motion.p>

                <motion.button
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.28, ease: [0.16, 1, 0.3, 1] }}
                  whileHover={{ x: 4 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={onNavigateToBudget}
                  className="group mt-10 inline-flex cursor-pointer items-center gap-4 border-b border-white/25 pb-3 text-[10px] font-black uppercase tracking-[0.22em] text-white transition-colors duration-300 hover:border-sky-400 hover:text-sky-300 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-sky-400"
                >
                  <span>Pedir orçamento</span>
                  <ArrowRight
                    size={13}
                    className="transition-transform duration-300 group-hover:translate-x-1.5"
                  />
                </motion.button>

                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.6, delay: 0.38 }}
                  className="mt-14 flex flex-wrap items-center justify-center gap-x-4 gap-y-2 font-mono text-[7px] font-bold uppercase tracking-[0.18em] text-white/28 sm:gap-x-6"
                >
                  <span>Websites</span>
                  <span className="h-1 w-1 rounded-full bg-sky-400/50" />
                  <span>Sistemas</span>
                  <span className="h-1 w-1 rounded-full bg-sky-400/50" />
                  <span>Automação</span>
                  <span className="h-1 w-1 rounded-full bg-sky-400/50" />
                  <span>AI</span>
                </motion.div>

                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute left-1/2 top-1/2 -z-10 h-[28rem] w-[28rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-sky-400/[0.035] blur-[130px]"
                />
              </div>
            </motion.section>
          )}

        </AnimatePresence>

        <AnimatePresence>
          {/* Footer reveal after an additional scroll on the final section */}
          {step === 4 && isFooterVisible && (
            <motion.footer
              key="homepage-footer"
              initial={{ opacity: 0, y: "100%" }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: "100%" }}
              transition={{ type: 'spring', stiffness: 110, damping: 24 }}
              className="absolute inset-x-0 bottom-0 z-40 w-full px-6 md:px-12 pointer-events-auto text-left bg-slate-950/98 backdrop-blur-2xl border-t border-white/10 shadow-[0_-30px_80px_rgba(2,6,23,0.48)]"
            >
              <WebsiteFooterContent
                sectionLabels={sectionLabels}
                onNavigateSection={(idx) => {
                  if (!isAnimatingRef.current) {
                    lockAnimation();
                    navigateDirectlyToStep(idx);
                  }
                }}
              />
            </motion.footer>
          )}

        </AnimatePresence>

        {/* STEP 3: BUSINESS DIGITAL EVOLUTION */}
        <AnimatePresence>
          {step === 3 && (
            <motion.section
              key="business-evolution-stage"
              initial={{ y: '100%' }}
              animate={{ y: '0%' }}
              exit={{ y: '100%' }}
              transition={{
                type: 'spring',
                damping: 30,
                stiffness: 115,
              }}
              className="fixed inset-0 z-40 overflow-hidden bg-[#f7f7f4] text-slate-950"
            >
              {/* Subtle AXION watermark */}
              <div className="pointer-events-none absolute inset-0 flex items-center justify-center overflow-hidden opacity-[0.014]">
                <Logo
                  theme="light"
                  glow={false}
                  className="scale-[4.6]"
                />
              </div>

              {/* Return to portfolio */}
              <button
                type="button"
                onClick={() => {
                  if (!isAnimatingRef.current) {
                    lockAnimation();
                    navigateDirectlyToStep(2);
                  }
                }}
                className="absolute right-8 top-[5.35rem] z-50 flex cursor-pointer items-center gap-2 text-[8px] font-black uppercase tracking-[0.2em] text-slate-400 transition-colors hover:text-sky-600 md:right-12"
              >
                <ChevronDown size={14} />
                <span>Portfólio</span>
              </button>

              <div className="relative z-10 mx-auto hidden h-dvh w-full max-w-[1380px] flex-col px-6 pb-4 pt-[5.35rem] md:px-12 lg:flex">
                {/* Intro */}
                <div className="grid shrink-0 gap-5 border-b border-slate-900/10 pb-4 lg:grid-cols-12 lg:items-end">
                  <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      duration: 0.62,
                      ease: transitionEase,
                    }}
                    className="lg:col-span-7"
                  >
                    <span className="font-mono text-[8px] font-bold uppercase tracking-[0.32em] text-sky-600">
                      AXION / Evolução digital
                    </span>

                    <h2 className="mt-3 max-w-[49rem] text-[clamp(2.25rem,5.4vh,4.3rem)] font-black uppercase leading-[0.86] tracking-[-0.052em]">
                      Evoluir com princípio.
                      <br />
                      <span className="text-sky-600">
                        Crescer com segurança.
                      </span>
                    </h2>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      duration: 0.62,
                      delay: 0.08,
                      ease: transitionEase,
                    }}
                    className="lg:col-span-5 lg:pb-1"
                  >
                    <p className="max-w-xl text-[13px] font-semibold leading-[1.65] text-slate-700">
                      A AXION ajuda empresas a evoluir tecnologicamente sem perder identidade,
                      visão ou controlo.
                    </p>

                    <p className="mt-2 max-w-xl text-[11px] font-medium leading-[1.65] text-slate-500">
                      Construímos websites, plataformas, sistemas internos, automações e
                      integrações de AI alinhados com os processos reais do negócio e preparados
                      para sustentar crescimento.
                    </p>
                  </motion.div>
                </div>

                {/* Evolution stage selector */}
                <div className="grid shrink-0 grid-cols-3 border-b border-slate-900/10">
                  {(
                    [
                      'base',
                      'structure',
                      'evolution',
                    ] as EvolutionStageKey[]
                  ).map((stageKey) => {
                    const item = evolutionStages[stageKey];
                    const isActive = activeEvolutionStage === stageKey;

                    return (
                      <button
                        key={stageKey}
                        type="button"
                        onClick={() => setActiveEvolutionStage(stageKey)}
                        className={`relative cursor-pointer px-2 py-3.5 text-left transition-colors md:px-5 ${
                          isActive
                            ? 'text-sky-600'
                            : 'text-slate-400 hover:text-slate-800'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <span className="font-mono text-[8px] font-bold tracking-[0.18em]">
                            {item.id}
                          </span>
                          <span className="text-[9px] font-black uppercase tracking-[0.2em]">
                            {item.label}
                          </span>
                        </div>

                        {isActive && (
                          <motion.div
                            layoutId="evolution-stage-line"
                            className="absolute inset-x-0 bottom-[-1px] h-[2px] bg-sky-500"
                            transition={{
                              type: 'spring',
                              stiffness: 280,
                              damping: 28,
                            }}
                          />
                        )}
                      </button>
                    );
                  })}
                </div>

                {/* Main editorial area */}
                <div className="grid min-h-0 flex-1 overflow-hidden lg:grid-cols-12">
                  {/* Narrative */}
                  <motion.div
                    key={`evolution-copy-${activeEvolutionStage}`}
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{
                      duration: 0.46,
                      ease: transitionEase,
                    }}
                    className="flex min-h-0 flex-col justify-start overflow-hidden border-b border-slate-900/10 py-[clamp(1rem,2.3vh,1.45rem)] lg:col-span-5 lg:border-b-0 lg:border-r lg:pr-10"
                  >
                    <span className="font-mono text-[7px] font-bold uppercase tracking-[0.26em] text-sky-600">
                      {currentEvolutionStage.eyebrow}
                    </span>

                    <h3 className="mt-3 max-w-[34rem] text-[clamp(1.45rem,3.5vh,2.35rem)] font-black leading-[0.98] tracking-[-0.035em]">
                      {currentEvolutionStage.title}
                    </h3>

                    <p className="mt-4 max-w-xl text-[12px] font-medium leading-[1.66] text-slate-600">
                      {currentEvolutionStage.body}
                    </p>

                    <div className="mt-4 grid grid-cols-2 gap-x-6 border-t border-slate-900/10 pt-2">
                      {currentEvolutionStage.points.map((point, index) => (
                        <motion.div
                          key={point}
                          initial={{ opacity: 0, y: 6 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{
                            duration: 0.3,
                            delay: index * 0.035,
                          }}
                          className="flex min-h-8 items-start gap-2 border-b border-slate-900/8 py-2"
                        >
                          <span className="mt-[2px] font-mono text-[7px] text-sky-600">
                            {String(index + 1).padStart(2, '0')}
                          </span>

                          <span className="text-[8px] font-bold uppercase leading-[1.4] tracking-[0.075em] text-slate-600">
                            {point}
                          </span>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>

                  {/* Animated system diagram */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{
                      duration: 0.65,
                      delay: 0.1,
                    }}
                    className="relative flex min-h-0 items-center justify-center overflow-hidden lg:col-span-7 lg:pl-6"
                  >
                    <div className="absolute left-6 top-4 z-10">
                      <span className="font-mono text-[7px] font-bold uppercase tracking-[0.24em] text-slate-400">
                        Arquitetura digital / visualização
                      </span>
                    </div>

                    <div className="h-full min-h-0 w-full pt-5">
                      <EvolutionSystemDiagram stage={activeEvolutionStage} />
                    </div>
                  </motion.div>
                </div>

                {/* Principles */}
                <div className="grid shrink-0 border-t border-slate-900/10 sm:grid-cols-3">
                  <div className="py-3 sm:pr-6">
                    <span className="font-mono text-[7px] font-bold uppercase tracking-[0.22em] text-sky-600">
                      01 / Identidade
                    </span>
                    <p className="mt-1.5 max-w-sm text-[9px] font-semibold leading-[1.45] text-slate-600">
                      Evoluir sem descaracterizar o que torna o negócio reconhecível.
                    </p>
                  </div>

                  <div className="border-t border-slate-900/10 py-3 sm:border-l sm:border-t-0 sm:px-6">
                    <span className="font-mono text-[7px] font-bold uppercase tracking-[0.22em] text-sky-600">
                      02 / Estrutura
                    </span>
                    <p className="mt-1.5 max-w-sm text-[9px] font-semibold leading-[1.45] text-slate-600">
                      Construir primeiro uma base coerente para poder crescer com confiança.
                    </p>
                  </div>

                  <div className="border-t border-slate-900/10 py-3 sm:border-l sm:border-t-0 sm:pl-6">
                    <span className="font-mono text-[7px] font-bold uppercase tracking-[0.22em] text-sky-600">
                      03 / Segurança
                    </span>
                    <p className="mt-1.5 max-w-sm text-[9px] font-semibold leading-[1.45] text-slate-600">
                      Adicionar capacidade sem perder controlo, clareza ou responsabilidade.
                    </p>
                  </div>
                </div>
              </div>
              {/* MOBILE EVOLUTION EXPERIENCE */}
              <div
                className="relative z-10 h-dvh w-full overflow-y-auto overscroll-contain px-5 pb-28 pt-28 touch-pan-y lg:hidden"
                onWheel={(event) => {
                  event.stopPropagation();
                }}
                onTouchStart={(event) => {
                  event.stopPropagation();
                }}
                onTouchMove={(event) => {
                  event.stopPropagation();
                }}
                onTouchEnd={(event) => {
                  event.stopPropagation();
                }}
              >
                <div className="mx-auto w-full max-w-md">

                  {/* Intro */}
                  <motion.div
                    initial={{
                      opacity: 0,
                      y: 16,
                    }}
                    animate={{
                      opacity: 1,
                      y: 0,
                    }}
                    transition={{
                      duration: 0.55,
                      ease: transitionEase,
                    }}
                  >
                    <span className="font-mono text-[7px] font-bold uppercase tracking-[0.3em] text-sky-600">
                      AXION / Evolução digital
                    </span>

                    <h2 className="mt-4 text-[clamp(2.45rem,11vw,3.2rem)] font-black uppercase leading-[0.86] tracking-[-0.052em]">
                      Evoluir com
                      <br />
                      princípio.
                      <br />

                      <span className="text-sky-600">
                        Crescer com
                        <br />
                        segurança.
                      </span>
                    </h2>

                    <div className="mt-7 border-t border-slate-900/10 pt-5">
                      <p className="text-[13px] font-semibold leading-[1.65] text-slate-700">
                        A AXION ajuda empresas a evoluir tecnologicamente sem perder identidade,
                        visão ou controlo.
                      </p>

                      <p className="mt-3 text-[11px] font-medium leading-[1.7] text-slate-500">
                        Construímos websites, plataformas, sistemas internos, automações e
                        integrações de AI alinhados com os processos reais do negócio e preparados
                        para sustentar crescimento.
                      </p>
                    </div>
                  </motion.div>

                  {/* Stage selector */}
                  <div className="mt-8 grid grid-cols-3 border-y border-slate-900/10">
                    {(
                      [
                        'base',
                        'structure',
                        'evolution',
                      ] as EvolutionStageKey[]
                    ).map((stageKey) => {
                      const item =
                        evolutionStages[stageKey];

                      const isActive =
                        activeEvolutionStage ===
                        stageKey;

                      return (
                        <button
                          key={stageKey}
                          type="button"
                          onClick={() =>
                            setActiveEvolutionStage(
                              stageKey,
                            )
                          }
                          className={`relative min-w-0 px-1 py-4 text-center transition-colors ${
                            isActive
                              ? 'text-sky-600'
                              : 'text-slate-400'
                          }`}
                        >
                          <div className="flex flex-col items-center gap-1.5">
                            <span className="font-mono text-[7px] font-bold tracking-[0.16em]">
                              {item.id}
                            </span>

                            <span className="text-[7px] font-black uppercase tracking-[0.14em]">
                              {item.label}
                            </span>
                          </div>

                          {isActive && (
                            <motion.div
                              layoutId="evolution-stage-line-mobile"
                              className="absolute inset-x-0 bottom-[-1px] h-[2px] bg-sky-500"
                              transition={{
                                type: 'spring',
                                stiffness: 280,
                                damping: 28,
                              }}
                            />
                          )}
                        </button>
                      );
                    })}
                  </div>

                  {/* Active stage */}
                  <motion.div
                    key={`mobile-evolution-${activeEvolutionStage}`}
                    initial={{
                      opacity: 0,
                      y: 10,
                    }}
                    animate={{
                      opacity: 1,
                      y: 0,
                    }}
                    transition={{
                      duration: 0.4,
                      ease: transitionEase,
                    }}
                    className="py-8"
                  >
                    <span className="font-mono text-[7px] font-bold uppercase tracking-[0.28em] text-sky-600">
                      {currentEvolutionStage.eyebrow}
                    </span>

                    <h3 className="mt-4 text-[clamp(1.85rem,8.5vw,2.6rem)] font-black leading-[0.96] tracking-[-0.04em]">
                      {currentEvolutionStage.title}
                    </h3>

                    <p className="mt-5 text-[13px] font-medium leading-[1.75] text-slate-600">
                      {currentEvolutionStage.body}
                    </p>

                    {/* Stage points */}
                    <div className="mt-7 border-t border-slate-900/10">
                      {currentEvolutionStage.points.map(
                        (point, index) => (
                          <div
                            key={point}
                            className="flex items-start gap-4 border-b border-slate-900/10 py-4"
                          >
                            <span className="mt-[2px] shrink-0 font-mono text-[7px] font-bold text-sky-600">
                              {String(
                                index + 1,
                              ).padStart(
                                2,
                                '0',
                              )}
                            </span>

                            <span className="text-[10px] font-bold uppercase leading-[1.5] tracking-[0.07em] text-slate-700">
                              {point}
                            </span>
                          </div>
                        ),
                      )}
                    </div>
                  </motion.div>

                  {/* Principles */}
                  <div className="border-t border-slate-900/10">
                    <div className="py-5">
                      <span className="font-mono text-[7px] font-bold uppercase tracking-[0.22em] text-sky-600">
                        01 / Identidade
                      </span>

                      <p className="mt-2 text-[11px] font-semibold leading-[1.6] text-slate-600">
                        Evoluir sem descaracterizar o que torna o negócio reconhecível.
                      </p>
                    </div>

                    <div className="border-t border-slate-900/10 py-5">
                      <span className="font-mono text-[7px] font-bold uppercase tracking-[0.22em] text-sky-600">
                        02 / Estrutura
                      </span>

                      <p className="mt-2 text-[11px] font-semibold leading-[1.6] text-slate-600">
                        Construir primeiro uma base coerente para poder crescer com confiança.
                      </p>
                    </div>

                    <div className="border-t border-slate-900/10 py-5">
                      <span className="font-mono text-[7px] font-bold uppercase tracking-[0.22em] text-sky-600">
                        03 / Segurança
                      </span>

                      <p className="mt-2 text-[11px] font-semibold leading-[1.6] text-slate-600">
                        Adicionar capacidade sem perder controlo, clareza ou responsabilidade.
                      </p>
                    </div>
                  </div>

                  {/* Mobile progression */}
                  <button
                    type="button"
                    onClick={() => {
                      lockAnimation();
                      navigateDirectlyToStep(4);
                    }}
                    className="mt-8 flex w-full items-center justify-between border-t border-slate-900/15 py-6 text-left"
                  >
                    <div>
                      <span className="block font-mono text-[7px] font-bold uppercase tracking-[0.26em] text-sky-600">
                        Próxima etapa
                      </span>

                      <span className="mt-2 block text-[12px] font-black uppercase tracking-[0.12em] text-slate-900">
                        Orçamento
                      </span>
                    </div>

                    <ArrowRight
                      size={16}
                      className="text-sky-600"
                    />
                  </button>
                </div>
              </div>
            </motion.section>
          )}
        </AnimatePresence>



        {/* GLOBAL MINIMALIST FOOTER */}
        {!isFooterVisible && (
          <div className={`absolute bottom-6 left-1/2 -translate-x-1/2 text-[8px] font-mono tracking-[0.3em] uppercase z-30 select-none pointer-events-none ${
            isVisualDark ? 'text-slate-600' : 'text-slate-400'
          }`}>
            <span>© 2026 AXION • TECNOLOGIA DE PRESTÍGIO</span>
          </div>
        )}

      </div>

      {/* CAPABILITIES EXPLORATION PANEL */}
      <AnimatePresence>
        {activePopupIdx !== null && (
          <motion.div
            key="glass-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex cursor-pointer items-center justify-center bg-slate-950/25 p-3 backdrop-blur-md sm:p-6"
            onClick={() => setActivePopupIdx(null)}
          >
            <motion.div
              initial={{ scale: 0.95, y: 15, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.95, y: 15, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 380, damping: 28 }}
              className="relative max-h-[90vh] w-full max-w-4xl cursor-default overflow-y-auto rounded-[28px] border border-white/60 bg-white/80 p-6 text-left shadow-[0_30px_90px_rgba(15,23,42,0.18)] backdrop-blur-2xl sm:p-8 md:p-10"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full bg-sky-200/30 blur-3xl" />
              <div className="pointer-events-none absolute -bottom-32 -left-24 h-64 w-64 rounded-full bg-blue-200/20 blur-3xl" />

              <button
                onClick={() => setActivePopupIdx(null)}
                aria-label="Fechar detalhes da capacidade"
                className="absolute right-5 top-5 z-20 cursor-pointer rounded-full border border-slate-900/10 bg-white/70 p-2 text-slate-800 shadow-2xs transition-all hover:border-slate-900/20 hover:bg-white focus-visible:outline-2 focus-visible:outline-sky-500 sm:right-6 sm:top-6"
              >
                <X size={14} />
              </button>

              <div className="relative z-10 grid gap-8 md:grid-cols-[0.78fr_1.22fr] md:gap-12">
                <div className="flex flex-col md:min-h-[420px]">
                  <span className="block font-mono text-[9px] uppercase tracking-[0.25em] text-slate-400">
                    ÁREA {capabilitiesData[activePopupIdx].id} / 06
                  </span>

                  <div className="mt-8 inline-flex h-12 w-12 items-center justify-center rounded-full border border-slate-900/10 bg-white/70 shadow-2xs">
                    {(() => {
                      const Icon = capabilitiesData[activePopupIdx].icon;
                      return <Icon size={20} className="text-slate-800" />;
                    })()}
                  </div>

                  <h4 className="mt-5 max-w-xs text-2xl font-extrabold uppercase leading-[0.95] tracking-[-0.035em] text-slate-900 sm:text-3xl">
                    {capabilitiesData[activePopupIdx].title}
                  </h4>

                  <p className="mt-4 max-w-sm text-xs font-medium leading-relaxed text-slate-600 sm:text-sm">
                    {capabilitiesData[activePopupIdx].desc}
                  </p>

                  <div className="mt-auto hidden pt-10 md:block">
                    <div className="h-px w-full bg-slate-900/10" />
                    <p className="mt-4 text-[8px] font-bold uppercase leading-relaxed tracking-[0.2em] text-slate-400">
                      Marketing <span className="px-1 text-sky-600">+</span> Tecnologia <span className="px-1 text-sky-600">+</span> Inteligência Artificial
                    </p>
                  </div>
                </div>

                <div className="border-t border-slate-900/10 pt-6 md:border-l md:border-t-0 md:pl-10 md:pt-0">
                  <span className="font-mono text-[9px] uppercase tracking-[0.25em] text-slate-400">
                    Serviços incluídos
                  </span>

                  <div className="mt-5 grid gap-x-6 sm:grid-cols-2">
                    {capabilitiesData[activePopupIdx].services.map((service, serviceIdx) => (
                      <motion.div
                        key={service}
                        initial={{ opacity: 0, x: 8 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: 0.08 + serviceIdx * 0.025 }}
                        className="flex min-h-11 items-start gap-3 border-t border-slate-900/8 py-3 first:border-t-0 sm:[&:nth-child(2)]:border-t-0"
                      >
                        <span className="mt-0.5 shrink-0 font-mono text-[8px] text-sky-600">
                          {String(serviceIdx + 1).padStart(2, '0')}
                        </span>
                        <span className="text-[10px] font-bold leading-snug text-slate-700 sm:text-[11px]">
                          {service}
                        </span>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="relative z-10 mt-7 flex items-center justify-between gap-4 border-t border-slate-900/10 pt-4">
                <div className="flex items-center gap-4 font-mono text-[8px] uppercase tracking-[0.18em] text-slate-400">
                  <span>AXION</span>
                  <span className="hidden h-3 w-px bg-slate-900/10 sm:block" />
                  <span className="hidden sm:block">{capabilitiesData[activePopupIdx].services.length} capacidades</span>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setActivePopupIdx(null);
                    onNavigateToBudget();
                  }}
                  className="group flex cursor-pointer items-center gap-2 border-b border-slate-900/15 pb-1 text-[8px] font-extrabold uppercase tracking-[0.2em] text-slate-700 transition-colors duration-300 hover:border-sky-500 hover:text-sky-700 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-sky-500"
                >
                  <span>Avançar para orçamento</span>
                  <ArrowRight size={10} className="transition-transform duration-300 group-hover:translate-x-1" />
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </main>
  );
}
