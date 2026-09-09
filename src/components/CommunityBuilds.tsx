import Link from "next/link";
import { communityBuilds } from "@/content/communityBuilds";
import CommunityBuildFeature from "@/components/CommunityBuildFeature";

export default function CommunityBuilds() {
  return (
    <section id="community-builds" className="editorial-grid home-section border-t border-line" aria-labelledby="community-builds-title">
      <p className="col-span-12 chapter-label md:col-span-2">Community Builds</p>
      <div className="col-span-12 mt-8 md:col-start-4 md:col-span-8 md:mt-0">
        <h2 id="community-builds-title" className="section-title">Some businesses don&apos;t need another bill. They need a chance.</h2>
        <div className="section-intro space-y-5">
          <p>Not every good business starts with the resources to invest in design, technology or a proper digital presence.</p>
          <p>From time to time, AiForm Studio selects a small business where we believe a focused digital intervention could make a meaningful difference.</p>
          <p>We contribute the design and development. The business contributes its time, knowledge and willingness to work with us. Together, we build something practical around what the business actually needs.</p>
        </div>
        <p className="community-builds-note">No application fee. No hidden bill later. No promise that every business can be selected.</p>
        <Link href="#community-build-001" className="text-link mt-8">Learn about Community Builds <span aria-hidden="true">→</span></Link>
      </div>

      {communityBuilds.map((build) => (
        <div key={build.id} className="col-span-12 md:col-start-2 md:col-span-11">
          <CommunityBuildFeature build={build} />
        </div>
      ))}
    </section>
  );
}
