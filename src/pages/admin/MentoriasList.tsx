import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Search, Plus, Edit } from 'lucide-react';

const MentoriasList = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');

  const mentorias = [
    {
      id: '1',
      title: 'Mentoria Individual em Oratória',
      duration: '3 meses',
      format: 'Online/Presencial',
      status: 'active',
    },
    {
      id: '2',
      title: 'Treinamento Corporativo em Comunicação',
      duration: 'Customizável',
      format: 'In-company',
      status: 'active',
    },
    {
      id: '3',
      title: 'Preparação para Apresentações Importantes',
      duration: '1-4 semanas',
      format: 'Intensivo',
      status: 'active',
    },
  ];

  const filteredMentorias = mentorias.filter(m =>
    m.title.toLowerCase().includes(search.toLowerCase())
  );

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
          <div className="space-y-4">
            {filteredMentorias.map((mentoria) => (
              <div key={mentoria.id} className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors">
                <div className="flex-1">
                  <h3 className="font-semibold text-primary text-lg mb-2">{mentoria.title}</h3>
                  <div className="flex items-center gap-3 text-sm text-muted-foreground">
                    <span>Duração: {mentoria.duration}</span>
                    <span>•</span>
                    <span>Formato: {mentoria.format}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge>{mentoria.status === 'active' ? 'Ativa' : 'Inativa'}</Badge>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => navigate(`/admin/mentorias/edit/${mentoria.id}`)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MentoriasList;
