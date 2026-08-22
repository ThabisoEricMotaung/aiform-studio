import type { Metadata } from "next";
import { Instrument_Serif, Geist } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const instrumentSerif = Instrument_Serif({ variable: "--font-instrument-serif", subsets: ["latin"], weight: ["400"], style: ["normal", "italic"] });
const geist = Geist({ variable: "--font-geist", subsets: ["latin"], weight: ["400", "500", "600"] });

export const metadata: Metadata = {
  title: "AiForm Studio | Noticed, Not Invented",
  description: "A studio that notices real problems before deciding what technology they need. We build where assumption becomes expensive.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${instrumentSerif.variable} ${geist.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-bg text-text"><Header /><main className="flex-1">{children}</main><Footer /></body>
    </html>
  );
}
