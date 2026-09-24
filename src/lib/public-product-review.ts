import "server-only";
import { cache } from "react";
import { getSupabaseAdmin } from "@/lib/supabase-admin";

// Publication is deliberate, never inferred from a guessable reference alone.
// Add future reviewed/approved references and their issued versions here.
const publications = new Map<string, number>([["PR-2026-001", 1]]);

function clientNotes(notes: string | null) {
  const approved = new Map([
    ["RECOMMENDED DIRECTION", "Recommended direction"],
    ["POSITIVE OBSERVATIONS", "Positive observations"],
    ["WHAT TO LEAVE ALONE", "What to leave alone"],
  ]);
  if (!notes) return [];
  // Unknown standalone headings terminate a section; no fallback to raw notes.
  const headings = [...notes.matchAll(/^([A-Z][A-Z &/\-]+)[ \t]*:?[ \t]*\r?$/gm)];
  return [...approved].flatMap(([label, title]) => {
    const found = headings.filter(heading => heading[1].trim() === label);
    if (found.length !== 1) return [];
    const heading = found[0];
    const index = headings.indexOf(heading);
    const body = notes.slice(heading.index! + heading[0].length, headings[index + 1]?.index ?? notes.length).trim();
    return body ? [{ title, body }] : [];
  });
}

/** Only this explicit projection may cross the public report rendering boundary. */
export const getPublicProductReview = cache(async (reference: string) => {
  const version = publications.get(reference);
  if (!version) return null;
  const db = getSupabaseAdmin();
  if (!db) return null;
  const { data: review, error } = await db.from("studio_reviews")
    .select("id, product_id, reference, review_question, scope, environment, start_date, end_date, limitations, notes")
    .eq("reference", reference).eq("status", "completed").maybeSingle();
  if (error) throw new Error("Unable to load the issued review.");
  if (!review) return null;
  const { data: report, error: reportError } = await db.from("studio_reports")
    .select("version, status").eq("review_id", review.id).eq("version", version).eq("status", "issued").maybeSingle();
  if (reportError) throw new Error("Unable to load the issued review.");
  if (!report) return null;

  const [productResult, journeysResult, findingsResult, assumptionsResult] = await Promise.all([
    db.from("studio_products").select("name, client_id").eq("id", review.product_id).maybeSingle(),
    db.from("studio_review_journeys").select("id, name").eq("review_id", review.id).order("name"),
    db.from("studio_findings").select("id, title, lens, classification, horizon, observation, consequence, recommendation, evidence_status, confidence")
      .eq("review_id", review.id).in("status", ["confirmed", "published"]).order("created_at"),
    db.from("studio_review_assumptions").select("reference, statement, status, confidence").eq("review_id", review.id).order("reference"),
  ]);
  if ([productResult, journeysResult, findingsResult, assumptionsResult].some(result => result.error)) {
    throw new Error("Unable to load the issued review.");
  }
  const product = productResult.data;
  if (!product) return null;
  const { data: client, error: clientError } = await db.from("studio_clients").select("name").eq("id", product.client_id).maybeSingle();
  if (clientError) throw new Error("Unable to load the issued review.");
  if (!client) return null;
  const findings = findingsResult.data ?? [];
  const journeys = journeysResult.data ?? [];
  const linkedNames = new Map<string, string[]>();
  if (findings.length) {
    const { data: links, error: linksError } = await db.from("studio_finding_journeys")
      .select("finding_id, journey_id").in("finding_id", findings.map(finding => finding.id));
    if (linksError) throw new Error("Unable to load the issued review.");
    for (const finding of findings) {
      const ids = new Set((links ?? []).filter(link => link.finding_id === finding.id).map(link => link.journey_id));
      linkedNames.set(finding.id, journeys.filter(journey => ids.has(journey.id)).map(journey => journey.name));
    }
  }
  // No row spreading: UUIDs and raw notes remain server-local. Evidence is not queried.
  return {
    reference: review.reference as string,
    version: report.version as number,
    status: report.status as string,
    product: product.name as string,
    client: client.name as string,
    date: (review.end_date ?? review.start_date) as string | null,
    question: review.review_question as string,
    scope: review.scope as string,
    environment: review.environment as string,
    limitations: review.limitations as string | null,
    direction: clientNotes(review.notes),
    journeys: journeys.map(journey => journey.name as string),
    findings: findings.map(finding => ({
      title: finding.title as string, lens: finding.lens as string,
      classification: finding.classification as string, horizon: finding.horizon as string,
      observation: finding.observation as string, consequence: finding.consequence as string,
      recommendation: finding.recommendation as string, evidenceStatus: finding.evidence_status as string,
      confidence: finding.confidence as string, journeys: linkedNames.get(finding.id) ?? [],
    })),
    assumptions: (assumptionsResult.data ?? []).map(item => ({
      reference: item.reference as string, statement: item.statement as string,
      status: item.status as string, confidence: item.confidence as string,
    })),
  };
});
