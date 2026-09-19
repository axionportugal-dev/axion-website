import { useEffect, useRef, useState } from 'react';
import { motion, type PanInfo } from 'motion/react';
import { ChevronLeft, ChevronRight } from 'lucide-react';


interface PortfolioProject {
  id: string;
  category: string;
  title: string;
  logo: string;
  backgroundUrl: string;
  backgroundType: string;
  desc: string;
  kpi: string;
  result: string;
}

interface PortfolioExperienceProps {
  projects: PortfolioProject[];
  activeIndex: number;
  onSelect: (index: number) => void;
  onNext: () => void;
  onPrev: () => void;
}

interface RailStop {
  x: number;
  y: number;
  scale: number;
  rotateY: number;
  z: number;
  zIndex: number;
}

const mod = (value: number, total: number) =>
  ((value % total) + total) % total;

/*
 * Horizontal curved rail
 *
 * -2 = outside / entering from left
 * -1 = visible left card
 *  0 = active centre card
 * +1 = visible right card
 * +2 = outside / entering from right
 *
 * Important:
 * The cards slide horizontally through the viewport.
 * They do NOT orbit around the particle cloud.
 */
const getRailStop = (offset: number): RailStop => {
  if (offset <= -2) {
    return {
      x: -72,
      y: 12,
      scale: 0.74,
      rotateY: -28,
      z: 0,
      zIndex: 8,
    };
  }

  if (offset === -1) {
    return {
      x: -48,
      y: 5,
      scale: 0.89,
      rotateY: -21,
      z: 0,
      zIndex: 20,
    };
  }

  if (offset === 0) {
    return {
      x: 0,
      y: 0,
      scale: 1.04,
      rotateY: 0,
      z: 0,
      zIndex: 30,
    };
  }

  if (offset === 1) {
    return {
      x: 48,
      y: 5,
      scale: 0.89,
      rotateY: 21,
      z: 0,
      zIndex: 20,
    };
  }

  return {
    x: 72,
    y: 12,
    scale: 0.74,
    rotateY: 28,
    z: 0,
    zIndex: 8,
  };
};

