import {
  useEffect,
  useRef,
  type RefObject,
} from 'react';

export type ServicesParticleShape =
  | 'cloud'
  | 'branding-identidade'
  | 'websites'
  | 'marketing-digital'
  | 'gestao-redes-sociais'
  | 'crm-automacao'
  | 'inteligencia-artificial';

interface ServicesParticleStageProps {
  scrollPositionRef: RefObject<number>;
  reduceMotion?: boolean | null;
}

interface Point {
  x: number;
  y: number;
}

interface Particle {
  size: number;
  brightness: number;
  phase: number;
}

const PARTICLE_COUNT = 2400;
const TAU = Math.PI * 2;

export const SERVICES_PARTICLE_SHAPES: readonly ServicesParticleShape[] = [
  'cloud',
  'branding-identidade',
  'websites',
  'marketing-digital',
  'gestao-redes-sociais',
  'crm-automacao',
  'inteligencia-artificial',
] as const;

const seededRandom = (seed: number) => {
  const value =
    Math.sin(seed * 12.9898) *
    43758.5453;

  return value - Math.floor(value);
};

const lerp = (
  from: number,
  to: number,
  progress: number,
) => from + (to - from) * progress;

const pointOnLine = (
  a: Point,
  b: Point,
  progress: number,
): Point => ({
  x: lerp(a.x, b.x, progress),
  y: lerp(a.y, b.y, progress),
});

const pointOnPolyline = (
  points: Point[],
  progress: number,
): Point => {
  const segmentCount =
    points.length - 1;

  const scaled =
    progress * segmentCount;

  const segment = Math.min(
    segmentCount - 1,
    Math.floor(scaled),
  );

  const local =
    scaled - segment;

  return pointOnLine(
    points[segment],
    points[segment + 1],
    local,
  );
};

const createCloudPoint = (
  index: number,
): Point => {
  const angle =
    seededRandom(index + 100) *
    TAU;

  const radius =
    Math.pow(
      seededRandom(index + 200),
      0.56,
    );

  const turbulenceX =
    (
      seededRandom(index + 300) -
      0.5
    ) * 0.22;

  const turbulenceY =
    (
      seededRandom(index + 400) -
      0.5
    ) * 0.16;

  return {
    x:
      Math.cos(angle) *
        radius *
        1.22 +
      turbulenceX,

    y:
      Math.sin(angle) *
        radius *
        0.64 +
      turbulenceY,
  };
};

const createBrandPoint = (
  index: number,
): Point => {
  const selector =
    seededRandom(index + 1000);

  if (selector < 0.58) {
    const diamond = [
      { x: 0, y: -0.88 },
      { x: 0.78, y: 0 },
      { x: 0, y: 0.88 },
      { x: -0.78, y: 0 },
      { x: 0, y: -0.88 },
    ];

    return pointOnPolyline(
      diamond,
      seededRandom(index + 1100),
    );
  }

  if (selector < 0.84) {
    const angle =
      seededRandom(index + 1200) *
      TAU;

    return {
      x:
        Math.cos(angle) *
        0.42,

      y:
        Math.sin(angle) *
        0.42,
    };
  }

  const angle =
    seededRandom(index + 1300) *
    TAU;

  const radius =
    Math.sqrt(
      seededRandom(index + 1400),
    ) * 0.32;

  return {
    x: Math.cos(angle) * radius,
    y: Math.sin(angle) * radius,
  };
};

const createWebPoint = (
  index: number,
): Point => {
  const selector =
    seededRandom(index + 2000);

  if (selector < 0.52) {
    const browser = [
      { x: -0.88, y: -0.65 },
      { x: 0.88, y: -0.65 },
      { x: 0.88, y: 0.65 },
      { x: -0.88, y: 0.65 },
      { x: -0.88, y: -0.65 },
    ];

    return pointOnPolyline(
      browser,
      seededRandom(index + 2100),
    );
  }

  if (selector < 0.65) {
    return pointOnLine(
      { x: -0.88, y: -0.42 },
      { x: 0.88, y: -0.42 },
      seededRandom(index + 2200),
    );
  }

  if (selector < 0.77) {
    const dotIndex =
      index % 3;

    const centerX =
      -0.7 +
      dotIndex * 0.14;

    const angle =
      seededRandom(index + 2300) *
      TAU;

    return {
      x:
        centerX +
        Math.cos(angle) *
          0.04,

      y:
        -0.535 +
        Math.sin(angle) *
          0.04,
    };
  }

  const columns = [
    [-0.65, -0.25, -0.65, 0.38],
    [-0.18, -0.25, -0.18, 0.38],
    [0.3, -0.25, 0.3, 0.38],
    [0.63, -0.25, 0.63, 0.38],
  ];

  const column =
    columns[index % columns.length];

  return pointOnLine(
    {
      x: column[0],
      y: column[1],
    },
    {
      x: column[2],
      y: column[3],
    },
    seededRandom(index + 2400),
  );
};

