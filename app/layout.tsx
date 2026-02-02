import type { Metadata } from "next";
import { Press_Start_2P } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";
import { SafariDetector } from "@/components/SafariDetector";

const pressStart2P = Press_Start_2P({
  weight: "400",
  variable: "--font-press-start-2p",
  subsets: ["latin"],
});

const serenityEmoji = localFont({
  src: "./fonts/SerenityOS-Emoji.ttf",
  variable: "--font-emoji",
});

export const metadata: Metadata = {
  title: "MasqaGrid",
  description: "Create and share logic puzzles",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${pressStart2P.variable} ${serenityEmoji.variable} antialiased`}>
      <body>
        <SafariDetector />
        {children}
      </body>
    </html>
  );
}
