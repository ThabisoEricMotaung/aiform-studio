"use client";

export default function PrintButton({ className }: { className?: string }) {
  return (
    <button type="button" onClick={() => window.print()} className={className}>
      Print / Save PDF <span aria-hidden="true">↓</span>
    </button>
  );
}
