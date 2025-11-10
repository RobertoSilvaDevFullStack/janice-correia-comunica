import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { TipTapEditor } from '@/components/admin/TipTapEditor';
import { useCreateBlogPost, useUpdateBlogPost, useBlogPost } from '@/hooks/useBlogPosts';
import { toast } from 'sonner';
import { ArrowLeft, Save, Eye, X } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const blogPostSchema = z.object({
  title: z.string().min(3, 'Título deve ter no mínimo 3 caracteres').max(200),
  slug: z.string().min(3).max(200).regex(/^[a-z0-9-]+$/, 'Slug deve conter apenas letras minúsculas, números e hífens'),
  content: z.string().min(100, 'Conteúdo deve ter no mínimo 100 caracteres'),
  excerpt: z.string().max(300, 'Resumo deve ter no máximo 300 caracteres'),
  category: z.string().min(2),
  image: z.string().url('URL da imagem inválida'),
  meta_description: z.string().max(160, 'Meta descrição deve ter no máximo 160 caracteres'),
  status: z.enum(['draft', 'published']),
});

type BlogPostFormData = z.infer<typeof blogPostSchema>;

const BlogPostForm = () => {
  const navigate = useNavigate();
  const { slug } = useParams();
  const isEditing = !!slug;
  
  const [content, setContent] = useState('');
  const [keywords, setKeywords] = useState<string[]>([]);
  const [keywordInput, setKeywordInput] = useState('');
  const [activeTab, setActiveTab] = useState('edit');

  const { data: existingPost } = useBlogPost(slug || '');
  const createMutation = useCreateBlogPost();
  const updateMutation = useUpdateBlogPost();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<BlogPostFormData>({
    resolver: zodResolver(blogPostSchema),
    defaultValues: {
      status: 'draft',
    },
  });

  useEffect(() => {
    if (existingPost) {
      setValue('title', existingPost.title);
      setValue('slug', existingPost.slug);
      setValue('excerpt', existingPost.excerpt);
      setValue('category', existingPost.category);
      setValue('image', existingPost.image);
      setValue('meta_description', existingPost.meta_description);
      setValue('status', existingPost.status);
      setContent(existingPost.content);
      setKeywords(existingPost.keywords || []);
    }
  }, [existingPost, setValue]);

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const title = e.target.value;
    setValue('title', title);
    if (!isEditing) {
      setValue('slug', generateSlug(title));
    }
  };

  const addKeyword = () => {
    if (keywordInput.trim() && !keywords.includes(keywordInput.trim())) {
      setKeywords([...keywords, keywordInput.trim()]);
      setKeywordInput('');
    }
  };

  const removeKeyword = (keyword: string) => {
    setKeywords(keywords.filter(k => k !== keyword));
  };

  const onSubmit = async (data: BlogPostFormData) => {
    try {
      const postData = {
        ...data,
        content,
        keywords,
      };

      if (isEditing && existingPost) {
        await updateMutation.mutateAsync({ id: existingPost.id, ...postData });
        toast.success('Post atualizado com sucesso!');
      } else {
        await createMutation.mutateAsync(postData);
        toast.success('Post criado com sucesso!');
      }
      navigate('/admin/blog');
    } catch (error) {
      toast.error('Erro ao salvar post');
    }
  };

  const formData = watch();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate('/admin/blog')}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-serif font-bold text-primary">
              {isEditing ? 'Editar Post' : 'Novo Post'}
            </h1>
            <p className="text-muted-foreground">
              {isEditing ? 'Atualize as informações do post' : 'Crie um novo artigo para o blog'}
            </p>
          </div>
        </div>
        <Button onClick={handleSubmit(onSubmit)} className="btn-gradient">
          <Save className="mr-2 h-4 w-4" />
          Salvar
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="edit">Editar</TabsTrigger>
          <TabsTrigger value="preview">Preview</TabsTrigger>
        </TabsList>

        <TabsContent value="edit" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Informações Básicas</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="title">Título *</Label>
                <Input
                  id="title"
                  {...register('title')}
                  onChange={handleTitleChange}
                  placeholder="Ex: Como a Inteligência Emocional Transforma Líderes"
                />
                {errors.title && (
                  <p className="text-sm text-destructive mt-1">{errors.title.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="slug">Slug *</Label>
                <Input
                  id="slug"
                  {...register('slug')}
                  placeholder="como-inteligencia-emocional-transforma-lideres"
                />
                {errors.slug && (
                  <p className="text-sm text-destructive mt-1">{errors.slug.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="excerpt">Resumo *</Label>
                <Textarea
                  id="excerpt"
                  {...register('excerpt')}
                  placeholder="Breve descrição do artigo (máx. 300 caracteres)"
                  rows={3}
                />
                {errors.excerpt && (
                  <p className="text-sm text-destructive mt-1">{errors.excerpt.message}</p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="category">Categoria *</Label>
                  <Input
                    id="category"
                    {...register('category')}
                    placeholder="Liderança, Inteligência Emocional, etc."
                  />
                  {errors.category && (
                    <p className="text-sm text-destructive mt-1">{errors.category.message}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="status">Status *</Label>
                  <Select
                    value={formData.status}
                    onValueChange={(value) => setValue('status', value as 'draft' | 'published')}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="draft">Rascunho</SelectItem>
                      <SelectItem value="published">Publicado</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="image">URL da Imagem de Capa *</Label>
                <Input
                  id="image"
                  {...register('image')}
                  placeholder="https://exemplo.com/imagem.jpg"
                />
                {errors.image && (
                  <p className="text-sm text-destructive mt-1">{errors.image.message}</p>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Conteúdo</CardTitle>
            </CardHeader>
            <CardContent>
              <TipTapEditor content={content} onChange={setContent} />
              {errors.content && (
                <p className="text-sm text-destructive mt-2">{errors.content.message}</p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>SEO</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="meta_description">Meta Descrição *</Label>
                <Textarea
                  id="meta_description"
                  {...register('meta_description')}
                  placeholder="Descrição para mecanismos de busca (máx. 160 caracteres)"
                  rows={2}
                />
                {errors.meta_description && (
                  <p className="text-sm text-destructive mt-1">{errors.meta_description.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="keywords">Palavras-chave</Label>
                <div className="flex gap-2">
                  <Input
                    id="keywords"
                    value={keywordInput}
                    onChange={(e) => setKeywordInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addKeyword())}
                    placeholder="Digite e pressione Enter"
                  />
                  <Button type="button" onClick={addKeyword}>Adicionar</Button>
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {keywords.map((keyword) => (
                    <Badge key={keyword} variant="secondary" className="gap-1">
                      {keyword}
                      <X
                        className="h-3 w-3 cursor-pointer"
                        onClick={() => removeKeyword(keyword)}
                      />
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="preview">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Eye className="h-5 w-5" />
                Preview do Artigo
              </CardTitle>
            </CardHeader>
            <CardContent>
              <article className="prose prose-lg max-w-none">
                {formData.image && (
                  <img
                    src={formData.image}
                    alt={formData.title}
                    className="w-full h-64 object-cover rounded-lg mb-6"
                  />
                )}
                <div className="mb-4">
                  <Badge variant="outline">{formData.category}</Badge>
                </div>
                <h1 className="text-4xl font-serif font-bold mb-4">{formData.title || 'Título do Post'}</h1>
                <p className="text-lg text-muted-foreground mb-6">{formData.excerpt}</p>
                <div dangerouslySetInnerHTML={{ __html: content }} />
              </article>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default BlogPostForm;
