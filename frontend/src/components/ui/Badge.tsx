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
      bg: 'bg-pine-700/70 text-slate-300 border-pine-600',
      dot: 'bg-slate-400',
    },
    success: {
      bg: 'bg-sage-300/15 text-sage-300 border-sage-300/35',
      dot: 'bg-sage-300 shadow-[0_0_6px_rgba(175,209,155,0.8)]',
    },
    warning: {
      bg: 'bg-tactical-amber/15 text-tactical-amber border-tactical-amber/35',
      dot: 'bg-tactical-amber shadow-[0_0_6px_rgba(229,169,60,0.8)]',
    },
    danger: {
      bg: 'bg-tactical-crimson/15 text-rose-300 border-tactical-crimson/35',
      dot: 'bg-tactical-crimson shadow-[0_0_6px_rgba(244,63,94,0.8)]',
    },
    info: {
      bg: 'bg-pine-500/30 text-sage-200 border-pine-500/50',
      dot: 'bg-sage-200 shadow-[0_0_6px_rgba(207,226,195,0.8)]',
    },
    purple: {
      bg: 'bg-indigo-500/15 text-indigo-300 border-indigo-500/30',
      dot: 'bg-indigo-400',
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
