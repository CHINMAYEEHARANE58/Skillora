import type { ButtonHTMLAttributes } from "react";
import { cn } from "../../utils/cn";

type SwitchProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  checked: boolean;
};

export function Switch({ checked, className, ...props }: SwitchProps) {
  return (
    <button
      aria-checked={checked}
      className={cn(
        "relative h-6 w-11 rounded-lg border border-transparent transition-colors",
        checked ? "bg-teal-500" : "bg-ink-200 dark:bg-white/15",
        className
      )}
      role="switch"
      type="button"
      {...props}
    >
      <span
        className={cn(
          "absolute top-0.5 h-5 w-5 rounded-md bg-white shadow-sm transition-transform",
          checked ? "translate-x-[22px]" : "translate-x-0.5"
        )}
      />
    </button>
  );
}
