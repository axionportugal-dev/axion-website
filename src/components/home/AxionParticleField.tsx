import {
  useEffect,
  useRef,
  type RefObject,
} from 'react';

interface AxionParticleFieldProps {
  morphProgress: number;
  servicesPortfolioProgress?: number;
  opacity?: number;
  sourceElementRef?: RefObject<HTMLElement | null>;
}

interface Fragment {
  sourceX: number;
  sourceY: number;
  sourceW: number;
  sourceH: number;

  logoX: number;
  logoY: number;

  sphereX: number;
  sphereY: number;
  sphereZ: number;

  cloudX: number;
  cloudY: number;
  cloudZ: number;

  burstX: number;
  burstY: number;

  dissolveAt: number;
  brightness: number;
  phase: number;
}

interface ExtraCloudParticle {
  sphereX: number;
  sphereY: number;
  sphereZ: number;

  cloudX: number;
  cloudY: number;
  cloudZ: number;

  size: number;
  brightness: number;
  phase: number;
}

const SAMPLE_WIDTH = 900;
const SAMPLE_HEIGHT = 360;
const TILE_SIZE = 8;

const EXTRA_CLOUD_PARTICLE_COUNT = 2800;

const TAU = Math.PI * 2;
const GOLDEN_ANGLE =
  Math.PI * (3 - Math.sqrt(5));

const clamp01 = (value: number) =>
  Math.min(1, Math.max(0, value));

const lerp = (
  from: number,
  to: number,
  progress: number,
) => from + (to - from) * progress;

const smoothstep = (value: number) => {
  const t = clamp01(value);

  return t * t * (3 - 2 * t);
};

const rangeProgress = (
  value: number,
  start: number,
  end: number,
) => {
  if (end === start) {
    return value >= end ? 1 : 0;
  }

  return clamp01(
    (value - start) /
      (end - start),
  );
};

const seededRandom = (seed: number) => {
  const value =
    Math.sin(seed * 12.9898) *
    43758.5453;

  return value - Math.floor(value);
};

const createCloudPoint = (
  seed: number,
) => {
  /*
   * Volumetric distribution.
   *
   * The actual screen-space cloud becomes an
   * elongated ellipsoid later when different X/Y
   * radii are applied.
   */
  const radius = Math.cbrt(
    seededRandom(seed + 1),
  );

  const theta =
    seededRandom(seed + 101) *
    TAU;

  const phi = Math.acos(
    2 *
      seededRandom(seed + 201) -
      1,
  );

  const sinPhi = Math.sin(phi);

  return {
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
  };
};

