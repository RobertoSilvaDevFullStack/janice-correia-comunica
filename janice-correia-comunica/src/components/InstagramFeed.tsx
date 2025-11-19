import { Instagram, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";

const InstagramFeed = () => {
  // Placeholder para feed do Instagram - em produção, seria integrado com a API do Instagram
  const instagramPosts = [
    {
      id: 1,
      image: "https://images.unsplash.com/photo-1557804506-669a67965ba0?w=400&h=400&fit=crop",
      caption: "Dica de comunicação do dia: escute mais do que fala! 🎯",
      likes: 234,
    },
    {
      id: 2,
      image: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&h=400&fit=crop",
      caption: "Workshop incríveis com a equipe da Engelux! 💼",
      likes: 189,
    },
    {
      id: 3,
      image: "https://images.unsplash.com/photo-1531482615713-2afd69097998?w=400&h=400&fit=crop",
      caption: "A comunicação clara é a base de qualquer relacionamento profissional 📊",
      likes: 312,
    },
    {
      id: 4,
      image: "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=400&h=400&fit=crop",
      caption: "Palestra sobre oratória corporativa - momento inspirador! ✨",
      likes: 267,
    },
    {
      id: 5,
      image: "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=400&h=400&fit=crop",
      caption: "Transformando líderes através da comunicação eficaz 🚀",
      likes: 198,
    },
    {
      id: 6,
      image: "https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=400&h=400&fit=crop",
      caption: "Cada apresentação é uma oportunidade de impactar vidas 💡",
      likes: 276,
    },
  ];

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-3 mb-4">
            <Instagram className="w-8 h-8 text-accent" />
            <h2 className="font-serif text-4xl md:text-5xl font-bold text-primary">
              Acompanhe no Instagram
            </h2>
          </div>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-6">
            Dicas diárias, bastidores de palestras e conteúdos exclusivos sobre comunicação corporativa
          </p>
          <Button
            variant="default"
            size="lg"
            className="btn-gradient"
            onClick={() => window.open("https://instagram.com/janicecorreia", "_blank")}
          >
            <Instagram className="mr-2" size={20} />
            Seguir @janicecorreia
            <ExternalLink className="ml-2" size={16} />
          </Button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {instagramPosts.map((post) => (
            <div
              key={post.id}
              className="relative group cursor-pointer overflow-hidden rounded-lg card-hover"
              onClick={() => window.open("https://instagram.com/janicecorreia", "_blank")}
            >
              <img
                src={post.image}
                alt={post.caption}
                className="w-full h-full aspect-square object-cover"
              />
              <div className="absolute inset-0 bg-primary/90 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center p-4">
                <p className="text-white text-sm text-center line-clamp-3">
                  {post.caption}
                </p>
              </div>
            </div>
          ))}
        </div>

        <p className="text-center text-sm text-muted-foreground mt-8">
          * Feed ilustrativo - Em produção, seria integrado diretamente com a API do Instagram
        </p>
      </div>
    </section>
  );
};

export default InstagramFeed;
