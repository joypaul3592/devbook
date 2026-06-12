import "./globals.css";
import type { Metadata } from "next";
import {
  Inter,
  Plus_Jakarta_Sans,
  Instrument_Serif,
  Noto_Sans_Bengali,
  PT_Mono,
  Hind_Siliguri,
} from "next/font/google";
import { ThemeProvider, LanguageProvider } from "@/components/providers";

/* ── Primary site font — Hind Siliguri (Bengali + Latin) */
const hindSiliguri = Hind_Siliguri({
  subsets: ["bengali", "latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-hind",
  display: "swap",
});

/* ── UI font — Elegant (closest to Google Sans) */
const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-jakarta",
  display: "swap",
});

/* ── Fallback UI */
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

/* ── Display / Editorial headings — Instrument Serif */
const instrumentSerif = Instrument_Serif({
  subsets: ["latin"],
  weight: ["400"],
  style: ["normal", "italic"],
  variable: "--font-serif-var",
  display: "swap",
});

/* ── Bengali — Noto Sans Bengali */
const notoSansBengali = Noto_Sans_Bengali({
  subsets: ["bengali"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-bengali-var",
  display: "swap",
});

/* ── Mono — PT Mono (Paper Design) */
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
        hindSiliguri.variable,
        jakarta.variable,
        inter.variable,
        instrumentSerif.variable,
        notoSansBengali.variable,
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