const createMarketingPoint = (
  index: number,
): Point => {
  const selector =
    seededRandom(index + 3000);

  if (selector < 0.7) {
    const radii = [
      0.23,
      0.46,
      0.72,
    ];

    const radius =
      radii[index % radii.length];

    const angle =
      seededRandom(index + 3100) *
      TAU;

    return {
      x:
        Math.cos(angle) *
        radius,

      y:
        Math.sin(angle) *
        radius,
    };
  }

  if (selector < 0.88) {
    return pointOnLine(
      { x: -0.46, y: 0.46 },
      { x: 0.72, y: -0.72 },
      seededRandom(index + 3200),
    );
  }

  const arrowProgress =
    seededRandom(index + 3300);

  if (index % 2 === 0) {
    return pointOnLine(
      { x: 0.72, y: -0.72 },
      { x: 0.28, y: -0.64 },
      arrowProgress,
    );
  }

  return pointOnLine(
    { x: 0.72, y: -0.72 },
    { x: 0.64, y: -0.28 },
    arrowProgress,
  );
};

const createSocialPoint = (
  index: number,
): Point => {
  const selector =
    seededRandom(index + 4000);

  /*
   * Rounded chat bubble
   */
  const bubble = [
    { x: -0.72, y: -0.52 },
    { x: 0.72, y: -0.52 },
    { x: 0.72, y: 0.22 },
    { x: 0.24, y: 0.22 },
    { x: 0.06, y: 0.54 },
    { x: -0.02, y: 0.22 },
    { x: -0.72, y: 0.22 },
    { x: -0.72, y: -0.52 },
  ];

  if (selector < 0.48) {
    return pointOnPolyline(
      bubble,
      seededRandom(index + 4100),
    );
  }

  /*
   * Three text lines inside
   */
  if (selector < 0.76) {
    const row = index % 3;

    const y =
      row === 0
        ? -0.2
        : row === 1
          ? 0.0
          : 0.2;

    const halfWidth =
      row === 1 ? 0.46 : 0.56;

    return pointOnLine(
      { x: -halfWidth, y },
      { x: halfWidth, y },
      seededRandom(index + 4200),
    );
  }

  /*
   * Notification circle
   */
  const angle =
    seededRandom(index + 4300) * TAU;

  return {
    x:
      -0.42 +
      Math.cos(angle) * 0.11,
    y:
      -0.24 +
      Math.sin(angle) * 0.11,
  };
};

const crmNodes: Point[] = [
  { x: -0.72, y: -0.5 },
  { x: -0.2, y: -0.22 },
  { x: 0.44, y: -0.58 },
  { x: 0.72, y: 0.08 },
  { x: 0.2, y: 0.48 },
  { x: -0.52, y: 0.5 },
  { x: 0, y: 0.04 },
];

const crmEdges = [
  [0, 1],
  [1, 2],
  [2, 3],
  [3, 4],
  [4, 5],
  [5, 0],
  [1, 6],
  [2, 6],
  [4, 6],
  [5, 6],
] as const;

const createCrmPoint = (
  index: number,
): Point => {
  const selector =
    seededRandom(index + 5000);

  if (selector < 0.46) {
    const node =
      crmNodes[
        index % crmNodes.length
      ];

    const angle =
      seededRandom(index + 5100) *
      TAU;

    const radius =
      0.055 +
      seededRandom(index + 5200) *
        0.035;

    return {
      x:
        node.x +
        Math.cos(angle) *
          radius,

      y:
        node.y +
        Math.sin(angle) *
          radius,
    };
  }

  const edge =
    crmEdges[
      index % crmEdges.length
    ];

  return pointOnLine(
    crmNodes[edge[0]],
    crmNodes[edge[1]],
    seededRandom(index + 5300),
  );
};

