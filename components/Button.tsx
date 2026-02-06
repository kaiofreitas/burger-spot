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
    // Primary: Orange for brand accent on dark
    primary: "bg-[#F97316] text-white hover:bg-[#EA580C]",
    // Secondary: Dark bordered
    secondary: "bg-transparent text-[#F5F5F5] border border-[#333333] hover:bg-[#2A2A2A]",
    ghost: "bg-transparent text-[#A3A3A3] hover:text-[#F5F5F5]"
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