import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-line px-6 md:px-14 py-12 bg-bg">
      <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-5">
        <div className="flex items-baseline gap-1"><span className="font-sans font-semibold text-[13px] tracking-[0.1em] text-green">AIFORM</span><span className="font-sans text-[13px] tracking-[0.1em] text-muted">/ STUDIO</span></div>
        <p className="font-display italic text-lg text-text/70 text-center">If something important is being trusted on assumption, we&apos;re interested.</p>
        <div className="flex gap-6 font-sans text-[13px] text-muted"><Link href="/contact" className="hover:text-green transition-colors">Contact</Link><a href="mailto:hello@aiformstudio.co.za" className="hover:text-green transition-colors">Email</a></div>
      </div>
      <div className="text-center font-sans text-[11px] text-muted/70 mt-10">© {new Date().getFullYear()} AiForm Studio</div>
    </footer>
  );
}
