import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ArrowLeft, 
  ArrowRight, 
  X,
  ChevronLeft,
  ChevronRight,
  ChevronDown
} from 'lucide-react';
import Logo from './Logo';
import FloatingTriangles from './FloatingTriangles';
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
  onBack: () => void;
  onNavigateToBudget: () => void;
  onNavigateToServices: () => void;
}

type PresencePhaseKey = 'inertia' | 'transition' | 'ascension';

const presencePhases: Record<PresencePhaseKey, {
  status: string;
  title: string;
  narrative: string;
  metricLabel: string;
  metricValue: string;
  competitivePosition: string;
  chartState: string;
  chartPath: string;
  chartEnd: { x: number; y: number };
  consequence: string;
}> = {
  inertia: {
    status: 'Risco de Estagnação',
    title: 'O Custo Invisível de Recusar a Evolução',
    narrative: 'Negócios que operam de forma puramente analógica ou com portais desatualizados estão a perder relevância a cada segundo. Ignorar a modernização digital não poupa recursos; drena silenciosamente a autoridade da marca. Sem um ecossistema tecnológico refinado, a sua empresa cede espaço precioso a concorrentes modernos e torna-se invisível para o cliente qualificado.',
    metricLabel: 'Retenção',
    metricValue: '-65%',
    competitivePosition: 'Vulnerabilidade Máxima',
    chartState: 'Fase Crítica',
    chartPath: 'M10 20 L100 45 L200 80 L290 105',
    chartEnd: { x: 290, y: 105 },
    consequence: 'Ignorar a tecnologia leva a margens esmagadas e perda gradual de clientela. O negócio fica aprisionado no passado.',
  },
  transition: {
    status: 'O Limbo do Genérico',
    title: 'Estar Online não é o mesmo que Prosperar',
    narrative: 'A maioria dos negócios comete o erro de se digitalizar utilizando templates genéricos, criadores de páginas pesados e soluções baratas. Isso cria uma presença estagnada que sobrevive no ruído da mediocridade. Sem performance instantânea e design que respira prestígio, o cliente entra, frustra-se com a lentidão e abandona o site. É o limbo do investimento desperdiçado.',
    metricLabel: 'Abandono',
    metricValue: '75%',
    competitivePosition: 'Margens Comprimidas',
    chartState: 'Platô Estagnado',
    chartPath: 'M10 80 L100 82 L200 78 L290 81',
    chartEnd: { x: 290, y: 81 },
    consequence: 'Fórmulas prontas e sites amadores geram desperdício de publicidade e custos elevados de aquisição (CAC).',
  },
  ascension: {
    status: 'Liderança de Mercado',
    title: 'A Tecnologia como o Maior Ativo de Escala',
    narrative: 'Para prosperar, o seu negócio precisa de adotar a engenharia digital de elite. Portais desenvolvidos sob medida que carregam em menos de 0.8s, micro-interações fluidas e uma narrativa de luxo estabelecem autoridade automática. A tecnologia avançada não é apenas uma ferramenta — é o funil que atrai leads de alto valor e multiplica as margens de lucro de forma exponencial.',
    metricLabel: 'Fidelidade',
    metricValue: '+85%',
    competitivePosition: 'Preços Premium Autorizados',
    chartState: 'Crescimento Exponencial',
    chartPath: 'M10 100 L100 85 L200 45 L290 10',
    chartEnd: { x: 290, y: 10 },
    consequence: 'A engenharia customizada permite escalar as vendas com custo marginal zero, atraindo o cliente ideal e perpetuando a prosperidade comercial.',
  },
};

