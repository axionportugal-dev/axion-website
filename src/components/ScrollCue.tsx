/*
 * Discreet "keep scrolling" hint: a small label above a hairline with a
 * travelling sky-blue pulse (same language as the hero's
 * "Scroll para navegar"). Pure CSS animation, see .axion-scroll-cue-pulse.
 */
interface ScrollCueProps {
  label: string;
  className?: string;
  visible?: boolean;
}

export default function ScrollCue({
  label,
  className = '',
  visible = true,
}: ScrollCueProps) {
  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none flex flex-col items-center gap-2 transition-opacity duration-500 ${
        visible ? 'opacity-100' : 'opacity-0'
      } ${className}`}
    >
      <span className="font-mono text-[8px] font-bold uppercase tracking-[0.3em] text-white/55">
        {label}
      </span>

      <span className="relative block h-8 w-px overflow-hidden bg-white/15">
        <span className="axion-scroll-cue-pulse absolute left-0 top-0 block h-1/2 w-full bg-sky-300" />
      </span>
    </div>
  );
}
