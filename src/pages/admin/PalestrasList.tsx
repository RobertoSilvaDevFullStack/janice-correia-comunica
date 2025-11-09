import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Search, Plus, Edit } from 'lucide-react';

const PalestrasList = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');

  const palestras = [
    {
      id: '1',
      title: 'Comunicação Assertiva no Ambiente Corporativo',
      category: 'Comunicação',
      duration: '60-90 min',
      status: 'active',
    },
    {
      id: '2',
      title: 'Oratória para Líderes',
      category: 'Liderança',
      duration: '90-120 min',
      status: 'active',
    },
    {
      id: '3',
      title: 'Experiência do Cliente através da Comunicação',
      category: 'Atendimento',
      duration: '60 min',
      status: 'active',
    },
  ];

  const filteredPalestras = palestras.filter(p =>
    p.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-serif font-bold text-primary mb-2">Palestras</h1>
          <p className="text-muted-foreground">Gerencie as palestras disponíveis</p>
        </div>
        <Button onClick={() => navigate('/admin/palestras/new')} className="btn-gradient">
          <Plus className="mr-2 h-4 w-4" />
          Nova Palestra
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar palestras..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredPalestras.map((palestra) => (
              <div key={palestra.id} className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors">
                <div className="flex-1">
                  <h3 className="font-semibold text-primary text-lg mb-2">{palestra.title}</h3>
                  <div className="flex items-center gap-3">
                    <Badge variant="outline">{palestra.category}</Badge>
                    <span className="text-sm text-muted-foreground">{palestra.duration}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge>{palestra.status === 'active' ? 'Ativa' : 'Inativa'}</Badge>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => navigate(`/admin/palestras/edit/${palestra.id}`)}
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

export default PalestrasList;
