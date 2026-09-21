import Link from "next/link";
import type { ReactNode } from "react";

type ServiceRowProps = {
  tag: string;
  title: string;
  copy: string;
  icon: ReactNode;
  href?: string;
};

export default function ServiceRow({ tag, title, copy, icon, href }: ServiceRowProps) {
  return (
    <article className={`service-row${href ? " service-row-explorable" : ""}`}>
      <div className="service-meta">
        {icon}
        <span className="service-tag">[{tag}]</span>
      </div>
      <h3>{title}</h3>
      <div className="service-description">
        <p>{copy}</p>
        {href ? (
          <Link href={href} className="service-explore" aria-label={`Explore service: ${title}`}>
            Explore service <span aria-hidden="true">→</span>
          </Link>
        ) : null}
      </div>
    </article>
  );
}
