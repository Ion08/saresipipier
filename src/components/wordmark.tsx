import { cn } from "@/lib/utils";

interface WordmarkProps {
  variant?: "light" | "dark";
  className?: string;
}

export function Wordmark({ variant = "dark", className }: WordmarkProps) {
  const base = variant === "light" ? "text-white" : "text-black";

  return (
    <span className={cn("font-display uppercase tracking-tight", base, className)}>
      <span>Sare</span>
      <span className="text-verde">ș</span>
      <span>i</span>
      <span className="text-rosso">Piper</span>
    </span>
  );
}
