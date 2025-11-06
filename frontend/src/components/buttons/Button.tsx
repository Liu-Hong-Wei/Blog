import type { ReactNode, ButtonHTMLAttributes } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children?: ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary';
  size?: 'small' | 'mid' | 'large' | 'fit';
}

export default function Button({
  children = null,
  className = '',
  variant = 'primary',
  size = 'mid',
  onClick,
  disabled = false,
  ...props
}: ButtonProps) {
  const trimmedClassName = className.trim();

  const variantClass =
    variant === 'primary' ? 'text-primary' : variant === 'secondary' ? 'text-secondary' : '';

  const sizeClass =
    size == 'fit'
      ? 'size-fit p-2 text-lg font-normal'
      : size === 'small'
        ? 'h-8 p-2 text-base font-light'
        : size === 'mid'
          ? 'h-12 p-2 text-lg font-normal'
          : 'h-16 p-2 text-xl font-medium';

  const classes =
    `rounded-xl util-transition focus:outline-none hover:cursor-pointer inline-flex items-center justify-center ${variantClass} ${sizeClass} ${trimmedClassName}`.trim();

  return (
    <button className={classes} onClick={onClick} disabled={disabled} {...props}>
      {children}
    </button>
  );
}
