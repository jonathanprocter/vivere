// This is a placeholder file to allow the Next.js build to pass.
import React from 'react';

interface ButtonProps {
  onClick?: () => void;
  children?: React.ReactNode;
  className?: string;
  variant?: string;
  type?: "button" | "submit" | "reset"; // Added type prop
  disabled?: boolean; // Added disabled from the error message context
}

const Button: React.FC<ButtonProps> = ({ onClick, children, className, variant, type, disabled }) => {
  // The variant, type, and disabled props are not actually used in this placeholder,
  // but they are added to match the props expected by other components.
  return (
    <button onClick={onClick} className={className} type={type} disabled={disabled}>
      {children}
    </button>
  );
};

export default Button;
