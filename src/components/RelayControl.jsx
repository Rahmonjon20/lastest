import { useEffect } from 'react';
import styles from './RelayControl.module.css';

export default function RelayControl({ relayState, pending, onToggle, clearPending }) {
  // ESP32 tasdiqlashini aniqlash: sensor ma'lumotidagi rele holati toggle bilan mos kelsa -> pending off
  useEffect(() => {
    if (pending && relayState !== null) clearPending();
  }, [relayState]);

  async function handleChange(e) {
    const newState = e.target.checked;
    const label = newState ? 'Releni YOQMOQCHIMISIZ?' : "Releni O'CHIRMOQCHIMISIZ?";
    if (!window.confirm(label)) {
      e.target.checked = !newState;
      return;
    }
    const ok = await onToggle(newState);
    if (!ok) e.target.checked = !newState;
  }

  return (
    <div className={styles.card}>
      <p className={styles.heading}>⚡ Rele masofadan boshqaruvi</p>

      <div className={styles.body}>
        <div className={`${styles.ring} ${relayState ? styles.on : styles.off}`}>
          <span className={styles.ringIcon}>{relayState ? '🟢' : '🔴'}</span>
        </div>

        <p className={`${styles.state} ${relayState ? styles.stateOn : styles.stateOff}`}>
          {relayState ? 'YOQILGAN' : "O'CHIRILGAN"}
        </p>

        <div className={styles.toggleRow}>
          <span className={styles.toggleLbl}>O'chirish</span>
          <label className={styles.toggle}>
            <input
              type="checkbox"
              checked={relayState ?? false}
              onChange={handleChange}
            />
            <span className={styles.slider} />
          </label>
          <span className={styles.toggleLbl}>Yoqish</span>
        </div>

        {pending && (
          <p className={styles.pending}>⏳ ESP32 tasdiqlashini kutmoqda…</p>
        )}
      </div>
    </div>
  );
}
