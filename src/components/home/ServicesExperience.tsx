import { useEffect, useRef } from 'react';
import {
  motion,
  useAnimationFrame,
  useReducedMotion,
} from 'motion/react';
import { ArrowUpRight } from 'lucide-react';
import { serviceAreas } from '../../data/services';

interface ServicesExperienceProps {
  onNavigateToServices: () => void;
}

/*
 * The cards travel on a tilted ellipse that represents a circular orbit
 * seen from slightly above. sin(angle) is the depth axis: cards at the
 * bottom of the ellipse are closest to the viewer, cards at the top are
 * furthest away and recede behind the sphere.
 */
const ORBIT_RADIUS_X = 0.37; // fraction of stage width
const ORBIT_RADIUS_Y = 0.27; // fraction of stage height
const ORBIT_TILT_RAD = (-8 * Math.PI) / 180;
const ORBIT_PERIOD_SECONDS = 56;

const DEPTH_SCALE_MIN = 0.58;
const DEPTH_OPACITY_MIN = 0.6;
const DEPTH_MAX_TILT_DEG = 16;

const HOVER_DIM_FACTOR = 0.45;
const SPEED_EASE_MS = 450;

export default function ServicesExperience({
  onNavigateToServices,
}: ServicesExperienceProps)  {
  const stageRef =
    useRef<HTMLDivElement>(null);
  const cardRefs = useRef<
    (HTMLDivElement | null)[]
  >([]);
  const stageSizeRef = useRef({
    width: 0,
    height: 0,
  });
  const angleRef = useRef(0);
  const speedRef = useRef(1);
  const hoveredIndexRef =
    useRef<number | null>(null);
  const prefersReducedMotion =
    useReducedMotion();

  useEffect(() => {
    const stage = stageRef.current;

    if (!stage) return;

    const measure = () => {
      stageSizeRef.current = {
        width: stage.clientWidth,
        height: stage.clientHeight,
      };
    };

    measure();

    const resizeObserver =
      new ResizeObserver(measure);
    resizeObserver.observe(stage);

    return () =>
      resizeObserver.disconnect();
  }, []);

  useAnimationFrame((_, delta) => {
    const { width, height } =
      stageSizeRef.current;

    if (!width || !height) return;

    const hoveredIndex =
      hoveredIndexRef.current;

    // Ease to a stop while a card is hovered, then ease back up.
    const targetSpeed =
      prefersReducedMotion ||
      hoveredIndex !== null
        ? 0
        : 1;

    speedRef.current +=
      (targetSpeed - speedRef.current) *
      Math.min(1, delta / SPEED_EASE_MS);

    angleRef.current +=
      (delta / 1000) *
      ((Math.PI * 2) /
        ORBIT_PERIOD_SECONDS) *
      speedRef.current;

    const radiusX = width * ORBIT_RADIUS_X;
    const radiusY = height * ORBIT_RADIUS_Y;
    const tiltCos = Math.cos(ORBIT_TILT_RAD);
    const tiltSin = Math.sin(ORBIT_TILT_RAD);

    cardRefs.current.forEach(
      (card, index) => {
        if (!card) return;

        const angle =
          angleRef.current +
          (index / serviceAreas.length) *
            Math.PI *
            2;

        const orbitX =
          Math.cos(angle) * radiusX;
        const orbitY =
          Math.sin(angle) * radiusY;

        const x =
          orbitX * tiltCos -
          orbitY * tiltSin;
        const y =
          orbitX * tiltSin +
          orbitY * tiltCos;

        // 0 = far side of the orbit, 1 = closest to the viewer.
        const depth =
          (Math.sin(angle) + 1) / 2;

        const isHovered =
          hoveredIndex === index;

        const scale =
          DEPTH_SCALE_MIN +
          (1 - DEPTH_SCALE_MIN) * depth;

        let opacity =
          DEPTH_OPACITY_MIN +
          (1 - DEPTH_OPACITY_MIN) *
            depth;

        if (isHovered) {
          opacity = 1;
        } else if (hoveredIndex !== null) {
          opacity *= HOVER_DIM_FACTOR;
        }

        // Cards turn slightly towards the sphere as they pass the sides.
        const rotateY =
          -Math.cos(angle) *
          DEPTH_MAX_TILT_DEG;

        card.style.transform = `translate3d(${x.toFixed(
          1,
        )}px, ${y.toFixed(
          1,
        )}px, 0) translate(-50%, -50%) perspective(1100px) rotateY(${rotateY.toFixed(
          2,
        )}deg) scale(${(
          isHovered
            ? Math.max(scale, 0.96)
            : scale
        ).toFixed(3)})`;
        card.style.opacity =
          opacity.toFixed(3);
        card.style.zIndex = isHovered
          ? '200'
          : String(
              Math.round(depth * 100),
            );
        card.style.setProperty(
          '--orbit-depth',
          depth.toFixed(3),
        );
      },
    );
  });

  return (
    <div className="absolute inset-0 overflow-hidden text-white">
      {/* Scene label */}
      <div className="pointer-events-none absolute left-1/2 top-[9%] z-20 -translate-x-1/2 text-center">
        <span className="font-mono text-[8px] font-bold uppercase tracking-[0.36em] text-sky-400/70">
          AXION / Serviços
        </span>
      </div>

      {/* Desktop 3D orbit around the particle sphere */}
      <div
        ref={stageRef}
        className="absolute inset-0 hidden lg:block"
      >
        {/* Orbit trail: brighter on the near side, fading into the distance */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute left-1/2 top-1/2 rounded-[50%] border border-sky-200/[0.09] [mask-image:linear-gradient(to_bottom,rgba(0,0,0,0.15),black_75%)]"
          style={{
            width: `${ORBIT_RADIUS_X * 200}%`,
            height: `${ORBIT_RADIUS_Y * 200}%`,
            transform: `translate(-50%, -50%) rotate(${ORBIT_TILT_RAD}rad)`,
          }}
        />

        {serviceAreas.map(
          (service, index) => {
            const Icon = service.icon;

            return (
              <div
                key={service.slug}
                ref={(element) => {
                  cardRefs.current[index] =
                    element;
                }}
                className="absolute left-1/2 top-1/2 will-change-[transform,opacity]"
                style={{ opacity: 0 }}
                onPointerEnter={() => {
                  hoveredIndexRef.current =
                    index;
                }}
                onPointerLeave={() => {
                  if (
                    hoveredIndexRef.current ===
                    index
                  ) {
                    hoveredIndexRef.current =
                      null;
                  }
                }}
                onFocus={() => {
                  hoveredIndexRef.current =
                    index;
                }}
                onBlur={() => {
                  hoveredIndexRef.current =
                    null;
                }}
              >
                <motion.button
                  type="button"
                  onClick={(event) => {
                    event.stopPropagation();
                    onNavigateToServices();
                  }}
                  aria-label={`Explorar ${service.title}`}
                  className="group pointer-events-auto relative w-[clamp(12rem,14.5vw,14rem)] cursor-pointer rounded-[22px] border border-white/[0.13] bg-[#0b1018]/70 p-5 text-left shadow-[0_24px_70px_rgba(56,189,248,calc(var(--orbit-depth,0)*0.1)),inset_0_1px_0_rgba(255,255,255,0.06)] backdrop-blur-2xl transition-[border-color,background-color] duration-500 hover:border-sky-300/45 hover:bg-[#0d1520]/80 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-sky-400"
                  initial={{
                    opacity: 0,
                    scale: 0.92,
                    filter:
                      'blur(7px)',
                  }}
                  animate={{
                    opacity: 1,
                    scale: 1,
                    filter:
                      'blur(0px)',
                  }}
                  transition={{
                    opacity: {
                      duration: 0.7,
                      delay:
                        0.08 +
                        index * 0.075,
                    },
                    scale: {
                      duration: 0.7,
                      delay:
                        0.08 +
                        index * 0.075,
                    },
                    filter: {
                      duration: 0.7,
                      delay:
                        0.08 +
                        index * 0.075,
                    },
                  }}
                  whileHover={{
                    scale: 1.045,
                    transition: {
                      duration: 0.22,
                    },
                  }}
                >
                  <div className="pointer-events-none flex items-start justify-between gap-5">
                    <span className="font-mono text-[8px] font-bold tracking-[0.28em] text-sky-400">
                      {service.id}
                    </span>

                    <Icon
                      size={17}
                      strokeWidth={1.4}
                      className="text-white/60 transition-colors duration-300 group-hover:text-sky-300"
                    />
                  </div>

                  <div className="pointer-events-none mt-10">
                    <h3 className="max-w-[13rem] text-[13px] font-black uppercase leading-[1.05] tracking-[-0.01em] text-white">
                      {service.title}
                    </h3>

                    <p className="mt-3 line-clamp-2 text-[9px] font-medium leading-relaxed text-slate-400">
                      {service.desc}
                    </p>
                  </div>

                  <div className="pointer-events-none mt-7 flex items-center justify-between border-t border-white/[0.09] pt-4">
                    <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-sky-400 transition-colors duration-300 group-hover:text-sky-300">
                      Explorar
                    </span>

                    <ArrowUpRight
                      size={15}
                      className="text-sky-400 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                    />
                  </div>
                </motion.button>
              </div>
            );
          },
        )}
      </div>

      {/* Mobile static services layout */}
      <div className="relative z-10 mx-auto w-full max-w-[24rem] px-4 pb-20 pt-24 lg:hidden">
        <div className="mb-8 flex items-center justify-center">
          <span className="font-mono text-[11px] uppercase tracking-[0.42em] text-sky-400">
            AXION / SERVIÇOS
          </span>
        </div>

        <div className="grid grid-cols-2 gap-x-4 gap-y-12">
          {serviceAreas.map((service) => {
            const Icon = service.icon;

            return (
              <button
                key={service.slug}
                type="button"
                onClick={onNavigateToServices}
                className="pointer-events-auto min-h-[7.25rem] rounded-[1.65rem] border border-white/10 bg-white/[0.035] p-4 text-left backdrop-blur-sm"
              >
                <div className="pointer-events-none flex items-center justify-between">
                  <span className="font-mono text-[8px] text-sky-400">
                    {service.id}
                  </span>

                  <Icon
                    size={15}
                    className="text-white/60"
                  />
                </div>

                <h3 className="pointer-events-none mt-5 text-[8.5px] font-black uppercase leading-[1.3] text-white">
                  {service.title}
                </h3>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}