import { requireStudioPage } from "@/lib/studio-auth";

export default async function ProtectedStudioLayout({ children }: { children: React.ReactNode }) {
  await requireStudioPage();
  return children;
}
