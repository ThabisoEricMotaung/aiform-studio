import CommunityBuildMedia from "@/components/CommunityBuildMedia";
import Link from "next/link";
import { AiFormMark } from "@/components/AiFormLockup";
import type { CommunityBuild } from "@/content/communityBuilds";

function statusClassName(status: CommunityBuild["status"]) {
  return `build-status build-status-${status.toLowerCase().replaceAll(" ", "-")}`;
}

// Homepage/index summary. Dedicated case studies use their own editorial opening.
export default function CommunityBuildFeature({ build, headingLevel = "h3" }: { build: CommunityBuild; headingLevel?: "h1" | "h3" }) {
  const Heading = headingLevel;
  return (
    <article id={`community-build-${build.number}`} className="community-build-feature">
      <div>
        <div className="community-build-kicker">
          <p className="chapter-label">Community Build {build.number}</p>
          <span className={statusClassName(build.status)}>{build.status}</span>
        </div>
        <Heading className="community-build-name">{build.name}</Heading>
        <p className="community-build-location">{build.location} · {build.sector}</p>
        <p className="community-build-description">{build.description}</p>
        <p className="community-build-focus-label">{build.focusLabel}</p>
        <ol className="community-build-focus-list" role="list">
          {build.focusItems.map((item, index) => (
            <li key={item}><span aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>{item}</li>
          ))}
        </ol>
        {build.caseStudyUrl ? (
          <Link href={build.caseStudyUrl} className="text-link mt-8">{build.actionLabel} <span aria-hidden="true">→</span></Link>
        ) : null}
      </div>
      {build.media ? (
        <CommunityBuildMedia media={build.media} />
      ) : (
        <div className="community-build-image">
          <div className="community-build-placeholder">
            <AiFormMark variant="green" className="community-build-placeholder-mark" />
            <p>Photography of this build will appear here as the project progresses.</p>
          </div>
        </div>
      )}
    </article>
  );
}
