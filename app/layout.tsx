import "./globals.css";
import type { Metadata } from "next";
import {
  Google_Sans_Flex,
  PT_Mono,
} from "next/font/google";
import localFont from "next/font/local";
import { ThemeProvider, LanguageProvider } from "@/components/providers";

/* ── Latin — Google Sans Flex. Carries every Latin glyph on the site:
   UI chrome, body copy and headings all come from this one variable face. */
const googleSans = Google_Sans_Flex({
  subsets: ["latin", "latin-ext"],
  variable: "--font-gsans",
  display: "swap",
});

/* ── Bengali — Anek Bangla, self-hosted so it can be metric-matched.

   Google Sans Flex has no Bengali glyphs, so every Bengali codepoint falls
   through to this face. Left alone the two look mismatched: Anek's x-height
   is 978/2000 against Google Sans Flex's 1020/2000, so Bengali renders about
   4% small on the same line. The descriptors below fix that: size-adjust
   scales Anek up to the same x-height (1020 / 978 = 104.3%), and the
   ascent/descent overrides give it the same line box, so a mixed line has one
   rhythm instead of two. */
const anekBangla = localFont({
  src: "./fonts/AnekBangla-Variable.woff2",
  weight: "100 800",
  style: "normal",
  variable: "--font-anek",
  display: "swap",
  declarations: [
    { prop: "size-adjust", value: "104.3%" },
    { prop: "ascent-override", value: "96.6%" },
    { prop: "descent-override", value: "28.6%" },
    { prop: "line-gap-override", value: "0%" },
    {
      prop: "unicode-range",
      value:
        "U+0951-0952, U+0964-0965, U+0980-09FE, U+1CD0, U+1CD2, U+1CD5-1CD6, U+1CD8, U+1CE1, U+1CEA, U+1CED, U+1CF2, U+1CF5-1CF7, U+200C-200D, U+20B9, U+25CC, U+A8F1",
    },
  ],
});

/* ── Mono — PT Mono, for code */
const ptMono = PT_Mono({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-pt-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "DevBook — একজন বাংলাদেশী ডেভেলপারের নোটবুক",
    template: "%s — DevBook",
  },
  description:
    "একজন বাংলাদেশী ডেভেলপারের ব্যক্তিগত নোটবুক। ওয়েব ডেভেলপমেন্ট, React, Next.js, TypeScript এবং সফটওয়্যার ক্রাফটসম্যানশিপ নিয়ে লেখা।",
  keywords: [
    "বাংলা প্রোগ্রামিং",
    "ওয়েব ডেভেলপমেন্ট",
    "React",
    "Next.js",
    "TypeScript",
    "বাংলাদেশ",
    "developer blog",
    "Bangla developer",
  ],
  authors: [{ name: "DevBook" }],
  creator: "DevBook",
  openGraph: {
    type: "website",
    locale: "bn_BD",
    siteName: "DevBook",
    title: "DevBook — একজন বাংলাদেশী ডেভেলপারের নোটবুক",
    description:
      "ওয়েব ডেভেলপমেন্ট, React, Next.js, TypeScript নিয়ে বাংলায় লেখা।",
  },
  twitter: {
    card: "summary_large_image",
    title: "DevBook — একজন বাংলাদেশী ডেভেলপারের নোটবুক",
    description: "ওয়েব ডেভেলপমেন্ট, React, Next.js, TypeScript নিয়ে বাংলায় লেখা।",
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="bn"
      className={[
        googleSans.variable,
        anekBangla.variable,
        ptMono.variable,
      ].join(" ")}
      suppressHydrationWarning
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('theme')||'system',r=document.documentElement;if(t==='dark'){r.classList.add('dark')}else if(t==='light'){r.classList.remove('dark')}else{if(window.matchMedia('(prefers-color-scheme: dark)').matches){r.classList.add('dark')}else{r.classList.remove('dark')}}}catch(e){}})();`,
          }}
        />
      </head>
      <body className="min-h-dvh flex flex-col" suppressHydrationWarning>
        <ThemeProvider>
          <LanguageProvider>
            <a
              href="#main-content"
              className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-p-surface focus:border focus:border-p-rule focus:rounded-md focus:text-p-ink focus:text-sm"
            >
              মূল বিষয়বস্তুতে যান
            </a>
            {children}
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
