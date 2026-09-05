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
  title: { default: "AiForm Studio | Websites, Business Systems & Automation", template: "%s | AiForm Studio" },
  description:
    "AiForm Studio builds websites, business systems, automation and digital tools around how businesses actually work. Based in Pretoria, South Africa.",
  alternates: { canonical: "/" },
  robots: { index: true, follow: true },
  openGraph: {
    type: "website",
    locale: "en_ZA",
    url: "/",
    siteName: "AiForm Studio",
    title: "AiForm Studio | Websites, Business Systems & Automation",
    description: "AiForm Studio builds websites, business systems, automation and digital tools around how businesses actually work. Based in Pretoria, South Africa.",
    images: [{ url: "/images/aiform-story.png", width: 1254, height: 1254, alt: "AiForm Studio logo and its moth-inspired design origins" }],
  },
  twitter: { card: "summary", title: "AiForm Studio | Websites, Business Systems & Automation", description: "AiForm Studio builds websites, business systems, automation and digital tools around how businesses actually work. Based in Pretoria, South Africa.", images: ["/images/aiform-story.png"] },
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
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": "https://aiformstudio.co.za/#organization",
    name: "AiForm Studio",
    legalName: "AiForm Studio (Pty) Ltd",
    url: "https://aiformstudio.co.za",
    logo: "https://aiformstudio.co.za/images/aiform-studio-icon-512.png",
    description: "Websites, business systems, automation and digital tools built around how your business works.",
    email: "aiformstudio@gmail.com",
    address: {
      "@type": "PostalAddress",
      streetAddress: "607 Fred Messenger Avenue, Andeon AH",
      addressLocality: "Pretoria",
      addressRegion: "Gauteng",
      postalCode: "0183",
      addressCountry: "ZA",
    },
    founder: {
      "@type": "Person",
      name: "TE Motaung",
      sameAs: [
        "https://www.linkedin.com/in/thabiso-eric-motaung/",
        "https://github.com/ThabisoEricMotaung",
      ],
    },
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Services",
      itemListElement: ["Websites", "Business Systems", "Automation & AI", "Digital Tools"].map((name) => ({
        "@type": "Offer",
        itemOffered: { "@type": "Service", name },
      })),
    },
  };

  return (
    <html
      lang="en"
      className={`${interTight.variable} ${geist.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-bg text-text">
        <script
          id="aiform-schema"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(structuredData).replace(/</g, "\\u003c"),
          }}
        />
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
