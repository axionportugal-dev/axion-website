import {
  useEffect,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
} from 'react';
import {
  animate,
  motion,
  useMotionValue,
  useReducedMotion,
  useTransform,
  type MotionValue,
} from 'motion/react';
import { ArrowUpRight } from 'lucide-react';
import { serviceAreas } from '../../data/services';
import { COMPACT_SPHERE_CENTER_Y } from './compactLayout';
import ScrollCue from '../ScrollCue';

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
  const glowRefs = useRef<
    (HTMLSpanElement | null)[]
  >([]);
  const angleRef = useRef(0);
  const speedRef = useRef(1);
  const hoveredIndexRef =
    useRef<number | null>(null);
  const prefersReducedMotion =
    useReducedMotion();
  const prefersReducedMotionRef =
    useRef(prefersReducedMotion);
  prefersReducedMotionRef.current =
    prefersReducedMotion;

  // Starts the orbit loop; it stops by itself while the stage is hidden.
  const startOrbitRef = useRef(() => {});

  useEffect(() => {
    const stage = stageRef.current;

    if (!stage) return;

    const measure = () => {
      stageSizeRef.current = {
        width: stage.clientWidth,
        height: stage.clientHeight,
      };

      startOrbitRef.current();
    };

    measure();

    const resizeObserver =
      new ResizeObserver(measure);
    resizeObserver.observe(stage);

    return () =>
      resizeObserver.disconnect();
  }, []);

  /*
   * The desktop orbit is hidden (zero size) on phones and tablets: there
   * the loop stays stopped instead of waking the page every frame.
   */
  const stepOrbit = (delta: number) => {
    const { width, height } =
      stageSizeRef.current;

    if (!width || !height) return false;

    const hoveredIndex =
      hoveredIndexRef.current;

    // Ease to a stop while a card is hovered, then ease back up.
    const targetSpeed =
      prefersReducedMotionRef.current ||
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

        const glow = glowRefs.current[index];

        if (glow) {
          glow.style.opacity =
            depth.toFixed(3);
        }
      },
    );
  
    return true;
  };

  const stepOrbitRef = useRef(stepOrbit);
  stepOrbitRef.current = stepOrbit;

  useEffect(() => {
    let frame = 0;
    let lastTimestamp = 0;

    const tick = (timestamp: number) => {
      // Same 40ms delta cap as motion's frame loop.
      const delta = lastTimestamp
        ? Math.min(timestamp - lastTimestamp, 40)
        : 1000 / 60;

      lastTimestamp = timestamp;

      if (!stepOrbitRef.current(delta)) {
        frame = 0;
        lastTimestamp = 0;
        return;
      }

      frame = requestAnimationFrame(tick);
    };

    startOrbitRef.current = () => {
      if (!frame) frame = requestAnimationFrame(tick);
    };

    startOrbitRef.current();

    return () => {
      cancelAnimationFrame(frame);
      startOrbitRef.current = () => {};
    };
  }, []);

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
                  className="group pointer-events-auto relative w-[clamp(12rem,14.5vw,20rem)] cursor-pointer rounded-[22px] border border-white/[0.13] bg-[#0b1018]/[0.88] p-5 text-left shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] transition-[border-color,background-color] duration-500 hover:border-sky-300/45 hover:bg-[#0d1520]/[0.92] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-sky-400"
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
                    // A leftover blur(0px) still costs a filter pass.
                    transitionEnd: {
                      filter: 'none',
                    },
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
                  {/*
                   * Depth glow: a fixed shadow whose opacity follows the
                   * orbit depth (set by the orbit loop). Same result as
                   * an rgba(..., depth * 0.1) shadow, without repainting
                   * a 70px blur on every frame.
                   */}
                  <span
                    ref={(element) => {
                      glowRefs.current[index] = element;
                    }}
                    aria-hidden="true"
                    className="pointer-events-none absolute -inset-px rounded-[22px] opacity-0 shadow-[0_24px_70px_rgba(56,189,248,0.1)] will-change-[opacity]"
                  />

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

      {/* "Keep scrolling" hint: Portfolio comes next (desktop; phones place it under the front card) */}
      <motion.div
        className="pointer-events-none absolute bottom-10 right-12 z-[150] hidden lg:block"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{
          duration: 0.6,
          delay: 1.1,
        }}
      >
        <ScrollCue label="Portfólio" />
      </motion.div>

      {/* Phones / portrait tablets: touch orbit around the sphere */}
      <div className="absolute inset-0 lg:hidden">
        <ServicesOrbitMobile
          onNavigateToServices={
            onNavigateToServices
          }
        />
      </div>
    </div>
  );
}

