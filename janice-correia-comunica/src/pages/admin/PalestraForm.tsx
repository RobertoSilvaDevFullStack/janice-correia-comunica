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
import { Badge } from '@/components/ui/badge';
import { usePalestra, useCreatePalestra, useUpdatePalestra } from '@/hooks/usePalestras';
import { toast } from 'sonner';
import { ArrowLeft, Save, X, Plus } from 'lucide-react';
import { ImageUploader } from '@/components/admin/ImageUploader';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const palestraSchema = z.object({
  title: z.string().min(5, 'Título deve ter no mínimo 5 caracteres').max(200),
  description: z.string().min(20, 'Descrição deve ter no mínimo 20 caracteres').max(1000),
  duration: z.number().min(15, 'Duração mínima de 15 minutos').max(480, 'Duração máxima de 8 horas'),
  target_audience: z.string().min(5, 'Público-alvo deve ter no mínimo 5 caracteres').max(200),
  image: z.string().url('URL da imagem inválida'),
  status: z.enum(['active', 'inactive']),
});

type PalestraFormData = z.infer<typeof palestraSchema>;

const PalestraForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = !!id;

  const [topics, setTopics] = useState<string[]>([]);
  const [topicInput, setTopicInput] = useState('');

  const { data: existingPalestra } = usePalestra(id || '');
  const createMutation = useCreatePalestra();
  const updateMutation = useUpdatePalestra();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<PalestraFormData>({
    resolver: zodResolver(palestraSchema),
    defaultValues: {
      status: 'active',
      duration: 60,
    },
  });

  useEffect(() => {
    if (existingPalestra) {
      setValue('title', existingPalestra.title);
      setValue('description', existingPalestra.description);
      setValue('duration', existingPalestra.duration);
      setValue('target_audience', existingPalestra.target_audience);
      setValue('image', existingPalestra.image);
      setValue('status', existingPalestra.status);
      setTopics(existingPalestra.topics || []);
    }
  }, [existingPalestra, setValue]);

  const addTopic = () => {
    if (topicInput.trim() && !topics.includes(topicInput.trim())) {
      setTopics([...topics, topicInput.trim()]);
      setTopicInput('');
    }
  };

  const removeTopic = (topic: string) => {
    setTopics(topics.filter(t => t !== topic));
  };

  const onSubmit = async (data: PalestraFormData) => {
    try {
      const palestraData = {
        ...data,
        topics,
      };

      if (isEditing && existingPalestra) {
        await updateMutation.mutateAsync({ id: existingPalestra.id, ...palestraData });
        toast.success('Palestra atualizada com sucesso!');
      } else {
        await createMutation.mutateAsync(palestraData);
        toast.success('Palestra criada com sucesso!');
      }
      navigate('/admin/palestras');
    } catch (error) {
      toast.error('Erro ao salvar palestra');
    }
  };

  const formData = watch();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate('/admin/palestras')}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-serif font-bold text-primary">
              {isEditing ? 'Editar Palestra' : 'Nova Palestra'}
            </h1>
            <p className="text-muted-foreground">
              {isEditing ? 'Atualize as informações da palestra' : 'Adicione uma nova palestra'}
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
            <CardTitle>Informações Básicas</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="title">Título da Palestra *</Label>
              <Input
                id="title"
                {...register('title')}
                placeholder="Ex: Inteligência Emocional na Liderança"
              />
              {errors.title && (
                <p className="text-sm text-destructive mt-1">{errors.title.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="description">Descrição *</Label>
              <Textarea
                id="description"
                {...register('description')}
                placeholder="Descreva o conteúdo e objetivos da palestra..."
                rows={5}
              />
              {errors.description && (
                <p className="text-sm text-destructive mt-1">{errors.description.message}</p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="duration">Duração (minutos) *</Label>
                <Input
                  id="duration"
                  type="number"
                  {...register('duration', { valueAsNumber: true })}
                  placeholder="60"
                  min={15}
                  max={480}
                />
                {errors.duration && (
                  <p className="text-sm text-destructive mt-1">{errors.duration.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="status">Status *</Label>
                <Select
                  value={formData.status}
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
            </div>

            <div>
              <Label htmlFor="target_audience">Público-Alvo *</Label>
              <Input
                id="target_audience"
                {...register('target_audience')}
                placeholder="Ex: Líderes, Gestores, Profissionais de RH"
              />
              {errors.target_audience && (
                <p className="text-sm text-destructive mt-1">{errors.target_audience.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="image">Imagem de Capa *</Label>
              <div className="mt-2">
                <ImageUploader
                  value={formData.image}
                  onChange={(url) => setValue('image', url, { shouldValidate: true })}
                  label="Imagem de capa"
                />
              </div>
              {errors.image && (
                <p className="text-sm text-destructive mt-2">{errors.image.message}</p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Tópicos Abordados</CardTitle>
          </CardHeader>
          <CardContent>
            <div>
              <Label htmlFor="topics">Adicionar Tópico</Label>
              <div className="flex gap-2">
                <Input
                  id="topics"
                  value={topicInput}
                  onChange={(e) => setTopicInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTopic())}
                  placeholder="Ex: Gestão de conflitos"
                />
                <Button type="button" onClick={addTopic}>
                  <Plus className="mr-2 h-4 w-4" />
                  Adicionar
                </Button>
              </div>
              <div className="flex flex-wrap gap-2 mt-4">
                {topics.map((topic) => (
                  <Badge key={topic} variant="secondary" className="gap-1 text-sm py-1">
                    {topic}
                    <X
                      className="h-3 w-3 cursor-pointer"
                      onClick={() => removeTopic(topic)}
                    />
                  </Badge>
                ))}
              </div>
              {topics.length === 0 && (
                <p className="text-sm text-muted-foreground mt-2">
                  Nenhum tópico adicionado ainda
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Preview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="border border-border rounded-lg overflow-hidden">
              {formData.image && (
                <img
                  src={(formData.image || '').replace(/^http:\/\//, 'https://')}
                  alt={formData.title || 'Preview'}
                  className="w-full h-48 object-cover"
                  onError={(e) => {
                    e.currentTarget.src = 'https://images.unsplash.com/photo-1540575467063-178a50c2df87';
                  }}
                />
              )}
              <div className="p-6">
                <div className="flex items-center gap-2 mb-2 text-sm text-muted-foreground">
                  <span>{formData.duration || 60} minutos</span>
                  <span>•</span>
                  <span>{formData.target_audience || 'Público-alvo'}</span>
                </div>
                <h3 className="text-2xl font-serif font-bold text-primary mb-3">
                  {formData.title || 'Título da Palestra'}
                </h3>
                <p className="text-foreground mb-4">
                  {formData.description || 'A descrição da palestra aparecerá aqui...'}
                </p>
                {topics.length > 0 && (
                  <div>
                    <h4 className="font-semibold mb-2">Tópicos Abordados:</h4>
                    <div className="flex flex-wrap gap-2">
                      {topics.map((topic) => (
                        <Badge key={topic} variant="outline">
                          {topic}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  );
};

export default PalestraForm;
