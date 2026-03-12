import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  icon?: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  className = '', 
  icon,
  ...props 
}, ref) => {
  const baseStyles = "min-h-11 rounded-2xl font-bold tracking-tight transition-all duration-200 active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed";
  
  const variants = {
    primary: "bg-slate-900 text-white shadow-[0_14px_28px_-20px_rgba(15,23,42,0.7)] hover:bg-slate-800 dark:bg-slate-100 dark:text-slate-950 dark:hover:bg-white",
    secondary: "bg-slate-100 text-slate-900 border border-slate-300/80 shadow-[0_10px_22px_-20px_rgba(15,23,42,0.28)] hover:bg-white dark:bg-slate-800/92 dark:text-slate-100 dark:border-slate-700 dark:shadow-none dark:hover:bg-slate-700",
    danger: "bg-red-600 text-white shadow-[0_14px_28px_-18px_rgba(220,38,38,0.8)] hover:bg-red-500",
    ghost: "bg-transparent text-slate-700 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/10"
  };

  const sizes = {
    sm: "px-3.5 py-2 text-sm",
    md: "px-4 py-2.5 text-[15px]",
    lg: "px-6 py-3 text-lg",
    xl: "px-8 py-4 text-xl"
  };

  return (
    <button 
      ref={ref}
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {icon && <span className="text-current">{icon}</span>}
      {children}
    </button>
  );
});

Button.displayName = 'Button';
