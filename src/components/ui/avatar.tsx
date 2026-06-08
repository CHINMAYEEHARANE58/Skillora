import { cn } from "../../utils/cn";

type AvatarProps = {
  name: string;
  imageUrl?: string;
  className?: string;
};

export function Avatar({ name, imageUrl, className }: AvatarProps) {
  const initials = name
    .split(" ")
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <div
      className={cn(
        "grid h-10 w-10 shrink-0 place-items-center overflow-hidden rounded-lg bg-ink-950 text-sm font-bold text-white dark:bg-white dark:text-ink-950",
        className
      )}
    >
      {imageUrl ? <img alt={name} className="h-full w-full object-cover" src={imageUrl} /> : initials}
    </div>
  );
}
