import { useState, useEffect, useRef } from 'react';
import supabase from '../lib/supabase';

const MAX_RT_POINTS = 50;
const MAX_TABLE_ROWS = 15;

/**
 * Real vaqt sensor ma'lumotlarini Supabase'dan oladi.
 * - boshlang'ich 50 ta yozuvni yuklaydi
 * - yangi INSERT'larni realtime subscription orqali qabul qiladi
 */
export function useSensorData() {
  const [latest,    setLatest]    = useState(null);
  const [tableRows, setTableRows] = useState([]);
  const [rtPoints,  setRtPoints]  = useState({ labels: [], flow: [], pressure: [] });
  const [connected, setConnected] = useState(false);
  const [loading,   setLoading]   = useState(true);

  const channelRef = useRef(null);

  useEffect(() => {
    loadInitial();
    subscribeRealtime();
    return () => {
      if (channelRef.current) supabase.removeChannel(channelRef.current);
    };
  }, []);

  async function loadInitial() {
    try {
      const { data, error } = await supabase
        .from('sensor_readings')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(MAX_RT_POINTS);

      if (error) throw error;
      if (!data?.length) return;

      setLatest(data[0]);
      setTableRows(data.slice(0, MAX_TABLE_ROWS));

      const sorted = [...data].reverse();
      setRtPoints({
        labels:   sorted.map(r => new Date(r.created_at)
          .toLocaleTimeString('uz-UZ', { hour: '2-digit', minute: '2-digit', second: '2-digit' })),
        flow:     sorted.map(r => r.flow_rate),
        pressure: sorted.map(r => r.pressure),
      });
    } catch (err) {
      console.error('Ma\'lumot yuklashda xatolik:', err.message);
    } finally {
      setLoading(false);
    }
  }

  function subscribeRealtime() {
    channelRef.current = supabase
      .channel('sensor-live')
      .on('postgres_changes', {
        event: 'INSERT', schema: 'public', table: 'sensor_readings',
      }, ({ new: row }) => {
        setLatest(row);
        setConnected(true);

        setTableRows(prev => [row, ...prev].slice(0, MAX_TABLE_ROWS));

        const label = new Date(row.created_at)
          .toLocaleTimeString('uz-UZ', { hour: '2-digit', minute: '2-digit', second: '2-digit' });

        setRtPoints(prev => {
          const labels   = [...prev.labels,   label        ].slice(-MAX_RT_POINTS);
          const flow     = [...prev.flow,     row.flow_rate ].slice(-MAX_RT_POINTS);
          const pressure = [...prev.pressure, row.pressure  ].slice(-MAX_RT_POINTS);
          return { labels, flow, pressure };
        });
      })
      .subscribe(status => {
        setConnected(status === 'SUBSCRIBED');
      });
  }

  return { latest, tableRows, rtPoints, connected, loading };
}
