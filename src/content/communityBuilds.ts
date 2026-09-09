export type CommunityBuildStatus = "IN PROGRESS" | "LIVE" | "COMPLETE";

// The four-part shape a future Community Build case study will follow —
// declared now so a case-study page can be added later without redesigning
// this type. Left optional/absent until there's real content to add.
export type CommunityBuildStory = {
  start: string;
  learned: string;
  built: string;
  after: string;
};

export type CommunityBuildImage = {
  src: string;
  alt: string;
};

export type CommunityBuildMedia = {
  primary: CommunityBuildImage;
  // Additional documentary photographs, shown after the primary image.
  rotation?: CommunityBuildImage[];
};

export type CommunityBuild = {
  id: string;
  number: string;
  status: CommunityBuildStatus;
  name: string;
  location: string;
  sector: string;
  description: string;
  focusLabel: string;
  focusItems: string[];
  actionLabel: string;
  caseStudyUrl?: string;
  media?: CommunityBuildMedia;
  story?: CommunityBuildStory;
};

export const communityBuilds: CommunityBuild[] = [
  {
    id: "guardian-enviroclean",
    number: "001",
    status: "IN PROGRESS",
    name: "Guardian Enviroclean",
    location: "Pretoria",
    sector: "Professional Cleaning",
    description:
      "Guardian Enviroclean has built something valuable: customers who trust the work enough to recommend it. Now we're helping build the systems around that trust, so fewer opportunities are lost as the business grows.",
    focusLabel: "What we're working on",
    focusItems: [
      "Digital presence",
      "Booking & scheduling",
      "Customer journey",
      "Job & profitability tracking",
      "Reviews & repeat business",
    ],
    actionLabel: "Follow the build",
    caseStudyUrl: "/community-builds/guardian-enviroclean",
    media: {
      primary: {
      src: "/community-builds/guardian-enviroclean/photos/WhatsApp Image 2026-09-09 at 07.27.04.jpeg",
      alt: "Blue patterned rug on a wet work floor, with a rotary cleaning machine and extraction head behind it.",
      },
      rotation: [
        {
          src: "/community-builds/guardian-enviroclean/photos/WhatsApp Image 2026-09-09 at 07.26.58.jpeg",
          alt: "Patterned armchair with visibly cleaner upholstery and its seat cushion removed, in Guardian Enviroclean's outdoor work area.",
        },
        {
          src: "/community-builds/guardian-enviroclean/photos/WhatsApp Image 2026-09-09 at 07.27.15.jpeg",
          alt: "Grey upholstered dining chairs standing outdoors, with cleaning passes visible in the fabric.",
        },
      ],
    },
  },
];
