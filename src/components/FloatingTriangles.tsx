import React, { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'motion/react';

interface Triangle {
  id: number;
  x: number; // percentage width
  y: number; // percentage height
  size: number; // base size in pixels
  rotation: number; // starting rotation in degrees
  speed: number; // multiplier for floating speed
  depth: number; // depth value 0.2 to 1 (for parallax & blur)
  colorType: 'primary' | 'secondary' | 'accent' | 'neutral';
}

interface FloatingTrianglesProps {
  theme: 'light' | 'dark';
  variant?: 'default' | 'hero';
}

// Map triangle properties to theme-appropriate color presets
const getTriangleStyles = (
  triangle: Triangle,
  theme: 'light' | 'dark',
  variant: 'default' | 'hero',
) => {
  const isDark = theme === 'dark';
  const { colorType, depth } = triangle;

  if (isDark && variant === 'hero') {
    const blur = Math.max(0, (1 - depth) * 3);

    switch (colorType) {
      case 'primary':
        return {
          fill: 'rgba(255, 255, 255, 0.13)',
          stroke: 'rgba(255, 255, 255, 0.5)',
          filter: `blur(${blur}px)`,
        };
      case 'secondary':
        return {
          fill: 'rgba(255, 255, 255, 0.09)',
          stroke: 'rgba(255, 255, 255, 0.38)',
          filter: `blur(${blur}px)`,
        };
      case 'accent':
        return {
          fill: 'rgba(255, 255, 255, 0.17)',
          stroke: 'rgba(255, 255, 255, 0.58)',
          filter: `blur(${Math.max(0, blur - 1)}px)`,
        };
      case 'neutral':
      default:
        return {
          fill: 'rgba(255, 255, 255, 0.06)',
          stroke: 'rgba(255, 255, 255, 0.28)',
          filter: `blur(${blur + 1}px)`,
        };
    }
  }

  if (isDark) {
    // Strictly monochrome palette for dark mode (whites, greys, blacks)
    switch (colorType) {
      case 'primary': // Deep luxury slate/black charcoal
        return {
          fill: 'rgba(15, 23, 42, 0.7)',
          stroke: 'rgba(255, 255, 255, 0.15)',
          filter: `blur(${Math.max(0, (1 - depth) * 4)}px)`,
        };
      case 'secondary': // Frosted glass translucent white
        return {
          fill: 'rgba(255, 255, 255, 0.05)',
          stroke: 'rgba(255, 255, 255, 0.22)',
          filter: `blur(${Math.max(0, (1 - depth) * 5)}px)`,
        };
      case 'accent': // Polished mid-graphite grey
        return {
          fill: 'rgba(51, 65, 85, 0.35)',
          stroke: 'rgba(255, 255, 255, 0.3)',
          filter: `blur(${Math.max(0, (1 - depth) * 3)}px)`,
        };
      case 'neutral': // Soft slate grey
      default:
        return {
          fill: 'rgba(30, 41, 59, 0.2)',
          stroke: 'rgba(255, 255, 255, 0.08)',
          filter: `blur(${Math.max(0, (1 - depth) * 6)}px)`,
        };
    }
  } else {
    // Warm & Soft blueish/grey shades for light mode (from corporate business card)
    switch (colorType) {
      case 'primary': // Deep slate grey (resembling the main card triangles)
        return {
          fill: 'rgba(47, 62, 70, 0.75)',
          stroke: 'rgba(15, 23, 42, 0.15)',
          filter: `blur(${Math.max(0, (1 - depth) * 3)}px)`,
        };
      case 'secondary': // Mid-tone grey/blue
        return {
          fill: 'rgba(100, 116, 139, 0.25)',
          stroke: 'rgba(148, 163, 184, 0.3)',
          filter: `blur(${Math.max(0, (1 - depth) * 4)}px)`,
        };
      case 'accent': // Soft translucent ice blue
        return {
          fill: 'rgba(224, 242, 254, 0.55)',
          stroke: 'rgba(186, 230, 253, 0.8)',
          filter: `blur(${Math.max(0, (1 - depth) * 2)}px)`,
        };
      case 'neutral': // Light frosty grey
      default:
        return {
          fill: 'rgba(241, 245, 249, 0.65)',
          stroke: 'rgba(203, 213, 225, 0.65)',
          filter: `blur(${Math.max(0, (1 - depth) * 5)}px)`,
        };
    }
  }
};

interface FloatingTriangleItemProps {
  key?: number;
  triangle: Triangle;
  smoothX: any;
  smoothY: any;
  theme: 'light' | 'dark';
  variant: 'default' | 'hero';
}

function FloatingTriangleItem({ triangle, smoothX, smoothY, theme, variant }: FloatingTriangleItemProps) {
  const styles = getTriangleStyles(triangle, theme, variant);
  const parallaxAmount = triangle.depth * (variant === 'hero' ? 72 : 55);

  // Mathematically mapping the smooth reactive mouse movement coordinates without breaking Rules of Hooks
  const xOffset = useTransform(smoothX, (val: number) => val * parallaxAmount);
  const yOffset = useTransform(smoothY, (val: number) => val * parallaxAmount);

  return (
    <motion.div
      className="absolute"
      style={{
        left: `${triangle.x}%`,
        top: `${triangle.y}%`,
        width: triangle.size,
        height: triangle.size,
        opacity: variant === 'hero' ? 0.32 + triangle.depth * 0.68 : triangle.depth * 0.9,
        zIndex: Math.floor(triangle.depth * 10),
      }}
      animate={{
        // Floating sinus waves
        y: [0, -12 * triangle.speed, 0],
        rotate: [triangle.rotation, triangle.rotation + 360],
      }}
      transition={{
        y: {
          duration: 5 / triangle.speed,
          repeat: Infinity,
          ease: 'easeInOut',
        },
        rotate: {
          duration: 45 / triangle.speed,
          repeat: Infinity,
          ease: 'linear',
        },
      }}
    >
      <motion.div
        style={{
          x: xOffset,
          y: yOffset,
        }}
        className="w-full h-full"
      >
        <svg
          viewBox="0 0 100 100"
          className="w-full h-full drop-shadow-md"
        >
          {/* Custom 3D triangle styling with linear gradient/shading */}
          <defs>
            <linearGradient id={`grad-${triangle.id}-${theme}`} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={styles.fill} stopOpacity="1" />
              <stop offset="100%" stopColor={styles.fill} stopOpacity="0.3" />
            </linearGradient>
          </defs>
          
          {/* Main faceted triangle */}
          <path
            d="M 50 15 L 85 80 L 15 80 Z"
            fill={`url(#grad-${triangle.id}-${theme})`}
            stroke={styles.stroke}
            strokeWidth="1.5"
            style={{ filter: styles.filter }}
          />
          
          {/* 3D shading seam (divides the triangle to give realistic depth like in business card) */}
          <path
            d="M 50 15 L 50 80"
            stroke={theme === 'dark' ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.08)'}
            strokeWidth="1"
          />
          <path
            d="M 50 80 L 15 80"
            stroke={theme === 'dark' ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.05)'}
            strokeWidth="1"
          />
        </svg>
      </motion.div>
    </motion.div>
  );
}

export default function FloatingTriangles({ theme, variant = 'default' }: FloatingTrianglesProps) {
  const [triangles, setTriangles] = useState<Triangle[]>([]);
  
  // Mouse position values for parallax effect
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Smooth springs for lag-free mouse movement tracking
  const springConfig = { damping: 25, stiffness: 120 };
  const smoothX = useSpring(mouseX, springConfig);
  const smoothY = useSpring(mouseY, springConfig);

  useEffect(() => {
    // Generate deterministic yet pseudo-random set of floating triangles
    const count = 18;
    const items: Triangle[] = [];
    
    // Predetermined list of scattering coordinates to look perfectly composed
    const coordinatePool = [
      { x: 10, y: 15, size: 80, depth: 0.9, colorType: 'primary' },
      { x: 15, y: 75, size: 140, depth: 0.85, colorType: 'primary' },
      { x: 8, y: 45, size: 50, depth: 0.4, colorType: 'neutral' },
      { x: 22, y: 38, size: 40, depth: 0.3, colorType: 'secondary' },
      { x: 20, y: 60, size: 70, depth: 0.6, colorType: 'accent' },
      { x: 18, y: 90, size: 45, depth: 0.5, colorType: 'neutral' },
      { x: 5, y: 28, size: 30, depth: 0.25, colorType: 'neutral' },
      { x: 25, y: 22, size: 55, depth: 0.5, colorType: 'secondary' },
      
      // Right side scatterings
      { x: 85, y: 12, size: 75, depth: 0.7, colorType: 'secondary' },
      { x: 92, y: 40, size: 110, depth: 0.8, colorType: 'primary' },
      { x: 78, y: 68, size: 60, depth: 0.45, colorType: 'accent' },
      { x: 88, y: 82, size: 95, depth: 0.75, colorType: 'neutral' },
      { x: 70, y: 25, size: 35, depth: 0.3, colorType: 'primary' },
      { x: 75, y: 50, size: 40, depth: 0.35, colorType: 'neutral' },
      
      // Central scattered accents
      { x: 45, y: 10, size: 45, depth: 0.2, colorType: 'accent' },
      { x: 55, y: 85, size: 50, depth: 0.25, colorType: 'secondary' },
      { x: 35, y: 70, size: 30, depth: 0.2, colorType: 'neutral' },
      { x: 65, y: 60, size: 35, depth: 0.2, colorType: 'primary' },
    ];

    for (let i = 0; i < count; i++) {
      const config = coordinatePool[i % coordinatePool.length];
      items.push({
        id: i,
        x: config.x,
        y: config.y,
        size: config.size,
        rotation: (i * 47) % 360,
        speed: 0.4 + (i % 3) * 0.3,
        depth: config.depth,
        colorType: config.colorType as any,
      });
    }

    setTriangles(items);

    // Track mouse coordinates
    const handleMouseMove = (event: MouseEvent) => {
      const { clientX, clientY } = event;
      const fractionalX = (clientX / window.innerWidth) - 0.5;
      const fractionalY = (clientY / window.innerHeight) - 0.5;
      mouseX.set(fractionalX);
      mouseY.set(fractionalY);
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [mouseX, mouseY]);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none select-none z-0">
      {triangles.map((triangle) => (
        <FloatingTriangleItem
          key={triangle.id}
          triangle={triangle}
          smoothX={smoothX}
          smoothY={smoothY}
          theme={theme}
          variant={variant}
        />
      ))}
    </div>
  );
}
