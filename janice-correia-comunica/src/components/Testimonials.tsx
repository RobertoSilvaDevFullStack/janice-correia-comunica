import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Quote, Star, Target } from "lucide-react";
import { useContactModal } from "@/hooks/useContactModal";
import { useTestimonials } from "@/hooks/useTestimonials";

const Testimonials = () => {
  const { openModal } = useContactModal();
  
  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
  };

  const { data: testimonials } = useTestimonials();

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
          {(testimonials || []).map((testimonial, index) => (
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
                <div className="border-t border-border pt-4 flex items-center gap-4">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={testimonial.avatar} alt={testimonial.name} loading="lazy" decoding="async" />
                    <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                      {getInitials(testimonial.name)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-semibold text-primary">{testimonial.name}</p>
                    <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                    <p className="text-sm text-accent font-medium mt-1">{testimonial.company}</p>
                  </div>
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
          <Button 
            onClick={() => openModal('treinamentos')} 
            size="lg" 
            className="mt-8 btn-gradient"
          >
            <Target className="mr-2" size={20} />
            Quero Esses Resultados
          </Button>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
