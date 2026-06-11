"use client";

export function ContactForm() {
  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    // TODO: connect to form submission service
  }

  return (
    <form className="space-y-5" onSubmit={handleSubmit}>
      <div>
        <label className="font-bengali text-sm text-nb-muted block mb-2" htmlFor="contact-name">
          আপনার নাম
        </label>
        <input
          id="contact-name"
          type="text"
          placeholder="রাহেলা আক্তার"
          className="w-full font-bengali text-sm bg-nb-surface border border-nb-border rounded-lg px-4 py-2.5 text-nb-text placeholder:text-nb-subtle focus:outline-none focus:ring-2 focus:ring-nb-accent focus:border-transparent transition-all"
        />
      </div>
      <div>
        <label className="font-bengali text-sm text-nb-muted block mb-2" htmlFor="contact-email">
          ইমেইল ঠিকানা
        </label>
        <input
          id="contact-email"
          type="email"
          placeholder="rahela@example.com"
          className="w-full font-sans text-sm bg-nb-surface border border-nb-border rounded-lg px-4 py-2.5 text-nb-text placeholder:text-nb-subtle focus:outline-none focus:ring-2 focus:ring-nb-accent focus:border-transparent transition-all"
        />
      </div>
      <div>
        <label className="font-bengali text-sm text-nb-muted block mb-2" htmlFor="contact-message">
          বার্তা
        </label>
        <textarea
          id="contact-message"
          rows={5}
          placeholder="আপনার ভাবনা লিখুন..."
          className="w-full font-bengali text-sm bg-nb-surface border border-nb-border rounded-lg px-4 py-2.5 text-nb-text placeholder:text-nb-subtle focus:outline-none focus:ring-2 focus:ring-nb-accent focus:border-transparent transition-all resize-none"
        />
      </div>
      <button
        type="submit"
        className="font-bengali text-sm bg-nb-text text-nb-bg rounded-full px-6 py-2.5 hover:bg-nb-accent hover:text-nb-accent-fg transition-colors duration-200"
      >
        পাঠান
      </button>
    </form>
  );
}
