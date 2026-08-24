import {
  procureSocialLinks,
  procureWebsite,
  type ProcureSocialIconName,
} from "@/lib/procure-links";
import type { ReactNode } from "react";

function ProcureSocialIcon({ name }: { name: ProcureSocialIconName }) {
  const paths: Record<ProcureSocialIconName, ReactNode> = {
    linkedin: (
      <>
        <path d="M8 11v5M8 8v.01M12 16v-5M16 16v-3a2 2 0 1 0-4 0" />
        <path d="M3 7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4v10a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4V7" />
      </>
    ),
    facebook: <path d="M7 10v4h3v7h4v-7h3l1-4h-4V8a1 1 0 0 1 1-1h3V3h-3a5 5 0 0 0-5 5v2H7" />,
    substack: <path d="M4 4h16v2.25H4V4Zm0 4h16v2.25H4V8Zm0 4h16v8l-8-4.5L4 20v-8Z" fill="currentColor" stroke="none" />,
    tiktok: <path d="M21 7.917v4.034A9.948 9.948 0 0 1 16 10v4.5a6.5 6.5 0 1 1-8-6.326V12.5a2.5 2.5 0 1 0 4 2V3h4.083A6.005 6.005 0 0 0 21 7.917" />,
    x: (
      <>
        <path d="m4 4 11.733 16H20L8.267 4H4" />
        <path d="m4 20 6.768-6.768m2.46-2.46L20 4" />
      </>
    ),
    reddit: <><path d="M12 8c2.648 0 5.028.826 6.675 2.14A2.5 2.5 0 0 1 21 14.5c0 3.59-4.03 6.5-9 6.5-4.875 0-8.845-2.8-9-6.294l-1-.206a2.5 2.5 0 0 1 2.326-4.36C5.973 8.827 8.353 8 11 8h1" /><path d="m12 8 1-5 6 1M18 4a1 1 0 1 0 2 0 1 1 0 1 0-2 0M10 17c.667.333 1.333.5 2 .5s1.333-.167 2-.5" /><path d="M8.5 13a.5.5 0 1 0 1 0 .5.5 0 1 0-1 0m6 0a.5.5 0 1 0 1 0 .5.5 0 1 0-1 0" fill="currentColor" stroke="none" /></>,
    instagram: <><path d="M4 8a4 4 0 0 1 4-4h8a4 4 0 0 1 4 4v8a4 4 0 0 1-4 4H8a4 4 0 0 1-4-4V8" /><path d="M9 12a3 3 0 1 0 6 0 3 3 0 0 0-6 0M16.5 7.5v.01" /></>,
  };

  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {paths[name]}
    </svg>
  );
}

export default function ProcureSocialLinks() {
  return (
    <section className="procure-follow" aria-labelledby="procure-follow-title">
      <div className="procure-follow-intro">
        <h5 id="procure-follow-title">Follow the build.</h5>
        <p>
          Updates, product progress and procurement thinking from AiForm Procure.
        </p>
      </div>
      <div className="procure-social-grid">
        {procureSocialLinks.map((link) => (
          <a
            key={link.name}
            href={link.href}
            target="_blank"
            rel="noopener noreferrer"
          >
            <ProcureSocialIcon name={link.icon} />
            <span>{link.name}</span>
            <span aria-hidden="true">↗</span>
          </a>
        ))}
      </div>
      <a
        href={procureWebsite}
        target="_blank"
        rel="noopener noreferrer"
        className="procure-website-link"
      >
        <span>
          <small>Live product</small>
          aiformprocure.co.za
        </span>
        <span aria-hidden="true">↗</span>
      </a>
    </section>
  );
}
