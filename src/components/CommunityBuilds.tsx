import Link from "next/link";
import { communityBuilds } from "@/content/communityBuilds";
import CommunityBuildFeature from "@/components/CommunityBuildFeature";

const steps = [
  {
    title: "We select",
    description: "We look for small businesses where a focused digital intervention could make a real difference.",
    icon: <><circle cx="10.5" cy="10.5" r="6.5" /><path d="m16 16 5 5" /><circle cx="10.5" cy="10.5" r="2" /></>,
  },
  {
    title: "We build",
    description: "We contribute the design and development, focused on what the business actually needs.",
    icon: <path d="M14.5 6.5 18 10l3-3a6 6 0 0 1-7.5 7.5L7 21a2.8 2.8 0 0 1-4-4l6.5-6.5A6 6 0 0 1 17 3Z" />,
  },
  {
    title: "We grow together",
    description: "They bring their time, knowledge and commitment. Together, we build something useful that can last.",
    icon: <><circle cx="9" cy="7" r="3" /><path d="M3 21v-3a6 6 0 0 1 12 0v3M16 4a3 3 0 0 1 0 6M18 13a6 6 0 0 1 3 5v3" /></>,
  },
];

export default function CommunityBuilds() {
  return (
    <section id="community-builds" className="editorial-grid home-section border-t border-line" aria-labelledby="community-builds-title">
      <div className="community-builds-overview col-span-12">
        <div className="community-builds-intro">
          <p className="chapter-label">Community Builds</p>
          <h2 id="community-builds-title" className="section-title">Some businesses<br />don&apos;t need another bill.<br />They need a chance.</h2>
          <p className="section-intro">We partner with selected small businesses to design and build practical digital solutions around what they actually need — at no cost.</p>
          <Link href="#community-build-001" className="button-primary mt-6">See the builds <span aria-hidden="true">→</span></Link>
          <p className="community-builds-note">No application fee. No hidden bill later.</p>
        </div>
        <ol className="community-builds-process" aria-label="How Community Builds works" role="list">
          {steps.map((step, index) => (
            <li key={step.title} className="community-builds-step">
              <span className="community-builds-step-number" aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>
              <svg className="community-builds-step-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">{step.icon}</svg>
              <div className="community-builds-step-copy">
                <h3>{step.title}</h3>
                <p>{step.description}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>

      {communityBuilds.map((build) => (
        <div key={build.id} className="col-span-12 md:col-start-2 md:col-span-11">
          <CommunityBuildFeature build={build} />
        </div>
      ))}
    </section>
  );
}