const aiProfileOutline: Point[] = [
  { x: 0.48, y: 0.78 },
  { x: 0.36, y: 0.56 },
  { x: 0.46, y: 0.3 },
  { x: 0.58, y: 0.02 },
  { x: 0.62, y: -0.3 },
  { x: 0.54, y: -0.55 },
  { x: 0.34, y: -0.75 },
  { x: 0.08, y: -0.87 },
  { x: -0.22, y: -0.86 },
  { x: -0.44, y: -0.74 },
  { x: -0.55, y: -0.57 },
  { x: -0.58, y: -0.4 },
  { x: -0.66, y: -0.28 },
  { x: -0.79, y: -0.15 },
  { x: -0.63, y: -0.09 },
  { x: -0.67, y: -0.01 },
  { x: -0.75, y: 0.04 },
  { x: -0.65, y: 0.1 },
  { x: -0.64, y: 0.22 },
  { x: -0.53, y: 0.34 },
  { x: -0.34, y: 0.42 },
  { x: -0.1, y: 0.43 },
  { x: -0.03, y: 0.78 },
  { x: 0.48, y: 0.78 },
];




const aiPupilCenter: Point = {
  x: -0.4,
  y: -0.30,
};

const aiPupilRadius = 0.028;

/*
 * AI shape: human profile + single eye point.
 */
const createBrainPoint = (
  index: number,
): Point => {
  const selector =
    seededRandom(index + 6000);

  /*
   * Quase todas as partículas desenham
   * apenas a silhueta da cabeça.
   */
  if (selector < 0.88) {
    return pointOnPolyline(
      aiProfileOutline,
      seededRandom(index + 6100),
    );
  }

  /*
   * Pequeno ponto luminoso para o olho.
   */
  const angle =
    seededRandom(index + 6200) * TAU;

  const radius =
    aiPupilRadius *
    Math.sqrt(
      seededRandom(index + 6300),
    );

  return {
    x:
      aiPupilCenter.x +
      Math.cos(angle) * radius,

    y:
      aiPupilCenter.y +
      Math.sin(angle) * radius,
  };
};

const createShapePoint = (
  shape: ServicesParticleShape,
  index: number,
): Point => {
  switch (shape) {
    case 'branding-identidade':
      return createBrandPoint(index);

    case 'websites':
      return createWebPoint(index);

    case 'marketing-digital':
      return createMarketingPoint(index);

    case 'gestao-redes-sociais':
      return createSocialPoint(index);

    case 'crm-automacao':
      return createCrmPoint(index);

    case 'inteligencia-artificial':
      return createBrainPoint(index);

    case 'cloud':
    default:
      return createCloudPoint(index);
  }
};

