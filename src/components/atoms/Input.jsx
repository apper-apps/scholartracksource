import React from "react";
import { cn } from "@/utils/cn";

const Input = React.forwardRef(({ 
  type = "text", 
  className,
  error = false,
  ...props 
}, ref) => {
  const baseStyles = "w-full px-3 py-2 border rounded-lg transition-all duration-200 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none";
  const errorStyles = "border-error focus:ring-error focus:border-error";
  const normalStyles = "border-gray-300 focus:border-primary-500";

  return (
    <input
      ref={ref}
      type={type}
      className={cn(
        baseStyles,
        error ? errorStyles : normalStyles,
        className
      )}
      {...props}
    />
  );
});

Input.displayName = "Input";

export default Input;