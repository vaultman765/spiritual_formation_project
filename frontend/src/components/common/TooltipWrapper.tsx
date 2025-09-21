import { useState, useRef, useEffect } from "react";
import type { ReactNode } from "react";

interface TooltipWrapperProps {
  content: ReactNode;
  children: ReactNode;
}

export default function TooltipWrapper({ content, children }: Readonly<TooltipWrapperProps>) {
  const [visible, setVisible] = useState(false);
  const [position, setPosition] = useState("bottom");
  const tooltipRef = useRef<HTMLDivElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handlePosition = () => {
      if (!tooltipRef.current || !wrapperRef.current) return;

      const tooltipRect = tooltipRef.current.getBoundingClientRect();
      const wrapperRect = wrapperRef.current.getBoundingClientRect();

      if (tooltipRect.bottom > window.innerHeight) {
        setPosition("top");
      } else if (tooltipRect.top < 0) {
        setPosition("bottom");
      } else if (wrapperRect.left < 0) {
        setPosition("right");
      } else if (wrapperRect.right > window.innerWidth) {
        setPosition("left");
      } else {
        setPosition("bottom"); // Default to bottom
      }
    };

    if (visible) {
      handlePosition();
      window.addEventListener("resize", handlePosition);
      window.addEventListener("scroll", handlePosition);
    }

    return () => {
      window.removeEventListener("resize", handlePosition);
      window.removeEventListener("scroll", handlePosition);
    };
  }, [visible]);

  // Extract tooltip position classes into a variable
  let positionClass = "";
  if (position === "top") {
    positionClass = "bottom-full mb-2";
  } else if (position === "bottom") {
    positionClass = "top-full mt-2";
  } else if (position === "left") {
    positionClass = "right-full mr-2";
  } else {
    positionClass = "left-full ml-2";
  }

  return (
    <div
      ref={wrapperRef}
      className="relative group overflow-visible"
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
    >
      {children}
      {visible && (
        <div
          ref={tooltipRef}
          className={`absolute z-[99999] overflow-visible ${positionClass} left-1/2 transform -translate-x-1/2 bg-black text-white text-sm p-2 rounded shadow-lg`}
        >
          {content}
        </div>
      )}
    </div>
  );
}
