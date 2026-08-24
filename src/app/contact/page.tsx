import type { Metadata } from "next";

export const metadata: Metadata = { title: "Contact | AiForm Studio" };

export default function Contact() {
  return (
    <section className="px-6 py-20 md:py-28 min-h-[70vh]">
      <div className="max-w-5xl mx-auto grid md:grid-cols-[1.2fr_0.8fr] gap-16">
        <div><p className="chapter-label mb-7">Contact / Start a project</p><h1 className="font-display text-5xl md:text-7xl leading-[0.98]">Tell us what&apos;s being trusted <em className="text-green">on assumption.</em></h1><p className="text-muted leading-relaxed mt-8 max-w-xl">Whether it&apos;s a new product, a messy internal process, or a website that needs building properly — get in touch.</p></div>
        <div className="md:border-l border-line md:pl-12 flex flex-col justify-center"><div className="rule-gold mb-8" /><p className="chapter-label mb-3">Email</p><div className="flex flex-col items-start gap-2"><a href="mailto:hello@aiformstudio.co.za" className="font-display text-2xl md:text-3xl hover:text-green transition-colors break-all">hello@aiformstudio.co.za</a><a href="mailto:aiformstudio@gmail.com" className="font-display text-xl md:text-2xl text-muted hover:text-green transition-colors break-all">aiformstudio@gmail.com</a></div><div className="border-t border-line mt-9 pt-7"><p className="chapter-label mb-3">Based in</p><p className="text-muted">Pretoria, South Africa</p></div><p className="font-display text-xl text-muted mt-12">The best conversations begin with the problem, not the proposed technology.</p></div>
      </div>
    </section>
  );
}
