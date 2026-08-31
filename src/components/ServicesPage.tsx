import { useEffect, useRef, useState, type ReactNode } from 'react';
import { motion, useReducedMotion, useScroll, useSpring } from 'motion/react';
import { ArrowDown, ArrowLeft, ArrowRight } from 'lucide-react';
import Logo from './Logo';
import FloatingTriangles from './FloatingTriangles';
import WebsiteFooter from './WebsiteFooter';
import { serviceAreas, serviceBySlug, type ServiceArea } from '../data/services';

interface ServicesPageProps {
  activeSlug?: string;
  onNavigateHome: () => void;
  onNavigateHomeSection: (index: number) => void;
  onNavigateBudget: () => void;
  onNavigateService: (slug: string) => void;
  onNavigateServicesHub: () => void;
}

interface RevealProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  direction?: 'up' | 'left' | 'right';
}

const transitionEase = [0.16, 1, 0.3, 1] as const;
const sectionThemes = [
  { section: 'bg-[#f7f9fc] text-slate-950', tone: 'light', muted: 'text-slate-600', quiet: 'text-slate-400', rule: 'bg-slate-900/12', watermark: 'text-slate-950/[0.025]' },
  { section: 'bg-[#07111f] text-white', tone: 'dark', muted: 'text-slate-300', quiet: 'text-slate-500', rule: 'bg-white/12', watermark: 'text-white/[0.025]' },
  { section: 'bg-[#eaf5fb] text-slate-950', tone: 'light', muted: 'text-slate-600', quiet: 'text-slate-400', rule: 'bg-sky-950/12', watermark: 'text-sky-950/[0.035]' },
  { section: 'bg-white text-slate-950', tone: 'light', muted: 'text-slate-600', quiet: 'text-slate-400', rule: 'bg-slate-900/12', watermark: 'text-slate-950/[0.025]' },
  { section: 'bg-[#0c1728] text-white', tone: 'dark', muted: 'text-slate-300', quiet: 'text-slate-500', rule: 'bg-white/12', watermark: 'text-white/[0.025]' },
  { section: 'bg-[#eff7fb] text-slate-950', tone: 'light', muted: 'text-slate-600', quiet: 'text-slate-400', rule: 'bg-sky-950/12', watermark: 'text-sky-950/[0.03]' },
] as const;

const accentPositions = [
  'right-[-12rem] top-[12%]',
  'left-[-14rem] top-[18%]',
  'right-[-10rem] bottom-[8%]',
  'left-[-15rem] top-[28%]',
  'right-[-13rem] top-[14%]',
  'left-1/2 top-[4%] -translate-x-1/2',
] as const;

