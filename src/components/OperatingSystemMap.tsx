const territories = [
  { label: "Knowledge", x: 92, y: 100, note: "context · research" },
  { label: "Intelligence", x: 290, y: 58, note: "analysis · assistance" },
  { label: "Playbooks", x: 692, y: 100, note: "patterns · standards" },
  { label: "Systems", x: 736, y: 316, note: "connections · reuse" },
  { label: "Operations", x: 144, y: 316, note: "runtime · feedback" },
];

export default function OperatingSystemMap() {
  return (
    <svg role="img" aria-labelledby="system-map-title system-map-desc" viewBox="0 0 900 430" className="h-auto w-full">
      <title id="system-map-title">AiForm Studio operating system map</title>
      <desc id="system-map-desc">Knowledge, intelligence, playbooks, systems and operations connect around AiForm Studio. Work returns through operations as feedback and accumulated learning.</desc>
      <defs><pattern id="field-grid" width="36" height="36" patternUnits="userSpaceOnUse"><path d="M36 0H0V36" fill="none" stroke="#173B2C" strokeOpacity=".055" strokeWidth=".7"/></pattern></defs>
      <rect width="900" height="430" fill="url(#field-grid)" />
      <g fill="none" stroke="#173B2C">
        <path d="M164 108C260 118 314 154 382 198M378 196C344 136 336 102 354 70M520 196C582 150 636 118 692 108M522 224C600 250 660 286 716 324M378 226C304 258 246 294 202 326" strokeOpacity=".42" strokeWidth="1" />
        <path d="M202 352C322 400 582 408 716 350" stroke="#B68A3A" strokeOpacity=".6" strokeWidth="1.2" strokeDasharray="4 7" />
        <path d="m709 345 10 5-9 6" stroke="#B68A3A" strokeOpacity=".7" />
        <path d="M450 152 395 264h110Z" strokeOpacity=".15" strokeWidth="1" />
        <path d="M450 152v157" strokeOpacity=".12" strokeDasharray="4 6" />
      </g>
      <g>
        <circle cx="450" cy="211" r="66" fill="#fff" stroke="#173B2C" strokeWidth="1.5" />
        <circle cx="450" cy="211" r="53" fill="none" stroke="#B68A3A" strokeOpacity=".45" strokeWidth=".8" />
        <text x="450" y="206" textAnchor="middle" fill="#173B2C" fontSize="13" fontWeight="700" letterSpacing="1.5">AIFORM</text>
        <text x="450" y="225" textAnchor="middle" fill="#565B57" fontSize="9" letterSpacing="1.8">STUDIO</text>
      </g>
      {territories.map((territory, index) => <g key={territory.label} transform={`translate(${territory.x} ${territory.y})`}><circle r="5" fill={index === 2 ? "#B68A3A" : "#173B2C"}/><text x="14" y="4" fill="#181A18" fontSize="12" fontWeight="650" letterSpacing=".7">{territory.label.toUpperCase()}</text><text x="14" y="22" fill="#565B57" fontSize="8" letterSpacing=".7">{territory.note}</text></g>)}
      <g fill="#565B57" fontSize="7" letterSpacing="1"><text x="40" y="405">CONTEXT MOVES THROUGH THE SYSTEM</text><text x="676" y="405">WORK RETURNS AS LEARNING</text></g>
    </svg>
  );
}
