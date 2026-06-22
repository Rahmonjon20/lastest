import {
  Chart as ChartJS, CategoryScale, LinearScale,
  PointElement, LineElement, Title, Tooltip, Legend, Filler,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import styles from './Chart.module.css';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler);

const CHART_OPTIONS = {
  responsive: true,
  maintainAspectRatio: false,
  animation: { duration: 250 },
  interaction: { mode: 'index', intersect: false },
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
      ticks: { color: '#4b6480', maxTicksLimit: 6, maxRotation: 0, font: { size: 10 } },
      grid:  { color: 'rgba(255,255,255,.04)' },
    },
    y1: {
      type: 'linear', position: 'left',
      title: { display: true, text: 'L/min', color: '#3b82f6', font: { size: 10 } },
      ticks: { color: '#3b82f6', font: { size: 10 } },
      grid:  { color: 'rgba(255,255,255,.04)' },
    },
    y2: {
      type: 'linear', position: 'right',
      title: { display: true, text: 'bar', color: '#f59e0b', font: { size: 10 } },
      ticks: { color: '#f59e0b', font: { size: 10 } },
      grid:  { display: false },
    },
  },
};

export default function RealtimeChart({ rtPoints }) {
  const data = {
    labels: rtPoints.labels,
    datasets: [
      {
        label: 'Oqim (L/min)', data: rtPoints.flow,
        borderColor: '#3b82f6', backgroundColor: 'rgba(59,130,246,.1)',
        borderWidth: 2, tension: .35, pointRadius: 0, fill: true, yAxisID: 'y1',
      },
      {
        label: 'Bosim (bar)', data: rtPoints.pressure,
        borderColor: '#f59e0b', backgroundColor: 'rgba(245,158,11,.06)',
        borderWidth: 2, tension: .35, pointRadius: 0, fill: false, yAxisID: 'y2',
      },
    ],
  };

  return (
    <div className={styles.card}>
      <p className={styles.heading}>🕐 Real vaqt grafigi (oxirgi 50 o'lchov)</p>
      <div className={styles.wrap}>
        <Line data={data} options={CHART_OPTIONS} />
      </div>
    </div>
  );
}
