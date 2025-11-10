import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useTestimonials, useCreateTestimonial, useUpdateTestimonial } from '@/hooks/useTestimonials';
import { toast } from 'sonner';
import { ArrowLeft, Save, Star } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const testimonialSchema = z.object({
  name: z.string().min(2, 'Nome deve ter no mínimo 2 caracteres').max(100),
  position: z.string().min(2, 'Cargo deve ter no mínimo 2 caracteres').max(100),
  company: z.string().min(2, 'Empresa deve ter no mínimo 2 caracteres').max(100),
  content: z.string().min(10, 'Depoimento deve ter no mínimo 10 caracteres').max(500),
  rating: z.number().min(1).max(5),
  avatar: z.string().url('URL do avatar inválida'),
});

type TestimonialFormData = z.infer<typeof testimonialSchema>;

const TestimonialForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = !!id;

  const { data: testimonials } = useTestimonials();
  const createMutation = useCreateTestimonial();
  const updateMutation = useUpdateTestimonial();

  const existingTestimonial = testimonials?.find(t => t.id === id);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<TestimonialFormData>({
    resolver: zodResolver(testimonialSchema),
    defaultValues: {
      rating: 5,
    },
  });

  useEffect(() => {
    if (existingTestimonial) {
      setValue('name', existingTestimonial.name);
      setValue('position', existingTestimonial.position);
      setValue('company', existingTestimonial.company);
      setValue('content', existingTestimonial.content);
      setValue('rating', existingTestimonial.rating || 5);
      setValue('avatar', existingTestimonial.avatar || '');
    }
  }, [existingTestimonial, setValue]);

  const onSubmit = async (data: TestimonialFormData) => {
    try {
      if (isEditing && existingTestimonial) {
        await updateMutation.mutateAsync({ id: existingTestimonial.id, ...data });
        toast.success('Depoimento atualizado com sucesso!');
      } else {
        await createMutation.mutateAsync(data);
        toast.success('Depoimento criado com sucesso!');
      }
      navigate('/admin/testimonials');
    } catch (error) {
      toast.error('Erro ao salvar depoimento');
    }
  };

  const rating = watch('rating');

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate('/admin/testimonials')}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-serif font-bold text-primary">
              {isEditing ? 'Editar Depoimento' : 'Novo Depoimento'}
            </h1>
            <p className="text-muted-foreground">
              {isEditing ? 'Atualize as informações do depoimento' : 'Adicione um novo depoimento'}
            </p>
          </div>
        </div>
        <Button onClick={handleSubmit(onSubmit)} className="btn-gradient">
          <Save className="mr-2 h-4 w-4" />
          Salvar
        </Button>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Informações do Cliente</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="name">Nome Completo *</Label>
              <Input
                id="name"
                {...register('name')}
                placeholder="Ex: Carlos Silva"
              />
              {errors.name && (
                <p className="text-sm text-destructive mt-1">{errors.name.message}</p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="position">Cargo *</Label>
                <Input
                  id="position"
                  {...register('position')}
                  placeholder="Ex: Diretor Comercial"
                />
                {errors.position && (
                  <p className="text-sm text-destructive mt-1">{errors.position.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="company">Empresa *</Label>
                <Input
                  id="company"
                  {...register('company')}
                  placeholder="Ex: Tech Solutions"
                />
                {errors.company && (
                  <p className="text-sm text-destructive mt-1">{errors.company.message}</p>
                )}
              </div>
            </div>

            <div>
              <Label htmlFor="avatar">URL do Avatar *</Label>
              <Input
                id="avatar"
                {...register('avatar')}
                placeholder="https://api.dicebear.com/7.x/avataaars/svg?seed=Carlos"
              />
              {errors.avatar && (
                <p className="text-sm text-destructive mt-1">{errors.avatar.message}</p>
              )}
              <p className="text-xs text-muted-foreground mt-1">
                Dica: Use{' '}
                <a
                  href="https://www.dicebear.com/playground?style=avataaars"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary underline"
                >
                  DiceBear Avataaars
                </a>
                {' '}para gerar avatares personalizados
              </p>
            </div>

            <div>
              <Label htmlFor="rating">Avaliação *</Label>
              <Select
                value={rating?.toString()}
                onValueChange={(value) => setValue('rating', parseInt(value))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {[5, 4, 3, 2, 1].map((num) => (
                    <SelectItem key={num} value={num.toString()}>
                      <div className="flex items-center gap-2">
                        <span>{num}</span>
                        <div className="flex">
                          {Array.from({ length: num }).map((_, i) => (
                            <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          ))}
                        </div>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.rating && (
                <p className="text-sm text-destructive mt-1">{errors.rating.message}</p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Depoimento</CardTitle>
          </CardHeader>
          <CardContent>
            <div>
              <Label htmlFor="content">Conteúdo do Depoimento *</Label>
              <Textarea
                id="content"
                {...register('content')}
                placeholder="Descreva a experiência do cliente com seu trabalho..."
                rows={6}
                className="resize-none"
              />
              {errors.content && (
                <p className="text-sm text-destructive mt-1">{errors.content.message}</p>
              )}
              <p className="text-xs text-muted-foreground mt-1">
                Máximo: 500 caracteres
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Preview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="border border-border rounded-lg p-6 bg-muted/30">
              <div className="flex items-start gap-4">
                <img
                  src={watch('avatar') || 'https://api.dicebear.com/7.x/avataaars/svg?seed=default'}
                  alt={watch('name') || 'Avatar'}
                  className="w-16 h-16 rounded-full"
                />
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    {Array.from({ length: rating || 5 }).map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <p className="text-foreground mb-4 italic">
                    "{watch('content') || 'O depoimento aparecerá aqui...'}"
                  </p>
                  <div>
                    <p className="font-semibold text-primary">
                      {watch('name') || 'Nome do Cliente'}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {watch('position') || 'Cargo'} • {watch('company') || 'Empresa'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  );
};

export default TestimonialForm;
