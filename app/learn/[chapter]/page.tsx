import { notFound, redirect } from "next/navigation";
import { curriculum, getChapter } from "@/lib/curriculum";

export function generateStaticParams() {
  return curriculum.map((c) => ({ chapter: c.slug }));
}

/** A chapter is a grouping, not a page — send it to its first lesson. */
export default async function ChapterIndexPage({
  params,
}: {
  params: Promise<{ chapter: string }>;
}) {
  const { chapter } = await params;
  const found = getChapter(chapter);
  if (!found || found.topics.length === 0) notFound();

  redirect(`/learn/${found.slug}/${found.topics[0].slug}`);
}