function Reveal({ children, className = '', delay = 0, direction = 'up' }: RevealProps) {
  const shouldReduceMotion = useReducedMotion();
  const offset = shouldReduceMotion
    ? { x: 0, y: 0 }
    : direction === 'left'
      ? { x: -28, y: 0 }
      : direction === 'right'
        ? { x: 28, y: 0 }
        : { x: 0, y: 28 };

  return (
    <motion.div
      initial={{ opacity: 0, ...offset }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once: false, amount: 0.16 }}
      transition={{ duration: shouldReduceMotion ? 0.01 : 0.7, delay: shouldReduceMotion ? 0 : delay, ease: transitionEase }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

function ServiceIndexMark({ service }: { service: ServiceArea }) {
  return <span className="font-mono text-[9px] font-bold uppercase tracking-[0.3em] text-sky-500">{service.id} / 06</span>;
}

function SectionTriangles({ index, isDark, reduceMotion }: { index: number; isDark: boolean; reduceMotion: boolean | null }) {
  const triangles = [
    { x: 6, y: 7, size: 78, opacity: 0.11, driftX: 16, driftY: -18, rotation: -8 },
    { x: 83, y: 16, size: 126, opacity: 0.08, driftX: -20, driftY: 24, rotation: 14 },
    { x: 31, y: 25, size: 42, opacity: 0.1, driftX: 12, driftY: -16, rotation: 28 },
    { x: 68, y: 34, size: 64, opacity: 0.09, driftX: -15, driftY: -20, rotation: -19 },
    { x: 10, y: 43, size: 108, opacity: 0.075, driftX: 22, driftY: 18, rotation: 11 },
    { x: 48, y: 53, size: 50, opacity: 0.12, driftX: -12, driftY: -14, rotation: -27 },
    { x: 84, y: 62, size: 82, opacity: 0.085, driftX: -18, driftY: 22, rotation: 18 },
    { x: 17, y: 72, size: 46, opacity: 0.13, driftX: 13, driftY: -14, rotation: 22 },
    { x: 59, y: 82, size: 116, opacity: 0.07, driftX: 20, driftY: -24, rotation: -12 },
    { x: 78, y: 91, size: 62, opacity: 0.1, driftX: -12, driftY: -20, rotation: -18 },
  ];

  return (
    <div aria-hidden="true" className={`pointer-events-none absolute inset-0 z-0 overflow-hidden ${isDark ? 'text-white' : 'text-slate-800 mix-blend-multiply'}`}>
      {triangles.map((triangle, triangleIndex) => {
        const shiftedX = (triangle.x + index * 9 + triangleIndex * 3) % 88;
        const direction = (index + triangleIndex) % 2 === 0 ? 1 : -1;

        return (
          <motion.div
            key={triangleIndex}
            className="absolute"
            style={{
              left: `${shiftedX}%`,
              top: `${triangle.y}%`,
              width: triangle.size,
              height: triangle.size,
              opacity: isDark ? triangle.opacity : Math.min(triangle.opacity * 3.2, 0.4),
            }}
            animate={reduceMotion ? undefined : {
              x: [0, triangle.driftX * direction, 0],
              y: [0, triangle.driftY, 0],
              rotate: [triangle.rotation, triangle.rotation + 12 * direction, triangle.rotation],
              scale: [1, 1.04, 1],
            }}
            transition={{
              duration: 9 + index * 0.8 + triangleIndex * 1.4,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          >
            <svg viewBox="0 0 100 100" className={`h-full w-full ${triangleIndex === 1 ? 'blur-[0.6px]' : ''}`}>
              <path
                d="M50 11 91 84H9Z"
                fill="currentColor"
                fillOpacity={isDark ? 0.04 : 0.07}
                stroke="currentColor"
                strokeWidth={triangleIndex % 2 === 0 ? (isDark ? 1.2 : 1.55) : (isDark ? 0.8 : 1.1)}
              />
              <path d="M50 11 50 84" fill="none" stroke="currentColor" strokeWidth="0.45" opacity="0.5" />
            </svg>
          </motion.div>
        );
      })}
    </div>
  );
}

export default function ServicesPage({
  activeSlug,
  onNavigateHome,
  onNavigateHomeSection,
  onNavigateBudget,
  onNavigateService,
  onNavigateServicesHub,
}: ServicesPageProps) {
  const shouldReduceMotion = useReducedMotion();
  const [headerTone, setHeaderTone] = useState<'light' | 'dark'>('dark');
  const serviceRefs = useRef<Record<string, HTMLElement | null>>({});
  const initialSlug = useRef(activeSlug);
  const didInitialScroll = useRef(false);
  const activeService = serviceBySlug(activeSlug);
  const { scrollYProgress } = useScroll();
  const progressScale = useSpring(scrollYProgress, { stiffness: 120, damping: 28, restDelta: 0.001 });

  useEffect(() => {
    if (!activeService) return;
    const isInitialNavigation = activeService.slug === initialSlug.current && !didInitialScroll.current;
    const frame = window.requestAnimationFrame(() => {
      serviceRefs.current[activeService.slug]?.scrollIntoView({
        block: 'start',
        behavior: shouldReduceMotion || isInitialNavigation ? 'auto' : 'smooth',
      });
      if (isInitialNavigation) didInitialScroll.current = true;
    });
    return () => window.cancelAnimationFrame(frame);
  }, [activeService, shouldReduceMotion]);

  useEffect(() => {
    let frame = 0;
    const updateHeaderTone = () => {
      window.cancelAnimationFrame(frame);
      frame = window.requestAnimationFrame(() => {
        const sections = Array.from(document.querySelectorAll<HTMLElement>('[data-header-tone]'));
        const current = sections.find((section) => {
          const rect = section.getBoundingClientRect();
          return rect.top <= 78 && rect.bottom > 78;
        });
        setHeaderTone(current?.dataset.headerTone === 'light' ? 'light' : 'dark');
      });
    };
    updateHeaderTone();
    window.addEventListener('scroll', updateHeaderTone, { passive: true });
    window.addEventListener('resize', updateHeaderTone);
    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener('scroll', updateHeaderTone);
      window.removeEventListener('resize', updateHeaderTone);
    };
  }, []);

  const isHeaderDark = headerTone === 'dark';

  return (
    <main className="min-h-screen w-full overflow-x-hidden bg-white text-slate-950 selection:bg-sky-400/30 selection:text-slate-950">
      <motion.div className="fixed inset-x-0 top-0 z-[70] h-[2px] origin-left bg-sky-400" style={{ scaleX: progressScale }} />

      <div className={`pointer-events-none fixed inset-x-0 top-0 z-50 flex items-center justify-between px-6 py-6 transition-colors duration-500 md:px-8 ${isHeaderDark ? 'text-white' : 'text-slate-950'}`}>
        <button type="button" onClick={onNavigateHome} className="pointer-events-auto group flex cursor-pointer items-center gap-3 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-sky-500" aria-label="Ir para o início do website AXION">
          <Logo theme={isHeaderDark ? 'dark' : 'light'} glow={false} className="h-5 w-5" />
          <span className="text-[10px] font-black uppercase tracking-[0.32em]">AXION</span>
        </button>

        <button type="button" onClick={onNavigateHome} className={`pointer-events-auto group flex cursor-pointer items-center gap-2 border-b pb-1.5 text-[8px] font-black uppercase tracking-[0.2em] transition-colors focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-sky-500 ${isHeaderDark ? 'border-white/25 text-white hover:border-sky-400 hover:text-sky-300' : 'border-slate-900/20 text-slate-800 hover:border-sky-500 hover:text-sky-600'}`}>
          <ArrowLeft size={11} className="transition-transform duration-300 group-hover:-translate-x-1" />
          <span>Início</span>
        </button>
      </div>

      <section data-header-tone="dark" className="relative flex min-h-screen items-center overflow-hidden bg-[#040a13] px-6 pb-20 pt-32 text-white md:px-12">
        <motion.div className="absolute -right-[18rem] top-1/2 h-[48rem] w-[48rem] -translate-y-1/2 rounded-full bg-sky-500/20 blur-[150px]" animate={shouldReduceMotion ? undefined : { scale: [0.92, 1.08, 0.92], opacity: [0.16, 0.28, 0.16] }} transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut' }} />
        <div className="absolute inset-0 opacity-50"><FloatingTriangles theme="dark" /></div>
        <motion.div aria-hidden="true" className="absolute -right-20 top-1/2 h-[42rem] w-[42rem] -translate-y-1/2 opacity-[0.055]" initial={{ opacity: 0, scale: 0.88, rotate: shouldReduceMotion ? 0 : -4 }} whileInView={{ opacity: 0.055, scale: 1, rotate: 0 }} viewport={{ once: false, amount: 0.15 }} transition={{ duration: shouldReduceMotion ? 0.01 : 1.4, ease: transitionEase }}>
          <Logo theme="dark" glow={false} className="h-full w-full" />
        </motion.div>

        <div className="relative z-10 mx-auto w-full max-w-7xl">
          <motion.span initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: false, amount: 0.4 }} transition={{ duration: 0.5, ease: transitionEase }} className="font-mono text-[9px] font-bold uppercase tracking-[0.34em] text-sky-400">AXION / Ecossistema digital</motion.span>
          <motion.h1 initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 36 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: false, amount: 0.3 }} transition={{ duration: 0.85, delay: shouldReduceMotion ? 0 : 0.08, ease: transitionEase }} className="mt-7 max-w-6xl text-[clamp(3.25rem,6.7vw,6.8rem)] font-black uppercase leading-[0.82] tracking-[-0.055em]">
            Ecossistemas digitais<br /><span className="text-sky-400">para empresas.</span>
          </motion.h1>

          <div className="mt-12 grid gap-10 border-t border-white/12 pt-8 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
            <motion.div initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: false, amount: 0.3 }} transition={{ duration: 0.65, delay: shouldReduceMotion ? 0 : 0.24, ease: transitionEase }} className="max-w-md">
              <span className="font-mono text-[8px] font-bold uppercase tracking-[0.28em] text-slate-500">O ecossistema AXION</span>
              <h2 className="mt-3 text-xl font-black uppercase leading-tight tracking-[-0.025em] text-white md:text-2xl">
                Marketing <span className="text-sky-400">+</span> Tecnologia <span className="text-sky-400">+</span> Inteligência Artificial
              </h2>
              <p className="mt-4 text-sm font-medium leading-relaxed text-slate-300 md:text-base">
                Três dimensões ligadas numa única estrutura — pensada para transformar ambição em progresso digital concreto.
              </p>
            </motion.div>
            <motion.nav initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: false, amount: 0.2 }} transition={{ duration: 0.65, delay: shouldReduceMotion ? 0 : 0.34 }} className="grid gap-x-10 sm:grid-cols-2" aria-label="Índice de serviços AXION">
              {serviceAreas.map((service, index) => (
                <motion.button key={service.slug} type="button" onClick={() => onNavigateService(service.slug)} initial={{ opacity: 0, x: shouldReduceMotion ? 0 : 16 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: false, amount: 0.45 }} transition={{ duration: 0.45, delay: shouldReduceMotion ? 0 : index * 0.055, ease: transitionEase }} className="group flex cursor-pointer items-center justify-between border-b border-white/12 py-4 text-left focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-sky-400">
                  <span className="flex items-center gap-4"><span className="font-mono text-[8px] text-sky-400">{service.id}</span><span className="text-[10px] font-black uppercase tracking-[0.04em] text-slate-200 transition-colors group-hover:text-white">{service.title}</span></span>
                  <ArrowDown size={12} className="text-slate-600 transition-all duration-300 group-hover:translate-y-1 group-hover:text-sky-400" />
                </motion.button>
              ))}
            </motion.nav>
          </div>
        </div>
      </section>

      {serviceAreas.map((service, index) => {
        const theme = sectionThemes[index];
        const Icon = service.icon;
        const isDark = theme.tone === 'dark';
        const isReversed = index % 2 === 1;
        const variant = index % 3;

        return (
          <section key={service.slug} id={service.slug} ref={(node) => { serviceRefs.current[service.slug] = node; }} data-header-tone={theme.tone} className={`relative scroll-mt-[76px] overflow-hidden px-6 py-28 md:px-12 md:py-40 ${theme.section}`}>
            <motion.div aria-hidden="true" className={`absolute h-[34rem] w-[34rem] rounded-full bg-sky-400/15 blur-[150px] ${accentPositions[index]}`} animate={shouldReduceMotion ? undefined : { x: [0, index % 2 === 0 ? -26 : 26, 0], y: [0, 22, 0], opacity: [0.12, 0.24, 0.12] }} transition={{ duration: 11 + index, repeat: Infinity, ease: 'easeInOut' }} />
            <SectionTriangles index={index} isDark={isDark} reduceMotion={shouldReduceMotion} />
            <span aria-hidden="true" className={`pointer-events-none absolute -right-5 top-16 select-none text-[clamp(11rem,27vw,27rem)] font-black leading-none tracking-[-0.08em] ${theme.watermark}`}>{service.id}</span>

            <div className="relative z-10 mx-auto w-full max-w-7xl">
              <div className={`grid gap-12 lg:grid-cols-12 lg:items-end ${variant === 2 ? 'lg:items-start' : ''}`}>
                <Reveal direction={isReversed ? 'right' : 'left'} className={`lg:row-start-1 lg:col-span-7 ${isReversed ? 'lg:col-start-6' : 'lg:col-start-1'}`}>
                  <div className="flex items-center gap-5"><ServiceIndexMark service={service} /><span className={`h-px w-16 ${theme.rule}`} /><Icon size={18} className="text-sky-500" strokeWidth={1.5} /></div>
                  <h2 className="mt-8 max-w-4xl text-[clamp(3rem,6.5vw,7rem)] font-black uppercase leading-[0.88] tracking-[-0.05em]">{service.title}</h2>
                </Reveal>
                <Reveal delay={0.1} direction={isReversed ? 'left' : 'right'} className={`lg:row-start-1 lg:col-span-4 ${isReversed ? 'lg:col-start-1' : 'lg:col-start-9'}`}>
                  <p className={`text-base font-semibold leading-relaxed md:text-lg ${theme.muted}`}>{service.intro}</p>
                </Reveal>
              </div>

              <motion.div initial={{ scaleX: 0 }} whileInView={{ scaleX: 1 }} viewport={{ once: false, amount: 0.5 }} transition={{ duration: shouldReduceMotion ? 0.01 : 1, ease: transitionEase }} className={`my-16 h-px origin-left md:my-24 ${theme.rule}`} />

              <div className={`grid gap-16 lg:grid-cols-12 ${variant === 1 ? 'lg:gap-24' : ''}`}>
                <Reveal className={`${variant === 1 ? 'lg:col-span-7 lg:col-start-6' : 'lg:col-span-7'}`}>
                  <span className={`font-mono text-[8px] font-bold uppercase tracking-[0.28em] ${theme.quiet}`}>O que fazemos</span>
                  <p className="mt-6 max-w-4xl text-2xl font-bold leading-[1.24] tracking-[-0.025em] sm:text-3xl md:text-4xl">{service.detail}</p>
                </Reveal>
                <Reveal delay={0.1} className={`${variant === 1 ? 'lg:col-span-4 lg:col-start-1 lg:row-start-1' : 'lg:col-span-4 lg:col-start-9'}`}>
                  <span className="font-mono text-[8px] font-bold uppercase tracking-[0.28em] text-sky-500">Vantagens para a empresa</span>
                  <ol className="mt-6">
                    {service.benefits.map((benefit, benefitIndex) => (
                      <motion.li key={benefit} initial={{ opacity: 0, x: shouldReduceMotion ? 0 : 14 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: false, amount: 0.5 }} transition={{ duration: shouldReduceMotion ? 0.01 : 0.5, delay: shouldReduceMotion ? 0 : benefitIndex * 0.07, ease: transitionEase }} className={`grid grid-cols-[2rem_1fr] gap-3 border-t py-5 first:border-t-0 first:pt-0 ${isDark ? 'border-white/12' : 'border-slate-900/12'}`}>
                        <span className="font-mono text-[8px] text-sky-500">0{benefitIndex + 1}</span><span className={`text-sm font-medium leading-relaxed ${theme.muted}`}>{benefit}</span>
                      </motion.li>
                    ))}
                  </ol>
                </Reveal>
              </div>

              <div className="mt-24 grid gap-12 lg:mt-36 lg:grid-cols-12">
                <Reveal direction="left" className="lg:col-span-3">
                  <span className={`font-mono text-[8px] font-bold uppercase tracking-[0.28em] ${theme.quiet}`}>Principais soluções</span>
                  <p className={`mt-4 text-sm font-medium leading-relaxed ${theme.muted}`}>Uma abordagem modular, ajustada à maturidade e às prioridades de cada empresa.</p>
                </Reveal>
                <div className="lg:col-span-9">
                  {service.services.map((item, itemIndex) => (
                    <motion.div key={item} initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 14 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: false, amount: 0.7 }} transition={{ duration: shouldReduceMotion ? 0.01 : 0.48, delay: shouldReduceMotion ? 0 : Math.min(itemIndex * 0.035, 0.25), ease: transitionEase }} className={`group grid grid-cols-[2.5rem_1fr_auto] items-center gap-3 border-t py-4 last:border-b sm:py-5 ${isDark ? 'border-white/12' : 'border-slate-900/12'}`}>
                      <span className={`font-mono text-[8px] ${theme.quiet}`}>{String(itemIndex + 1).padStart(2, '0')}</span><span className="text-sm font-bold uppercase leading-tight tracking-[0.01em] sm:text-base">{item}</span><span className="h-1.5 w-1.5 rounded-full bg-sky-400 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                    </motion.div>
                  ))}
                </div>
              </div>

              <Reveal className="mt-24 md:mt-36">
                <div className={`relative grid gap-8 border-y py-10 md:py-14 lg:grid-cols-[0.7fr_1.3fr] lg:items-center ${isDark ? 'border-white/12' : 'border-slate-900/12'}`}>
                  <span className="font-mono text-[8px] font-bold uppercase tracking-[0.28em] text-sky-500">Ligação ao ecossistema AXION</span><p className={`text-lg font-semibold leading-relaxed md:text-2xl ${theme.muted}`}>{service.ecosystem}</p>
                </div>
              </Reveal>

              <Reveal className="mt-16 flex flex-col items-start justify-between gap-8 sm:flex-row sm:items-end">
                <div><span className={`font-mono text-[8px] font-bold uppercase tracking-[0.28em] ${theme.quiet}`}>Tem um projeto em mente?</span><p className="mt-3 text-2xl font-black uppercase leading-none tracking-[-0.03em] sm:text-3xl">Vamos construir o próximo passo.</p></div>
                <button type="button" onClick={onNavigateBudget} className={`group inline-flex cursor-pointer items-center gap-4 border-b pb-3 text-[10px] font-black uppercase tracking-[0.2em] transition-colors focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-sky-500 ${isDark ? 'border-white/30 text-white hover:border-sky-400 hover:text-sky-300' : 'border-slate-900/30 text-slate-950 hover:border-sky-500 hover:text-sky-600'}`}><span>Pedir orçamento</span><ArrowRight size={14} className="transition-transform duration-300 group-hover:translate-x-2" /></button>
              </Reveal>
            </div>
          </section>
        );
      })}

      <WebsiteFooter onNavigateSection={(index) => {
        if (index === 1) {
          onNavigateServicesHub();
          window.scrollTo({ top: 0, left: 0, behavior: shouldReduceMotion ? 'auto' : 'smooth' });
          return;
        }
        if (index === 4) {
          onNavigateBudget();
          return;
        }
        onNavigateHomeSection(index);
      }} />
    </main>
  );
}
