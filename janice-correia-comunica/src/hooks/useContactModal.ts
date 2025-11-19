import { useContext } from 'react';
import { ContactModalContext } from '@/contexts/ContactModalContext';

export const useContactModal = () => {
  const context = useContext(ContactModalContext);
  
  if (!context) {
    throw new Error('useContactModal deve ser usado dentro de ContactModalProvider');
  }
  
  return context;
};
