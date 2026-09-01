export const WHATSAPP_MESSAGE = "Hi AiForm Studio, I'd like to talk about something I'm working on.";

export function buildWhatsAppHref(rawNumber: string, message: string = WHATSAPP_MESSAGE): string {
  const digitsOnly = rawNumber.replace(/[^\d]/g, "");
  return `https://wa.me/${digitsOnly}?text=${encodeURIComponent(message)}`;
}
