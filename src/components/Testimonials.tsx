import { Card, CardContent } from "@/components/ui/card";
import { Quote, Star } from "lucide-react";

const Testimonials = () => {
  const testimonials = [
    {
      name: "Carlos Eduardo Silva",
      role: "CEO, Engelux",
      company: "Engelux",
      content: "A palestra da Janice transformou completamente a forma como nossa equipe se comunica. Os resultados foram imediatos: mais clareza nas reuniões, menos conflitos e maior produtividade. Uma investimento que valeu cada centavo!",
      rating: 5,
    },
    {
      name: "Ana Paula Mendes",
      role: "Diretora de RH, Plano e Plano",
      company: "Plano e Plano",
      content: "Contratamos a Janice para um treinamento in-company e superou todas as expectativas. Ela tem uma didática excepcional e consegue engajar até os mais tímidos. Recomendo sem ressalvas!",
      rating: 5,
    },
    {
      name: "Dr. Ricardo Almeida",
      role: "Sócio-fundador, Elilon Advocacia",
      company: "Elilon Advocacia",
      content: "Como advogados, precisamos nos comunicar com clareza e persuasão. O programa de mentoria da Janice aprimorou nossas habilidades de oratória e nos deu ferramentas valiosas para apresentações mais impactantes.",
      rating: 5,
    },
    {
      name: "Mariana Costa",
      role: "Gerente de Marketing",
      company: "Tech Solutions",
      content: "A mentoria individual foi um divisor de águas na minha carreira. Aprendi a me posicionar com segurança em reuniões e apresentações. A Janice é uma profissional excepcional!",
      rating: 5,
    },
    {
      name: "João Pedro Santos",
      role: "Diretor Comercial",
      company: "Distribuidora Nacional",
      content: "As palestras da Janice sobre comunicação com clientes transformaram nosso atendimento. Tivemos um aumento de 30% na satisfação dos clientes em apenas 3 meses.",
      rating: 5,
    },
    {
      name: "Fernanda Lima",
      role: "Coordenadora de Treinamento",
      company: "Grupo Empresarial ABC",
      content: "Já trouxemos a Janice para 3 eventos diferentes e em todos ela foi um sucesso absoluto. Conteúdo de qualidade, entrega impecável e feedbacks sempre muito positivos!",
      rating: 5,
    },
  ];

  return (
    <section id="depoimentos" className="py-20 bg-secondary/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="font-serif text-4xl md:text-5xl font-bold text-primary mb-6">
            Depoimentos & Cases de Sucesso
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Veja o que nossos clientes têm a dizer sobre os resultados alcançados
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="relative card-hover">
              <CardContent className="pt-6">
                <Quote className="w-10 h-10 text-accent/20 mb-4" />
                <div className="flex gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-accent text-accent" />
                  ))}
                </div>
                <p className="text-muted-foreground mb-6 italic">
                  "{testimonial.content}"
                </p>
                <div className="border-t border-border pt-4">
                  <p className="font-semibold text-primary">{testimonial.name}</p>
                  <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                  <p className="text-sm text-accent font-medium mt-1">{testimonial.company}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-16 bg-card p-8 rounded-lg shadow-soft text-center max-w-3xl mx-auto">
          <h3 className="font-serif text-2xl font-bold text-primary mb-4">
            Resultados Comprovados
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
            <div>
              <p className="text-4xl font-bold text-accent mb-2">500+</p>
              <p className="text-muted-foreground">Profissionais Treinados</p>
            </div>
            <div>
              <p className="text-4xl font-bold text-accent mb-2">50+</p>
              <p className="text-muted-foreground">Empresas Atendidas</p>
            </div>
            <div>
              <p className="text-4xl font-bold text-accent mb-2">98%</p>
              <p className="text-muted-foreground">Satisfação dos Clientes</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
