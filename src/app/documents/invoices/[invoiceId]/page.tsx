import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getInvoice, getInvoiceIds } from "@/content/invoices";
import PrintButton from "@/components/documents/PrintButton";
import documentStyles from "@/app/share/share.module.css";
import styles from "./page.module.css";

// The registry in src/content/invoices.ts defines which invoice routes exist.
// A future invoice (AFS-2026-002, ...) is added there; this page and its
// styles stay generic and do not need to change.
export const dynamicParams = false;
export function generateStaticParams() {
  return getInvoiceIds().map((invoiceId) => ({ invoiceId }));
}

export async function generateMetadata({ params }: { params: Promise<{ invoiceId: string }> }): Promise<Metadata> {
  const { invoiceId } = await params;
  const invoice = getInvoice(invoiceId);
  const title = invoice ? `Invoice ${invoice.number} | AiForm Studio` : "Invoice | AiForm Studio";
  const description = "An invoice prepared by AiForm Studio for a named client.";
  return {
    title: { absolute: title },
    description,
    robots: { index: false, follow: false, noarchive: true },
    alternates: { canonical: null },
    openGraph: { title, description, images: [], url: null },
    twitter: { card: "summary", title, description, images: [] },
  };
}

export default async function InvoicePage({ params }: { params: Promise<{ invoiceId: string }> }) {
  const { invoiceId } = await params;
  const invoice = getInvoice(invoiceId);
  if (!invoice) notFound();

  return (
    <article className={`${documentStyles.document} ${styles.article}`} aria-labelledby="invoice-title">
      <p className={documentStyles.eyebrow}>AiForm documents · Invoice</p>
      <h1 id="invoice-title" className={styles.number}>{invoice.number}</h1>
      <p className={`${documentStyles.recipient} ${styles.recipient}`}>AiForm Studio <span aria-hidden="true">×</span> {invoice.client.organisation}</p>
      <div className={`${documentStyles.statusRow} ${styles.statusRow}`}>
        <p className={documentStyles.status}>{invoice.status}</p>
        <p>Issued <time dateTime={invoice.issueDateISO}>{invoice.issueDateLabel}</time></p>
      </div>
      <p className={`${documentStyles.description} ${styles.summaryLine}`}>{invoice.summaryLine}</p>

      <dl className={`${documentStyles.metadata} ${styles.metadata}`}>
        <div><dt>Billed to</dt><dd>{invoice.client.name}<br />{invoice.client.organisation}</dd></div>
        <div><dt>Project</dt><dd>{invoice.project}</dd></div>
      </dl>

      <div className={`${documentStyles.actions} ${styles.actionsRow}`}>
        <PrintButton className={`button-secondary ${styles.printButton}`} />
      </div>

      <section className={styles.section} aria-labelledby="line-items-title">
        <h2 id="line-items-title" className="sr-only">Invoice details</h2>
        {invoice.lineItems.map((item) => (
          <div key={item.description} className={styles.lineItem}>
            <div className={styles.lineItemText}>
              <p className={styles.lineItemLabel}>Description</p>
              <p className={styles.lineItemName}>{item.description}</p>
              <p className={styles.lineItemDetail}>{item.detail}</p>
            </div>
            <p className={styles.lineItemAmount}>{item.amount}</p>
          </div>
        ))}

        <dl className={styles.summary}>
          {invoice.summary.map((row) => (
            <div key={row.label}><dt>{row.label}</dt><dd>{row.amount}</dd></div>
          ))}
        </dl>

        <div className={styles.amountDue}>
          <p className={styles.amountDueLabel}>Amount due</p>
          <p className={styles.amountDueValue}>{invoice.amountDue}</p>
        </div>
      </section>

      <section className={styles.section} aria-labelledby="payment-title">
        <h2 id="payment-title" className={styles.sectionTitle}>Payment details</h2>
        <dl className={styles.paymentGrid}>
          <div><dt>Bank</dt><dd>{invoice.paymentDetails.bank}</dd></div>
          <div><dt>Account holder</dt><dd>{invoice.paymentDetails.accountHolder}</dd></div>
          <div><dt>Account number</dt><dd className={styles.emphasis}>{invoice.paymentDetails.accountNumber}</dd></div>
          <div><dt>Account type</dt><dd>{invoice.paymentDetails.accountType}</dd></div>
          <div><dt>Branch</dt><dd>{invoice.paymentDetails.branch}</dd></div>
          <div><dt>Branch code</dt><dd>{invoice.paymentDetails.branchCode}</dd></div>
          <div className={styles.referenceRow}><dt>Payment reference</dt><dd className={styles.reference}>{invoice.paymentDetails.reference}</dd></div>
        </dl>
        <p className={styles.paymentNote}>{invoice.paymentReferenceNote}</p>
        {invoice.paymentDetails.swift ? <p className={styles.smallNote}>SWIFT (international payments only): {invoice.paymentDetails.swift}</p> : null}
        <p className={styles.smallNote}>{invoice.vatNote}</p>
      </section>
    </article>
  );
}
