"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { EXECUTION_STATUS, LEORA_DOCUMENT, SIGNING_CONSENT, type ExecutionReceipt, type SignatureStrokes } from "@/lib/leora-document";
import { signatureSchema } from "@/lib/leora-signing-schema";
import SignaturePad from "./SignaturePad";
import styles from "@/app/documents/leora-group/nda/sign/sign.module.css";

const api = "/api/documents/leora-group/nda";
type Defaults = { name: string; business: string; address: string };
type Stage = "loading" | "access" | "review" | "details" | "complete";

export default function SigningFlow({ available }: { available: boolean }) {
  const [stage, setStage] = useState<Stage>(available ? "loading" : "access");
  const [defaults, setDefaults] = useState<Defaults | null>(null);
  const [receipt, setReceipt] = useState<ExecutionReceipt | null>(null);
  const [signingAs, setSigningAs] = useState("individual");
  const [signature, setSignature] = useState<SignatureStrokes>([]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [opened, setOpened] = useState(false);
  const [reviewed, setReviewed] = useState(false);
  const [needsAccess, setNeedsAccess] = useState(false);
  const heading = useRef<HTMLHeadingElement>(null);
  const submissionLock = useRef(false);

  function acceptState(data: { receipt: ExecutionReceipt | null; defaults: Defaults | null }) {
    setReceipt(data.receipt);
    setDefaults(data.defaults);
    setStage(data.receipt ? "complete" : "review");
  }
  useEffect(() => {
    if (!available) return;
    const controller = new AbortController();
    fetch(api, { cache: "no-store", signal: controller.signal }).then(async (response) => {
      if (!response.ok) { setStage("access"); return; }
      acceptState(await response.json());
    }).catch(() => { if (!controller.signal.aborted) setStage("access"); });
    return () => controller.abort();
  }, [available]);
  useEffect(() => { heading.current?.focus(); }, [stage]);

  async function unlock(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true); setError("");
    const form = event.currentTarget;
    try {
      const response = await fetch(`${api}/session`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: new FormData(form).get("code") }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error);
      form.reset();
      const state = await fetch(api, { cache: "no-store" });
      const data = await state.json();
      if (!state.ok) throw new Error(data.error);
      setNeedsAccess(false);
      if (stage !== "details" || data.receipt) acceptState(data);
    } catch (issue) { setError(issue instanceof Error ? issue.message : "We could not open your signing session. Please try again."); }
    finally { setBusy(false); }
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (submissionLock.current) return;
    setError("");
    if (!signatureSchema.safeParse(signature).success) { setError("Please draw your signature in the signature area before submitting."); return; }
    const formData = new FormData(event.currentTarget);
    const fields = Object.fromEntries(formData.entries());
    submissionLock.current = true; setBusy(true);
    try {
      const response = await fetch(api, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          documentId: LEORA_DOCUMENT.id, documentVersion: LEORA_DOCUMENT.version, documentHash: LEORA_DOCUMENT.sha256,
          name: fields.name, business: fields.business, address: fields.address, signingAs,
          entityName: fields.entityName ?? "", registrationNumber: fields.registrationNumber ?? "", capacity: fields.capacity ?? "",
          signature, consent: fields.consent === "on",
        }),
      });
      const result = await response.json();
      if (!response.ok) {
        if (response.status === 401) setNeedsAccess(true);
        throw new Error(result.error);
      }
      setReceipt(result.receipt); setSignature([]); setDefaults(null); setStage("complete");
    } catch (issue) { setError(issue instanceof Error ? issue.message : "We could not confirm submission. Please retry; your existing record will not be overwritten."); }
    finally { submissionLock.current = false; setBusy(false); }
  }

  if (!available) return (
    <section className={styles.section}>
      <h2>Review the issued agreement</h2>
      <p>Electronic signing is not available yet. You can review or download the agreement while AiForm Studio finishes setting up secure signing.</p>
      <a href={LEORA_DOCUMENT.pdfPath} target="_blank" rel="noopener noreferrer" className={styles.link}>Open issued NDA (PDF, new tab) ↗</a>
      <p className={styles.help}>Please contact AiForm Studio to arrange signing. No signature has been submitted.</p>
    </section>
  );
  if (stage === "loading") return <p className={styles.section} role="status">Checking your signing session…</p>;
  if (stage === "complete" && receipt) return (
    <section className={styles.section} aria-labelledby="completion-title">
      <h2 id="completion-title" ref={heading} tabIndex={-1}>Agreement signed</h2>
      <p>Your signature has been recorded against this version of the Mutual Non-Disclosure Agreement.</p>
      <p className={styles.status}>{EXECUTION_STATUS[receipt.status]}</p>
      <dl className={styles.receipt}>
        <div><dt>Signatory</dt><dd>{receipt.signatory}</dd></div>
        <div><dt>Signed at</dt><dd><time dateTime={receipt.signedAt}>{new Intl.DateTimeFormat("en-ZA", { dateStyle: "long", timeStyle: "short", timeZone: "Africa/Johannesburg" }).format(new Date(receipt.signedAt))} SAST (UTC+02:00)</time></dd></div>
        <div><dt>Document reference</dt><dd>{receipt.reference}</dd></div>
        <div><dt>Execution record</dt><dd>{receipt.id}</dd></div>
      </dl>
      <a href={`${api}/record`} className={styles.primary}>Download execution record (JSON) ↓</a>
      {receipt.status === "fully_executed" ? (
        <a href={`${api}/executed`} className={styles.link}>Open fully executed agreement (PDF) ↗</a>
      ) : (
        <p className={styles.help}>This private record includes your signature and the unchanged issued agreement. A signed PDF has not been generated yet; AiForm Studio still needs to countersign.</p>
      )}
    </section>
  );
  if (stage === "access") return (
    <section className={styles.section}>
      <h2 ref={heading} tabIndex={-1}>Open your signing session</h2>
      <p>Enter the private signing code provided separately by AiForm Studio.</p>
      <form onSubmit={unlock} className={styles.form}>
        <label>Signing code<input name="code" type="password" autoComplete="off" required minLength={32} maxLength={128} spellCheck={false} disabled={busy} /></label>
        {error ? <p role="alert" className={styles.error}>{error}</p> : null}
        <button className={styles.primary} disabled={busy}>{busy ? "Opening…" : "Continue to review"}</button>
      </form>
      <a href={LEORA_DOCUMENT.pdfPath} target="_blank" rel="noopener noreferrer" className={styles.link}>Open issued NDA (PDF, new tab) ↗</a>
    </section>
  );
  if (stage === "review") return (
    <section className={styles.section}>
      <p className={styles.step}>01 / Review</p>
      <h2 ref={heading} tabIndex={-1}>Review the issued agreement</h2>
      <p>Please read the full NDA before continuing. The legal clauses are fixed; your confirmed details and signature will be recorded separately against this exact version.</p>
      <p className={styles.help}>{LEORA_DOCUMENT.reference}</p>
      <a href={`${api}/issued`} target="_blank" rel="noopener noreferrer" className={styles.primary} onClick={() => setOpened(true)}>Open agreement (PDF) ↗<span className={styles.srOnly}> in a new tab</span></a>
      <label className={styles.checkbox}><input type="checkbox" checked={reviewed} onChange={(event) => setReviewed(event.target.checked)} />I have opened and reviewed the full agreement.</label>
      <button className={styles.secondary} disabled={!opened || !reviewed} onClick={() => setStage("details")}>Continue to signing details →</button>
    </section>
  );
  return (<>
    <form onSubmit={submit} className={styles.form}>
      <fieldset disabled={busy} className={styles.section}>
        <legend className={styles.srOnly}>Signatory details and signature</legend>
        <p className={styles.step}>02 / Confirm &amp; sign</p>
        <h2 ref={heading} tabIndex={-1}>Confirm your signing details</h2>
        <p>Correct any details below before signing. These details form part of the execution record and do not edit the issued NDA.</p>
        <a href={`${api}/issued`} target="_blank" rel="noopener noreferrer" className={styles.link}>Review agreement again (PDF, new tab) ↗</a>
        <div className={styles.fields}>
          <label>Name<input name="name" defaultValue={defaults?.name} autoComplete="name" minLength={2} maxLength={200} required /></label>
          <label>Business<input name="business" defaultValue={defaults?.business} autoComplete="organization" minLength={2} maxLength={200} required /></label>
        </div>
        <label>Address<textarea name="address" defaultValue={defaults?.address} autoComplete="street-address" rows={4} minLength={10} maxLength={1000} required /></label>
        <fieldset className={styles.choice}>
          <legend>Signing as</legend>
          <label className={styles.checkbox}><input type="radio" name="signingAs" value="individual" checked={signingAs === "individual"} onChange={() => setSigningAs("individual")} />Individual / trading as LeOra Group</label>
          <label className={styles.checkbox}><input type="radio" name="signingAs" value="company" checked={signingAs === "company"} onChange={() => setSigningAs("company")} />Registered company</label>
        </fieldset>
        {signingAs === "company" ? <div className={styles.fields}>
          <label>Registered entity name<input name="entityName" maxLength={200} required /></label>
          <label>Registration number<input name="registrationNumber" maxLength={100} required /></label>
        </div> : null}
        <label>Signing capacity / title {signingAs === "individual" ? "(optional)" : ""}<input name="capacity" maxLength={150} required={signingAs === "company"} placeholder={signingAs === "individual" ? "Individual / trading as LeOra Group" : "e.g. Director"} /></label>
        <h2 className={styles.signatureHeading}>Your electronic signature</h2>
        <SignaturePad onChange={(strokes) => {
          setSignature(strokes);
          if (error === "Please draw your signature in the signature area before submitting.") setError("");
        }} />
        <label className={styles.checkbox}><input name="consent" type="checkbox" required />{SIGNING_CONSENT}</label>
      </fieldset>
      {error ? <p role="alert" className={styles.error}>{error}</p> : null}
      <button className={styles.primary} disabled={busy || needsAccess}>{busy ? "Recording signature…" : "Submit signed agreement"}</button>
      <p className={styles.help}>Submission records your signature. AiForm Studio will countersign separately.</p>
    </form>
    {needsAccess ? <form onSubmit={unlock} className={styles.form}>
      <label>Re-enter your signing code to renew your session<input name="code" type="password" autoComplete="off" required minLength={32} maxLength={128} disabled={busy} /></label>
      <button className={styles.secondary} disabled={busy}>Renew signing session</button>
      <p className={styles.help}>Your entered details and signature remain on this page.</p>
    </form> : null}
    </>
  );
}
