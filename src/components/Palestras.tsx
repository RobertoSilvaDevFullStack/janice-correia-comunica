import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageSquare, Users, Target, Sparkles } from "lucide-react";
import palestra1 from "@/assets/palestra-1.jpg";
import palestra2 from "@/assets/palestra-2.jpg";

const Palestras = () => {
  const palestras = [
    {
      title: "Comunicação Assertiva no Ambiente Corporativo",
      description: "Aprenda técnicas práticas para se comunicar com clareza, empatia e impacto, reduzindo conflitos e aumentando a produtividade.",
      image: palestra1,
      icon: MessageSquare,
      cases: "Engelux, Plano e Plano",
      topics: ["Técnicas de escuta ativa", "Comunicação não-violenta", "Feedback construtivo"],
    },
    {
      title: "Oratória para Líderes",
      description: "Desenvolva presença de palco, confiança e capacidade de inspirar equipes através de apresentações memoráveis.",
      image: palestra2,
      icon: Users,
      cases: "Elilon Advocacia, Empresas de Tecnologia",
      topics: ["Storytelling corporativo", "Gestão do nervosismo", "Linguagem corporal"],
    },
    {
      title: "Experiência do Cliente através da Comunicação",
      description: "Como a comunicação estratégica pode transformar a experiência do cliente e aumentar a satisfação e fidelização.",
      image: palestra1,
      icon: Target,
      cases: "Varejo e Serviços",
      topics: ["Comunicação empática", "Gestão de expectativas", "Resolução de conflitos"],
    },
    {
      title: "Comunicação em Tempos de Crise",
      description: "Estratégias para manter a clareza, transparência e confiança em momentos desafiadores.",
      image: palestra2,
      icon: Sparkles,
      cases: "Diversos Segmentos",
      topics: ["Gestão de crise", "Comunicação transparente", "Liderança em momentos críticos"],
    },
  ];

  const scrollToContact = () => {
    const element = document.querySelector("#contato");
    element?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section id="palestras" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="font-serif text-4xl md:text-5xl font-bold text-primary mb-6">
            Palestras Corporativas
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Palestras personalizadas que transformam a comunicação da sua empresa e geram resultados concretos
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {palestras.map((palestra, index) => (
            <Card key={index} className="overflow-hidden card-hover">
              <div className="relative h-48 overflow-hidden">
                <img
                  src={palestra.image}
                  alt={palestra.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-4 right-4 bg-accent text-accent-foreground p-3 rounded-full">
                  <palestra.icon size={24} />
                </div>
              </div>
              <CardHeader>
                <CardTitle className="font-serif text-2xl text-primary">
                  {palestra.title}
                </CardTitle>
                <CardDescription className="text-base">
                  {palestra.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="mb-4">
                  <p className="text-sm font-semibold text-accent mb-2">Cases de Sucesso:</p>
                  <p className="text-sm text-muted-foreground">{palestra.cases}</p>
                </div>
                <div className="mb-4">
                  <p className="text-sm font-semibold text-primary mb-2">Principais Tópicos:</p>
                  <ul className="space-y-1">
                    {palestra.topics.map((topic, idx) => (
                      <li key={idx} className="text-sm text-muted-foreground flex items-center">
                        <span className="w-1.5 h-1.5 bg-accent rounded-full mr-2" />
                        {topic}
                      </li>
                    ))}
                  </ul>
                </div>
                <Button onClick={scrollToContact} variant="default" className="w-full">
                  Solicitar Palestra
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center">
          <p className="text-muted-foreground mb-4">
            Palestras customizadas para atender as necessidades específicas da sua empresa
          </p>
          <Button onClick={scrollToContact} size="lg" variant="outline">
            Fale Conosco
          </Button>
        </div>
      </div>
    </section>
  );
};

export default Palestras;
