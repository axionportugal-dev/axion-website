import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'motion/react';
import { 
  ArrowLeft, 
  ArrowRight, 
  ChevronLeft, 
  Sparkles,
  Mail, 
  Layers, 
  Phone, 
  Linkedin, 
  Instagram, 
  Globe,
  ChevronDown,
  User,
  Users,
  Building,
  Shield,
  Activity,
  Award,
  Target,
  Euro,
  CheckCircle2
} from 'lucide-react';
import Logo from './Logo';
import FloatingTriangles from './FloatingTriangles';
import { serviceAreas } from '../data/services';

interface BudgetPageProps {
  onBackToHome: () => void;
}

const TOTAL_QUIZ_STEPS = 7;

const roleOptions = [
  { label: 'CEO / Fundador', icon: Award, grid: 'md:col-span-7' },
  { label: 'Direção / Management', icon: Shield, grid: 'md:col-span-5' },
  { label: 'Marketing / Comunicação', icon: Activity, grid: 'md:col-span-5' },
  { label: 'Comercial / Vendas', icon: Target, grid: 'md:col-span-7' },
  { label: 'Colaborador', icon: User, grid: 'md:col-span-7' },
  { label: 'Outro', icon: Users, grid: 'md:col-span-5' },
];

const objectiveOptions = [
  'Gerar mais leads e oportunidades',
  'Aumentar vendas',
  'Melhorar a presença digital',
  'Criar ou renovar um produto digital',
  'Automatizar processos internos',
  'Melhorar a gestão de leads e clientes',
  'Integrar Inteligência Artificial no negócio',
  'Reforçar ou reposicionar a marca',
  'Ainda não tenho o objetivo totalmente definido',
];

const budgetOptions = [
  'Até 1.000 €',
  '1.000 € – 2.500 €',
  '2.500 € – 5.000 €',
  '5.000 € – 10.000 €',
  'Mais de 10.000 €',
  'Ainda não tenho um budget definido',
];

const budgetServiceAreas = serviceAreas.map((service) => ({
  id: service.id,
  title: service.title,
  desc: service.desc,
  serviceCount: service.services.length,
  icon: service.icon,
}));

const quizStepVariants = {
  enter: ({ direction, reduced }: { direction: number; reduced: boolean }) => ({
    opacity: 0,
    x: reduced ? 0 : direction * 24,
  }),
  center: {
    opacity: 1,
    x: 0,
  },
  exit: ({ direction, reduced }: { direction: number; reduced: boolean }) => ({
    opacity: 0,
    x: reduced ? 0 : direction * -18,
  }),
};

