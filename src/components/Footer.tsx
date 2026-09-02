import Link from "next/link";
import CalendlyBooking from "@/components/contact/CalendlyBooking";
import WhatsAppLink from "@/components/contact/WhatsAppLink";
import { IconCalendar, IconMail, IconWhatsApp } from "@/components/contact/icons";
import { buildWhatsAppHref } from "@/lib/contact-links";
import { STUDIO_ADDRESS_MAPS_URL } from "@/lib/studio-address";

const buildLinks = [["/#services", "Websites"], ["/#services", "Business Systems"], ["/#services", "Automation & AI"], ["/#how-we-work", "How We Work"]];
const exploreLinks = [["/work", "Work"], ["/journal", "Journal"], ["/#about", "About"], ["/contact", "Contact"], ["/privacy", "Privacy"]];

export default function Footer() {
  const whatsappNumber = process.env.NEXT_PUBLIC_STUDIO_WHATSAPP;
  const whatsappHref = whatsappNumber ? buildWhatsAppHref(whatsappNumber) : undefined;
  const calendlyUrl = process.env.NEXT_PUBLIC_CALENDLY_URL;

  return <footer id="contact" className="border-t border-line bg-white overflow-x-hidden">
    <div className="footer-closing editorial-grid">
      <div className="col-span-12 lg:col-span-6">
        <p className="footer-eyebrow">AiForm Studio</p>
        <p className="footer-statement">Useful digital infrastructure, shaped around the work.</p>
        <p className="footer-statement-support">Founder-led in Pretoria, South Africa.</p>
      </div>
      <div className="col-span-12 mt-10 lg:col-span-6 lg:mt-0 lg:border-l lg:border-line lg:pl-12">
        <h3 className="footer-cta-heading">Have something worth figuring out?</h3>
        <div className="footer-cta-actions">
          <Link href="/contact" className="button-primary">Start a project <span aria-hidden="true">→</span></Link>
          <div className="footer-cta-secondary">
            <CalendlyBooking triggerLabel="Book a conversation →" triggerSubtitle="" triggerClassName="text-link footer-cta-link" />
            <WhatsAppLink title="Chat on WhatsApp →" subtitle="" className="text-link footer-cta-link footer-cta-link-icon" />
          </div>
        </div>
      </div>
    </div>

    <div className="footer-nav editorial-grid border-t border-line">
      <div className="col-span-12 sm:col-span-6 lg:col-span-3">
        <p className="footer-heading">Services</p>
        <nav aria-label="Services links" className="footer-links">{buildLinks.map(([href, label]) => <Link key={label} href={href}>{label}</Link>)}</nav>
      </div>
      <div className="col-span-12 mt-8 sm:col-span-6 sm:mt-0 lg:col-span-3">
        <p className="footer-heading">Explore</p>
        <nav aria-label="Explore links" className="footer-links">{exploreLinks.map(([href, label]) => <Link key={label} href={href}>{label}</Link>)}</nav>
      </div>
      <div className="col-span-12 mt-8 sm:col-span-6 sm:mt-8 lg:col-span-3 lg:mt-0">
        <p className="footer-heading">Visit</p>
        <p className="footer-address">607 Fred Messenger Avenue<br />Andeon AH<br />Pretoria, 0183<br />South Africa</p>
        <a href={STUDIO_ADDRESS_MAPS_URL} target="_blank" rel="noopener noreferrer" className="text-link footer-maps-link mt-3">View on Google Maps <span aria-hidden="true">↗</span></a>
      </div>
      <div className="col-span-12 mt-8 sm:col-span-6 sm:mt-8 lg:col-span-3 lg:mt-0">
        <p className="footer-heading">Connect</p>
        <div className="footer-links footer-links-icon">
          <a href="mailto:aiformstudio@gmail.com"><IconMail className="footer-link-icon" aria-hidden="true" /> aiformstudio@gmail.com</a>
          {whatsappHref ? <a href={whatsappHref} target="_blank" rel="noopener noreferrer"><IconWhatsApp className="footer-link-icon" aria-hidden="true" /> Chat on WhatsApp</a> : null}
          {calendlyUrl ? <a href={calendlyUrl} target="_blank" rel="noopener noreferrer"><IconCalendar className="footer-link-icon" aria-hidden="true" /> Book a conversation</a> : null}
        </div>
      </div>
    </div>

    <div className="footer-meta border-t border-line">
      <p>© {new Date().getFullYear()} AiForm Studio (Pty) Ltd</p>
      <p>B-BBEE Level 1 Contributor</p>
      <p className="text-green">Noticed, not invented.</p>
    </div>
  </footer>;
}
