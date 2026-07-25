import type {ButtonHTMLAttributes} from 'react';
import type {LucideIcon} from 'lucide-react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost';
  icon?: LucideIcon;
  loading?: boolean;
}

export function Button({
  children,
  className = '',
  icon: Icon,
  loading = false,
  variant = 'primary',
  disabled,
  ...props
}: ButtonProps) {
  return (
    <button
      className={`button button-${variant} ${loading ? 'is-loading' : ''} ${className}`.trim()}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? <span className="button-spinner" aria-hidden="true" /> : Icon ? <Icon size={16} aria-hidden="true" /> : null}
      {children}
    </button>
  );
}
