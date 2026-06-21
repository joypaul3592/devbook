"use client";

import { Button } from "../button/Button";

export function NewsletterForm() {
  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    // TODO: connect to newsletter service
  }

  return (
    <form
      className="flex flex-col sm:flex-row gap-2.5 max-w-sm mx-auto"
      onSubmit={handleSubmit}
    >
      <input
        type="email"
        placeholder="আপনার ইমেইল ঠিকানা"
        className="flex-1 font-bengali text-sm bg-muted border border-border rounded-full px-4 py-2.5 text-nb-text placeholder:text-nb-subtle focus:outline-none focus:ring-2 focus:ring-nb-accent focus:border-transparent transition-all duration-200"
        aria-label="ইমেইল ঠিকানা"
        required
      />
      <Button type="submit" className="rounded-full px-6 h-10">
        সাবস্ক্রাইব
      </Button>
    </form>
  );
}
