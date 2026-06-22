import { useState, useCallback } from 'react';

const DEFAULTS = {
  maxFlow:     10,
  minFlow:     0,
  maxPressure: 8,
  minPressure: 0,
};

function load() {
  try {
    const raw = localStorage.getItem('pipeline_thresholds');
    return raw ? { ...DEFAULTS, ...JSON.parse(raw) } : DEFAULTS;
  } catch {
    return DEFAULTS;
  }
}

/**
 * Ogohlantirish chegaralarini boshqaradi va localStorage'ga saqlaydi.
 */
export function useThresholds() {
  const [thresholds, setThresholds] = useState(load);

  const saveThresholds = useCallback((newValues) => {
    const merged = { ...thresholds, ...newValues };
    setThresholds(merged);
    localStorage.setItem('pipeline_thresholds', JSON.stringify(merged));
  }, [thresholds]);

  return { thresholds, saveThresholds };
}
