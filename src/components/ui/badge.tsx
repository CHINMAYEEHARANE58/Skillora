import type { HTMLAttributes } from "react";
import { cn } from "../../utils/cn";

type BadgeProps = HTMLAttributes<HTMLSpanElement> & {
  variant?: "default" | "success" | "warning" | "outline";
};

const variants = {
  default: "bg-ink-100 text-ink-700 dark:bg-white/10 dark:text-ink-200",
  success: "bg-teal-50 text-teal-700 dark:bg-teal-400/12 dark:text-teal-200",
  warning: "bg-amber-50 text-amber-700 dark:bg-amber-400/12 dark:text-amber-200",
  outline: "border border-ink-200 text-ink-700 dark:border-white/10 dark:text-ink-200",
};

export function Badge({ className, variant = "default", ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-md px-2.5 py-1 text-xs font-semibold",
        variants[variant],
        className
      )}
      {...props}
    />
  );
}
