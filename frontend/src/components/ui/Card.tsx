import React from 'react';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string;
  subtitle?: string;
  headerAction?: React.ReactNode;
}

export const Card: React.FC<CardProps> = ({
  title,
  subtitle,
  headerAction,
  children,
  className = '',
  ...props
}) => {
  return (
    <div
      className={`bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-xl p-5 sm:p-6 backdrop-blur shadow-sm transition-colors ${className}`}
      {...props}
    >
      {(title || headerAction) && (
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-200 dark:border-slate-800/80">
          <div>
            {title && <h3 className="text-base font-semibold text-slate-900 dark:text-white">{title}</h3>}
            {subtitle && <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{subtitle}</p>}
          </div>
          {headerAction && <div>{headerAction}</div>}
        </div>
      )}
      {children}
    </div>
  );
};