export default function HomePage({ initialStep = 0, onBack, onNavigateToBudget, onNavigateToServices }: HomePageProps) {
  const [step, setStep] = useState(initialStep);
  
  // Pop-up states for Liquid Glass capabilities description (Light mode, clean glass)
  const [activePopupIdx, setActivePopupIdx] = useState<number | null>(null);

  // Portfolio active project index for the dynamic native video slider
  const [activeProjectIdx, setActiveProjectIdx] = useState<number>(0);

  // Footer reveal after an additional scroll beyond the final homepage section
  const [isFooterVisible, setIsFooterVisible] = useState(false);

  // Active tab for the dynamic Brand Strategic Blueprint (Step 3)
  const [activeDiagTab, setActiveDiagTab] = useState<PresencePhaseKey>('ascension');
  const activePresencePhase = presencePhases[activeDiagTab];

  // Mouse coordinate tracking for advanced 3D logo parallax depth
  const [mouseOffset, setMouseOffset] = useState({ x: 0, y: 0 });

  // Debouncing locks to make scrolling snappy and instant
  const isAnimatingRef = useRef(false);
  const touchpadHorizontalAccumulator = useRef(0);
  const touchStartY = useRef(0);
  const touchStartX = useRef(0);

  // Checks if the active state requires a dark background
  const isDarkBg = step === 0 || step === 2 || step === 3 || step === 4;
  // Checks if the current visible overlay/view requires dark-mode headers/dots
  const isVisualDark = step === 0 || step === 2 || step === 4;

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      // Create subtle parallax offsets for background elements
      const x = (e.clientX - window.innerWidth / 2) * 0.03;
      const y = (e.clientY - window.innerHeight / 2) * 0.03;
      setMouseOffset({ x, y });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

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

    if (step < 4) {
      lockAnimation();
      setIsFooterVisible(false);
      setStep(step + 1);
      return;
    }

    if (!isFooterVisible) {
      lockAnimation();
      setIsFooterVisible(true);
    }
  };

  const prevStep = () => {
    if (activePopupIdx !== null) return;
    if (isAnimatingRef.current) return;

    if (isFooterVisible) {
      lockAnimation();
      setIsFooterVisible(false);
      return;
    }

    if (step > 0) {
      lockAnimation();
      setStep(step - 1);
    }
  };

  const lockAnimation = () => {
    isAnimatingRef.current = true;
    setTimeout(() => {
      isAnimatingRef.current = false;
    }, 550);
  };

  // Portfolio Slide helpers
  const nextProject = () => {
    if (isAnimatingRef.current) return;
    lockAnimation();
    setActiveProjectIdx((prev) => (prev + 1) % 3);
  };

  const prevProject = () => {
    if (isAnimatingRef.current) return;
    lockAnimation();
    setActiveProjectIdx((prev) => (prev - 1 + 3) % 3);
  };

  // High-End touchpad swipe & vertical scroll state machine
  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      e.preventDefault(); // prevent standard browser viewport scroll jump

      // 1. Detect Sideways/Horizontal Trackpad Gestures (Sideways Touchpad movement)
      if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) {
        if (step !== 2) return; // Slider only lives in Portfólio (Step 2)
        
        touchpadHorizontalAccumulator.current += e.deltaX;
        
        // Threshold to trigger page slide on high-end touchpad swipe
        if (Math.abs(touchpadHorizontalAccumulator.current) > 35) {
          if (touchpadHorizontalAccumulator.current > 0) {
            nextProject();
          } else {
            prevProject();
          }
          touchpadHorizontalAccumulator.current = 0; // Reset accumulator immediately
        }
        return;
      }

      // 2. Vertical Scrolling Gestures (Sections State Transition)
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
  }, [step, activePopupIdx, activeProjectIdx, isFooterVisible]);

  // Section names for the interactive side tracker
  const sectionLabels = ["Início", "Serviços", "Portfólio", "Presença", "Orçamento"];

  // Capabilities details structure for the Liquid Glass Popup Modals
  const capabilitiesData = serviceAreas;

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
    <div 
      className={`relative w-full h-screen bg-white transition-colors duration-300 overflow-hidden select-none ${
        isDarkBg ? 'text-white' : 'text-slate-900'
      }`}
    >

      {/* Independent backdrop prevents slate-blue flashes while sections crossfade. */}
      <AnimatePresence initial={false}>
        {isDarkBg && (
          <motion.div
            key={step === 0 ? 'hero-background-base' : 'dark-section-background-base'}
            className={`absolute inset-0 z-0 pointer-events-none ${
              step === 0 ? 'bg-black' : 'bg-slate-950'
            }`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          />
        )}
      </AnimatePresence>
      
      {/* PERSISTENT FLOATING TRIANGLES */}
      {step !== 0 && (
        <div className="fixed inset-0 z-0 pointer-events-none">
          <FloatingTriangles theme={isDarkBg ? "dark" : "light"} />
        </div>
      )}

      {/* STRICT ELEGANT BLUE AND WHITE radial illumination backdrop */}
      {isDarkBg && step !== 0 && (
        <div 
          className="absolute rounded-full blur-[140px] opacity-45 bg-radial from-sky-500/20 via-sky-400/5 to-transparent shadow-[0_0_200px_rgba(56,189,248,0.1)] pointer-events-none transition-all duration-1000" 
          style={{ 
            width: '700px', 
            height: '700px', 
            top: '50%', 
            left: '50%', 
            transform: 'translate(-50%, -50%)',
            zIndex: 1
          }} 
        />
      )}

      {/* 3D PARALLAX BACKDROP WATERMARK LOGO */}
      {step !== 0 && (
        <motion.div
          className="absolute inset-0 z-0 flex items-center justify-center pointer-events-none select-none overflow-hidden"
          animate={getWatermarkStyle()}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
          <Logo theme={isDarkBg ? "dark" : "light"} glow={false} className="w-96 h-96" />
        </motion.div>
      )}

      {/* TRANSPARENT MINIMALIST HEADER */}
      <header className="fixed top-0 left-0 w-full z-50 px-8 py-6 flex items-center justify-between border-b border-transparent bg-transparent select-none pointer-events-auto">
        {/* Left Side: Brand Logo & Text */}
        <div
          className="flex items-center space-x-3 cursor-pointer"
          onClick={() => {
            setIsFooterVisible(false);
            setStep(0);
          }}
        >
          <Logo theme={isVisualDark ? "dark" : "light"} glow={isVisualDark} className="w-5 h-5" />
          <span className={`text-xs font-black tracking-[0.3em] uppercase ${
            isVisualDark ? 'text-white' : 'text-slate-900'
          }`}>
            AXION
          </span>
        </div>

        {/* Center Side: Index-Style Navigation Links */}
        <nav className="hidden md:flex items-center space-x-8">
          {sectionLabels.map((label, idx) => {
            return (
              <button
                key={idx}
                onClick={() => {
                  if (!isAnimatingRef.current) {
                    lockAnimation();
                    setIsFooterVisible(false);
                    setStep(idx);
                  }
                }}
                className={`text-[8px] font-mono tracking-widest uppercase transition-all duration-300 relative cursor-pointer py-1 focus:outline-none ${
                  step === idx
                    ? isVisualDark ? 'text-white font-extrabold' : 'text-slate-900 font-extrabold'
                    : isVisualDark ? 'text-slate-500 hover:text-slate-300' : 'text-slate-400 hover:text-slate-700'
                }`}
              >
                <span>{label}</span>
                {step === idx && (
                  <motion.div 
                    layoutId="headerUnderline" 
                    className={`absolute bottom-0 left-0 right-0 h-[1.5px] ${
                      isVisualDark ? 'bg-sky-400 shadow-[0_0_8px_rgba(56,189,248,0.5)]' : 'bg-slate-900'
                    }`} 
                  />
                )}
              </button>
            );
          })}
        </nav>

        {/* Right Side: Back to Portal CTA Button */}
        <button
          onClick={onBack}
          className={`flex items-center space-x-2 px-4.5 py-2 rounded-full text-[8px] font-bold tracking-widest uppercase transition-all duration-300 border cursor-pointer select-none focus:outline-none ${
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
                transition={{ duration: 1.15, ease: [0.16, 1, 0.3, 1] }}
              />
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
                <FloatingTriangles theme="dark" variant="hero" />
              </motion.div>

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
                  <p className="max-w-2xl text-[9px] sm:text-[10px] tracking-[0.3em] font-extrabold uppercase text-slate-200 leading-relaxed drop-shadow-[0_2px_12px_rgba(0,0,0,0.7)]">
                    Design Estratégico • Performance Digital • Experiências Memoráveis
                  </p>
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

          {/* STEP 1: CAPACIDADES — CONNECTED AXION ECOSYSTEM */}
          {step === 1 && (
            <motion.div
              key="capabilities-stage"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
              className="absolute inset-x-0 max-w-6xl mx-auto flex flex-col justify-center items-center text-center pointer-events-none w-full px-2 sm:px-4"
            >
              <div className="pointer-events-auto w-full space-y-5 md:space-y-7">
                <div className="text-center space-y-2.5">
                  <span className="text-[9px] font-mono tracking-[0.3em] opacity-40 uppercase">SERVIÇOS</span>
                  <h3 className="mx-auto max-w-3xl text-2xl font-extrabold tracking-[-0.035em] uppercase text-slate-900 sm:text-3xl md:text-4xl">
                    ECOSSISTEMAS DIGITAIS PARA EMPRESAS
                  </h3>

                  <div className="mx-auto flex max-w-xl items-center justify-center gap-2 pt-1 text-[8px] font-bold uppercase tracking-[0.18em] text-slate-500 sm:gap-4 sm:text-[9px] sm:tracking-[0.24em]">
                    <span className="h-px flex-1 bg-gradient-to-r from-transparent to-slate-900/15" />
                    <span>Marketing</span>
                    <span className="font-mono text-sky-600">+</span>
                    <span>Tecnologia</span>
                    <span className="font-mono text-sky-600">+</span>
                    <span>Inteligência Artificial</span>
                    <span className="h-px flex-1 bg-gradient-to-l from-transparent to-slate-900/15" />
                  </div>

                </div>

                <div className="mx-auto grid w-full max-w-6xl grid-cols-2 gap-px overflow-hidden rounded-[24px] border border-slate-900/10 bg-slate-900/10 shadow-[0_24px_70px_rgba(15,23,42,0.08)] lg:grid-cols-3">
                  {capabilitiesData.map((cap, i) => {
                    const Icon = cap.icon;

                    return (
                      <motion.button
                        key={cap.id}
                        type="button"
                        onClick={() => setActivePopupIdx(i)}
                        aria-label={`Explorar ${cap.title}`}
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.45, delay: 0.08 + i * 0.045, ease: [0.16, 1, 0.3, 1] }}
                        whileHover={{ scale: 0.99 }}
                        className="group relative flex min-h-[128px] cursor-pointer flex-col justify-between overflow-hidden bg-white/75 p-4 text-left transition-colors duration-300 hover:bg-white focus-visible:z-10 focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-sky-500 sm:min-h-[156px] sm:p-5 md:min-h-[170px] md:p-6"
                      >
                        <div className="absolute inset-x-0 top-0 h-px origin-left scale-x-0 bg-sky-500 transition-transform duration-500 group-hover:scale-x-100" />
                        <div className="absolute -right-12 -top-12 h-28 w-28 rounded-full bg-sky-300/0 blur-3xl transition-colors duration-500 group-hover:bg-sky-300/20" />

                        <div className="relative z-10 flex items-start justify-between gap-3">
                          <span className="font-mono text-[9px] tracking-[0.2em] text-slate-400">{cap.id}</span>
                          <div className="text-slate-700 transition-transform duration-500 group-hover:-translate-y-0.5 group-hover:translate-x-0.5">
                            <Icon size={20} className="text-slate-800" />
                          </div>
                        </div>

                        <div className="relative z-10 mt-4">
                          <h4 className="max-w-[13rem] text-[10px] font-extrabold uppercase leading-tight tracking-[0.1em] text-slate-900 sm:text-xs">
                            {cap.title}
                          </h4>
                          <p className="mt-2 hidden max-w-[18rem] text-[9px] leading-relaxed text-slate-500 sm:block md:text-[10px]">
                            {cap.desc}
                          </p>
                        </div>

                        <div className="relative z-10 mt-3 flex items-center justify-between text-[8px] font-bold uppercase tracking-[0.16em] text-slate-400 transition-colors group-hover:text-sky-700">
                          <span>{cap.services.length} serviços</span>
                          <ArrowRight size={11} className="transition-transform duration-300 group-hover:translate-x-1" />
                        </div>
                      </motion.button>
                    );
                  })}
                </div>

                <button
                  type="button"
                  onClick={onNavigateToServices}
                  className="group mx-auto flex cursor-pointer items-center gap-2 border-b border-slate-900/15 pb-1 text-[8px] font-extrabold uppercase tracking-[0.22em] text-slate-700 transition-colors duration-300 hover:border-sky-500 hover:text-sky-700 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-sky-500"
                >
                  <span>Explorar serviços</span>
                  <ArrowRight size={10} className="transition-transform duration-300 group-hover:translate-x-1" />
                </button>
              </div>
            </motion.div>
          )}

          {/* STEP 2: IMMERSIVE NATIVE FULLSCREEN SIDE-BY-SIDE VIDEO SLIDER (TOUCHPAD GESTURES CAPABLE) */}
          {(step === 2 || step === 3) && (
            <motion.div
              key="portfolio-stage"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
              className="absolute inset-0 flex flex-col justify-center items-center text-center pointer-events-none w-full max-w-5xl mx-auto px-6"
            >
              <div className="pointer-events-auto space-y-6 w-full relative flex flex-col items-center">
                
                {/* Minimal Elegant Header */}
                <div className="text-center space-y-2">
                  <span className="text-[9px] font-mono tracking-[0.3em] opacity-40 uppercase text-slate-400">SHOWCASE DE PERFORMANCE</span>
                  <h3 className="text-2xl md:text-3xl font-extrabold tracking-tight uppercase text-white leading-none">
                    NOSSO TRABALHO EM AÇÃO
                  </h3>
                  <p className="text-[10px] tracking-widest uppercase text-slate-400 max-w-lg mx-auto">
                    Deslize para o lado no touchpad ou use as setas para explorar o portfólio de websites.
                  </p>
                </div>

                {/* CINEMATIC PANORAMIC SLIDER STAGE */}
                <div className="relative w-full h-[400px] md:h-[450px] flex items-center justify-center overflow-visible mt-4">
                  {portfolioProjects.map((project, idx) => {
                    // Check positional difference from active project
                    const diff = idx - activeProjectIdx;
                    const isActive = idx === activeProjectIdx;
                    
                    // We calculate positional transitions beautifully with physics springs
                    let xTranslation = "0%";
                    let zIndex = 10;
                    let scale = 0.85;
                    let opacity = 0.3;

                    if (isActive) {
                      xTranslation = "0%";
                      zIndex = 30;
                      scale = 1.0;
                      opacity = 1.0;
                    } else if (diff === 1 || (activeProjectIdx === 2 && idx === 0)) {
                      // Next slide peeking on right side
                      xTranslation = "80%";
                      zIndex = 20;
                      scale = 0.84;
                      opacity = 0.35;
                    } else {
                      // Previous slide peeking on left side
                      xTranslation = "-80%";
                      zIndex = 20;
                      scale = 0.84;
                      opacity = 0.35;
                    }

                    return (
                      <motion.div
                        key={project.id}
                        animate={{ 
                          x: xTranslation, 
                          scale: scale, 
                          opacity: opacity,
                          z: isActive ? 0 : -50
                        }}
                        onClick={() => {
                          if (!isActive) {
                            setActiveProjectIdx(idx);
                          }
                        }}
                        transition={{ type: 'spring', stiffness: 220, damping: 25 }}
                        className={`absolute w-full max-w-2xl h-full rounded-3xl border border-white/10 bg-slate-950 overflow-hidden shadow-[0_25px_60px_rgba(0,0,0,0.85)] flex flex-col justify-between p-6 md:p-8 cursor-pointer select-none`}
                        style={{ zIndex }}
                      >
                        {/* Project background media */}
                        {project.backgroundType === 'video' ? (
                          <video
                            src={project.backgroundUrl}
                            autoPlay
                            loop
                            muted
                            playsInline
                            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${
                              isActive ? 'opacity-65' : 'opacity-20'
                            }`}
                          />
                        ) : (
                          <img
                            src={project.backgroundUrl}
                            alt=""
                            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${
                              isActive ? 'opacity-65' : 'opacity-20'
                            }`}
                          />
                        )}

                        {/* Top Gradient for layout overlay clarity */}
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-slate-950/40 z-10 pointer-events-none" />

                        {/* Slide Top: Index & Floating Glass Logo */}
                        <div className="flex justify-between items-start w-full relative z-20">
                          <span className="text-[10px] font-mono tracking-widest text-white/40">PORTFÓLIO</span>
                          
                          {/* Beautiful glassmorphic circular plate showing the logo */}
                          <div className={`p-3 rounded-2xl border bg-slate-950/50 backdrop-blur-md transition-colors duration-300 ${
                            isActive ? 'border-sky-400/40' : 'border-white/10'
                          }`}>
                            <img 
                              src={project.logo} 
                              alt={project.title} 
                              className={`h-7 w-auto object-contain transition-all duration-300 filter ${
                                isActive ? 'brightness-100 drop-shadow-[0_0_10px_rgba(56,189,248,0.5)]' : 'opacity-60'
                              }`}
                              referrerPolicy="no-referrer"
                            />
                          </div>
                        </div>

                        {/* Slide Bottom: Beautifully Clean & Minimalist Title + Single Key Metric Line */}
                        <div className="space-y-1.5 relative z-20 text-left pt-12">
                          <h4 className="text-2xl md:text-3xl font-black text-white tracking-[0.2em] uppercase leading-none">
                            {project.title}
                          </h4>
                          
                          <div className={`flex items-center space-x-2 text-[8px] font-mono tracking-widest text-sky-400 font-bold uppercase transition-all duration-500 ${
                            isActive ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-1'
                          }`}>
                            <span>{project.kpi}</span>
                            <span className="opacity-45">//</span>
                            <span className="text-white/60">{project.result}</span>
                          </div>
                        </div>

                      </motion.div>
                    );
                  })}
                </div>

                {/* Minimal Navigation Controls & Dots */}
                <div className="flex items-center space-x-6 pt-4 relative z-20 pointer-events-auto">
                  <button 
                    onClick={prevProject}
                    className="p-2.5 rounded-full border border-white/10 hover:border-white/30 bg-white/5 text-white/70 hover:text-white hover:scale-105 transition-all cursor-pointer focus:outline-none"
                  >
                    <ChevronLeft size={16} />
                  </button>

                  <div className="flex items-center space-x-2.5">
                    {portfolioProjects.map((_, idx) => (
                      <button
                        key={idx}
                        onClick={() => setActiveProjectIdx(idx)}
                        className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                          activeProjectIdx === idx 
                            ? 'w-6 bg-white shadow-[0_0_10px_rgba(56,189,248,0.5)]' 
                            : 'w-1.5 bg-white/20 hover:bg-white/40'
                        }`}
                      />
                    ))}
                  </div>

                  <button 
                    onClick={nextProject}
                    className="p-2.5 rounded-full border border-white/10 hover:border-white/30 bg-white/5 text-white/70 hover:text-white hover:scale-105 transition-all cursor-pointer focus:outline-none"
                  >
                    <ChevronRight size={16} />
                  </button>
                </div>

              </div>
            </motion.div>
          )}

          {/* STEP 4: THE ROYAL BLUE BUDGET CTA SECTION */}
          {step === 4 && (
            <motion.div
              key="budget-home-cta-stage"
              initial={{ opacity: 0, y: 30 }}
              animate={{
                opacity: isFooterVisible ? 0.28 : 1,
                y: isFooterVisible ? -90 : 0,
                scale: isFooterVisible ? 0.96 : 1,
              }}
              exit={{ opacity: 0, y: -30 }}
              transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
              className="absolute inset-0 flex flex-col justify-center items-center text-center pointer-events-auto w-full max-w-4xl mx-auto px-6 select-none"
            >
              <div className="flex flex-col items-center justify-center space-y-6 max-w-2xl">
                {/* Heading */}
                <h3 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight uppercase text-white leading-tight">
                  PRONTO PARA ELEVAR O SEU PATAMAR DIGITAL?
                </h3>

                {/* Description - Much shorter and punchier */}
                <p className="text-xs sm:text-sm text-slate-300 max-w-lg leading-relaxed font-medium">
                  Estime o investimento ideal para impulsionar a performance digital da sua empresa.
                </p>

                {/* Big Glowing White CTA Button */}
                <div className="pt-4">
                  <motion.button
                    whileHover={{ scale: 1.05, boxShadow: "0 0 25px rgba(255, 255, 255, 0.25)" }}
                    whileTap={{ scale: 0.95 }}
                    onClick={onNavigateToBudget}
                    className="flex items-center space-x-3 px-8 py-4 rounded-full bg-white hover:bg-slate-100 text-slate-950 text-[10px] font-black uppercase tracking-[0.25em] transition-all duration-300 cursor-pointer shadow-lg font-bold"
                  >
                    <span>Pedir Orçamento</span>
                    <ArrowRight size={12} className="text-slate-950" />
                  </motion.button>
                </div>
              </div>
            </motion.div>
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
                    setIsFooterVisible(false);
                    setStep(idx);
                  }
                }}
              />
            </motion.footer>
          )}

        </AnimatePresence>

        {/* STEP 3: EDITORIAL BUSINESS EVOLUTION PRESENCE */}
        <AnimatePresence>
          {step === 3 && (
            <motion.div
              key="brand-optimization-stage"
              initial={{ y: "100%" }}
              animate={{ y: "0%" }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 28, stiffness: 120 }}
              className="fixed inset-0 z-40 bg-white/[0.98] backdrop-blur-xl flex flex-col justify-center items-center overflow-y-auto w-full px-6 py-10 md:px-12 pointer-events-auto"
            >
              {/* Soft watermark background logo */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.025] select-none z-0 overflow-hidden">
                <Logo theme="light" glow={false} className="scale-[4] md:scale-[6]" />
              </div>

              {/* Floating Collapse Trigger */}
              <button 
                onClick={() => setStep(2)}
                className="absolute top-24 right-8 md:right-12 p-2 text-slate-400 hover:text-sky-600 transition-colors cursor-pointer focus:outline-none z-50 flex items-center justify-center"
                title="Voltar ao Portfólio"
              >
                <ChevronDown size={16} className="text-slate-800" />
              </button>

              <div className="space-y-6 w-full max-w-6xl my-auto pt-16 md:pt-12 relative z-10">
                
                {/* Section Header */}
                <div className="grid gap-5 md:grid-cols-12 md:items-end">
                  <div className="md:col-span-7 space-y-3 text-left">
                    <span className="text-[9px] font-mono tracking-[0.32em] uppercase text-sky-600">EVOLUÇÃO & PROSPERIDADE</span>
                    <h3 className="text-3xl md:text-5xl font-black tracking-[-0.04em] uppercase text-slate-950 leading-[0.92]">
                      A ERA DA EVOLUÇÃO TECNOLÓGICA
                    </h3>
                  </div>
                  <p className="md:col-span-5 text-[10px] tracking-[0.12em] uppercase text-slate-500 max-w-lg leading-relaxed md:pb-1 text-left">
                    Clique nas fases abaixo para compreender como a tecnologia dita o ritmo de sobrevivência e prosperidade de qualquer negócio contemporâneo.
                  </p>
                </div>

                {/* Interactive Stepper Navigation */}
                <div className="w-full border-y border-slate-900/10">
                  <div className="grid grid-cols-3 w-full">
                    <button
                      onClick={() => setActiveDiagTab('inertia')}
                      className={`relative flex items-center justify-center space-x-2 px-3 py-4 text-[9px] font-extrabold uppercase tracking-[0.2em] transition-colors cursor-pointer focus:outline-none ${
                        activeDiagTab === 'inertia'
                          ? 'text-sky-600'
                          : 'text-slate-400 hover:text-slate-800'
                      }`}
                    >
                      <span className="opacity-55 font-mono">01.</span>
                      <span>INÉRCIA</span>
                      {activeDiagTab === 'inertia' && <motion.span layoutId="presence-phase-line" className="absolute -bottom-px inset-x-0 h-px bg-sky-500" />}
                    </button>
                    <button
                      onClick={() => setActiveDiagTab('transition')}
                      className={`relative flex items-center justify-center space-x-2 px-3 py-4 text-[9px] font-extrabold uppercase tracking-[0.2em] transition-colors cursor-pointer focus:outline-none ${
                        activeDiagTab === 'transition'
                          ? 'text-sky-600'
                          : 'text-slate-400 hover:text-slate-800'
                      }`}
                    >
                      <span className="opacity-55 font-mono">02.</span>
                      <span>TRANSIÇÃO</span>
                      {activeDiagTab === 'transition' && <motion.span layoutId="presence-phase-line" className="absolute -bottom-px inset-x-0 h-px bg-sky-500" />}
                    </button>
                    <button
                      onClick={() => setActiveDiagTab('ascension')}
                      className={`relative flex items-center justify-center space-x-2 px-3 py-4 text-[9px] font-extrabold uppercase tracking-[0.2em] transition-colors cursor-pointer focus:outline-none ${
                        activeDiagTab === 'ascension'
                          ? 'text-sky-600'
                          : 'text-slate-400 hover:text-slate-800'
                      }`}
                    >
                      <span className="opacity-55 font-mono">03.</span>
                      <span>ASCENSÃO</span>
                      {activeDiagTab === 'ascension' && <motion.span layoutId="presence-phase-line" className="absolute -bottom-px inset-x-0 h-px bg-sky-500" />}
                    </button>
                  </div>
                </div>

                {/* Open editorial composition */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-0 items-stretch w-full text-left border-b border-slate-900/10">
                  
                  {/* Left Column: Poetic Business Narrative */}
                  <motion.div
                    key={`narrative-${activeDiagTab}`}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                    className="lg:col-span-7 flex flex-col justify-between py-8 lg:pr-12 space-y-8"
                  >
                    <div className="space-y-5">
                      <div className="flex items-center space-x-2">
                        <span className="h-px w-8 bg-sky-500" />
                        <span className="text-[8px] font-mono font-bold tracking-[0.2em] uppercase text-sky-600">
                          {activePresencePhase.status}
                        </span>
                        <span className="text-[8px] font-mono text-slate-400 uppercase tracking-widest hidden sm:inline">/ DIRETRIZ DE CRESCIMENTO</span>
                      </div>

                      <h4 className="max-w-2xl text-2xl md:text-4xl font-black text-slate-950 tracking-[-0.035em] leading-[1.02]">
                        {activePresencePhase.title}
                      </h4>

                      <p className="max-w-2xl text-xs md:text-sm text-slate-600 leading-[1.8] font-medium">
                        {activePresencePhase.narrative}
                      </p>
                    </div>

                    {/* Metrics as editorial typography */}
                    <div className="grid grid-cols-2 pt-5 border-t border-slate-900/10">
                      <div className="pr-5">
                        <span className="block text-[8px] font-mono tracking-[0.18em] text-slate-400 uppercase mb-2">MÉTRICA IMPACTADA</span>
                        <span className="block text-[10px] font-bold tracking-[0.18em] text-slate-500 uppercase">{activePresencePhase.metricLabel}</span>
                        <span className="block text-3xl md:text-5xl font-black tracking-[-0.05em] text-sky-600 leading-none mt-1">
                          {activePresencePhase.metricValue}
                        </span>
                      </div>
                      <div className="pl-5 border-l border-slate-900/10 flex flex-col justify-end">
                        <span className="block text-[8px] font-mono tracking-[0.18em] text-slate-400 uppercase mb-2">POSIÇÃO COMPETITIVA</span>
                        <span className="block max-w-[13rem] text-[10px] md:text-xs leading-relaxed font-extrabold tracking-[0.08em] text-slate-800 uppercase">
                          {activePresencePhase.competitivePosition}
                        </span>
                      </div>
                    </div>
                  </motion.div>

                  {/* Right Column: Dynamic Graphical Chart Representing Prosperity Curve */}
                  <motion.div
                    key={`chart-${activeDiagTab}`}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.45 }}
                    className="lg:col-span-5 flex flex-col justify-between py-8 lg:pl-12 lg:border-l border-slate-900/10 text-slate-950 relative"
                  >
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-[8px] font-mono text-slate-400 uppercase tracking-[0.18em]">CURVA DE EVOLUÇÃO DO NEGÓCIO</span>
                        <span className="text-[8px] font-mono font-bold uppercase tracking-[0.16em] text-sky-600">
                          {activePresencePhase.chartState}
                        </span>
                      </div>

                      {/* Interactive Custom SVG Graph */}
                      <div className="relative h-52 md:h-60 w-full overflow-hidden">
                        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 300 120" fill="none" preserveAspectRatio="none">
                          <defs>
                            <linearGradient id="presence-line" x1="0" y1="0" x2="1" y2="0">
                              <stop offset="0%" stopColor="#94a3b8" stopOpacity="0.28" />
                              <stop offset="100%" stopColor="#0ea5e9" />
                            </linearGradient>
                          </defs>
                          <path d="M10 108 H290" stroke="#0f172a" strokeOpacity="0.1" strokeWidth="0.6" vectorEffect="non-scaling-stroke" />
                          <path d="M10 104 V112 M290 104 V112" stroke="#0f172a" strokeOpacity="0.14" strokeWidth="0.6" vectorEffect="non-scaling-stroke" />
                          <motion.path
                            key={`halo-${activeDiagTab}`}
                            d={activePresencePhase.chartPath}
                            stroke="#0ea5e9"
                            strokeWidth="6"
                            strokeOpacity="0.08"
                            vectorEffect="non-scaling-stroke"
                            initial={{ pathLength: 0, opacity: 0 }}
                            animate={{ pathLength: 1, opacity: 1 }}
                            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                          />
                          <motion.path
                            key={activeDiagTab}
                            d={activePresencePhase.chartPath}
                            stroke="url(#presence-line)"
                            strokeWidth="1.5"
                            vectorEffect="non-scaling-stroke"
                            initial={{ pathLength: 0, opacity: 0 }}
                            animate={{ pathLength: 1, opacity: 1 }}
                            transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
                          />
                          <motion.path
                            key={`guide-${activeDiagTab}`}
                            d={`M${activePresencePhase.chartEnd.x} ${activePresencePhase.chartEnd.y + 5} V108`}
                            stroke="#0ea5e9"
                            strokeOpacity="0.18"
                            strokeWidth="0.7"
                            strokeDasharray="2 4"
                            vectorEffect="non-scaling-stroke"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.55, duration: 0.35 }}
                          />
                          <motion.circle
                            key={`point-${activeDiagTab}`}
                            cx={activePresencePhase.chartEnd.x}
                            cy={activePresencePhase.chartEnd.y}
                            r="4"
                            fill="#ffffff"
                            stroke="#0ea5e9"
                            strokeWidth="1.5"
                            vectorEffect="non-scaling-stroke"
                            initial={{ opacity: 0, scale: 0 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.55, duration: 0.3 }}
                          />
                          <motion.circle
                            key={`point-core-${activeDiagTab}`}
                            cx={activePresencePhase.chartEnd.x}
                            cy={activePresencePhase.chartEnd.y}
                            r="1.5"
                            fill="#0ea5e9"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.7, duration: 0.25 }}
                          />
                        </svg>
                        <div className="absolute bottom-0 left-0 text-[7px] font-mono text-slate-400 tracking-[0.2em] uppercase">INÍCIO</div>
                        <div className="absolute bottom-0 right-0 text-[7px] font-mono text-slate-400 tracking-[0.2em] uppercase">FUTURO</div>
                      </div>
                    </div>

                    <div className="space-y-3 pt-5 text-left">
                      <span className="text-[8px] font-mono text-slate-400 uppercase tracking-[0.18em] block">CONSEQUÊNCIAS ESTRATÉGICAS</span>
                      <p className="text-[10px] leading-[1.7] text-slate-600 font-medium uppercase tracking-[0.06em]">
                        {activePresencePhase.consequence}
                      </p>
                    </div>
                  </motion.div>

                </div>

                {/* CALL TO ACTION PARA O QUIZ DE ORÇAMENTO */}
                <div className="flex justify-end relative z-20 pointer-events-auto">
                  <button
                    onClick={onNavigateToBudget}
                    className="group flex items-center space-x-3 py-2 border-b border-slate-900/20 hover:border-sky-500 text-slate-900 hover:text-sky-600 text-[9px] font-black uppercase tracking-[0.25em] transition-colors duration-300 cursor-pointer"
                  >
                    <span>Estimar Meu Orçamento</span>
                    <ArrowRight size={11} className="transition-transform duration-300 group-hover:translate-x-1" />
                  </button>
                </div>

              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* HIGH-END INTERACTIVE SIDE TRACKER */}
        <div className="absolute right-6 top-1/2 -translate-y-1/2 flex flex-col items-end space-y-6 pointer-events-auto z-30">
          {sectionLabels.map((label, idx) => {
            return (
              <button
                key={idx}
                onClick={() => {
                  if (!isAnimatingRef.current) {
                    lockAnimation();
                    setIsFooterVisible(false);
                    setStep(idx);
                  }
                }}
                className="group flex items-center space-x-3 cursor-pointer focus:outline-none text-right"
              >
                <span className={`text-[8px] font-mono font-extrabold tracking-widest uppercase transition-all duration-300 opacity-0 -translate-x-2 group-hover:opacity-60 group-hover:translate-x-0 pr-1 select-none ${
                  isVisualDark 
                    ? 'text-white' 
                    : 'text-slate-800'
                } ${
                  step === idx ? 'opacity-80 translate-x-0' : ''
                }`}>
                  {label}
                </span>
                
                <div className="relative flex items-center justify-center">
                  {step === idx && (
                    <motion.div 
                      className={`absolute w-3.5 h-3.5 rounded-full border ${
                        isVisualDark 
                          ? 'bg-white/10 border-white/10' 
                          : 'bg-slate-900/10 border-slate-900/10'
                      }`}
                      layoutId="activeGlow"
                      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                    />
                  )}
                  <div className={`w-1.5 h-1.5 rounded-full transition-all duration-500 border ${
                    step === idx
                      ? isVisualDark ? 'bg-white border-white scale-125' : 'bg-slate-900 border-slate-900 scale-125' 
                      : isVisualDark ? 'border-white/25 bg-transparent group-hover:border-white/50' : 'border-slate-900/25 bg-transparent group-hover:border-slate-900/50'
                  }`} />
                </div>
              </button>
            );
          })}
        </div>

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

    </div>
  );
}
