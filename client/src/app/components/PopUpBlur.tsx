"use client";
import React, { useRef } from "react";

interface IProps {
  children: React.ReactNode;
}
export const PopUpBlur: React.FC<IProps> = ({ children }) => {
  const popupRef = useRef<HTMLDivElement>(null);
  return (
    <div
      ref={popupRef}
      className="fixed top-0 left-0 w-full h-screen flex items-center justify-center bg-[white] z-[1000] bg-opacity-[80%]"
    >
      {children}
    </div>
  );
};
