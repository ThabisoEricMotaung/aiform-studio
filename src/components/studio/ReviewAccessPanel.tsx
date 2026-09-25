"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import styles from "@/app/studio/studio.module.css";

type Status = "none" | "active" | "expired" | "revoked";
type Props = {
  reviewId: string;
  reference: string;
  eligible: boolean;
  issuedVersion: number | null;
  status: Status;
  expiresAt: string | null;
  lastAccessedAt: string | null;
  portalUrl: string;
  plainHref: string | null;
  detailedHref: string;
};

const statusLabel: Record<Status, string> = { none: "No access code issued", active: "Active", expired: "Expired", revoked: "Revoked" };
const format = (value: string | null) => value ? new Intl.DateTimeFormat("en-ZA", { dateStyle: "medium", timeStyle: "short" }).format(new Date(value)) : null;

export default function ReviewAccessPanel(props: Props) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState("");
  const [expiry, setExpiry] = useState("90");
  // Held only in memory for this page view; the server never stores or returns it again.
  const [issuedCode, setIssuedCode] = useState("");

  async function copy(text: string, label: string) {
    try { await navigator.clipboard.writeText(text); setCopied(label); }
    catch { setError("Copy failed. Select the text and copy it manually."); }
  }

  async function send(body: object) {
    setBusy(true); setError(""); setCopied("");
    try {
      const response = await fetch(`/api/studio/reviews/${props.reviewId}/access`, {
        method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body),
      });
      const result = await response.json();
      if (!response.ok) { setError(result.error || "Unable to update client access."); return null; }
      router.refresh();
      return result as { code?: string };
    } catch { setError("Unable to connect. Please try again."); return null; }
    finally { setBusy(false); }
  }

  async function reset() {
    if (props.status === "active" && !window.confirm("Replace the current access code? The old code stops working immediately and anyone using it is signed out.")) return;
    const result = await send({ action: "reset", expiresInDays: expiry === "none" ? null : Number(expiry) });
    if (result?.code) setIssuedCode(result.code);
  }

  async function revoke() {
    if (!window.confirm("Revoke client access? The current code stops working and open client sessions end on their next page load.")) return;
    if (await send({ action: "revoke" })) setIssuedCode("");
  }

  const expires = format(props.expiresAt);
  const lastAccessed = format(props.lastAccessedAt);

  return <div className={styles.accessPanel}>
    <dl className={styles.accessMeta}>
      <div><dt>Report</dt><dd>{props.issuedVersion && props.eligible ? `Issued · Version ${props.issuedVersion}` : "Not issued to client"}</dd></div>
      <div><dt>Reference</dt><dd>{props.reference}</dd></div>
      <div><dt>Client access</dt><dd>{statusLabel[props.status]}</dd></div>
      {expires && <div><dt>{props.status === "expired" ? "Expired" : "Expires"}</dt><dd>{expires}</dd></div>}
      <div><dt>Last client sign-in</dt><dd>{lastAccessed ?? "Not yet"}</dd></div>
    </dl>

    {props.eligible ? <>
      <div className={styles.accessActions}>
        {props.plainHref && <a href={props.plainHref} target="_blank" rel="noopener noreferrer" className={styles.primaryLink}>Open plain-language review</a>}
        <a href={props.detailedHref} target="_blank" rel="noopener noreferrer" className={props.plainHref ? styles.secondaryLink : styles.primaryLink}>Open detailed review</a>
        <button type="button" className={styles.secondary} onClick={() => copy(props.portalUrl, "url")} disabled={busy}>
          {copied === "url" ? "Access URL copied" : "Copy client access URL"}
        </button>
      </div>

      <div className={styles.accessManage}>
        <label htmlFor="access-expiry">Code expiry</label>
        <select id="access-expiry" value={expiry} onChange={event => setExpiry(event.target.value)} disabled={busy}>
          <option value="30">30 days</option>
          <option value="90">90 days</option>
          <option value="365">1 year</option>
          <option value="none">No expiry</option>
        </select>
        <button type="button" className={styles.secondary} onClick={reset} disabled={busy}>
          {props.status === "none" ? "Generate access code" : "Reset access code"}
        </button>
        {props.status === "active" && <button type="button" className={styles.textButton} onClick={revoke} disabled={busy}>Revoke access</button>}
      </div>
    </> : <p className={styles.hint}>Client access becomes available once the review is completed and its report version is issued for publication.</p>}

    {issuedCode && <div className={styles.issuedCode} role="status">
      <p>New access code for {props.reference}</p>
      <code>{issuedCode}</code>
      <button type="button" className={styles.secondary} onClick={() => copy(issuedCode, "code")}>{copied === "code" ? "Code copied" : "Copy code"}</button>
      <p className={styles.hint}>Copy it now. The code is not stored and cannot be shown again; if it is lost, reset it to issue a new one. Share it with the client separately from the access URL.</p>
    </div>}
    {error && <p className={styles.message} role="alert">{error}</p>}
  </div>;
}
