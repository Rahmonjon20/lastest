import {
  Chart as ChartJS, CategoryScale, LinearScale,
  PointElement, LineElement, BarElement, Title, Tooltip, Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import styles from './Chart.module.css';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend);

const OPTIONS = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { labels: { color: '#94a3b8', font: { size: 11 }, boxWidth: 10, padding: 10 } },
    tooltip: {
      backgroundColor: '#1e2f45',
      borderColor: '#253a52',
      borderWidth: 1,
      titleColor: '#e2e8f0',
      bodyColor: '#94a3b8',
    },
  },
  scales: {
    x: {
      ticks: { color: '#4b6480', font: { size: 10 } },
      grid:  { color: 'rgba(255,255,255,.04)' },
    },
    y1: {
      position: 'left',
      ticks: { color: '#3b82f6', font: { size: 10 } },
      grid:  { color: 'rgba(255,255,255,.04)' },
    },
    y2: {
      position: 'right',
      ticks: { color: '#f59e0b', font: { size: 10 } },
      grid:  { display: false },
    },
  },
};

export default function HistoryChart({ stats }) {
  const data = {
    labels: stats.map(s => s.day),
    datasets: [
      {
        type: 'bar',
        label: 'Ort. oqim (L/min)', data: stats.map(s => s.avgFlow),
        backgroundColor: 'rgba(59,130,246,.55)', borderColor: '#3b82f6', borderWidth: 1,
        yAxisID: 'y1',
      },
      {
        type: 'line',
        label: 'Ort. bosim (bar)', data: stats.map(s => s.avgPressure),
        borderColor: '#f59e0b', backgroundColor: 'rgba(245,158,11,.12)',
        borderWidth: 2, tension: .3, pointRadius: 5, pointBackgroundColor: '#f59e0b',
        fill: false, yAxisID: 'y2',
      },
    ],
  };

  return (
    <div className={styles.card}>
      <p className={styles.heading}>📅 5 kunlik o'rtacha</p>
      {stats.length === 0
        ? <p className={styles.empty}>Ma'lumot yo'q — ESP32 ulangach to'ladi</p>
        : <div className={styles.wrap}><Bar data={data} options={OPTIONS} /></div>
      }
    </div>
  );
}
