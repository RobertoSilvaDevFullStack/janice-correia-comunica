import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Calendar, Clock, Share2 } from 'lucide-react';
import { blogArticles } from '@/data/blogArticles';
import { SEO } from '@/components/SEO';
import { ArticleSchema } from '@/components/SchemaMarkup';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

const BlogPost = () => {
  const { slug } = useParams<{ slug: string }>();
  const article = blogArticles.find((a) => a.slug === slug);

  if (!article) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4">Artigo não encontrado</h1>
            <Link to="/">
              <Button>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Voltar à Home
              </Button>
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: article.title,
          text: article.excerpt,
          url: window.location.href,
        });
      } catch (err) {
        console.log('Erro ao compartilhar:', err);
      }
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <SEO
        title={article.title}
        description={article.metaDescription}
        keywords={article.keywords.join(', ')}
        image={article.image}
        url={`/blog/${article.slug}`}
        type="article"
        publishedTime={article.publishedAt}
      />
      <ArticleSchema
        headline={article.title}
        description={article.metaDescription}
        image={article.image}
        datePublished={article.publishedAt}
        author={article.author}
        url={`https://janicecorreia.com.br/blog/${article.slug}`}
      />
      
      <Navbar />

      <article className="flex-1">
        {/* Hero Section */}
        <div className="relative h-[400px] md:h-[500px] w-full overflow-hidden">
          <img
            src={article.image}
            alt={article.title}
            className="w-full h-full object-cover"
            loading="eager"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
          
          <div className="absolute bottom-0 left-0 right-0 p-6 md:p-12">
            <div className="container mx-auto max-w-4xl">
              <Link to="/#blog">
                <Button variant="ghost" size="sm" className="mb-4 text-foreground/80 hover:text-foreground">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Voltar ao Blog
                </Button>
              </Link>
              
              <Badge className="mb-4">{article.category}</Badge>
              
              <h1 className="text-3xl md:text-5xl font-bold mb-4 text-foreground">
                {article.title}
              </h1>
              
              <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  <time dateTime={article.publishedAt}>
                    {new Date(article.publishedAt).toLocaleDateString('pt-BR', {
                      day: '2-digit',
                      month: 'long',
                      year: 'numeric',
                    })}
                  </time>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  <span>{article.readTime} de leitura</span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleShare}
                  className="ml-auto"
                >
                  <Share2 className="h-4 w-4 mr-2" />
                  Compartilhar
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="container mx-auto max-w-4xl px-6 py-12 md:py-16">
          <div className="prose prose-lg dark:prose-invert max-w-none">
            <p className="text-xl text-muted-foreground leading-relaxed mb-8">
              {article.excerpt}
            </p>
            
            <Separator className="my-8" />
            
            <div dangerouslySetInnerHTML={{ __html: article.content }} />
          </div>

          {/* Author Section */}
          <div className="mt-12 p-6 bg-muted/50 rounded-lg">
            <h3 className="font-semibold text-lg mb-2">Sobre a Autora</h3>
            <p className="text-muted-foreground">
              <strong>{article.author}</strong> é comunicóloga, palestrante e mentora especializada em comunicação estratégica, 
              oratória e experiência do cliente. Com anos de experiência, ajuda profissionais e empresas a transformarem 
              sua comunicação em diferencial competitivo.
            </p>
          </div>

          {/* Related Articles */}
          <div className="mt-16">
            <h2 className="text-2xl font-bold mb-6">Artigos Relacionados</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {blogArticles
                .filter((a) => a.slug !== article.slug && a.category === article.category)
                .slice(0, 2)
                .map((related) => (
                  <Link
                    key={related.id}
                    to={`/blog/${related.slug}`}
                    className="group block"
                  >
                    <div className="relative h-48 overflow-hidden rounded-lg mb-4">
                      <img
                        src={related.image}
                        alt={related.title}
                        className="w-full h-full object-cover transition-transform group-hover:scale-105"
                        loading="lazy"
                      />
                    </div>
                    <Badge className="mb-2">{related.category}</Badge>
                    <h3 className="font-semibold text-lg group-hover:text-primary transition-colors line-clamp-2">
                      {related.title}
                    </h3>
                    <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
                      {related.excerpt}
                    </p>
                  </Link>
                ))}
            </div>
          </div>
        </div>
      </article>

      <Footer />
    </div>
  );
};

export default BlogPost;
