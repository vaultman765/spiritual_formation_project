import { createContext, useState, ReactNode } from "react";

type ModalState = Record<string, boolean>;

export const ModalContext = createContext<
  | {
      isOpen: (modalId: string) => boolean;
      openModal: (modalId: string) => void;
      closeModal: (modalId: string) => void;
    }
  | undefined
>(undefined);

export function ModalProvider({ children }: { children: ReactNode }) {
  const [modals, setModals] = useState<ModalState>({});

  const isOpen = (modalId: string) => !!modals[modalId];
  const openModal = (modalId: string) =>
    setModals((prev) => ({ ...prev, [modalId]: true }));
  const closeModal = (modalId: string) =>
    setModals((prev) => ({ ...prev, [modalId]: false }));

  return (
    <ModalContext.Provider value={{ isOpen, openModal, closeModal }}>
      {children}
    </ModalContext.Provider>
  );
}
