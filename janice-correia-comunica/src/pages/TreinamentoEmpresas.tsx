import { Button } from "@/components/ui/button";
import { SEO } from "@/components/SEO";
import capaPalestras from "@/assets/janice-palestras-capa.png";
import palestraMulheres from "@/assets/janice-palestra-mulheres.jpg";

const TreinamentoEmpresas = () => {
  return (
    <main className="bg-background">
      <SEO
        title="Treinamento Corporativo"
        description="Programas de treinamento corporativo para equipes: comunicação, oratória e CX com resultados mensuráveis."
        keywords="treinamento corporativo, comunicação empresarial, oratória, experiência do cliente, soft skills, equipes"
        url="/treinamento-empresas"
      />

      <section className="pt-24 md:pt-28 pb-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h1 className="font-serif text-4xl md:text-5xl font-bold text-primary mb-6">Treinamento Corporativo</h1>
              <p className="text-lg text-muted-foreground mb-6">
                Desenvolva equipes mais seguras, técnicas e preparadas para oferecer uma experiência do cliente
                mais fluida e profissional. Programas sob medida, focados em comunicação clara, oratória e práticas de CX.
              </p>
              <Button size="lg" className="btn-gradient" onClick={() => window.location.hash = "#contato"}>
                Agendar Conversa
              </Button>
            </div>
            <img
              src={palestraMulheres}
              alt="Equipe em treinamento"
              className="w-full h-auto rounded-lg shadow-soft object-cover"
              loading="lazy"
              decoding="async"
            />
          </div>
        </div>
      </section>

      <section className="py-12">
        <div className="container mx-auto px-4">
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-primary mb-6">Nossa Metodologia</h2>
          <div className="space-y-4 text-muted-foreground max-w-4xl">
            <p>
              Começamos com uma imersão no cenário da empresa para entender objetivos, desafios e necessidades do time.
              A partir disso, construímos módulos práticos e aplicáveis ao dia a dia, com conteúdos aderentes ao contexto.
            </p>
            <p>
              Os encontros combinam conceitos essenciais de comunicação com exercícios, simulações e feedbacks individuais.
              O foco é reforçar comportamentos de clareza, empatia e assertividade nas interações internas e com clientes.
            </p>
            <p>
              Utilizamos exemplos reais e linguagem objetiva para acelerar a aprendizagem e reduzir ruídos de comunicação.
              O programa inclui materiais de apoio e planos de ação para sustentar a mudança após os treinamentos.
            </p>
            <p>
              Mensuramos resultados com indicadores de qualidade de atendimento, retrabalho e satisfação do cliente,
              permitindo ajustes e evolução contínua.
            </p>
          </div>
        </div>
      </section>

      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-8 items-start">
            <div>
              <h2 className="font-serif text-3xl md:text-4xl font-bold text-primary mb-6">Cases de Sucesso</h2>
              <ul className="space-y-3 text-muted-foreground max-w-3xl list-disc list-inside">
                <li>
                  Redução de retrabalhos e aumento de NPS em empresa de serviços após ciclos práticos de oratória e CX.
                </li>
                <li>
                  Melhoria da clareza nas reuniões e eficiência em apresentações internas com estrutura de conteúdo e presença.
                </li>
                <li>
                  Evolução de scripts e mensagens em canais digitais, com comunicação mais empática e objetiva.
                </li>
              </ul>
            </div>
            <img
              src={capaPalestras}
              alt="Resultados do treinamento"
              className="w-full h-auto rounded-lg shadow-soft object-cover"
              loading="lazy"
              decoding="async"
            />
          </div>
        </div>
      </section>

      <section className="py-12">
        <div className="container mx-auto px-4 text-center">
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-primary mb-4">Pronto para avançar?</h2>
          <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
            Agende uma conversa inicial gratuita para mapear objetivos e desenhar um programa sob medida para sua equipe.
          </p>
          <Button size="lg" className="btn-gradient" onClick={() => window.location.hash = "#contato"}>
            Agendar Treinamento
          </Button>
        </div>
      </section>
    </main>
  );
};

export default TreinamentoEmpresas;