export default function AxionParticleField({
  morphProgress,
  servicesPortfolioProgress = 0,
  opacity = 1,
  sourceElementRef,
}: AxionParticleFieldProps) {
  const canvasRef =
    useRef<HTMLCanvasElement | null>(
      null,
    );

  const sourceCanvasRef =
    useRef<HTMLCanvasElement | null>(
      null,
    );

  const fragmentsRef =
    useRef<Fragment[]>([]);

  const extraCloudParticlesRef =
    useRef<ExtraCloudParticle[]>([]);

  const progressRef =
    useRef(morphProgress);

  const servicesPortfolioProgressRef =
    useRef(
      servicesPortfolioProgress,
    );

  const opacityRef =
    useRef(opacity);

  const sourceMetricsRef = useRef({
    drawWidth: SAMPLE_WIDTH,
    drawHeight: SAMPLE_HEIGHT,
    imageAspect: 2.5,
  });

  useEffect(() => {
    progressRef.current =
      clamp01(morphProgress);
  }, [morphProgress]);

  useEffect(() => {
    servicesPortfolioProgressRef.current =
      clamp01(
        servicesPortfolioProgress,
      );
  }, [servicesPortfolioProgress]);

  useEffect(() => {
    opacityRef.current = opacity;
  }, [opacity]);

  /*
   * Extra particles only exist visually as we move
   * towards Portfolio.
   *
   * At Services they are invisible.
   * During sphere -> cloud they progressively appear.
   */
  useEffect(() => {
    const particles: ExtraCloudParticle[] =
      [];

    for (
      let index = 0;
      index <
      EXTRA_CLOUD_PARTICLE_COUNT;
      index += 1
    ) {
      const normalized =
        (index + 0.5) /
        EXTRA_CLOUD_PARTICLE_COUNT;

      const sphereY =
        1 - normalized * 2;

      const horizontalRadius =
        Math.sqrt(
          Math.max(
            0,
            1 -
              sphereY *
                sphereY,
          ),
        );

      const angle =
        GOLDEN_ANGLE * index;

      const cloud =
        createCloudPoint(
          index + 14000,
        );

      particles.push({
        sphereX:
          Math.cos(angle) *
          horizontalRadius,

        sphereY,

        sphereZ:
          Math.sin(angle) *
          horizontalRadius,

        cloudX: cloud.x,
        cloudY: cloud.y,
        cloudZ: cloud.z,

        /*
         * Mostly micro-particles.
         */
        size:
          0.38 +
          seededRandom(
            index + 17000,
          ) *
            0.92,

        brightness:
          0.35 +
          seededRandom(
            index + 18000,
          ) *
            0.65,

        phase:
          seededRandom(
            index + 19000,
          ) *
          TAU,
      });
    }

    extraCloudParticlesRef.current =
      particles;
  }, []);

  /*
   * Convert the real AXION logo into fragments.
   *
   * The same fragments:
   *
   * logo -> sphere -> cloud
   *
   * There is no canvas handoff between sections.
   */
  useEffect(() => {
    const image = new Image();

    image.src =
      '/assets/logowhite.png';

    image.onload = () => {
      const sourceCanvas =
        document.createElement(
          'canvas',
        );

      sourceCanvas.width =
        SAMPLE_WIDTH;

      sourceCanvas.height =
        SAMPLE_HEIGHT;

      const sourceContext =
        sourceCanvas.getContext(
          '2d',
          {
            willReadFrequently: true,
          },
        );

      if (!sourceContext) return;

      const imageAspect =
        image.naturalWidth /
        image.naturalHeight;

      let drawWidth =
        SAMPLE_WIDTH;

      let drawHeight =
        drawWidth /
        imageAspect;

      if (
        drawHeight >
        SAMPLE_HEIGHT
      ) {
        drawHeight =
          SAMPLE_HEIGHT;

        drawWidth =
          drawHeight *
          imageAspect;
      }

      const drawX =
        (SAMPLE_WIDTH -
          drawWidth) /
        2;

      const drawY =
        (SAMPLE_HEIGHT -
          drawHeight) /
        2;

      sourceContext.clearRect(
        0,
        0,
        SAMPLE_WIDTH,
        SAMPLE_HEIGHT,
      );

      sourceContext.drawImage(
        image,
        drawX,
        drawY,
        drawWidth,
        drawHeight,
      );

      const imageData =
        sourceContext.getImageData(
          0,
          0,
          SAMPLE_WIDTH,
          SAMPLE_HEIGHT,
        ).data;

      const fragments: Fragment[] =
        [];

      for (
        let y =
          Math.floor(drawY);
        y <
        drawY + drawHeight;
        y += TILE_SIZE
      ) {
        for (
          let x =
            Math.floor(drawX);
          x <
          drawX + drawWidth;
          x += TILE_SIZE
        ) {
          const tileWidth =
            Math.min(
              TILE_SIZE,
              SAMPLE_WIDTH - x,
            );

          const tileHeight =
            Math.min(
              TILE_SIZE,
              SAMPLE_HEIGHT - y,
            );

          let maxAlpha = 0;

          for (
            let localY = 0;
            localY < tileHeight;
            localY += 2
          ) {
            for (
              let localX = 0;
              localX <
              tileWidth;
              localX += 2
            ) {
              const pixelX =
                x + localX;

              const pixelY =
                y + localY;

              const pixelIndex =
                (pixelY *
                  SAMPLE_WIDTH +
                  pixelX) *
                  4 +
                3;

              maxAlpha =
                Math.max(
                  maxAlpha,
                  imageData[
                    pixelIndex
                  ],
                );
            }
          }

          if (maxAlpha < 24) {
            continue;
          }

          const index =
            fragments.length;

          const cloud =
            createCloudPoint(
              index + 7000,
            );

          fragments.push({
            sourceX: x,
            sourceY: y,
            sourceW:
              tileWidth,
            sourceH:
              tileHeight,

            logoX:
              (x +
                tileWidth / 2 -
                SAMPLE_WIDTH /
                  2) /
              drawWidth,

            logoY:
              (y +
                tileHeight / 2 -
                SAMPLE_HEIGHT /
                  2) /
              drawHeight,

            sphereX: 0,
            sphereY: 0,
            sphereZ: 0,

            cloudX: cloud.x,
            cloudY: cloud.y,
            cloudZ: cloud.z,

            burstX:
              seededRandom(
                index + 1100,
              ) *
                2 -
              1,

            burstY:
              seededRandom(
                index + 2300,
              ) *
                2 -
              1,

            dissolveAt:
              0.035 +
              seededRandom(
                index + 3700,
              ) *
                0.34,

            brightness:
              0.55 +
              seededRandom(
                index + 4900,
              ) *
                0.45,

            phase:
              seededRandom(
                index + 6100,
              ) *
              TAU,
          });
        }
      }

      /*
       * Every real logo fragment receives its original
       * destination on the Fibonacci sphere.
       */
      const fragmentCount =
        fragments.length;

      fragments.forEach(
        (fragment, index) => {
          const normalized =
            (index + 0.5) /
            fragmentCount;

          const sphereY =
            1 -
            normalized * 2;

          const horizontalRadius =
            Math.sqrt(
              Math.max(
                0,
                1 -
                  sphereY *
                    sphereY,
              ),
            );

          const angle =
            GOLDEN_ANGLE *
            index;

          fragment.sphereX =
            Math.cos(angle) *
            horizontalRadius;

          fragment.sphereY =
            sphereY;

          fragment.sphereZ =
            Math.sin(angle) *
            horizontalRadius;
        },
      );

      sourceCanvasRef.current =
        sourceCanvas;

      fragmentsRef.current =
        fragments;

      sourceMetricsRef.current =
        {
          drawWidth,
          drawHeight,
          imageAspect,
        };
    };
  }, []);

  useEffect(() => {
    const canvas =
      canvasRef.current;

    if (!canvas) return;

    const context =
      canvas.getContext('2d');

    if (!context) return;

    let frame = 0;
    let width = 0;
    let height = 0;
    let pixelRatio = 1;

    const resize = () => {
      const rect =
        canvas.getBoundingClientRect();

      width = rect.width;
      height = rect.height;

      pixelRatio = Math.min(
        window.devicePixelRatio ||
          1,
        2,
      );

      canvas.width =
        Math.round(
          width * pixelRatio,
        );

      canvas.height =
        Math.round(
          height * pixelRatio,
        );

      context.setTransform(
        pixelRatio,
        0,
        0,
        pixelRatio,
        0,
        0,
      );
    };

    resize();

    const resizeObserver =
      new ResizeObserver(
        resize,
      );

    resizeObserver.observe(
      canvas,
    );

    const draw = (
      timestamp: number,
    ) => {
      context.clearRect(
        0,
        0,
        width,
        height,
      );

      const sourceCanvas =
        sourceCanvasRef.current;

      const fragments =
        fragmentsRef.current;

      if (
        !sourceCanvas ||
        fragments.length === 0
      ) {
        frame =
          window.requestAnimationFrame(
            draw,
          );

        return;
      }

      const logoProgress =
        progressRef.current;

      const rawCloudProgress =
        servicesPortfolioProgressRef.current;

      /*
      * 0.00 -> 0.18
      * Keep the sphere intact while Services disappear.
      *
      * 0.18 -> 0.82
      * Sphere morphs into the Portfolio cloud.
      *
      * 0.82 -> 1.00
      * Keep the cloud intact while Portfolio UI appears.
      *
      * Because this uses the same progress in both directions,
      * reversing the scroll automatically reverses the sequence.
      */
      const cloudProgress =
        smoothstep(
          rangeProgress(
            rawCloudProgress,
            0.18,
            0.82,
          ),
        );

      const globalOpacity =
        opacityRef.current;

      const {
        drawWidth,
        drawHeight,
        imageAspect,
      } =
        sourceMetricsRef.current;

      /*
       * Exact Hero logo position.
       */
      let logoCenterX =
        width / 2;

      let logoCenterY =
        height / 2;

      let logoWidth =
        Math.min(
          width * 0.52,
          800,
        );

      let logoHeight =
        logoWidth /
        imageAspect;

      const sourceElement =
        sourceElementRef?.current;

      if (
        sourceElement &&
        logoProgress < 0.98
      ) {
        const rect =
          sourceElement.getBoundingClientRect();

        logoCenterX =
          rect.left +
          rect.width / 2;

        logoCenterY =
          rect.top +
          rect.height / 2;

        logoWidth =
          rect.width;

        logoHeight =
          logoWidth /
          imageAspect;

        if (
          logoHeight >
          rect.height
        ) {
          logoHeight =
            rect.height;

          logoWidth =
            logoHeight *
            imageAspect;
        }
      }

      const scaleX =
        logoWidth /
        drawWidth;

      const scaleY =
        logoHeight /
        drawHeight;

      const baseDimension =
        Math.min(
          width,
          height,
        );

      const sphereCenterX =
        width / 2;

      const sphereCenterY =
        height / 2;

      const cloudCenterX =
        width / 2;

      /*
       * Slight visual lift relative to exact centre.
       */
      const cloudCenterY =
        height * 0.485;

      const sphereRadius =
        baseDimension * 0.115;

      /*
       * Final Portfolio cloud.
       *
       * Wide and flatter than the sphere.
       */
      const cloudRadiusX =
        baseDimension * 0.60;

      const cloudRadiusY =
        baseDimension * 0.36;

      const time =
        timestamp * 0.00024;

      /*
       * Sphere continues the same slow rotation.
       */
      const sphereRotationY =
        time;

      const sphereRotationX =
        Math.sin(
          time * 0.7,
        ) * 0.2;

      const sphereCosY =
        Math.cos(
          sphereRotationY,
        );

      const sphereSinY =
        Math.sin(
          sphereRotationY,
        );

      const sphereCosX =
        Math.cos(
          sphereRotationX,
        );

      const sphereSinX =
        Math.sin(
          sphereRotationX,
        );

      /*
       * Cloud rotates much more slowly.
       * It should feel alive, not like another sphere.
       */
      const cloudRotationY =
        time * 0.22;

      const cloudCosY =
        Math.cos(
          cloudRotationY,
        );

      const cloudSinY =
        Math.sin(
          cloudRotationY,
        );

      const burstDistance =
        baseDimension * 0.14;

      const drawWhitePoint = (
        x: number,
        y: number,
        size: number,
        alpha: number,
        glow: boolean,
      ) => {
        if (alpha <= 0.002) {
          return;
        }

        context.beginPath();

        context.arc(
          x,
          y,
          Math.max(
            0.3,
            size,
          ),
          0,
          TAU,
        );

        context.fillStyle =
          `rgba(255,255,255,${Math.min(
            1,
            alpha,
          )})`;

        context.fill();

        if (glow) {
          context.beginPath();

          context.arc(
            x,
            y,
            Math.max(
              0.8,
              size * 2.7,
            ),
            0,
            TAU,
          );

          context.fillStyle =
            `rgba(255,255,255,${Math.min(
              0.12,
              alpha * 0.09,
            )})`;

          context.fill();
        }
      };

      /*
       * Real fragments from the AXION logo.
       */
      fragments.forEach(
        (fragment) => {
          const localProgress =
            clamp01(
              (logoProgress -
                fragment.dissolveAt) /
                (1 -
                  fragment.dissolveAt),
            );

          const logoMorph =
            smoothstep(
              localProgress,
            );

          /*
           * Original logo position.
           */
          const logoX =
            logoCenterX +
            fragment.logoX *
              logoWidth;

          const logoY =
            logoCenterY +
            fragment.logoY *
              logoHeight;

          /*
           * SPHERE POSITION
           */

          const sphereRotatedX =
            fragment.sphereX *
              sphereCosY -
            fragment.sphereZ *
              sphereSinY;

          let sphereRotatedZ =
            fragment.sphereX *
              sphereSinY +
            fragment.sphereZ *
              sphereCosY;

          const sphereRotatedY =
            fragment.sphereY *
              sphereCosX -
            sphereRotatedZ *
              sphereSinX;

          sphereRotatedZ =
            fragment.sphereY *
              sphereSinX +
            sphereRotatedZ *
              sphereCosX;

          const sphereDepth =
            (sphereRotatedZ +
              1) /
            2;

          const spherePerspective =
            1 /
            (1.3 -
              sphereRotatedZ *
                0.18);

          const sphereX =
            sphereCenterX +
            sphereRotatedX *
              sphereRadius *
              spherePerspective;

          const sphereY =
            sphereCenterY +
            sphereRotatedY *
              sphereRadius *
              spherePerspective;

          /*
           * CLOUD POSITION
           */

          const cloudNoise =
            Math.sin(
              timestamp *
                0.00035 +
                fragment.phase,
            );

          const cloudPX =
            fragment.cloudX *
            (1 +
              cloudNoise *
                0.025);

          const cloudPY =
            fragment.cloudY *
            (1 +
              cloudNoise *
                0.018);

          const cloudPZ =
            fragment.cloudZ *
            (1 +
              cloudNoise *
                0.035);

          const cloudRotatedX =
            cloudPX *
              cloudCosY -
            cloudPZ *
              cloudSinY;

          const cloudRotatedZ =
            cloudPX *
              cloudSinY +
            cloudPZ *
              cloudCosY;

          const cloudDepth =
            (cloudRotatedZ +
              1) /
            2;

          const cloudPerspective =
            1 /
            (1.19 -
              cloudRotatedZ *
                0.105);

          const cloudX =
            cloudCenterX +
            cloudRotatedX *
              cloudRadiusX *
              cloudPerspective;

          const cloudY =
            cloudCenterY +
            cloudPY *
              cloudRadiusY *
              cloudPerspective;

          /*
           * Sphere -> Cloud.
           */
          const destinationX =
            lerp(
              sphereX,
              cloudX,
              cloudProgress,
            );

          const destinationY =
            lerp(
              sphereY,
              cloudY,
              cloudProgress,
            );

          /*
           * Hero disintegration burst disappears once the
           * Services -> Portfolio morph begins.
           */
          const burstEnvelope =
            Math.sin(
              localProgress *
                Math.PI,
            ) *
            (1 -
              cloudProgress);

          const burstX =
            fragment.burstX *
            burstDistance *
            burstEnvelope;

          const burstY =
            fragment.burstY *
            burstDistance *
            burstEnvelope;

          const x =
            lerp(
              logoX,
              destinationX,
              logoMorph,
            ) + burstX;

          const y =
            lerp(
              logoY,
              destinationY,
              logoMorph,
            ) + burstY;

          /*
           * Real image fragment while the Hero logo breaks.
           */
          const fragmentFade =
            1 -
            clamp01(
              localProgress /
                0.23,
            );

          if (
            fragmentFade >
            0.005
          ) {
            const shrink =
              1 -
              clamp01(
                localProgress /
                  0.26,
              ) *
                0.65;

            const fragmentWidth =
              fragment.sourceW *
              scaleX *
              shrink;

            const fragmentHeight =
              fragment.sourceH *
              scaleY *
              shrink;

            context.save();

            context.globalAlpha =
              fragmentFade *
              globalOpacity;

            context.translate(
              x,
              y,
            );

            context.rotate(
              fragment.burstX *
                localProgress *
                0.28,
            );

            context.drawImage(
              sourceCanvas,
              fragment.sourceX,
              fragment.sourceY,
              fragment.sourceW,
              fragment.sourceH,
              -fragmentWidth / 2,
              -fragmentHeight / 2,
              fragmentWidth,
              fragmentHeight,
            );

            context.restore();
          }

          const pointReveal =
            clamp01(
              (localProgress -
                0.035) /
                0.18,
            );

          if (
            pointReveal <= 0
          ) {
            return;
          }

          const twinkle =
            0.86 +
            Math.sin(
              timestamp *
                0.0016 +
                fragment.phase,
            ) *
              0.14;

          /*
           * Sphere points can be slightly larger.
           * Cloud becomes finer / dustier.
           */
          const spherePointSize =
            (0.68 +
              sphereDepth *
                1.45) *
            twinkle;

          const cloudPointSize =
            (0.44 +
              fragment.brightness *
                0.9 +
              cloudDepth *
                0.22) *
            twinkle;

          const pointSize =
            lerp(
              spherePointSize,
              cloudPointSize,
              cloudProgress,
            );

          const sphereAlpha =
            pointReveal *
            fragment.brightness *
            (0.24 +
              sphereDepth *
                0.7) *
            twinkle;

          const cloudAlpha =
            pointReveal *
            fragment.brightness *
            (0.42 +
              cloudDepth *
                0.55) *
            twinkle;

          /*
          * Interpolate brightness together with the
          * sphere -> cloud transformation.
          */
          const alpha =
            lerp(
              sphereAlpha,
              cloudAlpha,
              cloudProgress,
            ) *
            globalOpacity;

          drawWhitePoint(
            x,
            y,
            pointSize,
            alpha,
            fragment.brightness >
              0.86 &&
              cloudDepth > 0.68,
          );
        },
      );

      /*
       * Additional Portfolio particles.
       *
       * These progressively reveal during the morph,
       * so the sphere genuinely becomes denser instead
       * of simply stretching.
       */
      const extraReveal =
        smoothstep(
          rangeProgress(
            cloudProgress,
            0.16,
            0.78,
          ),
        );

      const extraMovement =
        smoothstep(
          rangeProgress(
            cloudProgress,
            0.05,
            1,
          ),
        );

      if (
        extraReveal >
        0.001
      ) {
        extraCloudParticlesRef.current.forEach(
          (
            particle,
            index,
          ) => {
            /*
            * Starting position on the sphere.
            */
            const sphereRotatedX =
              particle.sphereX *
                sphereCosY -
              particle.sphereZ *
                sphereSinY;

            let sphereRotatedZ =
              particle.sphereX *
                sphereSinY +
              particle.sphereZ *
                sphereCosY;

            const sphereRotatedY =
              particle.sphereY *
                sphereCosX -
              sphereRotatedZ *
                sphereSinX;

            sphereRotatedZ =
              particle.sphereY *
                sphereSinX +
              sphereRotatedZ *
                sphereCosX;

            const spherePerspective =
              1 /
              (1.3 -
                sphereRotatedZ *
                  0.18);

            const startX =
              sphereCenterX +
              sphereRotatedX *
                sphereRadius *
                spherePerspective;

            const startY =
              sphereCenterY +
              sphereRotatedY *
                sphereRadius *
                spherePerspective;

            /*
            * Final cloud position.
            */
            const organicNoise =
              Math.sin(
                timestamp *
                  0.00042 +
                  particle.phase,
              );

            const cloudPX =
              particle.cloudX *
              (1 +
                organicNoise *
                  0.03);

            const cloudPY =
              particle.cloudY *
              (1 +
                organicNoise *
                  0.02);

            const cloudPZ =
              particle.cloudZ *
              (1 +
                organicNoise *
                  0.04);

            const cloudRotatedX =
              cloudPX *
                cloudCosY -
              cloudPZ *
                cloudSinY;

            const cloudRotatedZ =
              cloudPX *
                cloudSinY +
              cloudPZ *
                cloudCosY;

            const depth =
              (cloudRotatedZ +
                1) /
              2;

            const perspective =
              1 /
              (1.19 -
                cloudRotatedZ *
                  0.105);

            const targetX =
              cloudCenterX +
              cloudRotatedX *
                cloudRadiusX *
                perspective;

            const targetY =
              cloudCenterY +
              cloudPY *
                cloudRadiusY *
                perspective;

            const x =
              lerp(
                startX,
                targetX,
                extraMovement,
              );

            const y =
              lerp(
                startY,
                targetY,
                extraMovement,
              );

            const twinkle =
              0.82 +
              Math.sin(
                timestamp *
                  0.0012 +
                  particle.phase,
              ) *
                0.18;

            const size =
              particle.size *
              (0.82 +
                depth *
                  0.32) *
              twinkle;

            /*
            * Brighter final cloud.
            */
            const alpha =
              extraReveal *
              particle.brightness *
              (0.24 +
                depth *
                  0.58) *
              globalOpacity *
              twinkle;

            /*
            * Only a minority of particles receive a halo.
            */
            const glow =
              index % 43 === 0 &&
              particle.brightness >
                0.68;

            drawWhitePoint(
              x,
              y,
              size,
              alpha,
              glow,
            );
          },
        );
      }

      frame =
        window.requestAnimationFrame(
          draw,
        );
    };

    frame =
      window.requestAnimationFrame(
        draw,
      );

    return () => {
      window.cancelAnimationFrame(
        frame,
      );

      resizeObserver.disconnect();
    };
  }, [sourceElementRef]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 h-full w-full"
    />
  );
}