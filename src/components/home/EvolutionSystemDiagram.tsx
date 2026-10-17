import { useId } from 'react';
import {
  motion,
  useReducedMotion,
} from 'motion/react';

export type EvolutionStageKey =
  | 'base'
  | 'structure'
  | 'evolution';

type NodeId =
  | 'website'
  | 'management'
  | 'inventory'
  | 'data'
  | 'operations'
  | 'clients'
  | 'ai';

interface EvolutionSystemDiagramProps {
  stage: EvolutionStageKey;
  /*
   * 'portrait' rotates the layout for phones: the same structure laid out
   * top-to-bottom in a narrow canvas, with larger labels.
   */
  orientation?: 'landscape' | 'portrait';
}

interface Point {
  x: number;
  y: number;
}

interface NodeDefinition {
  id: NodeId;
  label: string;
}

const transitionEase =
  [0.16, 1, 0.3, 1] as const;

const nodes: NodeDefinition[] = [
  {
    id: 'website',
    label: 'Website',
  },
  {
    id: 'management',
    label: 'Gestão',
  },
  {
    id: 'inventory',
    label: 'Inventário',
  },
  {
    id: 'data',
    label: 'Dados',
  },
  {
    id: 'operations',
    label: 'Operação',
  },
  {
    id: 'clients',
    label: 'Clientes',
  },
  {
    id: 'ai',
    label: 'AI',
  },
];

const positions: Record<
  EvolutionStageKey,
  Record<NodeId, Point>
> = {
  base: {
    website: {
      x: 120,
      y: 105,
    },
    management: {
      x: 620,
      y: 115,
    },
    inventory: {
      x: 105,
      y: 345,
    },
    data: {
      x: 640,
      y: 335,
    },
    operations: {
      x: 385,
      y: 375,
    },
    clients: {
      x: 355,
      y: 82,
    },
    ai: {
      x: 380,
      y: 35,
    },
  },

  structure: {
    website: {
      x: 155,
      y: 125,
    },
    management: {
      x: 600,
      y: 130,
    },
    inventory: {
      x: 145,
      y: 330,
    },
    data: {
      x: 610,
      y: 325,
    },
    operations: {
      x: 380,
      y: 375,
    },
    clients: {
      x: 380,
      y: 82,
    },
    ai: {
      x: 380,
      y: 40,
    },
  },

  evolution: {
    website: {
      x: 150,
      y: 135,
    },
    management: {
      x: 610,
      y: 140,
    },
    inventory: {
      x: 150,
      y: 335,
    },
    data: {
      x: 610,
      y: 330,
    },
    operations: {
      x: 380,
      y: 380,
    },
    clients: {
      x: 380,
      y: 105,
    },
    ai: {
      x: 380,
      y: 32,
    },
  },
};

const coreLandscape: Point = {
  x: 380,
  y: 235,
};

const LANDSCAPE_SIZE = {
  width: 760,
  height: 430,
};

const PORTRAIT_SIZE = {
  width: 430,
  height: 620,
};

/*
 * Landscape -> portrait: swap the axes and fit the result into the narrow
 * canvas (landscape y 30..380 -> x 75..355, landscape x 100..640 ->
 * y 40..580), keeping every pill inside the frame.
 */
const toPortrait = (
  point: Point,
): Point => ({
  x: 75 + (point.y - 30) * 0.8,
  y: 40 + (point.x - 100),
});

const connectionNodes: NodeId[] = [
  'website',
  'management',
  'inventory',
  'data',
  'operations',
  'clients',
];

