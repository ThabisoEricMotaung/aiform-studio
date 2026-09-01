import type { Metadata } from "next";
import { Geist, Inter_Tight } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const geist = Geist({
  variable: "--font-geist",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});
const interTight = Inter_Tight({
  variable: "--font-inter-tight",
  subsets: ["latin"],
  weight: ["600", "700"],
  style: ["normal"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://aiformstudio.co.za"),
  title: { default: "AiForm Studio | Websites, systems and digital tools", template: "%s | AiForm Studio" },
  description:
    "Websites, business systems and digital products built around how your organisation actually works. Founder-led in Pretoria, South Africa.",
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "en_ZA",
    url: "/",
    siteName: "AiForm Studio",
    title: "AiForm Studio | Websites, systems and digital tools",
    description: "Websites, business systems and digital products built around how your organisation actually works.",
    images: [{ url: "/images/aiform-story.png", width: 1200, height: 630, alt: "AiForm Studio — Noticed, not invented" }],
  },
  twitter: { card: "summary_large_image", title: "AiForm Studio | Websites, systems and digital tools", description: "Websites, business systems and digital products built around how your organisation actually works.", images: ["/images/aiform-story.png"] },
  icons: {
    icon: [
      {
        url: "/images/aiform-studio-icon-16.png",
        type: "image/png",
        sizes: "16x16",
      },
      {
        url: "/images/aiform-studio-icon-32.png",
        type: "image/png",
        sizes: "32x32",
      },
      {
        url: "/images/aiform-studio-icon-48.png",
        type: "image/png",
        sizes: "48x48",
      },
      {
        url: "/images/aiform-studio-icon-192.png",
        type: "image/png",
        sizes: "192x192",
      },
      {
        url: "/images/aiform-studio-icon-512.png",
        type: "image/png",
        sizes: "512x512",
      },
    ],
    shortcut: [
      {
        url: "/images/aiform-studio-icon-32.png",
        type: "image/png",
        sizes: "32x32",
      },
    ],
    apple: [
      {
        url: "/images/aiform-studio-icon-180.png",
        type: "image/png",
        sizes: "180x180",
      },
    ],
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${interTight.variable} ${geist.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-bg text-text">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
