import { createContext, useState, ReactNode } from "react";

export const ModalContext = createContext<
  | {
      isOpen: boolean;
      openModal: () => void;
      closeModal: () => void;
      toggleModal: () => void;
    }
  | undefined
>(undefined);

export function ModalProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);

  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);
  const toggleModal = () => setIsOpen((prev) => !prev);

  return (
    <ModalContext.Provider
      value={{ isOpen, openModal, closeModal, toggleModal }}
    >
      {children}
    </ModalContext.Provider>
  );
}
