import { motion } from 'motion/react';
import { ArrowUpRight } from 'lucide-react';
import { serviceAreas } from '../../data/services';

interface ServicesExperienceProps {
  onNavigateToService: () => void;
}

const ORBIT_RADIUS_X_PERCENT = 36;
const ORBIT_RADIUS_Y_PERCENT = 23;
const ORBIT_DURATION = 40;
const ORBIT_POINTS = 72;

const createSharedOrbit = (index: number) => {
  const phaseOffset =
    (index / serviceAreas.length) *
    Math.PI *
    2;

  const left = Array.from(
    { length: ORBIT_POINTS + 1 },
    (_, point) => {
      const progress =
        point / ORBIT_POINTS;

      const angle =
        progress * Math.PI * 2 +
        phaseOffset;

      return `${
        50 +
        Math.cos(angle) *
          ORBIT_RADIUS_X_PERCENT
      }%`;
    },
  );

  const top = Array.from(
    { length: ORBIT_POINTS + 1 },
    (_, point) => {
      const progress =
        point / ORBIT_POINTS;

      const angle =
        progress * Math.PI * 2 +
        phaseOffset;

      return `${
        50 +
        Math.sin(angle) *
          ORBIT_RADIUS_Y_PERCENT
      }%`;
    },
  );

  return {
    left,
    top,
  };
};

export default function ServicesExperience({
  onNavigateToServices,
}: ServicesExperienceProps)  {
  return (
    <div className="absolute inset-0 overflow-hidden text-white">
      {/* Scene label */}
      <div className="pointer-events-none absolute left-1/2 top-[9%] z-20 -translate-x-1/2 text-center">
        <span className="font-mono text-[8px] font-bold uppercase tracking-[0.36em] text-sky-400/70">
          AXION / Serviços
        </span>
      </div>

      {/* Desktop shared elliptical orbit */}
      <div className="absolute inset-0 hidden lg:block">
        {serviceAreas.map(
          (service, index) => {
            const Icon = service.icon;
            const orbit =
              createSharedOrbit(index);

            return (
              <motion.div
                key={service.slug}
                className="absolute z-10"
                style={{
                  transform:
                    'translate(-50%, -50%)',
                }}
                initial={{
                  left: orbit.left[0],
                  top: orbit.top[0],
                }}
                animate={{
                  left: orbit.left,
                  top: orbit.top,
                }}
                transition={{
                  left: {
                    duration:
                      ORBIT_DURATION,
                    repeat: Infinity,
                    ease: 'linear',
                  },
                  top: {
                    duration:
                      ORBIT_DURATION,
                    repeat: Infinity,
                    ease: 'linear',
                  },
                }}
              >
                <motion.button
                  type="button"
                  onClick={(event) => {
                    event.stopPropagation();
                    onNavigateToServices();
                  }}
                  aria-label={`Explorar ${service.title}`}
                  className="group pointer-events-auto relative w-[clamp(12.5rem,16.5vw,15.5rem)] cursor-pointer rounded-[22px] border border-white/[0.15] bg-white/[0.045] p-5 text-left backdrop-blur-2xl transition-[border-color,background-color,box-shadow] duration-500 hover:border-sky-300/45 hover:bg-white/[0.075] hover:shadow-[0_18px_65px_rgba(56,189,248,0.15)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-sky-400"
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
                    <span className="text-[8px] font-bold uppercase tracking-[0.2em] text-white/35 transition-colors duration-300 group-hover:text-white/65">
                      Explorar
                    </span>

                    <ArrowUpRight
                      size={12}
                      className="text-sky-400 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                    />
                  </div>
                </motion.button>
              </motion.div>
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