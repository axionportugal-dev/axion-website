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

      {/* Irregular stars: static base opacity on the wrapper, CSS twinkle inside */}
      <div className="pointer-events-none absolute inset-0">
        {stars.map((star) => (
          <span
            key={star.id}
            // Phones: half the twinkling stars (fewer composited layers).
            className={`absolute ${
              star.id % 2 === 1 && !star.bright ? 'max-sm:hidden' : ''
            }`}
            style={{
              left: star.left,
              top: star.top,
              opacity: star.opacity,
            }}
          >
            <span
              className={`axion-star block rounded-full bg-white ${
                star.bright ? 'axion-star-bright' : ''
              }`}
              style={{
                width: star.size,
                height: star.size,
                boxShadow: star.bright
                  ? `0 0 ${star.size * 5}px rgba(255,255,255,0.65)`
                  : `0 0 ${star.size * 2.5}px rgba(255,255,255,0.2)`,
                animationDuration: `${star.duration}s`,
                animationDelay: `${star.delay}s`,
              }}
            />
          </span>
        ))}
      </div>

      {/* Very subtle common luminosity */}
      <div
        className="axion-backdrop-glow pointer-events-none absolute left-1/2 top-1/2 h-[58rem] w-[58rem] rounded-full"
        style={{
          background:
            'radial-gradient(circle, rgba(255,255,255,0.028) 0%, rgba(255,255,255,0.016) 24%, rgba(255,255,255,0.007) 46%, transparent 72%)',
        }}
      />
    </div>
  );
}