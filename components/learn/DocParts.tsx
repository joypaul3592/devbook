import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { CodeBlock, Diagram } from "./CodeBlock";

export { CodeBlock, Diagram };

/** A spoken line — the name renders inline in bold, followed by the dialogue. */
export function Line({
  name,
  children,
}: {
  name: string;
  children: ReactNode;
}) {
  return (
    <p className="doc-line">
      <strong className="doc-line-name">{name}</strong>
      {children}
    </p>
  );
}

/** A code sample in its own panel. Kept as `Code` so older bodies keep working. */
export const Code = CodeBlock;

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

/**
 * Sub-heading inside a section. Not an anchor — the "on this page" rail only
 * lists H2s, so use this for the steps or cases within one section.
 */
export function H3({ children }: { children: ReactNode }) {
  return <h3>{children}</h3>;
}

/**
 * Section heading, and the anchor the "on this page" rail scrolls to.
 *
 * `anchorOnly` hides it visually while leaving it in the document. Use it for a
 * lesson's opening section, whose heading would only repeat the page title —
 * deleting the heading instead would take its anchor with it, and the rail
 * would have nothing to measure or scroll to.
 */
export function H2({
  id,
  children,
  anchorOnly = false,
}: {
  id: string;
  children: ReactNode;
  anchorOnly?: boolean;
}) {
  return (
    <h2 id={id} className={anchorOnly ? "doc-anchor-only" : undefined}>
      {children}
    </h2>
  );
}
