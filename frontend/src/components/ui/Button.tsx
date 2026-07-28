import type { ButtonHTMLAttributes, ReactNode } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'outline' | 'danger';
  loading?: boolean;
  children: ReactNode;
}

export const Button = ({
  variant = 'primary',
  loading,
  children,
  className,
  disabled,
  ...props
}: ButtonProps) => {
  const base = 'font-medium px-6 py-2 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed';

  const variants = {
    primary: 'bg-primary-600 hover:bg-primary-700 text-white',
    outline: 'bg-slate-200 hover:bg-slate-300 text-slate-900',
    danger: 'bg-error-600 hover:bg-error-700 text-white',
  };

  const classes = [base, variants[variant], className].filter(Boolean).join(' ');

  return (
    <button className={classes} disabled={disabled || loading} {...props}>
      {children}
    </button>
  );
};