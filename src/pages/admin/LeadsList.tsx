import { useState } from 'react';
import { useLeads, useUpdateLeadStatus } from '@/hooks/useLeads';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Search, Eye, Download } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { toast } from 'sonner';

const LeadsList = () => {
  const { data: leads, isLoading } = useLeads();
  const updateStatus = useUpdateLeadStatus();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedLead, setSelectedLead] = useState<any>(null);

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

  const handleStatusChange = async (leadId: string, newStatus: string) => {
    try {
      await updateStatus.mutateAsync({ id: leadId, status: newStatus as any });
      toast.success('Status atualizado com sucesso!');
    } catch (error) {
      toast.error('Erro ao atualizar status');
    }
  };

  const handleExportCSV = () => {
    if (!leads || leads.length === 0) {
      toast.error('Nenhum lead para exportar');
      return;
    }

    const csvContent = [
      ['Nome', 'Email', 'Telefone', 'Interesse', 'Status', 'Data'].join(','),
      ...leads.map(lead => [
        lead.name,
        lead.email,
        lead.phone || '',
        getInterestLabel(lead.interest),
        lead.status,
        format(new Date(lead.created_at), 'dd/MM/yyyy HH:mm')
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `leads-${format(new Date(), 'yyyy-MM-dd')}.csv`;
    link.click();
    toast.success('CSV exportado com sucesso!');
  };

  const filteredLeads = leads?.filter(lead => {
    const matchesSearch = lead.name.toLowerCase().includes(search.toLowerCase()) ||
                         lead.email.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'all' || lead.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  if (isLoading) {
    return <div className="text-center py-8">Carregando...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-serif font-bold text-primary mb-2">Leads</h1>
          <p className="text-muted-foreground">Gerencie seus contatos</p>
        </div>
        <Button onClick={handleExportCSV} variant="outline">
          <Download className="mr-2 h-4 w-4" />
          Exportar CSV
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por nome ou email..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-[200px]">
                <SelectValue placeholder="Filtrar por status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="new">Novos</SelectItem>
                <SelectItem value="contacted">Contatados</SelectItem>
                <SelectItem value="qualified">Qualificados</SelectItem>
                <SelectItem value="converted">Convertidos</SelectItem>
                <SelectItem value="closed">Fechados</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {!filteredLeads || filteredLeads.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">Nenhum lead encontrado</p>
            ) : (
              filteredLeads.map((lead) => (
                <div key={lead.id} className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors">
                  <div className="flex-1">
                    <p className="font-semibold text-primary">{lead.name}</p>
                    <p className="text-sm text-muted-foreground">{lead.email}</p>
                    {lead.phone && (
                      <p className="text-sm text-muted-foreground">{lead.phone}</p>
                    )}
                    <div className="flex items-center gap-2 mt-2">
                      <Badge variant="outline" className="text-xs">
                        {getInterestLabel(lead.interest)}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        {format(new Date(lead.created_at), "dd 'de' MMM 'às' HH:mm", { locale: ptBR })}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Select
                      value={lead.status}
                      onValueChange={(value) => handleStatusChange(lead.id, value)}
                    >
                      <SelectTrigger className="w-[140px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="new">Novo</SelectItem>
                        <SelectItem value="contacted">Contatado</SelectItem>
                        <SelectItem value="qualified">Qualificado</SelectItem>
                        <SelectItem value="converted">Convertido</SelectItem>
                        <SelectItem value="closed">Fechado</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setSelectedLead(lead)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      <Dialog open={!!selectedLead} onOpenChange={() => setSelectedLead(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="font-serif">Detalhes do Lead</DialogTitle>
            <DialogDescription>Informações completas do contato</DialogDescription>
          </DialogHeader>
          {selectedLead && (
            <div className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground">Nome</p>
                <p className="font-semibold">{selectedLead.name}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Email</p>
                <p className="font-semibold">{selectedLead.email}</p>
              </div>
              {selectedLead.phone && (
                <div>
                  <p className="text-sm text-muted-foreground">Telefone</p>
                  <p className="font-semibold">{selectedLead.phone}</p>
                </div>
              )}
              <div>
                <p className="text-sm text-muted-foreground">Interesse</p>
                <p className="font-semibold">{getInterestLabel(selectedLead.interest)}</p>
              </div>
              {selectedLead.message && (
                <div>
                  <p className="text-sm text-muted-foreground">Mensagem</p>
                  <p className="font-semibold whitespace-pre-wrap">{selectedLead.message}</p>
                </div>
              )}
              <div>
                <p className="text-sm text-muted-foreground">Status</p>
                {getStatusBadge(selectedLead.status)}
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Data do Contato</p>
                <p className="font-semibold">
                  {format(new Date(selectedLead.created_at), "dd 'de' MMMM 'de' yyyy 'às' HH:mm", { locale: ptBR })}
                </p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default LeadsList;
