import { forwardRef, useId } from "react";
import { cn } from "@/lib/utils";

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  containerClassName?: string;
}

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, containerClassName, label, error, id: externalId, ...props }, ref) => {
    const generatedId = useId();
    const id = externalId || generatedId;
    const errorId = `${id}-error`;

    return (
      <div className={cn("w-full", containerClassName)}>
        {label && <label htmlFor={id} className="mb-1.5 block text-xs font-bold uppercase tracking-widest text-black">{label}</label>}
        <textarea ref={ref} id={id} aria-invalid={!!error} aria-describedby={error ? errorId : undefined}
          className={cn(
            "w-full border-[2px] bg-white px-3.5 py-2.5 text-sm text-black placeholder:text-black/40",
            "focus:outline-none focus:border-rosso",
            "disabled:cursor-not-allowed disabled:bg-black/5 disabled:opacity-60",
            "min-h-[100px] resize-y",
            error ? "border-rosso" : "border-black", className
          )} {...props} />
        {error && <p id={errorId} className="mt-1 text-xs font-bold text-rosso" role="alert">{error}</p>}
      </div>
    );
  }
);
Textarea.displayName = "Textarea";
export { Textarea };
