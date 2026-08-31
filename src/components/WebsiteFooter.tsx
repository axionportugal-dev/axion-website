import { ArrowRight } from 'lucide-react';
import Logo from './Logo';

interface WebsiteFooterContentProps {
  sectionLabels?: string[];
  onNavigateSection?: (index: number) => void;
}

interface WebsiteFooterProps extends WebsiteFooterContentProps {
  className?: string;
}

const defaultSectionLabels = ['Início', 'Serviços', 'Portfólio', 'Presença', 'Orçamento'];

export function WebsiteFooterContent({
  sectionLabels = defaultSectionLabels,
  onNavigateSection,
}: WebsiteFooterContentProps) {
  return (
    <>
      <div className="absolute left-1/2 top-0 h-40 w-[36rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-sky-500/10 blur-[90px] pointer-events-none" />

      <div className="relative w-full max-w-7xl mx-auto py-6 md:py-8">
        <div className="h-px w-full bg-gradient-to-r from-sky-400/70 via-white/15 to-transparent" />

        <div className="grid grid-cols-1 md:grid-cols-12 gap-5 md:gap-8 lg:gap-12 py-6 md:py-8 items-start">
          <section className="md:col-span-6 space-y-3">
            <span className="text-[8px] font-mono tracking-[0.3em] uppercase text-sky-400">
              AXION / PORTUGAL
            </span>

            <div className="flex items-center gap-3">
              <Logo theme="dark" glow={false} className="w-9 h-9 md:w-11 md:h-11" />
              <span className="text-base md:text-lg font-black tracking-[0.38em] uppercase text-white">AXION</span>
            </div>

            <h3 className="max-w-xl text-2xl sm:text-3xl font-black tracking-[-0.04em] uppercase text-white leading-none">
              Engenharia digital <span className="text-sky-400">de prestígio.</span>
            </h3>

            <p className="max-w-lg text-[9px] md:text-[10px] leading-relaxed text-slate-400 font-medium">
              Desenvolvemos ecossistemas tecnológicos de alto impacto para potenciar o seu negócio.
            </p>
          </section>

          <nav className="md:col-span-3 space-y-3" aria-label="Navegação do footer">
            <span className="block text-[8px] font-mono tracking-[0.24em] uppercase text-slate-600">Navegação</span>
            <div className="flex flex-wrap gap-x-5 gap-y-2 md:flex-col md:items-start md:gap-2.5">
              {sectionLabels.map((label, idx) => {
                const buttonClasses = 'group flex items-center gap-2 text-[9px] font-bold tracking-[0.16em] uppercase text-slate-400 hover:text-white transition-colors cursor-pointer';

                if (onNavigateSection) {
                  return (
                    <button
                      key={label}
                      type="button"
                      onClick={() => onNavigateSection(idx)}
                      className={buttonClasses}
                    >
                      <span className="h-px w-0 bg-sky-400 transition-all duration-300 group-hover:w-3" />
                      <span>{label}</span>
                    </button>
                  );
                }

                return (
                  <a key={label} href="/" className={buttonClasses}>
                    <span className="h-px w-0 bg-sky-400 transition-all duration-300 group-hover:w-3" />
                    <span>{label}</span>
                  </a>
                );
              })}
            </div>
          </nav>

          <section className="md:col-span-3 space-y-4">
            <span className="block text-[8px] font-mono tracking-[0.24em] uppercase text-slate-600">Contacto direto</span>
            <a
              href="mailto:axionportugal@gmail.com"
              className="group inline-flex items-center gap-3 border-b border-white/15 pb-2 text-[10px] sm:text-xs font-bold tracking-[0.08em] uppercase text-white hover:text-sky-300 hover:border-sky-400/60 transition-colors"
            >
              <span>axionportugal@gmail.com</span>
              <ArrowRight size={12} className="shrink-0 transition-transform duration-300 group-hover:translate-x-1" />
            </a>
            <span className="flex items-center gap-2 text-[8px] font-mono uppercase tracking-[0.2em] text-slate-500">
              <span className="h-1.5 w-1.5 rounded-full bg-sky-400 shadow-[0_0_9px_rgba(56,189,248,0.8)]" />
              Portugal · Projetos globais
            </span>
          </section>
        </div>

        <div className="flex flex-col sm:flex-row justify-between gap-2 pt-5 border-t border-white/[0.08] text-[7px] sm:text-[8px] font-mono tracking-[0.2em] uppercase text-slate-600">
          <span>© 2026 AXION • TODOS OS DIREITOS RESERVADOS</span>
          <span>TECNOLOGIA DE PRESTÍGIO</span>
        </div>
      </div>
    </>
  );
}

export default function WebsiteFooter({ className = '', sectionLabels, onNavigateSection }: WebsiteFooterProps) {
  return (
    <footer className={`relative w-full px-6 md:px-12 text-left bg-slate-950/98 backdrop-blur-2xl border-t border-white/10 shadow-[0_-30px_80px_rgba(2,6,23,0.48)] ${className}`}>
      <WebsiteFooterContent sectionLabels={sectionLabels} onNavigateSection={onNavigateSection} />
    </footer>
  );
}
