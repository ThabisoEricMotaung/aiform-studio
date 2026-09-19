"use client";

import { useState, type FormEvent } from "react";
import styles from "@/app/studio/studio.module.css";

export default function StudioLogin() {
  const [email, setEmail] = useState("");
  const [token, setToken] = useState("");
  const [sent, setSent] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (busy) return;
    setBusy(true); setError("");
    try {
      const response = await fetch(`/api/studio/auth/${sent ? "verify" : "request-code"}`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify(sent ? { email, token } : { email }),
      });
      const result = await response.json();
      if (!response.ok) { setError(result.error || "Unable to continue. Please try again."); return; }
      // A full navigation starts a fresh server render after HttpOnly cookies change.
      // eslint-disable-next-line @next/next/no-location-assign-relative-destination
      if (sent) window.location.assign("/studio");
      else setSent(true);
    } catch { setError("Unable to connect. Please try again."); }
    finally { setBusy(false); }
  }
  return <form onSubmit={submit} className={styles.form}>
    <label htmlFor="studio-email">Email</label>
    <input id="studio-email" name="email" type="email" autoComplete="email" required maxLength={254} value={email} onChange={event => setEmail(event.target.value)} readOnly={sent} disabled={busy} />
    {sent && <>
      <p className={styles.hint} role="status">If this email is eligible, an access code will arrive shortly.</p>
      <label htmlFor="studio-code">Enter access code</label>
      <input key="code" id="studio-code" name="token" className={styles.code} type="text" inputMode="numeric" autoComplete="one-time-code" pattern="[0-9]{6}" minLength={6} maxLength={6} required value={token} onChange={event => setToken(event.target.value.replace(/\D/g, ""))} disabled={busy} aria-describedby="code-help" />
      <p id="code-help" className={styles.hint}>Enter the six-digit code from your email.</p>
    </>}
    {error && <p className={styles.message} role="alert">{error}</p>}
    <button className={styles.primary} disabled={busy}>{busy ? "Please wait…" : sent ? "Verify and continue" : "Send access code"}</button>
    {sent && <button className={styles.textButton} type="button" disabled={busy} onClick={() => { setSent(false); setToken(""); setError(""); }}>Use another email or request a new code</button>}
    <p className={styles.hint}>Access is limited to authorized Studio members.</p>
  </form>;
}
