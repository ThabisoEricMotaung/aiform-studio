import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-panel-line px-6 md:px-12 py-10">
      <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="font-display font-bold text-sm text-text">
          AiForm<span className="text-cyan">Studio</span>
        </div>
        <p className="font-mono text-[11px] tracking-[0.05em] text-muted text-center">
          If something important is being trusted on assumption, we&apos;re interested.
        </p>
        <div className="flex gap-6 font-mono text-[11px] tracking-[0.08em] uppercase text-muted">
          <Link href="/contact" className="hover:text-cyan transition-colors">Contact</Link>
          <a href="mailto:hello@aiformstudio.co.za" className="hover:text-cyan transition-colors">Email</a>
        </div>
      </div>
      <div className="text-center font-mono text-[10px] text-muted/60 mt-8">
        © {new Date().getFullYear()} AiForm Studio
      </div>
    </footer>
  );
}
