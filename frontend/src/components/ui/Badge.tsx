import React from 'react';

type BadgeVariant =
  | 'default'
  | 'success'
  | 'warning'
  | 'danger'
  | 'info'
  | 'purple';

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
  size?: 'sm' | 'md';
  dot?: boolean;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'default',
  size = 'md',
  dot = false,
  className = '',
  ...props
}) => {
  const variantStyles: Record<BadgeVariant, { bg: string; dot: string }> = {
    default: {
      bg: 'bg-slate-100 text-slate-700 border-slate-200 dark:bg-pine-700/70 dark:text-slate-300 dark:border-pine-600',
      dot: 'bg-slate-500 dark:bg-slate-400',
    },
    success: {
      bg: 'bg-emerald-50 text-emerald-800 border-emerald-200 dark:bg-sage-300/15 dark:text-sage-300 dark:border-sage-300/35',
      dot: 'bg-emerald-600 dark:bg-sage-300 dark:shadow-[0_0_6px_rgba(175,209,155,0.8)]',
    },
    warning: {
      bg: 'bg-amber-50 text-amber-800 border-amber-200 dark:bg-tactical-amber/15 dark:text-tactical-amber dark:border-tactical-amber/35',
      dot: 'bg-amber-500 dark:bg-tactical-amber dark:shadow-[0_0_6px_rgba(229,169,60,0.8)]',
    },
    danger: {
      bg: 'bg-rose-50 text-rose-800 border-rose-200 dark:bg-tactical-crimson/15 dark:text-rose-300 dark:border-tactical-crimson/35',
      dot: 'bg-rose-500 dark:bg-tactical-crimson dark:shadow-[0_0_6px_rgba(244,63,94,0.8)]',
    },
    info: {
      bg: 'bg-teal-50 text-teal-800 border-teal-200 dark:bg-pine-500/30 dark:text-sage-200 dark:border-pine-500/50',
      dot: 'bg-teal-500 dark:bg-sage-200 dark:shadow-[0_0_6px_rgba(207,226,195,0.8)]',
    },
    purple: {
      bg: 'bg-purple-50 text-purple-800 border-purple-200 dark:bg-indigo-500/15 dark:text-indigo-300 dark:border-indigo-500/30',
      dot: 'bg-purple-500 dark:bg-indigo-400',
    },
  };

  const sizeStyles = {
    sm: 'text-[10px] px-2 py-0.5 tracking-tight',
    md: 'text-[11px] px-2.5 py-0.5 tracking-tight',
  };

  return (
    <span
      className={`inline-flex items-center font-mono font-semibold rounded-full border shadow-xs ${variantStyles[variant].bg} ${sizeStyles[size]} ${className}`}
      {...props}
    >
      {dot && (
        <span
          className={`w-1.5 h-1.5 rounded-full mr-1.5 animate-pulse shrink-0 ${variantStyles[variant].dot}`}
        />
      )}
      {children}
    </span>
  );
};

export default Badge;
