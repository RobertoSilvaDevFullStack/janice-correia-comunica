import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';

interface Lead {
  id: string;
  name: string;
  email: string;
  phone?: string;
  interest: 'palestras' | 'mentorias' | 'treinamentos' | 'newsletter' | 'outros';
  message?: string;
  status: 'new' | 'contacted' | 'qualified' | 'converted' | 'closed';
  created_at: string;
  updated_at: string;
}

export const useLeads = (status?: string) => {
  return useQuery({
    queryKey: ['leads', status],
    queryFn: async () => {
      const { data } = await api.get<Lead[]>('/leads', {
        params: status ? { status } : {},
      });
      return data;
    },
  });
};

export const useCreateLead = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (leadData: Partial<Lead>) => {
      const { data } = await api.post<{ message: string; lead: Lead }>('/leads', leadData);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['leads'] });
    },
  });
};

export const useUpdateLeadStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, status }: { id: string; status: Lead['status'] }) => {
      const { data } = await api.patch<Lead>(`/leads/${id}/status`, { status });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['leads'] });
    },
  });
};
