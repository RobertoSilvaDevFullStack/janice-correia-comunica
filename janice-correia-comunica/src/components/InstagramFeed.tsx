import { Instagram, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import perfilImg from "@/assets/janice-perfil.jpg?w=720";
import perfilImgWebp from "@/assets/janice-perfil.jpg?format=webp&w=720";
import capaEngelux from "@/assets/treinamento-engelux-relacionamento.jpg?w=720";
import capaEngeluxWebp from "@/assets/treinamento-engelux-relacionamento.jpg?format=webp&w=720";
import capaEscola from "@/assets/treinamento-escola.jpg?w=720";
import capaEscolaWebp from "@/assets/treinamento-escola.jpg?format=webp&w=720";
import capaJr from "@/assets/treinamento-jr-distribuicao.jpg?w=720";
import capaJrWebp from "@/assets/treinamento-jr-distribuicao.jpg?format=webp&w=720";
import capaElilon from "@/assets/treinamento-elilon.jpg?w=720";
import capaElilonWebp from "@/assets/treinamento-elilon.jpg?format=webp&w=720";
import capaPlano from "@/assets/treinamento-plano.jpg?w=720";
import capaPlanoWebp from "@/assets/treinamento-plano.jpg?format=webp&w=720";
import { ScrollReveal } from "@/components/ScrollReveal";

const InstagramFeed = () => {
  // Origem das imagens: arquivos locais em `src/assets`.
  // Propósito do redirecionamento: ao clicar, abrir o perfil/Instagram em nova aba.
  const staticPosts = [
    {
      id: 1,
      image: perfilImg,
      imageWebp: perfilImgWebp,
      caption: "Dica de comunicação: escute mais do que fala! 🎯",
      link: "https://www.instagram.com/janic_correia/",
    },
    {
      id: 2,
      image: capaEngelux,
      imageWebp: capaEngeluxWebp,
      caption: "Workshop com a equipe da Engelux! 💼",
      link: "https://www.instagram.com/janic_correia/",
    },
    {
      id: 3,
      image: capaJr,
      imageWebp: capaJrWebp,
      caption: "Oratória corporativa - momento inspirador! ✨",
      link: "https://www.instagram.com/janic_correia/",
    },
    {
      id: 4,
      image: capaElilon,
      imageWebp: capaElilonWebp,
      caption: "Transformando líderes através da comunicação eficaz 🚀",
      link: "https://www.instagram.com/janic_correia/",
    },
    {
      id: 5,
      image: capaPlano,
      imageWebp: capaPlanoWebp,
      caption: "Cada apresentação impacta vidas 💡",
      link: "https://www.instagram.com/janic_correia/",
    },
    {
      id: 6,
      image: capaEscola,
      imageWebp: capaEscolaWebp,
      caption:
        "Comunicação clara é a base de qualquer relacionamento profissional 📊",
      link: "https://www.instagram.com/janic_correia/",
    },
  ];

  const [error, setError] = useState<string | null>(null);
  const [imageErrors, setImageErrors] = useState<Record<number, boolean>>({});

  const ensureInstagramUrl = (url: string) => {
    try {
      const parsed = new URL(url);
      return parsed.hostname.includes("instagram.com")
        ? url
        : "https://www.instagram.com/";
    } catch {
      return "https://www.instagram.com/";
    }
  };

  const openInstagram = (url: string) => {
    const safeUrl = ensureInstagramUrl(url);
    try {
      const newWin = window.open(safeUrl, "_blank");
      if (!newWin) {
        setError(
          "Não foi possível abrir o Instagram (popup bloqueado ou indisponível)."
        );
      }
    } catch {
      setError("Link do Instagram indisponível. Tente novamente mais tarde.");
    }
  };

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <ScrollReveal className="text-center mb-12" threshold={0.25} durationMs={1600}>
          <div className="inline-flex items-center gap-3 mb-4">
            <Instagram className="w-8 h-8 text-accent" />
            <h2 className="font-serif text-4xl md:text-5xl font-bold text-primary">
              Acompanhe no Instagram
            </h2>
          </div>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-6">
            Dicas diárias, bastidores de palestras e conteúdos exclusivos sobre
            comunicação corporativa
          </p>
          <Button
            variant="default"
            size="lg"
            className="btn-gradient"
            onClick={() =>
              window.open("https://www.instagram.com/janic_correia/", "_blank")
            }
          >
            <Instagram className="mr-2" size={20} />
            Seguir @janic_correia
            <ExternalLink className="ml-2" size={16} />
          </Button>
        </ScrollReveal>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {staticPosts.map((post, idx) => (
            <ScrollReveal key={post.id} className="relative" style={{ transitionDelay: `${idx * 180}ms` }} variant="scale" threshold={0.25}>
            <div
              className="group cursor-pointer overflow-hidden rounded-lg card-hover"
              onClick={() => openInstagram(post.link)}
            >
              {imageErrors[post.id] ? (
                <div className="w-full h-full aspect-square flex items-center justify-center bg-muted">
                  <span className="text-muted-foreground text-sm">
                    Imagem não encontrada
                  </span>
                </div>
              ) : (
                <picture>
                  <source srcSet={post.imageWebp} type="image/webp" />
                  <img
                    src={post.image}
                    alt={post.caption}
                    className="w-full h-full aspect-square object-cover transition-transform duration-300 group-hover:scale-105"
                    loading="lazy"
                    decoding="async"
                    onError={() =>
                      setImageErrors((prev) => ({ ...prev, [post.id]: true }))
                    }
                  />
                </picture>
              )}
              <div className="absolute inset-0 bg-primary/90 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center p-4">
                <p className="text-white text-sm text-center line-clamp-3">
                  {post.caption}
                </p>
              </div>
            </div>
            </ScrollReveal>
          ))}
        </div>

        {error && (
          <p className="text-center text-sm text-destructive mt-4">{error}</p>
        )}
      </div>
    </section>
  );
};

export default InstagramFeed;
