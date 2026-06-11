import { cn } from "@/lib/utils";
import { formatDate } from "@/lib/data";
import type { JournalEntry } from "@/lib/types";

const typeConfig: Record<JournalEntry["type"], { label: string; dotClass: string; pillClass: string }> = {
  thought: { label: "চিন্তা", dotClass: "bg-p-indigo", pillClass: "text-p-indigo bg-p-indigo-soft" },
  discovery: { label: "আবিষ্কার", dotClass: "bg-p-green", pillClass: "text-p-green bg-p-green-soft" },
  build: { label: "তৈরি", dotClass: "bg-p-rose", pillClass: "text-p-rose bg-[rgba(155,107,114,0.08)]" },
  experiment: { label: "পরীক্ষা", dotClass: "bg-amber-500 dark:bg-amber-400", pillClass: "text-amber-600 dark:text-amber-400 bg-amber-500/10" },
  note: { label: "নোট", dotClass: "bg-p-ink-4", pillClass: "text-p-ink-3 bg-p-surface-2" },
};

export function JournalEntryCard({ entry }: { entry: JournalEntry }) {
  const config = typeConfig[entry.type];

  return (
    <div className="flex gap-4 group">
      {/* Timeline dot + line */}
      <div className="flex flex-col items-center pt-1 shrink-0">
        <span className={cn("w-2 h-2 rounded-full shrink-0", config.dotClass, "opacity-70")} />
        <span className="w-px flex-1 bg-p-rule mt-1.5 group-last:hidden" />
      </div>

      {/* Content */}
      <div className="flex-1 pb-7">
        <div className="flex items-center gap-2 mb-2.5">
          <span className={cn("font-ui text-[10px] px-2 py-0.5 rounded-full tracking-wide", config.pillClass)}>
            {config.label}
          </span>
          <span className="p-ts">{formatDate(entry.date)}</span>
        </div>

        <p className="font-bengali text-[0.875rem] text-p-ink leading-[1.75]">
          {entry.content}
        </p>

        {entry.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-3">
            {entry.tags.map((tag) => (
              <span
                key={tag}
                className="font-ui text-[10px] text-p-ink-3 bg-p-surface-2 border border-p-rule-2 px-2 py-0.5 rounded-full"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
