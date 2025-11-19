import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';

interface Palestra {
  id: string;
  title: string;
  description: string;
  duration: number;
  target_audience: string;
  image: string;
  topics: string[];
  status: 'active' | 'inactive';
  created_at: string;
  updated_at: string;
}

export const usePalestras = () => {
  return useQuery({
    queryKey: ['palestras'],
    queryFn: async () => {
      const { data } = await api.get<Palestra[]>('/palestras');
      return data;
    },
  });
};

export const usePalestra = (id: string) => {
  return useQuery({
    queryKey: ['palestra', id],
    queryFn: async () => {
      const { data } = await api.get<Palestra>(`/palestras/${id}`);
      return data;
    },
    enabled: !!id,
  });
};

export const useCreatePalestra = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (palestraData: Partial<Palestra>) => {
      const { data } = await api.post<Palestra>('/palestras', palestraData);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['palestras'] });
    },
  });
};

export const useUpdatePalestra = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...palestraData }: Partial<Palestra> & { id: string }) => {
      const { data } = await api.put<Palestra>(`/palestras/${id}`, palestraData);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['palestras'] });
    },
  });
};

export const useDeletePalestra = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { data } = await api.delete(`/palestras/${id}`);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['palestras'] });
    },
  });
};
