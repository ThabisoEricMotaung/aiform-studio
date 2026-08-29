export type ProjectCategory = "Products" | "Client Systems" | "Experiments";
export type ProjectStatus = "LIVE" | "PILOT" | "PROTOTYPE" | "IN DEVELOPMENT" | "DELIVERED" | "DESIGN COMPLETE" | "R&D" | "ACTIVE" | "WRITING";

export type Project = {
  id: string;
  name: string;
  context: string;
  category: ProjectCategory;
  type: "Product" | "Client System" | "Experiment";
  sector: string;
  status: ProjectStatus;
  summary: string;
  actionLabel: string;
  actionUrl?: string;
  externalAction?: boolean;
  liveUrl?: string;
  caseStudyUrl?: string;
  featured?: boolean;
};

export const projects: Project[] = [
  { id: "aiform-procure", name: "AiForm Procure", context: "Procurement Suite", category: "Products", type: "Product", sector: "Government Procurement", status: "LIVE", summary: "Public opportunity discovery, supplier compliance evidence and readiness signals in one procurement system.", actionLabel: "View case study", actionUrl: "/work/aiform-procure", caseStudyUrl: "/work/aiform-procure", liveUrl: "https://www.aiformprocure.co.za/", featured: true },
  { id: "aiform-health", name: "AiForm Health", context: "Digital Health Product Direction", category: "Products", type: "Product", sector: "Healthcare", status: "R&D", summary: "AiForm's own exploration into a digital health product direction — internal research, not a commissioned build.", actionLabel: "Read experiment" },
  { id: "private-medical-practice", name: "Private Medical Practice Website", context: "Private Medical Practice", category: "Client Systems", type: "Client System", sector: "Healthcare", status: "PROTOTYPE", summary: "A website concept for a private medical practice, exploring its digital presence, patient information and contact experience — shared for review but not progressed to production delivery.", actionLabel: "Prototype case study" },
  { id: "aiform-cruise", name: "AiForm Cruise", context: "Cruise Booking System", category: "Products", type: "Product", sector: "Tourism", status: "IN DEVELOPMENT", summary: "A cruise booking system in development.", actionLabel: "Coming soon" },
  { id: "wanotuts", name: "WanoTuts", context: "Kutlwano Tutoring Platform", category: "Client Systems", type: "Client System", sector: "Education", status: "LIVE", summary: "A naming, identity and tutoring website built around clearer learner journeys and lesson booking.", actionLabel: "View case study", actionUrl: "/work/wanotuts", caseStudyUrl: "/work/wanotuts", liveUrl: "https://kutlwano-tutoring.vercel.app/", featured: true },
  { id: "residential-construction", name: "Residential Construction", context: "NYAUTSA SS Trading", category: "Client Systems", type: "Client System", sector: "Construction", status: "DELIVERED", summary: "A portfolio for a Gauteng building business, organised around completed work and direct enquiries.", actionLabel: "Visit live website", actionUrl: "https://incredible-cannoli-9f2144.netlify.app/", externalAction: true, liveUrl: "https://incredible-cannoli-9f2144.netlify.app/", featured: true },
  { id: "mathabo-crochet", name: "Mathabo Crochet", context: "Brand Identity & Digital Presence", category: "Client Systems", type: "Client System", sector: "Creative Commerce", status: "DESIGN COMPLETE", summary: "A visual foundation for a handmade business: identity, palette, typography and social templates.", actionLabel: "Identity case study", featured: true },
  { id: "aiform-construct", name: "AiForm Construct", context: "Construction Operations Platform", category: "Experiments", type: "Experiment", sector: "Construction", status: "R&D", summary: "An investigation into permits, contractor verification and clearer project documentation.", actionLabel: "Read experiment", featured: true },
  { id: "aiform-engine", name: "AiForm Engine", context: "Internal Operating System", category: "Experiments", type: "Experiment", sector: "AI Infrastructure", status: "ACTIVE", summary: "The internal operating system behind AiForm's work.", actionLabel: "Explore architecture", actionUrl: "/#system" },
  { id: "procurement-knowledge-base", name: "Procurement Knowledge Base", context: "South African Procurement Reference Book", category: "Experiments", type: "Experiment", sector: "Research / Publishing", status: "WRITING", summary: "A South African procurement reference in development.", actionLabel: "Read journal", actionUrl: "/journal" },
];

export const projectCategories = ["All Work", "Products", "Client Systems", "Experiments"] as const;
