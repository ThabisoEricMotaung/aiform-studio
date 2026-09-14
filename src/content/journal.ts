export type JournalCategory = "Procurement" | "Research" | "Technology" | "Building" | "Observations";

export type JournalBlock =
  | { type: "heading"; level: 2 | 3; text: string }
  | { type: "paragraph"; text: string }
  | { type: "quote"; text: string; attribution?: string }
  | { type: "list"; ordered?: boolean; items: string[] }
  | { type: "table"; headers: string[]; rows: string[][] }
  | { type: "figure"; src: string; alt: string; caption?: string; attribution?: string }
  | { type: "callout"; title?: string; text: string }
  | { type: "references"; items: { label: string; href: string }[] }
  | { type: "footnotes"; items: string[] };

export type JournalEntry = {
  title: string;
  slug: string;
  excerpt: string;
  publishedAt: string;
  updatedAt?: string;
  author: string;
  category: JournalCategory;
  tags: string[];
  heroImage?: { src: string; alt: string; attribution?: string };
  readingTime: string;
  seoTitle: string;
  seoDescription: string;
  status: "draft" | "published";
  body: JournalBlock[];
};

// Local entries remain the Journal source of record; only published entries
// appear in public routes and the sitemap.
export const journalEntries: JournalEntry[] = [
  {
    title: "What changed in South African procurement this week—and what didn't",
    slug: "procurement-field-notes-september-2026",
    excerpt: "Five procurement developments worth separating from the noise.",
    publishedAt: "2026-09-14",
    author: "AiForm Studio",
    category: "Procurement",
    tags: ["South African procurement", "eTenders", "supplier compliance"],
    readingTime: "6 min read",
    seoTitle: "South African procurement field notes | 8–14 September 2026",
    seoDescription: "A careful look at intergovernmental procurement, beneficial-ownership enforcement and public procurement data.",
    status: "published",
    body: [
      { type: "paragraph", text: "Procurement information is only useful when its status is clear. A published agreement is not an open bid. A company absent from a warning list is not necessarily compliant. A proposed bill is not a rule. Those distinctions shaped our reading of the week from 8 to 14 September 2026." },
      { type: "callout", title: "The short version", text: "Treasury's new route for direct procurement between organs of state and CIPC's beneficial-ownership enforcement have immediate operational relevance. SALGA's supplier portal and Treasury's payment dashboard are useful sources, but they should not be mistaken for new nationwide opportunity feeds. A potentially significant procurement bill remains only a proposal." },
      { type: "heading", level: 2, text: "Some new eTenders records will not be opportunities" },
      { type: "paragraph", text: "National Treasury's PFMA SCM Instruction 13 of 2026/27, effective from 14 September 2026 for one year, permits qualifying organs of state to procure directly from another organ of state when the arrangement is cost-effective and the supplier is legally permitted to provide the goods or services. It requires a written assessment and agreement, subcontracting controls, and publication of agreement information on eTenders within 14 days." },
      { type: "paragraph", text: "A newly published intergovernmental agreement may reveal useful market information, but it is not an invitation for a private supplier to bid. Readers and discovery systems both need to preserve that distinction." },
      { type: "callout", title: "For suppliers", text: "Check the notice type and underlying documents before treating a new eTenders record as an open opportunity. Publication alone does not mean bids are invited." },
      { type: "heading", level: 2, text: "Beneficial-ownership filings deserve a separate check" },
      { type: "paragraph", text: "CIPC Customer Notice 44 of 2026 reiterates that entities persistently failing to file beneficial-ownership information may be published. An entity still non-compliant ten business days after publication may receive a Companies Act compliance notice. The obligation also applies to dormant or inactive companies and close corporations." },
      { type: "paragraph", text: "Legal existence and current filing status are different questions. Equally, absence from a published non-compliance list is not proof that all filings are current. Any supplier-readiness claim should say what was checked, when, and against which source." },
      { type: "heading", level: 2, text: "SALGA's portal has a defined scope" },
      { type: "paragraph", text: "SALGA describes its supplier portal as brand new. It supports registration and steps across the supplier journey, including acquisitions, bid documents, briefing registration, clarifications, electronic responses, awards, purchase orders and invoices. Registration calls for CSD details, including the unique registration reference." },
      { type: "paragraph", text: "The portal is relevant to suppliers working with SALGA. SALGA's association with South Africa's municipalities does not establish that the portal aggregates procurement from every municipality. Coverage should never be claimed more broadly than the evidence allows." },
      { type: "heading", level: 2, text: "Payment data is not tender data" },
      { type: "paragraph", text: "Treasury's transparency portal links to a Procurement Payments Dashboard. Its user guide dates earlier versions to November 2025 and February 2026, so this is not a September launch. The dashboard presents procurement-payment information alongside supplier data, with supplier, department, commodity and transaction views." },
      { type: "paragraph", text: "Payments can illuminate spending patterns, but are not interchangeable with bid notices, awards or contracts. The guide also identifies coverage limits: municipalities, state-owned enterprises and some major institutions are excluded; transactions may be aggregated; subcontractors are not visible; and displayed ownership may not represent ultimate beneficial ownership." },
      { type: "heading", level: 2, text: "A significant proposal is still a proposal" },
      { type: "paragraph", text: "The Public Procurement Amendment Bill B22-2026 proposes substantial changes to the current B-BBEE and preference framework. It is a private-member bill under consideration—not enacted legislation, government policy or an effective compliance rule. Its potential impact makes it worth monitoring, not a basis for changing present-day guidance." },
      { type: "heading", level: 2, text: "What connects these developments" },
      { type: "paragraph", text: "The recurring problem is how easily unlike records are collapsed into one label: notice versus opportunity, existence versus compliance, payment versus award, proposal versus law. Good procurement intelligence keeps those distinctions visible. That is more useful than simply counting more records." },
      { type: "callout", title: "Editorial note", text: "This field note reflects sources reviewed for 8–14 September 2026. It is general information, not legal or procurement advice. Check current primary documents and obtain professional advice for decisions affecting a specific bid or entity." },
      { type: "references", items: [
        { label: "National Treasury: PFMA SCM Instruction 13 of 2026/27", href: "https://ocpo.treasury.gov.za/Legislation/Instruction%20Notes/PFMA%20SCM%20Instruction%2013%20of%202026-27%20Procuring%20goods%20%26%20services%20from%20another%20organ%20of%20state.pdf" },
        { label: "CIPC: Customer Notice 44 of 2026", href: "https://www.cipc.co.za/wp-content/uploads/2026/09/Notice-44-of-2026.pdf" },
        { label: "SALGA: Suppliers and vendors", href: "https://www.salga.org.za/suppliers-vendors" },
        { label: "SALGA: Supplier portal guide", href: "https://scmportal.salga.org.za/get-started.pdf" },
        { label: "National Treasury: Procurement Payments Dashboard", href: "https://data.etenders.gov.za/Home/SpendData" },
        { label: "National Treasury: Procurement Payments Dashboard user guide", href: "https://data.etenders.gov.za/Home/DownloadFile/?fileName=Procurement+Payments+Dashboard+User+Guide+Feb+2026.pdf" },
        { label: "Parliament: Bills register", href: "https://www.parliament.gov.za/bills" },
        { label: "Parliamentary Monitoring Group: Bill summary and draft links", href: "https://pmg.org.za/call-for-comment/1761/" },
      ] },
    ],
  },
];

export function getPublishedEntries() {
  return journalEntries.filter((entry) => entry.status === "published");
}

export function getPublishedEntry(slug: string) {
  return getPublishedEntries().find((entry) => entry.slug === slug);
}
