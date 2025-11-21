import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Quote, Star, Target } from "lucide-react";
import { useContactModal } from "@/hooks/useContactModal";
import { useTestimonials } from "@/hooks/useTestimonials";
import { ScrollReveal } from "@/components/ScrollReveal";

const Testimonials = () => {
  const { openModal } = useContactModal();
  
  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
  };

  const { data: testimonials } = useTestimonials();

  return (
    <section id="depoimentos" className="py-20 bg-secondary/30">
      <div className="container mx-auto px-4">
        <ScrollReveal className="text-center mb-16" threshold={0.25} durationMs={1600}>
          <h2 className="font-serif text-4xl md:text-5xl font-bold text-primary mb-6">
            Depoimentos & Cases de Sucesso
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Veja o que nossos clientes têm a dizer sobre os resultados alcançados
          </p>
        </ScrollReveal>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {(testimonials || []).map((testimonial, index) => (
            <ScrollReveal key={index} className="relative" style={{ transitionDelay: `${index * 180}ms` }} variant="scale" threshold={0.25}>
            <Card className="relative card-hover">
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
                    <p className="text-sm text-muted-foreground">{testimonial.position}</p>
                    <p className="text-sm text-accent font-medium mt-1">{testimonial.company}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            </ScrollReveal>
          ))}
        </div>

        
      </div>
    </section>
  );
};

export default Testimonials;
