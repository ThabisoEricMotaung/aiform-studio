type IconProps = { className?: string };

const base = {
  viewBox: "0 0 24 24",
  fill: "none" as const,
  stroke: "currentColor",
  strokeWidth: 1.5,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

// Repeating cycle — manual, repetitive work.
export function IconRepeat(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M4 12a8 8 0 0 1 13.5-5.5L20 9" />
      <path d="M20 5v4h-4" />
      <path d="M20 12a8 8 0 0 1-13.5 5.5L4 15" />
      <path d="M4 19v-4h4" />
    </svg>
  );
}

// A few loose, unconnected points — scattered information.
export function IconScattered(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <circle cx="6" cy="7" r="1.4" fill="currentColor" stroke="none" />
      <circle cx="17" cy="6" r="1.4" fill="currentColor" stroke="none" />
      <circle cx="14" cy="14" r="1.4" fill="currentColor" stroke="none" />
      <circle cx="5" cy="17" r="1.4" fill="currentColor" stroke="none" />
      <circle cx="19" cy="17" r="1.4" fill="currentColor" stroke="none" />
    </svg>
  );
}

// A simple grid/table — spreadsheets and chat-style rows.
export function IconTable(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <rect x="3.5" y="4.5" width="17" height="15" rx="1.5" />
      <path d="M3.5 9.5h17" />
      <path d="M3.5 14.5h17" />
      <path d="M9.5 4.5v15" />
    </svg>
  );
}

// A person with a small unresolved mark — customer friction.
export function IconPersonAlert(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <circle cx="10" cy="7.5" r="3" />
      <path d="M4.5 19c0-3.3 2.5-5.5 5.5-5.5" />
      <path d="M17.5 10.5v3.5" />
      <circle cx="17.5" cy="17" r="0.75" fill="currentColor" stroke="none" />
    </svg>
  );
}

// A cracked/broken square — a system that isn't working.
export function IconBroken(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M4.5 4.5h7v4.2L9 12l2.5 3.3v4.2h-7z" />
      <path d="M19.5 4.5h-7v4.2L15 12l-2.5 3.3v4.2h7z" />
    </svg>
  );
}

// An empty dashed box — nothing built yet.
export function IconEmptyBox(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <rect x="4" y="4" width="16" height="16" rx="2" strokeDasharray="3.2 3.2" />
    </svg>
  );
}

// A clock — something taking too much time.
export function IconClock(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <circle cx="12" cy="12" r="8" />
      <path d="M12 7.5V12l3 2" />
    </svg>
  );
}

// A magnifier with a check — tracking or verifying something.
export function IconVerify(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <circle cx="10.5" cy="10.5" r="6" />
      <path d="M8 10.5l1.8 1.8L13.5 8" />
      <path d="M15 15l5 5" />
    </svg>
  );
}

// Three dots — an open-ended "something else".
export function IconOther(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <circle cx="6" cy="12" r="1.2" fill="currentColor" stroke="none" />
      <circle cx="12" cy="12" r="1.2" fill="currentColor" stroke="none" />
      <circle cx="18" cy="12" r="1.2" fill="currentColor" stroke="none" />
    </svg>
  );
}

// A browser window — a website.
export function IconBrowser(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <rect x="3.5" y="4.5" width="17" height="15" rx="1.5" />
      <path d="M3.5 8.5h17" />
      <circle cx="6" cy="6.5" r="0.6" fill="currentColor" stroke="none" />
    </svg>
  );
}

// A simple app grid — a system or tool.
export function IconGrid(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <rect x="4" y="4" width="7" height="7" rx="1.2" />
      <rect x="13" y="4" width="7" height="7" rx="1.2" />
      <rect x="4" y="13" width="7" height="7" rx="1.2" />
      <rect x="13" y="13" width="7" height="7" rx="1.2" />
    </svg>
  );
}

// A flow with a friction point — a process problem.
export function IconFlow(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <circle cx="5" cy="12" r="2" />
      <circle cx="19" cy="12" r="2" />
      <path d="M7 12h4" />
      <path d="M13 12h4" strokeDasharray="1.5 2.2" />
    </svg>
  );
}

// Connected nodes with a bolt — automation.
export function IconAutomate(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <circle cx="5.5" cy="6" r="1.6" />
      <circle cx="18.5" cy="6" r="1.6" />
      <circle cx="12" cy="18" r="1.6" />
      <path d="M6.9 7.1 11 16.6" />
      <path d="M17.1 7.1 13 16.6" />
      <path d="M7.1 6h9.8" />
    </svg>
  );
}

// An upward arrow inside motion lines — improving something existing.
export function IconImprove(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M5 16 10 11l3 3 6-6" />
      <path d="M15 8h4v4" />
    </svg>
  );
}

// A simple lightbulb — an idea being explored.
export function IconIdea(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M9 17h6" />
      <path d="M10 20h4" />
      <path d="M12 4a5.5 5.5 0 0 0-3 10.1c.6.4 1 1 1 1.9h4c0-.9.4-1.5 1-1.9A5.5 5.5 0 0 0 12 4z" />
    </svg>
  );
}

// Two overlapping circles — collaboration.
export function IconCollaborate(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <circle cx="9" cy="12" r="5.5" />
      <circle cx="15" cy="12" r="5.5" />
    </svg>
  );
}

// A question mark inside a circle — not sure yet.
export function IconUnsure(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M9.8 9.6a2.2 2.2 0 1 1 3.4 1.9c-.8.5-1.2 1-1.2 1.9" />
      <circle cx="12" cy="16.3" r="0.6" fill="currentColor" stroke="none" />
    </svg>
  );
}

// A small filled check — the selection indicator.
export function IconCheck(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M5 13l4.5 4.5L19 7" />
    </svg>
  );
}
