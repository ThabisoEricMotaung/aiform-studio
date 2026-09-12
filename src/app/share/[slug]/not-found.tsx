import Link from "next/link";

export default function SharedDocumentNotFound() {
  return <div className="py-16"><p className="chapter-label">Client document</p><h1 className="section-title mt-6">Document not found.</h1><p className="section-intro">Please check the link provided by AiForm Studio.</p><Link className="text-link mt-8" href="/">Return to AiForm Studio <span aria-hidden="true">→</span></Link></div>;
}
