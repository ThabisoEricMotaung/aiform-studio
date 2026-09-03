"use client";

import { useState } from "react";

const steps: [string, string][] = [
  ["Discover", "A current feed of public tenders and RFQs, linked back to original sources."],
  ["Prepare", "Supplier profiles bring compliance evidence and readiness information into one place."],
  ["Assess", "SmartScore makes evidence-based supplier readiness easier to inspect."],
  ["Connect", "Buyer and supplier workflows support RFQs, matching and quote comparison."],
];

export default function ProcureFlow() {
  const [active, setActive] = useState(0);

  return (
    <div className="procure-flow">
      <div className="procure-flow-nodes" role="tablist" aria-label="AiForm Procure product flow">
        {steps.map(([title], index) => (
          <button
            key={title}
            type="button"
            role="tab"
            aria-selected={active === index}
            className={`procure-flow-node ${active === index ? "procure-flow-node-active" : ""}`}
            onClick={() => setActive(index)}
          >
            <span className="procure-flow-node-index">0{index + 1}</span>
            <span className="procure-flow-node-title">{title}</span>
          </button>
        ))}
      </div>
      <div className="procure-flow-panel" role="tabpanel">
        <p className="chapter-label">0{active + 1} / {steps[active][0]}</p>
        <p className="mt-4 max-w-2xl text-lg leading-relaxed text-muted">{steps[active][1]}</p>
      </div>
    </div>
  );
}
