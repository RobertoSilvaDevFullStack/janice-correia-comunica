import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { Button } from "@/components/ui/button";
import { SEO } from "@/components/SEO";
import capaPalestras from "@/assets/janice-palestras-capa.png";
import palestraMulheres from "@/assets/janice-palestra-mulheres.jpg";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { ScrollReveal } from "@/components/ScrollReveal";

const TreinamentoEmpresas = () => {
  return (
    <SidebarProvider className="bg-background">
      <Navbar />
      <SEO
        title="Treinamento Corporativo"
        description="Programas de treinamento corporativo para equipes: comunicação, oratória e CX com resultados mensuráveis."
        keywords="treinamento corporativo, comunicação empresarial, oratória, experiência do cliente, soft skills, equipes"
        url="/treinamento-empresas"
      />
      
      <SidebarInset>
          <section className="pt-24 md:pt-28 pb-12" id="treinamentos">
            <div className="max-w-7xl mx-auto px-4">
              <div className="flex flex-col md:flex-row items-center gap-10">
                <ScrollReveal variant="left" threshold={0.3} durationMs={1600}>
                  <h1 className="font-serif text-4xl md:text-5xl font-bold text-primary mb-6">
                    Treinamento Corporativo
                  </h1>
                  <p className="text-lg text-muted-foreground mb-6 max-w-xl">
                    Desenvolva equipes mais seguras, técnicas e preparadas para
                    oferecer uma experiência do cliente mais fluida e
                    profissional. Programas sob medida, focados em comunicação
                    clara, oratória e práticas de CX.
                  </p>
                  <Button
                    size="lg"
                    className="btn-gradient"
                    onClick={() => (window.location.hash = "#contato")}
                  >
                    Agendar Conversa
                  </Button>
                </ScrollReveal>
                <ScrollReveal className="w-full md:w-1/2" variant="right" threshold={0.3} durationMs={1600} delayMs={200}>
                  <img
                    src={palestraMulheres}
                    alt="Equipe em treinamento"
                    className="w-full md:h-96 rounded-lg shadow-soft object-cover"
                    loading="lazy"
                    decoding="async"
                  />
                </ScrollReveal>
              </div>
            </div>
          </section>

          <section className="py-12">
            <div className="container mx-auto px-4">
              <ScrollReveal className="prose prose-neutral max-w-none" threshold={0.25} durationMs={1600}>
                <h2
                  id="treinamentos-conteudo"
                  className="font-serif text-3xl md:text-4xl font-bold text-primary mb-6"
                >
                  Treinamentos para empresas
                </h2>
                <p>
                  <strong>
                    Comunicação clara, gentil e eficiente para fortalecer o
                    relacionamento com os seus clientes
                  </strong>
                </p>
                <p>
                  Os treinamentos corporativos são construídos sob medida para
                  equipes que desejam elevar o padrão de comunicação —
                  presencial, por telefone, e-mail, WhatsApp ou em
                  apresentações. O foco é desenvolver times mais seguros,
                  técnicos e preparados para oferecer uma experiência do cliente
                  mais fluida, empática e profissional.
                </p>
                <h3
                  id="principais-temas"
                  className="font-serif text-2xl md:text-3xl font-bold text-primary mt-8"
                >
                  Principais temas trabalhados
                </h3>
                <ul>
                  <li>
                    <strong>
                      Comunicação verbal com clareza e objetividade:
                    </strong>{" "}
                    técnicas para transmitir mensagens objetivas, completas e
                    sem ruídos.
                  </li>
                  <li>
                    <strong>
                      Oratória para apresentações internas e externas:
                    </strong>{" "}
                    estrutura de conteúdos, presença comunicativa e domínio de
                    voz e ritmo.
                  </li>
                  <li>
                    <strong>Atendimento ao cliente:</strong> linguagem
                    profissional, empatia, assertividade e condução eficiente de
                    chamadas, reuniões e conversas via mensagens.
                  </li>
                  <li>
                    <strong>
                      Português corporativo aplicado ao atendimento:
                    </strong>{" "}
                    como escrever com precisão, evitar ambiguidades, eliminar
                    vícios de linguagem e reforçar credibilidade.
                  </li>
                  <li>
                    <strong>
                      Gestão de conflitos e argumentação sob pressão:
                    </strong>{" "}
                    estratégias para conduzir objeções, situações difíceis e
                    clientes insatisfeitos.
                  </li>
                  <li>
                    <strong>
                      Postura profissional e comunicação não verbal:
                    </strong>{" "}
                    gestos, expressão facial, organização da fala e alinhamento
                    entre conteúdo e presença.
                  </li>
                </ul>
                <h3
                  id="resultados"
                  className="font-serif text-2xl md:text-3xl font-bold text-primary mt-8"
                >
                  Resultados que sua empresa percebe
                </h3>
                <ul>
                  <li>Times mais seguros, preparados e profissionais.</li>
                  <li>
                    Redução de retrabalhos causados por falhas de comunicação.
                  </li>
                  <li>Atendimento mais claro, acolhedor e eficiente.</li>
                  <li>Melhora direta na experiência do cliente (CX).</li>
                  <li>
                    Colaboradores mais conscientes do impacto de cada interação.
                  </li>
                  <li>
                    Aumento da confiança em reuniões, apresentações e
                    negociações.
                  </li>
                </ul>
                <h3
                  id="como-funcionam"
                  className="font-serif text-2xl md:text-3xl font-bold text-primary mt-8"
                >
                  Como os treinamentos funcionam
                </h3>
                <ol>
                  <li>
                    <strong>Imersão e diagnóstico:</strong> entendimento do
                    cenário, desafios e necessidades da equipe.
                  </li>
                  <li>
                    <strong>Construção do programa:</strong> estruturação dos
                    módulos e atividades práticas de acordo com a realidade da
                    empresa.
                  </li>
                  <li>
                    <strong>Encontros ao vivo:</strong> aulas dinâmicas,
                    exercícios, simulações e cenários reais de atendimento.
                  </li>
                </ol>
                <h3
                  id="diferenciais"
                  className="font-serif text-2xl md:text-3xl font-bold text-primary mt-8"
                >
                  Diferenciais dos treinamentos
                </h3>
                <ul>
                  <li>Conteúdos adaptados ao segmento da empresa.</li>
                  <li>
                    Treinamentos práticos, dinâmicos e focados no dia a dia da
                    equipe.
                  </li>
                  <li>
                    Experiência em CX, comunicação corporativa e oratória.
                  </li>
                  <li>Versões para equipes grandes ou pequenos grupos.</li>
                  <li>Formatos on-line ou presenciais.</li>
                </ul>
              </ScrollReveal>
            </div>
          </section>

          <section className="py-12">
            <ScrollReveal className="container mx-auto px-4 text-center" threshold={0.25} durationMs={1600}>
              <h2 className="font-serif text-3xl md:text-4xl font-bold text-primary mb-4">
                Pronto para avançar?
              </h2>
              <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
                Agende uma conversa inicial gratuita para mapear objetivos e
                desenhar um programa sob medida para sua equipe.
              </p>
              <Button
                size="lg"
                className="btn-gradient"
                onClick={() => (window.location.hash = "#contato")}
              >
                Agendar Treinamento
              </Button>
            </ScrollReveal>
          </section>
          <Footer />
          <WhatsAppButton />
      </SidebarInset>
    </SidebarProvider>
  );
};

export default TreinamentoEmpresas;
