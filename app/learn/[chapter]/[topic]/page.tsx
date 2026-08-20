import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getLesson, lessons } from "@/lib/curriculum";
import { lessonContent } from "@/app/learn/_content";
import { LessonComingSoon, LessonView } from "@/components/learn/LessonView";

type Params = Promise<{ chapter: string; topic: string }>;

export function generateStaticParams() {
  return lessons.map(({ chapter, topic }) => ({
    chapter: chapter.slug,
    topic: topic.slug,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const { chapter, topic } = await params;
  const lesson = getLesson(chapter, topic);
  if (!lesson) return {};
  return {
    title: lesson.topic.title.bn,
    description: `${lesson.chapter.no} — ${lesson.chapter.title.bn}`,
  };
}

export default async function LessonPage({ params }: { params: Params }) {
  const { chapter, topic } = await params;
  if (!getLesson(chapter, topic)) notFound();

  const entry = lessonContent[`${chapter}/${topic}`];

  return (
    <LessonView
      chapterSlug={chapter}
      topicSlug={topic}
      headings={entry?.headings ?? []}
      cover={entry?.cover}
    >
      {entry ? (
        <entry.Body />
      ) : (
        <LessonComingSoon chapterSlug={chapter} topicSlug={topic} />
      )}
    </LessonView>
  );
}