export default function PortfolioExperience({
  projects,
  activeIndex,
  onSelect,
  onNext,
  onPrev,
}: PortfolioExperienceProps) {
  const total = projects.length;
  const activeProject = projects[activeIndex];

  /*
   * Absolute virtual rail index.
   *
   * This allows the carousel to behave continuously:
   * cards actually enter and leave through the sides
   * instead of teleporting between three fixed positions.
   */
  const [railIndex, setRailIndex] = useState(
    () => total * 20 + activeIndex,
  );

  const previousActiveIndexRef = useRef(activeIndex);

  useEffect(() => {
    if (total === 0) return;

    const previousActiveIndex =
      previousActiveIndexRef.current;

    if (previousActiveIndex === activeIndex) {
      return;
    }

    setRailIndex((currentRailIndex) => {
      const forwardIndex =
        (previousActiveIndex + 1) % total;

      const backwardIndex =
        (previousActiveIndex - 1 + total) % total;

      /*
       * Normal next navigation.
       */
      if (activeIndex === forwardIndex) {
        return currentRailIndex + 1;
      }

      /*
       * Normal previous navigation.
       */
      if (activeIndex === backwardIndex) {
        return currentRailIndex - 1;
      }

      /*
       * Direct selection through card/dots:
       * choose the closest virtual occurrence.
       */
      const approximateCycle = Math.round(
        (currentRailIndex - activeIndex) / total,
      );

      const candidates = [
        (approximateCycle - 1) * total + activeIndex,
        approximateCycle * total + activeIndex,
        (approximateCycle + 1) * total + activeIndex,
      ];

      return candidates.reduce(
        (closest, candidate) =>
          Math.abs(candidate - currentRailIndex) <
          Math.abs(closest - currentRailIndex)
            ? candidate
            : closest,
      );
    });

    previousActiveIndexRef.current = activeIndex;
  }, [activeIndex, total]);

  const handleDragEnd = (
    _: MouseEvent | TouchEvent | PointerEvent,
    info: PanInfo,
  ) => {
    const threshold = 100;

    if (info.offset.x < -threshold) {
      onNext();
    } else if (info.offset.x > threshold) {
      onPrev();
    }
  };

  if (!activeProject || total === 0) {
    return null;
  }

  /*
   * Five virtual slots:
   *
   * exit left
   * visible left
   * active centre
   * visible right
   * enter right
   */
  const visibleVirtualIndices = [
    railIndex - 2,
    railIndex - 1,
    railIndex,
    railIndex + 1,
    railIndex + 2,
  ];

  return (
    <div className="absolute inset-0 overflow-hidden text-white">
      {/*
       * Intentionally NO Portfolio-specific background or particle field here.
       *
       * The persistent AxionParticleField in HomePage remains mounted through
       * Services -> Portfolio and is therefore the exact same cloud that was
       * created by the morph animation.
       */}

      {/* Top information */}
      <div className="pointer-events-none absolute left-8 right-8 top-24 z-30 flex items-center justify-between md:left-12 md:right-12">
        <div className="flex items-center gap-3">
          <span className="font-mono text-[8px] font-bold uppercase tracking-[0.3em] text-sky-400">
            Selected Work
          </span>

          <span className="h-px w-8 bg-white/15" />

          <span className="font-mono text-[8px] uppercase tracking-[0.24em] text-white/35">
            Portfolio
          </span>
        </div>

        <span className="font-mono text-[8px] font-bold tracking-[0.25em] text-white/40">
          {String(activeIndex + 1).padStart(2, '0')}
          {' / '}
          {String(total).padStart(2, '0')}
        </span>
      </div>

      {/* Horizontal perspective rail */}
      <motion.div
        className="absolute inset-x-0 top-1/2 z-20 h-[44vh] min-h-[300px] max-h-[455px] -translate-y-1/2 cursor-grab active:cursor-grabbing"
        drag="x"
        dragConstraints={{
          left: 0,
          right: 0,
        }}
        dragElastic={0.04}
        dragMomentum={false}
        onDragEnd={handleDragEnd}
      >
        {/*
         * Perspective lives on the PARENT.
         *
         * This is what makes rotateY create the effect where
         * the inner side of each lateral card appears larger.
         */}
        <div
          className="relative h-full w-full"
          style={{
            perspective: '950px',
            perspectiveOrigin: '50% 50%',
          }}
        >
          {visibleVirtualIndices.map(
            (virtualIndex) => {
              const offset =
                virtualIndex - railIndex;

              const projectIndex = mod(
                virtualIndex,
                total,
              );

              const project =
                projects[projectIndex];

              const stop =
                getRailStop(offset);

              const cardTransformOrigin =
                offset < 0
                    ? 'right center'
                    : offset > 0
                    ? 'left center'
                    : 'center center';

              const isActive =
                offset === 0;

              const isOuter =
                Math.abs(offset) >= 2;

              return (
                <motion.button
                  key={`portfolio-${virtualIndex}`}
                  type="button"
                  onClick={() => {
                    if (!isActive) {
                      onSelect(projectIndex);
                    }
                  }}
                  aria-label={`Abrir ${project.title}`}
                  className="
                    group
                    absolute
                    left-1/2
                    top-1/2
                    aspect-[16/8.8]
                    w-[clamp(19rem,31vw,28rem)]
                    overflow-hidden
                    rounded-[24px]
                    border
                    border-white/[0.12]
                    bg-black
                    text-left
                    shadow-[0_30px_100px_rgba(0,0,0,0.72)]
                    focus-visible:outline-2
                    focus-visible:outline-offset-4
                    focus-visible:outline-sky-400
                  "
                  style={{
                    zIndex: stop.zIndex,
                    transformOrigin: cardTransformOrigin,
                    transformStyle: 'preserve-3d',
                    }}
                  initial={false}
                  animate={{
                    /*
                     * Horizontal movement through the rail.
                     */
                    x: `${stop.x}vw`,

                    /*
                     * Very subtle vertical curvature:
                     * centre sits slightly higher.
                     */
                    y: `calc(-50% + ${stop.y}px)`,

                    translateX: '-50%',

                    /*
                     * Progressive size:
                     *
                     * outside -> lateral -> centre
                     * 0.72    -> 0.86    -> 1.035
                     */
                    scale: stop.scale,

                    /*
                     * Perspective:
                     *
                     * LEFT:
                     * right / inner edge becomes larger.
                     *
                     * RIGHT:
                     * left / inner edge becomes larger.
                     */
                    rotateY: stop.rotateY,

                    /*
                     * Push lateral cards slightly deeper.
                     */
                    z: stop.z,

                    /*
                     * No planar tilt.
                     */
                    rotateZ: 0,

                    /*
                     * No opacity or brightness penalty.
                     * All cards remain fully visible.
                     */
                    opacity: 1,
                    filter: 'brightness(1)',
                  }}
                  transition={{
                    type: 'spring',
                    stiffness: 76,
                    damping: 20,
                    mass: 1,
                  }}
                >
                  {/* Project media */}
                  {project.backgroundType ===
                  'video' ? (
                    <video
                      src={project.backgroundUrl}
                      autoPlay={!isOuter}
                      loop
                      muted
                      playsInline
                      className="pointer-events-none absolute inset-0 h-full w-full object-cover"
                    />
                  ) : (
                    <img
                      src={project.backgroundUrl}
                      alt=""
                      className="pointer-events-none absolute inset-0 h-full w-full object-cover"
                    />
                  )}

                  {/* Shared cinematic treatment */}
                  <div className="pointer-events-none absolute inset-0 bg-black/18" />

                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/18 via-black/5 to-black/65" />

                  {/* Project index */}
                  <div className="pointer-events-none absolute left-5 top-5 z-20 flex items-center gap-3">
                    <span className="font-mono text-[8px] font-bold tracking-[0.28em] text-white/55">
                      {project.id}
                    </span>

                    <span className="h-px w-8 bg-white/25" />
                  </div>

                  {/* Small logo plate */}
                  <div className="pointer-events-none absolute right-5 top-5 z-20 flex h-11 w-11 items-center justify-center rounded-xl border border-white/15 bg-black/25 backdrop-blur-md">
                    <img
                      src={project.logo}
                      alt=""
                      className="max-h-5 max-w-6 object-contain"
                    />
                  </div>

                  {/* Bottom category */}
                  <div className="pointer-events-none absolute bottom-5 left-5 right-5 z-20 flex items-end justify-between">
                    <span className="max-w-[72%] text-[7px] font-bold uppercase tracking-[0.19em] text-white/55">
                      {project.category}
                    </span>

                    <span className="font-mono text-[7px] uppercase tracking-[0.2em] text-white/35">
                      AXION
                    </span>
                  </div>
                </motion.button>
              );
            },
          )}
        </div>
      </motion.div>

      {/* Active project metadata — title now lives below the posters */}
      <div className="pointer-events-none absolute bottom-12 left-8 z-30 max-w-xl md:left-12">
        <motion.div
          key={`project-info-${activeProject.id}`}
          initial={{
            opacity: 0,
            y: 10,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            duration: 0.45,
            ease: [0.16, 1, 0.3, 1],
          }}
        >
          <span className="block font-mono text-[7px] font-bold uppercase tracking-[0.28em] text-sky-400">
            Projeto selecionado / {activeProject.id}
          </span>

          <div className="mt-2 flex flex-wrap items-end gap-x-5 gap-y-2">
            <span className="text-[clamp(1.35rem,2.2vw,2.2rem)] font-black uppercase leading-none tracking-[-0.04em] text-white">
              {activeProject.title}
            </span>

            <span className="pb-0.5 text-[7px] font-bold uppercase tracking-[0.17em] text-white/40">
              {activeProject.category}
            </span>
          </div>

          <div className="mt-2.5 flex items-center gap-3">
            <span className="text-[8px] font-black uppercase tracking-[0.18em] text-white">
              {activeProject.kpi}
            </span>

            <span className="text-white/20">/</span>

            <span className="text-[7px] font-bold uppercase tracking-[0.16em] text-white/40">
              {activeProject.result}
            </span>
          </div>
        </motion.div>
      </div>

      {/* Navigation */}
      <div className="absolute bottom-14 right-8 z-40 flex items-center gap-4 md:right-12">
        <button
          type="button"
          onClick={onPrev}
          aria-label="Projeto anterior"
          className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-full border border-white/10 bg-white/[0.035] text-white/60 backdrop-blur-md transition-all duration-300 hover:border-white/30 hover:bg-white/[0.07] hover:text-white"
        >
          <ChevronLeft size={14} />
        </button>

        <div className="flex items-center gap-2">
          {projects.map(
            (project, index) => (
              <button
                key={project.id}
                type="button"
                onClick={() =>
                  onSelect(index)
                }
                aria-label={`Abrir ${project.title}`}
                className={`h-1.5 cursor-pointer rounded-full transition-all duration-500 ${
                  index === activeIndex
                    ? 'w-6 bg-white'
                    : 'w-1.5 bg-white/20 hover:bg-white/45'
                }`}
              />
            ),
          )}
        </div>

        <button
          type="button"
          onClick={onNext}
          aria-label="Projeto seguinte"
          className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-full border border-white/10 bg-white/[0.035] text-white/60 backdrop-blur-md transition-all duration-300 hover:border-white/30 hover:bg-white/[0.07] hover:text-white"
        >
          <ChevronRight size={14} />
        </button>
      </div>
    </div>
  );
}