/*
 * MOBILE / TABLET ORBIT (real CSS 3D)
 *
 * The six cards ride a 3D elliptical ring centred exactly on the sphere,
 * 60deg apart, seen from slightly above. The ellipse is wider than it is
 * deep (stretched sideways) so it runs off both screen edges, which gives
 * the swipe room to sweep cards in and out. The cards stand upright (only
 * the ring is tilted) and turn partly along the ring. The ring is pushed
 * back into the screen so the front card sits on the screen plane (sharp,
 * unscaled) while the rest recede in true perspective: the near-side cards
 * only peek in at the screen edges, the far-side ones shrink and tuck in
 * beside the sphere, and the card straight behind it fades out. The ring
 * only moves when the visitor swipes left / right, one card per swipe.
 *
 * All distances scale with `base` = min(width, height / 2), so the layout
 * keeps its proportions from small phones to portrait tablets. The values
 * below were solved numerically for those targets (see the geometry notes
 * next to each constant).
 *
 * `position` is a continuous ring index: card i is at the front when
 * position === i.
 */
const RING_STEP_DEG = 360 / serviceAreas.length;
// Horizontal radius: the ellipse's widest point runs ~16px past the screen.
const RING_RADIUS_X = 0.9;
// Depth radius.
const RING_RADIUS_Z = 1.45;
// Camera distance: far cards shrink to ~50%. On screen the ring reads as
// an ellipse ~1.9x wider than it is deep.
const RING_PERSPECTIVE = 2.1;
// Looking down onto the ring (lower = flatter view, more upright front).
const RING_TILT_DEG = 16;
// Cards turn this fraction of the way to the ring's tangent (1 = fully).
const RING_FACING_SOFTEN = 0.45;
// Cards further round than this (degrees from the front) fade out.
const RING_HIDE_FROM_DEG = 150;
const RING_FADE_RANGE_DEG = 22;
const RING_OPACITY_MIN = 0.45;
const RING_FAR_VEIL = 0.6;
// The front-card hover light fades out over this many degrees from the front.
const RING_FRONT_GLOW_DEG = 30;
// Space reserved under the front card: gap + scroll cue + copyright line.
const RING_BOTTOM_RESERVE_PX = 148;
// Gap between the front card and the scroll cue.
const RING_CUE_GAP_PX = 38;

interface RingGeometry {
  width: number;
  height: number;
  cardHeight: number;
}

// Normalise to (-180, 180]: 0 is the front of the ring.
const wrapDegrees = (value: number) => {
  const wrapped =
    (((value + 180) % 360) + 360) % 360;

  return wrapped - 180;
};

const toRadians = (degrees: number) =>
  (degrees * Math.PI) / 180;

// Linear blend between two 0-255 colour channels.
const mixChannel = (
  from: number,
  to: number,
  amount: number,
) => Math.round(from + (to - from) * amount);


