import type { Metadata } from "next";
import "./globals.css";
import React from 'react';
import { LanguageProvider } from "@/context/LanguageContext";
import { Analytics } from "@vercel/analytics/next"

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "LingoGames | Daily Language Challenges",
    template: "%s | LingoGames",
  },
  description: "Master languages with daily Wordle, Crossword and Connections.",
  keywords: [
    "lingo",
    "lingogames",
    "wordle",
    "crossword",
    "connections",
    "language learning",
    "daily puzzles",
  ],
  authors: [{ name: "LingoGames" }],
  applicationName: "LingoGames",
  openGraph: {
    type: "website",
    url: "/",
    title: "LingoGames | Daily Language Puzzles",
    description: "Practice English, Spanish, French, and more with daily Wordle, Crossword and Connections puzzles.",
    siteName: "LingoGames",
    images: [
      {
        url: "/opengraph-image.png",
        width: 1200,
        height: 630,
        alt: "LingoGames - Play Daily Language Games",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "LingoGames | Daily Language Puzzles",
    description: "Daily brain training for language learners. Wordle, Crossword and Connections.",
    images: ["/opengraph-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
    },
  },
  alternates: {
    canonical: "/",
    languages: {
      'en': '/?lang=en',
      'es': '/?lang=es',
      'fr': '/?lang=fr',
      'de': '/?lang=de',
      'it': '/?lang=it',
      'pt-BR': '/?lang=pt-BR',
      'pt-PT': '/?lang=pt-PT',
    },
  },
  icons: {
    icon: [
      { url: "/icon.png", type: "image/png" },
    ],
  },
  manifest: "/manifest.webmanifest",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "LingoGames",
    "url": siteUrl,
    "description": "Daily language challenges: Wordle, Crossword and Connections.",
    "applicationCategory": "GameApplication, EducationalApplication",
    "operatingSystem": "All",
    "author": {
      "@type": "Organization",
      "name": "LingoGames"
    },
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    }
  };

  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body>
        <React.Suspense fallback={null}>
          <LanguageProvider>
            <div className="min-h-screen flex flex-col">
              {children}
              <Analytics />
            </div>
          </LanguageProvider>
        </React.Suspense>
      </body>
    </html>
  );
}
