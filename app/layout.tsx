import type { Metadata } from "next";
import "./globals.css";
import { LanguageProvider } from "@/context/LanguageContext";

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
    title: "LingoGames | Daily Language Challenges",
    description: "Practice languages with fun daily games: Wordle, Crossword and Connections.",
    siteName: "LingoGames",
    images: [
      {
        url: "/opengraph-image.png",
        width: 1200,
        height: 630,
        alt: "LingoGames OG Image",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "LingoGames | Daily Language Challenges",
    description: "Practice languages with fun daily games: Wordle, Crossword and Connections.",
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
  },
  icons: {
    icon: [
      { url: "/icon.svg", type: "image/svg+xml" },
    ],
  },
  manifest: "/manifest.webmanifest",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <LanguageProvider>
          <div className="min-h-screen flex flex-col">
            {children}
          </div>
        </LanguageProvider>
      </body>
    </html>
  );
}
