import { fmtDateTime } from '../utils/helpers';
import styles from './DataTable.module.css';

export default function DataTable({ rows }) {
  return (
    <div className={styles.card}>
      <p className={styles.heading}>📋 So'nggi {rows.length} ta o'lchov</p>
      <div className={styles.scroll}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Vaqt</th>
              <th>Oqim (L/min)</th>
              <th>Bosim (bar)</th>
              <th>Hajm (L)</th>
              <th>Sarfi (mL/s)</th>
              <th>Rele</th>
            </tr>
          </thead>
          <tbody>
            {rows.map(r => (
              <tr key={r.id}>
                <td>{fmtDateTime(r.created_at)}</td>
                <td>{r.flow_rate.toFixed(3)}</td>
                <td>{r.pressure.toFixed(2)}</td>
                <td>{r.total_volume.toFixed(3)}</td>
                <td>{r.water_consumption.toFixed(1)}</td>
                <td>
                  <span className={`${styles.badge} ${r.relay_status ? styles.on : styles.off}`}>
                    {r.relay_status ? 'YOQIQ' : "O'CHIQ"}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
