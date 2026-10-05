import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Navbar from "@/components/Navbar";
import ConsentBanner from "@/components/ConsentBanner";
import { pageMetadata, siteDescription, siteUrl } from "@/lib/seo";
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
  ...pageMetadata("/", "React Components, Blocks & Shaders", siteDescription),
  metadataBase: new URL(siteUrl),
  title: {
    default: "React Components, Blocks & Shaders | Hangry UI",
    template: "%s | Hangry UI",
  },
  verification: { google: process.env.GOOGLE_SITE_VERIFICATION },
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
        <ConsentBanner />
      </body>
    </html>
  );
}
