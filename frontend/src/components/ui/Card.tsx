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
      className={`bg-white dark:bg-[#131D21] border border-slate-200 dark:border-[#22353A] border-t-2 border-t-[#3E6B48] dark:border-t-sage-300/30 rounded-2xl p-5 sm:p-6 shadow-xs dark:shadow-md transition-all duration-80 ${className}`}
      {...props}
    >
      {(title || headerAction) && (
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100 dark:border-[#22353A]">
          <div>
            {title && <h3 className="text-base font-bold text-slate-900 dark:text-white tracking-tight">{title}</h3>}
            {subtitle && <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{subtitle}</p>}
          </div>
          {headerAction && <div>{headerAction}</div>}
        </div>
      )}
      {children}
    </div>
  );
};

export default Card;
