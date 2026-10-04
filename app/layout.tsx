import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Navbar from "@/components/Navbar";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Hangry UI - Reusable React Components with Tailwind CSS & shadcn/ui",
    template: "%s | Hangry UI",
  },
  description:
    "Explore a collection of high-quality, reusable React components built with Tailwind CSS and powered by shadcn/ui. Enhance your web development with modern, accessible, and customizable UI elements for your projects.",
  openGraph: {
    title: "Hangry UI - Reusable React Components with Tailwind CSS & shadcn/ui",
    description:
      "Explore a collection of high-quality, reusable React components built with Tailwind CSS and powered by shadcn/ui. ",
    url: "ui.razeev.com",
    siteName: "Hangry UI",
    locale: "en_UK",
    type: "website",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} dark h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <Navbar />
        {children}
      </body>
    </html>
  );
}
