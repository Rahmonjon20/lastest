import styles from './AlertBanner.module.css';

export default function AlertBanner({ alerts }) {
  if (!alerts.length) return null;
  return (
    <div className={styles.banner} role="alert" aria-live="assertive">
      <span className={styles.icon}>⚠️</span>
      <span className={styles.msg}>{alerts.join('  |  ')}</span>
    </div>
  );
}
