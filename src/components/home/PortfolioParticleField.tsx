import { useEffect, useRef } from 'react';

interface PortfolioParticleFieldProps {
  activeIndex: number;
}

interface Particle {
  x: number;
  y: number;
  z: number;
  size: number;
  brightness: number;
  phase: number;
  speed: number;
}

const PARTICLE_COUNT = 1500;
const TAU = Math.PI * 2;

const palettes = [
  [56, 189, 248],   // Revissant — cyan
  [96, 165, 250],   // Aura — electric blue
  [186, 230, 253],  // Casas do Beco — blue-white
] as const;

const seededRandom = (seed: number) => {
  const value = Math.sin(seed * 12.9898) * 43758.5453;
  return value - Math.floor(value);
};

export default function PortfolioParticleField({
  activeIndex,
}: PortfolioParticleFieldProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const activeIndexRef = useRef(activeIndex);
  const stateRef = useRef(activeIndex);

  const particlesRef = useRef<Particle[]>([]);

  useEffect(() => {
    activeIndexRef.current = activeIndex;
  }, [activeIndex]);

  useEffect(() => {
    const particles: Particle[] = [];

    for (
      let index = 0;
      index < PARTICLE_COUNT;
      index += 1
    ) {
      /*
       * Distribution inside a volumetric ellipsoid.
       *
       * Using cube-root radius distributes points
       * through the volume rather than concentrating
       * everything in the centre.
       */
      const radius =
        Math.cbrt(
          seededRandom(index + 1),
        );

      const theta =
        seededRandom(index + 1001) * TAU;

      const phi =
        Math.acos(
          2 *
            seededRandom(index + 2001) -
            1,
        );

      const sinPhi = Math.sin(phi);

      particles.push({
        x:
          radius *
          sinPhi *
          Math.cos(theta),

        y:
          radius *
          Math.cos(phi),

        z:
          radius *
          sinPhi *
          Math.sin(theta),

        size:
          0.55 +
          seededRandom(index + 3001) *
            1.65,

        brightness:
          0.35 +
          seededRandom(index + 4001) *
            0.65,

        phase:
          seededRandom(index + 5001) *
          TAU,

        speed:
          0.65 +
          seededRandom(index + 6001) *
            0.8,
      });
    }

    particlesRef.current = particles;
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;

    if (!canvas) return;

    const context = canvas.getContext('2d');

    if (!context) return;

    let animationFrame = 0;
    let width = 0;
    let height = 0;
    let dpr = 1;

    const resize = () => {
      const rect =
        canvas.getBoundingClientRect();

      width = rect.width;
      height = rect.height;

      dpr = Math.min(
        window.devicePixelRatio || 1,
        2,
      );

      canvas.width =
        Math.round(width * dpr);

      canvas.height =
        Math.round(height * dpr);

      context.setTransform(
        dpr,
        0,
        0,
        dpr,
        0,
        0,
      );
    };

    resize();

    const resizeObserver =
      new ResizeObserver(resize);

    resizeObserver.observe(canvas);

    const draw = (timestamp: number) => {
      context.clearRect(
        0,
        0,
        width,
        height,
      );

      context.globalCompositeOperation = 'lighter';

      /*
       * Smoothly interpolate between project states.
       * This prevents the cloud from snapping when
       * activeIndex changes.
       */
      const targetState =
        activeIndexRef.current;

      stateRef.current +=
        (targetState - stateRef.current) *
        0.035;

      const currentState =
        stateRef.current;

      const lowerIndex =
        Math.floor(currentState);

      const upperIndex =
        Math.ceil(currentState);

      const mix =
        currentState - lowerIndex;

      const paletteA =
        palettes[
          ((lowerIndex % palettes.length) +
            palettes.length) %
            palettes.length
        ];

      const paletteB =
        palettes[
          ((upperIndex % palettes.length) +
            palettes.length) %
            palettes.length
        ];

      const red =
        paletteA[0] +
        (paletteB[0] - paletteA[0]) *
          mix;

      const green =
        paletteA[1] +
        (paletteB[1] - paletteA[1]) *
          mix;

      const blue =
        paletteA[2] +
        (paletteB[2] - paletteA[2]) *
          mix;

      const centerX = width / 2;

      /*
       * Slightly below mathematical centre because
       * the project card occupies the visual centre.
       */
      const centerY = height * 0.47;

      const baseRadius =
        Math.min(width, height) * 0.36;

      const time =
        timestamp * 0.00018;

      const rotationY =
        time +
        currentState * 0.48;

      const rotationX =
        Math.sin(time * 0.63) * 0.18;

      const cosY =
        Math.cos(rotationY);

      const sinY =
        Math.sin(rotationY);

      const cosX =
        Math.cos(rotationX);

      const sinX =
        Math.sin(rotationX);

      /*
       * Breathing shape.
       * Each project produces a slightly different
       * internal configuration.
       */
      const projectPulse =
        1 +
        Math.sin(
          currentState * 2.4 +
            timestamp * 0.00055,
        ) *
          0.035;

      for (
        let index = 0;
        index <
        particlesRef.current.length;
        index += 1
      ) {
        const particle =
          particlesRef.current[index];

        /*
         * Small organic deformation.
         */
        const noise =
          Math.sin(
            timestamp *
              0.00045 *
              particle.speed +
              particle.phase +
              currentState,
          );

        let px =
          particle.x *
          (1 + noise * 0.055);

        let py =
          particle.y *
          (1 + noise * 0.035);

        let pz =
          particle.z *
          (1 + noise * 0.07);

        /*
         * Rotate the volume around Y.
         */
        const rotatedX =
          px * cosY -
          pz * sinY;

        let rotatedZ =
          px * sinY +
          pz * cosY;

        /*
         * Small X-axis inclination for stronger
         * perception of 3D volume.
         */
        const rotatedY =
          py * cosX -
          rotatedZ * sinX;

        rotatedZ =
          py * sinX +
          rotatedZ * cosX;

        /*
         * Wider than tall:
         * cloud feels cinematic rather than spherical.
         */
        const radiusX =
          baseRadius *
          1.75 *
          projectPulse;

        const radiusY =
          baseRadius *
          1.02 *
          projectPulse;

        const depth =
          (rotatedZ + 1) / 2;

        const perspective =
          1 /
          (1.28 -
            rotatedZ * 0.2);

        const x =
          centerX +
          rotatedX *
            radiusX *
            perspective;

        const y =
          centerY +
          rotatedY *
            radiusY *
            perspective;

        const twinkle =
          0.78 +
          Math.sin(
            timestamp * 0.0013 +
              particle.phase,
          ) *
            0.22;

        const size =
          particle.size *
          (0.8 + depth * 1.45) *
          twinkle;

        /*
         * Rear particles stay subtle.
         * Front particles gain presence.
         */
        const alpha =
          particle.brightness *
          (0.16 + depth * 0.58) *
          twinkle;

        context.beginPath();

        context.arc(
          x,
          y,
          Math.max(0.35, size),
          0,
          TAU,
        );

        context.fillStyle =
          `rgba(${Math.round(red)}, ` +
          `${Math.round(green)}, ` +
          `${Math.round(blue)}, ` +
          `${Math.min(alpha, 0.72)})`;

        context.fill();

        /*
         * Only a small percentage receives glow.
         * Otherwise the cloud becomes fog.
         */
        if (
          depth > 0.68 &&
          particle.brightness > 0.72
        ) {
          context.beginPath();

          context.arc(
            x,
            y,
            size * 3.4,
            0,
            TAU,
          );

          context.fillStyle =
            `rgba(${Math.round(red)}, ` +
            `${Math.round(green)}, ` +
            `${Math.round(blue)}, ` +
            `${alpha * 0.14})`;

          context.fill();
        }
      }

      context.globalCompositeOperation = 'source-over';

      animationFrame =
        window.requestAnimationFrame(draw);
    };

    animationFrame =
      window.requestAnimationFrame(draw);

    return () => {
      window.cancelAnimationFrame(
        animationFrame,
      );

      resizeObserver.disconnect();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 z-[15] h-full w-full"
    />
  );
}