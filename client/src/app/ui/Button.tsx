import React, { ButtonHTMLAttributes } from "react";

const Button: React.FC<ButtonHTMLAttributes<HTMLButtonElement>> = (props) => {
  return (
    <button
      {...props}
      className={`${props.className} bg-[black] text-[white] shadow-md px-4 py-2 rounded-md font-medium text-small flex items-center justify-center gap-3 hover:bg-[rgba(0,0,0,.7)] hover:scale-105 transition-all duration-150 ease-in-out`}
    />
  );
};

export default Button;
