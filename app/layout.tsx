import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Toaster } from "@/hangry/components/toast";
import PageTransition from "@/components/layout/page-transition";
import { pageMetadata, siteDescription, siteUrl } from "@/lib/seo";
import "./globals.css";
import Script from "next/script";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});



export const metadata: Metadata = {
  ...pageMetadata("/", "React UI Components & vgpu Shaders", siteDescription),
  metadataBase: new URL(siteUrl),
  title: {
    default: "React UI Components & vgpu Shaders | Hangry UI",
    template: "%s | Hangry UI",
  },
  verification: { google: process.env.GOOGLE_SITE_VERIFICATION },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} dark h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans">
        <Script
          id="theme-toggle"
          dangerouslySetInnerHTML={{
            __html: `try { document.documentElement.classList.toggle('dark', localStorage.getItem('theme') !== 'light'); } catch {}`,
          }}
        />
        <PageTransition>{children}</PageTransition>
        <Toaster />
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
