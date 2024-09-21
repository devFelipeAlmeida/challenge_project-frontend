import React from "react";
import classNames from "classnames"; 

function Button({ children, onClick, className, type = "button" }) {
  return (
    <div>
      <button
        type={type}
        onClick={onClick}
        className={classNames(
          "w-full rounded text-white font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2",
          className ? className : "bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
        )}
      >
        {children}
      </button>
    </div>
  );
}

export default Button;
