"use client";

import { useState, type FormEvent } from "react";
import styles from "@/app/documents/leora-group/access/access.module.css";

export default function LeoraAccessForm({ next }: { next: string }) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (busy) return;
    setBusy(true); setError("");
    const form = event.currentTarget;
    try {
      const response = await fetch("/api/documents/leora-group/access", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: new FormData(form).get("code") }),
      });
      const result = await response.json();
      if (!response.ok) { setError(result.error || "Unable to continue. Please try again."); return; }
      // `next` was validated and resolved server-side; never derived from
      // client-readable location state.
      window.location.assign(next);
    } catch { setError("Unable to connect. Please try again."); }
    finally { setBusy(false); }
  }

  return <form onSubmit={submit} className={styles.form}>
    <label htmlFor="leora-access-code">Private access code</label>
    <input id="leora-access-code" name="code" type="password" autoComplete="off" required minLength={32} maxLength={128} spellCheck={false} disabled={busy} />
    {error ? <p role="alert" className={styles.error}>{error}</p> : null}
    <button className={styles.primary} disabled={busy}>{busy ? "Opening…" : "Continue"}</button>
    <p className={styles.help}>This code was provided separately by AiForm Studio and is different from any NDA signing code.</p>
  </form>;
}
