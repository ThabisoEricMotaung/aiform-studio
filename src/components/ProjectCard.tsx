export default function ProjectCard({ name, tag, desc, status, href, accent = "var(--color-green)" }: { name: string; tag: string; desc: string; status: string; href?: string; accent?: string }) {
  const Wrapper = href ? "a" : "div";
  const wrapperProps = href ? { href, target: "_blank", rel: "noopener noreferrer" } : {};
  return (
    <Wrapper {...wrapperProps} className={`bg-bg border border-line p-6 flex flex-col h-full ${href ? "hover:border-text/30 transition-colors" : ""}`} style={{ borderTopWidth: "3px", borderTopColor: accent }}>
      <div className="font-sans text-[11px] tracking-[0.06em] text-muted uppercase mb-3">{tag}</div>
      <h3 className="font-display text-2xl text-text mb-2 leading-tight">{name}</h3>
      <p className="font-sans text-sm text-muted leading-relaxed mb-5 flex-1">{desc}</p>
      <div className="font-sans text-[11px] text-muted/80 border-t border-line pt-3">{status}</div>
    </Wrapper>
  );
}
