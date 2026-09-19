export interface SeoConfig {
  title: string;
  description: string;
}

export const homeSeo: SeoConfig = {
  title:
    'AXION | Sistemas Digitais, Web, Automação e Inteligência Artificial',

  description:
    'A AXION desenvolve websites, plataformas, sistemas internos, automações, marketing digital e soluções de inteligência artificial adaptadas às necessidades reais das empresas.',
};

export const servicesHubSeo: SeoConfig = {
  title:
    'Serviços Digitais para Empresas | AXION',

  description:
    'Branding, desenvolvimento web, marketing, social media, CRM, automação e inteligência artificial integrados numa estrutura digital adaptada a cada negócio.',
};

export const servicesSeo: Record<
  string,
  SeoConfig
> = {
  'branding-identidade': {
    title:
      'Branding e Identidade Visual | AXION',

    description:
      'Criamos identidades visuais, sistemas de marca, posicionamento e rebranding preparados para comunicar com consistência e crescer com o negócio.',
  },

  websites: {
    title:
      'Desenvolvimento Web e Produtos Digitais | AXION',

    description:
      'Desenvolvemos websites, plataformas, produtos digitais e software à medida com foco em experiência, performance e integração.',
  },

  'marketing-digital': {
    title:
      'Marketing Digital e Aquisição | AXION',

    description:
      'Estratégia de marketing digital, geração de leads, SEO, publicidade digital e otimização de conversão orientadas a objetivos comerciais.',
  },

  'gestao-redes-sociais': {
    title:
      'Gestão de Redes Sociais e Conteúdo | AXION',

    description:
      'Estratégia de social media, criação de conteúdo, planeamento editorial e gestão de presença digital alinhados com a identidade da marca.',
  },

  'crm-automacao': {
    title:
      'CRM, Sistemas e Automação para Empresas | AXION',

    description:
      'Criamos e integramos CRM, sistemas de gestão, pipelines, ferramentas internas e automações para organizar processos, equipas, leads e operação.',
  },

  'inteligencia-artificial': {
    title:
      'Inteligência Artificial para Empresas | AXION',

    description:
      'Integramos agentes de IA, assistentes inteligentes, automações e soluções de inteligência artificial nos processos reais das empresas.',
  },
};