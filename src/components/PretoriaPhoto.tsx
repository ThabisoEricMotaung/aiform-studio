import Image from "next/image";

export default function PretoriaPhoto() {
  return (
    <div className="relative min-h-[460px] md:min-h-[680px] h-full overflow-hidden bg-gradient-to-br from-purple via-green to-gold">
      <Image src="/images/Panoramic_View_Of_The_Union_Building_Pretoria,_South_Africa.jpg" alt="Panoramic view of the Union Buildings in Pretoria, South Africa" fill priority sizes="(max-width: 768px) 100vw, 42vw" className="object-cover" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent" />
      <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 p-6 md:p-8 text-white"><p className="font-sans text-[11px] font-medium tracking-[0.12em]">PRETORIA, SOUTH AFRICA</p><p className="font-sans text-[10px] tracking-[0.08em] text-white/80">25.7479° S · 28.2293° E</p></div>
    </div>
  );
}
