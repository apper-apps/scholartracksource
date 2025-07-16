import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/utils/cn";

const Button = React.forwardRef(({ 
  children, 
  variant = "primary", 
  size = "md", 
  className,
  disabled = false,
  ...props 
}, ref) => {
  const variants = {
    primary: "bg-gradient-to-r from-primary-600 to-secondary-600 hover:from-primary-700 hover:to-secondary-700 text-white shadow-lg hover:shadow-xl",
    secondary: "bg-white border-2 border-primary-200 hover:border-primary-300 text-primary-700 hover:bg-primary-50",
    outline: "border-2 border-gray-300 hover:border-gray-400 text-gray-700 hover:bg-gray-50",
    ghost: "text-gray-700 hover:bg-gray-100",
    danger: "bg-gradient-to-r from-error to-red-500 hover:from-red-600 hover:to-red-600 text-white shadow-lg hover:shadow-xl",
    success: "bg-gradient-to-r from-success to-green-500 hover:from-green-600 hover:to-green-600 text-white shadow-lg hover:shadow-xl",
  };

  const sizes = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2 text-sm",
    lg: "px-6 py-3 text-base",
    xl: "px-8 py-4 text-lg",
  };

  const baseStyles = "inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed";

  return (
    <motion.button
      ref={ref}
      whileHover={!disabled ? { scale: 1.02 } : {}}
      whileTap={!disabled ? { scale: 0.98 } : {}}
      disabled={disabled}
      className={cn(
        baseStyles,
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {children}
    </motion.button>
  );
});

Button.displayName = "Button";

export default Button;