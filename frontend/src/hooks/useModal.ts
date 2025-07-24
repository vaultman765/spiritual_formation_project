import { useContext } from "react";
import { ModalContext } from "@/context/modalContext";

export function useModal(modalId: string) {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error("useModal must be used within a ModalProvider");
  }
  const { isOpen, openModal, closeModal } = context;
  return {
    isOpen: isOpen(modalId),
    openModal: () => openModal(modalId),
    closeModal: () => closeModal(modalId),
  };
}