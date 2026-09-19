import { motion } from 'motion/react';

const seededRandom = (seed: number) => {
  const value = Math.sin(seed * 12.9898) * 43758.5453;
  return value - Math.floor(value);
};

const stars = Array.from({ length: 190 }, (_, index) => {
  const x = seededRandom(index + 1);
  const y = seededRandom(index + 101);
  const sizeSeed = seededRandom(index + 201);
  const opacitySeed = seededRandom(index + 301);
  const timingSeed = seededRandom(index + 401);

  const isBrightStar = index % 23 === 0;

  return {
    id: index,
    left: `${x * 100}%`,
    top: `${y * 100}%`,
    size: isBrightStar
      ? 2.2 + sizeSeed * 1.3
      : 0.55 + sizeSeed * 1.35,
    opacity: isBrightStar
      ? 0.7 + opacitySeed * 0.25
      : 0.18 + opacitySeed * 0.5,
    duration: 3.5 + timingSeed * 6,
    delay: timingSeed * 4,
    bright: isBrightStar,
  };
});

export default function SpaceBackdrop() {
  return (
    <div
      aria-hidden="true"
      className="absolute inset-0 overflow-hidden bg-[#010103]"
    >
      {/* Shared sideral depth */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(circle at 50% 47%, rgba(255,255,255,0.018) 0%, transparent 24%), radial-gradient(circle at 50% 48%, rgba(14,165,233,0.055) 0%, rgba(14,165,233,0.018) 24%, transparent 45%), radial-gradient(circle at 18% 72%, rgba(56,189,248,0.025) 0%, transparent 30%), radial-gradient(circle at 84% 18%, rgba(59,130,246,0.025) 0%, transparent 27%), linear-gradient(180deg, #000000 0%, #010205 50%, #000000 100%)',
        }}
      />

      {/* Irregular stars */}
      <div className="pointer-events-none absolute inset-0">
        {stars.map((star) => (
          <motion.span
            key={star.id}
            className="absolute rounded-full bg-white"
            style={{
              left: star.left,
              top: star.top,
              width: star.size,
              height: star.size,
              opacity: star.opacity,
              boxShadow: star.bright
                ? `0 0 ${star.size * 5}px rgba(255,255,255,0.65)`
                : `0 0 ${star.size * 2.5}px rgba(255,255,255,0.2)`,
            }}
            animate={{
              opacity: [
                star.opacity * 0.55,
                star.opacity,
                star.opacity * 0.7,
              ],
              scale: star.bright
                ? [1, 1.22, 1]
                : [1, 1.06, 1],
            }}
            transition={{
              duration: star.duration,
              delay: star.delay,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
        ))}
      </div>

      {/* Very subtle common luminosity */}
      <motion.div
        className="pointer-events-none absolute left-1/2 top-1/2 h-[58rem] w-[58rem] -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{
          background:
            'radial-gradient(circle, rgba(255,255,255,0.028) 0%, rgba(255,255,255,0.016) 24%, rgba(255,255,255,0.007) 46%, transparent 72%)',
        }}
        animate={{
          scale: [0.94, 1.06, 0.94],
          opacity: [0.18, 0.3, 0.18],
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
    </div>
  );
}