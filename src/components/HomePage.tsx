import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ArrowLeft, 
  ArrowRight, 
  Rocket, 
  Globe, 
  Layers, 
  Mail, 
  Sparkles,
  Award,
  TrendingUp,
  Cpu,
  Monitor,
  X,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Phone,
  Linkedin,
  Instagram
} from 'lucide-react';
import Logo from './Logo';
import FloatingTriangles from './FloatingTriangles';

// Type-safe string paths for custom company logos uploaded to assets
const revissantLogo = "/assets/revissant.png";
const auraEventsLogo = "/assets/auraevents.png";
const casasDoBecoLogo = "/assets/casasdobeco.png";

interface HomePageProps {
  theme: 'light' | 'dark';
  onBack: () => void;
  onNavigateToBudget: () => void;
}

export default function HomePage({ theme, onBack, onNavigateToBudget }: HomePageProps) {
  const [step, setStep] = useState(0);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [emailInput, setEmailInput] = useState('');
  
  // Pop-up states for Liquid Glass capabilities description (Light mode, clean glass)
  const [activePopupIdx, setActivePopupIdx] = useState<number | null>(null);

  // Portfolio active project index for the dynamic native video slider
  const [activeProjectIdx, setActiveProjectIdx] = useState<number>(0);

  // Active tab for the dynamic Brand Strategic Blueprint (Step 3)
  const [activeDiagTab, setActiveDiagTab] = useState<'inertia' | 'transition' | 'ascension'>('ascension');

  // Interactive Budget Quiz States
  const [quizStarted, setQuizStarted] = useState(false);
  const [quizLoading, setQuizLoading] = useState(false);
  const [loadingTextIdx, setLoadingTextIdx] = useState(0);
  const [quizStep, setQuizStep] = useState(0); 
  const [quizOwner, setQuizOwner] = useState<string>('');
  const [quizSize, setQuizSize] = useState<string>('');
  const [quizVision, setQuizVision] = useState<string>('');
  const [quizServices, setQuizServices] = useState<string[]>([]);
  const [clientName, setClientName] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [clientMessage, setClientMessage] = useState('');
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [clipboardSuccess, setClipboardSuccess] = useState(false);

  // Mouse coordinate tracking for advanced 3D logo parallax depth
  const [mouseOffset, setMouseOffset] = useState({ x: 0, y: 0 });

  // Debouncing locks to make scrolling snappy and instant
  const isAnimatingRef = useRef(false);
  const touchpadHorizontalAccumulator = useRef(0);
  const touchStartY = useRef(0);
  const touchStartX = useRef(0);

  // Checks if the active state requires a dark background
  const isDarkBg = step === 2 || step === 3 || step === 4;
  // Checks if the current visible overlay/view requires dark-mode headers/dots
  const isVisualDark = step === 2 || step === 4;

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

  const loadingMessages = [
    "A estabelecer ligação segura de alta velocidade...",
    "A carregar o configurador de arquitetura customizada AXION...",
    "A mapear parâmetros de inteligência de negócios corporativos...",
    "A calibrar dados de diagnóstico estratégico em tempo real...",
    "A estruturar ambiente de briefing executivo..."
  ];

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (quizLoading) {
      interval = setInterval(() => {
        setLoadingTextIdx((prev) => (prev + 1) % loadingMessages.length);
      }, 500);
    } else {
      setLoadingTextIdx(0);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [quizLoading]);

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
        baseScale = 3.2;
        baseOpacity = 0.03; // dark bg
        baseY = -120;
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
    setStep((prev) => {
      if (prev < 4) {
        lockAnimation();
        return prev + 1;
      }
      return prev;
    });
  };

  const prevStep = () => {
    if (activePopupIdx !== null) return;
    if (isAnimatingRef.current) return;
    setStep((prev) => {
      if (prev > 0) {
        lockAnimation();
        return prev - 1;
      }
      return prev;
    });
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
  }, [step, activePopupIdx, activeProjectIdx]);

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailInput.trim()) return;
    setIsSubmitted(true);
    setTimeout(() => {
      setEmailInput('');
      setIsSubmitted(false);
    }, 4000);
  };

  const generateMailtoLink = () => {
    const emailTo = "contacto@axion.pt";
    const subject = encodeURIComponent(`AXION // Pedido de Orçamento - ${clientName || 'Cliente'}`);
    
    const body = encodeURIComponent(`Olá equipa AXION,

Gostaria de solicitar um orçamento para o desenvolvimento do ecossistema digital da minha marca. Abaixo estão os detalhes estratégicos do meu projeto recolhidos no portal:

--------------------------------------------------
DIAGNÓSTICO INICIAL (QUIZ):
--------------------------------------------------
1. Perfil do Líder:
   > ${quizOwner}

2. Dimensão da Operação:
   > ${quizSize}

3. Visão Estratégica (5 anos):
   > ${quizVision}

4. Serviços Selecionados:
   ${quizServices.map((service) => `[x] ${service}`).join('\n   ')}

--------------------------------------------------
DADOS DE CONTACTO:
--------------------------------------------------
Nome / Marca: ${clientName}
E-mail: ${clientEmail}
Telefone: ${clientPhone || 'Não facultado'}
Mensagem Adicional: ${clientMessage || 'Nenhuma'}

--------------------------------------------------
Briefing gerado automaticamente pelo portal interativo AXION.
Aguardando contacto estratégico para agendamento de chamada executiva.
`);

    return `mailto:${emailTo}?subject=${subject}&body=${body}`;
  };

  // Section names for the interactive side tracker
  const sectionLabels = ["Início", "Capacidades", "Portfólio", "Presença", "Orçamento"];

  // Capabilities details structure for the Liquid Glass Popup Modals
  const capabilitiesData = [
    {
      icon: <Award size={20} className="text-slate-800" />,
      title: 'Branding',
      desc: 'Criação de identidades visuais marcantes, design de logótipo de alta costura e posicionamento estratégico no mercado digital.',
      longTitle: 'Design de Identidade & Marca de Prestígio',
      longDesc: 'Moldamos a percepção da sua marca a nível profundo. Desde a definição conceptual do tom de voz e valores nucleares, até ao design de logótipos geométricos requintados, paletas de cores de luxo e diretrizes de design completas que asseguram autoridade e reconhecimento instantâneos no ecossistema global.',
      result: 'Resultado: Consistência de marca inabalável e aumento estimado de 40% no valor de percepção do cliente.',
      yOffset: [0, -6, 0],
      floatDuration: 4.0,
      floatDelay: 0.0
    },
    {
      icon: <Monitor size={20} className="text-slate-800" />,
      title: 'Criação de Website',
      desc: 'Desenvolvimento de websites corporativos, landing pages e e-commerces ultra-velozes, interativos e focados na conversão.',
      longTitle: 'Engenharia Web de Alta Performance',
      longDesc: 'Construímos portais corporativos, landing pages de conversão cirúrgica e plataformas e-commerce que combinam interfaces de luxo a 120 FPS com extrema otimização técnica. Código limpo, transições orgânicas e arquitetura SEO-friendly projetada especificamente para transformar cliques em contactos comerciais reais.',
      result: 'Resultado: Carregamento instantâneo (< 1s) e aumento médio de 65% na taxa de conversão direta de visitantes.',
      yOffset: [0, -7, 0],
      floatDuration: 4.5,
      floatDelay: 0.2
    },
    {
      icon: <Globe size={20} className="text-slate-800" />,
      title: 'SEO',
      desc: 'Otimização avançada para motores de busca para garantir as primeiras posições orgânicas e atrair tráfego qualificado.',
      longTitle: 'Otimização de Motores de Busca On & Off-Page',
      longDesc: 'Garantimos que a sua empresa lidere os resultados orgânicos nos motores de busca a longo prazo. Conduzimos uma auditoria técnica de código aprofundada, pesquisa de palavras-chave semânticas de alta intenção comercial, otimização on-page estrutural e campanhas seguras de link-building de alta autoridade.',
      result: 'Resultado: Crescimento exponencial no tráfego qualificado e eliminação progressiva da dependência em anúncios pagos.',
      yOffset: [0, -5, 0],
      floatDuration: 3.8,
      floatDelay: 0.4
    },
    {
      icon: <Cpu size={20} className="text-slate-800" />,
      title: 'Social Media',
      desc: 'Gestão estratégica de redes sociais, direção artística, redação criativa e engajamento autêntico de comunidades.',
      longTitle: 'Gestão de Presença Social & Direção Artística',
      longDesc: 'Damos vida e consistência aos seus canais digitais de comunicação. Desenvolvemos o planeamento estratégico de conteúdo, direção artística de alta fidelidade para posts, escrita criativa altamente persuasiva (copywriting), moderação de interações e relatórios de analítica detalhados para consolidar uma comunidade apaixonada.',
      result: 'Resultado: Aumento imediato do engajamento orgânico (+120%) e fortalecimento do sentimento de pertença da marca.',
      yOffset: [0, -8, 0],
      floatDuration: 4.8,
      floatDelay: 0.1
    },
    {
      icon: <TrendingUp size={20} className="text-slate-800" />,
      title: 'Aumento de Leads',
      desc: 'Funis de vendas avançados e gestão de campanhas de tráfego pago (ROI) focadas em gerar contactos comerciais.',
      longTitle: 'Funis de Conversão & Gestão de Campanhas (ROI)',
      longDesc: 'Modelamos canais previsíveis de captação de clientes. Desenhamos a arquitetura completa de funis de marketing automatizados, fluxos de nutrição de e-mail e orquestramos campanhas de anúncios digitais ultra-segmentadas no Google, Meta, LinkedIn e TikTok focadas no menor Custo por Aquisição (CAC) possível.',
      result: 'Resultado: Fluxo previsível de reuniões de negócio pré-qualificadas agendadas para a sua equipa comercial.',
      yOffset: [0, -6, 0],
      floatDuration: 4.2,
      floatDelay: 0.3
    }
  ];

  // Portfolio projects data featuring official uploaded logos and fast high-end sample looping videos from Google Storage CDN
  const portfolioProjects = [
    {
      id: '01',
      category: 'DESIGN DE INTERFACE & E-COMMERCE',
      title: 'REVISSANT',
      logo: revissantLogo,
      videoUrl: 'https://vjs.zencdn.net/v/oceans.mp4',
      desc: 'Uma experiência de e-commerce de alta joalharia e perfumaria premium com transições orgânicas a 120 FPS e design imersivo sob medida.',
      kpi: '+140% Conversões',
      result: 'Resultado de E-Commerce'
    },
    {
      id: '02',
      category: 'TRÁFEGO PAGO & FUNIS DE CONVERSÃO',
      title: 'AURA EVENTS',
      logo: auraEventsLogo,
      videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
      desc: 'Arquitetura e gestão de campanhas digitais e funis de vendas ultra-segmentados para festivais e conferências corporativas de prestígio internacional.',
      kpi: '-55% Custo por Lead',
      result: 'Melhoria de Retorno sobre Investimento'
    },
    {
      id: '03',
      category: 'REBRANDING & DIREÇÃO ARTÍSTICA',
      title: 'CASAS DO BECO',
      logo: casasDoBecoLogo,
      videoUrl: '/assets/revissantsite.mp4',
      desc: 'Reposicionamento digital e direção de arte completa para uma marca de alojamentos de charme tradicionais portugueses, alinhando a herança clássica com sofisticação contemporânea.',
      kpi: '+300k Alcance Orgânico',
      result: 'Expansão de Autoridade Orgânica'
    }
  ];

  return (
    <div 
      className={`relative w-full h-screen transition-all duration-1000 overflow-hidden select-none ${
        isDarkBg 
          ? 'bg-slate-950 text-white' 
          : 'bg-white text-slate-900'
      }`}
    >
      
      {/* PERSISTENT FLOATING TRIANGLES */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <FloatingTriangles theme={isDarkBg ? "dark" : "light"} />
      </div>

      {/* STRICT ELEGANT BLUE AND WHITE radial illumination backdrop */}
      {isDarkBg && (
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
      <motion.div 
        className="absolute inset-0 z-0 flex items-center justify-center pointer-events-none select-none overflow-hidden"
        animate={getWatermarkStyle()}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      >
        <Logo theme={isDarkBg ? "dark" : "light"} glow={false} className="w-96 h-96" />
      </motion.div>

      {/* TRANSPARENT MINIMALIST HEADER */}
      <header className="fixed top-0 left-0 w-full z-50 px-8 py-6 flex items-center justify-between border-b border-transparent bg-transparent select-none pointer-events-auto">
        {/* Left Side: Brand Logo & Text */}
        <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setStep(0)}>
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
          
          {/* STEP 0: THE CLEAN HERO VIEW */}
          {step === 0 && (
            <motion.div
              key="hero-stage"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
              className="absolute inset-0 flex flex-col justify-center items-center text-center pointer-events-none"
            >
              <h2 className="text-5xl sm:text-7xl md:text-8xl lg:text-[7.5rem] font-black tracking-[0.4em] leading-none select-none text-slate-900 uppercase pl-[0.4em]">
                AXION
              </h2>

              <p className="text-[10px] sm:text-xs tracking-[0.35em] font-extrabold uppercase mt-6 pl-[0.35em] text-slate-700 max-w-2xl leading-relaxed opacity-80">
                Design Estratégico • Performance Digital • Experiências Memoráveis
              </p>

              {/* Scroll guide at bottom */}
              <div className="absolute bottom-12 flex flex-col items-center justify-center space-y-3">
                <span className="text-[9px] tracking-[0.35em] font-extrabold uppercase text-slate-700 pl-[0.35em]">
                  Deslize para Entrar
                </span>
                <div className="w-[1px] h-10 overflow-hidden relative bg-slate-950/10">
                  <motion.div 
                    className="w-full h-1/2 absolute left-0 top-0 bg-slate-950"
                    animate={{ y: ['-100%', '200%'] }}
                    transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
                  />
                </div>
              </div>
            </motion.div>
          )}

          {/* STEP 1: NOSSAS CAPACIDADES WITH ENHANCED LOOP FLOATING AND GLOW PULSATION */}
          {step === 1 && (
            <motion.div
              key="capabilities-stage"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
              className="absolute inset-x-0 max-w-6xl mx-auto flex flex-col justify-center items-center text-center pointer-events-none w-full"
            >
              <div className="pointer-events-auto space-y-8 w-full">
                <div className="text-center space-y-2">
                  <span className="text-[9px] font-mono tracking-[0.3em] opacity-40 uppercase">CAPACIDADES</span>
                  <h3 className="text-3xl md:text-4xl font-extrabold tracking-tight uppercase text-slate-900">
                    O QUE FAZEMOS DE MELHOR
                  </h3>
                  <p className="text-[10px] tracking-widest uppercase text-slate-500 max-w-md mx-auto">
                    Pressione em qualquer competência para descobrir as nossas capacidades integradas.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 max-w-5xl mx-auto w-full">
                  {capabilitiesData.map((cap, i) => (
                    <motion.div 
                      key={i}
                      onClick={() => setActivePopupIdx(i)}
                      className="p-6 rounded-2xl border border-slate-900/5 bg-white/70 hover:bg-white hover:border-slate-900/15 shadow-2xs hover:shadow-md text-left flex flex-col justify-between h-[230px] transition-all duration-300 relative group overflow-hidden cursor-pointer"
                      animate={{ y: cap.yOffset }}
                      transition={{ 
                        duration: cap.floatDuration, 
                        repeat: Infinity, 
                        ease: 'easeInOut', 
                        delay: cap.floatDelay 
                      }}
                      whileHover={{ y: -9 }}
                    >
                      {/* Ambient Loop pulse glow inside each card */}
                      <div className="absolute inset-0 bg-radial from-sky-400/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

                      <div className="space-y-4 relative z-10">
                        <div className="p-2.5 rounded-full bg-slate-50 border border-slate-900/5 group-hover:border-slate-900/20 inline-block transition-colors duration-300">
                          {cap.icon}
                        </div>
                        <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-900 group-hover:text-sky-600 transition-colors duration-300">
                          {cap.title}
                        </h4>
                        <p className="text-[10px] leading-relaxed opacity-75 text-slate-700">
                          {cap.desc}
                        </p>
                      </div>

                      {/* Accent button line */}
                      <div className="text-[8px] font-bold tracking-widest uppercase opacity-40 group-hover:opacity-100 transition-opacity flex items-center space-x-1 mt-2 text-slate-900">
                        <span>Descobrir</span>
                        <ArrowRight size={8} className="transform group-hover:translate-x-0.5 transition-transform" />
                      </div>
                    </motion.div>
                  ))}
                </div>
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
                        {/* High-End Autoplay Website video loop - constantly playing on all slides */}
                        <video 
                          src={project.videoUrl} 
                          autoPlay 
                          loop 
                          muted 
                          playsInline 
                          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${
                            isActive ? 'opacity-65' : 'opacity-20'
                          }`}
                        />

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
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
              className="absolute inset-0 flex flex-col justify-center items-center text-center pointer-events-auto w-full max-w-4xl mx-auto px-6 select-none"
            >
              <div className="flex flex-col items-center justify-center space-y-6 max-w-2xl">
                {/* Visual Accent Badge */}
                <span className="text-[9px] font-mono tracking-[0.3em] text-sky-400 uppercase font-black bg-sky-400/10 px-3.5 py-1.5 rounded-full border border-sky-400/20">
                  INVESTIMENTO DE ALTO IMPACTO
                </span>

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

        {/* STEP 3: INTERACTIVE BRAND COMPARISON A/B STUDIO (SLIDES UP FROM BELOW) */}
        <AnimatePresence>
          {step === 3 && (
            <motion.div
              key="brand-optimization-stage"
              initial={{ y: "100%" }}
              animate={{ y: "0%" }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 28, stiffness: 120 }}
              className="fixed inset-0 z-40 bg-white/95 backdrop-blur-3xl flex flex-col justify-center items-center overflow-y-auto w-full px-6 py-12 md:px-12 pointer-events-auto"
            >
              {/* Soft watermark background logo */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.06] select-none z-0 overflow-hidden">
                <Logo theme="light" glow={false} className="scale-[3.5] md:scale-[5]" />
              </div>

              {/* Floating Collapse Trigger */}
              <button 
                onClick={() => setStep(2)}
                className="absolute top-24 right-8 md:right-12 p-3 rounded-full border border-slate-900/10 hover:border-slate-900/30 bg-white/80 hover:bg-white text-slate-800 hover:scale-105 transition-all cursor-pointer focus:outline-none shadow-xs z-50 flex items-center justify-center"
                title="Voltar ao Portfólio"
              >
                <ChevronDown size={16} className="text-slate-800" />
              </button>

              <div className="space-y-8 w-full max-w-5xl my-auto relative z-10">
                
                {/* Section Header */}
                <div className="text-center space-y-2">
                  <span className="text-[9px] font-mono tracking-[0.3em] opacity-40 uppercase text-slate-500">EVOLUÇÃO & PROSPERIDADE</span>
                  <h3 className="text-2xl md:text-3xl font-extrabold tracking-tight uppercase text-slate-900 leading-none">
                    A ERA DA EVOLUÇÃO TECNOLÓGICA
                  </h3>
                  <p className="text-[10px] tracking-widest uppercase text-slate-500 max-w-xl mx-auto leading-relaxed">
                    Clique nas fases abaixo para compreender como a tecnologia dita o ritmo de sobrevivência e prosperidade de qualquer negócio contemporâneo.
                  </p>
                </div>

                {/* Interactive Stepper Navigation */}
                <div className="flex justify-center">
                  <div className="inline-flex flex-wrap md:flex-nowrap justify-center gap-2 rounded-2xl bg-slate-100 p-1.5 border border-slate-200">
                    <button
                      onClick={() => setActiveDiagTab('inertia')}
                      className={`flex items-center space-x-2 px-5 py-2.5 rounded-xl text-[9px] font-extrabold uppercase tracking-widest transition-all cursor-pointer focus:outline-none ${
                        activeDiagTab === 'inertia'
                          ? 'bg-red-600 text-white shadow-md'
                          : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
                      }`}
                    >
                      <span className="opacity-55 font-mono">01.</span>
                      <span>INÉRCIA</span>
                    </button>
                    <button
                      onClick={() => setActiveDiagTab('transition')}
                      className={`flex items-center space-x-2 px-5 py-2.5 rounded-xl text-[9px] font-extrabold uppercase tracking-widest transition-all cursor-pointer focus:outline-none ${
                        activeDiagTab === 'transition'
                          ? 'bg-amber-500 text-white shadow-md'
                          : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
                      }`}
                    >
                      <span className="opacity-55 font-mono">02.</span>
                      <span>TRANSIÇÃO</span>
                    </button>
                    <button
                      onClick={() => setActiveDiagTab('ascension')}
                      className={`flex items-center space-x-2 px-5 py-2.5 rounded-xl text-[9px] font-extrabold uppercase tracking-widest transition-all cursor-pointer focus:outline-none ${
                        activeDiagTab === 'ascension'
                          ? 'bg-slate-900 text-white shadow-md'
                          : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
                      }`}
                    >
                      <span className="opacity-55 font-mono">03.</span>
                      <span>ASCENSÃO</span>
                    </button>
                  </div>
                </div>

                {/* Content Panel */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch w-full text-left">
                  
                  {/* Left Column: Poetic Business Narrative */}
                  <div className="lg:col-span-7 flex flex-col justify-between p-8 rounded-3xl border border-slate-900/10 bg-white/70 backdrop-blur-md shadow-xs space-y-6">
                    <div className="space-y-4">
                      <div className="flex items-center space-x-2">
                        <span className={`text-[8px] font-mono font-bold tracking-widest px-2.5 py-1 rounded-full uppercase border ${
                          activeDiagTab === 'inertia' ? 'bg-red-50 border-red-100 text-red-600' :
                          activeDiagTab === 'transition' ? 'bg-amber-50 border-amber-100 text-amber-700' :
                          'bg-emerald-50 border-emerald-100 text-emerald-700'
                        }`}>
                          {activeDiagTab === 'inertia' ? "Risco de Estagnação" :
                           activeDiagTab === 'transition' ? "O Limbo do Genérico" :
                           "Liderança de Mercado"}
                        </span>
                        <span className="text-[8px] font-mono text-slate-400 uppercase tracking-widest">DIRETRIZ DE CRESCIMENTO</span>
                      </div>

                      <h4 className="text-lg font-black text-slate-900 uppercase tracking-tight leading-tight">
                        {activeDiagTab === 'inertia' && "O Custo Invisível de Recusar a Evolução"}
                        {activeDiagTab === 'transition' && "Estar Online não é o mesmo que Prosperar"}
                        {activeDiagTab === 'ascension' && "A Tecnologia como o Maior Ativo de Escala"}
                      </h4>

                      <p className="text-xs text-slate-600 leading-relaxed font-medium">
                        {activeDiagTab === 'inertia' && (
                          <>
                            Negócios que operam de forma puramente analógica ou com portais desatualizados estão a <strong className="text-red-600 underline decoration-red-200">perder relevância a cada segundo</strong>. Ignorar a modernização digital não poupa recursos; drena silenciosamente a autoridade da marca. Sem um ecossistema tecnológico refinado, a sua empresa cede espaço precioso a concorrentes modernos e torna-se invisível para o cliente qualificado.
                          </>
                        )}
                        {activeDiagTab === 'transition' && (
                          <>
                            A maioria dos negócios comete o erro de se digitalizar utilizando <strong className="text-amber-600">templates genéricos, criadores de páginas pesados e soluções baratas</strong>. Isso cria uma presença estagnada que sobrevive no ruído da mediocridade. Sem performance instantânea e design que respira prestígio, o cliente entra, frustra-se com a lentidão e abandona o site. É o limbo do investimento desperdiçado.
                          </>
                        )}
                        {activeDiagTab === 'ascension' && (
                          <>
                            Para prosperar, o seu negócio precisa de adotar a <strong className="text-emerald-700 font-extrabold">engenharia digital de elite</strong>. Portais desenvolvidos sob medida que carregam em menos de 0.8s, micro-interações fluidas e uma narrativa de luxo estabelecem autoridade automática. A tecnologia avançada não é apenas uma ferramenta — é o funil que atrai leads de alto valor e multiplica as margens de lucro de forma exponencial.
                          </>
                        )}
                      </p>
                    </div>

                    {/* Highly Interactive Micro-Insight Buttons */}
                    <div className="grid grid-cols-2 gap-3 pt-4 border-t border-slate-100">
                      <div className="p-4 rounded-2xl bg-slate-50 border border-slate-900/5">
                        <span className="block text-[8px] font-mono tracking-wider text-slate-400 uppercase mb-1">MÉTRICA IMPACTADA</span>
                        <span className="block text-sm font-black text-slate-800 uppercase">
                          {activeDiagTab === 'inertia' ? "Retenção: -65%" :
                           activeDiagTab === 'transition' ? "Abandono: 75%" :
                           "Fidelidade: +85%"}
                        </span>
                      </div>
                      <div className="p-4 rounded-2xl bg-slate-50 border border-slate-900/5">
                        <span className="block text-[8px] font-mono tracking-wider text-slate-400 uppercase mb-1">POSIÇÃO COMPETITIVA</span>
                        <span className="block text-[10px] font-extrabold text-slate-800 uppercase">
                          {activeDiagTab === 'inertia' ? "Vulnerabilidade Máxima" :
                           activeDiagTab === 'transition' ? "Margens Comprimidas" :
                           "Preços Premium Autorizados"}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Right Column: Dynamic Graphical Chart Representing Prosperity Curve */}
                  <div className="lg:col-span-5 flex flex-col justify-between p-8 rounded-3xl border border-slate-900/10 bg-slate-950 text-white relative overflow-hidden">
                    <div className="absolute -left-20 -bottom-20 w-48 h-48 rounded-full bg-sky-500/10 blur-3xl pointer-events-none" />
                    
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-[8px] font-mono text-slate-500 uppercase tracking-widest">CURVA DE EVOLUÇÃO DO NEGÓCIO</span>
                        <span className={`text-[8px] font-mono font-bold uppercase tracking-widest ${
                          activeDiagTab === 'inertia' ? 'text-red-400 animate-pulse' :
                          activeDiagTab === 'transition' ? 'text-amber-400' :
                          'text-emerald-400 font-black'
                        }`}>
                          {activeDiagTab === 'inertia' && "Fase Crítica"}
                          {activeDiagTab === 'transition' && "Platô Estagnado"}
                          {activeDiagTab === 'ascension' && "Crescimento Exponencial"}
                        </span>
                      </div>

                      {/* Interactive Custom SVG Graph */}
                      <div className="relative h-28 w-full flex items-end justify-center py-2 bg-white/5 rounded-2xl border border-white/5 overflow-hidden">
                        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 300 120" fill="none" preserveAspectRatio="none">
                          {activeDiagTab === 'inertia' && (
                            <>
                              <path d="M10 20 L100 45 L200 80 L290 105" stroke="#ef4444" strokeWidth="2.5" strokeDasharray="4 4" />
                              <circle cx="290" cy="105" r="5" fill="#ef4444" className="animate-ping" />
                              <circle cx="290" cy="105" r="4" fill="#ef4444" />
                            </>
                          )}
                          {activeDiagTab === 'transition' && (
                            <>
                              <path d="M10 80 L100 82 L200 78 L290 81" stroke="#f59e0b" strokeWidth="2.5" />
                              <circle cx="290" cy="81" r="5" fill="#f59e0b" />
                            </>
                          )}
                          {activeDiagTab === 'ascension' && (
                            <>
                              <path d="M10 100 L100 85 L200 45 L290 10" stroke="#10b981" strokeWidth="3" className="stroke-emerald-400" />
                              <circle cx="290" cy="10" r="6" fill="#10b981" className="animate-pulse" />
                              <circle cx="290" cy="10" r="4" fill="#10b981" />
                            </>
                          )}
                        </svg>
                        <div className="absolute bottom-2 left-4 text-[8px] font-mono text-slate-500 uppercase">INÍCIO</div>
                        <div className="absolute bottom-2 right-4 text-[8px] font-mono text-slate-500 uppercase">FUTURO</div>
                      </div>
                    </div>

                    <div className="space-y-3 pt-6 border-t border-white/10 text-left">
                      <span className="text-[8px] font-mono text-slate-400 uppercase tracking-wider block">CONSEQUÊNCIAS ESTRATÉGICAS</span>
                      <p className="text-[10px] leading-relaxed text-slate-300 font-medium font-mono uppercase">
                        {activeDiagTab === 'inertia' && "Ignorar a tecnologia leva a margens esmagadas e perda gradual de clientela. O negócio fica aprisionado no passado."}
                        {activeDiagTab === 'transition' && "Fórmulas prontas e sites amadores geram desperdício de publicidade e custos elevados de aquisição (CAC)."}
                        {activeDiagTab === 'ascension' && "A engenharia customizada permite escalar as vendas com custo marginal zero, atraindo o cliente ideal e perpetuando a prosperidade comercial."}
                      </p>
                    </div>
                  </div>

                </div>

                {/* CALL TO ACTION PARA O QUIZ DE ORÇAMENTO */}
                <div className="flex justify-center pt-2 relative z-20 pointer-events-auto">
                  <button
                    onClick={onNavigateToBudget}
                    className="flex items-center space-x-2.5 px-8 py-3.5 rounded-full bg-slate-900 hover:bg-sky-600 hover:scale-105 text-white text-[9px] font-black uppercase tracking-[0.25em] transition-all duration-300 cursor-pointer shadow-md shadow-slate-900/10 hover:shadow-sky-500/15"
                  >
                    <span>Estimar Meu Orçamento</span>
                    <ArrowRight size={10} className="text-white" />
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

        {/* TELEMETRY LABELS */}
        <div className={`absolute left-6 bottom-12 text-[8px] font-mono opacity-25 uppercase tracking-widest pointer-events-none hidden md:flex flex-col space-y-1 ${
          isVisualDark ? 'text-white' : 'text-slate-900'
        }`}>
          <span>LAT_GRID // 38.72</span>
          <span>LONG_GRID // -9.13</span>
        </div>

        {/* GLOBAL MINIMALIST FOOTER */}
        <div className={`absolute bottom-6 left-1/2 -translate-x-1/2 text-[8px] font-mono tracking-[0.3em] uppercase z-30 select-none pointer-events-none ${
          isVisualDark ? 'text-slate-600' : 'text-slate-400'
        }`}>
          <span>© 2026 AXION • TECNOLOGIA DE PRESTÍGIO</span>
        </div>

      </div>

      {/* LIQUID GLASS CAPABILITIES POPUP MODAL (Light Theme, high transparency) */}
      <AnimatePresence>
        {activePopupIdx !== null && (
          <motion.div
            key="glass-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-900/15 backdrop-blur-md z-50 flex items-center justify-center p-6 cursor-pointer"
            onClick={() => setActivePopupIdx(null)}
          >
            <motion.div
              initial={{ scale: 0.95, y: 15, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.95, y: 15, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 380, damping: 28 }}
              className="relative w-full max-w-lg rounded-3xl border border-white/50 bg-white/40 backdrop-blur-2xl p-8 md:p-10 shadow-[0_25px_60px_rgba(15,23,42,0.12)] cursor-default overflow-hidden text-left"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="absolute -right-20 -top-20 w-48 h-48 rounded-full bg-sky-200/20 blur-2xl pointer-events-none" />
              <div className="absolute -left-20 -bottom-20 w-48 h-48 rounded-full bg-indigo-200/15 blur-2xl pointer-events-none" />

              <button
                onClick={() => setActivePopupIdx(null)}
                className="absolute top-6 right-6 p-1.5 rounded-full border border-slate-900/5 hover:border-slate-900/15 bg-white/60 hover:bg-white text-slate-800 transition-all shadow-2xs cursor-pointer focus:outline-none"
              >
                <X size={14} />
              </button>

              <div className="space-y-4">
                <span className="text-[9px] font-mono tracking-[0.25em] text-slate-500 uppercase block">
                  CAPACIDADES // 02_{activePopupIdx + 1}
                </span>

                <div className="flex items-center space-x-3">
                  <div className="p-3 rounded-full bg-white/80 border border-slate-900/5 shadow-2xs">
                    {capabilitiesData[activePopupIdx].icon}
                  </div>
                  <h4 className="text-lg md:text-xl font-extrabold tracking-tight text-slate-900 leading-none">
                    {capabilitiesData[activePopupIdx].longTitle}
                  </h4>
                </div>

                <div className="h-[1px] w-full bg-slate-900/5" />

                <p className="text-xs md:text-sm leading-relaxed text-slate-700 font-medium">
                  {capabilitiesData[activePopupIdx].longDesc}
                </p>

                <div className="p-4 rounded-xl border border-white/60 bg-white/50 backdrop-blur-xs text-left">
                  <p className="text-[10px] md:text-xs font-bold uppercase tracking-wider text-sky-700">
                    {capabilitiesData[activePopupIdx].result}
                  </p>
                </div>

                <div className="pt-2 flex justify-between items-center text-[8px] font-mono text-slate-400 uppercase">
                  <span>AXION STRATEGY GROUP</span>
                  <span>PRESTÍGIO & PERFORMANCE</span>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
