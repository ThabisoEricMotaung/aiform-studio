import StudioLogin from "@/components/studio/StudioLogin";
import styles from "../studio.module.css";

export default async function StudioLoginPage({ searchParams }: { searchParams: Promise<{ notice?: string }> }) {
  const { notice } = await searchParams;
  return <section className={`${styles.panel} ${styles.loginPanel}`} aria-labelledby="console-title">
    <p className={styles.eyebrow}>AiForm Studio / Access</p>
    <h1 id="console-title">Studio Console</h1>
    <p className={styles.intro}>A private space for the work behind the work.</p>
    {notice === "denied" && <p className={styles.message} role="alert">This account cannot access the Studio Console.</p>}
    {notice === "unavailable" && <p className={styles.message} role="status">Studio access is not available yet. Please try again later.</p>}
    <StudioLogin />
  </section>;
}
