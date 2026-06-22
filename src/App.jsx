import { useState, useEffect } from 'react';

import Header       from './components/Header';
import AlertBanner  from './components/AlertBanner';
import MetricCard   from './components/MetricCard';
import RelayControl from './components/RelayControl';
import AlertConfig  from './components/AlertConfig';
import RealtimeChart from './components/RealtimeChart';
import HistoryChart  from './components/HistoryChart';
import DataTable    from './components/DataTable';

import { useSensorData }   from './hooks/useSensorData';
import { useRelayControl } from './hooks/useRelayControl';
import { useDailyStats }   from './hooks/useDailyStats';
import { useThresholds }   from './hooks/useThresholds';

import { checkAlerts } from './utils/helpers';
import styles from './App.module.css';

export default function App() {
  const { latest, tableRows, rtPoints, connected, loading } = useSensorData();
  const { pending, error: relayError, setRelay, clearPending } = useRelayControl();
  const dailyStats   = useDailyStats();
  const { thresholds, saveThresholds } = useThresholds();

  const [alertLog, setAlertLog] = useState([]);

  // Ogohlantirish tekshiruvi
  const alerts = latest ? checkAlerts(latest, thresholds) : [];

  useEffect(() => {
    if (!latest) return;
    const msgs = checkAlerts(latest, thresholds);
    if (!msgs.length) return;
    const ts = new Date().toLocaleTimeString('uz-UZ');
    setAlertLog(prev => {
      const entries = msgs.map(m => `[${ts}] ${m}`);
      return [...entries, ...prev].slice(0, 30);
    });
  }, [latest]);

  if (loading) {
    return (
      <div className={styles.loader}>
        <div className={styles.loaderDot} />
        <p>Ma'lumotlar yuklanmoqda…</p>
      </div>
    );
  }

  return (
    <div className={styles.app}>
      <Header connected={connected} lastUpdate={latest?.created_at} />

      <AlertBanner alerts={alerts} />

      {relayError && (
        <div className={styles.relayError}>❌ Rele xatolik: {relayError}</div>
      )}

      <main className={styles.main}>

        {/* ── CONFIG NOTE ── */}
        {!connected && !latest && (
          <div className={styles.configNote}>
            ⚙️ Sozlash: <code>.env</code> fayliga Supabase kalitlarini qo'shing va sahifani yangilang.
          </div>
        )}

        {/* ── METRICS ── */}
        <p className={styles.sectionLabel}>real vaqt ko'rsatkichlari</p>
        <div className={styles.metricsGrid}>
          <MetricCard type="flow"        value={latest?.flow_rate}         unit="L / min" thresholds={{ min: thresholds.minFlow,     max: thresholds.maxFlow     }} />
          <MetricCard type="pressure"    value={latest?.pressure}          unit="bar"     thresholds={{ min: thresholds.minPressure, max: thresholds.maxPressure }} />
          <MetricCard type="volume"      value={latest?.total_volume}      unit="litr"    />
          <MetricCard type="consumption" value={latest?.water_consumption} unit="mL / s"  />
        </div>

        {/* ── RELAY + ALERTS ── */}
        <p className={styles.sectionLabel}>boshqaruv va ogohlantirishlar</p>
        <div className={styles.midRow}>
          <RelayControl
            relayState={latest?.relay_status ?? false}
            pending={pending}
            onToggle={setRelay}
            clearPending={clearPending}
          />
          <AlertConfig
            thresholds={thresholds}
            onSave={saveThresholds}
            alertLog={alertLog}
          />
        </div>

        {/* ── CHARTS ── */}
        <p className={styles.sectionLabel}>grafik tahlil</p>
        <div className={styles.chartsRow}>
          <RealtimeChart rtPoints={rtPoints} />
          <HistoryChart  stats={dailyStats}  />
        </div>

        {/* ── TABLE ── */}
        <p className={styles.sectionLabel}>so'nggi o'lchovlar</p>
        <DataTable rows={tableRows} />

      </main>
    </div>
  );
}
