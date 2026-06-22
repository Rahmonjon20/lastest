import { useState, useEffect } from 'react';
import supabase from '../lib/supabase';
import { avg, fmtDay } from '../utils/helpers';

const REFRESH_INTERVAL = 5 * 60 * 1000; // 5 daqiqa

/**
 * So'nggi 5 kunlik kunlik o'rtacha statistikani qaytaradi.
 * @returns {{ day, avgFlow, avgPressure, count }[] }
 */
export function useDailyStats() {
  const [stats, setStats] = useState([]);

  useEffect(() => {
    fetchStats();
    const interval = setInterval(fetchStats, REFRESH_INTERVAL);
    return () => clearInterval(interval);
  }, []);

  async function fetchStats() {
    const since = new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString();

    const { data, error } = await supabase
      .from('sensor_readings')
      .select('created_at, flow_rate, pressure')
      .gte('created_at', since)
      .order('created_at', { ascending: true });

    if (error || !data?.length) return;

    // Kunlar bo'yicha guruhlash
    const grouped = data.reduce((acc, row) => {
      const day = fmtDay(row.created_at);
      if (!acc[day]) acc[day] = { flow: [], pressure: [] };
      acc[day].flow.push(row.flow_rate);
      acc[day].pressure.push(row.pressure);
      return acc;
    }, {});

    const result = Object.entries(grouped).map(([day, { flow, pressure }]) => ({
      day,
      avgFlow:     +avg(flow).toFixed(3),
      avgPressure: +avg(pressure).toFixed(2),
      count:       flow.length,
    }));

    setStats(result);
  }

  return stats;
}
