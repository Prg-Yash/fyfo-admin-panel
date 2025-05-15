import React from "react";

const Button = ({
  children,
  onClick,
  variant = "primary",
  className = "",
  disabled = false,
  type = "button",
  ...props
}) => {
  const variantClasses = {
    primary: "bg-blue-600 hover:bg-blue-700 text-white",
    secondary: "bg-gray-500 hover:bg-gray-600 text-white",
    danger: "bg-red-600 hover:bg-red-700 text-white",
    ghost: "bg-transparent hover:bg-gray-100 text-gray-800",
    outline:
      "bg-transparent border border-gray-300 hover:bg-gray-50 text-gray-800",
  };

  return (
    <button
      type={type}
      className={`px-4 py-2 rounded-md font-medium transition-colors ${
        variantClasses[variant]
      } ${disabled ? "opacity-50 cursor-not-allowed" : ""} ${className}`}
      onClick={onClick}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
