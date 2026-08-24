export const procureSocialLinks = [
  {
    name: "LinkedIn",
    href: "https://linkedin.com/company/aiform-procure/",
    icon: "linkedin",
  },
  {
    name: "Facebook",
    href: "https://www.facebook.com/profile.php?id=61592730084230",
    icon: "facebook",
  },
  {
    name: "Substack",
    href: "https://aiformprocure.substack.com",
    icon: "substack",
  },
  {
    name: "TikTok",
    href: "https://www.tiktok.com/@aiformprocure",
    icon: "tiktok",
  },
  { name: "X", href: "https://x.com/aiformprocure", icon: "x" },
  {
    name: "Reddit",
    href: "https://www.reddit.com/user/AiForm-Procure/",
    icon: "reddit",
  },
  {
    name: "Instagram",
    href: "https://www.instagram.com/aiformprocure/",
    icon: "instagram",
  },
] as const;

export const procureWebsite = "https://www.aiformprocure.co.za";

export type ProcureSocialIconName = (typeof procureSocialLinks)[number]["icon"];
