import { useModal } from "@/hooks/useModal";
import { useEffect } from "react";

interface ModalProps {
  modalId: string;
  children: React.ReactNode;
  modalBackground?: string;
  modalClassName?: string;
  onClose?: () => void;
}

interface ModalButtonProps {
  text: string;
  onClick: () => void;
  variant?: "primary" | "secondary" | "danger";
}

interface ButtonProps {
  onClick: () => void;
  text?: string;
  modalId?: string;
}

export function BaseModal({
  modalId,
  children,
  modalBackground = "modal-background",
  modalClassName = "modal-default",
  onClose,
}: Readonly<ModalProps>) {
  const { isOpen, closeModal } = useModal(modalId);

  // Handle modal close logic
  const handleClose = () => {
    if (onClose) onClose();
    closeModal();
  };

  // Close modal on Escape key press
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        handleClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
    }

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className={modalBackground}>
      <div className={modalClassName} onClick={(e) => e.stopPropagation()}>
        {children}
      </div>
    </div>
  );
}

export function ModalRenderer({
  modals,
}: Readonly<{
  modals: { id: string; content: React.ReactNode }[];
}>) {
  return (
    <>
      {modals.map(({ id, content }) => (
        <BaseModal key={id} modalId={id}>
          {content}
        </BaseModal>
      ))}
    </>
  );
}

export function ModalButton({ text, onClick, variant = "primary" }: Readonly<ModalButtonProps>) {
  const baseClass = "px-4 py-2 rounded font-semibold transition";
  const variantClass = {
    primary: "bg-blue-700 text-white hover:bg-blue-900",
    secondary: "bg-gray-300 text-gray-800 hover:bg-gray-400",
    danger: "bg-red-600 text-white hover:bg-red-700",
  };

  return (
    <button className={`${baseClass} ${variantClass[variant]}`} onClick={onClick}>
      {text}
    </button>
  );
}

export function CloseButton({ modalId }: Readonly<{ modalId: string }>) {
  const { closeModal } = useModal(modalId);
  return (
    <button className="absolute top-3 right-4 text-gray-500 hover:text-gray-700 text-xl" onClick={closeModal}>
      &times;
    </button>
  );
}

function useModalAction(onClick: () => void | Promise<void>, closeModal: () => void, modalId?: string) {
  return async () => {
    const result = onClick();
    if (result instanceof Promise) {
      await result;
    }
    if (modalId) closeModal();
  };
}

export function SaveButton({ text = "Save", onClick, modalId }: Readonly<ButtonProps>) {
  const { closeModal } = useModal(modalId || "");
  const handleClick = useModalAction(onClick, closeModal, modalId);
  return <ModalButton text={text} onClick={handleClick} variant="primary" />;
}

export function DeleteButton({ text = "Delete", onClick, modalId }: Readonly<ButtonProps>) {
  const { closeModal } = useModal(modalId || "");
  const handleClick = useModalAction(onClick, closeModal, modalId);
  return <ModalButton text={text} onClick={handleClick} variant="danger" />;
}

export function EditButton({ text = "Edit", onClick, modalId }: Readonly<ButtonProps>) {
  const { closeModal } = useModal(modalId || "");
  const handleClick = useModalAction(onClick, closeModal, modalId);
  return <ModalButton text={text} onClick={handleClick} variant="secondary" />;
}

export function CancelButton({
  text = "Cancel",
  onClick = () => {}, // Default to an empty function if no onClick is provided
  modalId,
}: Readonly<ButtonProps>) {
  const { closeModal } = useModal(modalId || ""); // Use modalId if provided
  const handleClick = () => {
    onClick(); // Call the provided onClick function
    if (modalId) closeModal(); // Close the modal if modalId is provided
  };
  return <ModalButton text={text} onClick={handleClick} variant="secondary" />;
}

export function ModalTitle({ title }: Readonly<{ title: string }>) {
  return <h2 className="text-2xl font-bold mb-4 text-center border-b pb-2 border-gray-300">{title}</h2>;
}
