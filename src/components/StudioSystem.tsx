import Link from "next/link";
import styles from "./StudioSystem.module.css";

const stages = [
  {
    title: "Notice",
    copy: "Find the friction people have already learned to work around.",
    label: "Raw input",
    icon: <><path d="M7 24s7-10 17-10 17 10 17 10-7 10-17 10S7 24 7 24Z" /><circle cx="24" cy="24" r="5" /><path d="m8 8 3 3M24 4v4m13 3 3-3M5 36l3-1m31 2 3 2" strokeDasharray="2 3" /></>,
  },
  {
    title: "Understand",
    copy: "Study the real workflow, research and requirements underneath it.",
    label: "People & process",
    icon: <><circle cx="24" cy="18" r="5" /><path d="M15 33v-3a9 9 0 0 1 18 0v3M9 12l10 4m10 0 10-4M12 38l7-6m10 0 7 6" /><circle cx="7" cy="11" r="2" /><circle cx="41" cy="11" r="2" /><circle cx="10" cy="40" r="2" /><circle cx="38" cy="40" r="2" /></>,
  },
  {
    title: "Structure",
    copy: "Turn what we learn into knowledge, rules, data and patterns.",
    label: "Clear foundation",
    icon: <><rect x="19" y="6" width="10" height="10" rx="1" /><path d="M24 16v9M10 32v-7h28v7M24 25v7" /><rect x="5" y="32" width="10" height="10" rx="1" /><rect x="19" y="32" width="10" height="10" rx="1" /><rect x="33" y="32" width="10" height="10" rx="1" /></>,
  },
  {
    title: "Build",
    copy: "Build the interfaces, systems and automation the work actually needs.",
    label: "A working system",
    icon: <><rect x="7" y="7" width="14" height="14" rx="2" /><rect x="27" y="7" width="14" height="14" rx="2" /><rect x="7" y="27" width="14" height="14" rx="2" /><rect x="27" y="27" width="14" height="14" rx="2" /><path d="M21 14h6M14 21v6m20-6v6M21 34h6" /></>,
  },
  {
    title: "Evolve",
    copy: "Deploy it, watch how it’s used, and improve it from there.",
    label: "Learn from use",
    icon: <><rect x="12" y="14" width="24" height="21" rx="2" /><path d="m17 29 6-6 5 3 4-6M28 20h4v4M7 27a18 18 0 0 1 29-17m0-5v5h-5M41 22a18 18 0 0 1-29 17m0 5v-5h5" /></>,
  },
];

export default function StudioSystem() {
  return (
    <section id="system" className={`${styles.section} editorial-grid home-section border-t border-line`} aria-labelledby="system-title">
      <p className="col-span-12 chapter-label md:col-span-2">System // Operating logic</p>
      <div className={`${styles.header} col-span-12 md:col-start-4 md:col-span-8`}>
        <h2 id="system-title" className="section-title">The system<br />behind the work.</h2>
        <p className="section-intro">Every project starts differently. The way we make sense of it doesn&apos;t.</p>
      </div>

      <div className={`${styles.journey} col-span-12`}>
        {/* The same coordinate system places the signal at each column's centre. */}
        <svg className={styles.signal} viewBox="0 0 1000 200" preserveAspectRatio="none" fill="none" stroke="currentColor" aria-hidden="true" focusable="false">
          <g className={styles.construction}>
            <path d="M-80 40H1060M-80 160H1060M100 24v152M300 24v152M500 24v152M700 24v152M900 24v152" />
            <path d="M280 48v-8h40v8M480 152v8h40v-8M880 48v-8h40v8" />
          </g>
          <g className={styles.flow}>
            {/* Four routed inputs converge without crossing or oscillating. */}
            <path d="M-160 48H-36Q-28 48-22 54L18 94Q24 100 34 100H1080" />
            <path d="M-160 76H-12Q-4 76 2 82L14 94Q20 100 34 100" />
            <path d="M-160 128H-30Q-22 128-16 122L0 106Q6 100 34 100" />
            <path d="M-160 154H-50Q-42 154-36 148L6 106Q12 100 34 100" />
            {/* Small parallel offsets settle into the spine before Structure. */}
            <path d="M100 100C128 100 128 88 152 88H224C248 88 248 95 272 95H356C386 95 386 100 416 100" />
            <path d="M100 100C128 100 128 112 152 112H224C248 112 248 105 272 105H356C386 105 386 100 416 100" />
            <path d="M944 100H976Q984 100 984 92V84Q984 76 976 76H934" opacity="0.65" />
            <path d="m956 73-3 3 3 3M1008 97l4 3-4 3" />
          </g>
        </svg>
        <svg className={styles.mobileSignal} viewBox="0 0 84 1000" preserveAspectRatio="none" fill="none" stroke="currentColor" aria-hidden="true" focusable="false">
          <path d="M42-45V1020" />
          <path d="M14-45V0Q14 8 20 14L36 30Q42 36 42 48M70-45V8Q70 16 64 22L48 38Q42 44 42 56" opacity="0.65" />
          <path d="M42 948V966Q42 972 48 972H54Q60 972 60 966V940" opacity="0.5" />
          <path d="m37 986 5 7 5-7" />
        </svg>
        <ol className={styles.stages} role="list" aria-label="The AiForm Studio operating system">
          {stages.map((stage, index) => (
            <li className={styles.stage} key={stage.title}>
              <div className={styles.node}>
                <svg viewBox="0 0 120 120" fill="none" stroke="currentColor" aria-hidden="true" focusable="false">
                  <path className={styles.nodeOutline} d="M34 9H86L112 60 86 111H34L8 60Z" />
                  <path className={styles.nodeInset} d="M38 17H82L103 60 82 103H38L17 60Z" />
                  <g transform="translate(36 36)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">{stage.icon}</g>
                </svg>
              </div>
              <div className={styles.details}>
                <p className={styles.number}>{String(index + 1).padStart(2, "0")}</p>
                <h3>{stage.title}</h3>
                <p className={styles.copy}>{stage.copy}</p>
                <p className={styles.taxonomy}>{stage.label}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>

      <div className={`${styles.links} col-span-12`}>
        <Link href="/work/aiform-engine" className="text-link">See the Engine in depth <span aria-hidden="true">→</span></Link>
        <Link href="/ai" className="text-link">How we use AI <span aria-hidden="true">→</span></Link>
      </div>
    </section>
  );
}
