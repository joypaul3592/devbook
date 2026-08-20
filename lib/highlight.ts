/**
 * A tiny TS/JSX tokenizer for the lesson code blocks.
 *
 * Deliberately dependency-free and synchronous: it runs inside a Server
 * Component at render time, so highlighting costs the client bundle nothing.
 * It is a *display* highlighter, not a parser — it is allowed to be slightly
 * wrong on exotic syntax, and the fallback is always plain text.
 */

export type TokenType =
  | "plain"
  | "comment"
  | "string"
  | "keyword"
  | "literal"
  | "number"
  | "func"
  | "tag"
  | "attr"
  | "type"
  | "prop"
  | "punct";

export interface Token {
  t: TokenType;
  v: string;
}

const KEYWORDS = new Set([
  "as",
  "async",
  "await",
  "break",
  "case",
  "catch",
  "class",
  "const",
  "continue",
  "declare",
  "default",
  "delete",
  "do",
  "else",
  "enum",
  "export",
  "extends",
  "finally",
  "for",
  "from",
  "function",
  "if",
  "implements",
  "import",
  "in",
  "instanceof",
  "interface",
  "let",
  "new",
  "of",
  "private",
  "protected",
  "public",
  "readonly",
  "return",
  "satisfies",
  "static",
  "switch",
  "throw",
  "try",
  "type",
  "typeof",
  "var",
  "void",
  "while",
  "yield",
]);

const LITERALS = new Set([
  "true",
  "false",
  "null",
  "undefined",
  "this",
  "NaN",
  "Infinity",
]);

/** comment | string | number | identifier | whitespace | single char */
const SCANNER =
  /(\/\/[^\n]*|\/\*[\s\S]*?\*\/)|("(?:\\.|[^"\\])*"?|'(?:\\.|[^'\\])*'?|`(?:\\.|[^`\\])*`?)|(\b\d[\d_]*(?:\.\d+)?\b)|([A-Za-z_$][\w$]*)|([ \t]+)|([\s\S])/g;

const PUNCT = /[{}()[\].,;:?!<>=+\-*/%&|^~]/;

/** Split source into lines of typed tokens. */
export function tokenize(source: string): Token[][] {
  const lines: Token[][] = [];

  for (const raw of source.split("\n")) {
    lines.push(tokenizeLine(raw));
  }

  return lines;
}

function tokenizeLine(line: string): Token[] {
  const out: Token[] = [];
  // Rough JSX awareness: inside `<Foo ... >` bare identifiers are attributes.
  let inTag = false;

  SCANNER.lastIndex = 0;
  let m: RegExpExecArray | null;

  while ((m = SCANNER.exec(line)) !== null) {
    const [, comment, string, number, ident, space, other] = m;

    if (comment !== undefined) {
      push(out, "comment", comment);
      continue;
    }
    if (string !== undefined) {
      push(out, "string", string);
      continue;
    }
    if (number !== undefined) {
      push(out, "number", number);
      continue;
    }
    if (space !== undefined) {
      push(out, "plain", space);
      continue;
    }

    if (ident !== undefined) {
      push(
        out,
        classifyIdent(ident, out, line, m.index + ident.length, inTag),
        ident,
      );
      continue;
    }

    const ch = other!;
    if (ch === "<" && /^[A-Za-z_$/]/.test(line[m.index + 1] ?? ""))
      inTag = true;
    else if (ch === ">") inTag = false;

    push(out, PUNCT.test(ch) ? "punct" : "plain", ch);
  }

  return out;
}

function classifyIdent(
  word: string,
  out: Token[],
  line: string,
  end: number,
  inTag: boolean,
): TokenType {
  if (KEYWORDS.has(word)) return "keyword";
  if (LITERALS.has(word)) return "literal";

  const prev = lastSignificant(out);
  const after = line.slice(end).trimStart();

  // `<Foo` / `</Foo` — a JSX element name.
  if (prev === "<" || prev === "/") {
    const beforeSlash = out.length >= 2 ? lastSignificant(out, 1) : "";
    if (prev === "<" || beforeSlash === "<") return "tag";
  }

  if (inTag && after.startsWith("=") && !after.startsWith("==")) return "attr";
  if (after.startsWith("(")) return "func";
  if (prev === ".") return "prop";
  if (/^[A-Z]/.test(word)) return "type";

  return "plain";
}

/** The last non-whitespace character emitted so far, `skip` tokens back. */
function lastSignificant(out: Token[], skip = 0): string {
  let seen = 0;
  for (let i = out.length - 1; i >= 0; i--) {
    const v = out[i].v.trim();
    if (!v) continue;
    if (seen++ < skip) continue;
    return v.slice(-1);
  }
  return "";
}

function push(out: Token[], t: TokenType, v: string) {
  const last = out[out.length - 1];
  if (last && last.t === t) last.v += v;
  else out.push({ t, v });
}
