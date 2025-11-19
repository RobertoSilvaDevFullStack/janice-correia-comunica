import React, { createContext, useState, useCallback } from 'react';

type Interest = 'palestras' | 'mentorias' | 'treinamentos' | 'newsletter' | 'outros';

interface ContactModalContextType {
  isOpen: boolean;
  defaultInterest?: Interest;
  openModal: (interest?: Interest) => void;
  closeModal: () => void;
}

export const ContactModalContext = createContext<ContactModalContextType | undefined>(undefined);

export const ContactModalProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [defaultInterest, setDefaultInterest] = useState<Interest | undefined>();

  const openModal = useCallback((interest?: Interest) => {
    setDefaultInterest(interest);
    setIsOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setIsOpen(false);
    setTimeout(() => setDefaultInterest(undefined), 300); // Clear after animation
  }, []);

  return (
    <ContactModalContext.Provider value={{ isOpen, defaultInterest, openModal, closeModal }}>
      {children}
    </ContactModalContext.Provider>
  );
};
