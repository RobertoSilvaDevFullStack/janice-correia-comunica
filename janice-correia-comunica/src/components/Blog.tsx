import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, ArrowRight, Mail } from "lucide-react";
import { useContactModal } from "@/hooks/useContactModal";
import { useBlogPosts } from "@/hooks/useBlogPosts";

const Blog = () => {
  const { openModal } = useContactModal();
  const { data: posts } = useBlogPosts('published');

  const estimateReadTime = (content?: string) => {
    if (!content) return '5 min';
    const words = content.replace(/<[^>]*>/g, ' ').split(/\s+/).filter(Boolean).length;
    const minutes = Math.max(3, Math.round(words / 200));
    return `${minutes} min`;
  };

  return (
    <section id="blog" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="font-serif text-4xl md:text-5xl font-bold text-primary mb-6">
            Blog & Insights
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Artigos, dicas e reflexões sobre comunicação corporativa, oratória e desenvolvimento profissional
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {(posts || []).map((article, index) => (
            <Card key={index} className="overflow-hidden card-hover group">
              <div className="relative h-48 overflow-hidden">
                <img
                  src={article.image}
                  alt={article.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <Badge className="absolute top-4 left-4 bg-accent text-accent-foreground">
                  {article.category}
                </Badge>
              </div>
              <CardHeader>
                <CardTitle className="font-serif text-xl text-primary group-hover:text-accent transition-colors">
                  {article.title}
                </CardTitle>
                <CardDescription>{article.excerpt}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                  <div className="flex items-center gap-1">
                    <Calendar size={16} />
                    <span>{new Date(article.published_at).toLocaleDateString('pt-BR')}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock size={16} />
                    <span>{estimateReadTime(article.content)}</span>
                  </div>
                </div>
                <Button variant="link" className="p-0 h-auto text-primary group-hover:text-accent">
                  Ler mais
                  <ArrowRight className="ml-1 group-hover:translate-x-1 transition-transform" size={16} />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="mt-16 max-w-3xl mx-auto text-center p-8 shadow-soft bg-gradient-to-br from-primary/5 to-accent/5">
          <h3 className="font-serif text-2xl md:text-3xl font-bold text-primary mb-4">
            Receba Conteúdos Exclusivos
          </h3>
          <p className="text-muted-foreground mb-6 max-w-xl mx-auto">
            Inscreva-se na nossa newsletter e receba insights valiosos sobre comunicação corporativa direto no seu e-mail
          </p>
          <Button onClick={() => openModal('newsletter')} size="lg" className="btn-gradient">
            <Mail className="mr-2" size={20} />
            Quero Receber
          </Button>
        </Card>
      </div>
    </section>
  );
};

export default Blog;
