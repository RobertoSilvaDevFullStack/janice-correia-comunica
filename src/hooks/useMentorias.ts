import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';

interface Mentoria {
  id: string;
  title: string;
  description: string;
  duration: string;
  format: 'individual' | 'group' | 'both';
  investment: string;
  benefits: string[];
  status: 'active' | 'inactive';
  created_at: string;
  updated_at: string;
}

export const useMentorias = () => {
  return useQuery({
    queryKey: ['mentorias'],
    queryFn: async () => {
      const { data } = await api.get<Mentoria[]>('/mentorias');
      return data;
    },
  });
};

export const useMentoria = (id: string) => {
  return useQuery({
    queryKey: ['mentoria', id],
    queryFn: async () => {
      const { data } = await api.get<Mentoria>(`/mentorias/${id}`);
      return data;
    },
    enabled: !!id,
  });
};

export const useCreateMentoria = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (mentoriaData: Partial<Mentoria>) => {
      const { data } = await api.post<Mentoria>('/mentorias', mentoriaData);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['mentorias'] });
    },
  });
};

export const useUpdateMentoria = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...mentoriaData }: Partial<Mentoria> & { id: string }) => {
      const { data } = await api.put<Mentoria>(`/mentorias/${id}`, mentoriaData);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['mentorias'] });
    },
  });
};

export const useDeleteMentoria = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { data } = await api.delete(`/mentorias/${id}`);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['mentorias'] });
    },
  });
};
