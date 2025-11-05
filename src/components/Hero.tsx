import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import heroImage from "@/assets/hero-image.jpg";

const Hero = () => {
  const scrollToSection = (href: string) => {
    const element = document.querySelector(href);
    element?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section id="home" className="relative min-h-screen flex items-center pt-20">
      <div className="absolute inset-0 z-0">
        <img
          src={heroImage}
          alt="Janice Correia - Comunicação Corporativa"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-primary/95 via-primary/80 to-transparent" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-2xl text-white">
          <h1 className="font-serif text-5xl md:text-6xl lg:text-7xl font-bold mb-6 animate-fade-in">
            Transforme a Comunicação da Sua Empresa
          </h1>
          <p className="text-xl md:text-2xl mb-4 text-white/90">
            Especialista em Oratória Corporativa e Comunicação Estratégica
          </p>
          <p className="text-lg mb-8 text-white/80">
            Há mais de 15 anos ajudando empresas e profissionais a alcançarem resultados extraordinários através de uma comunicação clara, assertiva e impactante.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Button
              onClick={() => scrollToSection("#palestras")}
              size="lg"
              className="btn-gradient text-primary-foreground font-semibold"
            >
              Conheça as Palestras
              <ArrowRight className="ml-2" size={20} />
            </Button>
            <Button
              onClick={() => scrollToSection("#mentorias")}
              size="lg"
              variant="outline"
              className="bg-white/10 border-white/30 text-white hover:bg-white/20 backdrop-blur-sm"
            >
              Mentorias Personalizadas
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
