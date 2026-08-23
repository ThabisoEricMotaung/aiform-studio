import Link from "next/link";

const links = [["/#work", "Work"], ["/#work", "Products"], ["/#studio", "Studio"], ["/journal", "Journal"], ["/contact", "Contact"]];

export default function Footer() {
  return <footer className="editorial-grid bg-green py-20 text-white md:py-28">
    <p className="chapter-label chapter-label-light col-span-12">AiForm / Studio / Pretoria</p>
    <h2 className="font-display col-span-12 mt-12 text-4xl leading-[.95] md:col-span-8 md:text-6xl">Built in Pretoria.<br/><span className="text-[#e0c98f]">Looking everywhere.</span></h2>
    <div className="col-span-12 mt-14 md:col-start-10 md:col-span-3 md:mt-12"><nav aria-label="Footer navigation" className="grid grid-cols-2 gap-x-8 gap-y-4 text-sm">{links.map(([href, label]) => <Link key={label} href={href} className="text-white/75 hover:text-white">{label}</Link>)}</nav><a href="mailto:hello@aiformstudio.co.za" className="mt-8 block text-sm text-white/70 hover:text-white">hello@aiformstudio.co.za</a></div>
    <div className="col-span-12 mt-20 flex flex-col justify-between gap-3 border-t border-white/20 pt-6 text-[10px] text-white/60 md:flex-row"><p>© {new Date().getFullYear()} AiForm Studio</p><p>Union Buildings photograph: CC BY-SA / Wikimedia Commons</p></div>
  </footer>;
}
