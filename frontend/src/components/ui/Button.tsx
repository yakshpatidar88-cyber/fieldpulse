import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  leftIcon,
  rightIcon,
  className = '',
  disabled,
  ...props
}) => {
  const baseStyles = 'inline-flex items-center justify-center font-semibold rounded-lg transition-all duration-80 active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-offset-white dark:focus:ring-offset-obsidian disabled:opacity-50 disabled:pointer-events-none cursor-pointer';

  const sizeStyles = {
    sm: 'px-3 py-1.5 text-xs gap-1.5',
    md: 'px-4 py-2 text-sm gap-2',
    lg: 'px-5 py-2.5 text-base gap-2.5',
  };

  const variantStyles = {
    primary: 'bg-[#234B34] hover:bg-[#1A3827] text-white shadow-sm border border-[#234B34] dark:bg-sage-300 dark:hover:bg-sage-200 dark:text-obsidian dark:font-bold dark:shadow-tactical-glow dark:border-sage-300',
    secondary: 'bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-200 shadow-xs dark:bg-pine-800 dark:hover:bg-pine-700 dark:text-slate-100 dark:border-pine-600 dark:hover:border-sage-300/40',
    outline: 'border border-slate-300 hover:border-slate-400 text-slate-700 hover:bg-slate-100 bg-transparent dark:border-pine-600 dark:hover:border-sage-300/50 dark:text-slate-300 dark:hover:text-white dark:hover:bg-pine-800/40',
    danger: 'bg-rose-600 hover:bg-rose-700 text-white shadow-sm border border-rose-600 dark:bg-tactical-crimson dark:hover:bg-rose-500 dark:shadow-crimson-glow dark:border-rose-500/40',
    ghost: 'hover:bg-slate-100 text-slate-600 hover:text-slate-900 dark:hover:bg-pine-800/60 dark:text-slate-400 dark:hover:text-white',
  };

  return (
    <button
      className={`${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <svg className="animate-spin -ml-0.5 mr-2 h-4 w-4 text-current" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
        </svg>
      ) : (
        leftIcon
      )}
      {children}
      {!isLoading && rightIcon}
    </button>
  );
};

export default Button;