function ServicesOrbitMobile({
  onNavigateToServices,
}: ServicesExperienceProps) {
  const position = useMotionValue(0);
  const [geometry, setGeometry] =
    useState<RingGeometry>({
      width: 390,
      height: 844,
      cardHeight: 170,
    });
  const stageRef =
    useRef<HTMLDivElement>(null);
  const dragRef = useRef<{
    startX: number;
    startPosition: number;
    moved: boolean;
  } | null>(null);
  const prefersReducedMotion =
    useReducedMotion();

  useEffect(() => {
    const stage = stageRef.current;

    if (!stage) return;

    const measure = () =>
      setGeometry({
        width: stage.clientWidth,
        height: stage.clientHeight,
        // Untransformed layout height of a card (all cards share a size).
        cardHeight:
          stage.querySelector<HTMLElement>(
            '[data-ring-card]',
          )?.offsetHeight ?? 170,
      });

    measure();

    const observer =
      new ResizeObserver(measure);
    observer.observe(stage);

    return () => observer.disconnect();
  }, []);

  const tilt = toRadians(RING_TILT_DEG);
  const sphereY =
    geometry.height *
    COMPACT_SPHERE_CENTER_Y;

  /*
   * The front card sits RING_RADIUS_Z * sin(tilt) * base below the sphere.
   * Shrink `base` on short screens so the card, the scroll cue and the
   * copyright always fit underneath.
   */
  const frontDropPerBase =
    RING_RADIUS_Z * Math.sin(tilt);
  const roomBelow =
    geometry.height -
    sphereY -
    RING_BOTTOM_RESERVE_PX -
    geometry.cardHeight / 2;
  const base = Math.max(
    120,
    Math.min(
      geometry.width,
      geometry.height / 2,
      roomBelow / frontDropPerBase,
    ),
  );

  const radiusX = base * RING_RADIUS_X;
  const radiusZ = base * RING_RADIUS_Z;
  const perspective =
    base * RING_PERSPECTIVE;
  // Push the ring back so the front card lands on the screen plane.
  const pushBack =
    radiusZ * Math.cos(tilt);
  const frontDrop =
    radiusZ * Math.sin(tilt);
  const cueTop =
    sphereY +
    frontDrop +
    geometry.cardHeight / 2 +
    RING_CUE_GAP_PX;

  const goTo = (target: number) => {
    if (prefersReducedMotion) {
      position.set(target);
      return;
    }

    animate(position, target, {
      type: 'spring',
      stiffness: 170,
      damping: 28,
    });
  };

  // Dragging one slot is roughly the on-screen distance to the next card.
  const slotWidth =
    radiusX *
    Math.sin(toRadians(RING_STEP_DEG)) *
    0.75;

  const handlePointerDown = (
    event: ReactPointerEvent,
  ) => {
    position.stop();
    dragRef.current = {
      startX: event.clientX,
      startPosition: position.get(),
      moved: false,
    };
  };

  const handlePointerMove = (
    event: ReactPointerEvent,
  ) => {
    const drag = dragRef.current;

    if (!drag) return;

    const deltaX =
      event.clientX - drag.startX;

    if (Math.abs(deltaX) > 8) {
      drag.moved = true;
    }

    // Dragging right carries the front card to the right.
    position.set(
      drag.startPosition -
        deltaX / slotWidth,
    );
  };

  const handlePointerUp = (
    event: ReactPointerEvent,
  ) => {
    const drag = dragRef.current;

    if (!drag) return;

    const deltaX =
      event.clientX - drag.startX;

    // A short flick is enough to move one card.
    const bias =
      deltaX > 25
        ? -0.4
        : deltaX < -25
          ? 0.4
          : 0;

    // One card per swipe, however long the gesture.
    const start = Math.round(
      drag.startPosition,
    );
    const target = Math.max(
      start - 1,
      Math.min(
        start + 1,
        Math.round(position.get() + bias),
      ),
    );

    goTo(target);

    // Let the click handler read `moved` before clearing.
    window.setTimeout(() => {
      dragRef.current = null;
    }, 0);
  };

  const handleCardClick = () => {
    if (dragRef.current?.moved) return;

    onNavigateToServices();
  };

  return (
    <div
      ref={stageRef}
      className="absolute inset-0 touch-pan-y select-none"
      style={{
        perspective: `${perspective.toFixed(0)}px`,
        perspectiveOrigin: `50% ${sphereY.toFixed(1)}px`,
      }}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
    >
      {/* The ring: centred on the sphere, pushed back, tilted towards us */}
      <div
        className="absolute left-1/2"
        style={{
          top: `${sphereY.toFixed(1)}px`,
          transformStyle: 'preserve-3d',
          transform: `translateZ(${(-pushBack).toFixed(
            1,
          )}px) rotateX(${-RING_TILT_DEG}deg)`,
        }}
      >
        {/* Orbit trail: the ellipse itself, lying in the ring plane */}
        <motion.div
          aria-hidden="true"
          className="pointer-events-none absolute rounded-[50%] border border-sky-200/[0.12]"
          style={{
            width: radiusX * 2,
            height: radiusZ * 2,
            left: -radiusX,
            top: -radiusZ,
            transform: 'rotateX(90deg)',
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{
            duration: 0.7,
            delay: 0.08,
          }}
        />

        {serviceAreas.map(
          (service, index) => (
            <RingCard
              key={service.slug}
              index={index}
              position={position}
              radiusX={radiusX}
              radiusZ={radiusZ}
              onClick={handleCardClick}
            />
          ),
        )}
      </div>

      {/* "Keep scrolling" hint, always just under the front card */}
      <motion.div
        className="pointer-events-none absolute left-1/2 -translate-x-1/2"
        style={{ top: cueTop }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{
          duration: 0.6,
          delay: 1.1,
        }}
      >
        <ScrollCue label="Portfólio" />
      </motion.div>
    </div>
  );
}

function RingCard({
  index,
  position,
  radiusX,
  radiusZ,
  onClick,
}: {
  index: number;
  position: MotionValue<number>;
  radiusX: number;
  radiusZ: number;
  onClick: () => void;
}) {
  const service = serviceAreas[index];
  const Icon = service.icon;

  // Degrees round the ring from the front (0 = facing the screen).
  const angle = useTransform(
    position,
    (value) =>
      wrapDegrees(
        (index - value) * RING_STEP_DEG,
      ),
  );

  /*
   * Entrance, identical to the desktop cards (fade in, scale 0.92 -> 1,
   * blur 7px -> 0, staggered by index). Multiplied into the ring's own
   * transform / opacity so it never fights the swipe.
   */
  const prefersReducedMotion =
    useReducedMotion();
  const entrance = useMotionValue(
    prefersReducedMotion ? 1 : 0,
  );

  useEffect(() => {
    if (prefersReducedMotion) return;

    const controls = animate(
      entrance,
      1,
      {
        duration: 0.7,
        delay: 0.08 + index * 0.075,
      },
    );

    return () => controls.stop();
  }, [entrance, index, prefersReducedMotion]);

  const transform = useTransform(
    [angle, entrance],
    ([value, appear]: number[]) => {
      const theta = toRadians(value);
      const x = radiusX * Math.sin(theta);
      const z = radiusZ * Math.cos(theta);

      // Face along the ellipse's outward normal.
      let facing =
        (Math.atan2(
          radiusZ * Math.sin(theta),
          radiusX * Math.cos(theta),
        ) *
          180) /
        Math.PI;

      /*
       * Past 90deg a card would show its back. It is edge-on at that
       * moment, so flipping it there is invisible and keeps the text
       * readable on the far side of the ring.
       */
      if (Math.abs(facing) > 90) {
        facing += facing > 0 ? -180 : 180;
      }

      // Soften the turn so the edge cards still show a readable sliver.
      facing *= RING_FACING_SOFTEN;

      // rotateX(+tilt) cancels the ring's tilt: cards stand upright.
      return `translate(-50%, -50%) translate3d(${x.toFixed(
        1,
      )}px, 0px, ${z.toFixed(
        1,
      )}px) rotateX(${RING_TILT_DEG}deg) rotateY(${facing.toFixed(
        2,
      )}deg) scale(${(0.92 + 0.08 * appear).toFixed(3)})`;
    },
  );

  const opacity = useTransform(
    [angle, entrance],
    ([value, appear]: number[]) => {
      const depth =
        (Math.cos(toRadians(value)) + 1) /
        2;

      const backFade = Math.min(
        1,
        Math.max(
          0,
          (RING_HIDE_FROM_DEG -
            Math.abs(value)) /
            RING_FADE_RANGE_DEG,
        ),
      );

      return (
        (RING_OPACITY_MIN +
          (1 - RING_OPACITY_MIN) *
            depth) *
        backFade *
        appear
      );
    },
  );

  const filter = useTransform(
    entrance,
    (appear) =>
      appear >= 0.999
        ? 'none'
        : `blur(${(7 * (1 - appear)).toFixed(2)}px)`,
  );

  // Far cards sink into the dark: a veil is cheaper than CSS filters.
  const veilOpacity = useTransform(
    angle,
    (value) =>
      ((1 - Math.cos(toRadians(value))) /
        2) *
      RING_FAR_VEIL,
  );

  /*
   * The card at the front wears the desktop hover state (sky border, blue
   * glow, lighter surface, sky icon). It fades in as a card reaches the
   * front and out as it leaves, so a swipe hands the light over smoothly.
   */
  const frontGlow = useTransform(
    angle,
    (value) =>
      Math.max(
        0,
        1 -
          Math.abs(value) /
            RING_FRONT_GLOW_DEG,
      ),
  );

  const borderColor = useTransform(
    frontGlow,
    (glow) =>
      `rgba(${mixChannel(255, 125, glow)}, ${mixChannel(
        255,
        211,
        glow,
      )}, ${mixChannel(255, 252, glow)}, ${(
        0.13 +
        (0.45 - 0.13) * glow
      ).toFixed(3)})`,
  );

  const backgroundColor = useTransform(
    frontGlow,
    (glow) =>
      `rgba(${mixChannel(11, 13, glow)}, ${mixChannel(
        16,
        21,
        glow,
      )}, ${mixChannel(24, 32, glow)}, 0.95)`,
  );

  const boxShadow = useTransform(
    frontGlow,
    (glow) =>
      `0 18px 50px rgba(0,0,0,0.45), 0 18px 65px rgba(56,189,248,${(
        0.18 * glow
      ).toFixed(3)}), inset 0 1px 0 rgba(255,255,255,0.06)`,
  );

  const iconColor = useTransform(
    frontGlow,
    (glow) =>
      `rgba(${mixChannel(255, 125, glow)}, ${mixChannel(
        255,
        211,
        glow,
      )}, ${mixChannel(255, 252, glow)}, ${(
        0.6 +
        0.4 * glow
      ).toFixed(3)})`,
  );

  return (
    <motion.button
      type="button"
      data-ring-card
      onClick={onClick}
      aria-label={`Explorar ${service.title}`}
      className="group absolute left-0 top-0 w-[min(10.5rem,42vw)] cursor-pointer rounded-[16px] border p-3.5 text-left focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-sky-400 md:w-[14rem] md:p-4"
      style={{
        transform,
        opacity,
        filter,
        borderColor,
        backgroundColor,
        boxShadow,
      }}
    >
      <motion.span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-10 rounded-[16px] bg-[#010205]"
        style={{ opacity: veilOpacity }}
      />

      <div className="pointer-events-none flex items-start justify-between gap-3">
        <span className="font-mono text-[8px] font-bold tracking-[0.28em] text-sky-400">
          {service.id}
        </span>

        <motion.span
          className="flex"
          style={{ color: iconColor }}
        >
          <Icon
            size={14}
            strokeWidth={1.4}
          />
        </motion.span>
      </div>

      <div className="pointer-events-none mt-4">
        <h3 className="text-[11px] font-black uppercase leading-[1.1] tracking-[-0.01em] text-white md:text-[12px]">
          {service.title}
        </h3>

        <p className="mt-1.5 line-clamp-2 text-[9px] font-medium leading-relaxed text-slate-400">
          {service.desc}
        </p>
      </div>

      <div className="pointer-events-none mt-3 flex items-center justify-between border-t border-white/[0.09] pt-2">
        <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-sky-400">
          Explorar
        </span>

        <ArrowUpRight
          size={12}
          className="text-sky-400"
        />
      </div>
    </motion.button>
  );
}
