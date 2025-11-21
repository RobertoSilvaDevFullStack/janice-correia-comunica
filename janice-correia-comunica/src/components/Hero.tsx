import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useContactModal } from "@/hooks/useContactModal";
import heroImage from "@/assets/janice-palestra-mulheres-capa.jpg";
import { ScrollReveal } from "@/components/ScrollReveal";
import { Helmet } from "react-helmet-async";
import { useState } from "react";

const Hero = () => {
  const { openModal } = useContactModal();

  const goTo = (hash: string) => {
    const el = document.querySelector(hash);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    } else {
      window.location.href = `/${hash}`;
    }
  };

  const [imgLoaded, setImgLoaded] = useState(false);

  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center pt-20"
    >
      <Helmet>
        <link rel="preload" as="image" href={heroImage} />
      </Helmet>
      <div className="absolute inset-0 z-0">
        <img
          src={heroImage}
          alt="Janice Correia - Comunicação Corporativa"
          className={`w-full h-full object-cover transition-opacity duration-700 ${
            imgLoaded ? "opacity-100" : "opacity-0"
          }`}
          loading="eager"
          decoding="async"
          fetchPriority="high"
          onLoad={() => setImgLoaded(true)}
        />
        {!imgLoaded && (
          <div className="w-full h-full bg-gradient-to-r from-primary/60 via-primary/40 to-primary/20" />
        )}
        <div className="absolute inset-0 bg-gradient-to-l from-primary/95 via-primary/80 to-transparent" />
      </div>

      <div className="container mx-auto px-4 relative z-10 flex justify-end">
        <ScrollReveal
          className="max-w-2xl text-white text-right"
          variant="right"
          durationMs={1600}
        >
          <h1 className="font-serif text-5xl md:text-6xl lg:text-7xl font-bold mb-6 animate-fade-in">
            Treinamentos de comunicação e oratória para profissionais e empresas
          </h1>
          {/* <p
            className="text-xl md:text-2xl mb-4 text-white/90 animate-fade-in"
            style={{ transitionDelay: "150ms" }}
          >
            Especialista em oratória corporativa e comunicação Estratégica
          </p> */}
          <p
            className="text-lg mb-8 text-white/80 animate-fade-in"
            style={{ transitionDelay: "300ms" }}
          >
            Mentorias individuais e treinamentos corporativos de comunicação e
            oratória para aprimorar presença, expressividade e relacionamento
            com clientes.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-end sm:justify-end">
            <Button
              onClick={() => goTo("#mentorias")}
              size="lg"
              className="btn-gradient text-primary-foreground font-semibold"
            >
              Curso particular de oratória
              <ArrowRight className="ml-2" size={20} />
            </Button>
            <Button
              onClick={() => goTo("#palestras")}
              size="lg"
              variant="outline"
              className="bg-white/10 border-white/30 text-white hover:bg-white/20 backdrop-blur-sm"
            >
              Treinamento para empresas
            </Button>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
};

export default Hero;
