import { Award, BookOpen, Users, TrendingUp } from "lucide-react";

const About = () => {
  const achievements = [
    {
      icon: Award,
      title: "15+ Anos de Experiência",
      description: "Dedicados à excelência em comunicação corporativa",
    },
    {
      icon: Users,
      title: "500+ Profissionais Treinados",
      description: "Empresas como Engelux, Plano e Plano, Elilon Advocacia",
    },
    {
      icon: BookOpen,
      title: "Mestrado em Comunicação",
      description: "Formação acadêmica sólida aliada à prática",
    },
    {
      icon: TrendingUp,
      title: "Resultados Comprovados",
      description: "Cases de sucesso em diversos segmentos",
    },
  ];

  return (
    <section id="sobre" className="py-20 bg-secondary/30">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="font-serif text-4xl md:text-5xl font-bold text-primary mb-6">
            Sobre Janice Correia
          </h2>
          <p className="text-lg text-muted-foreground leading-relaxed">
            Jornalista, Mestre em Comunicação e especialista em oratória corporativa, dedico minha carreira a empoderar profissionais e empresas através da comunicação estratégica. Com uma abordagem personalizada e focada em resultados, transformo a maneira como as pessoas se comunicam no ambiente corporativo.
          </p>
          <p className="text-lg text-muted-foreground leading-relaxed mt-4">
            <strong className="text-primary">Minha missão:</strong> Comunicar bem é investir nos resultados do seu negócio. Cada palavra, cada apresentação, cada interação é uma oportunidade de gerar impacto e alcançar seus objetivos.
          </p>
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
      </div>
    </section>
  );
};

export default About;
