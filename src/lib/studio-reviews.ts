import "server-only";
import { getSupabaseAdmin } from "@/lib/supabase-admin";

export type StudioReviewSummary = {
  id: string;
  reference: string;
  status: string;
  engagementType: string;
  environment: string;
  startDate: string | null;
  endDate: string | null;
  clientName: string;
  productName: string;
};

export type StudioEvidenceItem = {
  id: string;
  kind: string;
  title: string;
  description: string | null;
  url: string | null;
  storagePath: string | null;
  capturedAt: string | null;
};

export type StudioAssumptionDetail = {
  id: string;
  reference: string;
  statement: string;
  status: string;
  confidence: string;
};

export type StudioFindingDetail = {
  id: string;
  title: string;
  lens: string;
  observation: string;
  consequence: string;
  recommendation: string;
  classification: string;
  horizon: string;
  evidenceStatus: string;
  confidence: string;
  status: string;
  journeys: { id: string; name: string }[];
  evidence: StudioEvidenceItem[];
};

export type StudioReviewDetail = {
  id: string;
  reference: string;
  status: string;
  engagementType: string;
  reviewQuestion: string;
  scope: string;
  environment: string;
  startDate: string | null;
  endDate: string | null;
  timeSpentMinutes: number | null;
  commercialValueAmount: number | null;
  commercialValueCurrency: string;
  commercialNotes: string | null;
  limitations: string | null;
  notes: string | null;
  client: { id: string; name: string };
  product: { id: string; name: string };
  journeys: { id: string; name: string; description: string | null }[];
  findings: StudioFindingDetail[];
  assumptions: StudioAssumptionDetail[];
  reports: { id: string; version: number; status: string; notes: string | null; createdAt: string }[];
};

/** Server-only. Every caller must have already passed requireStudioAdmin(). */
function admin() {
  const client = getSupabaseAdmin();
  if (!client) throw new Error("Studio data is not available yet.");
  return client;
}

export async function listStudioReviews(): Promise<StudioReviewSummary[]> {
  const supabase = admin();
  const { data: reviews, error: reviewsError } = await supabase
    .from("studio_reviews")
    .select("id, reference, status, engagement_type, environment, start_date, end_date, product_id")
    .order("created_at", { ascending: false });
  if (reviewsError) throw new Error("Unable to load reviews.");
  if (!reviews || reviews.length === 0) return [];

  const productIds = [...new Set(reviews.map(review => review.product_id))];
  const { data: products, error: productsError } = await supabase
    .from("studio_products").select("id, name, client_id").in("id", productIds);
  if (productsError) throw new Error("Unable to load reviews.");

  const clientIds = [...new Set((products ?? []).map(product => product.client_id))];
  const { data: clients, error: clientsError } = await supabase
    .from("studio_clients").select("id, name").in("id", clientIds);
  if (clientsError) throw new Error("Unable to load reviews.");

  const clientNameById = new Map((clients ?? []).map(client => [client.id, client.name]));
  const productById = new Map((products ?? []).map(product => [product.id, product]));

  return reviews.map(review => {
    const product = productById.get(review.product_id);
    return {
      id: review.id,
      reference: review.reference,
      status: review.status,
      engagementType: review.engagement_type,
      environment: review.environment,
      startDate: review.start_date,
      endDate: review.end_date,
      productName: product?.name ?? "—",
      clientName: (product && clientNameById.get(product.client_id)) ?? "—",
    };
  });
}