export default function BudgetPage({ onBackToHome }: BudgetPageProps) {
  const shouldReduceMotion = useReducedMotion();

  // Screen States: 'loading' | 'quiz'
  const [pageState, setPageState] = useState<'loading' | 'quiz'>('loading');
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [loadingTextIdx, setLoadingTextIdx] = useState(0);
  const [isQuizContentReady, setIsQuizContentReady] = useState(false);
  
  // Quiz Steps: 0 to 6
  const [quizStep, setQuizStep] = useState(0);
  const [indicatorStep, setIndicatorStep] = useState(0);
  const [quizDirection, setQuizDirection] = useState(1);
  const [isCompactViewport, setIsCompactViewport] = useState(false);
  const quizTransitionRef = useRef(false);
  const hasPlayedInitialQuestionRef = useRef(false);

  // Form States
  const [quizOwner, setQuizOwner] = useState<string>('');
  const [quizSize, setQuizSize] = useState<string>('PME em Escala');
  const [quizObjective, setQuizObjective] = useState<string>('');
  const [quizServices, setQuizServices] = useState<string[]>([]);
  const [quizBudget, setQuizBudget] = useState<string>('');
  const [clientName, setClientName] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [clientMessage, setClientMessage] = useState('');
  const [clipboardSuccess, setClipboardSuccess] = useState(false);

  const loadingMessages = [
    'Analisando identidade visual...',
    'Renderizando geometrias 3D...',
    'Sincronizando paleta de cores...',
    'Otimizando transições fluidas...',
    'Inicializando portal Axion...'
  ];

  const goToQuizStep = (nextStep: number) => {
    if (nextStep === quizStep || quizTransitionRef.current) return;

    if (quizStep === 0) {
      hasPlayedInitialQuestionRef.current = true;
    }

    quizTransitionRef.current = true;
    setQuizDirection(nextStep > quizStep ? 1 : -1);
    setQuizStep(nextStep);
  };

  useEffect(() => {
    const mediaQuery = window.matchMedia('(max-width: 639px)');
    const syncViewport = () => setIsCompactViewport(mediaQuery.matches);

    syncViewport();
    mediaQuery.addEventListener('change', syncViewport);
    return () => mediaQuery.removeEventListener('change', syncViewport);
  }, []);

  // Exact progressive loader simulation, on white background
  useEffect(() => {
    if (pageState !== 'loading') return;

    let currentProgress = 0;
    const interval = setInterval(() => {
      const increment = Math.floor(Math.random() * 12) + 6;
      currentProgress = Math.min(100, currentProgress + increment);
      setLoadingProgress(currentProgress);

      const textIdx = Math.min(
        loadingMessages.length - 1,
        Math.floor((currentProgress / 100) * loadingMessages.length)
      );
      setLoadingTextIdx(textIdx);

      if (currentProgress >= 100) {
        clearInterval(interval);
        setTimeout(() => {
          setPageState('quiz');
          setQuizStep(0);
        }, 400);
      }
    }, 120);

    return () => clearInterval(interval);
  }, [pageState]);

  const generateMailtoLink = () => {
    const subject = encodeURIComponent(`Pedido de Orçamento Estratégico - ${clientName}`);
    const body = encodeURIComponent(`Olá equipa AXION,

Gostaria de solicitar um orçamento para o desenvolvimento do ecossistema digital da minha marca. Abaixo estão os detalhes estratégicos do meu projeto recolhidos no portal:

--------------------------------------------------
DIAGNÓSTICO INICIAL (QUIZ):
--------------------------------------------------
1. Papel na Empresa:
   > ${quizOwner}

2. Dimensão da Operação:
   > ${quizSize}

3. Objetivo do Projeto:
   > ${quizObjective}

4. Áreas de Serviço Selecionadas:
   ${quizServices.map((service) => `[x] ${service}`).join('\n   ')}

5. Budget Previsto:
   > ${quizBudget}

--------------------------------------------------
DADOS DE CONTACTO:
--------------------------------------------------
Nome / Marca: ${clientName}
E-mail: ${clientEmail}
Telefone: ${clientPhone || 'Não facultado'}
Mensagem Adicional: ${clientMessage || 'Nenhuma'}

--------------------------------------------------
Briefing gerado automaticamente pelo portal interativo AXION.`);

    return `mailto:geral@axion.pt?subject=${subject}&body=${body}`;
  };

  // Team size options
  const teamSizeOptions = [
    { label: "Solopreneur", value: "Solopreneur", icon: User },
    { label: "Micro-equipa", value: "Micro-equipa", icon: Users },
    { label: "PME em Escala", value: "PME em Escala", icon: Building },
    { label: "Grande Corporação", value: "Grande Corporação", icon: Activity }
  ];

  const currentSizeIndex = teamSizeOptions.findIndex(o => o.value === quizSize) !== -1 
    ? teamSizeOptions.findIndex(o => o.value === quizSize) 
    : 2;

  const isInitialQuestionEntrance = !hasPlayedInitialQuestionRef.current;
  const stagedEntrance = (delay: number) => ({
    initial: { opacity: 0, y: shouldReduceMotion ? 0 : 10 },
    animate: { opacity: 1, y: 0 },
    transition: {
      duration: shouldReduceMotion ? 0.15 : 0.32,
      delay: shouldReduceMotion ? 0 : delay,
      ease: 'easeOut' as const,
    },
  });
  const fadedEntrance = (delay: number) => ({
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    transition: {
      duration: shouldReduceMotion ? 0.15 : 0.3,
      delay: shouldReduceMotion ? 0 : delay,
      ease: 'easeOut' as const,
    },
  });

  return (
    <div className={`min-h-screen w-full flex flex-col items-center justify-between relative overflow-x-hidden selection:bg-sky-400/30 ${
      pageState === 'quiz'
        ? 'bg-gradient-to-br from-white via-slate-50 to-sky-100/70 text-slate-950'
        : 'bg-slate-950 text-white'
    }`}>
      <div
        className="fixed inset-0 pointer-events-none opacity-70"
        style={{
          backgroundImage: 'linear-gradient(rgba(148,163,184,0.035) 1px, transparent 1px), linear-gradient(90deg, rgba(148,163,184,0.035) 1px, transparent 1px)',
          backgroundSize: '52px 52px',
          maskImage: 'radial-gradient(circle at 50% 42%, black 15%, transparent 72%)',
        }}
      />
      <div className="fixed left-1/2 top-[-18rem] h-[46rem] w-[46rem] -translate-x-1/2 rounded-full bg-sky-500/15 blur-[150px] pointer-events-none" />
      <div className="fixed -left-32 bottom-10 h-80 w-80 rounded-full bg-blue-600/10 blur-[120px] pointer-events-none" />
      
      {pageState === 'quiz' && (
        <div className="fixed inset-0 opacity-40 pointer-events-none">
          <FloatingTriangles theme="light" />
        </div>
      )}

      {/* HEADER CONTROLS (Back to home page always accessible once loaded) */}
      {pageState === 'quiz' && (
        <header className="w-full z-30 px-5 sm:px-8 py-5 flex items-center justify-between max-w-7xl mx-auto shrink-0 relative border-b border-slate-900/[0.06]">
          <div className="flex items-center space-x-3">
            <Logo theme="light" glow={false} className="w-5 h-5" />
            <span className="text-xs font-black tracking-[0.3em] uppercase text-slate-950">
              AXION • ORÇAMENTO
            </span>
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onBackToHome}
            className="flex items-center space-x-2 px-4 sm:px-5 py-2.5 rounded-full text-[9px] font-bold tracking-widest uppercase transition-all duration-300 border border-slate-900/10 hover:border-sky-500/50 bg-white/50 hover:bg-sky-50 text-slate-600 hover:text-sky-800 cursor-pointer select-none focus:outline-none backdrop-blur-md"
            title="Regressar à Página Inicial"
          >
            <ArrowLeft size={11} />
            <span>Voltar ao Início</span>
          </motion.button>
        </header>
      )}

      {/* MAIN SCREEN CANVAS */}
      <main className="w-full flex-1 flex flex-col justify-center items-center px-4 sm:px-6 relative z-10 max-w-[90rem] mx-auto py-8 md:py-12">
        <AnimatePresence mode="wait">
          
          {/* LOADER: WHITE BACKGROUND STATE */}
          {pageState === 'loading' && (
            <motion.div
              key="budget-page-loader"
              initial={{ opacity: 1 }}
              exit={shouldReduceMotion
                ? { opacity: 0 }
                : { opacity: 0, scale: 1.025, filter: 'blur(8px)' }}
              transition={{ duration: shouldReduceMotion ? 0.2 : 0.7, ease: [0.16, 1, 0.3, 1] }}
              className="fixed inset-0 z-50 flex min-h-screen w-full flex-col items-center justify-center bg-slate-950 px-6 py-20 text-center"
            >
              <motion.div
                className="relative mb-10"
                animate={shouldReduceMotion
                  ? undefined
                  : { scale: [1, 1.025, 1], y: [0, -4, 0] }}
                transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
              >
                <div className="absolute inset-0 rounded-full bg-sky-400/20 blur-3xl scale-150" />
                <Logo
                  theme="dark"
                  className="relative h-48 w-48 max-h-[42vw] max-w-[42vw] sm:h-64 sm:w-64 md:h-72 md:w-72"
                />
              </motion.div>
              {/* Minimalist Percentage Label */}
              <motion.div 
                className="text-[10px] tracking-[0.35em] font-bold uppercase mb-4 text-sky-300 font-mono"
                animate={{ opacity: [0.6, 1, 0.6] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
              >
                CARREGANDO • {loadingProgress}%
              </motion.div>

              {/* Ultra-thin Minimalist 1px Line Loader */}
              <div className="w-56 h-[1px] relative overflow-hidden mb-6 bg-white/10">
                <motion.div 
                  className="h-full absolute left-0 top-0 bg-sky-400 shadow-[0_0_12px_rgba(56,189,248,0.9)]"
                  initial={{ width: '0%' }}
                  animate={{ width: `${loadingProgress}%` }}
                  transition={{ ease: 'easeOut', duration: 0.1 }}
                />
              </div>

              {/* Loader Subtitle */}
              <div className="h-6">
                <p className="text-[9px] font-mono tracking-[0.15em] uppercase opacity-75 text-slate-500 font-bold">
                  {loadingMessages[loadingTextIdx]}
                </p>
              </div>
            </motion.div>
          )}

          {/* FORM: ACTIVE QUIZ IN BEAUTIFUL GRADIENT STATE */}
          {pageState === 'quiz' && (
            <motion.div
              key="budget-page-quiz"
              initial={{ opacity: 1 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.2 }}
              onAnimationComplete={() => setIsQuizContentReady(true)}
              className="w-full max-w-6xl mx-auto"
            >
              <div className="w-full min-h-[calc(100vh-9rem)] px-2 sm:px-8 md:px-12 relative z-10 text-slate-900 flex flex-col justify-center space-y-8 select-none">
                <div className="absolute inset-x-12 top-0 h-px bg-gradient-to-r from-transparent via-sky-400/50 to-transparent" />
                <div className="absolute -right-24 -top-24 h-56 w-56 rounded-full bg-sky-200/30 blur-3xl pointer-events-none" />
                
                {/* Reset or start over shortcut */}
                <button
                  onClick={() => {
                    goToQuizStep(0);
                    setQuizOwner('');
                    setQuizObjective('');
                    setQuizServices([]);
                    setQuizBudget('');
                    setClientName('');
                    setClientEmail('');
                    setClientPhone('');
                    setClientMessage('');
                  }}
                  className="absolute top-4 right-4 p-2.5 rounded-full border border-slate-200/80 bg-white/70 backdrop-blur-md text-slate-400 hover:text-sky-700 hover:border-sky-300 hover:bg-sky-50 transition-all cursor-pointer focus:outline-none z-10"
                  title="Reiniciar Questionário"
                >
                  <ChevronDown size={14} className="rotate-180" />
                </button>

                {/* Subtitle / Header */}
                <motion.div
                  initial={{ opacity: 0, y: shouldReduceMotion ? 0 : -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: shouldReduceMotion ? 0.15 : 0.3, delay: shouldReduceMotion ? 0 : 0.86 }}
                  className="flex items-end justify-between gap-6 pt-3 relative z-[1]"
                >
                  <div className="text-left">
                    <span className="text-3xl md:text-5xl font-black tracking-[-0.06em] text-sky-600 tabular-nums">
                      {(indicatorStep + 1).toString().padStart(2, '0')}
                      <span className="mx-2 text-sky-500/40">/</span>
                      <span className="text-slate-300">{TOTAL_QUIZ_STEPS.toString().padStart(2, '0')}</span>
                    </span>
                    <p className="mt-2 text-[8px] md:text-[9px] text-sky-700 uppercase tracking-[0.26em] font-mono font-black">
                      Alinhamento estratégico AXION
                    </p>
                  </div>
                </motion.div>

                {/* Micro Steps progress tracker */}
                <motion.div
                  initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: shouldReduceMotion ? 0.15 : 0.3, delay: shouldReduceMotion ? 0 : 0.92 }}
                  className="w-full max-w-xl mx-auto flex flex-col items-center space-y-2"
                >
                  <div className="w-full bg-slate-100 h-[2px] rounded-full overflow-hidden relative">
                    <motion.div 
                      className="h-full bg-gradient-to-r from-sky-500 to-blue-600 shadow-[0_0_10px_rgba(14,165,233,0.35)]"
                      initial={{ width: "0%" }}
                      animate={{ width: `${((indicatorStep + 1) / TOTAL_QUIZ_STEPS) * 100}%` }}
                      transition={{ duration: 0.3 }}
                    />
                  </div>
                  <span className="text-[8px] font-mono tracking-[0.22em] uppercase text-slate-400 font-extrabold">
                    {Math.round(((indicatorStep + 1) / TOTAL_QUIZ_STEPS) * 100)}% concluído
                  </span>
                </motion.div>

                {/* QUESTIONS CARDS ENGINE */}
                <div className="w-full flex items-center justify-center min-h-[58vh] py-6 md:py-10 relative z-[1]">
                  <AnimatePresence
                    mode="wait"
                    custom={{ direction: quizDirection, reduced: Boolean(shouldReduceMotion) }}
                    onExitComplete={() => {
                      quizTransitionRef.current = false;
                      setIndicatorStep(quizStep);
                    }}
                  >

                    {/* STEP 1: ASYMMETRICAL SPOTLIGHT CARDS */}
                    {quizStep === 0 && (
                      <motion.div
                        key="step0"
                        custom={{ direction: quizDirection, reduced: Boolean(shouldReduceMotion) }}
                        variants={quizStepVariants}
                        initial="enter"
                        animate="center"
                        exit="exit"
                        transition={{ duration: shouldReduceMotion ? 0.12 : 0.26, ease: [0.16, 1, 0.3, 1] }}
                        className="w-full space-y-6"
                      >
                        <motion.h4
                          initial={isInitialQuestionEntrance
                            ? {
                                opacity: 0,
                                scale: shouldReduceMotion ? 1 : isCompactViewport ? 1.24 : 1.6,
                                y: shouldReduceMotion ? 0 : isCompactViewport ? 28 : 58,
                              }
                            : { opacity: 0, y: shouldReduceMotion ? 0 : quizDirection * 8 }}
                          animate={{ opacity: 1, scale: 1, y: 0 }}
                          transition={{
                            duration: shouldReduceMotion ? 0.15 : isInitialQuestionEntrance ? 0.78 : 0.3,
                            delay: shouldReduceMotion ? 0 : 0.06,
                            ease: [0.16, 1, 0.3, 1],
                          }}
                          onAnimationComplete={() => {
                            hasPlayedInitialQuestionRef.current = true;
                          }}
                          className="text-2xl sm:text-3xl md:text-4xl font-black uppercase tracking-[-0.025em] text-slate-950 text-center leading-[1.05] max-w-3xl mx-auto"
                        >
                          Qual é o seu papel na empresa?
                        </motion.h4>

                        <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                          {roleOptions.map((option, optionIdx) => {
                            const RoleIcon = option.icon;
                            const isSelected = quizOwner === option.label;

                            return (
                              <motion.div
                                key={option.label}
                                initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 14, scale: shouldReduceMotion ? 1 : 0.99 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                transition={{
                                  duration: shouldReduceMotion ? 0.15 : 0.38,
                                  delay: shouldReduceMotion ? 0 : isInitialQuestionEntrance ? 0.88 + optionIdx * 0.08 : 0.14 + optionIdx * 0.06,
                                  ease: [0.16, 1, 0.3, 1],
                                }}
                                className={option.grid}
                              >
                                <button
                                  type="button"
                                  onClick={() => {
                                    setQuizOwner(option.label);
                                    goToQuizStep(1);
                                  }}
                                  className={`group relative h-full w-full cursor-pointer overflow-hidden rounded-3xl border bg-slate-50/60 p-7 text-center transition-all duration-300 hover:-translate-y-1 hover:border-sky-500/40 hover:bg-sky-50/50 hover:shadow-[0_18px_45px_rgba(15,23,42,0.10)] ${
                                    isSelected
                                      ? 'border-sky-500 bg-sky-500/5 shadow-[0_0_20px_rgba(14,165,233,0.1)]'
                                      : 'border-slate-200'
                                  }`}
                                >
                                  <div className="relative flex items-center justify-center">
                                    <h5 className="w-full px-6 text-center text-xs font-extrabold uppercase tracking-wider text-slate-900">
                                      {option.label}
                                    </h5>
                                    <RoleIcon size={14} className="absolute right-0 shrink-0 text-sky-500" />
                                  </div>
                                </button>
                              </motion.div>
                            );
                          })}
                        </div>
                      </motion.div>
                    )}

                    {/* STEP 2: PREMIUM HORIZONTAL GAUGE SLIDER */}
                    {quizStep === 1 && (
                      <motion.div
                        key="step1"
                        custom={{ direction: quizDirection, reduced: Boolean(shouldReduceMotion) }}
                        variants={quizStepVariants}
                        initial="enter"
                        animate="center"
                        exit="exit"
                        transition={{ duration: shouldReduceMotion ? 0.12 : 0.26, ease: [0.16, 1, 0.3, 1] }}
                        className="w-full space-y-8 flex flex-col"
                      >
                        <motion.h4
                          {...stagedEntrance(0.04)}
                          className="text-2xl sm:text-3xl md:text-4xl font-black uppercase tracking-[-0.025em] text-slate-950 text-center leading-[1.05] max-w-3xl mx-auto"
                        >
                          Qual é a dimensão atual da equipa corporativa?
                        </motion.h4>

                        {/* Analog slider gauge */}
                        <motion.div {...stagedEntrance(0.1)} className="space-y-10 py-6 max-w-2xl mx-auto w-full">
                          <div className="relative w-full h-[6px] bg-slate-200 rounded-full">
                            {/* Filled active portion */}
                            <div 
                              className="absolute top-0 left-0 h-full bg-gradient-to-r from-sky-500 to-blue-600 rounded-full shadow-[0_0_12px_rgba(14,165,233,0.3)] transition-all duration-300"
                              style={{ width: `${(currentSizeIndex / 3) * 100}%` }}
                            />

                            {/* Node points */}
                            <div className="absolute inset-0 flex justify-between items-center px-0">
                              {teamSizeOptions.map((opt, idx) => {
                                const isSelected = idx === currentSizeIndex;
                                return (
                                  <motion.button
                                    key={opt.value}
                                    {...fadedEntrance(0.14 + idx * 0.04)}
                                    onClick={() => setQuizSize(opt.value)}
                                    className="relative -translate-y-[0px] focus:outline-none group cursor-pointer"
                                  >
                                    <div className={`w-5 h-5 rounded-full border-2 transition-all duration-300 flex items-center justify-center ${
                                      isSelected 
                                        ? "bg-white border-sky-500 scale-125 shadow-[0_0_15px_rgba(14,165,233,0.4)]" 
                                        : "bg-slate-100 border-slate-300 hover:border-slate-400 scale-100"
                                    }`}>
                                      <div className={`w-1.5 h-1.5 rounded-full ${isSelected ? 'bg-sky-500' : 'bg-transparent'}`} />
                                    </div>
                                    <span className={`absolute -bottom-8 left-1/2 -translate-x-1/2 text-[9px] font-mono tracking-wider whitespace-nowrap uppercase font-bold transition-colors ${
                                      isSelected ? 'text-sky-600 font-extrabold' : 'text-slate-400 group-hover:text-slate-600'
                                    }`}>
                                      {opt.label}
                                    </span>
                                  </motion.button>
                                );
                              })}
                            </div>
                          </div>
                        </motion.div>

                        {/* Compact active selection indicator */}
                        <motion.div
                          {...stagedEntrance(0.28)}
                          className="relative mx-auto w-full max-w-2xl overflow-hidden rounded-2xl border border-slate-200 bg-white/55 px-5 py-4 text-left shadow-[0_12px_35px_rgba(15,23,42,0.04)] backdrop-blur-xs"
                        >
                          <div className="absolute inset-y-3 left-0 w-px bg-gradient-to-b from-transparent via-sky-500 to-transparent" />
                          <AnimatePresence mode="wait" initial={false}>
                            <motion.div
                              key={teamSizeOptions[currentSizeIndex].value}
                              initial={{ opacity: 0, x: 8 }}
                              animate={{ opacity: 1, x: 0 }}
                              exit={{ opacity: 0, x: -8 }}
                              transition={{ duration: 0.2, ease: 'easeOut' }}
                              className="grid grid-cols-[3.5rem_1fr_3.5rem] items-center"
                            >
                              <div className="shrink-0 rounded-xl border border-sky-100 bg-sky-50 p-2.5 text-sky-600">
                                {React.createElement(teamSizeOptions[currentSizeIndex].icon, { size: 17 })}
                              </div>

                              <div className="min-w-0 px-2">
                                <h5 className="truncate text-center text-xs font-extrabold uppercase tracking-wider text-slate-900">
                                  {teamSizeOptions[currentSizeIndex].label}
                                </h5>
                              </div>

                              <span className="shrink-0 font-mono text-[9px] font-bold tracking-[0.18em] text-slate-400">
                                {(currentSizeIndex + 1).toString().padStart(2, '0')} / {teamSizeOptions.length.toString().padStart(2, '0')}
                              </span>
                            </motion.div>
                          </AnimatePresence>
                        </motion.div>

                        {/* Navigation controls */}
                        <motion.div {...stagedEntrance(0.36)} className="flex items-center justify-between pt-6 border-t border-slate-100 max-w-2xl mx-auto w-full">
                          <button 
                            onClick={() => goToQuizStep(0)}
                            className="flex items-center space-x-1 text-[9px] font-mono tracking-widest text-slate-400 hover:text-slate-900 uppercase cursor-pointer focus:outline-none font-bold"
                          >
                            <ChevronLeft size={10} />
                            <span>Voltar</span>
                          </button>
                          <button
                            onClick={() => goToQuizStep(2)}
                            className="flex items-center space-x-1.5 px-6 py-2.5 rounded-full bg-slate-900 text-white hover:bg-sky-600 hover:scale-[1.03] text-[9px] font-black uppercase tracking-widest transition-all cursor-pointer shadow-md"
                          >
                            <span>Avançar</span>
                            <ArrowRight size={9} />
                          </button>
                        </motion.div>
                      </motion.div>
                    )}

                    {/* STEP 3: PROJECT OBJECTIVE */}
                    {quizStep === 2 && (
                      <motion.div
                        key="step2"
                        custom={{ direction: quizDirection, reduced: Boolean(shouldReduceMotion) }}
                        variants={quizStepVariants}
                        initial="enter"
                        animate="center"
                        exit="exit"
                        transition={{ duration: shouldReduceMotion ? 0.12 : 0.26, ease: [0.16, 1, 0.3, 1] }}
                        className="w-full space-y-6"
                      >
                        <motion.h4
                          {...stagedEntrance(0.04)}
                          className="text-2xl sm:text-3xl md:text-4xl font-black uppercase tracking-[-0.025em] text-slate-950 text-center leading-[1.05] max-w-3xl mx-auto"
                        >
                          O que pretende alcançar com este projeto?
                        </motion.h4>

                        <motion.div {...stagedEntrance(0.1)} className="mx-auto grid w-full max-w-4xl grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                          {objectiveOptions.map((objective, objectiveIdx) => {
                            const isSelected = quizObjective === objective;
                            return (
                              <motion.button
                                type="button"
                                key={objective}
                                {...fadedEntrance(0.14 + objectiveIdx * 0.035)}
                                aria-pressed={isSelected}
                                onClick={() => setQuizObjective(objective)}
                                className={`relative flex min-h-16 cursor-pointer items-center justify-center rounded-3xl border p-4 text-center transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_18px_45px_rgba(15,23,42,0.10)] ${
                                  isSelected 
                                    ? "border-sky-500 bg-sky-500/5 shadow-[0_0_20px_rgba(14,165,233,0.1)] scale-[1.02]" 
                                    : "border-slate-200 bg-slate-50/60 hover:border-slate-300 hover:bg-slate-50"
                                }`}
                              >
                                <span className={`block text-center text-[9px] font-extrabold uppercase leading-relaxed tracking-wider transition-colors ${
                                  isSelected ? 'text-sky-700' : 'text-slate-600'
                                }`}>
                                  {objective}
                                </span>
                              </motion.button>
                            );
                          })}
                        </motion.div>

                        {/* Navigation controls */}
                        <motion.div {...stagedEntrance(0.36)} className="flex items-center justify-between pt-6 border-t border-slate-100 max-w-3xl mx-auto w-full">
                          <button 
                            onClick={() => goToQuizStep(1)}
                            className="flex items-center space-x-1 text-[9px] font-mono tracking-widest text-slate-400 hover:text-slate-900 uppercase cursor-pointer focus:outline-none font-bold"
                          >
                            <ChevronLeft size={10} />
                            <span>Voltar</span>
                          </button>
                          <button
                            disabled={!quizObjective}
                            onClick={() => goToQuizStep(3)}
                            className="flex items-center space-x-1.5 px-6 py-2.5 rounded-full bg-slate-900 text-white hover:bg-sky-600 hover:scale-[1.03] text-[9px] font-black uppercase tracking-widest transition-all cursor-pointer disabled:opacity-35 disabled:cursor-not-allowed shadow-md"
                          >
                            <span>Avançar</span>
                            <ArrowRight size={9} />
                          </button>
                        </motion.div>
                      </motion.div>
                    )}

                    {/* STEP 4: AXION SERVICE AREAS */}
                    {quizStep === 3 && (
                      <motion.div
                        key="step3"
                        custom={{ direction: quizDirection, reduced: Boolean(shouldReduceMotion) }}
                        variants={quizStepVariants}
                        initial="enter"
                        animate="center"
                        exit="exit"
                        transition={{ duration: shouldReduceMotion ? 0.12 : 0.26, ease: [0.16, 1, 0.3, 1] }}
                        className="w-full space-y-6"
                      >
                        <div className="space-y-2 text-center">
                          <motion.h4 {...stagedEntrance(0.04)} className="mx-auto max-w-3xl text-2xl font-black uppercase leading-[1.05] tracking-[-0.025em] text-slate-950 sm:text-3xl md:text-4xl">
                            Que áreas pretende integrar no seu ecossistema digital?
                          </motion.h4>
                          <motion.p {...stagedEntrance(0.08)} className="font-mono text-[8px] font-bold uppercase tracking-[0.2em] text-slate-400">
                            Pode selecionar várias áreas
                          </motion.p>
                        </div>

                        <motion.div {...stagedEntrance(0.16)} className="mx-auto grid w-full max-w-4xl grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                          {budgetServiceAreas.map((serv, serviceIdx) => {
                            const isSelected = quizServices.includes(serv.title);
                            const IconC = serv.icon;
                            return (
                              <motion.button
                                type="button"
                                key={serv.title}
                                {...fadedEntrance(0.2 + serviceIdx * 0.04)}
                                aria-pressed={isSelected}
                                onClick={() => {
                                  if (isSelected) {
                                    setQuizServices(quizServices.filter(s => s !== serv.title));
                                  } else {
                                    setQuizServices([...quizServices, serv.title]);
                                  }
                                }}
                                className={`group relative flex min-h-[160px] cursor-pointer select-none flex-col overflow-hidden rounded-3xl border p-5 text-center transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_18px_45px_rgba(15,23,42,0.10)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-500 ${
                                  isSelected 
                                    ? "border-sky-500 bg-sky-500/5 shadow-[0_0_15px_rgba(14,165,233,0.08)] scale-[1.01]" 
                                    : "border-slate-200 bg-slate-50/60 hover:border-sky-400 hover:bg-sky-500/2"
                                }`}
                              >
                                <div className="mb-4 flex items-center justify-between">
                                  <div className={`p-2 rounded-lg ${isSelected ? 'bg-sky-100 text-sky-600' : 'bg-slate-100 text-slate-500'}`}>
                                    <IconC size={14} />
                                  </div>
                                  <div className={`w-4 h-4 rounded-sm border flex items-center justify-center transition-all ${
                                    isSelected ? 'border-sky-500 bg-sky-500 text-white' : 'border-slate-300 bg-white'
                                  }`}>
                                    {isSelected && <span className="text-[10px] font-black">✓</span>}
                                  </div>
                                </div>

                                <div className="flex items-start justify-center gap-2 text-center">
                                  <span className="mt-0.5 shrink-0 font-mono text-[8px] font-bold tracking-wider text-sky-600">
                                    {serv.id}
                                  </span>
                                  <h5 className="text-center text-[10px] font-extrabold uppercase leading-snug tracking-wider text-slate-900 sm:text-[11px]">
                                    {serv.title}
                                  </h5>
                                </div>
                                <p className="mx-auto mt-2 text-center text-[9px] font-medium leading-relaxed text-slate-500">
                                  {serv.desc}
                                </p>
                                <span className="mt-auto block pt-3 text-center font-mono text-[8px] font-black uppercase tracking-widest text-sky-600">
                                  {serv.serviceCount} serviços
                                </span>
                              </motion.button>
                            );
                          })}
                        </motion.div>

                        {/* Navigation controls */}
                        <motion.div {...stagedEntrance(0.48)} className="flex items-center justify-between pt-6 border-t border-slate-100 max-w-3xl mx-auto w-full">
                          <button 
                            onClick={() => goToQuizStep(2)}
                            className="flex items-center space-x-1 text-[9px] font-mono tracking-widest text-slate-400 hover:text-slate-900 uppercase cursor-pointer focus:outline-none font-bold"
                          >
                            <ChevronLeft size={10} />
                            <span>Voltar</span>
                          </button>
                          <button
                            disabled={quizServices.length === 0}
                            onClick={() => goToQuizStep(4)}
                            className="flex items-center space-x-1.5 px-6 py-2.5 rounded-full bg-slate-900 text-white hover:bg-sky-600 hover:scale-[1.03] text-[9px] font-black uppercase tracking-widest transition-all cursor-pointer disabled:opacity-35 disabled:cursor-not-allowed shadow-md"
                          >
                            <span>Avançar</span>
                            <ArrowRight size={9} />
                          </button>
                        </motion.div>
                      </motion.div>
                    )}

                    {/* STEP 5: BUDGET */}
                    {quizStep === 4 && (
                      <motion.div
                        key="step4"
                        custom={{ direction: quizDirection, reduced: Boolean(shouldReduceMotion) }}
                        variants={quizStepVariants}
                        initial="enter"
                        animate="center"
                        exit="exit"
                        transition={{ duration: shouldReduceMotion ? 0.12 : 0.26, ease: [0.16, 1, 0.3, 1] }}
                        className="w-full space-y-6"
                      >
                        <motion.h4
                          {...stagedEntrance(0.04)}
                          className="mx-auto max-w-3xl text-center text-2xl font-black uppercase leading-[1.05] tracking-[-0.025em] text-slate-950 sm:text-3xl md:text-4xl"
                        >
                          Qual o investimento digital que tem previsto?
                        </motion.h4>

                        <motion.div {...stagedEntrance(0.1)} className="mx-auto grid w-full max-w-3xl grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                          {budgetOptions.map((budget, budgetIdx) => {
                            const isSelected = quizBudget === budget;

                            return (
                              <motion.button
                                type="button"
                                key={budget}
                                {...fadedEntrance(0.14 + budgetIdx * 0.04)}
                                aria-pressed={isSelected}
                                onClick={() => setQuizBudget(budget)}
                                className={`relative flex min-h-24 cursor-pointer items-center justify-center rounded-3xl border p-5 text-center transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_18px_45px_rgba(15,23,42,0.10)] ${
                                  isSelected
                                    ? 'border-sky-500 bg-sky-500/5 shadow-[0_0_20px_rgba(14,165,233,0.1)] scale-[1.02]'
                                    : 'border-slate-200 bg-slate-50/60 hover:border-slate-300 hover:bg-slate-50'
                                }`}
                              >
                                <Euro size={14} className={`absolute left-5 shrink-0 ${isSelected ? 'text-sky-600' : 'text-slate-400'}`} />
                                <span className={`w-full px-5 text-center text-[9px] font-extrabold uppercase leading-relaxed tracking-wider ${
                                  isSelected ? 'text-sky-700' : 'text-slate-600'
                                }`}>
                                  {budget}
                                </span>
                              </motion.button>
                            );
                          })}
                        </motion.div>

                        <motion.div {...stagedEntrance(0.42)} className="flex items-center justify-between pt-6 border-t border-slate-100 max-w-3xl mx-auto w-full">
                          <button
                            onClick={() => goToQuizStep(3)}
                            className="flex items-center space-x-1 text-[9px] font-mono tracking-widest text-slate-400 hover:text-slate-900 uppercase cursor-pointer focus:outline-none font-bold"
                          >
                            <ChevronLeft size={10} />
                            <span>Voltar</span>
                          </button>
                          <button
                            disabled={!quizBudget}
                            onClick={() => goToQuizStep(5)}
                            className="flex items-center space-x-1.5 px-6 py-2.5 rounded-full bg-slate-900 text-white hover:bg-sky-600 hover:scale-[1.03] text-[9px] font-black uppercase tracking-widest transition-all cursor-pointer disabled:opacity-35 disabled:cursor-not-allowed shadow-md"
                          >
                            <span>Avançar</span>
                            <ArrowRight size={9} />
                          </button>
                        </motion.div>
                      </motion.div>
                    )}

                    {/* STEP 6: REGISTO DE CONTACTOS CORPORATIVOS */}
                    {quizStep === 5 && (
                      <motion.div
                        key="step5"
                        custom={{ direction: quizDirection, reduced: Boolean(shouldReduceMotion) }}
                        variants={quizStepVariants}
                        initial="enter"
                        animate="center"
                        exit="exit"
                        transition={{ duration: shouldReduceMotion ? 0.12 : 0.26, ease: [0.16, 1, 0.3, 1] }}
                        className="w-full space-y-6"
                      >
                        <div className="text-center space-y-1.5">
                          <motion.h4 {...stagedEntrance(0.04)} className="text-2xl sm:text-3xl md:text-4xl font-black uppercase tracking-[-0.025em] text-slate-950 leading-[1.05]">
                            Registo de Contacto Executivo
                          </motion.h4>
                          <motion.p {...stagedEntrance(0.08)} className="text-[9px] text-slate-400 font-mono uppercase tracking-widest font-bold">
                            Garantimos confidencialidade total e proteção estrita dos seus dados.
                          </motion.p>
                        </div>

                        <div className="space-y-4 w-full max-w-md mx-auto">
                          <motion.div {...stagedEntrance(0.16)} className="space-y-1 text-left">
                            <label className="text-[8px] font-mono tracking-widest uppercase text-slate-400 font-black block">Nome do Líder ou Empresa</label>
                            <input 
                              type="text" 
                              required
                              value={clientName}
                              onChange={(e) => setClientName(e.target.value)}
                              placeholder="EX: CLÁUDIO MENDES / AXION CORP"
                              className="w-full p-3.5 rounded-xl border border-slate-200 bg-slate-50/60 focus:border-slate-900 focus:bg-white text-xs text-slate-950 uppercase tracking-wider font-bold focus:outline-none transition-all placeholder:text-slate-400 placeholder:normal-case placeholder:font-normal"
                            />
                          </motion.div>

                          <motion.div {...stagedEntrance(0.22)} className="space-y-1 text-left">
                            <label className="text-[8px] font-mono tracking-widest uppercase text-slate-400 font-black block">E-mail Corporativo</label>
                            <input 
                              type="email" 
                              required
                              value={clientEmail}
                              onChange={(e) => setClientEmail(e.target.value)}
                              placeholder="EX: CONTACTO@EMPRESA.PT"
                              className="w-full p-3.5 rounded-xl border border-slate-200 bg-slate-50/60 focus:border-slate-900 focus:bg-white text-xs text-slate-950 uppercase tracking-wider font-bold focus:outline-none transition-all placeholder:text-slate-400 placeholder:normal-case placeholder:font-normal"
                            />
                          </motion.div>

                          <motion.div {...stagedEntrance(0.28)} className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div className="space-y-1 text-left">
                              <label className="text-[8px] font-mono tracking-widest uppercase text-slate-400 font-black block">Telefone (Opcional)</label>
                              <input 
                                type="tel" 
                                value={clientPhone}
                                onChange={(e) => setClientPhone(e.target.value)}
                                placeholder="EX: +351 912 345 678"
                                className="w-full p-3.5 rounded-xl border border-slate-200 bg-slate-50/60 focus:border-slate-900 focus:bg-white text-xs text-slate-950 uppercase tracking-wider font-bold focus:outline-none transition-all placeholder:text-slate-400 placeholder:normal-case placeholder:font-normal"
                              />
                            </div>
                            <div className="space-y-1 text-left">
                              <label className="text-[8px] font-mono tracking-widest uppercase text-slate-400 font-black block">Mensagem (Opcional)</label>
                              <input 
                                type="text" 
                                value={clientMessage}
                                onChange={(e) => setClientMessage(e.target.value)}
                                placeholder="EX: EXPANSÃO DE MERCADO"
                                className="w-full p-3.5 rounded-xl border border-slate-200 bg-slate-50/60 focus:border-slate-900 focus:bg-white text-xs text-slate-950 uppercase tracking-wider font-bold focus:outline-none transition-all placeholder:text-slate-400 placeholder:normal-case placeholder:font-normal"
                              />
                            </div>
                          </motion.div>
                        </div>

                        {/* Navigation controls */}
                        <motion.div {...stagedEntrance(0.38)} className="flex items-center justify-between pt-6 border-t border-slate-100 max-w-md mx-auto w-full">
                          <button 
                            onClick={() => goToQuizStep(4)}
                            className="flex items-center space-x-1 text-[9px] font-mono tracking-widest text-slate-400 hover:text-slate-900 uppercase cursor-pointer focus:outline-none font-bold"
                          >
                            <ChevronLeft size={10} />
                            <span>Voltar</span>
                          </button>
                          <button
                            disabled={!clientName.trim() || !clientEmail.trim() || !clientEmail.includes('@')}
                            onClick={() => goToQuizStep(6)}
                            className="flex items-center space-x-2 px-8 py-3 rounded-full bg-slate-900 hover:bg-sky-600 text-white hover:scale-[1.03] text-[9px] font-black uppercase tracking-widest transition-all cursor-pointer shadow-md disabled:opacity-35 disabled:cursor-not-allowed"
                          >
                            <span>Gerar Briefing</span>
                            <Sparkles size={11} className="text-white animate-pulse" />
                          </button>
                        </motion.div>
                      </motion.div>
                    )}

                    {/* STEP 7: BRIEFING COMPILATION SUCCESS */}
                    {quizStep === 6 && (
                      <motion.div
                        key="step6"
                        custom={{ direction: quizDirection, reduced: Boolean(shouldReduceMotion) }}
                        variants={quizStepVariants}
                        initial="enter"
                        animate="center"
                        exit="exit"
                        transition={{ duration: shouldReduceMotion ? 0.12 : 0.26, ease: [0.16, 1, 0.3, 1] }}
                        className="w-full space-y-6 flex flex-col items-center text-center max-w-xl mx-auto"
                      >
                        <motion.div {...stagedEntrance(0.04)} className="p-4 rounded-full bg-sky-500/10 border border-sky-500/20 inline-block animate-bounce">
                          <CheckCircle2 size={32} className="text-sky-500" />
                        </motion.div>
                        <div className="space-y-1.5">
                          <motion.h4 {...stagedEntrance(0.08)} className="text-xl md:text-2xl font-black uppercase tracking-wide text-sky-700">
                            BRIEFING GERADO COM SUCESSO!
                          </motion.h4>
                          <motion.p {...stagedEntrance(0.14)} className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed font-medium">
                            O diagnóstico estratégico do seu projeto foi estruturado de forma impecável. Escolha uma das vias corporativas para nos fazer chegar as suas diretrizes:
                          </motion.p>
                        </div>

                        <motion.div {...stagedEntrance(0.24)} className="flex flex-col sm:flex-row gap-3 w-full max-w-md justify-center items-stretch pt-2">
                          {/* mailto */}
                          <a
                            href={generateMailtoLink()}
                            className="flex-1 flex items-center justify-center space-x-2 px-6 py-4 rounded-xl bg-slate-900 text-white hover:bg-sky-600 hover:scale-[1.01] text-[9px] font-black uppercase tracking-wider transition-all cursor-pointer shadow-md text-center decoration-none no-underline block"
                          >
                            <Mail size={12} />
                            <span>Abrir E-mail</span>
                          </a>

                          {/* Copy */}
                          <button
                            onClick={() => {
                              const text = `Olá equipa AXION,

Gostaria de solicitar um orçamento para o desenvolvimento do ecossistema digital da minha marca. Abaixo estão os detalhes estratégicos do meu projeto recolhidos no portal:

--------------------------------------------------
DIAGNÓSTICO INICIAL (QUIZ):
--------------------------------------------------
1. Papel na Empresa:
   > ${quizOwner}

2. Dimensão da Operação:
   > ${quizSize}

3. Objetivo do Projeto:
   > ${quizObjective}

4. Áreas de Serviço Selecionadas:
   ${quizServices.map((service) => `[x] ${service}`).join('\n   ')}

5. Budget Previsto:
   > ${quizBudget}

--------------------------------------------------
DADOS DE CONTACTO:
--------------------------------------------------
Nome / Marca: ${clientName}
E-mail: ${clientEmail}
Telefone: ${clientPhone || 'Não facultado'}
Mensagem Adicional: ${clientMessage || 'Nenhuma'}

--------------------------------------------------
Briefing gerado automaticamente pelo portal interativo AXION.`;
                              navigator.clipboard.writeText(text);
                              setClipboardSuccess(true);
                              setTimeout(() => setClipboardSuccess(false), 3000);
                            }}
                            className={`flex-1 flex items-center justify-center space-x-2 px-6 py-4 rounded-xl border transition-all duration-300 text-[9px] font-black uppercase tracking-wider cursor-pointer ${
                              clipboardSuccess 
                                ? 'border-sky-500 bg-sky-50 text-sky-700 font-bold'
                                : 'border-slate-200 bg-white hover:border-slate-400 text-slate-800 shadow-xs'
                            }`}
                          >
                            <Layers size={12} />
                            <span>{clipboardSuccess ? "Copiado!" : "Copiar Briefing"}</span>
                          </button>
                        </motion.div>

                        <motion.div {...stagedEntrance(0.32)} className="pt-2">
                          <button
                            onClick={() => {
                              goToQuizStep(0);
                              setQuizOwner('');
                              setQuizObjective('');
                              setQuizServices([]);
                              setQuizBudget('');
                              setClientName('');
                              setClientEmail('');
                              setClientPhone('');
                              setClientMessage('');
                            }}
                            className="text-[8px] font-mono tracking-widest text-slate-400 hover:text-slate-900 uppercase cursor-pointer border-b border-transparent hover:border-slate-900 transition-all pb-0.5 font-bold"
                          >
                            Reiniciar Questionário
                          </button>
                        </motion.div>
                      </motion.div>
                    )}

                  </AnimatePresence>
                </div>

              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </main>

      {/* Footer */}
      {pageState === 'quiz' && isQuizContentReady && (
        <footer className="w-full mt-14 shrink-0 relative z-10 bg-slate-950 text-white overflow-hidden">
          <div className="absolute left-1/2 top-0 h-48 w-[42rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-sky-500/10 blur-[90px] pointer-events-none" />
          <div className="max-w-7xl mx-auto px-6 sm:px-8 py-10 md:py-12 space-y-9 relative">
            <div className="h-px w-full bg-gradient-to-r from-transparent via-sky-400/35 to-transparent" />
            <div className="grid grid-cols-1 md:grid-cols-[1.4fr_1fr_auto] gap-8 md:gap-12 text-left items-start">
              {/* Column 1: Logo & Description */}
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Logo theme="dark" glow={false} className="w-7 h-7" />
                  <span className="text-sm font-black tracking-[0.34em] uppercase text-white">AXION</span>
                </div>
                <p className="text-slate-400 text-[11px] leading-relaxed max-w-sm font-medium">
                  Engenharia digital de prestígio. Desenvolvemos ecossistemas tecnológicos de alto impacto para potenciar o seu negócio.
                </p>
                <span className="inline-flex items-center gap-2 text-[8px] font-mono uppercase tracking-[0.24em] text-sky-400">
                  <span className="h-1.5 w-1.5 rounded-full bg-sky-400 shadow-[0_0_9px_rgba(56,189,248,0.8)]" />
                  Portugal · Projetos globais
                </span>
              </div>

              {/* Column 2: Contacts */}
              <div className="space-y-4">
                <h4 className="text-[9px] font-mono tracking-[0.2em] text-sky-600 uppercase font-black">
                  Contactos Diretos
                </h4>
                <div className="space-y-2 text-slate-400 text-[10px] font-mono">
                  <a href="tel:+351912345678" className="flex items-center gap-3 rounded-xl border border-white/[0.07] bg-white/[0.03] px-3 py-2.5 hover:border-sky-400/35 hover:text-sky-300 transition-colors duration-300 no-underline text-slate-300 font-semibold">
                    <Phone size={12} className="text-sky-400" />
                    <span>+351 912 345 678</span>
                  </a>
                  <a href="mailto:geral@axion.pt" className="flex items-center gap-3 rounded-xl border border-white/[0.07] bg-white/[0.03] px-3 py-2.5 hover:border-sky-400/35 hover:text-sky-300 transition-colors duration-300 no-underline text-slate-300 font-semibold">
                    <Mail size={12} className="text-sky-400" />
                    <span>geral@axion.pt</span>
                  </a>
                </div>
              </div>

              {/* Column 3: Social Media */}
              <div className="space-y-4">
                <h4 className="text-[9px] font-mono tracking-[0.2em] text-sky-600 uppercase font-black">
                  Canais Digitais
                </h4>
                <div className="flex items-center gap-2.5">
                  <a 
                    href="https://linkedin.com" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="p-2.5 rounded-full bg-white/[0.04] border border-white/10 hover:border-sky-400/50 hover:text-sky-300 hover:bg-sky-400/10 transition-all duration-300 text-slate-400"
                  >
                    <Linkedin size={14} />
                  </a>
                  <a 
                    href="https://instagram.com" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="p-2.5 rounded-full bg-white/[0.04] border border-white/10 hover:border-sky-400/50 hover:text-sky-300 hover:bg-sky-400/10 transition-all duration-300 text-slate-400"
                  >
                    <Instagram size={14} />
                  </a>
                  <a 
                    href="https://github.com" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="p-2.5 rounded-full bg-white/[0.04] border border-white/10 hover:border-sky-400/50 hover:text-sky-300 hover:bg-sky-400/10 transition-all duration-300 text-slate-400"
                  >
                    <Globe size={14} />
                  </a>
                </div>
              </div>
            </div>

            {/* Copyright row */}
            <div className="pt-6 border-t border-white/[0.07] flex flex-col sm:flex-row justify-between items-center gap-4 text-[8px] font-mono text-slate-600 uppercase tracking-[0.2em] w-full text-center sm:text-left font-bold">
              <span>© 2026 AXION • TODOS OS DIREITOS RESERVADOS</span>
              <span>TECNOLOGIA DE PRESTÍGIO</span>
            </div>
          </div>
        </footer>
      )}

    </div>
  );
}
