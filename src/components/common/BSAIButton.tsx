import React from 'react';
import { Loader2 } from 'lucide-react';

export type ButtonVariant =
  | 'cinematic-primary'
  | 'cinematic-secondary'
  | 'primary'
  | 'secondary'
  | 'success'
  | 'warning'
  | 'escalate'
  | 'danger'
  | 'ghost';

export type ButtonSize = 'sm' | 'md' | 'lg';

export interface BSAIButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  isLoading?: boolean;
  fullWidth?: boolean;
}

export const BSAIButton: React.FC<BSAIButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  icon,
  iconPosition = 'right',
  isLoading = false,
  fullWidth = false,
  className = '',
  disabled,
  ...props
}) => {
  // Shared flat button treatment with clear focus and a small press response.
  let baseStyles =
    'relative inline-flex items-center justify-center font-semibold font-sans transition-colors duration-150 select-none outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer';

  // Size styles
  let sizeStyles = '';
  switch (size) {
    case 'sm':
      sizeStyles = 'text-xs px-3 py-1.5 rounded-md gap-1.5 min-h-[34px]';
      break;
    case 'lg':
      sizeStyles = 'text-sm px-5 py-3 rounded-md gap-2.5 min-h-[46px]';
      break;
    case 'md':
    default:
      sizeStyles = 'text-xs sm:text-sm px-4 py-2.5 rounded-md gap-2 min-h-[38px]';
      break;
  }

  // Variant styles
  let variantStyles = '';
  switch (variant) {
    case 'cinematic-primary':
      variantStyles =
        'bg-[#126a50] text-white border border-[#126a50] hover:bg-[#0d503d] hover:border-[#0d503d] active:bg-[#0b4434] focus-visible:ring-[#47705a]';
      break;

    case 'cinematic-secondary':
      variantStyles =
        'bg-white text-[#34443a] border border-[#dce3da] hover:bg-[#f4f6f2] hover:border-[#bccbbe] active:bg-[#eef2eb] focus-visible:ring-[#47705a]';
      break;

    case 'primary':
      variantStyles =
        'bg-[#126a50] hover:bg-[#0d503d] text-white border border-[#126a50] focus-visible:ring-bsai-teal';
      break;

    case 'secondary':
      variantStyles =
        'bg-white hover:bg-[#f4f6f2] text-[#34443a] border border-[#dce3da] hover:border-[#bccbbe] focus-visible:ring-bsai-teal';
      break;

    case 'success':
      variantStyles =
        'bg-[#427553] hover:bg-[#345f43] text-white border border-[#427553] focus-visible:ring-emerald-600';
      break;

    case 'warning':
      variantStyles =
        'bg-[#a87131] hover:bg-[#8c5c28] text-white border border-[#a87131] focus-visible:ring-amber-600';
      break;

    case 'escalate':
      variantStyles =
        'bg-[#a75449] hover:bg-[#8e433b] text-white border border-[#a75449] focus-visible:ring-rose-600';
      break;

    case 'danger':
      // Destructive / High Alert Action
      variantStyles =
        'bg-red-600 hover:bg-red-700 text-white shadow-xs hover:shadow-md border border-red-500/50 hover:-translate-y-0.5 active:scale-[0.98] active:translate-y-0 focus-visible:ring-red-600';
      break;

    case 'ghost':
      // Ghost Minimalist Action
      variantStyles =
        'bg-transparent hover:bg-black/5 text-bsai-indigo hover:text-bsai-teal focus-visible:ring-bsai-teal active:scale-[0.98]';
      break;
  }

  const widthStyle = fullWidth ? 'w-full' : '';

  return (
    <button
      className={`${baseStyles} ${sizeStyles} ${variantStyles} ${widthStyle} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <>
          <Loader2 className="w-4 h-4 animate-spin shrink-0" />
          <span>{children}</span>
        </>
      ) : (
        <>
          {icon && iconPosition === 'left' && <span className="shrink-0">{icon}</span>}
          <span>{children}</span>
          {icon && iconPosition === 'right' && <span className="shrink-0">{icon}</span>}
        </>
      )}
    </button>
  );
};
