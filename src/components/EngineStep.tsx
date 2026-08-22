export default function EngineStep({
  number,
  title,
  desc,
  last = false,
}: {
  number: string;
  title: string;
  desc: string;
  last?: boolean;
}) {
  return (
    <div className="flex items-start gap-5">
      <div className="flex flex-col items-center">
        <div className="font-mono text-xs text-cyan border border-cyan/50 rounded-full w-9 h-9 flex items-center justify-center shrink-0">
          {number}
        </div>
        {!last && <div className="w-px flex-1 bg-panel-line mt-2 min-h-8" />}
      </div>
      <div className="pb-10">
        <h3 className="font-display font-semibold text-lg text-text mb-1.5">
          {title}
        </h3>
        <p className="text-sm text-muted leading-relaxed max-w-md">{desc}</p>
      </div>
    </div>
  );
}
