import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, ArrowRight } from "lucide-react";

const Blog = () => {
  const articles = [
    {
      title: "5 Técnicas de Oratória que Todo Líder Deveria Dominar",
      excerpt: "Descubra as estratégias essenciais para se comunicar com impacto e inspirar sua equipe em qualquer situação.",
      category: "Oratória",
      date: "15 de Janeiro, 2025",
      readTime: "5 min",
      image: "https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=800&h=400&fit=crop",
    },
    {
      title: "Como a Comunicação Assertiva Transforma Relacionamentos Corporativos",
      excerpt: "Aprenda a se expressar de forma clara e respeitosa, reduzindo conflitos e aumentando a produtividade da equipe.",
      category: "Comunicação",
      date: "10 de Janeiro, 2025",
      readTime: "7 min",
      image: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=400&fit=crop",
    },
    {
      title: "A Arte da Escuta Ativa: O Segredo dos Grandes Comunicadores",
      excerpt: "Entenda por que ouvir é tão importante quanto falar e como desenvolver essa habilidade crucial.",
      category: "Comunicação",
      date: "5 de Janeiro, 2025",
      readTime: "6 min",
      image: "https://images.unsplash.com/photo-1577415124269-fc1140ec4bad?w=800&h=400&fit=crop",
    },
    {
      title: "Experiência do Cliente: O Papel Fundamental da Comunicação",
      excerpt: "Como uma comunicação estratégica pode transformar a experiência do cliente e aumentar a fidelização.",
      category: "Experiência do Cliente",
      date: "28 de Dezembro, 2024",
      readTime: "8 min",
      image: "https://images.unsplash.com/photo-1556761175-b413da4baf72?w=800&h=400&fit=crop",
    },
    {
      title: "Storytelling Corporativo: Conecte-se Emocionalmente com Sua Audiência",
      excerpt: "Aprenda a usar histórias poderosas para tornar suas apresentações memoráveis e persuasivas.",
      category: "Oratória",
      date: "20 de Dezembro, 2024",
      readTime: "6 min",
      image: "https://images.unsplash.com/photo-1553028826-f4804a6dba3b?w=800&h=400&fit=crop",
    },
    {
      title: "Gestão de Crise: Comunicação Transparente em Momentos Desafiadores",
      excerpt: "Estratégias para manter a confiança e credibilidade da sua empresa durante períodos turbulentos.",
      category: "Gestão",
      date: "15 de Dezembro, 2024",
      readTime: "9 min",
      image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&h=400&fit=crop",
    },
  ];

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
          {articles.map((article, index) => (
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
                    <span>{article.date}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock size={16} />
                    <span>{article.readTime}</span>
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

        <div className="text-center mt-12">
          <Button variant="outline" size="lg">
            Ver Todos os Artigos
          </Button>
        </div>
      </div>
    </section>
  );
};

export default Blog;
