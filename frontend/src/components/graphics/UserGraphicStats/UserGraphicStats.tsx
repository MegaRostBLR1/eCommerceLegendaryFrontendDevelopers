import { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import dayjs from 'dayjs';
import { Snackbar } from '@mui/material';
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

export const UserOrdersChart = ({ startDate, endDate, userId: propsUserId }: UserChartProps) => {
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
          labels: fullWeekDays.map((day) => day.format('ddd DD/MM')),
          datasets: [
            {
              fill: true,
              label: 'Daily Orders',
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
          error instanceof Error ? error.message : 'Error fetching user stats'
        );
        setSnackOpen(true);
      }
    };

    fetchUserStats();
  }, [UserId, startDate, endDate]);

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
        Weekly Activity
      </h3>
      {chartData && (
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