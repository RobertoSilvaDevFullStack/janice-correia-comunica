import { useLeads } from '@/hooks/useLeads';
import { StatsCard } from '@/components/admin/StatsCard';
import { Users, FileText, MessageSquare, Eye } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import React from 'react';

const Dashboard = () => {
  const { data: leads } = useLeads();
  type Stats = { leadsMonth: number; blogPosts: number; testimonials: number; views?: number };
  const [statsReal, setStatsReal] = React.useState<Stats>({leadsMonth:0, blogPosts:0, testimonials:0, views:0});
  React.useEffect(() => {
    fetch((import.meta.env.VITE_API_URL || 'http://localhost:3001/api') + '/admin/stats', {
      headers: { Authorization: `Bearer ${localStorage.getItem('authToken') || ''}` },
      credentials: 'include'
    }).then(r => r.json() as Promise<Stats>).then(setStatsReal).catch(() => {});
  }, []);

  const stats = {
    leadsMonth: leads?.filter(l => {
      const date = new Date(l.created_at);
      const now = new Date();
      return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
    }).length || 0,
    blogPosts: statsReal.blogPosts,
    testimonials: statsReal.testimonials,
    views: statsReal.views || 0,
  };

  const recentLeads = leads?.slice(0, 5) || [];

  const getInterestLabel = (interest: string) => {
    const labels: Record<string, string> = {
      palestras: 'Palestras',
      mentorias: 'Mentorias',
      treinamentos: 'Treinamentos',
      newsletter: 'Newsletter',
      outros: 'Outros',
    };
    return labels[interest] || interest;
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, any> = {
      new: { variant: 'default', label: 'Novo' },
      contacted: { variant: 'secondary', label: 'Contatado' },
      qualified: { variant: 'default', label: 'Qualificado' },
      converted: { variant: 'default', label: 'Convertido' },
      closed: { variant: 'outline', label: 'Fechado' },
    };
    const config = variants[status] || variants.new;
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-serif font-bold text-primary mb-2">Dashboard</h1>
        <p className="text-muted-foreground">Visão geral do seu negócio</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Leads (30 dias)"
          value={stats.leadsMonth}
          icon={Users}
          trend={{ value: '12% vs mês anterior', positive: true }}
        />
        <StatsCard
          title="Posts no Blog"
          value={stats.blogPosts}
          icon={FileText}
        />
        <StatsCard
          title="Depoimentos"
          value={stats.testimonials}
          icon={MessageSquare}
        />
        <StatsCard
          title="Visualizações"
          value={stats.views}
          icon={Eye}
          trend={{ value: '8% vs semana anterior', positive: true }}
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="font-serif">Leads Recentes</CardTitle>
          <CardDescription>Últimos contatos recebidos</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentLeads.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">Nenhum lead ainda</p>
            ) : (
              recentLeads.map((lead) => (
                <div key={lead.id} className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors">
                  <div className="flex-1">
                    <p className="font-semibold text-primary">{lead.name}</p>
                    <p className="text-sm text-muted-foreground">{lead.email}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {getInterestLabel(lead.interest)}
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <p className="text-xs text-muted-foreground">
                      {format(new Date(lead.created_at), "dd 'de' MMM", { locale: ptBR })}
                    </p>
                    {getStatusBadge(lead.status)}
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
