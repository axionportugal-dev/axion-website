import Logo from './Logo';

export default function NotFoundPage() {
  return (
    <main className="relative flex min-h-screen w-full items-center justify-center overflow-hidden bg-slate-950 px-6 text-white">
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-[34rem] w-[34rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-sky-500/10 blur-[140px]" />

      <div className="relative z-10 mx-auto flex max-w-2xl flex-col items-center text-center">
        <a
          href="/"
          aria-label="Voltar à página inicial da AXION"
          className="mb-10"
        >
          <Logo
            theme="dark"
            glow={false}
            className="h-16 w-16"
          />
        </a>

        <span className="font-mono text-[10px] font-bold uppercase tracking-[0.4em] text-sky-400">
          Erro 404
        </span>

        <h1 className="mt-5 text-4xl font-black uppercase tracking-[-0.04em] text-white sm:text-5xl md:text-6xl">
          Página não encontrada.
        </h1>

        <p className="mt-6 max-w-lg text-sm font-medium leading-relaxed text-slate-400 sm:text-base">
          O endereço que tentou abrir não existe ou deixou de estar disponível.
        </p>

        <div className="mt-10 flex flex-col gap-3 sm:flex-row">
          <a
            href="/"
            className="rounded-full bg-white px-7 py-3 text-[10px] font-black uppercase tracking-[0.18em] text-slate-950 transition-transform hover:scale-[1.03]"
          >
            Voltar ao início
          </a>

          <a
            href="/servicos"
            className="rounded-full border border-white/15 bg-white/[0.04] px-7 py-3 text-[10px] font-black uppercase tracking-[0.18em] text-white transition-colors hover:border-sky-400/50 hover:text-sky-300"
          >
            Ver serviços
          </a>
        </div>
      </div>
    </main>
  );
}