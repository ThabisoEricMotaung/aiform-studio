"use client";

import { useState } from "react";
import styles from "@/app/studio/studio.module.css";

export default function SignOutButton() {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  async function signOut() {
    setBusy(true); setError("");
    try {
      const response = await fetch("/api/studio/auth/logout", { method: "POST", headers: { "Content-Type": "application/json" }, body: "{}" });
      if (response.redirected && response.ok) { window.location.replace("/studio/login"); return; }
      const result = await response.json();
      setError(result.error || "Unable to sign out. Please try again.");
    } catch { setError("Unable to connect. Please try again."); }
    finally { setBusy(false); }
  }
  return <div className={styles.signOut}><button type="button" className={styles.secondary} onClick={signOut} disabled={busy}>{busy ? "Signing out…" : "Sign out"}</button>{error && <p className={styles.message} role="alert">{error}</p>}</div>;
}
