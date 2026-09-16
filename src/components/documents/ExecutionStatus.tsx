"use client";

import { useEffect, useState } from "react";
import { EXECUTION_STATUS, type ExecutionStatus } from "@/lib/leora-document";

/** Personal execution status is only returned to an authorised signing session. */
export default function DocumentExecutionStatus() {
  const [status, setStatus] = useState<ExecutionStatus>("awaiting_signatory");
  useEffect(() => {
    const controller = new AbortController();
    fetch("/api/documents/leora-group/nda", { cache: "no-store", signal: controller.signal })
      .then(async (response) => {
        if (!response.ok) return;
        const data = await response.json();
        if (data.receipt?.status in EXECUTION_STATUS) setStatus(data.receipt.status);
      }).catch(() => { /* The public cover never exposes private execution details. */ });
    return () => controller.abort();
  }, []);
  return <span>{EXECUTION_STATUS[status]}</span>;
}
