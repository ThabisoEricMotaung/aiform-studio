import type { Metadata } from "next";
import ProjectShowcase from "@/components/ProjectShowcase";
export const metadata: Metadata = {
  title: "Work",
  description: "Selected websites, systems, products and digital experiments built by AiForm Studio. Custom solutions designed around real business workflows.",
  alternates: { canonical: "/work" },
  openGraph: {
    type: "website",
    locale: "en_ZA",
    url: "https://aiformstudio.co.za/work",
    siteName: "AiForm Studio",
    title: "Work | AiForm Studio",
    description: "Selected websites, systems, products and digital experiments built by AiForm Studio. Custom solutions designed around real business workflows.",
    images: [{ url: "https://aiformstudio.co.za/images/aiform-story.png", width: 1254, height: 1254, alt: "AiForm Studio logo and its moth-inspired design origins" }],
  },
  twitter: {
    card: "summary",
    title: "Work | AiForm Studio",
    description: "Selected websites, systems, products and digital experiments built by AiForm Studio.",
    images: ["https://aiformstudio.co.za/images/aiform-story.png"],
  },
};
export default function WorkPage() { return <><section className="editorial-grid py-16 md:py-24"><p className="col-span-12 chapter-label md:col-span-2">Work</p><div className="col-span-12 mt-9 md:col-start-3 md:col-span-8 md:mt-0"><h1 className="hero-title font-display">Built around<br /><span className="text-green">real work.</span></h1><p className="mt-8 max-w-2xl text-lg leading-relaxed text-muted">Systems commissioned by clients, products developed by AiForm, and experiments that test what might be useful next.</p></div></section><ProjectShowcase /></>; }
