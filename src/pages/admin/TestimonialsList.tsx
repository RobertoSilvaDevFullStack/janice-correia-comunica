import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Search, Plus, Edit, Star } from 'lucide-react';

const TestimonialsList = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');

  const testimonials = [
    {
      id: '1',
      name: 'Carlos Eduardo Silva',
      role: 'CEO, Engelux',
      company: 'Engelux',
      rating: 5,
      status: 'active',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Carlos',
    },
    {
      id: '2',
      name: 'Ana Paula Mendes',
      role: 'Diretora de RH',
      company: 'Plano e Plano',
      rating: 5,
      status: 'active',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Ana',
    },
  ];

  const filteredTestimonials = testimonials.filter(t =>
    t.name.toLowerCase().includes(search.toLowerCase()) ||
    t.company.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-serif font-bold text-primary mb-2">Depoimentos</h1>
          <p className="text-muted-foreground">Gerencie os depoimentos de clientes</p>
        </div>
        <Button onClick={() => navigate('/admin/testimonials/new')} className="btn-gradient">
          <Plus className="mr-2 h-4 w-4" />
          Novo Depoimento
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar depoimentos..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredTestimonials.map((testimonial) => (
              <div key={testimonial.id} className="flex items-center gap-4 p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors">
                <Avatar className="h-16 w-16">
                  <AvatarImage src={testimonial.avatar} alt={testimonial.name} />
                  <AvatarFallback>{testimonial.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <h3 className="font-semibold text-primary text-lg">{testimonial.name}</h3>
                  <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                  <p className="text-sm text-accent font-medium">{testimonial.company}</p>
                  <div className="flex gap-0.5 mt-2">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-accent text-accent" />
                    ))}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline">{testimonial.status === 'active' ? 'Ativo' : 'Inativo'}</Badge>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => navigate(`/admin/testimonials/edit/${testimonial.id}`)}
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

export default TestimonialsList;
