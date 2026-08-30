const provinces = [
  [
    "Northern Cape",
    "M230.5 158L237.2 169.4L242.9 159.8L255.8 154.9L250.7 158.4L252.8 165.9L262.7 175L274.2 183.5L275.4 191.3L277.9 203.9L280.4 212.9L288.8 218.1L294 224.9L299.7 215.7L303.8 211L304.7 218.4L310.3 225.4L305.8 243.4L290.3 280.8L302.8 288.3L311.4 299.8L326.1 314.1L324.9 325.5L308.9 331.8L293.8 340.9L281.8 347.7L272.1 349.2L256.7 345.2L245.7 355.1L235.2 350.3L219.7 341.4L213.4 357.8L200.5 363L186.8 368.5L172.2 378.6L166.8 386.7L150.3 381.5L150.4 365.4L136.7 368.4L127.8 377.3L124.2 366.3L120.6 356.6L112.4 347.4L109.9 332L107.6 320.3L101.2 308.1L90.4 305.5L81.9 316.3L69 327.3L49.6 292.1L26 243.1L30.9 237.9L35.2 236.7L37 230.4L41.1 223.9L49.6 226L53.7 229.2L56 235.4L56.5 240.4L63.9 246.5L75.9 248.8L96.7 250.3L115.4 253.1L119 247.6L126.1 243.8L139.3 236.6L142.7 217L142.7 172.2L142.7 127.4L154.8 121.8L163.6 137.3L170 154.3L170.5 159.9L164.2 169.3L166.2 182L175.1 181.9L193.4 182.7L201.3 181.4L207.2 176.6L217.3 167.4L229.9 158.8Z",
  ],
  [
    "Western Cape",
    "M264.5 422.7L252.3 425.8L228.5 423.4L203 435.6L185 436.7L172.7 436L157.8 440.1L138.3 448.5L119.9 443.7L119.3 437.7L113.3 434.8L104.4 435.3L104.2 429.4L100.3 425.5L93.3 426.7L90.3 433L88.5 421L91.1 413.6L81.9 401.5L75.3 391L73.2 381.1L80.8 381L87.7 364.9L82.1 344.3L73.1 320.1L84.9 315L92.1 306.4L104.8 312L106.8 322.6L110.6 338.9L111 352.3L125.7 358.5L126.3 371.5L130.3 371.2L140.8 367.9L146.1 369.7L157.4 387.3L169.5 384.8L180.6 376.3L190.8 367.6L205.1 364L213 352.3L225.9 344.2L241.4 351.1L249.4 352.2L266.6 344.7L275.4 346.7L282.7 354.3L277.6 361.7L265.8 363.9L251.4 370.1L255.7 381.7L243.4 385.7L234.8 400.5L252.1 402.9L263.9 411.1L261.5 416.2Z",
  ],
  [
    "North West",
    "M230.5 158L236.5 143.6L241.7 133.2L248.3 130.5L260.7 132.3L273.1 140.9L283.1 142L295.2 147.1L310 146.1L321.5 145.6L329.5 141.1L335.7 125.7L340.4 112.3L356.6 107.8L364.2 115L377.4 111.5L386.3 121L394.9 123.9L406.9 120.9L417.4 123.4L417.7 128.3L413.5 133.3L411.1 136.6L405.9 149.4L392 150.5L386.3 159.3L384.3 171.3L395.6 176.2L392.7 183.7L382.6 185.4L364.8 187.9L359.5 196.5L351 204.4L336.6 207.4L324 211.8L314.3 219.1L307.7 224.8L309.1 211L299 210.5L297 221.5L291.6 220.8L290.3 210.9L278.1 207.6L273.1 196.6L276.3 185L259.8 179.1L252.4 170.5L253.4 159.2L255 157L245.2 157.7L238.4 167.7L233.5 158.7Z",
  ],
  [
    "Free State",
    "M438.5 247.6L432.7 243.3L429.4 241.5L412.8 247.7L401.2 253.1L394.2 263L390.8 267.2L383.6 273.7L378.4 277.4L383.1 286.7L388.5 294L389.4 299.1L377 306.6L366.8 311.4L353.7 308.2L334.2 311.6L325.6 309.3L311 298.2L299 287L288 276.9L304.8 239L310.4 223.8L317.5 217.4L329.4 209.9L339.1 208.8L351.7 202.2L357 193.9L373.8 184.2L386.9 183.3L394 180.6L406.1 178.7L418.5 184.4L431.4 188.3L442 187.8L449.3 192.6L463.8 204.8L468.9 208.3L464.1 223.1L459.6 230.5L449.6 239.5Z",
  ],
  [
    "Gauteng",
    "M418.5 184.4L411.5 181.8L409 176.9L406.1 178.7L398.1 180L396.1 179.1L395.6 176.2L387.8 175L384.8 175.8L384.3 171.3L383 167.2L387.5 164L386.3 159.3L389.8 158.5L391.5 154.6L392 150.5L398 147.8L400.9 150.3L405.9 149.4L408.1 147.9L408.8 140.7L411.1 136.6L408.3 134.5L410.1 132.9L413.5 133.3L417.8 132.6L419.8 131.4L424.4 131.6L427.6 129.8L432.1 129.1L430.2 126.1L435.1 124.6L436.1 128.4L431 131.9L430.9 138.5L432.3 143.1L435.5 144.5L438.6 142L436.8 139L440.7 139.3L442.5 143.4L441.4 150L439.4 150.8L439 154.5L435.9 154.8L431.1 153.4L429.4 156.3L426.7 157L427.7 161.8L433.9 165.7L436.9 164.7L438.8 167.8L436.5 168.7L435.6 171.7L431.5 171.4L427.6 173.3L426.9 174.9L423.4 176.5L423.6 179.8L420.1 182.2Z",
  ],
  [
    "Mpumalanga",
    "M537.6 86L541.7 98.3L542.8 108.6L542.9 129.6L540.7 146.8L540.7 153.3L523.8 145.8L516.9 149.1L508.2 161.7L502.9 175L506.1 181L519.1 195.9L506.7 198.4L495.8 198.4L486 198.1L469 203.1L458.1 196.4L445.2 189L431.7 186.5L422.9 185.7L423.6 179.8L427.6 173.3L436.5 168.7L433.9 165.7L429.4 156.3L439 154.5L442.5 143.4L438.6 142L430.9 138.5L435.1 124.6L421.8 127.1L430.4 120.8L442.3 123.2L446.7 131.4L452.3 133.3L465.7 133.2L476.8 131.9L480.8 124.9L488.3 116.6L498.6 114.7L501.1 106.7L517.4 105.9L516.5 97.6L513.7 90.4L523.8 89L536 86Z",
  ],
  [
    "Limpopo",
    "M537.6 86L524.9 87.9L516.8 88.4L512 98L518.7 104.2L502.2 102.8L500.7 110.8L490.7 115.8L482.8 121.5L476.9 125.8L469 134L455.1 134.3L448.9 131L444.8 125.5L434.4 118.8L425.3 124.7L430.2 126.1L424.4 131.6L414.3 127.5L413.3 121.1L398.9 119.8L392.9 122.6L382.8 120.5L374.8 113.7L358.5 114.5L358.4 106.7L368.7 97.2L376.2 77.3L382.9 71.2L390 66.5L396.4 62.1L401.9 60.2L406.4 56.1L410.9 49.3L428.1 39.2L441.5 33.3L455.5 26.5L473.4 26.2L500.4 30L516.6 31.6L520 36.1L525.6 54.1L528.2 69.8L533.3 78.5Z",
  ],
  [
    "KwaZulu-Natal",
    "M519.1 195.9L541.9 198.2L543.2 181.8L547.1 182.5L559.3 183.2L572.9 182.9L565.2 208.3L552.9 242.4L539.7 252.2L515.7 275L498.8 303.3L483.1 324.8L475.8 316.6L459.2 309.5L448.8 307.3L453.3 299.4L447.2 291.3L446.6 286L449.8 277L455 270L455.7 262.5L452 257.7L441.8 251.1L449.6 239.5L459.6 230.5L464.1 223.1L468.9 208.3L474.3 200.2L490.8 197.2L498.7 197.2L509.3 199.9Z",
  ],
  [
    "Eastern Cape",
    "M443.8 287.9L449.2 298.3L450 303.4L454 310.7L469.8 312.5L480.9 320.1L471 336.5L447.6 356L417.1 381.7L388.8 401.6L357.6 415L331.7 418L325.9 424L306.9 425.1L282.8 425.1L266.2 418.8L257.9 413.4L257.9 404L235 403L240.5 389.9L254.2 383L251.2 372.8L263.4 366.8L272.8 363.5L280.7 356L281.6 348.8L293.3 346L302.2 335.4L321.7 329.9L327.4 315.6L330.4 309.1L345.3 306L358.1 307.5L369.4 310.3L381.1 305.6L389.6 299.3L393.1 300.9L396.3 304.4L406.7 309.7L413.2 308.3L415.9 302.5L424.6 293.5L431.1 293L440 290Z",
  ],
] as const;

