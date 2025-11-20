import { Instagram, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import api from "@/lib/api";
import { useEffect, useState } from "react";

const InstagramFeed = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [posts, setPosts] = useState<Array<{ id: string; media_url: string; caption?: string; permalink: string }>>([]);

  // Fallback ilustrativo
  const fallbackPosts = [
    {
      id: 1,
      image:
        "https://www.instagram.com/reel/DBw6JxdSEVS/?utm_source=ig_web_copy_link&igsh=MzRlODBiNWFlZA==",
      caption: "Dica de comunicação do dia: escute mais do que fala! 🎯",
      likes: 234,
    },
    {
      id: 2,
      image:
        "https://www.instagram.com/p/DQz9LqSEg16/?utm_source=ig_web_copy_link&igsh=MzRlODBiNWFlZA==",
      caption: "Workshop incríveis com a equipe da Engelux! 💼",
      likes: 189,
    },
    {
      id: 3,
      image:
        "https://www.instagram.com/p/DD8PZAqOYZa/?utm_source=ig_web_copy_link&igsh=MzRlODBiNWFlZA==",
      caption:
        "A comunicação clara é a base de qualquer relacionamento profissional 📊",
      likes: 312,
    },
    {
      id: 4,
      image:
        "https://www.instagram.com/p/DQz9LqSEg16/?utm_source=ig_web_copy_link&igsh=MzRlODBiNWFlZA==",
      caption: "Palestra sobre oratória corporativa - momento inspirador! ✨",
      likes: 267,
    },
    {
      id: 5,
      image:
        "https://www.instagram.com/p/C5EuJFkrBxB/?utm_source=ig_web_copy_link&igsh=MzRlODBiNWFlZA==",
      caption: "Transformando líderes através da comunicação eficaz 🚀",
      likes: 198,
    },
    {
      id: 6,
      image:
        "https://www.instagram.com/p/C4lszkxr7NC/?utm_source=ig_web_copy_link&igsh=MzRlODBiNWFlZA==",
      caption: "Cada apresentação é uma oportunidade de impactar vidas 💡",
      likes: 276,
    },
  ];

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        setError(null);
        const { data } = await api.get<Array<{ id: string; media_url: string; caption?: string; permalink: string }>>("/instagram/feed");
        setPosts(data);
      } catch (e: unknown) {
        const msg = (e as { response?: { data?: { error?: string } } }).response?.data?.error || "Não foi possível carregar o feed do Instagram";
        setError(msg);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

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
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {(loading ? [] : (posts.length ? posts.map(p => ({ id: p.id, image: p.media_url, caption: p.caption || "", link: p.permalink })) : fallbackPosts)).map((post) => (
            <div
              key={post.id}
              className="relative group cursor-pointer overflow-hidden rounded-lg card-hover"
              onClick={() => window.open((post as any).link || "https://instagram.com/janic_correia", "_blank")}
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

        {!loading && error && (
          <p className="text-center text-sm text-destructive mt-4">{error}</p>
        )}
        {loading && (
          <p className="text-center text-sm text-muted-foreground mt-4">Carregando feed...</p>
        )}

        <p className="text-center text-sm text-muted-foreground mt-8">
          * Caso a API esteja indisponível, um feed ilustrativo é exibido como fallback.
        </p>
      </div>
    </section>
  );
};

export default InstagramFeed;
