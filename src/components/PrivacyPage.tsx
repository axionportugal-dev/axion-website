import {
  ArrowLeft,
  Mail,
  ShieldCheck,
} from 'lucide-react';

import Logo from './Logo';

interface PrivacyPageProps {
  onBackToHome: () => void;
}

export default function PrivacyPage({
  onBackToHome,
}: PrivacyPageProps) {
  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <header className="border-b border-white/[0.08]">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-6">
          <button
            type="button"
            onClick={onBackToHome}
            className="flex items-center gap-2 text-[9px] font-bold uppercase tracking-[0.18em] text-slate-400 transition-colors hover:text-white"
          >
            <ArrowLeft size={13} />

            <span>
              Voltar ao início
            </span>
          </button>

          <div className="flex items-center gap-3">
            <Logo
              theme="dark"
              glow={false}
              className="h-7 w-7"
            />

            <span className="text-xs font-black uppercase tracking-[0.3em]">
              AXION
            </span>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-4xl px-6 py-16 md:py-24">
        <div className="mb-14">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-sky-400/20 bg-sky-400/[0.06] px-4 py-2">
            <ShieldCheck
              size={13}
              className="text-sky-400"
            />

            <span className="font-mono text-[8px] font-bold uppercase tracking-[0.22em] text-sky-300">
              Privacidade e proteção de dados
            </span>
          </div>

          <h1 className="max-w-3xl text-4xl font-black tracking-[-0.04em] sm:text-5xl md:text-6xl">
            Política de Privacidade
          </h1>

          <p className="mt-5 max-w-2xl text-sm leading-relaxed text-slate-400">
            Esta política explica como são tratados
            os dados pessoais fornecidos através do
            website da AXION, nomeadamente através
            do formulário de pedido de orçamento.
          </p>

          <p className="mt-4 font-mono text-[9px] uppercase tracking-[0.15em] text-slate-600">
            Última atualização: 6 de outubro de 2026
          </p>
        </div>

        <div className="space-y-12 text-sm leading-7 text-slate-300">
          <section>
            <h2 className="mb-4 text-xl font-black text-white">
              1. Quem é responsável pelos seus dados
            </h2>

            <p>
              A AXION é atualmente um projeto
              desenvolvido e gerido conjuntamente por
              três responsáveis, não estando constituída
              como sociedade comercial.
            </p>

            <p className="mt-4">
              Para efeitos de proteção de dados, são
              responsáveis conjuntos pelo tratamento:
            </p>

            <div className="mt-5 rounded-2xl border border-white/[0.08] bg-white/[0.03] p-6">
              <p>
                João Guilherme Teixeira Pinto Santos Silva
              </p>

              <p>
                Eduardo Santos De Sousa
              </p>

              <p>
                Nelson Blyznyuk Afonso
              </p>
            </div>

            <p className="mt-5">
              Para qualquer questão relacionada com
              privacidade ou proteção de dados pode
              contactar:
            </p>

            <a
              href="mailto:axionportugal@gmail.com"
              className="mt-3 inline-flex items-center gap-2 font-semibold text-sky-400 hover:text-sky-300"
            >
              <Mail size={14} />
              axionportugal@gmail.com
            </a>
          </section>

          <section>
            <h2 className="mb-4 text-xl font-black text-white">
              2. Que dados recolhemos
            </h2>

            <p>
              Quando submete um pedido através do
              website, podemos tratar os dados que
              fornece diretamente, incluindo nome ou
              empresa, endereço de email, telefone,
              função na empresa, dimensão da operação,
              objetivo do projeto, serviços pretendidos,
              orçamento estimado e outras informações
              que decida incluir na descrição do projeto.
            </p>

            <p className="mt-4">
              Podem ainda ser tratados dados técnicos
              estritamente necessários à segurança do
              website, como o endereço IP utilizado para
              prevenção de abuso e limitação de pedidos
              excessivos.
            </p>
          </section>

          <section>
            <h2 className="mb-4 text-xl font-black text-white">
              3. Para que utilizamos os dados
            </h2>

            <p>
              Os dados enviados através do formulário
              são utilizados para analisar o pedido,
              compreender as necessidades apresentadas,
              preparar uma eventual proposta comercial
              e contactar o utilizador relativamente ao
              projeto apresentado.
            </p>

            <p className="mt-4">
              Não utilizamos os dados submetidos através
              deste formulário para envio automático de
              newsletters ou marketing não solicitado.
            </p>
          </section>

          <section>
            <h2 className="mb-4 text-xl font-black text-white">
              4. Fundamento jurídico
            </h2>

            <p>
              O tratamento dos dados necessários para
              responder a um pedido de contacto,
              orçamento ou proposta é realizado para
              desenvolver diligências solicitadas pelo
              próprio titular antes da eventual
              celebração de um contrato.
            </p>

            <p className="mt-4">
              O tratamento de dados técnicos necessário
              para proteger o website, prevenir abuso e
              garantir a segurança do serviço baseia-se
              no interesse legítimo dos responsáveis em
              manter o website seguro e funcional.
            </p>
          </section>

          <section>
            <h2 className="mb-4 text-xl font-black text-white">
              5. Prestadores de serviços
            </h2>

            <p>
              Para disponibilizar o website e processar
              os pedidos de contacto recorremos a
              prestadores técnicos que podem tratar
              dados em nosso nome, nomeadamente a
              Railway, utilizada para alojamento da
              aplicação, e a Resend, utilizada para
              envio das notificações de email geradas
              pelo formulário.
            </p>

            <p className="mt-4">
              Estes prestadores atuam de acordo com os
              respetivos termos e mecanismos de proteção
              de dados. Alguns tratamentos podem envolver
              transferências de dados para fora do Espaço
              Económico Europeu, sendo aplicadas, quando
              necessário, as garantias previstas no RGPD.
            </p>
          </section>

          <section>
            <h2 className="mb-4 text-xl font-black text-white">
              6. Prazo de conservação
            </h2>

            <p>
              Quando um pedido não resulta numa relação
              comercial, os dados associados ao contacto
              serão conservados, em regra, até 12 meses
              após o último contacto relevante, salvo se
              existir uma razão legítima ou obrigação
              legal que justifique outro prazo.
            </p>

            <p className="mt-4">
              Se vier a ser estabelecida uma relação
              contratual, determinados dados poderão ser
              conservados durante os períodos necessários
              ao cumprimento das obrigações contratuais,
              contabilísticas, fiscais ou legais
              aplicáveis.
            </p>
          </section>

          <section>
            <h2 className="mb-4 text-xl font-black text-white">
              7. Os seus direitos
            </h2>

            <p>
              Nos termos da legislação aplicável, pode
              solicitar, quando aplicável, acesso aos
              seus dados pessoais, retificação de dados
              inexatos, apagamento, limitação do
              tratamento, portabilidade ou oposição ao
              tratamento.
            </p>

            <p className="mt-4">
              Para exercer estes direitos basta contactar
              os responsáveis através de
              axionportugal@gmail.com.
            </p>

            <p className="mt-4">
              Tem também o direito de apresentar uma
              reclamação junto da Comissão Nacional de
              Proteção de Dados — CNPD.
            </p>
          </section>

          <section>
            <h2 className="mb-4 text-xl font-black text-white">
              8. Segurança
            </h2>

            <p>
              São aplicadas medidas técnicas e
              organizativas destinadas a reduzir riscos
              de acesso não autorizado, utilização
              indevida, perda ou divulgação indevida dos
              dados, incluindo validação dos pedidos,
              limitação de submissões e medidas
              anti-spam.
            </p>

            <p className="mt-4">
              Nenhum sistema ligado à Internet permite
              garantir segurança absoluta, pelo que as
              medidas adotadas são revistas à medida que
              o projeto evolui.
            </p>
          </section>

          <section>
            <h2 className="mb-4 text-xl font-black text-white">
              9. Alterações a esta política
            </h2>

            <p>
              Esta política poderá ser atualizada sempre
              que forem alteradas as funcionalidades do
              website, os tratamentos de dados ou os
              prestadores utilizados. A versão publicada
              nesta página será a versão aplicável em
              cada momento.
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}