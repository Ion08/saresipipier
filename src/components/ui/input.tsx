import { forwardRef, useId } from "react";
import { cn } from "@/lib/utils";

export interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "size"> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
  containerClassName?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, containerClassName, label, error, icon, id: externalId, ...props }, ref) => {
    const generatedId = useId();
    const id = externalId || generatedId;
    const errorId = `${id}-error`;

    return (
      <div className={cn("w-full", containerClassName)}>
        {label && <label htmlFor={id} className="mb-1.5 block text-xs font-bold uppercase tracking-widest text-black">{label}</label>}
        <div className="relative">
          {icon && <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-black/50">{icon}</div>}
          <input ref={ref} id={id} aria-invalid={!!error} aria-describedby={error ? errorId : undefined}
            className={cn(
              "w-full border-[2px] bg-white px-3.5 py-2.5 text-sm text-black placeholder:text-black/40",
              "focus:outline-none focus:border-rosso",
              "disabled:cursor-not-allowed disabled:bg-black/5 disabled:opacity-60",
              error ? "border-rosso" : "border-black",
              icon && "pl-10", className
            )} {...props} />
        </div>
        {error && <p id={errorId} className="mt-1 text-xs font-bold text-rosso" role="alert">{error}</p>}
      </div>
    );
  }
);
Input.displayName = "Input";
export { Input };
