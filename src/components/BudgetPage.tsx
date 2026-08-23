import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
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
  Rocket,
  Shield,
  Activity,
  Award,
  Terminal,
  Zap,
  CheckCircle2
} from 'lucide-react';
import Logo from './Logo';
import FloatingTriangles from './FloatingTriangles';

interface BudgetPageProps {
  theme: 'light' | 'dark';
  onBackToHome: () => void;
}

export default function BudgetPage({ theme, onBackToHome }: BudgetPageProps) {
  // Screen States: 'loading' | 'quiz'
  const [pageState, setPageState] = useState<'loading' | 'quiz'>('loading');
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [loadingTextIdx, setLoadingTextIdx] = useState(0);
  
  // Quiz Steps: 0 to 5
  const [quizStep, setQuizStep] = useState(0);

  // Form States
  const [quizOwner, setQuizOwner] = useState<string>('');
  const [quizSize, setQuizSize] = useState<string>('PME em escala (10 a 49 colaboradores)');
  const [quizVision, setQuizVision] = useState<string>('');
  const [quizServices, setQuizServices] = useState<string[]>([]);
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
Briefing gerado automaticamente pelo portal interativo AXION.`);

    return `mailto:geral@axion.pt?subject=${subject}&body=${body}`;
  };

  // Slider options mapped to descriptive texts and indicators
  const teamSizeOptions = [
    { label: "Solopreneur", value: "Operação individual (Solopreneur)", description: "Operação altamente focada, a necessitar de automações estritas para ganho de tempo.", icon: User },
    { label: "Micro-equipa", value: "Micro-equipa (2 a 9 colaboradores)", description: "Procura otimização e canais modernos de captação orgânica para impulsionar a marca.", icon: Users },
    { label: "PME em Escala", value: "PME em escala (10 a 49 colaboradores)", description: "Foco total na engenharia de performance, integrando fluxos de trabalho avançados e SEO inabalável.", icon: Building },
    { label: "Grande Corporação", value: "Grande dimensão (Mais de 50 colaboradores)", description: "Necessidade de arquiteturas tecnológicas sob medida resilientes e ecossistemas corporativos robustos.", icon: Activity }
  ];

  const currentSizeIndex = teamSizeOptions.findIndex(o => o.value === quizSize) !== -1 
    ? teamSizeOptions.findIndex(o => o.value === quizSize) 
    : 2;

  // Q3 Vision Pillars (Vertical Bars height configuration)
  const visionPillars = [
    { label: "Liderança Nacional", value: "Líder nacional de mercado, com marca inabalável", height: "100%", desc: "Autoridade absoluta", color: "from-sky-500 to-blue-600" },
    { label: "Expansão Global", value: "A expandir internacionalmente e a automatizar canais", height: "85%", desc: "Escala sem fronteiras", color: "from-teal-500 to-emerald-600" },
    { label: "Otimização de Lucro", value: "Com margens de lucro otimizadas e dobro do tamanho", height: "70%", desc: "Eficiência financeira", color: "from-amber-500 to-orange-600" },
    { label: "Independência de Ads", value: "Mais ágil, moderna e livre de dependência de anúncios", height: "55%", desc: "Crescimento orgânico", color: "from-purple-500 to-indigo-600" }
  ];

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-between bg-white text-slate-900 relative overflow-x-hidden">
      
      {/* FLOATING GEOMETRIC TRIANGLES (Always present in light theme on white background as requested once quiz starts) */}
      {pageState === 'quiz' && <FloatingTriangles theme="light" />}

      {/* HEADER CONTROLS (Back to home page always accessible once loaded) */}
      {pageState === 'quiz' && (
        <header className="w-full z-30 px-6 py-6 flex items-center justify-between max-w-7xl mx-auto shrink-0 relative">
          <div className="flex items-center space-x-3">
            <Logo theme="light" glow={false} className="w-5 h-5" />
            <span className="text-xs font-black tracking-[0.3em] uppercase text-slate-900">
              AXION • ORÇAMENTO
            </span>
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onBackToHome}
            className="flex items-center space-x-2 px-5 py-2.5 rounded-full text-[9px] font-bold tracking-widest uppercase transition-all duration-300 border border-slate-200 hover:border-slate-900 bg-white hover:bg-slate-50 text-slate-800 cursor-pointer select-none focus:outline-none shadow-xs"
            title="Regressar à Página Inicial"
          >
            <ArrowLeft size={11} />
            <span>Voltar ao Início</span>
          </motion.button>
        </header>
      )}

      {/* MAIN SCREEN CANVAS */}
      <main className="w-full flex-1 flex flex-col justify-center items-center px-6 relative z-10 max-w-5xl mx-auto py-12">
        <AnimatePresence mode="wait">
          
          {/* LOADER: WHITE BACKGROUND STATE */}
          {pageState === 'loading' && (
            <motion.div
              key="budget-page-loader"
              initial={{ opacity: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.4, ease: 'easeOut' }}
              className="flex flex-col items-center justify-center w-full text-center py-20"
            >
              {/* Minimalist Percentage Label */}
              <motion.div 
                className="text-[10px] tracking-[0.35em] font-bold uppercase mb-4 text-slate-800 font-mono"
                animate={{ opacity: [0.6, 1, 0.6] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
              >
                CARREGANDO • {loadingProgress}%
              </motion.div>

              {/* Ultra-thin Minimalist 1px Line Loader */}
              <div className="w-48 h-[1px] relative overflow-hidden mb-6 bg-slate-200">
                <motion.div 
                  className="h-full absolute left-0 top-0 bg-slate-900"
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
              initial={{ opacity: 0, scale: 0.97, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
              className="w-full flex flex-col"
            >
              <div className="w-full max-w-4xl mx-auto rounded-3xl p-6 sm:p-8 md:p-12 relative z-10 text-slate-900 flex flex-col space-y-8 select-none">
                
                {/* Reset or start over shortcut */}
                <button
                  onClick={() => {
                    setQuizStep(0);
                    setQuizOwner('');
                    setQuizVision('');
                    setQuizServices([]);
                    setClientName('');
                    setClientEmail('');
                    setClientPhone('');
                    setClientMessage('');
                  }}
                  className="absolute top-4 right-4 p-2.5 rounded-full border border-slate-200 bg-slate-50 text-slate-500 hover:text-slate-900 hover:border-slate-400 hover:bg-slate-100 transition-all cursor-pointer focus:outline-none z-10"
                  title="Reiniciar Questionário"
                >
                  <ChevronDown size={14} className="rotate-180" />
                </button>

                {/* Subtitle / Header */}
                <div className="text-center space-y-3 pt-2">
                  <h3 className="text-3xl md:text-5xl font-black tracking-tight uppercase text-slate-900 leading-none">
                    ALINHAMENTO ESTRATÉGICO
                  </h3>
                  <p className="text-[10px] md:text-xs text-sky-600 uppercase tracking-widest font-mono font-black">
                    Portal de Orçamento & Briefing Executivo AXION
                  </p>
                </div>

                {/* Micro Steps progress tracker */}
                <div className="w-full max-w-xl mx-auto flex flex-col items-center space-y-2">
                  <div className="w-full bg-slate-100 h-[2.5px] rounded-full overflow-hidden relative">
                    <motion.div 
                      className="h-full bg-slate-900"
                      initial={{ width: "0%" }}
                      animate={{ width: `${((quizStep + 1) / 6) * 100}%` }}
                      transition={{ duration: 0.3 }}
                    />
                  </div>
                  <span className="text-[9px] font-mono tracking-widest uppercase text-slate-400 font-extrabold">
                    Etapa {quizStep + 1} de 6
                  </span>
                </div>

                {/* QUESTIONS CARDS ENGINE */}
                <div className="w-full flex items-center justify-center min-h-[300px]">
                  <AnimatePresence mode="wait">

                    {/* STEP 1: ASYMMETRICAL SPOTLIGHT CARDS */}
                    {quizStep === 0 && (
                      <motion.div
                        key="step0"
                        initial={{ opacity: 0, x: 15 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -15 }}
                        transition={{ duration: 0.3 }}
                        className="w-full space-y-6"
                      >
                        <h4 className="text-lg md:text-2xl font-black uppercase tracking-wide text-slate-800 text-center leading-snug">
                          Como descreve a sua liderança e perfil de decisão?
                        </h4>

                        <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                          {/* CARD 1: FUNDADOR / CEO (Premium Highlight Card) */}
                          <div 
                            onClick={() => {
                              setQuizOwner("Sim, sou Fundador / CEO");
                              setQuizStep(1);
                            }}
                            className={`md:col-span-7 p-6 rounded-2xl border text-left cursor-pointer transition-all duration-300 relative overflow-hidden group hover:scale-[1.01] ${
                              quizOwner === "Sim, sou Fundador / CEO"
                                ? "border-amber-500 bg-amber-500/5 shadow-[0_0_20px_rgba(245,158,11,0.1)]"
                                : "border-slate-200 bg-slate-50/60 hover:border-amber-500/40 hover:bg-slate-50"
                            }`}
                          >
                            <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/5 rounded-full blur-xl pointer-events-none group-hover:scale-125 transition-transform" />
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-[8px] font-mono tracking-widest text-amber-600 uppercase font-black bg-amber-500/10 px-2 py-0.5 rounded-full">
                                Executivo Principal
                              </span>
                              <Award size={14} className="text-amber-500 animate-pulse" />
                            </div>
                            <h5 className="text-xs font-extrabold uppercase text-slate-900 tracking-wider mb-1">Fundador / CEO</h5>
                            <p className="text-[10px] text-slate-500 leading-normal font-medium">
                              Visão global do negócio e foco estrito em acelerar canais digitais de alta conversão.
                            </p>
                          </div>

                          {/* CARD 2: SOCIO / DIRETOR (Sleek Secondary Card) */}
                          <div 
                            onClick={() => {
                              setQuizOwner("Sim, sou Sócio / Diretor Executivo");
                              setQuizStep(1);
                            }}
                            className={`md:col-span-5 p-6 rounded-2xl border text-left cursor-pointer transition-all duration-300 relative overflow-hidden group hover:scale-[1.01] ${
                              quizOwner === "Sim, sou Sócio / Diretor Executivo"
                                ? "border-sky-500 bg-sky-500/5 shadow-[0_0_20px_rgba(14,165,233,0.1)]"
                                : "border-slate-200 bg-slate-50/60 hover:border-sky-500/40 hover:bg-slate-50"
                            }`}
                          >
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-[8px] font-mono tracking-widest text-sky-600 uppercase font-black bg-sky-500/10 px-2 py-0.5 rounded-full">
                                Liderança Co-Executiva
                              </span>
                              <Shield size={13} className="text-sky-500" />
                            </div>
                            <h5 className="text-xs font-extrabold uppercase text-slate-900 tracking-wider mb-1">Sócio / Diretor</h5>
                            <p className="text-[10px] text-slate-500 leading-normal font-medium">
                              Gestão operacional inteligente orientada a escala e estabilidade.
                            </p>
                          </div>

                          {/* CARD 3: MARKETING (Corporate) */}
                          <div 
                            onClick={() => {
                              setQuizOwner("Represento o departamento de Marketing / Direção");
                              setQuizStep(1);
                            }}
                            className={`md:col-span-5 p-6 rounded-2xl border text-left cursor-pointer transition-all duration-300 relative overflow-hidden group hover:scale-[1.01] ${
                              quizOwner === "Represento o departamento de Marketing / Direção"
                                ? "border-teal-500 bg-teal-500/5 shadow-[0_0_20px_rgba(20,184,166,0.1)]"
                                : "border-slate-200 bg-slate-50/60 hover:border-teal-500/40 hover:bg-slate-50"
                            }`}
                          >
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-[8px] font-mono tracking-widest text-teal-600 uppercase font-black bg-teal-500/10 px-2 py-0.5 rounded-full">
                                Divisão de Comunicação
                              </span>
                              <Activity size={13} className="text-teal-500" />
                            </div>
                            <h5 className="text-xs font-extrabold uppercase text-slate-900 tracking-wider mb-1">Marketing / Corporate</h5>
                            <p className="text-[10px] text-slate-500 leading-normal font-medium">
                              Foco estrito em posicionamento de prestígio e autoridade inabalável.
                            </p>
                          </div>

                          {/* CARD 4: NEW BUSINESS (Sleek Dotted Futurism) */}
                          <div 
                            onClick={() => {
                              setQuizOwner("Estou prestes a lançar um novo negócio");
                              setQuizStep(1);
                            }}
                            className={`md:col-span-7 p-6 rounded-2xl border text-left cursor-pointer transition-all duration-300 relative overflow-hidden group hover:scale-[1.01] ${
                              quizOwner === "Estou prestes a lançar um novo negócio"
                                ? "border-purple-500 bg-purple-500/5 shadow-[0_0_20px_rgba(168,85,247,0.1)]"
                                : "border-slate-200 border-dashed bg-slate-50/60 hover:border-purple-500/40 hover:bg-slate-50"
                            }`}
                          >
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-[8px] font-mono tracking-widest text-purple-600 uppercase font-black bg-purple-500/10 px-2 py-0.5 rounded-full">
                                Ecossistema Emergente
                              </span>
                              <Rocket size={13} className="text-purple-500 animate-bounce" />
                            </div>
                            <h5 className="text-xs font-extrabold uppercase text-slate-900 tracking-wider mb-1">Próximo Lançamento</h5>
                            <p className="text-[10px] text-slate-500 leading-normal font-medium">
                              Estruturar um branding imbatível e código ultra-rápido para nascer líder.
                            </p>
                          </div>
                        </div>
                      </motion.div>
                    )}

                    {/* STEP 2: PREMIUM HORIZONTAL GAUGE SLIDER */}
                    {quizStep === 1 && (
                      <motion.div
                        key="step1"
                        initial={{ opacity: 0, x: 15 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -15 }}
                        transition={{ duration: 0.3 }}
                        className="w-full space-y-8 flex flex-col"
                      >
                        <h4 className="text-lg md:text-2xl font-black uppercase tracking-wide text-slate-800 text-center leading-snug">
                          Qual é a dimensão atual da equipa corporativa?
                        </h4>

                        {/* Analog slider gauge */}
                        <div className="space-y-10 py-6 max-w-2xl mx-auto w-full">
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
                                  <button
                                    key={opt.value}
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
                                  </button>
                                );
                              })}
                            </div>
                          </div>
                        </div>

                        {/* Interactive dynamic terminal based on active slider option */}
                        <div className="p-6 rounded-2xl border border-slate-200 bg-slate-50/60 backdrop-blur-xs flex items-start space-x-4 text-left max-w-2xl mx-auto w-full">
                          <div className="p-3 rounded-lg bg-sky-50 text-sky-600 border border-sky-100 shrink-0">
                            {React.createElement(teamSizeOptions[currentSizeIndex].icon, { size: 18 })}
                          </div>
                          <div className="space-y-1">
                            <span className="text-[8px] font-mono tracking-widest uppercase text-sky-600 font-black block">
                              Diagnóstico Operacional
                            </span>
                            <h5 className="text-xs font-extrabold uppercase text-slate-900 tracking-wider">
                              {teamSizeOptions[currentSizeIndex].value}
                            </h5>
                            <p className="text-[10px] text-slate-500 leading-relaxed font-medium">
                              {teamSizeOptions[currentSizeIndex].description}
                            </p>
                          </div>
                        </div>

                        {/* Navigation controls */}
                        <div className="flex items-center justify-between pt-6 border-t border-slate-100 max-w-2xl mx-auto w-full">
                          <button 
                            onClick={() => setQuizStep(0)}
                            className="flex items-center space-x-1 text-[9px] font-mono tracking-widest text-slate-400 hover:text-slate-900 uppercase cursor-pointer focus:outline-none font-bold"
                          >
                            <ChevronLeft size={10} />
                            <span>Voltar</span>
                          </button>
                          <button
                            onClick={() => setQuizStep(2)}
                            className="flex items-center space-x-1.5 px-6 py-2.5 rounded-full bg-slate-900 text-white hover:bg-sky-600 hover:scale-[1.03] text-[9px] font-black uppercase tracking-widest transition-all cursor-pointer shadow-md"
                          >
                            <span>Avançar</span>
                            <ArrowRight size={9} />
                          </button>
                        </div>
                      </motion.div>
                    )}

                    {/* STEP 3: VERTICAL GROWTH PILLARS */}
                    {quizStep === 2 && (
                      <motion.div
                        key="step2"
                        initial={{ opacity: 0, x: 15 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -15 }}
                        transition={{ duration: 0.3 }}
                        className="w-full space-y-6"
                      >
                        <h4 className="text-lg md:text-2xl font-black uppercase tracking-wide text-slate-800 text-center leading-snug">
                          Onde planeia projetar a presença digital da sua empresa em 5 anos?
                        </h4>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 items-end h-[200px] pt-4 max-w-3xl mx-auto w-full">
                          {visionPillars.map((pillar) => {
                            const isSelected = quizVision === pillar.value;
                            return (
                              <div
                                key={pillar.value}
                                onClick={() => setQuizVision(pillar.value)}
                                className={`h-full flex flex-col justify-end p-4 rounded-2xl border text-center cursor-pointer transition-all duration-300 relative overflow-hidden group select-none ${
                                  isSelected 
                                    ? "border-sky-500 bg-sky-500/5 shadow-[0_0_20px_rgba(14,165,233,0.1)] scale-[1.02]" 
                                    : "border-slate-200 bg-slate-50/60 hover:border-slate-300 hover:bg-slate-50"
                                }`}
                              >
                                {/* Simulated metric vertical bar */}
                                <div className="flex-1 flex items-end justify-center w-full pb-4">
                                  <div className="w-1.5 bg-slate-100 rounded-full h-full relative overflow-hidden">
                                    <motion.div 
                                      className={`absolute bottom-0 left-0 w-full rounded-full bg-gradient-to-t ${pillar.color}`}
                                      initial={{ height: "0%" }}
                                      animate={{ height: isSelected ? "100%" : "30%" }}
                                      transition={{ duration: 0.5 }}
                                    />
                                  </div>
                                </div>

                                <div className="space-y-0.5">
                                  <span className={`text-[8.5px] font-mono tracking-wider font-extrabold block transition-colors uppercase ${
                                    isSelected ? 'text-sky-600' : 'text-slate-500'
                                  }`}>
                                    {pillar.label}
                                  </span>
                                  <span className="text-[7px] font-mono opacity-50 text-slate-400 uppercase tracking-widest block">
                                    {pillar.desc}
                                  </span>
                                </div>
                              </div>
                            );
                          })}
                        </div>

                        {/* Navigation controls */}
                        <div className="flex items-center justify-between pt-6 border-t border-slate-100 max-w-3xl mx-auto w-full">
                          <button 
                            onClick={() => setQuizStep(1)}
                            className="flex items-center space-x-1 text-[9px] font-mono tracking-widest text-slate-400 hover:text-slate-900 uppercase cursor-pointer focus:outline-none font-bold"
                          >
                            <ChevronLeft size={10} />
                            <span>Voltar</span>
                          </button>
                          <button
                            disabled={!quizVision}
                            onClick={() => setQuizStep(3)}
                            className="flex items-center space-x-1.5 px-6 py-2.5 rounded-full bg-slate-900 text-white hover:bg-sky-600 hover:scale-[1.03] text-[9px] font-black uppercase tracking-widest transition-all cursor-pointer disabled:opacity-35 disabled:cursor-not-allowed shadow-md"
                          >
                            <span>Avançar</span>
                            <ArrowRight size={9} />
                          </button>
                        </div>
                      </motion.div>
                    )}

                    {/* STEP 4: BENTO-STYLE ENGINEERING BLUEPRINT GRID */}
                    {quizStep === 3 && (
                      <motion.div
                        key="step3"
                        initial={{ opacity: 0, x: 15 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -15 }}
                        transition={{ duration: 0.3 }}
                        className="w-full space-y-6"
                      >
                        <h4 className="text-lg md:text-2xl font-black uppercase tracking-wide text-slate-800 text-center leading-snug">
                          Quais os canais tecnológicos que pretende integrar? (Múltiplos)
                        </h4>

                        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 max-w-3xl mx-auto w-full">
                          {[
                            { title: "Identidade Visual & Branding de Luxo", grid: "md:col-span-7", kpi: "KPI: Reconhecimento de prestígio", desc: "Posicionamento estético intemporal.", icon: Award, accent: "border-amber-200/80 hover:border-amber-400 hover:bg-amber-500/2" },
                            { title: "Desenvolvimento Web de Alta Performance", grid: "md:col-span-5", kpi: "KPI: Carregamento < 0.8s", desc: "Engenharia ágil nativa em React.", icon: Terminal, accent: "border-sky-200/80 hover:border-sky-400 hover:bg-sky-500/2" },
                            { title: "SEO Avançado & Dominação Orgânica", grid: "md:col-span-5", kpi: "KPI: Top 3 Google garantido", desc: "Monopolizar pesquisas qualificadas.", icon: Globe, accent: "border-teal-200/80 hover:border-teal-400 hover:bg-teal-500/2" },
                            { title: "Consultoria Executiva de Escala", grid: "md:col-span-7", kpi: "KPI: Margem Operacional +85%", desc: "Engenharia estratégica digital.", icon: Zap, accent: "border-purple-200/80 hover:border-purple-400 hover:bg-purple-500/2" }
                          ].map((serv) => {
                            const isSelected = quizServices.includes(serv.title);
                            const IconC = serv.icon;
                            return (
                              <div
                                key={serv.title}
                                onClick={() => {
                                  if (isSelected) {
                                    setQuizServices(quizServices.filter(s => s !== serv.title));
                                  } else {
                                    setQuizServices([...quizServices, serv.title]);
                                  }
                                }}
                                className={`p-5 rounded-2xl border text-left cursor-pointer transition-all duration-300 relative overflow-hidden select-none group ${serv.grid} ${
                                  isSelected 
                                    ? "border-sky-500 bg-sky-500/5 shadow-[0_0_15px_rgba(14,165,233,0.08)] scale-[1.01]" 
                                    : `border-slate-200 bg-slate-50/60 ${serv.accent}`
                                }`}
                              >
                                <div className="flex items-center justify-between mb-2">
                                  <div className={`p-2 rounded-lg ${isSelected ? 'bg-sky-100 text-sky-600' : 'bg-slate-100 text-slate-500'}`}>
                                    <IconC size={14} />
                                  </div>
                                  <div className={`w-4 h-4 rounded-sm border flex items-center justify-center transition-all ${
                                    isSelected ? 'border-sky-500 bg-sky-500 text-white' : 'border-slate-300 bg-white'
                                  }`}>
                                    {isSelected && <span className="text-[10px] font-black">✓</span>}
                                  </div>
                                </div>

                                <h5 className="text-[11px] font-extrabold uppercase text-slate-900 tracking-wider leading-snug">
                                  {serv.title}
                                </h5>
                                <p className="text-[9.5px] text-slate-500 font-medium leading-relaxed mb-1">
                                  {serv.desc}
                                </p>
                                <span className="text-[8px] font-mono text-sky-600 uppercase tracking-widest font-black block">
                                  {serv.kpi}
                                </span>
                              </div>
                            );
                          })}
                        </div>

                        {/* Navigation controls */}
                        <div className="flex items-center justify-between pt-6 border-t border-slate-100 max-w-3xl mx-auto w-full">
                          <button 
                            onClick={() => setQuizStep(2)}
                            className="flex items-center space-x-1 text-[9px] font-mono tracking-widest text-slate-400 hover:text-slate-900 uppercase cursor-pointer focus:outline-none font-bold"
                          >
                            <ChevronLeft size={10} />
                            <span>Voltar</span>
                          </button>
                          <button
                            disabled={quizServices.length === 0}
                            onClick={() => setQuizStep(4)}
                            className="flex items-center space-x-1.5 px-6 py-2.5 rounded-full bg-slate-900 text-white hover:bg-sky-600 hover:scale-[1.03] text-[9px] font-black uppercase tracking-widest transition-all cursor-pointer disabled:opacity-35 disabled:cursor-not-allowed shadow-md"
                          >
                            <span>Avançar</span>
                            <ArrowRight size={9} />
                          </button>
                        </div>
                      </motion.div>
                    )}

                    {/* STEP 5: REGISTO DE CONTACTOS CORPORATIVOS */}
                    {quizStep === 4 && (
                      <motion.div
                        key="step4"
                        initial={{ opacity: 0, x: 15 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -15 }}
                        transition={{ duration: 0.3 }}
                        className="w-full space-y-6"
                      >
                        <div className="text-center space-y-1.5">
                          <h4 className="text-lg md:text-2xl font-black uppercase tracking-wide text-slate-800">
                            Registo de Contacto Executivo
                          </h4>
                          <p className="text-[9px] text-slate-400 font-mono uppercase tracking-widest font-bold">
                            Garantimos confidencialidade total e proteção estrita dos seus dados.
                          </p>
                        </div>

                        <div className="space-y-4 w-full max-w-md mx-auto">
                          <div className="space-y-1 text-left">
                            <label className="text-[8px] font-mono tracking-widest uppercase text-slate-400 font-black block">Nome do Líder ou Empresa</label>
                            <input 
                              type="text" 
                              required
                              value={clientName}
                              onChange={(e) => setClientName(e.target.value)}
                              placeholder="EX: CLÁUDIO MENDES / AXION CORP"
                              className="w-full p-3.5 rounded-xl border border-slate-200 bg-slate-50/60 focus:border-slate-900 focus:bg-white text-xs text-slate-950 uppercase tracking-wider font-bold focus:outline-none transition-all placeholder:text-slate-400 placeholder:normal-case placeholder:font-normal"
                            />
                          </div>

                          <div className="space-y-1 text-left">
                            <label className="text-[8px] font-mono tracking-widest uppercase text-slate-400 font-black block">E-mail Corporativo</label>
                            <input 
                              type="email" 
                              required
                              value={clientEmail}
                              onChange={(e) => setClientEmail(e.target.value)}
                              placeholder="EX: CONTACTO@EMPRESA.PT"
                              className="w-full p-3.5 rounded-xl border border-slate-200 bg-slate-50/60 focus:border-slate-900 focus:bg-white text-xs text-slate-950 uppercase tracking-wider font-bold focus:outline-none transition-all placeholder:text-slate-400 placeholder:normal-case placeholder:font-normal"
                            />
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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
                          </div>
                        </div>

                        {/* Navigation controls */}
                        <div className="flex items-center justify-between pt-6 border-t border-slate-100 max-w-md mx-auto w-full">
                          <button 
                            onClick={() => setQuizStep(3)}
                            className="flex items-center space-x-1 text-[9px] font-mono tracking-widest text-slate-400 hover:text-slate-900 uppercase cursor-pointer focus:outline-none font-bold"
                          >
                            <ChevronLeft size={10} />
                            <span>Voltar</span>
                          </button>
                          <button
                            disabled={!clientName.trim() || !clientEmail.trim() || !clientEmail.includes('@')}
                            onClick={() => setQuizStep(5)}
                            className="flex items-center space-x-2 px-8 py-3 rounded-full bg-slate-900 hover:bg-sky-600 text-white hover:scale-[1.03] text-[9px] font-black uppercase tracking-widest transition-all cursor-pointer shadow-md disabled:opacity-35 disabled:cursor-not-allowed"
                          >
                            <span>Gerar Briefing</span>
                            <Sparkles size={11} className="text-white animate-pulse" />
                          </button>
                        </div>
                      </motion.div>
                    )}

                    {/* STEP 6: BRIEFING COMPILATION SUCCESS */}
                    {quizStep === 5 && (
                      <motion.div
                        key="step5"
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0 }}
                        className="w-full space-y-6 flex flex-col items-center text-center max-w-xl mx-auto"
                      >
                        <div className="p-4 rounded-full bg-emerald-500/10 border border-emerald-500/20 inline-block animate-bounce">
                          <CheckCircle2 size={32} className="text-emerald-500" />
                        </div>
                        <div className="space-y-1.5">
                          <h4 className="text-xl md:text-2xl font-black uppercase tracking-wide text-emerald-600">
                            BRIEFING GERADO COM SUCESSO!
                          </h4>
                          <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed font-medium">
                            O diagnóstico estratégico do seu projeto foi estruturado de forma impecável. Escolha uma das vias corporativas para nos fazer chegar as suas diretrizes:
                          </p>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-3 w-full max-w-md justify-center items-stretch pt-2">
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
Briefing gerado automaticamente pelo portal interativo AXION.`;
                              navigator.clipboard.writeText(text);
                              setClipboardSuccess(true);
                              setTimeout(() => setClipboardSuccess(false), 3000);
                            }}
                            className={`flex-1 flex items-center justify-center space-x-2 px-6 py-4 rounded-xl border transition-all duration-300 text-[9px] font-black uppercase tracking-wider cursor-pointer ${
                              clipboardSuccess 
                                ? 'border-emerald-500 bg-emerald-50 text-emerald-600 font-bold' 
                                : 'border-slate-200 bg-white hover:border-slate-400 text-slate-800 shadow-xs'
                            }`}
                          >
                            <Layers size={12} />
                            <span>{clipboardSuccess ? "Copiado!" : "Copiar Briefing"}</span>
                          </button>
                        </div>

                        <div className="pt-2">
                          <button
                            onClick={() => {
                              setQuizStep(0);
                              setQuizOwner('');
                              setQuizVision('');
                              setQuizServices([]);
                              setClientName('');
                              setClientEmail('');
                              setClientPhone('');
                              setClientMessage('');
                            }}
                            className="text-[8px] font-mono tracking-widest text-slate-400 hover:text-slate-900 uppercase cursor-pointer border-b border-transparent hover:border-slate-900 transition-all pb-0.5 font-bold"
                          >
                            Reiniciar Questionário
                          </button>
                        </div>
                      </motion.div>
                    )}

                  </AnimatePresence>
                </div>

              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </main>

      {/* FOOTER SECTION: IDENTICAL TO HOMEPAGE/PORTAL STYLE (ADAPTED FOR LIGHT GROUND) - Only visible when quiz is active */}
      {pageState === 'quiz' && (
        <footer className="w-full pt-8 mt-12 border-t border-slate-150 shrink-0 relative z-10 bg-slate-50">
          <div className="max-w-7xl mx-auto px-6 py-8 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
              {/* Column 1: Logo & Description */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Logo theme="light" className="w-5 h-5" />
                  <span className="text-xs font-black tracking-[0.3em] uppercase text-slate-900">AXION</span>
                </div>
                <p className="text-slate-500 text-[11px] leading-relaxed max-w-xs font-medium">
                  Engenharia digital de prestígio. Desenvolvemos ecossistemas tecnológicos de alto impacto para potenciar o seu negócio.
                </p>
              </div>

              {/* Column 2: Contacts */}
              <div className="space-y-3">
                <h4 className="text-[9px] font-mono tracking-[0.2em] text-sky-600 uppercase font-black">
                  Contactos Diretos
                </h4>
                <div className="space-y-2 text-slate-600 text-[11px] font-mono">
                  <a href="tel:+351912345678" className="flex items-center gap-2 hover:text-sky-600 transition-colors duration-300 no-underline text-slate-600 font-semibold">
                    <Phone size={12} className="text-sky-500" />
                    <span>+351 912 345 678</span>
                  </a>
                  <br />
                  <a href="mailto:geral@axion.pt" className="flex items-center gap-2 hover:text-sky-600 transition-colors duration-300 no-underline text-slate-600 font-semibold">
                    <Mail size={12} className="text-sky-500" />
                    <span>geral@axion.pt</span>
                  </a>
                </div>
              </div>

              {/* Column 3: Social Media */}
              <div className="space-y-3">
                <h4 className="text-[9px] font-mono tracking-[0.2em] text-sky-600 uppercase font-black">
                  Canais Digitais
                </h4>
                <div className="flex items-center gap-2">
                  <a 
                    href="https://linkedin.com" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="p-2 rounded-lg bg-white border border-slate-200 hover:border-sky-500 hover:text-sky-600 hover:bg-sky-50 transition-all duration-300 text-slate-600"
                  >
                    <Linkedin size={14} />
                  </a>
                  <a 
                    href="https://instagram.com" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="p-2 rounded-lg bg-white border border-slate-200 hover:border-sky-500 hover:text-sky-600 hover:bg-sky-50 transition-all duration-300 text-slate-600"
                  >
                    <Instagram size={14} />
                  </a>
                  <a 
                    href="https://github.com" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="p-2 rounded-lg bg-white border border-slate-200 hover:border-sky-500 hover:text-sky-600 hover:bg-sky-50 transition-all duration-300 text-slate-600"
                  >
                    <Globe size={14} />
                  </a>
                </div>
              </div>
            </div>

            {/* Copyright row */}
            <div className="pt-6 border-t border-slate-200 flex flex-col sm:flex-row justify-between items-center gap-4 text-[8px] font-mono text-slate-400 uppercase tracking-[0.2em] w-full text-center sm:text-left font-bold">
              <span>© 2026 AXION • TODOS OS DIREITOS RESERVADOS</span>
              <span>TECNOLOGIA DE PRESTÍGIO</span>
            </div>
          </div>
        </footer>
      )}

    </div>
  );
}
