import Image from "next/image";

export default function PretoriaPhoto() {
  return <figure className="pretoria-photo" aria-label="AiForm Studio is based in Pretoria, South Africa">
    <Image src="/images/Panoramic_View_Of_The_Union_Building_Pretoria,_South_Africa.jpg" alt="Panoramic view of the Union Buildings and Pretoria" fill preload sizes="(max-width: 767px) 100vw, 58vw" className="object-cover object-center" />
    <figcaption>Pretoria / South Africa</figcaption>
  </figure>;
}
