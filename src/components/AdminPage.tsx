import { useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import {
  ArrowLeft,
  ArrowRight,
  Bell,
  BriefcaseBusiness,
  Check,
  ChevronRight,
  Film,
  FolderOpen,
  GripVertical,
  Image as ImageIcon,
  LayoutDashboard,
  Menu,
  MoreHorizontal,
  Pencil,
  Plus,
  Search,
  Settings,
  Upload,
  Users,
  X,
} from 'lucide-react';
import Logo from './Logo';

type AdminView = 'overview' | 'portfolio' | 'media' | 'clients' | 'settings';
type MediaKind = 'image' | 'video';
type ProjectStatus = 'Publicado' | 'Rascunho';

interface AdminProjectPreview {
  id: string;
  title: string;
  category: string;
  description: string;
  kpi: string;
  result: string;
  logoUrl: string;
  mediaUrl: string;
  mediaKind: MediaKind;
  status: ProjectStatus;
  order: number;
}

const revissantBackground = new URL('../../assets/revissantbackground.mp4', import.meta.url).href;
const auraBackground = new URL('../../assets/aurabackground.jpg', import.meta.url).href;
const casasDoBecoBackground = new URL('../../assets/casasdobecovideo.mp4', import.meta.url).href;

const projects: AdminProjectPreview[] = [
  {
    id: 'revissant',
    title: 'REVISSANT',
    category: 'DESIGN DE INTERFACE & E-COMMERCE',
    description: 'Uma experiência de e-commerce de alta joalharia e perfumaria premium com transições orgânicas a 120 FPS e design imersivo sob medida.',
    kpi: '+140% Conversões',
    result: 'Resultado de E-Commerce',
    logoUrl: '/assets/revissant.png',
    mediaUrl: revissantBackground,
    mediaKind: 'video',
    status: 'Publicado',
    order: 1,
  },
  {
    id: 'aura-events',
    title: 'AURA EVENTS',
    category: 'TRÁFEGO PAGO & FUNIS DE CONVERSÃO',
    description: 'Arquitetura e gestão de campanhas digitais e funis de vendas ultra-segmentados para festivais e conferências corporativas de prestígio internacional.',
    kpi: '-55% Custo por Lead',
    result: 'Melhoria de Retorno sobre Investimento',
    logoUrl: '/assets/auraevents.png',
    mediaUrl: auraBackground,
    mediaKind: 'image',
    status: 'Publicado',
    order: 2,
  },
  {
    id: 'casas-do-beco',
    title: 'CASAS DO BECO',
    category: 'REBRANDING & DIREÇÃO ARTÍSTICA',
    description: 'Reposicionamento digital e direção de arte completa para uma marca de alojamentos de charme tradicionais portugueses, alinhando a herança clássica com sofisticação contemporânea.',
    kpi: '+300k Alcance Orgânico',
    result: 'Expansão de Autoridade Orgânica',
    logoUrl: '/assets/casasdobeco.png',
    mediaUrl: casasDoBecoBackground,
    mediaKind: 'video',
    status: 'Publicado',
    order: 3,
  },
];

const navItems = [
  { id: 'overview' as const, label: 'Visão geral', icon: LayoutDashboard },
  { id: 'portfolio' as const, label: 'Portfólio', icon: BriefcaseBusiness },
  { id: 'media' as const, label: 'Media', icon: FolderOpen },
  { id: 'clients' as const, label: 'Clientes', icon: Users, future: true },
];

const blankProject: AdminProjectPreview = {
  id: 'new-project',
  title: '',
  category: '',
  description: '',
  kpi: '',
  result: '',
  logoUrl: '',
  mediaUrl: '',
  mediaKind: 'image',
  status: 'Rascunho',
  order: projects.length + 1,
};

function ProjectMedia({ project, className = '' }: { project: AdminProjectPreview; className?: string }) {
  if (!project.mediaUrl) {
    return (
      <div className={`flex items-center justify-center bg-slate-900 text-slate-600 ${className}`}>
        <Upload size={20} />
      </div>
    );
  }

  if (project.mediaKind === 'video') {
    return (
      <video
        src={project.mediaUrl}
        autoPlay
        loop
        muted
        playsInline
        className={`object-cover ${className}`}
      />
    );
  }

  return <img src={project.mediaUrl} alt="" className={`object-cover ${className}`} />;
}

function StatusLabel({ status }: { status: ProjectStatus }) {
  return (
    <span className={`inline-flex items-center gap-2 text-[8px] font-mono font-bold tracking-[0.16em] uppercase ${
      status === 'Publicado' ? 'text-emerald-600' : 'text-amber-600'
    }`}>
      <span className={`h-1.5 w-1.5 rounded-full ${status === 'Publicado' ? 'bg-emerald-500' : 'bg-amber-500'}`} />
      {status}
    </span>
  );
}

export default function AdminPage() {
  const [activeView, setActiveView] = useState<AdminView>('overview');
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [activeProjectId, setActiveProjectId] = useState(projects[0].id);
  const [editorProject, setEditorProject] = useState<AdminProjectPreview | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [notice, setNotice] = useState<string | null>(null);

  const activeProject = projects.find((project) => project.id === activeProjectId) ?? projects[0];
  const publishedCount = projects.filter((project) => project.status === 'Publicado').length;
  const videoCount = projects.filter((project) => project.mediaKind === 'video').length;
  const mediaCount = projects.length * 2;

  const filteredProjects = useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLocaleLowerCase('pt');
    if (!normalizedQuery) return projects;

    return projects.filter((project) => (
      project.title.toLocaleLowerCase('pt').includes(normalizedQuery)
      || project.category.toLocaleLowerCase('pt').includes(normalizedQuery)
    ));
  }, [searchQuery]);

  const selectView = (view: AdminView) => {
    setActiveView(view);
    setMobileNavOpen(false);
  };

  const showPrototypeNotice = (message: string) => {
    setNotice(message);
    window.setTimeout(() => setNotice(null), 2600);
  };

  return (
    <div className="min-h-screen bg-[#03060b] text-slate-950 lg:p-4 selection:bg-sky-400/25">
      <div className="min-h-screen lg:min-h-[calc(100vh-2rem)] lg:grid lg:grid-cols-[250px_minmax(0,1fr)] lg:rounded-[30px] overflow-hidden border border-white/[0.08] shadow-[0_35px_100px_rgba(0,0,0,0.45)]">
        <aside className={`fixed inset-y-0 left-0 z-50 w-[270px] bg-slate-950 text-white border-r border-white/[0.07] transition-transform duration-300 lg:static lg:w-auto lg:translate-x-0 ${
          mobileNavOpen ? 'translate-x-0' : '-translate-x-full'
        }`}>
          <div className="flex h-full flex-col px-5 py-6">
            <div className="flex items-center justify-between pb-8">
              <a href="/" className="flex items-center gap-3" aria-label="Voltar ao website AXION">
                <Logo theme="dark" glow={false} className="h-9 w-12" />
                <div>
                  <span className="block text-xs font-black tracking-[0.3em] uppercase">AXION</span>
                  <span className="block mt-1 text-[7px] font-mono tracking-[0.22em] uppercase text-slate-600">Content Studio</span>
                </div>
              </a>
              <button
                onClick={() => setMobileNavOpen(false)}
                className="p-2 text-slate-500 hover:text-white lg:hidden"
                aria-label="Fechar navegação"
              >
                <X size={17} />
              </button>
            </div>

            <nav className="mt-2 space-y-1" aria-label="Navegação administrativa">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeView === item.id;

                return (
                  <button
                    key={item.id}
                    onClick={() => selectView(item.id)}
                    className={`relative flex w-full items-center gap-3 rounded-xl px-3.5 py-3 text-left transition-colors ${
                      isActive
                        ? 'bg-white/[0.07] text-white'
                        : 'text-slate-500 hover:bg-white/[0.035] hover:text-slate-200'
                    }`}
                  >
                    {isActive && <motion.span layoutId="admin-active-nav" className="absolute inset-y-3 left-0 w-px bg-sky-400" />}
                    <Icon size={15} strokeWidth={1.7} />
                    <span className="text-[9px] font-bold tracking-[0.14em] uppercase">{item.label}</span>
                    {item.future && (
                      <span className="ml-auto text-[6px] font-mono tracking-wider uppercase text-sky-500/70">Brevemente</span>
                    )}
                  </button>
                );
              })}
            </nav>

            <div className="mt-auto space-y-1 pt-8">
              <button
                onClick={() => selectView('settings')}
                className={`flex w-full items-center gap-3 rounded-xl px-3.5 py-3 transition-colors ${
                  activeView === 'settings' ? 'bg-white/[0.07] text-white' : 'text-slate-500 hover:text-slate-200'
                }`}
              >
                <Settings size={15} strokeWidth={1.7} />
                <span className="text-[9px] font-bold tracking-[0.14em] uppercase">Definições</span>
              </button>
              <a href="/" className="flex items-center gap-3 rounded-xl px-3.5 py-3 text-slate-500 hover:text-white transition-colors">
                <ArrowLeft size={15} strokeWidth={1.7} />
                <span className="text-[9px] font-bold tracking-[0.14em] uppercase">Ver website</span>
              </a>
            </div>
          </div>
        </aside>

        <main className="relative min-w-0 bg-slate-100 overflow-hidden">
          <div className="absolute -right-32 -top-44 h-[34rem] w-[34rem] rounded-full bg-sky-300/20 blur-[130px] pointer-events-none" />
          <div className="absolute inset-0 opacity-[0.025] pointer-events-none" style={{
            backgroundImage: 'linear-gradient(rgba(15,23,42,0.45) 1px, transparent 1px), linear-gradient(90deg, rgba(15,23,42,0.45) 1px, transparent 1px)',
            backgroundSize: '72px 72px',
            maskImage: 'linear-gradient(to bottom, black, transparent 72%)',
          }} />

          <header className="sticky top-0 z-30 flex h-[76px] items-center justify-between border-b border-slate-900/[0.07] bg-slate-100/80 px-5 backdrop-blur-xl md:px-8">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setMobileNavOpen(true)}
                className="p-2 text-slate-500 hover:text-slate-950 lg:hidden"
                aria-label="Abrir navegação"
              >
                <Menu size={19} />
              </button>
              <div>
                <span className="block text-[7px] font-mono tracking-[0.2em] uppercase text-sky-600">AXION Studio</span>
                <span className="block mt-1 text-[10px] font-black tracking-[0.12em] uppercase text-slate-900">
                  {activeView === 'overview' ? 'Visão geral' : activeView === 'media' ? 'Biblioteca de Media' : activeView === 'clients' ? 'Clientes' : activeView === 'settings' ? 'Definições' : 'Portfólio'}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button className="hidden h-9 items-center gap-2 rounded-full border border-slate-900/[0.08] bg-white/50 px-4 text-[8px] font-mono tracking-[0.14em] uppercase text-slate-500 transition-colors hover:border-sky-400/50 hover:text-sky-700 sm:flex">
                <Search size={12} />
                Pesquisa rápida
              </button>
              <button className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-900/[0.08] bg-white/50 text-slate-500 hover:text-slate-950">
                <Bell size={13} />
              </button>
              <div className="ml-1 flex h-9 items-center gap-2 rounded-full border border-slate-900/[0.08] bg-white/60 pl-1.5 pr-3">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-slate-950 text-[8px] font-black text-white">AX</span>
                <span className="hidden text-[8px] font-bold tracking-[0.1em] uppercase text-slate-700 sm:block">Equipa AXION</span>
              </div>
            </div>
          </header>

          <div className="relative z-10 h-[calc(100vh-76px)] lg:h-[calc(100vh-108px)] overflow-y-auto px-5 py-6 md:px-8 md:py-8">
            <AnimatePresence mode="wait">
              {activeView === 'overview' && (
                <motion.div
                  key="overview"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                  className="mx-auto max-w-7xl space-y-8"
                >
                  <div className="grid gap-5 lg:grid-cols-[1fr_auto] lg:items-end">
                    <div>
                      <span className="text-[8px] font-mono tracking-[0.24em] uppercase text-sky-600">Conteúdo digital</span>
                      <h1 className="mt-3 max-w-3xl text-3xl font-black tracking-[-0.045em] text-slate-950 md:text-5xl leading-[0.95]">
                        Gerir a presença AXION com precisão.
                      </h1>
                    </div>
                    <button
                      onClick={() => setEditorProject({ ...blankProject })}
                      className="group inline-flex items-center justify-center gap-3 rounded-full bg-slate-950 px-6 py-3.5 text-[8px] font-black tracking-[0.2em] uppercase text-white transition-colors hover:bg-sky-600"
                    >
                      <Plus size={13} />
                      Novo projeto
                    </button>
                  </div>

                  <div className="grid grid-cols-2 border-y border-slate-900/10 md:grid-cols-4">
                    {[
                      ['Projetos', projects.length.toString().padStart(2, '0')],
                      ['Publicados', publishedCount.toString().padStart(2, '0')],
                      ['Vídeos', videoCount.toString().padStart(2, '0')],
                      ['Assets', mediaCount.toString().padStart(2, '0')],
                    ].map(([label, value], index) => (
                      <div key={label} className={`py-5 md:py-6 ${index % 2 ? 'border-l border-slate-900/10' : ''} ${index > 1 ? 'border-t border-slate-900/10 md:border-t-0 md:border-l' : ''} ${index === 1 ? 'md:border-l' : ''}`}>
                        <span className="block text-center text-[7px] font-mono tracking-[0.2em] uppercase text-slate-400">{label}</span>
                        <span className="mt-2 block text-center text-2xl font-black tabular-nums tracking-[-0.05em] text-slate-950 md:text-4xl">{value}</span>
                      </div>
                    ))}
                  </div>

                  <div className="grid gap-6 xl:grid-cols-[minmax(0,1.45fr)_minmax(320px,0.75fr)]">
                    <section className="relative min-h-[430px] overflow-hidden rounded-[26px] bg-slate-950 text-white shadow-[0_28px_70px_rgba(15,23,42,0.18)]">
                      <ProjectMedia project={activeProject} className="absolute inset-0 h-full w-full opacity-60" />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/25 to-slate-950/35" />
                      <div className="relative flex min-h-[430px] flex-col justify-between p-6 md:p-8">
                        <div className="flex items-start justify-between">
                          <div>
                            <StatusLabel status={activeProject.status} />
                          </div>
                          <button
                            onClick={() => setEditorProject({ ...activeProject })}
                            className="flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-black/20 text-white/70 backdrop-blur-md hover:border-white/40 hover:text-white"
                            aria-label={`Editar ${activeProject.title}`}
                          >
                            <Pencil size={13} />
                          </button>
                        </div>
                        <div className="max-w-2xl">
                          <img src={activeProject.logoUrl} alt={activeProject.title} className="mb-5 h-9 w-auto object-contain" />
                          <span className="text-[8px] font-mono tracking-[0.18em] uppercase text-sky-300">{activeProject.category}</span>
                          <h2 className="mt-3 text-3xl font-black tracking-[0.14em] uppercase md:text-5xl">{activeProject.title}</h2>
                          <div className="mt-4 flex flex-wrap items-center gap-2 text-[8px] font-mono uppercase tracking-[0.14em]">
                            <span className="text-sky-300">{activeProject.kpi}</span>
                            <span className="text-white/25">/</span>
                            <span className="text-white/55">{activeProject.result}</span>
                          </div>
                        </div>
                      </div>
                    </section>

                    <section className="border-t border-slate-900/10 pt-5 xl:border-l xl:border-t-0 xl:pl-7 xl:pt-0">
                      <div className="flex items-center justify-between pb-4">
                        <div>
                          <span className="text-[7px] font-mono tracking-[0.2em] uppercase text-slate-400">Ordem pública</span>
                          <h2 className="mt-2 text-lg font-black tracking-[-0.025em] text-slate-950">Projetos ativos</h2>
                        </div>
                        <button onClick={() => selectView('portfolio')} className="group flex items-center gap-2 text-[8px] font-bold tracking-[0.14em] uppercase text-slate-500 hover:text-sky-700">
                          Ver todos
                          <ArrowRight size={11} className="transition-transform group-hover:translate-x-1" />
                        </button>
                      </div>

                      <div className="divide-y divide-slate-900/[0.08]">
                        {projects.map((project) => (
                          <button
                            key={project.id}
                            onClick={() => setActiveProjectId(project.id)}
                            className={`group flex w-full items-center gap-4 py-4 text-left ${activeProjectId === project.id ? 'text-sky-700' : 'text-slate-700'}`}
                          >
                            <span className="text-[8px] font-mono text-slate-400">{String(project.order).padStart(2, '0')}</span>
                            <div className="min-w-0 flex-1">
                              <span className="block truncate text-[10px] font-black tracking-[0.12em] uppercase">{project.title}</span>
                              <span className="mt-1 block truncate text-[7px] font-mono tracking-[0.12em] uppercase text-slate-400">{project.mediaKind === 'video' ? 'Vídeo' : 'Imagem'} · {project.kpi}</span>
                            </div>
                            <ChevronRight size={13} className="text-slate-300 transition-transform group-hover:translate-x-1 group-hover:text-sky-500" />
                          </button>
                        ))}
                      </div>
                    </section>
                  </div>
                </motion.div>
              )}

              {activeView === 'portfolio' && (
                <motion.div
                  key="portfolio"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.35 }}
                  className="mx-auto max-w-7xl space-y-7"
                >
                  <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
                    <div>
                      <span className="text-[8px] font-mono tracking-[0.24em] uppercase text-sky-600">Conteúdo administrável</span>
                      <h1 className="mt-2 text-3xl font-black tracking-[-0.04em] text-slate-950 md:text-5xl">Portfólio</h1>
                      <p className="mt-3 max-w-xl text-[10px] leading-relaxed text-slate-500">Ordenação, conteúdos e media apresentados no slider público da homepage.</p>
                    </div>
                    <button
                      onClick={() => setEditorProject({ ...blankProject })}
                      className="inline-flex items-center justify-center gap-3 rounded-full bg-slate-950 px-6 py-3.5 text-[8px] font-black tracking-[0.2em] uppercase text-white hover:bg-sky-600"
                    >
                      <Plus size={13} />
                      Novo projeto
                    </button>
                  </div>

                  <div className="flex flex-col gap-3 border-y border-slate-900/10 py-4 sm:flex-row sm:items-center sm:justify-between">
                    <label className="flex max-w-sm flex-1 items-center gap-3 border-b border-slate-900/15 pb-2 text-slate-400 focus-within:border-sky-500 focus-within:text-sky-600">
                      <Search size={13} />
                      <input
                        value={searchQuery}
                        onChange={(event) => setSearchQuery(event.target.value)}
                        placeholder="Pesquisar projeto"
                        className="w-full bg-transparent text-[9px] font-bold tracking-[0.12em] uppercase text-slate-900 outline-none placeholder:text-slate-400"
                      />
                    </label>
                    <span className="text-[7px] font-mono tracking-[0.18em] uppercase text-slate-400">{filteredProjects.length} projetos</span>
                  </div>

                  <div className="overflow-hidden rounded-[22px] border border-slate-900/[0.08] bg-white/55 backdrop-blur-md">
                    <div className="hidden grid-cols-[34px_72px_minmax(180px,1.3fr)_minmax(130px,0.7fr)_110px_44px] gap-4 border-b border-slate-900/[0.07] px-5 py-3 text-[7px] font-mono tracking-[0.18em] uppercase text-slate-400 md:grid">
                      <span />
                      <span>Media</span>
                      <span>Projeto</span>
                      <span>Performance</span>
                      <span>Estado</span>
                      <span />
                    </div>
                    <div className="divide-y divide-slate-900/[0.07]">
                      {filteredProjects.map((project) => (
                        <div key={project.id} className="group grid items-center gap-4 px-4 py-4 hover:bg-white/70 md:grid-cols-[34px_72px_minmax(180px,1.3fr)_minmax(130px,0.7fr)_110px_44px] md:px-5">
                          <GripVertical size={14} className="hidden text-slate-300 md:block" />
                          <div className="relative h-14 overflow-hidden rounded-xl bg-slate-900">
                            <ProjectMedia project={project} className="h-full w-full opacity-80" />
                            <span className="absolute bottom-1.5 right-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-black/55 text-white backdrop-blur-md">
                              {project.mediaKind === 'video' ? <Film size={9} /> : <ImageIcon size={9} />}
                            </span>
                          </div>
                          <div className="min-w-0">
                            <div className="flex items-center gap-3">
                              <span className="text-[8px] font-mono text-slate-400">{String(project.order).padStart(2, '0')}</span>
                              <span className="truncate text-[11px] font-black tracking-[0.1em] uppercase text-slate-950">{project.title}</span>
                            </div>
                            <span className="mt-1 block truncate text-[7px] font-mono tracking-[0.12em] uppercase text-slate-400">{project.category}</span>
                          </div>
                          <div>
                            <span className="block text-[9px] font-black text-sky-700">{project.kpi}</span>
                            <span className="mt-1 block text-[7px] uppercase tracking-[0.08em] text-slate-400">{project.result}</span>
                          </div>
                          <StatusLabel status={project.status} />
                          <button
                            onClick={() => setEditorProject({ ...project })}
                            className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-900/[0.08] text-slate-400 hover:border-sky-400/50 hover:text-sky-700"
                            aria-label={`Editar ${project.title}`}
                          >
                            <Pencil size={12} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}

              {activeView === 'media' && (
                <motion.div
                  key="media"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  className="mx-auto max-w-7xl space-y-7"
                >
                  <div>
                    <span className="text-[8px] font-mono tracking-[0.24em] uppercase text-sky-600">Assets públicos</span>
                    <h1 className="mt-2 text-3xl font-black tracking-[-0.04em] text-slate-950 md:text-5xl">Biblioteca de Media</h1>
                  </div>

                  <button
                    onClick={() => showPrototypeNotice('Upload disponível quando o Storage for integrado.')}
                    className="group flex min-h-40 w-full flex-col items-center justify-center gap-3 rounded-[22px] border border-dashed border-slate-900/15 bg-white/35 text-slate-400 hover:border-sky-400/60 hover:bg-sky-50/40 hover:text-sky-700"
                  >
                    <span className="flex h-10 w-10 items-center justify-center rounded-full border border-current/20">
                      <Upload size={15} />
                    </span>
                    <span className="text-[8px] font-black tracking-[0.18em] uppercase">Carregar imagem ou vídeo</span>
                    <span className="text-[7px] font-mono tracking-[0.12em] uppercase opacity-60">O limite de 15 segundos será validado nos vídeos</span>
                  </button>

                  <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                    {projects.map((project) => (
                      <div key={project.id} className="overflow-hidden rounded-[20px] border border-slate-900/[0.08] bg-white/50">
                        <div className="relative h-44 bg-slate-950">
                          <ProjectMedia project={project} className="h-full w-full opacity-80" />
                          <span className="absolute left-4 top-4 flex items-center gap-2 rounded-full border border-white/10 bg-black/45 px-3 py-1.5 text-[7px] font-mono tracking-[0.14em] uppercase text-white backdrop-blur-md">
                            {project.mediaKind === 'video' ? <Film size={9} /> : <ImageIcon size={9} />}
                            {project.mediaKind}
                          </span>
                        </div>
                        <div className="flex items-center justify-between p-4">
                          <div>
                            <span className="block text-[9px] font-black tracking-[0.1em] uppercase text-slate-900">{project.title}</span>
                            <span className="mt-1 block text-[7px] font-mono tracking-[0.12em] uppercase text-slate-400">Background principal</span>
                          </div>
                          <button className="p-2 text-slate-400 hover:text-slate-900"><MoreHorizontal size={15} /></button>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

              {activeView === 'clients' && (
                <motion.div
                  key="clients"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  className="mx-auto flex min-h-[65vh] max-w-4xl items-center justify-center text-center"
                >
                  <div>
                    <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full border border-sky-500/20 bg-sky-500/5 text-sky-600"><Users size={18} /></span>
                    <span className="mt-6 block text-[8px] font-mono tracking-[0.24em] uppercase text-sky-600">Módulo previsto</span>
                    <h1 className="mt-3 text-3xl font-black tracking-[-0.04em] text-slate-950 md:text-5xl">Clientes atuais</h1>
                    <p className="mx-auto mt-4 max-w-lg text-[10px] leading-relaxed text-slate-500">Esta área reutilizará o sistema de publicação, ordenação e media definido para o Portfólio.</p>
                  </div>
                </motion.div>
              )}

              {activeView === 'settings' && (
                <motion.div
                  key="settings"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  className="mx-auto max-w-5xl space-y-7"
                >
                  <div>
                    <span className="text-[8px] font-mono tracking-[0.24em] uppercase text-sky-600">Configuração futura</span>
                    <h1 className="mt-2 text-3xl font-black tracking-[-0.04em] text-slate-950 md:text-5xl">Definições</h1>
                  </div>
                  <div className="divide-y divide-slate-900/[0.08] border-y border-slate-900/[0.08]">
                    {[
                      ['Supabase', 'Ligação à base de dados, autenticação e Storage'],
                      ['Equipa', 'Utilizadores privados, permissões e convites'],
                      ['Segurança', 'MFA, sessões e políticas de publicação'],
                    ].map(([title, description]) => (
                      <button key={title} onClick={() => showPrototypeNotice(`${title} será configurado na fase de integração.`)} className="group flex w-full items-center justify-between gap-5 py-5 text-left">
                        <div>
                          <span className="block text-[10px] font-black tracking-[0.12em] uppercase text-slate-900">{title}</span>
                          <span className="mt-1.5 block text-[8px] text-slate-400">{description}</span>
                        </div>
                        <ChevronRight size={14} className="text-slate-300 transition-transform group-hover:translate-x-1 group-hover:text-sky-600" />
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </main>
      </div>

      <AnimatePresence>
        {mobileNavOpen && (
          <motion.button
            type="button"
            aria-label="Fechar navegação"
            className="fixed inset-0 z-40 bg-slate-950/55 backdrop-blur-sm lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setMobileNavOpen(false)}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {editorProject && (
          <>
            <motion.button
              type="button"
              aria-label="Fechar editor"
              className="fixed inset-0 z-[60] bg-slate-950/45 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setEditorProject(null)}
            />
            <motion.aside
              className="fixed inset-y-0 right-0 z-[70] flex w-full max-w-xl flex-col bg-slate-50 shadow-[-30px_0_80px_rgba(2,6,23,0.28)]"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', stiffness: 150, damping: 24 }}
            >
              <div className="flex items-center justify-between border-b border-slate-900/[0.08] px-6 py-5">
                <div>
                  <span className="text-[7px] font-mono tracking-[0.2em] uppercase text-sky-600">Editor de conteúdo</span>
                  <h2 className="mt-1 text-lg font-black tracking-[-0.025em] text-slate-950">{editorProject.id === 'new-project' ? 'Novo projeto' : editorProject.title}</h2>
                </div>
                <button onClick={() => setEditorProject(null)} className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-900/[0.08] text-slate-400 hover:text-slate-950" aria-label="Fechar editor">
                  <X size={14} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto px-6 py-6">
                <div className="mb-6 flex items-center justify-between border-y border-amber-500/15 bg-amber-50/50 px-3 py-2.5">
                  <span className="text-[7px] font-mono tracking-[0.14em] uppercase text-amber-700">Protótipo · alterações não persistidas</span>
                  <StatusLabel status={editorProject.status} />
                </div>

                <div className="relative mb-7 h-52 overflow-hidden rounded-[20px] bg-slate-950">
                  <ProjectMedia project={editorProject} className="h-full w-full opacity-65" />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 to-transparent" />
                  <button onClick={() => showPrototypeNotice('A seleção de media será ligada ao Supabase Storage.')} className="absolute bottom-4 left-4 flex items-center gap-2 rounded-full border border-white/15 bg-black/30 px-4 py-2 text-[7px] font-bold tracking-[0.15em] uppercase text-white backdrop-blur-md">
                    <Upload size={10} />
                    Escolher media
                  </button>
                </div>

                <div className="space-y-5">
                  {[
                    ['Título', 'title'],
                    ['Categoria', 'category'],
                    ['KPI', 'kpi'],
                    ['Resultado', 'result'],
                  ].map(([label, field]) => (
                    <label key={field} className="block">
                      <span className="block text-[7px] font-mono font-bold tracking-[0.18em] uppercase text-slate-400">{label}</span>
                      <input
                        value={editorProject[field as keyof Pick<AdminProjectPreview, 'title' | 'category' | 'kpi' | 'result'>]}
                        onChange={(event) => setEditorProject({ ...editorProject, [field]: event.target.value })}
                        className="mt-2 w-full border-b border-slate-900/15 bg-transparent py-2 text-[11px] font-bold tracking-[0.06em] text-slate-950 outline-none transition-colors focus:border-sky-500"
                      />
                    </label>
                  ))}

                  <label className="block">
                    <span className="block text-[7px] font-mono font-bold tracking-[0.18em] uppercase text-slate-400">Descrição</span>
                    <textarea
                      value={editorProject.description}
                      onChange={(event) => setEditorProject({ ...editorProject, description: event.target.value })}
                      rows={5}
                      className="mt-2 w-full resize-none rounded-xl border border-slate-900/10 bg-white/60 p-3 text-[10px] leading-relaxed text-slate-700 outline-none transition-colors focus:border-sky-500"
                    />
                  </label>
                </div>
              </div>

              <div className="flex items-center justify-between gap-4 border-t border-slate-900/[0.08] bg-white/55 px-6 py-5 backdrop-blur-md">
                <button onClick={() => setEditorProject(null)} className="text-[8px] font-bold tracking-[0.16em] uppercase text-slate-400 hover:text-slate-950">Cancelar</button>
                <button
                  onClick={() => showPrototypeNotice('Simulação concluída — nenhum dado foi persistido.')}
                  className="inline-flex items-center gap-2 rounded-full bg-slate-950 px-5 py-3 text-[8px] font-black tracking-[0.16em] uppercase text-white hover:bg-sky-600"
                >
                  <Check size={11} />
                  Guardar alterações
                </button>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {notice && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 12 }}
            className="fixed bottom-6 left-1/2 z-[90] flex -translate-x-1/2 items-center gap-3 rounded-full border border-white/10 bg-slate-950 px-5 py-3 text-white shadow-2xl"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-sky-400" />
            <span className="whitespace-nowrap text-[7px] font-mono tracking-[0.13em] uppercase">{notice}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
