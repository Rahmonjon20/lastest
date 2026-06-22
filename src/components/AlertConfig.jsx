import { useState } from 'react';
import styles from './AlertConfig.module.css';

export default function AlertConfig({ thresholds, onSave, alertLog }) {
  const [form, setForm] = useState({
    maxFlow:     thresholds.maxFlow,
    minFlow:     thresholds.minFlow,
    maxPressure: thresholds.maxPressure,
    minPressure: thresholds.minPressure,
  });

  function handleChange(e) {
    setForm(prev => ({ ...prev, [e.target.name]: parseFloat(e.target.value) || 0 }));
  }

  function handleSave() {
    onSave(form);
    alert('✅ Sozlamalar saqlandi!');
  }

  const fields = [
    { name: 'maxFlow',     label: 'Max oqim (L/min)',  step: '0.5' },
    { name: 'minFlow',     label: 'Min oqim (L/min)',  step: '0.1' },
    { name: 'maxPressure', label: 'Max bosim (bar)',    step: '0.5' },
    { name: 'minPressure', label: 'Min bosim (bar)',    step: '0.1' },
  ];

  return (
    <div className={styles.card}>
      <p className={styles.heading}>🔔 Ogohlantirish chegaralari</p>

      <div className={styles.grid}>
        {fields.map(f => (
          <div key={f.name} className={styles.field}>
            <label htmlFor={f.name} className={styles.label}>{f.label}</label>
            <input
              id={f.name}
              name={f.name}
              type="number"
              step={f.step}
              min="0"
              value={form[f.name]}
              onChange={handleChange}
              className={styles.input}
            />
          </div>
        ))}
      </div>

      <button className={styles.saveBtn} onClick={handleSave}>
        💾 Saqlash
      </button>

      {alertLog.length > 0 && (
        <div className={styles.log}>
          {alertLog.slice(0, 6).map((entry, i) => (
            <p key={i} className={styles.logItem}>{entry}</p>
          ))}
        </div>
      )}
    </div>
  );
}
