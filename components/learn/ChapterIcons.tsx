/**
 * One thin line icon per chapter, keyed by chapter slug.
 * All icons share a 24×24 box and inherit colour, so they can sit inline
 * anywhere a chapter title appears.
 */

type IconProps = { className?: string };

function Svg({ className, children }: IconProps & { children: React.ReactNode }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.25"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden
    >
      {children}
    </svg>
  );
}

const icons: Record<string, (p: IconProps) => React.ReactElement> = {
  /* Layers — rendering stack */
  "nextjs-architecture-rendering": (p) => (
    <Svg {...p}>
      <path d="m12 3 9 4.5-9 4.5-9-4.5L12 3Z" />
      <path d="m3 12 9 4.5L21 12" />
      <path d="m3 16.5 9 4.5 9-4.5" />
    </Svg>
  ),

  /* Arrow into a tray — fetching data in */
  "data-fetching-architecture": (p) => (
    <Svg {...p}>
      <path d="M12 3v10" />
      <path d="m8 9.5 4 4 4-4" />
      <path d="M4 16v3.5h16V16" />
    </Svg>
  ),

  /* Bolt — a mutation firing */
  "server-actions": (p) => (
    <Svg {...p}>
      <path d="M13 3 5 13.5h6l-1 7.5 8-10.5h-6L13 3Z" />
    </Svg>
  ),

  /* Branching paths */
  "routing-architecture": (p) => (
    <Svg {...p}>
      <circle cx="6" cy="5" r="2" />
      <circle cx="6" cy="19" r="2" />
      <circle cx="18" cy="12" r="2" />
      <path d="M6 7v10" />
      <path d="M8 5h4a4 4 0 0 1 4 4v1" />
    </Svg>
  ),

  /* Funnel — requests filtered on the way through */
  "middleware-proxy": (p) => (
    <Svg {...p}>
      <path d="M3 4h18l-7 8.5V20l-4 1.5v-9L3 4Z" />
    </Svg>
  ),

  /* Shield with a keyhole */
  auth: (p) => (
    <Svg {...p}>
      <path d="M12 3 5 5.8v5.7c0 4 2.9 7.4 7 9.2 4.1-1.8 7-5.2 7-9.2V5.8L12 3Z" />
      <circle cx="12" cy="11" r="1.6" />
      <path d="M12 12.8V15" />
    </Svg>
  ),

  /* Database cylinder */
  "database-architecture": (p) => (
    <Svg {...p}>
      <ellipse cx="12" cy="6" rx="7.5" ry="3" />
      <path d="M4.5 6v12c0 1.7 3.4 3 7.5 3s7.5-1.3 7.5-3V6" />
      <path d="M19.5 12c0 1.7-3.4 3-7.5 3s-7.5-1.3-7.5-3" />
    </Svg>
  ),

  /* Braces — an endpoint contract */
  "api-architecture": (p) => (
    <Svg {...p}>
      <path d="M8.5 3.5c-2 0-2.8 1-2.8 2.7v2.6c0 1.5-.9 2.4-1.9 3.2 1 .8 1.9 1.7 1.9 3.2v2.6c0 1.7.8 2.7 2.8 2.7" />
      <path d="M15.5 3.5c2 0 2.8 1 2.8 2.7v2.6c0 1.5.9 2.4 1.9 3.2-1 .8-1.9 1.7-1.9 3.2v2.6c0 1.7-.8 2.7-2.8 2.7" />
    </Svg>
  ),

  /* Gauge */
  "performance-engineering": (p) => (
    <Svg {...p}>
      <path d="M3.5 18a8.5 8.5 0 1 1 17 0" />
      <path d="m12 18 4-5.5" />
      <circle cx="12" cy="18" r="1.2" />
    </Svg>
  ),

  /* Package */
  "bundle-optimization": (p) => (
    <Svg {...p}>
      <path d="m12 3 8 4.5v9L12 21l-8-4.5v-9L12 3Z" />
      <path d="m4 7.5 8 4.5 8-4.5" />
      <path d="M12 12v9" />
    </Svg>
  ),

  /* Pen — styling */
  "css-architecture": (p) => (
    <Svg {...p}>
      <path d="M14.5 3.5 20.5 9.5 10 20H4v-6L14.5 3.5Z" />
      <path d="m12.5 5.5 6 6" />
    </Svg>
  ),

  /* Magnifier */
  seo: (p) => (
    <Svg {...p}>
      <circle cx="10.5" cy="10.5" r="6.5" />
      <path d="m20 20-4.6-4.6" />
    </Svg>
  ),

  /* Globe */
  internationalization: (p) => (
    <Svg {...p}>
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18" />
      <path d="M12 3a14 14 0 0 1 0 18a14 14 0 0 1 0-18Z" />
    </Svg>
  ),

  /* Alert triangle */
  "error-handling": (p) => (
    <Svg {...p}>
      <path d="M12 3.5 2.5 20h19L12 3.5Z" />
      <path d="M12 10v4.5" />
      <path d="M12 17.5h.01" />
    </Svg>
  ),

  /* Padlock */
  security: (p) => (
    <Svg {...p}>
      <rect x="4.5" y="10" width="15" height="10.5" rx="2" />
      <path d="M8 10V7a4 4 0 0 1 8 0v3" />
    </Svg>
  ),

  /* Rocket */
  "environment-deployment": (p) => (
    <Svg {...p}>
      <path d="M12 3c3 2.6 4.8 6.2 4.8 10.2L12 17.2l-4.8-4C7.2 9.2 9 5.6 12 3Z" />
      <circle cx="12" cy="10" r="1.6" />
      <path d="m8.5 16-2.5 5 4-1.8" />
      <path d="m15.5 16 2.5 5-4-1.8" />
    </Svg>
  ),

  /* Pulse line */
  observability: (p) => (
    <Svg {...p}>
      <path d="M2.5 12H7l2.5-7 4 14L16 12h5.5" />
    </Svg>
  ),

  /* Beaker */
  testing: (p) => (
    <Svg {...p}>
      <path d="M9 3h6" />
      <path d="M10 3v6L4.8 17.9A2 2 0 0 0 6.5 21h11a2 2 0 0 0 1.7-3.1L14 9V3" />
      <path d="M7.5 15h9" />
    </Svg>
  ),

  /* Folder tree */
  "code-organization": (p) => (
    <Svg {...p}>
      <path d="M3 4h5.5l1.5 2h4v5H3V4Z" />
      <path d="M7 11v7h4" />
      <path d="M13 15.5h8" />
      <path d="M13 20h8" />
    </Svg>
  ),

  /* Atom */
  "advanced-react": (p) => (
    <Svg {...p}>
      <circle cx="12" cy="12" r="2" />
      <ellipse cx="12" cy="12" rx="10" ry="4.5" />
      <ellipse cx="12" cy="12" rx="10" ry="4.5" transform="rotate(60 12 12)" />
      <ellipse cx="12" cy="12" rx="10" ry="4.5" transform="rotate(120 12 12)" />
    </Svg>
  ),

  /* Clock with an arrow — revalidation */
  "advanced-caching": (p) => (
    <Svg {...p}>
      <path d="M3.5 12a8.5 8.5 0 1 0 2.6-6.1" />
      <path d="M3.5 4v4h4" />
      <path d="M12 8v4.3l3 1.7" />
    </Svg>
  ),

  /* Distributed nodes */
  "large-scale-nextjs": (p) => (
    <Svg {...p}>
      <circle cx="12" cy="4.5" r="2" />
      <circle cx="5" cy="19" r="2" />
      <circle cx="19" cy="19" r="2" />
      <path d="M12 6.5v4" />
      <path d="M12 10.5 6 17.4" />
      <path d="m12 10.5 6 6.9" />
      <path d="M7 19h10" />
    </Svg>
  ),
};

/** Fallback for a chapter without a dedicated icon. */
function BookIcon(p: IconProps) {
  return (
    <Svg {...p}>
      <path d="M4 4.5h6a3 3 0 0 1 3 3V20a2.5 2.5 0 0 0-2.5-2.5H4V4.5Z" />
      <path d="M20 4.5h-6a3 3 0 0 0-3 3V20a2.5 2.5 0 0 1 2.5-2.5H20V4.5Z" />
    </Svg>
  );
}

export function ChapterIcon({
  slug,
  className,
}: {
  slug: string;
  className?: string;
}) {
  const Icon = icons[slug] ?? BookIcon;
  return <Icon className={className} />;
}
