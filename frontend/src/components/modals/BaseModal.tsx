
import { useModal } from '@/hooks/useModal';

interface ModalProps {
  children: React.ReactNode; // Accepts custom JSX content
  modalBackground?: string; // Optional className for the Modal Background
  modalClassName?: string; // Optional className for the Modal
 }



export function BaseModal({
  children,
  modalBackground = 'modal-background',
  modalClassName = 'modal-default'
}: ModalProps) {
  const { isOpen } = useModal();

  if (!isOpen) return null;

  return (
    <div className={modalBackground}>
      <div className={modalClassName}>
        {children}
      </div>
    </div>
  );
}

export function CloseButton() {
  const { closeModal } = useModal();
  return (
    <button
      className="absolute top-3 right-4 text-gray-500 hover:text-gray-700 text-xl"
      onClick={closeModal}
    >
      &times;
    </button>
  );
}

export function CancelButton() {
  const { closeModal } = useModal();
  return (
    <button
      className="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400"
      onClick={closeModal}
    >
      Cancel
    </button>
  );
}

interface ButtonProps {
  onClick: () => void;
  text?: string;
}

export function SaveButton({ 
  text = 'Save',
  onClick 
}: ButtonProps) {
  return (
    <button
      className="bg-blue-700 text-white px-4 py-2 rounded hover:bg-blue-900"
      onClick={onClick}
    >
      {text}
    </button>
  );
}

export function DeleteButton({ 
  onClick, 
  text = 'Delete' 
}: ButtonProps) {
  return (
    <button
      className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
      onClick={onClick}
    >
      {text}
    </button>
  );
}

export function ModalTitle({
  title
}: { title: string }) {
  return (
    <h2 className="text-2xl font-bold mb-4 text-center border-b pb-2 border-gray-300">
      {title}
    </h2>
  );
}