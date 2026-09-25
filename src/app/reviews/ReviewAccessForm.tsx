"use client";

import { useState, type FormEvent } from "react";
import styles from "./access.module.css";

export default function ReviewAccessForm({ reference }: { reference: string }) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (busy) return;
    setBusy(true); setError("");
    const form = new FormData(event.currentTarget);
    try {
      const response = await fetch("/api/reviews/access", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reference: form.get("reference"), code: form.get("code") }),
      });
      const result = await response.json();
      if (!response.ok || typeof result.next !== "string" || !result.next.startsWith("/reviews/")) {
        setError(result.error || "Unable to continue. Please try again.");
        return;
      }
      window.location.assign(result.next);
    } catch { setError("Unable to connect. Please try again."); }
    finally { setBusy(false); }
  }

  return <form onSubmit={submit} className={styles.form}>
    <label htmlFor="review-reference">Review reference</label>
    <input id="review-reference" name="reference" defaultValue={reference} placeholder="PR-2026-001" autoComplete="off"
      autoCapitalize="characters" spellCheck={false} required maxLength={40} disabled={busy} />
    <label htmlFor="review-code">Access code</label>
    <input id="review-code" name="code" type="password" placeholder="XXXX-XXXX-XXXX-XXXX" autoComplete="off"
      autoCapitalize="characters" spellCheck={false} required maxLength={64} disabled={busy} />
    {error ? <p role="alert" className={styles.error}>{error}</p> : null}
    <button className={styles.primary} disabled={busy}>{busy ? "Checking…" : "Access review"}</button>
    <p className={styles.help}>Both details were provided to you by AiForm Studio. If you no longer have your access code, ask AiForm Studio to issue a new one.</p>
  </form>;
}
