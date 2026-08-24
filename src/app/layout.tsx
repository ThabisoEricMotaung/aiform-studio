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
  title: "AiForm Studio | Noticed, Not Invented",
  description:
    "A studio that notices real problems before deciding what technology they need. We build where assumption becomes expensive.",
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
