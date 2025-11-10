import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, Plus, X, Eye } from 'lucide-react';
import { useMentoria, useCreateMentoria, useUpdateMentoria } from '@/hooks/useMentorias';

const mentoriaSchema = z.object({
  title: z.string().min(5, 'Título deve ter no mínimo 5 caracteres').max(100, 'Título muito longo'),
  description: z.string().min(50, 'Descrição deve ter no mínimo 50 caracteres'),
  duration: z.string().min(3, 'Duração é obrigatória'),
  format: z.enum(['individual', 'group', 'both'], {
    errorMap: () => ({ message: 'Formato inválido' })
  }),
  investment: z.string().min(3, 'Investimento é obrigatório'),
  benefits: z.array(z.string().min(5, 'Benefício muito curto')).min(1, 'Adicione pelo menos um benefício'),
  status: z.enum(['active', 'inactive']),
});

type MentoriaFormData = z.infer<typeof mentoriaSchema>;

const MentoriaForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [showPreview, setShowPreview] = useState(false);
  const [newBenefit, setNewBenefit] = useState('');

  const { data: mentoria, isLoading } = useMentoria(id || '');
  const createMentoria = useCreateMentoria();
  const updateMentoria = useUpdateMentoria();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<MentoriaFormData>({
    resolver: zodResolver(mentoriaSchema),
    defaultValues: {
      title: '',
      description: '',
      duration: '',
      format: 'individual',
      investment: '',
      benefits: [],
      status: 'active',
    },
  });

  const benefits = watch('benefits') || [];
  const watchedData = watch();

  useEffect(() => {
    if (mentoria) {
      setValue('title', mentoria.title);
      setValue('description', mentoria.description);
      setValue('duration', mentoria.duration);
      setValue('format', mentoria.format);
      setValue('investment', mentoria.investment);
      setValue('benefits', mentoria.benefits);
      setValue('status', mentoria.status);
    }
  }, [mentoria, setValue]);

  const addBenefit = () => {
    if (newBenefit.trim()) {
      setValue('benefits', [...benefits, newBenefit.trim()]);
      setNewBenefit('');
    }
  };

  const removeBenefit = (index: number) => {
    setValue('benefits', benefits.filter((_, i) => i !== index));
  };

  const onSubmit = async (data: MentoriaFormData) => {
    try {
      if (id) {
        await updateMentoria.mutateAsync({ ...data, id });
        toast({
          title: 'Sucesso!',
          description: 'Mentoria atualizada com sucesso.',
        });
      } else {
        await createMentoria.mutateAsync(data);
        toast({
          title: 'Sucesso!',
          description: 'Mentoria criada com sucesso.',
        });
      }
      navigate('/admin/mentorias');
    } catch (error) {
      toast({
        title: 'Erro',
        description: 'Ocorreu um erro ao salvar a mentoria.',
        variant: 'destructive',
      });
    }
  };

  if (isLoading && id) {
    return <div>Carregando...</div>;
  }

  const formatLabels: Record<string, string> = {
    individual: 'Individual',
    group: 'Grupo',
    both: 'Individual e Grupo',
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate('/admin/mentorias')}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-serif font-bold text-primary mb-2">
              {id ? 'Editar Mentoria' : 'Nova Mentoria'}
            </h1>
            <p className="text-muted-foreground">
              {id ? 'Atualize as informações da mentoria' : 'Preencha os dados da nova mentoria'}
            </p>
          </div>
        </div>
        <Button
          variant="outline"
          onClick={() => setShowPreview(!showPreview)}
        >
          <Eye className="mr-2 h-4 w-4" />
          {showPreview ? 'Ocultar' : 'Visualizar'} Preview
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Informações da Mentoria</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="title">Título *</Label>
                <Input
                  id="title"
                  {...register('title')}
                  placeholder="Ex: Mentoria Individual em Oratória"
                />
                {errors.title && (
                  <p className="text-sm text-destructive">{errors.title.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Descrição *</Label>
                <Textarea
                  id="description"
                  {...register('description')}
                  placeholder="Descreva a mentoria em detalhes..."
                  rows={6}
                />
                {errors.description && (
                  <p className="text-sm text-destructive">{errors.description.message}</p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="duration">Duração *</Label>
                  <Input
                    id="duration"
                    {...register('duration')}
                    placeholder="Ex: 3 meses"
                  />
                  {errors.duration && (
                    <p className="text-sm text-destructive">{errors.duration.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="format">Formato *</Label>
                  <Select
                    value={watch('format')}
                    onValueChange={(value) => setValue('format', value as 'individual' | 'group' | 'both')}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="individual">Individual</SelectItem>
                      <SelectItem value="group">Grupo</SelectItem>
                      <SelectItem value="both">Individual e Grupo</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.format && (
                    <p className="text-sm text-destructive">{errors.format.message}</p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="investment">Investimento *</Label>
                <Input
                  id="investment"
                  {...register('investment')}
                  placeholder="Ex: A partir de R$ 5.000"
                />
                {errors.investment && (
                  <p className="text-sm text-destructive">{errors.investment.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label>Benefícios *</Label>
                <div className="flex gap-2">
                  <Input
                    value={newBenefit}
                    onChange={(e) => setNewBenefit(e.target.value)}
                    placeholder="Adicione um benefício"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        addBenefit();
                      }
                    }}
                  />
                  <Button type="button" onClick={addBenefit} size="icon">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                {benefits.length > 0 && (
                  <div className="space-y-2 mt-3">
                    {benefits.map((benefit, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-2 p-2 bg-muted rounded-md"
                      >
                        <span className="flex-1 text-sm">{benefit}</span>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => removeBenefit(index)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
                {errors.benefits && (
                  <p className="text-sm text-destructive">{errors.benefits.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="status">Status *</Label>
                <Select
                  value={watch('status')}
                  onValueChange={(value) => setValue('status', value as 'active' | 'inactive')}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Ativa</SelectItem>
                    <SelectItem value="inactive">Inativa</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex gap-3 pt-4">
                <Button
                  type="submit"
                  className="btn-gradient"
                  disabled={createMentoria.isPending || updateMentoria.isPending}
                >
                  {createMentoria.isPending || updateMentoria.isPending
                    ? 'Salvando...'
                    : id
                    ? 'Atualizar Mentoria'
                    : 'Criar Mentoria'}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate('/admin/mentorias')}
                >
                  Cancelar
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {showPreview && (
          <Card>
            <CardHeader>
              <CardTitle>Preview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h3 className="text-2xl font-serif font-bold text-primary mb-2">
                    {watchedData.title || 'Título da mentoria'}
                  </h3>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
                    <span>{watchedData.duration || 'Duração'}</span>
                    <span>•</span>
                    <span>{formatLabels[watchedData.format] || 'Formato'}</span>
                  </div>
                </div>

                <div className="prose prose-sm max-w-none">
                  <p className="text-foreground whitespace-pre-wrap">
                    {watchedData.description || 'Descrição da mentoria...'}
                  </p>
                </div>

                <div className="pt-4 border-t border-border">
                  <p className="text-lg font-semibold text-primary mb-3">
                    {watchedData.investment || 'Investimento'}
                  </p>
                </div>

                {watchedData.benefits && watchedData.benefits.length > 0 && (
                  <div className="pt-4 border-t border-border">
                    <h4 className="font-semibold text-primary mb-3">Benefícios:</h4>
                    <ul className="space-y-2">
                      {watchedData.benefits.map((benefit, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <span className="text-primary mt-1">✓</span>
                          <span className="text-sm">{benefit}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default MentoriaForm;
