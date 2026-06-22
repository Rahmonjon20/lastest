/** Vaqtni chiroyli formatlash */
export function fmtTime(isoString) {
  if (!isoString) return '—';
  return new Date(isoString).toLocaleTimeString('uz-UZ', {
    hour: '2-digit', minute: '2-digit', second: '2-digit',
  });
}

export function fmtDateTime(isoString) {
  if (!isoString) return '—';
  return new Date(isoString).toLocaleString('uz-UZ', {
    month: '2-digit', day: '2-digit',
    hour: '2-digit', minute: '2-digit', second: '2-digit',
  });
}

export function fmtDay(isoString) {
  return new Date(isoString).toLocaleDateString('uz-UZ', {
    month: '2-digit', day: '2-digit',
  });
}

/** Ogohlantirish tekshiruvi */
export function checkAlerts(reading, thr) {
  const msgs = [];
  const { flow_rate: fl, pressure: pr } = reading;

  if (fl > thr.maxFlow)
    msgs.push(`Oqim YUQORI: ${fl.toFixed(2)} L/min (max ${thr.maxFlow})`);
  if (thr.minFlow > 0 && fl < thr.minFlow)
    msgs.push(`Oqim PAST: ${fl.toFixed(2)} L/min (min ${thr.minFlow})`);
  if (pr > thr.maxPressure)
    msgs.push(`Bosim YUQORI: ${pr.toFixed(2)} bar (max ${thr.maxPressure})`);
  if (thr.minPressure > 0 && pr < thr.minPressure)
    msgs.push(`Bosim PAST: ${pr.toFixed(2)} bar (min ${thr.minPressure})`);

  return msgs;
}

/** Badge holati */
export function getBadgeStatus(value, min, max) {
  if (value === null || value === undefined) return 'normal';
  if (value > max || (min > 0 && value < min)) return 'danger';
  if (value > max * 0.87) return 'warning';
  return 'normal';
}

/** Massiv o'rtachasi */
export function avg(arr) {
  if (!arr.length) return 0;
  return arr.reduce((a, b) => a + b, 0) / arr.length;
}
