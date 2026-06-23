"use client";

import { forwardRef, useId } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

export interface SelectOption { value: string; label: string; disabled?: boolean; }

export interface SelectProps extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, "size"> {
  label?: string; error?: string; options: SelectOption[]; placeholder?: string; containerClassName?: string;
}

const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, containerClassName, label, error, options, placeholder, id: externalId, ...props }, ref) => {
    const generatedId = useId();
    const id = externalId || generatedId;
    const errorId = `${id}-error`;

    return (
      <div className={cn("w-full", containerClassName)}>
        {label && <label htmlFor={id} className="mb-1.5 block text-xs font-bold uppercase tracking-widest text-black">{label}</label>}
        <div className="relative">
          <select ref={ref} id={id} aria-invalid={!!error} aria-describedby={error ? errorId : undefined}
            className={cn(
              "w-full appearance-none border-[2px] bg-white px-3.5 py-2.5 pr-10 text-sm text-black",
              "focus:outline-none focus:border-rosso",
              "disabled:cursor-not-allowed disabled:bg-black/5 disabled:opacity-60",
              error ? "border-rosso" : "border-black",
              !props.value && placeholder && "text-black/40",
              className
            )} {...props}>
            {placeholder && <option value="" disabled>{placeholder}</option>}
            {options.map((o) => <option key={o.value} value={o.value} disabled={o.disabled}>{o.label}</option>)}
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 text-black/50"><ChevronDown size={16} /></div>
        </div>
        {error && <p id={errorId} className="mt-1 text-xs font-bold text-rosso" role="alert">{error}</p>}
      </div>
    );
  }
);
Select.displayName = "Select";
export { Select };
