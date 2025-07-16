import React from "react";
import { cn } from "@/utils/cn";

const Card = React.forwardRef(({ 
  children, 
  className,
  hoverable = false,
  ...props 
}, ref) => {
  const baseStyles = "bg-white rounded-lg shadow-sm border border-gray-200 transition-all duration-200";
  const hoverStyles = hoverable ? "hover:shadow-md hover:border-gray-300" : "";

  return (
    <div
      ref={ref}
      className={cn(
        baseStyles,
        hoverStyles,
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
});

Card.displayName = "Card";

export default Card;