import { forwardRef } from "react";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

const variantStyles = {
  primary: "bg-rosso text-white border-3 border-rosso hover:bg-black hover:border-black",
  secondary: "bg-transparent text-black border-3 border-black hover:bg-black hover:text-white",
  ghost: "bg-transparent text-black/50 border-3 border-transparent hover:text-black hover:border-black",
  danger: "bg-rosso text-white border-3 border-rosso hover:bg-black hover:border-black",
};

const sizeStyles = {
  sm: "px-3 py-1.5 text-xs gap-1.5",
  md: "px-5 py-2.5 text-sm gap-2",
  lg: "px-7 py-3 text-base gap-2.5",
};

const iconSize = { sm: 16, md: 18, lg: 20 };

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: keyof typeof variantStyles;
  size?: keyof typeof sizeStyles;
  loading?: boolean;
  iconLeft?: React.ReactNode;
  iconRight?: React.ReactNode;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", loading = false, disabled = false, iconLeft, iconRight, children, type = "button", ...props }, ref) => {
    const isDisabled = disabled || loading;
    return (
      <button ref={ref} type={type} disabled={isDisabled}
        className={cn(
          "inline-flex items-center justify-center font-bold uppercase tracking-wider disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-40 select-none",
          variantStyles[variant], sizeStyles[size], className
        )} {...props}>
        {loading ? <Loader2 size={iconSize[size]} className="animate-spin shrink-0" /> : iconLeft ? <span className="shrink-0">{iconLeft}</span> : null}
        {children && <span>{children}</span>}
        {!loading && iconRight && <span className="shrink-0">{iconRight}</span>}
      </button>
    );
  }
);
Button.displayName = "Button";
export { Button };
