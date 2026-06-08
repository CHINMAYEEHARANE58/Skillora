import type { ButtonHTMLAttributes } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../utils/cn";

const buttonVariants = cva(
  "inline-flex min-h-10 items-center justify-center gap-2 rounded-lg text-sm font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 dark:focus-visible:ring-offset-ink-950",
  {
    variants: {
      variant: {
        default:
          "bg-ink-950 text-white shadow-sm hover:bg-ink-800 dark:bg-white dark:text-ink-950 dark:hover:bg-ink-100",
        secondary:
          "border border-ink-200 bg-white text-ink-900 hover:border-teal-500 hover:text-teal-700 dark:border-white/10 dark:bg-white/10 dark:text-white dark:hover:border-teal-300",
        ghost:
          "text-ink-600 hover:bg-ink-100 hover:text-ink-950 dark:text-ink-300 dark:hover:bg-white/10 dark:hover:text-white",
        destructive: "bg-coral-600 text-white hover:bg-coral-500",
      },
      size: {
        default: "px-4 py-2",
        sm: "min-h-9 px-3 py-2",
        lg: "min-h-11 px-5 py-3",
        icon: "h-10 w-10 p-0",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof buttonVariants>;

export function Button({ className, variant, size, ...props }: ButtonProps) {
  return <button className={cn(buttonVariants({ variant, size, className }))} {...props} />;
}
