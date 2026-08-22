export const metadata = { title: "Contact | AiForm Studio" };

export default function Contact() {
  return (
    <section className="blueprint-grid px-6 py-24 min-h-[70vh]">
      <div className="max-w-xl mx-auto text-center">
        <div className="font-mono text-[11px] tracking-[0.2em] uppercase text-cyan mb-5">
          Contact
        </div>
        <h1 className="font-display font-bold text-3xl md:text-[42px] leading-tight mb-6">
          Tell us what&apos;s being trusted on assumption.
        </h1>
        <p className="text-muted leading-relaxed mb-14">
          Whether it&apos;s a new product, a messy internal process, or a
          website that needs building properly — get in touch.
        </p>

        <div className="grid sm:grid-cols-2 gap-4 text-left">
          <a
            href="mailto:hello@aiformstudio.co.za"
            className="blueprint-panel p-6 hover:border-cyan transition-colors"
          >
            <div className="corner-tl" />
            <div className="corner-br" />
            <div className="font-mono text-[11px] tracking-[0.1em] uppercase text-cyan mb-2">
              Email
            </div>
            <div className="text-sm text-text">hello@aiformstudio.co.za</div>
          </a>
          <div className="blueprint-panel p-6">
            <div className="corner-tl" />
            <div className="corner-br" />
            <div className="font-mono text-[11px] tracking-[0.1em] uppercase text-cyan mb-2">
              Based in
            </div>
            <div className="text-sm text-text">Pretoria, South Africa</div>
          </div>
        </div>
      </div>
    </section>
  );
}
