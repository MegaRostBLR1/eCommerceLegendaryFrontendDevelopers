import { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import dayjs from 'dayjs';
import 'dayjs/locale/ru';
import 'dayjs/locale/en';
import { Snackbar } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { authorizationService } from '../../../services/authorization-service.ts';
import { apiService } from '../../../services/api-service.ts';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Filler,
  Legend,
  type ChartData,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Filler,
  Legend
);

interface DailyDataItem {
  date?: string;
  startDate?: string;
  count: number;
}

interface UserChartProps {
  startDate: dayjs.Dayjs;
  endDate: dayjs.Dayjs;
  userId?: number;
}

export const UserOrdersChart = ({
  startDate,
  endDate,
  userId: propsUserId,
}: UserChartProps) => {
  const { t, i18n } = useTranslation();
  const [chartData, setChartData] = useState<ChartData<'line'> | null>(null);
  const [snackOpen, setSnackOpen] = useState(false);
  const [snackMessage, setSnackMessage] = useState('');

  const UserId = propsUserId || authorizationService.getUserId();

  useEffect(() => {
    const fetchUserStats = async () => {
      if (!UserId) return;

      const dateStart = startDate.format('YYYY-MM-DD');
      const dateEnd = endDate.format('YYYY-MM-DD');
      const endpoint = `/statistics/users/${UserId}?dateStart=${dateStart}&dateEnd=${dateEnd}`;

      try {
        const result = await apiService<DailyDataItem[]>(endpoint);

        const fullWeekDays = Array.from({ length: 7 }).map((_, i) =>
          startDate.add(i, 'day')
        );

        const normalizedCounts = fullWeekDays.map((day) => {
          const found = result.find((d) =>
            dayjs(d.date || d.startDate).isSame(day, 'day')
          );
          return found ? found.count : 0;
        });

        setChartData({
          labels: fullWeekDays.map((day) =>
            day.locale(i18n.language).format('ddd DD/MM')
          ),
          datasets: [
            {
              fill: true,
              label: t('stats.dailyOrders'),
              data: normalizedCounts,
              borderColor: '#1a3e2b',
              backgroundColor: 'rgba(26, 62, 43, 0.15)',
              tension: 0.4,
              pointRadius: 6,
              pointHoverRadius: 8,
              pointBackgroundColor: '#1a3e2b',
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

    fetchUserStats();
  }, [UserId, startDate, endDate, t, i18n.language]);

  return (
    <div
      className="chart-container"
      style={{
        padding: '20px',
        borderRadius: '12px',
        height: '300px',
        width: '500px',
      }}
    >
      <h3
        className="stats-title"
        style={{ marginBottom: '20px', fontFamily: 'Montserrat' }}
      >
        {t('stats.title')}
      </h3>
      {chartData ? (
        <Line
          data={chartData}
          options={{
            responsive: true,
            maintainAspectRatio: false,
            scales: {
              y: {
                beginAtZero: true,
                ticks: { stepSize: 1, precision: 0 },
                suggestedMax: 5,
              },
            },
          }}
        />
      ) : (
        <div style={{ textAlign: 'center', marginTop: '50px' }}>Loading...</div>
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
