export default function ProjectCard({
  name,
  tag,
  desc,
  status,
  href,
}: {
  name: string;
  tag: string;
  desc: string;
  status: string;
  href?: string;
}) {
  const Wrapper = href ? "a" : "div";
  const wrapperProps = href
    ? { href, target: "_blank", rel: "noopener noreferrer" }
    : {};

  return (
    <Wrapper
      {...wrapperProps}
      className={`blueprint-panel p-6 flex flex-col h-full ${
        href ? "hover:border-cyan transition-colors" : ""
      }`}
    >
      <div className="corner-tl" />
      <div className="corner-br" />
      <div className="font-mono text-[10px] tracking-[0.08em] uppercase text-cyan mb-2">
        {tag}
      </div>
      <h3 className="font-display font-semibold text-base text-text mb-2">
        {name}
      </h3>
      <p className="text-sm text-muted leading-relaxed mb-4 flex-1">{desc}</p>
      <div className="font-mono text-[10px] tracking-[0.05em] uppercase text-muted/70 border-t border-panel-line pt-3">
        {status}
      </div>
    </Wrapper>
  );
}
