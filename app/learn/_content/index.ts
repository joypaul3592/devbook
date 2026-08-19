import type { ComponentType } from "react";
import type { Bi } from "@/lib/curriculum";
import AppRouterArchitecture, {
  headings as appRouterHeadings,
} from "./app-router-architecture";

export interface ChapterHeading {
  id: string;
  label: Bi;
}

export interface LessonContent {
  Body: ComponentType;
  headings: ChapterHeading[];
}

/**
 * `chapterSlug/topicSlug` → the written lesson.
 * Adding an entry here also needs the same key added to `WRITTEN`
 * in `lib/curriculum.ts` so the sidebar stops showing "শীঘ্রই".
 */
export const lessonContent: Record<string, LessonContent> = {
  "nextjs-architecture-rendering/app-router-architecture": {
    Body: AppRouterArchitecture,
    headings: appRouterHeadings,
  },
};
