import { fmtTime } from '../utils/helpers';
import styles from './Header.module.css';

export default function Header({ connected, lastUpdate }) {
  return (
    <header className={styles.header}>
      <div className={styles.left}>
        <div className={styles.icon}>🛢</div>
        <div>
          <h1 className={styles.title}>Neft Quvuri Monitoring Tizimi</h1>
          <p className={styles.sub}>ESP32-WROOM · YF-S201 · Supabase · Real vaqt</p>
        </div>
      </div>

      <div className={styles.right}>
        <div className={styles.status}>
          <span className={`${styles.dot} ${connected ? styles.online : styles.offline}`} />
          <span className={styles.statusText}>
            {connected ? 'Ulangan' : 'Uzildi'}
          </span>
        </div>
        {lastUpdate && (
          <span className={styles.lastUpdate}>
            Yangilandi: {fmtTime(lastUpdate)}
          </span>
        )}
      </div>
    </header>
  );
}
