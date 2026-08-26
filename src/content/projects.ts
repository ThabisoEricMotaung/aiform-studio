export type ProjectCategory = "Products" | "Client Systems" | "Experiments";

export type Project = {
  id: string;
  name: string;
  context?: string;
  category: ProjectCategory;
  sector: string;
  status: "LIVE" | "CLIENT" | "EXPERIMENT";
  summary: string;
  caseStudyUrl?: string;
  liveUrl?: string;
  featured?: boolean;
};

export const projects: Project[] = [
  {
    id: "aiform-procure",
    name: "AiForm Procure",
    category: "Products",
    sector: "Procurement",
    status: "LIVE",
    summary:
      "Public opportunity discovery, supplier compliance evidence and readiness signals in one procurement system.",
    caseStudyUrl: "/work/aiform-procure",
    liveUrl: "https://www.aiformprocure.co.za/",
    featured: true,
  },
  {
    id: "wanotuts",
    name: "WanoTuts",
    context: "Kutlwano Tutoring",
    category: "Client Systems",
    sector: "Education",
    status: "CLIENT",
    summary:
      "A naming, identity and tutoring website built around clearer learner journeys and lesson booking.",
    caseStudyUrl: "/work/wanotuts",
    liveUrl: "https://kutlwano-tutoring.vercel.app/",
    featured: true,
  },
  {
    id: "residential-construction",
    name: "Residential construction",
    category: "Client Systems",
    sector: "Construction",
    status: "CLIENT",
    summary:
      "A portfolio for a Gauteng building business, organised around completed work and direct enquiries.",
  },
  {
    id: "mathabo-crochet",
    name: "Mathabo Crochet",
    category: "Client Systems",
    sector: "Identity",
    status: "CLIENT",
    summary:
      "A visual foundation for a handmade business: identity, palette, typography and social templates.",
  },
  {
    id: "aiform-construct",
    name: "AiForm Construct",
    category: "Experiments",
    sector: "Construction",
    status: "EXPERIMENT",
    summary:
      "An early investigation into permits, contractor verification and clearer project documentation.",
  },
];

export const projectCategories = [
  "All Work",
  ...new Set(projects.map((project) => project.category)),
] as const;
