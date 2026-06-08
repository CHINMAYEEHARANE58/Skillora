import { cn } from "../../utils/cn";

type ProgressProps = {
  value: number;
  className?: string;
};

export function Progress({ value, className }: ProgressProps) {
  return (
    <div className={cn("h-2 overflow-hidden rounded-lg bg-ink-100 dark:bg-white/10", className)}>
      <div
        className="h-full rounded-lg bg-teal-500 transition-all duration-500"
        style={{ width: `${Math.min(Math.max(value, 0), 100)}%` }}
      />
    </div>
  );
}
