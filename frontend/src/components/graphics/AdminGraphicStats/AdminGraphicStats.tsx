import { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import dayjs from 'dayjs';
import isoWeek from 'dayjs/plugin/isoWeek';
import { Snackbar } from '@mui/material';
import { apiService } from '../../../services/api-service.ts';
import { useTranslation } from 'react-i18next';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  type ChartData,
} from 'chart.js';

dayjs.extend(isoWeek);

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface StatDataItem {
  startDate: string;
  endDate: string;
  count: number;
}

export const AdminOrdersChart = () => {
  const [chartData, setChartData] = useState<ChartData<'bar'> | null>(null);
  const [snackOpen, setSnackOpen] = useState(false);
  const [snackMessage, setSnackMessage] = useState('');
  const { t, i18n } = useTranslation();

  useEffect(() => {
    const fetchAdminStats = async () => {
      const dateStart = '2026-03-01';
      const dateEnd = '2026-09-30';
      const endpoint = `/statistics/total?dateStart=${dateStart}&dateEnd=${dateEnd}`;

      try {
        const result = await apiService<StatDataItem[]>(endpoint);

        setChartData({
          labels: result.map((date) => {
            const start = dayjs(date.startDate).format('DD/MM');
            const end = dayjs(date.endDate).format('DD/MM/YYYY');
            return `${start} - ${end}`;
          }),
          datasets: [
            {
              label: t('stats.totalSystemOrders'),
              data: result.map((d) => d.count),
              backgroundColor: '#1a3e2b',
              borderRadius: 4,
            },
          ],
        });
      } catch (error) {
        setSnackMessage(
          error instanceof Error ? error.message : t('stats.errorLoad')
        );
        setSnackOpen(true);
      }
    };

    fetchAdminStats();
  }, [t, i18n.language]);

  return (
    <div
      className="admin-chart-wrapper"
      style={{
        padding: '10px 20px',
        borderRadius: '12px',
        height: '600px',
        width: '1000px',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <h3
        style={{
          marginBottom: '15px',
          fontFamily: 'Montserrat',
          fontSize: '18px',
        }}
      >
        {t('stats.allStatsTitle')}
      </h3>

      {chartData ? (
        <div style={{ flex: 1, position: 'relative', width: '100%' }}>
          <Bar
            data={chartData}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                legend: {
                  labels: { boxWidth: 12, font: { size: 11 } },
                },
                tooltip: {
                  callbacks: {
                    label: (context) => `${t('stats.orders')}: ${context.raw}`,
                  },
                },
              },
              scales: {
                y: {
                  beginAtZero: true,
                  ticks: {
                    stepSize: 1,
                    precision: 0,
                    font: { size: 10 },
                  },
                },
                x: {
                  grid: { display: false },
                  ticks: {
                    display: true,
                    autoSkip: true,
                    maxRotation: 45,
                    minRotation: 45,
                    font: { size: 10 },
                  },
                },
              },
            }}
          />
        </div>
      ) : (
        <div style={{ textAlign: 'center', marginTop: '50px' }}>
          {t('common.loading')}
        </div>
      )}

      <Snackbar
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        open={snackOpen}
        autoHideDuration={5000}
        onClose={() => setSnackOpen(false)}
        message={snackMessage}
      />
    </div>
  );
};
