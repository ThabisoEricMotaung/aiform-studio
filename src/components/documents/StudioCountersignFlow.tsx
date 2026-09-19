"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { LEORA_DOCUMENT, STUDIO_COUNTERSIGNATORY, COUNTERSIGN_CONSENT, type SignatureStrokes } from "@/lib/leora-document";
import { signatureSchema } from "@/lib/leora-signing-schema";
import SignaturePad from "./SignaturePad";
import styles from "@/app/documents/leora-group/nda/sign/sign.module.css";

const api = "/api/documents/leora-group/nda/countersign";
type Execution = { id: string; signatoryName: string; business: string; signedAt: string; alreadyCountersigned: boolean };
type Stage = "loading" | "access" | "none" | "review" | "confirm" | "complete";

export default function StudioCountersignFlow({ available }: { available: boolean }) {
  const [stage, setStage] = useState<Stage>(available ? "loading" : "access");
  const [execution, setExecution] = useState<Execution | null>(null);
  const [signature, setSignature] = useState<SignatureStrokes>([]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [opened, setOpened] = useState(false);
  const [reviewed, setReviewed] = useState(false);
  const [confirmedName, setConfirmedName] = useState(false);
  const [confirmedCapacity, setConfirmedCapacity] = useState(false);
  const [needsAccess, setNeedsAccess] = useState(false);
  const heading = useRef<HTMLHeadingElement>(null);
  const submissionLock = useRef(false);

  function acceptState(data: { execution: Execution | null }) {
    setExecution(data.execution);
    if (!data.execution) setStage("none");
    else if (data.execution.alreadyCountersigned) setStage("complete");
    else setStage("review");
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
      if (stage !== "confirm" || data.execution?.alreadyCountersigned) acceptState(data);
    } catch (issue) { setError(issue instanceof Error ? issue.message : "We could not open the Studio countersigning session. Please try again."); }
    finally { setBusy(false); }
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (submissionLock.current || !execution) return;
    setError("");
    if (!signatureSchema.safeParse(signature).success) { setError("Please draw your signature in the signature area before submitting."); return; }
    submissionLock.current = true; setBusy(true);
    try {
      const response = await fetch(api, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          documentId: LEORA_DOCUMENT.id, documentVersion: LEORA_DOCUMENT.version, documentHash: LEORA_DOCUMENT.sha256,
          executionId: execution.id, signatoryName: STUDIO_COUNTERSIGNATORY.name, capacity: STUDIO_COUNTERSIGNATORY.capacity,
          signature, consent: true,
        }),
      });
      const result = await response.json();
      if (!response.ok) {
        if (response.status === 401) setNeedsAccess(true);
        throw new Error(result.error);
      }
      setExecution(result.execution); setSignature([]); setStage("complete");
    } catch (issue) { setError(issue instanceof Error ? issue.message : "We could not confirm the countersignature. Please retry."); }
    finally { submissionLock.current = false; setBusy(false); }
  }

  if (!available) return (
    <section className={styles.section}>
      <h2>Studio countersigning unavailable</h2>
      <p>Configure STUDIO_COUNTERSIGN_ENABLED, STUDIO_COUNTERSIGN_CODE_SHA256, and STUDIO_COUNTERSIGN_SESSION_SECRET to enable this workflow.</p>
    </section>
  );
  if (stage === "loading") return <p className={styles.section} role="status">Checking your Studio session…</p>;
  if (stage === "access") return (
    <section className={styles.section}>
      <h2 ref={heading} tabIndex={-1}>Open the Studio countersigning session</h2>
      <p>Enter the Studio-only countersigning code.</p>
      <form onSubmit={unlock} className={styles.form}>
        <label>Countersigning code<input name="code" type="password" autoComplete="off" required minLength={32} maxLength={128} spellCheck={false} disabled={busy} /></label>
        {error ? <p role="alert" className={styles.error}>{error}</p> : null}
        <button className={styles.primary} disabled={busy}>{busy ? "Opening…" : "Continue"}</button>
      </form>
    </section>
  );
  if (stage === "none") return (
    <section className={styles.section}>
      <h2 ref={heading} tabIndex={-1}>Nothing to countersign yet</h2>
      <p>There is no client execution recorded for this document version yet. Check back once the client has signed.</p>
    </section>
  );
  if (stage === "complete" && execution) return (
    <section className={styles.section} aria-labelledby="countersign-complete-title">
      <h2 id="countersign-complete-title" ref={heading} tabIndex={-1}>Fully executed</h2>
      <p>Your countersignature has been recorded. This agreement is now fully executed.</p>
      <a href={`${api}/executed`} className={styles.primary}>Open fully executed PDF ↗</a>
    </section>
  );
  if (stage === "review" && execution) return (
    <section className={styles.section}>
      <p className={styles.step}>01 / Review</p>
      <h2 ref={heading} tabIndex={-1}>Review the executed agreement</h2>
      <p>Signed by <strong>{execution.signatoryName}</strong> ({execution.business}) on {new Intl.DateTimeFormat("en-ZA", { dateStyle: "long", timeStyle: "short", timeZone: "Africa/Johannesburg" }).format(new Date(execution.signedAt))} SAST.</p>
      <a href={`${api}/document`} target="_blank" rel="noopener noreferrer" className={styles.primary} onClick={() => setOpened(true)}>Open agreement (PDF) ↗<span className={styles.srOnly}> in a new tab</span></a>
      <label className={styles.checkbox}><input type="checkbox" checked={reviewed} onChange={(event) => setReviewed(event.target.checked)} />I have opened and reviewed the executed agreement.</label>
      <button className={styles.secondary} disabled={!opened || !reviewed} onClick={() => setStage("confirm")}>Continue to countersigning →</button>
    </section>
  );
  return (<>
    <form onSubmit={submit} className={styles.form}>
      <fieldset disabled={busy} className={styles.section}>
        <legend className={styles.srOnly}>Countersignatory confirmation and signature</legend>
        <p className={styles.step}>02 / Confirm &amp; countersign</p>
        <h2 ref={heading} tabIndex={-1}>Confirm and countersign</h2>
        <label className={styles.checkbox}><input type="checkbox" checked={confirmedName} onChange={(event) => setConfirmedName(event.target.checked)} required />I confirm my name is {STUDIO_COUNTERSIGNATORY.name}.</label>
        <label className={styles.checkbox}><input type="checkbox" checked={confirmedCapacity} onChange={(event) => setConfirmedCapacity(event.target.checked)} required />I confirm my capacity is {STUDIO_COUNTERSIGNATORY.capacity} of {STUDIO_COUNTERSIGNATORY.entity} (Registration {STUDIO_COUNTERSIGNATORY.registrationNumber}).</label>
        <h2 className={styles.signatureHeading}>Your electronic countersignature</h2>
        <SignaturePad onChange={(strokes) => {
          setSignature(strokes);
          if (error === "Please draw your signature in the signature area before submitting.") setError("");
        }} />
        <label className={styles.checkbox}><input name="consent" type="checkbox" required />{COUNTERSIGN_CONSENT}</label>
      </fieldset>
      {error ? <p role="alert" className={styles.error}>{error}</p> : null}
      <button className={styles.primary} disabled={busy || needsAccess || !confirmedName || !confirmedCapacity}>{busy ? "Recording countersignature…" : "Submit countersignature"}</button>
    </form>
    {needsAccess ? <form onSubmit={unlock} className={styles.form}>
      <label>Re-enter the Studio countersigning code to renew your session<input name="code" type="password" autoComplete="off" required minLength={32} maxLength={128} disabled={busy} /></label>
      <button className={styles.secondary} disabled={busy}>Renew Studio session</button>
    </form> : null}
    </>
  );
}
