interface EditNoteContentProps {
  content: string;
  placeholder: string;
  onChange: (value: string) => void;
}

export default function EditNoteContent({
  content,
  placeholder,
  onChange,
}: EditNoteContentProps) {
  return (
    <textarea
      className="w-full h-64 p-4 bg-transparent border border-gray-400 rounded-lg resize-none font-serif text-[1rem] leading-relaxed focus:outline-none focus:ring-2 focus:ring-purple-400"
      placeholder={placeholder}
      value={content}
      onChange={(e) => onChange(e.target.value)}
    />
  );
}
