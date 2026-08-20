"use client";

import { useEffect, useState } from "react";

/** Copy / download controls in the top-right of a code block. */
export function CodeActions({
  text,
  filename,
}: {
  text: string;
  filename: string;
}) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) return;
    const id = setTimeout(() => setCopied(false), 1600);
    return () => clearTimeout(id);
  }, [copied]);

  function download() {
    const url = URL.createObjectURL(
      new Blob([text], { type: "text/plain;charset=utf-8" }),
    );
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="code-actions">
      <button
        type="button"
        className="code-action"
        onClick={download}
        aria-label="Download snippet"
        title="Download"
      >
        <svg viewBox="0 0 20 20" aria-hidden>
          <circle cx="10" cy="10" r="7.2" fill="none" stroke="currentColor" strokeWidth="1.4" />
          <path
            d="M10 6.4v6.1m0 0 2.3-2.3M10 12.5 7.7 10.2"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      <button
        type="button"
        className="code-action"
        data-copied={copied || undefined}
        onClick={async () => {
          try {
            await navigator.clipboard.writeText(text);
            setCopied(true);
          } catch {
            // Clipboard blocked (insecure origin / denied permission) — stay quiet.
          }
        }}
        aria-label={copied ? "Copied" : "Copy code"}
        title={copied ? "Copied" : "Copy"}
      >
        {copied ? (
          <svg viewBox="0 0 20 20" aria-hidden>
            <path
              d="M4.6 10.6 8.2 14.2l7.2-8"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        ) : (
          <svg viewBox="0 0 20 20" aria-hidden>
            <rect
              x="7"
              y="7"
              width="9"
              height="9"
              rx="2"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.4"
            />
            <path
              d="M13 4.2H6a1.8 1.8 0 0 0-1.8 1.8V13"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.4"
              strokeLinecap="round"
            />
          </svg>
        )}
      </button>
    </div>
  );
}
