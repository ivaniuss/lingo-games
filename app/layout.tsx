import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "LingoGames | Daily Language Challenges",
  description: "Master languages with daily Wordle, Grids, and more.",
};

import { LanguageProvider } from "@/context/LanguageContext";

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
