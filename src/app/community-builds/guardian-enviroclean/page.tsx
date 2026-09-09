import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { communityBuilds } from "@/content/communityBuilds";

const canonicalUrl = "https://aiformstudio.co.za/community-builds/guardian-enviroclean";
const ogImage = { url: "https://aiformstudio.co.za/images/aiform-story.png", width: 1254, height: 1254, alt: "AiForm Studio logo and its moth-inspired design origins" };
const title = "Guardian Enviroclean — Community Build 001";
const description = "AiForm Studio's first Community Build: a pro bono digital intervention for Guardian Enviroclean, a Pretoria cleaning business. Follow the build as it progresses.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/community-builds/guardian-enviroclean" },
  openGraph: {
    type: "article",
    locale: "en_ZA",
    url: canonicalUrl,
    siteName: "AiForm Studio",
    title: `${title} | AiForm Studio`,
    description,
    images: [ogImage],
  },
  twitter: {
    card: "summary",
    title: `${title} | AiForm Studio`,
    description,
    images: [ogImage.url],
  },
};

const mediaRoot = "/community-builds/guardian-enviroclean";
const comparison = [
  { label: "Before", file: "WhatsApp Image 2026-09-09 at 07.26.57.jpeg", alt: "Soiled patterned armchair upholstery beside a bucket and brush, with damaged backing exposed." },
  { label: "After", file: "WhatsApp Image 2026-09-09 at 07.26.58.jpeg", alt: "The matching armchair with visibly cleaner patterned upholstery and its seat cushion removed." },
];

