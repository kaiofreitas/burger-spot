import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost';
  fullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  fullWidth = false, 
  className = '', 
  ...props 
}) => {
  const baseStyles = "px-6 py-4 rounded-xl font-bold transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-3 text-sm tracking-wide uppercase";
  
  const variants = {
    // Primary: Solid black for premium feel
    primary: "bg-[#1C1917] text-[#FDFBF7] hover:bg-[#000]",
    // Secondary: Bordered
    secondary: "bg-transparent text-[#1C1917] border border-[#E7E5E4] hover:bg-[#E7E5E4]",
    ghost: "bg-transparent text-[#666] hover:text-[#000]"
  };

  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${fullWidth ? 'w-full' : ''} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};