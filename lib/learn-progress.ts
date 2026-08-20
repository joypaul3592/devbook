"use client";

import { useCallback, useEffect, useState } from "react";
import { lessons } from "./curriculum";

const KEY = "devbook:learn:progress";
/** Fired on the same tab when progress changes — `storage` only fires cross-tab. */
const EVENT = "devbook:learn:progress-change";

/** A lesson id is "chapterSlug/topicSlug" — the same shape used in the url. */
export type LessonId = string;

export interface Progress {
  /** Lessons the reader marked as finished. */
  done: LessonId[];
  /** The last lesson opened, so the index can offer "continue". */
  last?: LessonId;
}

const EMPTY: Progress = { done: [] };

function read(): Progress {
  if (typeof window === "undefined") return EMPTY;
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return EMPTY;
    const parsed = JSON.parse(raw) as Partial<Progress>;
    return {
      done: Array.isArray(parsed.done) ? parsed.done.filter((x) => typeof x === "string") : [],
      last: typeof parsed.last === "string" ? parsed.last : undefined,
    };
  } catch {
    return EMPTY;
  }
}

function write(next: Progress) {
  try {
    window.localStorage.setItem(KEY, JSON.stringify(next));
  } catch {
    /* private mode / quota — progress is a nicety, never a hard failure */
  }
  window.dispatchEvent(new Event(EVENT));
}

/**
 * Reader progress, kept in localStorage.
 *
 * `ready` stays false until the first client read so server and client render
 * the same markup — flipping to true afterwards fills in the real numbers.
 */
export function useLearnProgress() {
  const [state, setState] = useState<Progress>(EMPTY);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const sync = () => setState(read());
    sync();
    setReady(true);
    window.addEventListener(EVENT, sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener(EVENT, sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  const isDone = useCallback(
    (id: LessonId) => state.done.includes(id),
    [state.done],
  );

  const toggleDone = useCallback((id: LessonId) => {
    const current = read();
    const done = current.done.includes(id)
      ? current.done.filter((x) => x !== id)
      : [...current.done, id];
    write({ ...current, done });
  }, []);

  const visit = useCallback((id: LessonId) => {
    const current = read();
    if (current.last === id) return;
    write({ ...current, last: id });
  }, []);

  const reset = useCallback(() => write(EMPTY), []);

  return { ...state, ready, isDone, toggleDone, visit, reset };
}

/** Marks a lesson as the most recently opened one. */
export function useVisitLesson(id: LessonId) {
  useEffect(() => {
    const current = read();
    if (current.last === id) return;
    write({ ...current, last: id });
  }, [id]);
}

export function lessonId(chapterSlug: string, topicSlug: string): LessonId {
  return `${chapterSlug}/${topicSlug}`;
}

/** The first lesson the reader has not finished — where "continue" should point. */
export function nextUnfinished(done: LessonId[]) {
  const set = new Set(done);
  return (
    lessons.find((l) => !set.has(lessonId(l.chapter.slug, l.topic.slug))) ??
    lessons[0]
  );
}

/** Reader rank, derived from how much of the atlas is finished. */
export const RANKS = [
  { min: 0, bn: "নবীন", en: "Explorer" },
  { min: 10, bn: "শিক্ষানবিশ", en: "Apprentice" },
  { min: 30, bn: "নির্মাতা", en: "Builder" },
  { min: 60, bn: "প্রকৌশলী", en: "Engineer" },
  { min: 85, bn: "স্থপতি", en: "Architect" },
] as const;

export function rankFor(percent: number) {
  return [...RANKS].reverse().find((r) => percent >= r.min) ?? RANKS[0];
}
