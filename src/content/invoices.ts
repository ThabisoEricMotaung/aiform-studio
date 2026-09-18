export type InvoiceLineItem = {
  description: string;
  detail: string;
  amount: string;
};

export type InvoiceSummaryRow = {
  label: string;
  amount: string;
};

export type InvoicePaymentDetails = {
  bank: string;
  accountHolder: string;
  accountNumber: string;
  accountType: string;
  branch: string;
  branchCode: string;
  reference: string;
  swift?: string;
};

export type Invoice = {
  number: string;
  status: string;
  issueDateLabel: string;
  issueDateISO: string;
  supplier: { name: string; registration: string; email: string; location: string };
  client: { name: string; organisation: string };
  project: string;
  summaryLine: string;
  lineItems: InvoiceLineItem[];
  summary: InvoiceSummaryRow[];
  amountDue: string;
  paymentDetails: InvoicePaymentDetails;
  paymentReferenceNote: string;
  vatNote: string;
};

export const invoices: Record<string, Invoice> = {
  "AFS-2026-001": {
    number: "AFS-2026-001",
    status: "Issued",
    issueDateLabel: "18 September 2026",
    issueDateISO: "2026-09-18",
    supplier: {
      name: "AiForm Studio (Pty) Ltd",
      registration: "2026/692621/07",
      email: "aiformstudio@gmail.com",
      location: "Pretoria, South Africa",
    },
    client: { name: "Neo Makgoba", organisation: "LeOra Group" },
    project: "NeoSmart Fuelling Investor Prototype",
    summaryLine: "Invoice for the 50% commencement payment on the approved NeoSmart Fuelling Investor Prototype engagement.",
    lineItems: [
      {
        description: "NeoSmart Fuelling Investor Prototype — 50% commencement payment",
        detail: "50% commencement payment for the NeoSmart Fuelling Investor Prototype, in accordance with the approved prototype scope dated 18 September 2026.",
        amount: "R2,750.00",
      },
    ],
    summary: [
      { label: "Prototype value", amount: "R5,500.00" },
      { label: "This invoice", amount: "R2,750.00" },
      { label: "Remaining project balance", amount: "R2,750.00" },
    ],
    amountDue: "R2,750.00",
    paymentDetails: {
      bank: "Standard Bank",
      accountHolder: "AIFORM STUDIO (PTY) LTD",
      accountNumber: "0000010286235100",
      accountType: "Current",
      branch: "Hatfield",
      branchCode: "051001",
      reference: "AFS-2026-001",
      swift: "SBZA ZA JJ",
    },
    paymentReferenceNote: "Please use AFS-2026-001 as the payment reference.",
    vatNote: "VAT not charged. AiForm Studio is not currently VAT registered.",
  },
};

export function getInvoice(number: string): Invoice | undefined {
  return invoices[number];
}

export function getInvoiceIds(): string[] {
  return Object.keys(invoices);
}
