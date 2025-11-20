import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';

interface Testimonial {
  id: string;
  name: string;
  position: string;
  company: string;
  content: string;
  avatar?: string;
  rating?: number;
  display_order: number;
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
  updated_at: string;
}

export const useTestimonials = (status?: 'approved' | 'pending' | 'rejected' | 'all') => {
  return useQuery({
    queryKey: ['testimonials', status],
    queryFn: async () => {
      const params = status && status !== 'all' ? { status } : status === 'all' ? { status: 'all' } : undefined;
      const { data } = await api.get<Testimonial[]>('/testimonials', { params });
      return data;
    },
  });
};

export const useTestimonial = (id: string) => {
  return useQuery({
    queryKey: ['testimonial', id],
    queryFn: async () => {
      const { data } = await api.get<Testimonial>(`/testimonials/${id}`);
      return data;
    },
    enabled: !!id,
  });
};

export const useCreateTestimonial = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (testimonialData: Partial<Testimonial>) => {
      const { data } = await api.post<Testimonial>('/testimonials', testimonialData);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['testimonials'] });
    },
  });
};

export const useUpdateTestimonial = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...testimonialData }: Partial<Testimonial> & { id: string }) => {
      const { data } = await api.put<Testimonial>(`/testimonials/${id}`, testimonialData);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['testimonials'] });
    },
  });
};

export const useDeleteTestimonial = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { data } = await api.delete(`/testimonials/${id}`);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['testimonials'] });
    },
  });
};