export default function GuardianEnviroclean() {
  const build = communityBuilds.find((candidate) => candidate.id === "guardian-enviroclean")!;

  return (
    <article>
      <header className="editorial-grid pt-10 pb-14 md:pt-16 md:pb-20">
        <div className="col-span-12 md:col-start-3 md:col-span-9">
          <p className="chapter-label">Community Build {build.number} · {build.status}</p>
          <h1 className="section-title mt-6">{build.name}</h1>
          <p className="community-build-location mt-4">{build.location} · {build.sector}</p>
          <p className="guardian-standfirst">What happens when the work is trusted, but the systems around it haven&apos;t caught up?</p>
        </div>
      </header>

      <section className="case-study-section editorial-grid border-t border-line" aria-labelledby="guardian-start">
        <p className="col-span-12 chapter-label md:col-span-2">01 / Field notes</p>
        <div className="col-span-12 mt-8 md:col-start-3 md:col-span-9 md:mt-0">
          <h2 id="guardian-start" className="chapter-label">Where it started</h2>
          <p className="guardian-story-lead">Guardian already had something AiForm Studio could not manufacture for it: customers who trusted the work enough to recommend the business to others.</p>
          <div className="mt-10 grid items-start gap-8 sm:grid-cols-2">
            <div className="guardian-story-copy">
              <p>That trust is the starting point for this Community Build. The question is how better systems can support the business around the work it already does.</p>
              <p>Cecil supplied these photographs and footage from Guardian Enviroclean&apos;s cleaning jobs. They form a record of the business as we begin, rather than evidence of an AiForm intervention.</p>
            </div>
            <figure>
              <video controls muted playsInline preload="metadata" width={480} height={864}
                poster={`${mediaRoot}/guardian-process-poster.jpg`}
                aria-label="Guardian Enviroclean cleaning a rug in a furnished living room"
                aria-describedby="guardian-video-caption" className="guardian-process-video">
                <source src={`${mediaRoot}/videos/WhatsApp Video 2026-09-09 at 07.26.48.mp4`} type="video/mp4" />
                <a href={`${mediaRoot}/videos/WhatsApp Video 2026-09-09 at 07.26.48.mp4`}>Watch the Guardian Enviroclean process video.</a>
              </video>
              <figcaption id="guardian-video-caption" className="guardian-media-caption">On the job · 23 seconds. A worker uses an extraction wand beside a blue machine before the camera moves across upholstered dining chairs. Play to watch; sound is off initially.</figcaption>
            </figure>
          </div>
          <figure className="mt-12">
            <div className="grid gap-6 sm:grid-cols-2">
              {comparison.map(({ label, file, alt }) => (
                <div key={label}>
                  <p className="chapter-label mb-3">{label}</p>
                  <Image src={`${mediaRoot}/photos/${file}`} alt={alt} width={1200} height={1600}
                    sizes="(min-width: 768px) 34vw, (min-width: 640px) 44vw, 92vw" className="guardian-media-image" />
                </div>
              ))}
            </div>
            <figcaption className="guardian-media-caption">One upholstery cleaning job, photographed from different angles. The comparison documents the fabric cleaning; it does not show a repair to the chair&apos;s damaged structure or backing.</figcaption>
          </figure>
        </div>
      </section>

      <section className="case-study-section editorial-grid bg-bg-alt" aria-labelledby="guardian-learned">
        <p className="col-span-12 chapter-label md:col-span-2">02 / Discovery</p>
        <div className="col-span-12 mt-8 md:col-start-3 md:col-span-9 md:mt-0">
          <h2 id="guardian-learned" className="chapter-label">What we learned</h2>
          <p className="guardian-story-lead">Referrals are producing customers. The emerging questions concern what happens around each job.</p>
          <div className="guardian-story-copy mt-8">
            <p>Bookings currently happen through WhatsApp and calls. As work comes in, those conversations can become difficult to track, with a risk of losing a booking or double-booking. Cancellations and no-shows have no deposit protection.</p>
            <p>Profitability is not currently tracked per job. As more services are introduced, understanding what each job earns is another part of the operational picture that needs attention.</p>
          </div>
          <div className="mt-10 grid items-start gap-8 sm:grid-cols-2">
            <figure>
              <Image src={`${mediaRoot}/photos/WhatsApp Image 2026-09-09 at 07.27.15.jpeg`}
                alt="Grey upholstered dining chairs standing outdoors, with cleaning passes visible in the fabric."
                width={1200} height={1600} sizes="(min-width: 768px) 34vw, (min-width: 640px) 44vw, 92vw"
                className="guardian-media-image" />
              <figcaption className="guardian-media-caption">Upholstered chairs documented during Guardian Enviroclean&apos;s work. A record of a job, not a measured Community Build outcome.</figcaption>
            </figure>
            <div className="guardian-story-copy">
              <p>There is also no consistent post-job process for asking for reviews or encouraging repeat business. Recommendations already happen; the follow-through after a job is an area to explore.</p>
              <p>Discovery is therefore about more than a digital presence. We are exploring how bookings, job information and customer follow-up can support the trust Guardian has already earned as it grows.</p>
            </div>
          </div>
        </div>
      </section>

      <div className="case-study-section editorial-grid">
        <p className="col-span-12 chapter-label md:col-span-2">Still ahead</p>
        <div className="col-span-12 mt-8 md:col-start-3 md:col-span-9 md:mt-0">
          <section aria-labelledby="guardian-built" className="border-t border-line pt-6">
            <h2 id="guardian-built" className="chapter-label">03 / What we built</h2>
            <p className="mt-4 text-lg">In progress.</p>
            <p className="guardian-media-caption">The intervention has not been built yet.</p>
          </section>
          <section aria-labelledby="guardian-after" className="mt-10 border-t border-line pt-6">
            <h2 id="guardian-after" className="chapter-label">04 / What happened afterwards</h2>
            <p className="mt-4 text-lg">In progress.</p>
            <p className="guardian-media-caption">There is no outcome data yet.</p>
          </section>
          <Link href="/#community-build-001" className="text-link mt-12">Back to Community Builds <span aria-hidden="true">←</span></Link>
        </div>
      </div>
    </article>
  );
}
