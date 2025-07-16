import React from "react";
import { cn } from "@/utils/cn";

const Badge = React.forwardRef(({ 
  children, 
  variant = "default", 
  size = "md", 
  className,
  ...props 
}, ref) => {
  const variants = {
    default: "bg-gray-100 text-gray-800",
    primary: "bg-gradient-to-r from-primary-100 to-secondary-100 text-primary-800",
    success: "bg-gradient-to-r from-green-100 to-emerald-100 text-green-800",
    warning: "bg-gradient-to-r from-yellow-100 to-orange-100 text-yellow-800",
    error: "bg-gradient-to-r from-red-100 to-pink-100 text-red-800",
    info: "bg-gradient-to-r from-blue-100 to-cyan-100 text-blue-800",
  };

  const sizes = {
    sm: "px-2 py-1 text-xs",
    md: "px-2.5 py-1.5 text-sm",
    lg: "px-3 py-2 text-base",
  };

  const baseStyles = "inline-flex items-center justify-center font-medium rounded-full";

  return (
    <span
      ref={ref}
      className={cn(
        baseStyles,
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
});

Badge.displayName = "Badge";

export default Badge;