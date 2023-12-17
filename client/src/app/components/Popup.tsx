"use client";
import React, { useEffect, useRef } from "react";

interface IProps {
  children: React.ReactNode;
  onClose: () => void;
}

export const Popup: React.FC<IProps> = ({ children, onClose }) => {
  const sectionRef = useRef<HTMLElement>(null);

  const handleClickOutside = (event: MouseEvent) => {
    if (sectionRef.current && (event.target as Node).nodeName === "SECTION") {
      onClose();
    }
  };

  useEffect(() => {
    document.addEventListener("click", handleClickOutside, true);
    return () => {
      document.removeEventListener("click", handleClickOutside, true);
    };
  }, []);
  return (
    <section
      ref={sectionRef}
      className="animateFadeIn  fixed top-0 left-0 w-full h-screen bg-[hsla(0, 0%, 100%, 0.8)] backdrop-blur-[4px] flex items-center justify-center"
    >
      <div className=" bg-[white] p-6 shadow-lg">{children}</div>
    </section>
  );
};
