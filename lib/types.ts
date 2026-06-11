export interface Article {
  slug: string;
  title: string;
  titleEn: string;
  excerpt: string;
  content?: string;
  category: string;
  categorySlug: string;
  tags: string[];
  publishedAt: string;
  readingTime: number;
  coverGradient: string;
  featured: boolean;
  series?: string;
  seriesSlug?: string;
  seriesPart?: number;
}

export interface Category {
  slug: string;
  name: string;
  nameEn: string;
  description: string;
  count: number;
  gradient: string;
}

export interface JournalEntry {
  id: string;
  date: string;
  content: string;
  tags: string[];
  type: "thought" | "discovery" | "build" | "experiment" | "note";
}

export interface Series {
  slug: string;
  title: string;
  titleEn: string;
  description: string;
  parts: SeriesPart[];
  gradient: string;
  totalParts: number;
}

export interface SeriesPart {
  part: number;
  title: string;
  slug: string;
  published: boolean;
}

export interface Project {
  slug: string;
  name: string;
  description: string;
  tech: string[];
  url?: string;
  github?: string;
  status: "active" | "archived" | "wip";
  year: number;
  gradient: string;
}
