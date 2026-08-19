import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/** A spoken line — "Joy: ..." / "Rony: ..." */
export function Line({
  name,
  children,
}: {
  name: string;
  children: ReactNode;
}) {
  return (
    <div className="doc-line">
      <span className="doc-line-name">{name}</span>
      <span className="min-w-0">{children}</span>
    </div>
  );
}

/** A monospace diagram / tree / code block. */
export function Code({ children }: { children: string }) {
  return (
    <pre>
      <code>{children}</code>
    </pre>
  );
}

/** A highlighted takeaway box. */
export function Note({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return <div className={cn("doc-note", className)}>{children}</div>;
}

/** Section heading with an emoji marker, used as an anchor target. */
export function H2({ id, children }: { id: string; children: ReactNode }) {
  return <h2 id={id}>{children}</h2>;
}
