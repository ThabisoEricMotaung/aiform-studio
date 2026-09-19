import { requireStudioPage } from "@/lib/studio-auth";
import SignOutButton from "@/components/studio/SignOutButton";
import styles from "../studio.module.css";

export default async function StudioPage() {
  // Independent guard: layouts alone do not secure RSC payloads or data reads.
  const actor = await requireStudioPage();
  return <section className={styles.panel} aria-labelledby="console-title">
    <p className={styles.eyebrow}>AiForm Studio / Private workspace</p>
    <h1 id="console-title">Studio Console</h1>
    <div className={styles.identity}><p>Signed in as</p><h2>{actor.name}</h2></div>
    <p className={styles.intro}>Internal AiForm Studio workspace.</p>
    <SignOutButton />
  </section>;
}
