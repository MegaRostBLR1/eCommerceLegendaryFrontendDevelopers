import { useEffect, useState, useRef } from 'react';
import { Bar, getElementAtEvent } from 'react-chartjs-2';
import { Snackbar } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { apiService } from '../../../services/api-service.ts';
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

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface UserStatItem {
  count: number;
  id: number;
  email: string;
  role: string;
  lastName: string | null;
  firstName: string | null;
  patronymic: string | null;
}

export const UserGraphicOrdersStats = ({
  startDate,
  endDate,
}: {
  startDate: string;
  endDate: string;
}) => {
  const { t, i18n } = useTranslation();
  const [chartData, setChartData] = useState<ChartData<'bar'> | null>(null);
  const [rawUsers, setRawUsers] = useState<UserStatItem[]>([]);
  const [snackOpen, setSnackOpen] = useState(false);
  const [snackMessage, setSnackMessage] = useState('');

  const navigate = useNavigate();
  const chartRef = useRef<ChartJS<'bar'>>(null);

  useEffect(() => {
    if (!startDate || !endDate) return;

    const fetchUserStats = async () => {
      setChartData(null);
      const endpoint = `/statistics/total/users?dateStart=${startDate}&dateEnd=${endDate}`;

      try {
        const result = await apiService<UserStatItem[]>(endpoint);
        setRawUsers(result);

        setChartData({
          labels: result.map((user) => user.email),
          datasets: [
            {
              label: t('stats.ordersCount'),
              data: result.map((u) => u.count),
              backgroundColor: '#1a3e2b',
              hoverBackgroundColor: '#2d6a4f',
              borderRadius: 4,
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
  }, [startDate, endDate, t, i18n.language]);

  const handleChartClick = (event: React.MouseEvent<HTMLCanvasElement>) => {
    const { current: chart } = chartRef;
    if (!chart) return;

    const element = getElementAtEvent(chart, event);

    if (element.length > 0) {
      const { index } = element[0];
      const clickedUser = rawUsers[index];
      navigate(`/statistics/users/${clickedUser.id}`);
    }
  };

  return (
    <div
      className="admin-chart-wrapper"
      style={{
        padding: '10px 20px',
        borderRadius: '12px',
        height: '500px',
        width: '100%',
        maxWidth: '800px',
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
        {t('stats.userChartTitle')}
      </h3>

      <div style={{ flex: 1, position: 'relative' }}>
        {chartData ? (
          <Bar
            ref={chartRef}
            data={chartData}
            onClick={handleChartClick}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              onHover: (event, chartElement) => {
                if (
                  event.native &&
                  event.native.target instanceof HTMLElement
                ) {
                  event.native.target.style.cursor = chartElement.length
                    ? 'pointer'
                    : 'default';
                }
              },
              plugins: {
                legend: { display: false },
                tooltip: {
                  enabled: true,
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
                    font: { family: 'Montserrat' },
                  },
                },
                x: {
                  grid: { display: false },
                  ticks: {
                    display: true,
                    autoSkip: false,
                    maxRotation: 45,
                    minRotation: 45,
                    font: {
                      size: 11,
                      family: 'Montserrat',
                    },
                  },
                },
              },
            }}
          />
        ) : (
          <div style={{ textAlign: 'center', marginTop: '50px' }}>
            {t('common.loading')}
          </div>
        )}
      </div>

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
