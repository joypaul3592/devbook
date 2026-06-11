import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import Link from "next/link";
import type { ComponentPropsWithoutRef } from "react";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 font-ui text-[0.8125rem] font-medium transition-all duration-200 cursor-pointer select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-p-green disabled:opacity-50 disabled:pointer-events-none",
  {
    variants: {
      variant: {
        primary:
          "bg-p-ink text-[var(--p-bg)] hover:bg-p-green rounded-full px-5 py-2",
        secondary:
          "bg-p-surface border border-p-rule text-p-ink hover:bg-p-surface-2 hover:border-p-green/40 rounded-full px-5 py-2",
        ghost:
          "text-p-ink-3 hover:text-p-ink hover:bg-p-surface-2 rounded-full px-3 py-2",
        accent:
          "bg-p-green text-[var(--p-bg)] hover:opacity-90 rounded-full px-5 py-2",
        link:
          "text-p-indigo hover:text-p-green underline-offset-4 hover:underline p-0",
      },
      size: {
        sm: "text-xs px-3 py-1.5",
        md: "text-[0.8125rem] px-5 py-2",
        lg: "text-[0.9375rem] px-6 py-2.5",
        icon: "w-8 h-8 p-0 rounded-full",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  }
);

type ButtonBaseProps = VariantProps<typeof buttonVariants> & { className?: string };
type ButtonAsButton = ButtonBaseProps & ComponentPropsWithoutRef<"button"> & { href?: undefined };
type ButtonAsLink = ButtonBaseProps & ComponentPropsWithoutRef<typeof Link> & { href: string };
type ButtonProps = ButtonAsButton | ButtonAsLink;

export function Button({ className, variant, size, ...props }: ButtonProps) {
  const classes = cn(buttonVariants({ variant, size }), className);

  if ("href" in props && props.href !== undefined) {
    const { href, ...rest } = props as ButtonAsLink;
    return <Link href={href} className={classes} {...rest} />;
  }

  return <button className={classes} {...(props as ButtonAsButton)} />;
}
