import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center font-ui text-[0.6875rem] font-medium rounded-full transition-colors duration-200 tracking-wide",
  {
    variants: {
      variant: {
        default: "bg-p-surface-2 text-p-ink-3 border border-p-rule px-2.5 py-0.5",
        accent: "bg-p-green-soft text-p-green border border-p-green-mid px-2.5 py-0.5",
        accent2: "bg-p-indigo-soft text-p-indigo border border-[var(--p-indigo-soft)] px-2.5 py-0.5",
        accent3: "bg-[rgba(155,107,114,0.08)] text-p-rose border border-[rgba(155,107,114,0.15)] px-2.5 py-0.5",
        solid: "bg-p-ink text-[var(--p-bg)] px-2.5 py-0.5",
      },
    },
    defaultVariants: { variant: "default" },
  }
);

interface BadgeProps extends VariantProps<typeof badgeVariants> {
  children: React.ReactNode;
  className?: string;
}

export function Badge({ children, variant, className }: BadgeProps) {
  return (
    <span className={cn(badgeVariants({ variant }), className)}>
      {children}
    </span>
  );
}