export default function EvolutionSystemDiagram({
  stage,
  orientation = 'landscape',
}: EvolutionSystemDiagramProps) {
  const reduceMotion =
    useReducedMotion();

  const isPortrait =
    orientation === 'portrait';

  // Unique SVG ids: desktop and phone diagrams can coexist in the DOM.
  const svgId = useId().replace(/:/g, '');
  const gridId = `system-grid-${svgId}`;
  const glowId = `core-glow-${svgId}`;

  const size = isPortrait
    ? PORTRAIT_SIZE
    : LANDSCAPE_SIZE;

  const project = (point: Point) =>
    isPortrait
      ? toPortrait(point)
      : point;

  const currentPositions =
    Object.fromEntries(
      Object.entries(
        positions[stage],
      ).map(([id, point]) => [
        id,
        project(point),
      ]),
    ) as Record<NodeId, Point>;

  const core = project(coreLandscape);

  // Labels are larger on phones, where the canvas is drawn smaller.
  const nodeFontSize = isPortrait
    ? 11
    : 8;
  const pillWidth = isPortrait
    ? 140
    : 124;
  const pillHeight = isPortrait
    ? 38
    : 34;

  const connectionOpacity =
    stage === 'base'
      ? 0.05
      : stage === 'structure'
        ? 0.42
        : 0.52;

  const coreOpacity =
    stage === 'base'
      ? 0.12
      : 1;

  const aiOpacity =
    stage === 'evolution'
      ? 1
      : 0;

  return (
    <div className="relative h-full min-h-0 w-full overflow-hidden">
      <svg
        viewBox={`0 0 ${size.width} ${size.height}`}
        className="absolute inset-0 h-full w-full"
        fill="none"
        aria-hidden="true"
      >
        {/* Technical grid */}
        <defs>
          <pattern
            id={gridId}
            width="38"
            height="38"
            patternUnits="userSpaceOnUse"
          >
            <path
              d="M 38 0 L 0 0 0 38"
              stroke="#0f172a"
              strokeOpacity="0.035"
              strokeWidth="1"
            />
          </pattern>

          <radialGradient id={glowId}>
            <stop
              offset="0%"
              stopColor="#38bdf8"
              stopOpacity="0.2"
            />
            <stop
              offset="100%"
              stopColor="#38bdf8"
              stopOpacity="0"
            />
          </radialGradient>
        </defs>

        <rect
          width={size.width}
          height={size.height}
          fill={`url(#${gridId})`}
        />

        {/* Main connections */}
        {connectionNodes.map(
          (nodeId) => {
            const point =
              currentPositions[
                nodeId
              ];

            return (
              <motion.line
                key={nodeId}
                initial={false}
                animate={{
                  x1: point.x,
                  y1: point.y,
                  x2: core.x,
                  y2: core.y,
                  opacity:
                    connectionOpacity,
                }}
                transition={{
                  duration:
                    reduceMotion
                      ? 0.01
                      : 0.8,
                  ease:
                    transitionEase,
                }}
                stroke="#0284c7"
                strokeWidth="1.2"
                strokeDasharray={
                  stage === 'base'
                    ? '3 8'
                    : '0'
                }
              />
            );
          },
        )}

        {/* AI connections */}
        {connectionNodes.map(
          (nodeId) => {
            const point =
              currentPositions[
                nodeId
              ];

            const ai =
              currentPositions.ai;

            return (
              <motion.line
                key={`ai-${nodeId}`}
                initial={false}
                animate={{
                  x1: ai.x,
                  y1: ai.y,
                  x2:
                    nodeId ===
                    'operations'
                      ? core.x
                      : point.x,
                  y2:
                    nodeId ===
                    'operations'
                      ? core.y
                      : point.y,
                  opacity:
                    aiOpacity *
                    0.2,
                }}
                transition={{
                  duration:
                    reduceMotion
                      ? 0.01
                      : 0.8,
                  ease:
                    transitionEase,
                }}
                stroke="#38bdf8"
                strokeWidth="0.8"
                strokeDasharray="3 7"
              />
            );
          },
        )}

        {/* Data pulses */}
        {stage !== 'base' &&
          connectionNodes
            .slice(0, 4)
            .map(
              (
                nodeId,
                index,
              ) => {
                const point =
                  currentPositions[
                    nodeId
                  ];

                return (
                  <motion.circle
                    key={`pulse-${stage}-${nodeId}`}
                    r="3.5"
                    fill="#0ea5e9"
                    initial={{
                      cx: point.x,
                      cy: point.y,
                      opacity: 0,
                    }}
                    animate={
                      reduceMotion
                        ? {
                            opacity:
                              0.65,
                          }
                        : {
                            cx: [
                              point.x,
                              core.x,
                            ],
                            cy: [
                              point.y,
                              core.y,
                            ],
                            opacity: [
                              0,
                              0.9,
                              0,
                            ],
                          }
                    }
                    transition={{
                      duration: 2.8,
                      delay:
                        index *
                        0.55,
                      repeat: Infinity,
                      ease:
                        'easeInOut',
                    }}
                  />
                );
              },
            )}

        {/* Core glow */}
        <motion.circle
          cx={core.x}
          cy={core.y}
          r="115"
          fill={`url(#${glowId})`}
          initial={false}
          animate={{
            opacity:
              coreOpacity,
            scale:
              stage ===
              'evolution'
                ? 1.08
                : 1,
          }}
          transition={{
            duration: 0.8,
            ease:
              transitionEase,
          }}
        />

        {/* Core */}
        <motion.g
          initial={false}
          animate={{
            opacity:
              coreOpacity,
            scale:
              stage ===
              'evolution'
                ? 1.06
                : 1,
          }}
          style={{
            transformOrigin:
              `${core.x}px ${core.y}px`,
          }}
          transition={{
            duration:
              reduceMotion
                ? 0.01
                : 0.7,
            ease:
              transitionEase,
          }}
        >
          <circle
            cx={core.x}
            cy={core.y}
            r="55"
            fill="#f8fafc"
            stroke="#0ea5e9"
            strokeWidth="1.5"
          />

          <circle
            cx={core.x}
            cy={core.y}
            r="43"
            fill="#ffffff"
            stroke="#0f172a"
            strokeOpacity="0.08"
          />

          <text
            x={core.x}
            y={core.y - 5}
            textAnchor="middle"
            fill="#0f172a"
            fontSize="10"
            fontWeight="800"
            letterSpacing="1.5"
          >
            SISTEMA
          </text>

          <text
            x={core.x}
            y={core.y + 13}
            textAnchor="middle"
            fill="#64748b"
            fontSize="7"
            fontWeight="600"
            letterSpacing="1.2"
          >
            DIGITAL
          </text>
        </motion.g>

        {/* Business nodes */}
        {nodes.map((node) => {
          const point =
            currentPositions[
              node.id
            ];

          const isAI =
            node.id === 'ai';

          const opacity =
            isAI
              ? aiOpacity
              : 1;

          return (
            <motion.g
              key={node.id}
              initial={false}
              animate={{
                x: point.x,
                y: point.y,
                opacity,
              }}
              transition={{
                duration:
                  reduceMotion
                    ? 0.01
                    : 0.85,
                ease:
                  transitionEase,
              }}
            >
              <rect
                x={-pillWidth / 2}
                y={-pillHeight / 2}
                width={pillWidth}
                height={pillHeight}
                rx={pillHeight / 2}
                fill={
                  isAI
                    ? '#0ea5e9'
                    : '#ffffff'
                }
                stroke={
                  isAI
                    ? '#0ea5e9'
                    : '#0f172a'
                }
                strokeOpacity={
                  isAI
                    ? 1
                    : 0.14
                }
              />

              <circle
                cx={-pillWidth / 2 + 17}
                cy="0"
                r="3"
                fill={
                  isAI
                    ? '#ffffff'
                    : '#0ea5e9'
                }
              />

              <text
                x="5"
                y={nodeFontSize * 0.38}
                textAnchor="middle"
                fill={
                  isAI
                    ? '#ffffff'
                    : '#0f172a'
                }
                fontSize={nodeFontSize}
                fontWeight="700"
                letterSpacing="0.7"
              >
                {node.label.toUpperCase()}
              </text>
            </motion.g>
          );
        })}

        {/* AI -> core pulse */}
        {stage ===
          'evolution' && (
          <motion.circle
            r="4"
            fill="#38bdf8"
            initial={{
              cx:
                currentPositions
                  .ai.x,
              cy:
                currentPositions
                  .ai.y,
              opacity: 0,
            }}
            animate={
              reduceMotion
                ? {
                    opacity:
                      0.8,
                  }
                : {
                    cx: [
                      currentPositions
                        .ai.x,
                      core.x,
                    ],
                    cy: [
                      currentPositions
                        .ai.y,
                      core.y,
                    ],
                    opacity: [
                      0,
                      1,
                      0,
                    ],
                  }
            }
            transition={{
              duration: 2.2,
              repeat: Infinity,
              ease:
                'easeInOut',
            }}
          />
        )}
      </svg>
    </div>
  );
}