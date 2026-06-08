import type { LabelHTMLAttributes } from "react";
import { cn } from "../../utils/cn";

export function Label({ className, ...props }: LabelHTMLAttributes<HTMLLabelElement>) {
  return (
    <label
      className={cn("text-sm font-semibold text-ink-700 dark:text-ink-200", className)}
      {...props}
    />
  );
}
