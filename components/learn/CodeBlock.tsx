import { tokenize } from "@/lib/highlight";
import { CodeActions } from "./CodeActions";

export interface CodeBlockProps {
  children: string;
  /** Language name shown at the top-left of the block. */
  label?: string;
  /** File name used when the snippet is downloaded. */
  filename?: string;
}

/** A code sample in its own panel: language label, copy / download, highlighted body. */
export function CodeBlock({
  children,
  label = "TypeScript",
  filename,
}: CodeBlockProps) {
  const source = children.replace(/^\n+|\s+$/g, "");
  const lines = tokenize(source);

  return (
    <figure className="code-block">
      <div className="code-bar">
        <span className="code-label">{label}</span>
        <CodeActions text={source} filename={filename ?? "snippet.tsx"} />
      </div>

      <div className="code-scroll">
        <pre className="code-pre">
          <code>
            {lines.map((tokens, i) => (
              <span key={i} className="code-line">
                {tokens.map((tk, j) => (
                  <span key={j} className={`tk-${tk.t}`}>
                    {tk.v}
                  </span>
                ))}
                {"\n"}
              </span>
            ))}
          </code>
        </pre>
      </div>
    </figure>
  );
}

/**
 * ASCII flow diagrams — the same panel without the bar or highlighting,
 * since the art is the content.
 */
export function Diagram({ children }: { children: string }) {
  return (
    <figure className="code-block code-block--diagram">
      <div className="code-scroll">
        <pre className="code-pre">
          <code>{children.replace(/^\n+|\s+$/g, "")}</code>
        </pre>
      </div>
    </figure>
  );
}