export async function getStudioReviewDetail(id: string): Promise<StudioReviewDetail | null> {
  const supabase = admin();
  const { data: review, error: reviewError } = await supabase
    .from("studio_reviews").select("*").eq("id", id).maybeSingle();
  if (reviewError) throw new Error("Unable to load this review.");
  if (!review) return null;

  const [
    { data: product, error: productError },
    { data: journeys, error: journeysError },
    { data: findings, error: findingsError },
    { data: assumptions, error: assumptionsError },
    { data: reports, error: reportsError },
  ] = await Promise.all([
    supabase.from("studio_products").select("id, name, client_id").eq("id", review.product_id).maybeSingle(),
    supabase.from("studio_review_journeys").select("id, name, description").eq("review_id", id).order("name"),
    supabase.from("studio_findings").select("*").eq("review_id", id).order("created_at"),
    supabase.from("studio_review_assumptions").select("id, reference, statement, status, confidence").eq("review_id", id).order("reference"),
    supabase.from("studio_reports").select("id, version, status, notes, created_at").eq("review_id", id).order("version", { ascending: false }),
  ]);
  if (productError || journeysError || findingsError || assumptionsError || reportsError) throw new Error("Unable to load this review.");

  const { data: client, error: clientError } = product
    ? await supabase.from("studio_clients").select("id, name").eq("id", product.client_id).maybeSingle()
    : { data: null, error: null };
  if (clientError) throw new Error("Unable to load this review.");

  const journeyById = new Map((journeys ?? []).map(journey => [journey.id, journey]));
  const findingIds = (findings ?? []).map(finding => finding.id);
  const evidenceByFinding = new Map<string, StudioEvidenceItem[]>();
  const journeysByFinding = new Map<string, { id: string; name: string }[]>();

  if (findingIds.length > 0) {
    const [
      { data: evidence, error: evidenceError },
      { data: findingJourneys, error: findingJourneysError },
    ] = await Promise.all([
      supabase.from("studio_evidence").select("*").in("finding_id", findingIds).order("created_at"),
      supabase.from("studio_finding_journeys").select("finding_id, journey_id").in("finding_id", findingIds),
    ]);
    if (evidenceError || findingJourneysError) throw new Error("Unable to load this review.");

    for (const item of evidence ?? []) {
      const list = evidenceByFinding.get(item.finding_id) ?? [];
      list.push({
        id: item.id, kind: item.kind, title: item.title, description: item.description,
        url: item.url, storagePath: item.storage_path, capturedAt: item.captured_at,
      });
      evidenceByFinding.set(item.finding_id, list);
    }
    for (const link of findingJourneys ?? []) {
      const journey = journeyById.get(link.journey_id);
      if (!journey) continue;
      const list = journeysByFinding.get(link.finding_id) ?? [];
      list.push({ id: journey.id, name: journey.name });
      journeysByFinding.set(link.finding_id, list);
    }
  }

  return {
    id: review.id,
    reference: review.reference,
    status: review.status,
    engagementType: review.engagement_type,
    reviewQuestion: review.review_question,
    scope: review.scope,
    environment: review.environment,
    startDate: review.start_date,
    endDate: review.end_date,
    timeSpentMinutes: review.time_spent_minutes,
    commercialValueAmount: review.commercial_value_amount,
    commercialValueCurrency: review.commercial_value_currency,
    commercialNotes: review.commercial_notes,
    limitations: review.limitations,
    notes: review.notes,
    client: { id: client?.id ?? "", name: client?.name ?? "—" },
    product: { id: product?.id ?? "", name: product?.name ?? "—" },
    journeys: (journeys ?? []).map(journey => ({ id: journey.id, name: journey.name, description: journey.description })),
    findings: (findings ?? []).map(finding => ({
      id: finding.id,
      title: finding.title,
      lens: finding.lens,
      observation: finding.observation,
      consequence: finding.consequence,
      recommendation: finding.recommendation,
      classification: finding.classification,
      horizon: finding.horizon,
      evidenceStatus: finding.evidence_status,
      confidence: finding.confidence,
      status: finding.status,
      journeys: journeysByFinding.get(finding.id) ?? [],
      evidence: evidenceByFinding.get(finding.id) ?? [],
    })),
    assumptions: (assumptions ?? []).map(assumption => ({
      id: assumption.id,
      reference: assumption.reference,
      statement: assumption.statement,
      status: assumption.status,
      confidence: assumption.confidence,
    })),
    reports: (reports ?? []).map(report => ({
      id: report.id, version: report.version, status: report.status, notes: report.notes, createdAt: report.created_at,
    })),
  };
}