export default function ServicesParticleStage({
  scrollPositionRef,
  reduceMotion = false,
}: ServicesParticleStageProps) {
  const canvasRef =
    useRef<HTMLCanvasElement | null>(null);

  const particlesRef =
    useRef<Particle[]>([]);

  const shapePointsRef =
    useRef<Record<ServicesParticleShape, Point[]> | null>(
      null,
    );

  /*
   * Build every destination once.
   *
   * The particle with index N always maps to index N in every shape. During
   * scrolling we only interpolate between two precomputed points, so a fast
   * direction change cannot leave any animation queued in the background.
   */
  if (shapePointsRef.current === null) {
    const shapePoints =
      {} as Record<ServicesParticleShape, Point[]>;

    SERVICES_PARTICLE_SHAPES.forEach((shape) => {
      shapePoints[shape] = Array.from(
        { length: PARTICLE_COUNT },
        (_, index) => createShapePoint(shape, index),
      );
    });

    shapePointsRef.current = shapePoints;
  }

  if (particlesRef.current.length === 0) {
    particlesRef.current = Array.from(
      { length: PARTICLE_COUNT },
      (_, index) => ({
        size:
          0.65 +
          seededRandom(index + 7000) * 1.55,

        brightness:
          0.58 +
          seededRandom(index + 8000) * 0.62,

        phase:
          seededRandom(index + 9000) * TAU,
      }),
    );
  }

  useEffect(() => {
    const canvas = canvasRef.current;

    if (!canvas) return;

    const context = canvas.getContext('2d');

    if (!context) return;

    let frame = 0;
    let width = 0;
    let height = 0;
    let dpr = 1;

    const resize = () => {
      const rect = canvas.getBoundingClientRect();

      width = rect.width;
      height = rect.height;

      dpr = Math.min(
        window.devicePixelRatio || 1,
        2,
      );

      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);

      context.setTransform(
        dpr,
        0,
        0,
        dpr,
        0,
        0,
      );
    };

    const clamp = (
      value: number,
      minimum: number,
      maximum: number,
    ) => Math.min(maximum, Math.max(minimum, value));

    const projectPoint = (
      point: Point,
      shape: ServicesParticleShape,
    ): Point => {
      const baseDimension = Math.min(width, height);
      const isCloud = shape === 'cloud';

      const scale = isCloud
        ? 1.12
        : width < 900
          ? 0.62
          : 0.78;

      const centreX = width * (
        isCloud
          ? 0.5
          : width < 900
            ? 0.5
            : 0.27
      );

      const centreY = height * (
        isCloud
          ? 0.47
          : width < 900
            ? 0.34
            : 0.51
      );

      if (isCloud) {
        return {
          x:
            centreX +
            point.x *
              baseDimension *
              0.62 *
              scale,

          y:
            centreY +
            point.y *
              baseDimension *
              0.36 *
              scale,
        };
      }

      const shapeRadius =
        baseDimension * 0.38 * scale;

      return {
        x: centreX + point.x * shapeRadius,
        y: centreY + point.y * shapeRadius,
      };
    };

    resize();

    const observer = new ResizeObserver(resize);
    observer.observe(canvas);

    const draw = (timestamp: number) => {
      context.clearRect(0, 0, width, height);

      const lastShapeIndex =
        SERVICES_PARTICLE_SHAPES.length - 1;

      const rawPosition = clamp(
        scrollPositionRef.current,
        0,
        lastShapeIndex,
      );

      let fromIndex = Math.floor(rawPosition);
      let toIndex = Math.min(
        fromIndex + 1,
        lastShapeIndex,
      );

      let morphProgress =
        rawPosition - fromIndex;

      if (fromIndex >= lastShapeIndex) {
        fromIndex = lastShapeIndex;
        toIndex = lastShapeIndex;
        morphProgress = 0;
      }

      if (reduceMotion) {
        if (morphProgress >= 0.5) {
          fromIndex = toIndex;
        }

        toIndex = fromIndex;
        morphProgress = 0;
      }

      const fromShape =
        SERVICES_PARTICLE_SHAPES[fromIndex];

      const toShape =
        SERVICES_PARTICLE_SHAPES[toIndex];

      const shapePoints = shapePointsRef.current!;
      const fromPoints = shapePoints[fromShape];
      const toPoints = shapePoints[toShape];

      const fromCloudWeight =
        fromShape === 'cloud' ? 1 : 0;

      const toCloudWeight =
        toShape === 'cloud' ? 1 : 0;

      const cloudWeight = lerp(
        fromCloudWeight,
        toCloudWeight,
        morphProgress,
      );

      context.globalCompositeOperation = 'lighter';

      particlesRef.current.forEach(
        (particle, index) => {
          const fromPoint = projectPoint(
            fromPoints[index],
            fromShape,
          );

          const toPoint = projectPoint(
            toPoints[index],
            toShape,
          );

          /*
           * This is the important change:
           * position is a pure function of scroll progress.
           * There is no x += (target - x) easing and therefore no unfinished
           * animation that can continue after the user reverses direction.
           */
          const baseX = lerp(
            fromPoint.x,
            toPoint.x,
            morphProgress,
          );

          const baseY = lerp(
            fromPoint.y,
            toPoint.y,
            morphProgress,
          );

          const ambientX = lerp(
            1.15,
            2.6,
            cloudWeight,
          );

          const ambientY = lerp(
            0.8,
            1.8,
            cloudWeight,
          );

          const x =
            baseX +
            (reduceMotion
              ? 0
              : Math.sin(
                  timestamp * 0.00065 +
                    particle.phase,
                ) * ambientX);

          const y =
            baseY +
            (reduceMotion
              ? 0
              : Math.cos(
                  timestamp * 0.00052 +
                    particle.phase,
                ) * ambientY);

          const twinkle = reduceMotion
            ? 1
            : 0.86 +
              Math.sin(
                timestamp * 0.0014 +
                  particle.phase,
              ) * 0.14;

          const sizeFactor = lerp(
            1.22,
            1.08,
            cloudWeight,
          );

          const alphaFactor = lerp(
            0.92,
            0.78,
            cloudWeight,
          );

          const size =
            particle.size *
            sizeFactor *
            twinkle;

          const alpha =
            particle.brightness *
            alphaFactor *
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
            `rgba(255,255,255,${Math.min(alpha, 1)})`;

          context.fill();

          if (
            index % 14 === 0 ||
            particle.brightness > 0.82
          ) {
            context.beginPath();
            context.arc(
              x,
              y,
              size * 4.2,
              0,
              TAU,
            );

            context.fillStyle =
              `rgba(255,255,255,${Math.min(
                alpha * 0.18,
                0.2,
              )})`;

            context.fill();
          }
        },
      );

      context.globalCompositeOperation = 'source-over';

      frame = window.requestAnimationFrame(draw);
    };

    frame = window.requestAnimationFrame(draw);

    return () => {
      window.cancelAnimationFrame(frame);
      observer.disconnect();
    };
  }, [reduceMotion, scrollPositionRef]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="h-full w-full"
    />
  );
}
