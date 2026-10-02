import {
  useEffect,
  useRef,
} from 'react';

import {
  motion,
  useReducedMotion,
  useScroll,
  useSpring,
} from 'motion/react';

import {
  ArrowDown,
  ArrowRight,
  ChevronDown,
} from 'lucide-react';

import Logo from './Logo';
import WebsiteFooter from './WebsiteFooter';

import SpaceBackdrop from './home/SpaceBackdrop';

import ServicesParticleStage from './services/ServicesParticleStage';

import {
  serviceAreas,
  serviceBySlug,
} from '../data/services';

import {
  servicesHubSeo,
  servicesSeo,
} from '../seo/seoConfig';



interface ServicesPageProps {
  activeSlug?: string;
  onNavigateHome: () => void;
  onNavigateHomeSection: (
    index: number,
  ) => void;
  onNavigateBudget: () => void;
  onNavigateService: (
    slug: string,
  ) => void;
  onNavigateServicesHub: () => void;
}

const transitionEase =
  [0.16, 1, 0.3, 1] as const;

export default function ServicesPage({
  activeSlug,
  onNavigateHome,
  onNavigateHomeSection,
  onNavigateBudget,
  onNavigateService,
  onNavigateServicesHub,
}: ServicesPageProps) {
  const shouldReduceMotion =
    useReducedMotion();

  const activeService =
    serviceBySlug(activeSlug);

  const activeServiceSeo =
    activeService
      ? servicesSeo[activeService.slug]
      : undefined;

  

  const heroDescription =
    activeServiceSeo
      ? activeServiceSeo.description
      : servicesHubSeo.description;

  const heroRef =
    useRef<HTMLElement | null>(
      null,
    );

  const serviceRefs =
    useRef<
      Record<
        string,
        HTMLElement | null
      >
    >({});

  const didInitialScroll =
    useRef(false);

  

  /*
   * Continuous particle timeline.
   *
   * 0 = Hero cloud
   * 1 = Branding
   * 2 = Web
   * 3 = Marketing
   * 4 = Social
   * 5 = CRM
   * 6 = AI
   *
   * This ref is deliberately not React state: it is updated on every
   * animation frame while scrolling, without rerendering the whole page.
   */
  const initialParticleScrollPosition =
    activeService
      ? Math.max(
          0,
          serviceAreas.findIndex(
            (service) =>
              service.slug === activeService.slug,
          ) + 1,
        )
      : 0;

  const particleScrollPositionRef =
    useRef(initialParticleScrollPosition);

  const { scrollYProgress } =
    useScroll();

  const progressScale =
    useSpring(
      scrollYProgress,
      {
        stiffness: 120,
        damping: 28,
        restDelta: 0.001,
      },
    );

  

  /*
   * Direct navigation:
   *
   * /servicos/<slug>
   *
   * still scrolls to the exact service.
   */
  useEffect(() => {
    if (!activeService) return;

    /*
    * Internal navigation from the service index
    * has already performed the scroll synchronously.
    *
    * Updating the pathname changes activeSlug, which
    * triggers this effect again. In that case we must
    * NOT perform a second scroll.
    */
    

    let firstFrame = 0;
    let secondFrame = 0;

    const scrollToActiveService = (
      behavior: ScrollBehavior,
    ) => {
      const target =
        serviceRefs.current[
          activeService.slug
        ];

      if (!target) return;

      const headerOffset = 76;

      const targetTop =
        target.getBoundingClientRect()
          .top +
        window.scrollY -
        headerOffset;

      window.scrollTo({
        top: Math.max(
          0,
          targetTop,
        ),
        left: 0,
        behavior,
      });

      didInitialScroll.current = true;
    };

    firstFrame =
      window.requestAnimationFrame(
        () => {
          secondFrame =
            window.requestAnimationFrame(
              () => {
                /*
                * This path is only for opening a
                * /servicos/<slug> route directly,
                * browser history navigation, etc.
                */
                scrollToActiveService(
                  'auto',
                );
              },
            );
        },
      );

    return () => {
      window.cancelAnimationFrame(
        firstFrame,
      );

      window.cancelAnimationFrame(
        secondFrame,
      );
    };
  }, [
    activeService?.slug,
  ]);
  /*
   * Scroll-synchronised particle morphing.
   *
   * Instead of telling the canvas "animate to the next shape", we derive
   * an exact position on a 0 -> 6 timeline from the current scroll position.
   * The canvas reads this ref directly on each frame.
   *
   * A small hold zone around every section centre gives each shape time to
   * exist fully formed before the next morph begins.
   */
  useEffect(() => {
    let frame = 0;

    const clamp01 = (value: number) =>
      Math.min(1, Math.max(0, value));

    const smoothstep = (value: number) => {
      const t = clamp01(value);
      return t * t * (3 - 2 * t);
    };

    const getOrderedSections = () => {
      const elements: HTMLElement[] = [];

      if (heroRef.current) {
        elements.push(heroRef.current);
      }

      serviceAreas.forEach((service) => {
        const element =
          serviceRefs.current[service.slug];

        if (element) {
          elements.push(element);
        }
      });

      return elements;
    };

    const updateParticleScrollPosition = () => {
      frame = 0;

      const elements = getOrderedSections();

      if (elements.length === 0) return;

      const viewportCentre =
        window.scrollY + window.innerHeight * 0.5;

      const anchors = elements.map((element) => {
        const rect = element.getBoundingClientRect();

        return (
          rect.top +
          window.scrollY +
          Math.min(rect.height * 0.5, window.innerHeight * 0.5)
        );
      });

      if (viewportCentre <= anchors[0]) {
        particleScrollPositionRef.current = 0;
        return;
      }

      const lastIndex = anchors.length - 1;

      if (viewportCentre >= anchors[lastIndex]) {
        particleScrollPositionRef.current = lastIndex;
        return;
      }

      for (let index = 0; index < lastIndex; index += 1) {
        const start = anchors[index];
        const end = anchors[index + 1];

        if (
          viewportCentre >= start &&
          viewportCentre <= end
        ) {
          const rawProgress = clamp01(
            (viewportCentre - start) /
              Math.max(1, end - start),
          );

          /*
           * 0.00 -> 0.18 : current shape fully formed
           * 0.18 -> 0.82 : deterministic scroll-driven morph
           * 0.82 -> 1.00 : next shape fully formed
           */
          const HOLD = 0.18;

          let morphProgress = 0;

          if (rawProgress >= 1 - HOLD) {
            morphProgress = 1;
          } else if (rawProgress > HOLD) {
            morphProgress = smoothstep(
              (rawProgress - HOLD) /
                (1 - HOLD * 2),
            );
          }

          particleScrollPositionRef.current =
            index + morphProgress;

          return;
        }
      }
    };

    const scheduleUpdate = () => {
      if (frame !== 0) return;

      frame = window.requestAnimationFrame(
        updateParticleScrollPosition,
      );
    };

    const observedSections = getOrderedSections();

    const resizeObserver = new ResizeObserver(
      scheduleUpdate,
    );

    observedSections.forEach((element) =>
      resizeObserver.observe(element),
    );

    scheduleUpdate();

    window.addEventListener(
      'scroll',
      scheduleUpdate,
      { passive: true },
    );

    window.addEventListener(
      'resize',
      scheduleUpdate,
    );

    return () => {
      if (frame !== 0) {
        window.cancelAnimationFrame(frame);
      }

      resizeObserver.disconnect();

      window.removeEventListener(
        'scroll',
        scheduleUpdate,
      );

      window.removeEventListener(
        'resize',
        scheduleUpdate,
      );
    };
  }, []);

  return (
    <main className="relative min-h-screen w-full overflow-x-hidden bg-[#010103] text-white selection:bg-sky-400/30">
      {/* Page progress */}
      <motion.div
        className="fixed inset-x-0 top-0 z-[80] h-[2px] origin-left bg-sky-400"
        style={{
          scaleX:
            progressScale,
        }}
      />

      {/* Persistent galactic scene */}
      <div className="pointer-events-none fixed inset-0 z-0">
        <SpaceBackdrop />
      </div>

      {/* Persistent particle system */}
      <div className="pointer-events-none fixed inset-0 z-[2]">
        <ServicesParticleStage
          scrollPositionRef={
            particleScrollPositionRef
          }
          reduceMotion={
            shouldReduceMotion
          }
        />
      </div> 

      {/* Dark readability veil */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-[3]"
        style={{
          background:
            'linear-gradient(90deg, rgba(0,0,0,0.14) 0%, rgba(0,0,0,0.1) 34%, rgba(0,0,0,0.2) 48%, rgba(0,0,0,0.56) 66%, rgba(0,0,0,0.76) 100%)',
        }}
      />

      {/* Header */}
      <header className="pointer-events-none fixed inset-x-0 top-0 z-50 flex items-center justify-between px-6 py-6 text-white md:px-8">
        <button
          type="button"
          onClick={
            onNavigateHome
          }
          className="pointer-events-auto group flex cursor-pointer items-center gap-3 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-sky-400"
          aria-label="Ir para o início do website AXION"
        >
          <Logo
            theme="dark"
            glow={false}
            className="h-5 w-5"
          />

          <span className="text-[10px] font-black uppercase tracking-[0.32em]">
            AXION
          </span>
        </button>

        
      </header>

      {/* HERO */}
      <section
        ref={heroRef}
        data-particle-shape="cloud"
        className="relative z-10 flex min-h-screen items-center justify-center overflow-x-hidden px-5 pb-16 pt-28 text-center sm:px-6 sm:pb-20 sm:pt-32 md:px-12 md:pb-24"
      >
        <div className="relative z-10 mx-auto flex w-full max-w-6xl flex-col items-center">
          <motion.span
            initial={{
              opacity: 0,
              y:
                shouldReduceMotion
                  ? 0
                  : 10,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              duration: 0.55,
              ease:
                transitionEase,
            }}
            className="font-mono text-[9px] font-bold uppercase tracking-[0.36em] text-sky-400"
          >
            AXION / Serviços
          </motion.span>

          <motion.h1
            initial={{
              opacity: 0,
              y:
                shouldReduceMotion
                  ? 0
                  : 28,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              duration: 0.85,
              delay:
                shouldReduceMotion
                  ? 0
                  : 0.08,
              ease:
                transitionEase,
            }}
            className="mt-7 max-w-5xl text-[clamp(2.55rem,12vw,7rem)] font-black uppercase leading-[0.86] tracking-[-0.05em] sm:mt-8"
          >
            <>
              Os nossos
              <br />

              <span className="text-sky-400">
                serviços.
              </span>
            </>
          </motion.h1>

          <motion.p
            initial={{
              opacity: 0,
              y:
                shouldReduceMotion
                  ? 0
                  : 16,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              duration: 0.65,
              delay:
                shouldReduceMotion
                  ? 0
                  : 0.2,
              ease:
                transitionEase,
            }}
            className="mt-6 max-w-xl text-sm font-semibold leading-[1.7] text-white/92 sm:mt-7 sm:text-base md:text-lg"
          >
            {activeServiceSeo ? (
              heroDescription
            ) : (
              <>
                Marketing,
                tecnologia e
                inteligência
                artificial ligados
                numa única
                estrutura digital.
              </>
            )}
          </motion.p>

          {/* Service index */}
          <nav
            aria-label="Índice de serviços AXION"
            className="mt-10 grid w-full max-w-5xl grid-cols-1 gap-x-6 self-center sm:mt-12 sm:grid-cols-2 sm:gap-x-8 lg:mt-14 lg:grid-cols-3 lg:gap-x-10"
          >
            {serviceAreas.map(
              (service, index) => (
                <a
                  key={service.slug}
                  href={`#${service.slug}`}
                  onMouseDown={(event) => {
                    event.preventDefault();
                  }}
                  className="group flex min-w-0 cursor-pointer items-center justify-between gap-4 border-b border-white/12 py-4 text-left transition-colors hover:border-white/35 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-sky-400"
                >
                  <span className="flex min-w-0 items-center gap-3">
                    <span className="shrink-0 font-mono text-[8px] text-sky-400">
                      {service.id}
                    </span>

                    <span className="truncate text-[9px] font-black uppercase tracking-[0.055em] text-white/72 transition-colors group-hover:text-white">
                      {service.title}
                    </span>
                  </span>

                  <ArrowDown
                    size={11}
                    className="shrink-0 text-white/30 transition-all duration-300 group-hover:translate-y-1 group-hover:text-sky-400"
                  />
                </a>
              ),
            )}
          </nav>

          <div className="mt-14 flex flex-col items-center gap-3">
            <span className="font-mono text-[7px] uppercase tracking-[0.28em] text-white/35">
              Explorar
            </span>

            <div className="h-10 w-px bg-gradient-to-b from-sky-400/80 to-transparent" />
          </div>
        </div>
      </section>

      {/* SERVICES */}
      {serviceAreas.map(
        (service) => {
          const Icon =
            service.icon;

          const visibleServices =
            service.services.slice(
              0,
              5,
            );

          const remainingServices =
            service.services.slice(
              5,
            );

          return (
            <section
              key={
                service.slug
              }
              id={
                service.slug
              }
              ref={(node) => {
                serviceRefs.current[
                  service.slug
                ] = node;
              }}
              data-particle-shape={
                service.slug
              }
              className="relative z-10 flex min-h-screen scroll-mt-[76px] items-center px-6 py-28 md:px-12 lg:py-32"
            >
              <div className="mx-auto grid w-full max-w-7xl gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
                {/* Left side intentionally belongs to the persistent particle stage */}
                <div
                  aria-hidden="true"
                  className="hidden min-h-[36rem] lg:block"
                />

                {/* Content */}
                <div
              
                  className="relative"
                >
                  <div className="flex items-center gap-4">
                    <span className="font-mono text-[9px] font-bold uppercase tracking-[0.3em] text-sky-400">
                      {
                        service.id
                      }{' '}
                      / 06
                    </span>

                    <span className="h-px w-10 bg-white/15" />

                    <Icon
                      size={17}
                      strokeWidth={
                        1.4
                      }
                      className="text-white/55"
                    />
                  </div>

                  <h2 className="mt-7 max-w-xl text-[clamp(2.8rem,5.4vw,5.8rem)] font-black uppercase leading-[0.87] tracking-[-0.052em]">
                    {
                      service.title
                    }
                  </h2>

                  <p className="mt-7 max-w-xl text-base font-semibold leading-[1.65] text-slate-200 md:text-lg">
                    {
                      service.desc
                    }
                  </p>

                  <p className="mt-4 max-w-xl text-sm font-medium leading-[1.75] text-slate-400">
                    {
                      service.intro
                    }
                  </p>

                  {/* Key capabilities */}
                  <div className="mt-9">
                    <span className="font-mono text-[8px] font-bold uppercase tracking-[0.26em] text-white/35">
                      Capacidades-chave
                    </span>

                    <div className="mt-4 flex max-w-xl flex-wrap gap-2">
                      {visibleServices.map(
                        (
                          item,
                        ) => (
                          <span
                            key={
                              item
                            }
                            className="rounded-full border border-white/14 bg-white/[0.05] px-3 py-2 text-[8px] font-bold uppercase tracking-[0.1em] text-white/78 backdrop-blur-md"
                          >
                            {
                              item
                            }
                          </span>
                        ),
                      )}
                    </div>
                  </div>

                  {/* Full existing content remains accessible */}
                  <details className="group mt-10 max-w-xl border-y border-white/10">
                    <summary className="flex cursor-pointer list-none items-center justify-between py-5">
                      <span className="text-[9px] font-black uppercase tracking-[0.18em] text-white/65 transition-colors group-open:text-white">
                        Explorar em
                        detalhe
                      </span>

                      <ChevronDown
                        size={13}
                        className="text-sky-400 transition-transform duration-300 group-open:rotate-180"
                      />
                    </summary>

                    <div className="space-y-10 border-t border-white/10 pb-8 pt-7">
                      <div>
                        <span className="font-mono text-[8px] uppercase tracking-[0.24em] text-sky-400">
                          O que
                          fazemos
                        </span>

                        <p className="mt-4 text-sm font-medium leading-[1.8] text-slate-300">
                          {
                            service.detail
                          }
                        </p>
                      </div>

                      {remainingServices.length >
                        0 && (
                        <div>
                          <span className="font-mono text-[8px] uppercase tracking-[0.24em] text-sky-400">
                            Outras
                            capacidades
                          </span>

                          <div className="mt-4">
                            {remainingServices.map(
                              (
                                item,
                                index,
                              ) => (
                                <div
                                  key={
                                    item
                                  }
                                  className="grid grid-cols-[2rem_1fr] gap-3 border-t border-white/8 py-3 first:border-t-0"
                                >
                                  <span className="font-mono text-[7px] text-white/25">
                                    {String(
                                      index +
                                        6,
                                    ).padStart(
                                      2,
                                      '0',
                                    )}
                                  </span>

                                  <span className="text-xs font-semibold text-slate-300">
                                    {
                                      item
                                    }
                                  </span>
                                </div>
                              ),
                            )}
                          </div>
                        </div>
                      )}

                      <div>
                        <span className="font-mono text-[8px] uppercase tracking-[0.24em] text-sky-400">
                          Vantagens
                        </span>

                        <div className="mt-4">
                          {service.benefits.map(
                            (
                              benefit,
                              index,
                            ) => (
                              <div
                                key={
                                  benefit
                                }
                                className="grid grid-cols-[2rem_1fr] gap-3 border-t border-white/8 py-3 first:border-t-0"
                              >
                                <span className="font-mono text-[7px] text-white/25">
                                  0
                                  {index +
                                    1}
                                </span>

                                <span className="text-xs font-medium leading-relaxed text-slate-400">
                                  {
                                    benefit
                                  }
                                </span>
                              </div>
                            ),
                          )}
                        </div>
                      </div>

                      <div>
                        <span className="font-mono text-[8px] uppercase tracking-[0.24em] text-sky-400">
                          Ecossistema
                          AXION
                        </span>

                        <p className="mt-4 text-sm font-medium leading-[1.8] text-slate-300">
                          {
                            service.ecosystem
                          }
                        </p>
                      </div>
                    </div>
                  </details>

                  <button
                    type="button"
                    onClick={
                      onNavigateBudget
                    }
                    className="group mt-9 inline-flex cursor-pointer items-center gap-4 border-b border-white/25 pb-2.5 text-[9px] font-black uppercase tracking-[0.2em] text-white transition-colors hover:border-sky-400 hover:text-sky-300 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-sky-400"
                  >
                    <span>
                      Falar sobre
                      este serviço
                    </span>

                    <ArrowRight
                      size={12}
                      className="transition-transform duration-300 group-hover:translate-x-1.5"
                    />
                  </button>
                </div>
              </div>
            </section>
          );
        },
      )}

      {/* Final CTA */}
       <section className="relative z-10 flex min-h-[72vh] items-center px-6 py-28 md:px-12">
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-b from-transparent via-[#010103]/36 to-[#010103]/82"
        />

        <div className="relative z-10 mx-auto w-full max-w-7xl border-t border-white/10 pt-20">
          <motion.div
            initial={{
              opacity: 0,
              y:
                shouldReduceMotion
                  ? 0
                  : 24,
            }}
            whileInView={{
              opacity: 1,
              y: 0,
            }}
            viewport={{
              once: false,
              amount: 0.25,
            }}
            transition={{
              duration: 0.7,
              ease:
                transitionEase,
            }}
            className="grid gap-10 lg:grid-cols-[1fr_auto] lg:items-end"
          >
            <div className="relative isolate">
              <div
                aria-hidden="true"
                className="absolute -inset-x-8 -inset-y-6 -z-10 rounded-[2rem] bg-[#010103]/94 blur-xl"
              />

              <span className="font-mono text-[8px] font-bold uppercase tracking-[0.28em] text-sky-400">
                Próximo passo
              </span>

              <h2
                className="mt-6 max-w-4xl text-[clamp(2.8rem,6vw,6rem)] font-black uppercase leading-[0.86] tracking-[-0.052em]"
                style={{
                  textShadow:
                    '0 12px 38px rgba(0,0,0,0.55)',
                }}
              >
                Vamos construir
                <br />
                o ecossistema.
              </h2>
            </div>

            <button
              type="button"
              onClick={
                onNavigateBudget
              }
              className="group inline-flex cursor-pointer items-center gap-4 border-b border-white/25 pb-3 text-[10px] font-black uppercase tracking-[0.2em] transition-colors hover:border-sky-400 hover:text-sky-300"
            >
              <span>
                Pedir orçamento
              </span>

              <ArrowRight
                size={14}
                className="transition-transform group-hover:translate-x-2"
              />
            </button>
          </motion.div>
        </div>
      </section>

      <div className="relative z-20">
        <WebsiteFooter
          onNavigateSection={(
            index,
          ) => {
            if (
              index === 1
            ) {
              onNavigateServicesHub();

              window.scrollTo({
                top: 0,
                left: 0,
                behavior:
                  shouldReduceMotion
                    ? 'auto'
                    : 'smooth',
              });

              return;
            }

            if (
              index === 4
            ) {
              onNavigateBudget();
              return;
            }

            onNavigateHomeSection(
              index,
            );
          }}
        />
      </div>
    </main>
  );
}
