import React from "react";

function Button({
  children,
  onClick,
  parentClassName = "bg-indigo-300",
  childrenClassName = "bg-indigo-300 text-black hover:bg-indigo-600 hover:text-white text-white",
  ...rest
}) {
  return (
    <div
      className={`${parentClassName} bg-indigo-300 rounded hover:-translate-x-0.5 hover:-translate-y-0.5`}
    >
      <button
        type="submit"
        onClick={onClick}
        className={`${childrenClassName} w-full hover:-translate-x-1.5 hover:-translate-y-1.5 px-3 py-2 rounded`}
        {...rest}
      >
        {children}
      </button>
    </div>
  );
}

export default Button;
