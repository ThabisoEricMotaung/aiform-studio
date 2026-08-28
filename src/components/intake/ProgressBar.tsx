const STEP_LABELS = ["Problem", "Context", "Outcome", "Stage", "Details", "Contact"];

export default function ProgressBar({ step, total }: { step: number; total: number }) {
  const percent = ((step + 1) / total) * 100;

  return (
    <div className="intake-progress">
      <div className="intake-progress-labels hidden sm:flex" aria-hidden="true">
        {STEP_LABELS.map((label, index) => (
          <span key={label} data-active={index === step}>
            {label}
          </span>
        ))}
      </div>
      <div className="intake-progress-track">
        <div className="intake-progress-fill" style={{ width: `${percent}%` }} />
      </div>
      <p className="chapter-label" aria-hidden="true">
        {String(step + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
      </p>
    </div>
  );
}
