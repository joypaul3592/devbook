import { cn } from "@/lib/utils";
import React from "react";

export default function Container({
  children,
  className,
  props,
}: {
  children: React.ReactNode;
  className?: string;
  props?: React.HTMLAttributes<HTMLDivElement>;
}) {
  return (
    <div className={cn("max-w-6xl mx-auto sm:px-8 px-4", className)} {...props}>
      {children}
    </div>
  );
}
