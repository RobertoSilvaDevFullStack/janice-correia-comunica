import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMentorias, useDeleteMentoria } from '@/hooks/useMentorias';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Search, Plus, Edit, Trash2, Loader2 } from 'lucide-react';

const MentoriasList = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [search, setSearch] = useState('');
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const { data: mentorias, isLoading, error } = useMentorias();
  const deleteMutation = useDeleteMentoria();

  const filteredMentorias = mentorias?.filter(m =>
    m.title.toLowerCase().includes(search.toLowerCase()) ||
    m.format.toLowerCase().includes(search.toLowerCase())
  ) || [];

  const formatLabels: Record<string, string> = {
    individual: 'Individual',
    group: 'Grupo',
    both: 'Individual e Grupo',
  };

  const handleDelete = async () => {
    if (!deleteId) return;

    try {
      await deleteMutation.mutateAsync(deleteId);
      toast({
        title: 'Sucesso!',
        description: 'Mentoria deletada com sucesso.',
      });
      setDeleteId(null);
    } catch (error) {
      toast({
        title: 'Erro',
        description: 'Não foi possível deletar a mentoria.',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-serif font-bold text-primary mb-2">Mentorias</h1>
          <p className="text-muted-foreground">Gerencie os programas de mentoria</p>
        </div>
        <Button onClick={() => navigate('/admin/mentorias/new')} className="btn-gradient">
          <Plus className="mr-2 h-4 w-4" />
          Nova Mentoria
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar mentorias..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : error ? (
            <div className="text-center py-8">
              <p className="text-destructive">Erro ao carregar mentorias</p>
              <p className="text-sm text-muted-foreground mt-2">
                {error instanceof Error ? error.message : 'Tente novamente mais tarde'}
              </p>
            </div>
          ) : filteredMentorias.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">Nenhuma mentoria encontrada</p>
          ) : (
            <div className="space-y-4">
              {filteredMentorias.map((mentoria) => (
                <div key={mentoria.id} className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors">
                  <div className="flex-1">
                    <h3 className="font-semibold text-primary text-lg mb-2">{mentoria.title}</h3>
                    <div className="flex items-center gap-3 text-sm text-muted-foreground">
                      <span>Duração: {mentoria.duration}</span>
                      <span>•</span>
                      <span>Formato: {formatLabels[mentoria.format] || mentoria.format}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={mentoria.status === 'active' ? 'default' : 'secondary'}>
                      {mentoria.status === 'active' ? 'Ativa' : 'Inativa'}
                    </Badge>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => navigate(`/admin/mentorias/edit/${mentoria.id}`)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setDeleteId(mentoria.id)}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja deletar esta mentoria? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} disabled={deleteMutation.isPending}>
              {deleteMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deletando...
                </>
              ) : (
                'Deletar'
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default MentoriasList;
