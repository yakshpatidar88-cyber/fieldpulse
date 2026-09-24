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
      className={`bg-pine-800/90 border border-pine-600 border-t-sage-300/25 rounded-2xl p-5 sm:p-6 shadow-md transition-all duration-80 ${className}`}
      {...props}
    >
      {(title || headerAction) && (
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-pine-600/80">
          <div>
            {title && <h3 className="text-base font-bold text-white tracking-tight">{title}</h3>}
            {subtitle && <p className="text-xs text-slate-400 mt-0.5">{subtitle}</p>}
          </div>
          {headerAction && <div>{headerAction}</div>}
        </div>
      )}
      {children}
    </div>
  );
};

export default Card;
