import { useState } from 'react';
import type { ReactNode } from 'react';

export default function TooltipWrapper({
  content,
  children,
}: {
  content: ReactNode;
  children: ReactNode;
}) {
  const [visible, setVisible] = useState(false);

  return (
    <div
      className="relative"
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
    >
      {children}
      {visible && (
        <div className="absolute z-50 top-full mt-2 left-1/2 -translate-x-1/2 w-72 bg-black text-white text-sm p-3 rounded shadow-lg">
          {content}
        </div>
      )}
    </div>
  );
}
