import Link from "next/link";
import { AiFormMark } from "@/components/AiFormLockup";
import { IconCalendar, IconMail, IconShield, IconWhatsApp } from "@/components/contact/icons";
import { buildWhatsAppHref } from "@/lib/contact-links";
import { STUDIO_ADDRESS_MAPS_URL } from "@/lib/studio-address";

const buildLinks = [["/#services", "Websites"], ["/#services", "Business Systems"], ["/#services", "Automation & AI"], ["/#how-we-work", "How We Work"]];
const exploreLinks = [["/work", "Work"], ["/journal", "Journal"], ["/#about", "About"], ["/contact", "Contact"], ["/privacy", "Privacy"]];

export default function Footer() {
  const whatsappNumber = process.env.NEXT_PUBLIC_STUDIO_WHATSAPP;
  const whatsappHref = whatsappNumber ? buildWhatsAppHref(whatsappNumber) : undefined;
  const calendlyUrl = process.env.NEXT_PUBLIC_CALENDLY_URL;

  return <footer id="contact" className="site-footer border-t border-line bg-white overflow-x-hidden">
    <div className="footer-closing editorial-grid">
      <AiFormMark variant="green" className="footer-watermark" />
      <div className="col-span-12 lg:col-span-7">
        <p className="footer-eyebrow">AiForm Studio</p>
        <p className="footer-statement">Useful digital infrastructure, shaped around the work.</p>
        <p className="footer-statement-support">Founder-led in Pretoria, South Africa.</p>
      </div>
      <div className="col-span-12 mt-10 lg:col-span-5 lg:mt-0 lg:border-l lg:border-line lg:pl-12">
        <h3 className="footer-cta-heading">Have something worth figuring out?</h3>
        <div className="footer-cta-actions">
          <Link href="/contact" className="text-link">Get in touch <span aria-hidden="true">→</span></Link>
        </div>
      </div>
    </div>

    <div className="footer-nav editorial-grid border-t border-line">
      <div className="col-span-12 sm:col-span-6 lg:col-span-3">
        <p className="footer-heading">Services</p>
        <nav aria-label="Services links" className="footer-links">{buildLinks.map(([href, label]) => <Link key={label} href={href}>{label}</Link>)}</nav>
      </div>
      <div className="col-span-12 mt-8 sm:col-span-6 sm:mt-0 lg:col-span-3 lg:border-l lg:border-line lg:pl-6">
        <p className="footer-heading">Explore</p>
        <nav aria-label="Explore links" className="footer-links">{exploreLinks.map(([href, label]) => <Link key={label} href={href}>{label}</Link>)}</nav>
      </div>
      <div className="col-span-12 mt-8 sm:col-span-6 sm:mt-8 lg:col-span-3 lg:mt-0 lg:border-l lg:border-line lg:pl-6">
        <p className="footer-heading">Visit</p>
        <p className="footer-address">607 Fred Messenger Avenue<br />Andeon AH, Pretoria 0183<br />South Africa</p>
        <a href={STUDIO_ADDRESS_MAPS_URL} target="_blank" rel="noopener noreferrer" className="text-link footer-maps-link mt-3">View on Google Maps <span aria-hidden="true">↗</span></a>
      </div>
      <div className="col-span-12 mt-8 sm:col-span-6 sm:mt-8 lg:col-span-3 lg:mt-0 lg:border-l lg:border-line lg:pl-6">
        <p className="footer-heading">Connect</p>
        <div className="footer-links footer-links-icon">
          <a href="mailto:aiformstudio@gmail.com"><IconMail className="footer-link-icon" aria-hidden="true" /> aiformstudio@gmail.com</a>
          {whatsappHref ? <a href={whatsappHref} target="_blank" rel="noopener noreferrer"><IconWhatsApp className="footer-link-icon" aria-hidden="true" /> Chat on WhatsApp</a> : null}
          {calendlyUrl ? <a href={calendlyUrl} target="_blank" rel="noopener noreferrer"><IconCalendar className="footer-link-icon" aria-hidden="true" /> Book a conversation</a> : null}
          <Link href="/privacy"><IconShield className="footer-link-icon" aria-hidden="true" /> Privacy</Link>
        </div>
      </div>
    </div>

    <div className="footer-meta border-t border-line">
      <p>© {new Date().getFullYear()} AiForm Studio (Pty) Ltd</p>
      <p>B-BBEE Level 1 Contributor</p>
      <p className="footer-meta-brand">Noticed, not invented.</p>
    </div>
  </footer>;
}
