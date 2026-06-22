import { getBadgeStatus } from '../utils/helpers';
import styles from './MetricCard.module.css';

const CONFIG = {
  flow:        { label: 'Oqim tezligi', icon: '💧', color: '#3b82f6', valColor: '#93c5fd' },
  pressure:    { label: 'Bosim',        icon: '🔴', color: '#f59e0b', valColor: '#fcd34d' },
  volume:      { label: 'Jami hajm',    icon: '🪣', color: '#10b981', valColor: '#6ee7b7' },
  consumption: { label: 'Suv sarfi',    icon: '⚡', color: '#8b5cf6', valColor: '#c4b5fd' },
};

const BADGE_LABEL = { normal: 'Normal', warning: '~ Chegara', danger: '⚠ Chegara' };

export default function MetricCard({ type, value, unit, thresholds }) {
  const cfg    = CONFIG[type];
  const status = thresholds
    ? getBadgeStatus(value, thresholds.min, thresholds.max)
    : 'normal';

  const display = value !== null && value !== undefined
    ? type === 'flow' || type === 'volume'
      ? value.toFixed(3)
      : value.toFixed(2)
    : '—';

  return (
    <div className={styles.card}>
      <div className={styles.topBar} style={{ background: cfg.color }} />
      <span className={styles.icon}>{cfg.icon}</span>
      <p className={styles.label}>{cfg.label}</p>
      <p className={styles.value} style={{ color: cfg.valColor }}>{display}</p>
      <p className={styles.unit}>{unit}</p>
      <span className={`${styles.badge} ${styles[status]}`}>
        {BADGE_LABEL[status]}
      </span>
    </div>
  );
}
