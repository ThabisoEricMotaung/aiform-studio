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

// A connected run of entries (e.g. "Procurement Notes"). `context` is the
// optional secondary line shown under the series name (e.g. "Building AiForm
// Procure"); `number` is this entry's position within the series.
export type JournalSeries = { name: string; context?: string; number: number };

// The editorial bridge from an essay back to the Studio work it came from —
// renders as the restrained "Built from this thinking" module, never a sales CTA.
export type JournalRelatedProject = { name: string; description: string; href: string };

export type JournalEntry = {
  title: string;
  slug: string;
  subtitle?: string;
  excerpt: string;
  publishedAt: string;
  updatedAt?: string;
  author: string;
  category: JournalCategory;
  tags: string[];
  series?: JournalSeries;
  relatedProject?: JournalRelatedProject;
  // Marks the entry the Journal landing page should lead with, regardless of
  // publish date. Falls back to the most recently published entry when unset.
  featured?: boolean;
  heroImage?: { src: string; alt: string; attribution?: string; width?: number; height?: number };
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

  // Procurement Notes — a connected series on lessons from building AiForm
  // Procure. 01 and 02 below are scaffolding only: metadata, series position
  // and the related-project bridge are final, but the body is a placeholder.
  // Replace the single "callout" block with the final compact/wrapped essay
  // text, then flip status to "published" — that alone brings the entry into
  // the sitemap, the Journal index and the Procurement Notes series rail.
  // 03 is the first fully published entry in the series.
  {
    title: "South Africa Doesn't Have a Tender Shortage. It Has a Tender Discovery Problem.",
    slug: "south-africas-tender-discovery-problem",
    excerpt: "Core question: can suppliers find the opportunity?",
    publishedAt: "2026-09-15",
    author: "TE Motaung",
    category: "Procurement",
    tags: ["South African procurement", "tender discovery", "AiForm Procure"],
    series: { name: "Procurement Notes", context: "Building AiForm Procure", number: 1 },
    relatedProject: {
      name: "AiForm Procure",
      description: "A South African procurement platform exploring how discovery, supplier verification and opportunity intelligence can support better procurement decisions.",
      href: "/work/aiform-procure",
    },
    readingTime: "— min read",
    seoTitle: "South Africa Doesn't Have a Tender Shortage. It Has a Tender Discovery Problem.",
    seoDescription: "Core question: can suppliers find the opportunity? Procurement Notes 01, on building AiForm Procure.",
    status: "draft",
    body: [
      { type: "callout", title: "Final copy pending", text: "Insert the final compact/wrapped article text here, as full paragraphs (short standalone lines reserved for genuine emphasis). Do not publish until this placeholder is replaced with the final essay." },
    ],
  },
  {
    title: "Supplier Compliance Is Reusable. Tender Compliance Is Contextual.",
    slug: "supplier-compliance-is-reusable-tender-compliance-is-contextual",
    excerpt: "A supplier can maintain its core compliance information. A tender still has to be understood. The distinction between reusable supplier compliance and contextual tender compliance changes what “tender ready” should mean.",
    publishedAt: "2026-09-17",
    author: "Thabiso Motaung",
    category: "Procurement",
    tags: ["South African procurement", "supplier compliance", "AiForm Procure"],
    series: { name: "Procurement Notes", context: "Building AiForm Procure", number: 4 },
    relatedProject: {
      name: "AiForm Procure",
      description: "A South African procurement platform exploring how discovery, supplier verification and opportunity intelligence can support better procurement decisions.",
      href: "/work/aiform-procure",
    },
    readingTime: "4 min read",
    seoTitle: "Supplier Compliance Is Reusable. Tender Compliance Is Contextual.",
    seoDescription: "A supplier can maintain its core compliance information. A tender still has to be understood. Procurement Notes 04, on building AiForm Procure.",
    status: "published",
    body: [
      { type: "paragraph", text: "There is a phrase that comes up often in public procurement: tender ready." },
      { type: "paragraph", text: "It sounds useful. A business has registered on the necessary systems, collected its documents, sorted out its tax affairs and assembled the paperwork it expects to need. It is ready to tender." },
      { type: "paragraph", text: "But the more I work around procurement information and supplier readiness, the less useful I find the idea of tender readiness as a permanent state." },
      { type: "paragraph", text: "A supplier can be ready." },
      { type: "paragraph", text: "A tender still has to be understood." },
      { type: "paragraph", text: "That distinction matters because public procurement contains at least two different compliance problems. One belongs to the supplier. The other belongs to the opportunity." },

      { type: "heading", level: 2, text: "The reusable layer" },
      { type: "paragraph", text: "Some information follows a supplier from one opportunity to the next." },
      { type: "paragraph", text: "Company registration details do not need to be rediscovered every time a tender appears. Neither should core supplier information, banking details, tax-compliance evidence, B-BBEE documentation or other records that establish who the business is and whether it meets recurring administrative requirements." },
      { type: "paragraph", text: "These documents change, expire or require verification at different intervals, but conceptually they form a reusable supplier profile." },
      { type: "paragraph", text: "This is the part of compliance that lends itself naturally to infrastructure." },
      { type: "paragraph", text: "A supplier should be able to maintain this information once, know what is current, know what is approaching expiry and reuse verified information where appropriate." },
      { type: "paragraph", text: "That is very different from starting from a folder of PDFs every time a new opportunity appears." },
      { type: "paragraph", text: "But maintaining this layer well does not make every tender suitable for that supplier." },
      { type: "paragraph", text: "It simply means the supplier has taken care of the part of readiness that belongs to the supplier." },

      { type: "heading", level: 2, text: "Then the tender changes the question" },
      { type: "paragraph", text: "Every opportunity introduces context." },
      { type: "paragraph", text: "A tender may require a compulsory briefing session. Another may require a particular CIDB grading. One may ask for evidence of previous contracts of a certain size. Another may require specific technical personnel, certifications, samples, equipment or references." },
      { type: "paragraph", text: "There may be tender-specific declarations and returnable schedules." },
      { type: "paragraph", text: "There may be functionality thresholds." },
      { type: "paragraph", text: "There may be pricing instructions that have to be followed precisely." },
      { type: "paragraph", text: "There may be requirements around the method of submission, the format of documents and the time by which a response must physically or electronically arrive." },
      { type: "paragraph", text: "And there is always the question that precedes all of these:" },
      { type: "paragraph", text: "Is this actually an opportunity this supplier should pursue?" },
      { type: "paragraph", text: "That cannot be answered by a green compliance badge." },

      { type: "heading", level: 2, text: "Compliance is not one thing" },
      { type: "paragraph", text: "This is where I think procurement software can oversimplify the problem." },
      { type: "paragraph", text: "It is tempting to represent compliance as a single percentage." },
      { type: "paragraph", text: "80% complete." },
      { type: "paragraph", text: "92% ready." },
      { type: "paragraph", text: "100% compliant." },
      { type: "paragraph", text: "Those numbers can be useful when they describe something specific. A supplier profile can be complete. A set of documents can be verified. A recurring administrative requirement can be satisfied." },
      { type: "paragraph", text: "The problem begins when that score quietly starts to mean something larger." },
      { type: "paragraph", text: "A supplier with every reusable document in place may still be completely unsuitable for a particular tender." },
      { type: "paragraph", text: "Conversely, a supplier that appears administratively incomplete may be an excellent operational match for an opportunity but need to resolve a small number of documents before submission." },
      { type: "paragraph", text: "These are different conditions." },
      { type: "paragraph", text: "Collapsing them into one measure creates certainty where there should be questions." },

      { type: "heading", level: 2, text: "The real work happens at the intersection" },
      { type: "paragraph", text: "A tender becomes actionable when supplier information is evaluated against opportunity requirements." },
      { type: "paragraph", text: "That intersection is where much of the difficult work sits." },
      { type: "paragraph", text: "What does the tender require?" },
      { type: "paragraph", text: "Which requirements are compulsory?" },
      { type: "paragraph", text: "Which are administrative?" },
      { type: "paragraph", text: "Which relate to capability?" },
      { type: "paragraph", text: "Which evidence does the supplier already have?" },
      { type: "paragraph", text: "Which documents are missing?" },
      { type: "paragraph", text: "Which requirements cannot realistically be satisfied?" },
      { type: "paragraph", text: "Which deadlines or briefing dates change the decision?" },
      { type: "paragraph", text: "And, ultimately, is preparing this bid a sensible use of the supplier's time?" },
      { type: "paragraph", text: "This is why I increasingly think of procurement readiness as a matching problem rather than simply a document problem." },
      { type: "paragraph", text: "The reusable supplier layer tells us what the business can demonstrate." },
      { type: "paragraph", text: "The tender layer tells us what this particular opportunity demands." },
      { type: "paragraph", text: "Useful procurement intelligence connects the two." },

      { type: "heading", level: 2, text: "Better discovery should reduce wasted bids" },
      { type: "paragraph", text: "Tender platforms are naturally good at finding opportunities." },
      { type: "paragraph", text: "That is important. A supplier cannot pursue an opportunity it never discovers." },
      { type: "paragraph", text: "But discovery creates another problem: once hundreds or thousands of opportunities become searchable, suppliers need increasingly good ways to decide which ones deserve attention." },
      { type: "paragraph", text: "More tender notifications do not necessarily produce better procurement outcomes." },
      { type: "paragraph", text: "Sometimes they simply produce more reading." },
      { type: "paragraph", text: "The next useful layer is therefore not only finding tenders that contain the right keywords. It is progressively understanding whether an opportunity fits the supplier receiving it." },
      { type: "paragraph", text: "Sector matters." },
      { type: "paragraph", text: "Location matters." },
      { type: "paragraph", text: "Contract size matters." },
      { type: "paragraph", text: "Experience matters." },
      { type: "paragraph", text: "Qualifications and registrations matter." },
      { type: "paragraph", text: "Timing matters." },
      { type: "paragraph", text: "Compliance matters." },
      { type: "paragraph", text: "And the requirements written inside the tender document matter." },
      { type: "paragraph", text: "The closer those signals can be brought together, the less time a supplier has to spend discovering that an apparently attractive tender was never realistically theirs to pursue." },

      { type: "heading", level: 2, text: "This changes what “tender ready” should mean" },
      { type: "paragraph", text: "Perhaps tender readiness should not describe a supplier that has accumulated every possible document." },
      { type: "paragraph", text: "It should describe a supplier whose reusable information is organised well enough that the business can quickly evaluate a new opportunity." },
      { type: "paragraph", text: "That is a more demanding definition, but also a more useful one." },
      { type: "paragraph", text: "The objective is not to eliminate human judgement from tendering. Procurement documents contain context, ambiguity and commercial decisions that software should not pretend away." },
      { type: "paragraph", text: "The objective is to give that judgement better information." },
      { type: "paragraph", text: "A supplier should be able to see what is already in place, what the opportunity requires, where the gaps are and what deserves closer attention." },
      { type: "paragraph", text: "Then a person can make the decision." },

      { type: "heading", level: 2, text: "Two layers, one decision" },
      { type: "paragraph", text: "This distinction is becoming increasingly important in how I think about AiForm Procure." },
      { type: "paragraph", text: "Supplier compliance is reusable." },
      { type: "paragraph", text: "Tender compliance is contextual." },
      { type: "paragraph", text: "One can be maintained over time. The other has to be evaluated again and again as opportunities change." },
      { type: "paragraph", text: "Good procurement infrastructure should understand both." },
      { type: "paragraph", text: "Because the useful question is not simply whether a supplier is compliant." },
      { type: "paragraph", text: "It is whether the right evidence of compliance can be assembled, tested and understood in the context of the opportunity in front of them." },
    ],
  },
  {
    title: "The Goal Isn't More Bids. It's Better Bid Decisions.",
    slug: "the-goal-isnt-more-bids",
    subtitle: "Why finding more tenders is only useful if suppliers can decide which opportunities are actually worth pursuing",
    excerpt: "Why finding more tenders is only useful if suppliers can decide which opportunities are actually worth pursuing.",
    publishedAt: "2026-09-14",
    author: "TE Motaung",
    category: "Procurement",
    tags: ["South African procurement", "bid decisions", "AiForm Procure"],
    series: { name: "Procurement Notes", context: "Building AiForm Procure", number: 3 },
    relatedProject: {
      name: "AiForm Procure",
      description: "A South African procurement platform exploring how discovery, supplier verification and opportunity intelligence can support better procurement decisions.",
      href: "/work/aiform-procure",
    },
    heroImage: {
      src: "/images/the-goal-isnt-more-bids-cover.png",
      alt: "A business professional walks through a minimalist architectural space toward diverging paths, representing the judgement and choices involved in deciding which procurement opportunities to pursue.",
      width: 1536,
      height: 1024,
    },
    readingTime: "6 min read",
    seoTitle: "The Goal Isn't More Bids. It's Better Bid Decisions.",
    seoDescription: "Why finding more tenders is only useful if suppliers can decide which opportunities are actually worth pursuing. Procurement Notes 03, on building AiForm Procure.",
    status: "published",
    body: [
      { type: "paragraph", text: "One of the easiest ways to describe a tender platform is by volume." },
      { type: "paragraph", text: "How many opportunities are available? How many sources are being monitored? How many new tenders were added today? To me, those numbers matter; hence, I pay attention to them while building AiForm Procure too. But I'm becoming increasingly convinced that they are not the most important measure of whether procurement technology is actually useful to a supplier. This is because a supplier doesn't need to bid on more tenders; it needs to make better decisions about which tenders deserve a bid in the first place. And those are two very different objectives." },

      { type: "heading", level: 2, text: "Discovery solves only the first problem" },
      { type: "paragraph", text: "Public procurement can be difficult to navigate because different institutions publish opportunities across different sources, at different times, and in different formats. That creates an obvious technology problem: make those opportunities easier to discover." },
      { type: "paragraph", text: "Aggregation helps. Search helps. Filters help. Alerts help. And matching helps. However, these things can dramatically reduce the amount of time a supplier spends looking for opportunities. There is, however, a point at which better discovery creates another problem." },
      { type: "paragraph", text: "You find more." },
      { type: "paragraph", text: "Now what?" },
      { type: "paragraph", text: "If a business moves from seeing 20 opportunities to seeing 2,000, we haven't necessarily made procurement easier. We may simply have replaced scarcity of information with abundance of information. The next problem becomes judgement." },

      { type: "heading", level: 2, text: "Relevant doesn't necessarily mean suitable" },
      { type: "paragraph", text: "Imagine a cleaning company receives a tender match. The category is correct while the location is within its operating area. Further, the closing date gives the business enough time to respond. On the surface, that's a good match. Then the supplier opens the documents. Perhaps the contract requires experience at a scale the company cannot demonstrate. Perhaps there is a compulsory briefing it has already missed. Perhaps the required equipment would demand substantial upfront capital. Perhaps the payment structure would put too much pressure on cash flow. Or perhaps the tender requires certifications, personnel, or previous projects the supplier cannot prove." },
      { type: "paragraph", text: "The matching system wasn't necessarily wrong." },
      { type: "paragraph", text: "The opportunity is relevant." },
      { type: "paragraph", text: "It just isn't necessarily pursuable." },
      { type: "paragraph", text: "That's an important distinction." },

      { type: "heading", level: 2, text: "A match should start a decision, not finish one" },
      { type: "paragraph", text: "This is something I've been thinking about quite a lot while building AiForm Procure. Procurement technology naturally wants to become smarter. We want better recommendations, better matching, better alerts, and better supplier profiles." },
      { type: "paragraph", text: "Eventually, it becomes tempting for the technology to say:" },
      { type: "paragraph", text: "“This tender is for you.”" },
      { type: "paragraph", text: "I think we need to be careful with that since a platform can know quite a lot about a supplier, its industry, location, CSD information, B-BBEE information, where applicable, company information, verified records, and its previous areas of work. And increasingly, technology can extract and understand quite a lot about the tender too. But the final bid decision involves something much more contextual." },
      { type: "paragraph", text: "Can this particular business deliver this particular contract, under these particular conditions, at this particular moment?" },
      { type: "paragraph", text: "That's not simply a matching problem, but a business decision." },

      { type: "heading", level: 2, text: "Five questions before a bid" },
      { type: "paragraph", text: "I think a useful procurement platform should increasingly help suppliers answer five questions quickly." },

      { type: "heading", level: 3, text: "1. Do we qualify?" },
      { type: "paragraph", text: "Start with the non-negotiables. Mandatory documents. Registrations. Briefings. Certifications. Grading requirements where applicable. Functionality thresholds. Whatever the tender specifies." },
      { type: "paragraph", text: "If there is a requirement the supplier cannot satisfy, discovering that early is valuable. There is little benefit in spending hours preparing the rest of a submission that cannot progress beyond the compliance stage." },

      { type: "heading", level: 3, text: "2. Can we actually deliver?" },
      { type: "paragraph", text: "This is different from asking whether the tender falls within your industry. A company may provide a particular service but not have the capacity for a contract of that size." },
      { type: "paragraph", text: "Think about people, equipment, suppliers, geography, operational capacity, working capital, and existing commitments. Winning a contract creates an obligation to perform it." },

      { type: "heading", level: 3, text: "3. Can we prove it?" },
      { type: "paragraph", text: "This is one of the subtler procurement problems." },
      { type: "paragraph", text: "Capability and demonstrable capability are not always the same thing." },
      { type: "paragraph", text: "A business may genuinely be able to perform the work. But if the tender requires three reference letters, evidence of previous projects of a certain value, particular qualifications, or specific technical documentation, the evaluation will depend on what the supplier can demonstrate. Knowing this before preparing the bid matters. A lot!" },

      { type: "heading", level: 3, text: "4. Do we have enough time?" },
      { type: "paragraph", text: "This week's AiForm Procure data gave us a useful illustration. On Friday, the platform was tracking 2,085 open RFQs, of which 785 were live and accepting bids. By Monday, the total had barely changed at 2,087. But only 682 were still live and accepting bids." },
      { type: "paragraph", text: "The headline volume barely moved." },
      { type: "paragraph", text: "The opportunity window did." },
      { type: "paragraph", text: "Tender discovery therefore has a time dimension. A perfect opportunity discovered after a compulsory briefing—or hours before closing—isn't particularly useful." },

      { type: "heading", level: 3, text: "5. Does it make business sense?" },
      { type: "paragraph", text: "This may be the most important question of all. Procurement discussions naturally focus on winning. But winning isn't automatically good business." },
      { type: "paragraph", text: "Can you price the work sustainably? Can you fund delivery before payment arrives? What happens if costs increase? What resources will the contract consume? What other work might you have to turn away? What is the risk relative to the potential return?" },
      { type: "paragraph", text: "Sometimes the commercially intelligent decision is to bid. And sometimes it is to walk away." },

      { type: "heading", level: 2, text: "Passing is also a procurement decision" },
      { type: "paragraph", text: "This is perhaps the part we don't celebrate enough. A business spends four hours assessing a tender and decides not to bid. Was that time wasted? Not necessarily." },
      { type: "paragraph", text: "If that assessment prevented the business from spending several days preparing a submission it was unlikely to win—or from winning a contract that would have created serious operational problems—then the assessment created value." },
      { type: "paragraph", text: "A good no-bid decision can be as important as a good bid decision!" },
      { type: "paragraph", text: "That changes how I think about the role of procurement technology. Success shouldn't only be measured by how many opportunities we show you or even how many opportunities you bid on. A better question might eventually be how much unnecessary bidding did we help you avoid?" },

      { type: "heading", level: 2, text: "This matters particularly for smaller businesses" },
      { type: "paragraph", text: "Large organisations can have dedicated bid teams. Someone can monitor opportunities. Someone else can interpret specifications. Finance can model the numbers. Technical staff can assess delivery requirements. Management can make the final decision." },
      { type: "paragraph", text: "Many SMEs don't have that structure." },
      { type: "paragraph", text: "The person discovering the tender may also be the person running the business, preparing quotations, managing staff, speaking to customers, and worrying about cash flow." },
      { type: "paragraph", text: "For that supplier, every unnecessary bid has a real cost. Not only money." },
      { type: "paragraph", text: "Time!" },
      { type: "paragraph", text: "That makes precision more valuable than volume. Ten genuinely relevant opportunities may be considerably more useful than 1,000 loosely related ones. And one opportunity that the business is well positioned to pursue may be worth more than all of them." },

      { type: "heading", level: 2, text: "Where I think procurement technology should go next" },
      { type: "paragraph", text: "The first generation of procurement discovery asks:" },
      { type: "paragraph", text: "Where are the opportunities?" },
      { type: "paragraph", text: "The next asks:" },
      { type: "paragraph", text: "Which opportunities are relevant to me?" },
      { type: "paragraph", text: "I think the more interesting question now is:" },
      { type: "paragraph", text: "Which of those opportunities am I actually positioned to pursue?" },
      { type: "paragraph", text: "That requires several layers to begin working together. Opportunity discovery. Supplier information. Verification. Tender requirements. Matching. Timing. And ultimately, human judgement. This is also where the distinction I wrote about previously becomes important:" },
      { type: "paragraph", text: "Supplier compliance is reusable. Tender compliance is contextual." },
      { type: "paragraph", text: "If a platform already knows verified information about a supplier, the supplier shouldn't have to mentally start from zero every time it opens another opportunity. The technology should help bring what is already known about the business into conversation with what this particular tender requires." },
      { type: "paragraph", text: "Not to manufacture certainty. Not to promise qualification. And certainly not to automatically tell the supplier to bid. But to make the decision easier to understand." },
      { type: "paragraph", text: "Something like:" },
      { type: "paragraph", text: "Here's what appears to match." },
      { type: "paragraph", text: "Here's what requires your attention." },
      { type: "paragraph", text: "Here's what we don't know." },
      { type: "paragraph", text: "Now decide." },

      { type: "heading", level: 2, text: "Better discovery should lead to better judgement" },
      { type: "paragraph", text: "I still believe South African procurement has a discovery problem. Making public opportunities easier to find remains important. But discovery cannot be the destination. If technology simply helps suppliers find more tenders and encourages them to submit more bids, we may only be making an inefficient process happen faster." },
      { type: "paragraph", text: "The more interesting opportunity is to help businesses become more selective. Find the opportunity. Understand it. Assess the fit. Know when to pursue it. And know when to pass." },
      { type: "paragraph", text: "Because ultimately, the goal isn't more tenders. It isn't even more bids." },
      { type: "paragraph", text: "It's better bid decisions." },

      { type: "paragraph", text: "TE Motaung, Founder, AiForm Procure" },
      { type: "paragraph", text: "Find more. Search less." },
    ],
  },
];

export function getPublishedEntries() {
  return journalEntries.filter((entry) => entry.status === "published");
}

export function getPublishedEntry(slug: string) {
  return getPublishedEntries().find((entry) => entry.slug === slug);
}

export function getFeaturedEntry() {
  const published = [...getPublishedEntries()].sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));
  return published.find((entry) => entry.featured) ?? published[0];
}

export function getSeriesEntries(seriesName: string) {
  return getPublishedEntries()
    .filter((entry) => entry.series?.name === seriesName)
    .sort((a, b) => (a.series?.number ?? 0) - (b.series?.number ?? 0));
}

export function getAdjacentSeriesEntries(entry: JournalEntry) {
  if (!entry.series) return { previous: undefined, next: undefined };
  const siblings = getSeriesEntries(entry.series.name);
  const index = siblings.findIndex((sibling) => sibling.slug === entry.slug);
  return { previous: siblings[index - 1], next: siblings[index + 1] };
}

export function getRelatedEntries(entry: JournalEntry, limit = 2) {
  if (!entry.series) return [];
  return getSeriesEntries(entry.series.name)
    .filter((sibling) => sibling.slug !== entry.slug)
    .slice(0, limit);
}
