import type { ComponentType } from "react";
import type { Bi } from "@/lib/curriculum";
import AppRouterArchitecture, {
  headings as appRouterHeadings,
} from "./app-router-architecture";

export interface ChapterHeading {
  id: string;
  label: Bi;
}

export interface LessonCover {
  src: string;
  alt: Bi;
  width: number;
  height: number;
}

export interface LessonContent {
  Body: ComponentType;
  headings: ChapterHeading[];
  /** Optional image shown between the lesson header and its first paragraph. */
  cover?: LessonCover;
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
    cover: {
      src: "/blogs-images/topic1.png",
      alt: {
        bn: "App Router আর্কিটেকচার",
        en: "App Router architecture",
      },
      width: 1693,
      height: 929,
    },
  },
};
