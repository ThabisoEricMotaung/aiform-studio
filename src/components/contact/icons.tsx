type IconProps = { className?: string };

const base = {
  viewBox: "0 0 24 24",
  fill: "none" as const,
  stroke: "currentColor",
  strokeWidth: 1.5,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

export function IconCalendar(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <rect x="4" y="5.5" width="16" height="14.5" rx="2" />
      <path d="M4 9.5h16" />
      <path d="M8 3.5v3" />
      <path d="M16 3.5v3" />
    </svg>
  );
}

export function IconMail(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <rect x="3.5" y="5.5" width="17" height="13" rx="2" />
      <path d="M4 7l8 6 8-6" />
    </svg>
  );
}

// A recognisable but monochrome speech-bubble glyph — inherits currentColor
// rather than WhatsApp's brand green.
export function IconWhatsApp(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} {...props}>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 3.5a8.5 8.5 0 0 0-7.3 12.9L4 20.5l4.2-1.1A8.5 8.5 0 1 0 12 3.5z"
      />
      <path
        fill="currentColor"
        stroke="none"
        d="M8.9 8.4c.2-.4.4-.4.6-.4h.5c.2 0 .3.1.4.4.2.4.6 1.3.6 1.4.1.2 0 .3-.1.5-.1.2-.3.3-.4.5-.2.2-.3.3-.1.6.4.8 1.3 1.7 2.1 2.1.3.1.4 0 .6-.1.2-.2.3-.4.5-.5.1-.1.3-.2.5 0 .1.1.9.4 1.3.6.4.2.3.4.3.5 0 .3-.1.8-.4 1.1-.4.4-1.2.6-1.9.4-1.3-.3-2.9-1.3-3.9-2.4-1.1-1.1-1.8-2.3-2.1-3.2-.2-.6.1-1.4.4-1.8z"
      />
    </svg>
  );
}
