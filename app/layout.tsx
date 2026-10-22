import type { Metadata } from "next";
import { Geist } from "next/font/google";
import localFont from "next/font/local";
import ConsentBanner from "@/components/ConsentBanner";
import { pageMetadata, siteDescription, siteUrl } from "@/lib/seo";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const paperMono = localFont({
  src: "../public/paper-mono/PaperMono.woff2",
  variable: "--font-paper-mono",
  weight: "100 800",
  display: "swap",
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
      className={`${geistSans.variable} ${paperMono.variable} dark h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans">
        {children}
        <ConsentBanner />
      </body>
    </html>
  );
}
