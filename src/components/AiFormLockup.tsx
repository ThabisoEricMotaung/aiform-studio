import Image from "next/image";

type LockupVariant = "gold" | "green" | "white" | "dark";

const variantColors: Record<Exclude<LockupVariant, "gold">, string> = {
  green: "#173B2C",
  white: "#FFFFFF",
  dark: "#181A18",
};

export default function AiFormLockup({ product, variant = "gold", className = "", markClassName = "h-9", compactOnMobile = false }: { product: string; variant?: LockupVariant; className?: string; markClassName?: string; compactOnMobile?: boolean }) {
  const mark = variant === "gold"
    ? <Image src="/images/aiform-mark.png" alt="" width={472} height={588} sizes="44px" className={`${markClassName} w-auto shrink-0`} />
    : <span aria-hidden="true" className={`${markClassName} aspect-[472/588] w-auto shrink-0`} style={{ backgroundColor: variantColors[variant], WebkitMaskImage: "url(/images/aiform-mark.png)", maskImage: "url(/images/aiform-mark.png)", WebkitMaskPosition: "center", maskPosition: "center", WebkitMaskRepeat: "no-repeat", maskRepeat: "no-repeat", WebkitMaskSize: "contain", maskSize: "contain" }} />;

  return <span className={`inline-flex items-center gap-[.8em] ${className}`}>{mark}<span className={`${compactOnMobile ? "hidden sm:inline" : "inline"} whitespace-nowrap font-semibold tracking-[.12em]`}>AIFORM <span className="font-normal opacity-65">/ {product.toUpperCase()}</span></span></span>;
}