const provinceColors: Record<(typeof provinces)[number][0], string> = {
  "Northern Cape": "#D8C9A8",
  "Western Cape": "#AFC5BE",
  "North West": "#C7BCD1",
  "Free State": "#C7D1AE",
  Gauteng: "#55755E",
  Mpumalanga: "#A7BFBB",
  Limpopo: "#C9B39F",
  "KwaZulu-Natal": "#D5B5AA",
  "Eastern Cape": "#9FB5C4",
};

const provinceLabels = [
  ["NORTHERN CAPE", 132, 270],
  ["WESTERN CAPE", 118, 414],
  ["NORTH WEST", 292, 160],
  ["FREE STATE", 350, 250],
  ["LIMPOPO", 447, 76],
  ["MPUMALANGA", 482, 148],
  ["KWAZULU-NATAL", 492, 252],
  ["EASTERN CAPE", 340, 375],
] as const;

export default function SouthAfricaMap() {
  return (
    <figure className="w-full overflow-hidden lg:overflow-visible">
      <svg
        role="img"
        aria-labelledby="south-africa-map-title south-africa-map-description"
        viewBox="0 0 760 500"
        className="h-auto w-[126%] max-w-none overflow-visible lg:w-full"
      >
        <title id="south-africa-map-title">
          AiForm Studio in Pretoria, South Africa
        </title>
        <desc id="south-africa-map-description">
          South Africa map showing AiForm Studio&apos;s location in Pretoria,
          Gauteng.
        </desc>
        <g
          aria-hidden="true"
          fill="none"
          stroke="#D8D5CE"
          strokeWidth="1"
          vectorEffect="non-scaling-stroke"
        >
          <path d="M20 146H580M20 292H580" strokeDasharray="2 7" opacity=".5" />
          <path d="M142 18V458M418 18V458" strokeDasharray="2 7" opacity=".5" />
          <path d="M84 80V42M84 42l-5 10M84 42l5 10" stroke="#9A968D" />
        </g>
        <g
          aria-hidden="true"
          className="sa-map-silhouette"
          stroke="#FFFFFF"
          strokeWidth="1.35"
          strokeLinejoin="round"
          vectorEffect="non-scaling-stroke"
        >
          {provinces.map(([name, path]) => (
            <path
              key={name}
              d={path}
              fill={provinceColors[name]}
              stroke={name === "Gauteng" ? "#173B2C" : undefined}
              strokeWidth={name === "Gauteng" ? 2 : undefined}
            />
          ))}
        </g>
        <g
          aria-hidden="true"
          className="hidden lg:block"
          fill="#31463B"
          fontFamily="var(--font-geist), sans-serif"
          fontSize="9"
          fontWeight="600"
          letterSpacing=".8"
          textAnchor="middle"
        >
          {provinceLabels.map(([label, x, y]) => (
            <text key={label} x={x} y={y}>
              {label}
            </text>
          ))}
        </g>
        <g
          aria-hidden="true"
          fill="none"
          stroke="#B68A3A"
          vectorEffect="non-scaling-stroke"
        >
          <circle
            cx="417.6"
            cy="145.9"
            r="4.5"
            fill="#B68A3A"
            stroke="white"
            strokeWidth="2"
          />
          <path
            d="M426 145.9H650"
            strokeWidth="1.25"
            className="hidden lg:block"
          />
        </g>
        <g
          aria-hidden="true"
          className="hidden lg:block"
          fill="#173B2C"
          fontFamily="var(--font-geist), sans-serif"
        >
          <text x="74" y="96" fontSize="10" letterSpacing="1.5">
            N
          </text>
          <text
            x="662"
            y="143"
            fontSize="15"
            fontWeight="600"
            letterSpacing="1.2"
          >
            PRETORIA
          </text>
          <text x="662" y="163" fontSize="9" letterSpacing="1.1" fill="#565B57">
            GAUTENG / SOUTH AFRICA
          </text>
          <text x="662" y="181" fontSize="8" letterSpacing=".8" fill="#7A7E79">
            25.7479° S / 28.2293° E
          </text>
          <text x="20" y="482" fontSize="8" letterSpacing="1.1" fill="#8B8F89">
            GEOGRAPHIC SOURCE / NATURAL EARTH
          </text>
        </g>
      </svg>
      <div
        aria-hidden="true"
        className="mt-3 border-l border-gold pl-4 lg:hidden"
      >
        <p className="text-sm font-semibold tracking-[.08em] text-green">
          PRETORIA
        </p>
        <p className="mt-1 text-[10px] tracking-[.1em] text-muted">
          GAUTENG / SOUTH AFRICA
        </p>
        <p className="mt-1 text-[10px] tracking-[.06em] text-muted">
          25.7479° S / 28.2293° E
        </p>
        <p className="mt-3 text-[9px] tracking-[.1em] text-muted/70">
          GEOGRAPHIC SOURCE / NATURAL EARTH
        </p>
      </div>
    </figure>
  );
}
