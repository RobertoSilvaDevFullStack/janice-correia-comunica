import { Award, BookOpen, Users, TrendingUp, Mic, MessageCircle, Handshake, Target, Sparkles, Megaphone, Lightbulb } from "lucide-react";
import aboutImage from "@/assets/janice-perfil.jpg";
import historyImage from "@/assets/apresentanddo-festa-beju.png";

const About = () => {
  const achievements = [
    {
      icon: Award,
      title: "15+ Anos de Experiência",
      description: "Dedicados à excelência em comunicação corporativa",
    },
    {
      icon: Users,
      title: "200+ Profissionais treinados",
      description:
        "Empresas como Engelux, Plano e Plano, Elilon Lopes Advogados e JR Distribuidora",
    },
    {
      icon: BookOpen,
      title: "Mestrado em Comunicação",
      description: "Formação acadêmica sólida aliada à prática",
    },
    {
      icon: TrendingUp,
      title: "Resultados comprovados",
      description: "Cases de sucesso em diversos segmentos",
    },
  ];

  return (
    <section id="sobre" className="py-20 bg-secondary/30">
      <div className="container mx-auto px-4">
        {/* Sobre Janice com imagem */}
        <div className="mx-auto mb-16 grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
          <div className="order-2 md:order-1">
            <h2 className="font-serif text-4xl md:text-5xl font-bold text-primary mb-6">
              Sobre Janice Correia
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Janice Correia é jornalista, mestra em Ciências da Comunicação e
              especialista em comunicação, oratória e experiência do cliente.{" "}
              <br></br>
              <br></br>Com ampla experiência em treinamentos corporativos, já
              produziu programas de treinamento para empresas B2B e B2C, todos
              focados em times de relacionamentos com clientes e vendas.
              <br></br>
              <br></br>Seu método combina técniccas modernas de oratória,
              comunicação verbal e não verbal, português corporativos e práticas
              de CX, sempre com o foco em resultados reais: redução de ruídos,
              aumento da confiança e melhoria direta na experiência do cliente.
              Além dos treinamentos empresariais, oferece curso particular de
              oratória para quem deseja evoluir rapidamente, com acompanhamento
              personalizado, feedback detalhado e desenvolvimento de discursos,
              roteiros e apresentações.
            </p>
            <p className="text-lg text-muted-foreground leading-relaxed mt-4">
            <strong className="text-primary">Seu propósito é simples:</strong>{" "}
            ajudar pessoas e empresas a se comunicarem melhor - com clareza,
            gentileza e impacto.
          </p>
          <div className="mt-8 md:mt-10 lg:mt-12">
            <div className="flex justify-center gap-8">
              {[{ icon: Mic, text: "Oratória e presença" }, { icon: MessageCircle, text: "Comunicação clara" }].map((item, i) => (
                <div key={i} className="flex flex-col items-center text-center">
                  <item.icon className="w-12 h-12 md:w-14 md:h-14 text-accent mb-3" />
                  <span className="text-sm md:text-base text-muted-foreground">{item.text}</span>
                </div>
              ))}
            </div>
            <div className="flex justify-center gap-8 mt-10 md:mt-12 lg:mt-14">
              {[{ icon: Handshake, text: "Experiência do cliente" }, { icon: Target, text: "Foco em resultados" }, { icon: Sparkles, text: "Evolução prática" }].map((item, i) => (
                <div key={i} className="flex flex-col items-center text-center">
                  <item.icon className="w-12 h-12 md:w-14 md:h-14 text-accent mb-3" />
                  <span className="text-sm md:text-base text-muted-foreground">{item.text}</span>
                </div>
              ))}
            </div>
            <div className="flex justify-center gap-8 mt-10 md:mt-12 lg:mt-14">
              {[{ icon: Megaphone, text: "Apresentações impactantes" }, { icon: Lightbulb, text: "Ideias que conectam" }].map((item, i) => (
                <div key={i} className="flex flex-col items-center text-center">
                  <item.icon className="w-12 h-12 md:w-14 md:h-14 text-accent mb-3" />
                  <span className="text-sm md:text-base text-muted-foreground">{item.text}</span>
                </div>
              ))}
            </div>
          </div>
          </div>
          <div className="order-1 md:order-2">
            <img
              src={aboutImage}
              alt="Janice Correia em palestra"
              className="w-full h-auto rounded-lg shadow-medium"
              loading="lazy"
              decoding="async"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {achievements.map((item, index) => (
            <div
              key={index}
              className="bg-card p-6 rounded-lg shadow-soft hover:shadow-medium transition-all card-hover"
            >
              <item.icon className="w-12 h-12 text-accent mb-4" />
              <h3 className="font-serif text-xl font-semibold text-primary mb-2">
                {item.title}
              </h3>
              <p className="text-muted-foreground">{item.description}</p>
            </div>
          ))}
        </div>

        {/* Minha história com imagem */}
        <div className="mx-auto mt-12 grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
          <div>
            <img
              src={historyImage}
              alt="Janice Correia em mentoria"
              className="w-full h-auto rounded-lg shadow-medium"
              loading="lazy"
              decoding="async"
            />
          </div>
          <div className="text-justify">
            <h3 className="font-serif text-3xl md:text-4xl font-semibold text-primary mb-5">
              Minha história
            </h3>
            <div className="space-y-4 text-lg text-muted-foreground leading-relaxed">
              <p>
                Sou apaixonada por comunicação desde muito cedo. Quando eu tinha
                uns seis anos, morava na roça com a minha família e passava
                horas no quintal “apresentando” programas de TV. Um sabugo de
                milho era meu microfone; as galinhas, o meu público. A voz,
                desde ali, já era meu caminho.
              </p>
              <p>
                Aos 17 anos, consegui meu primeiro emprego como locutora de
                rádio; e, a partir daí, a comunicação deixou de ser brincadeira
                e se tornou a minha profissão. Ao longo dos anos, fui secretária
                de comunicação da prefeitura da minha cidade natal, repórter,
                mestra de cerimônias, redatora, celebrante de casamentos e
                especialista em experiência do cliente com foco em conteúdo.
              </p>
              <p>
                Depois de quase 20 anos de estrada, percebi um padrão: muita
                gente tem ótimas ideias, mas não consegue transmiti-las com
                clareza, segurança ou impacto. Foi aí que encontrei meu
                propósito — ajudar pessoas e equipes a confiarem na própria voz.
              </p>
              <p>
                Trabalho com oratória, comunicação profissional e experiência do
                cliente porque acredito que toda interação pode ser mais leve,
                mais humana e mais eficiente. Já treinei equipes de setores
                diversos, apoiei profissionais que precisavam vencer o medo de
                falar e ajudei empresas a melhorarem a forma como se conectam
                com seus clientes. Meu método é prático, acolhedor e direto ao
                ponto. Transformo teoria em ação, treino situações reais, ajusto
                voz, ritmo, postura e, principalmente, fortaleço a confiança de
                quem está comigo.
              </p>
              <p>
                Seja em aulas individuais ou em treinamentos corporativos, meu
                objetivo é o mesmo: mostrar que comunicar bem não é um dom, é
                uma habilidade que se desenvolve com técnica, prática e
                orientação certa.
              </p>
              <p>E eu estou aqui para caminhar com você nesse processo.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
