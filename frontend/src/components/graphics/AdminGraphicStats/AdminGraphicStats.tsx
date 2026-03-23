import { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import dayjs from 'dayjs';
import { Snackbar } from '@mui/material';
import { environment } from '../../../assets/environment/environment.ts';
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

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const BASE_URL = environment.baseUrl;

interface StatDataItem {
  startDate: string;
  endDate: string;
  count: number;
}

export const AdminOrdersChart = () => {
  const [chartData, setChartData] = useState<ChartData<'bar'> | null>(null);
  const [snackOpen, setSnackOpen] = useState(false);
  const [snackMessage, setSnackMessage] = useState('');

  useEffect(() => {
    const fetchAdminStats = async () => {
      const dateStart = '2026-03-01';
      const dateEnd = dayjs().format('YYYY-MM-DD');

      try {
        const response = await fetch(`${BASE_URL}/statistics/total?dateStart=${dateStart}&dateEnd=${dateEnd}`, {
          method: 'GET',
          headers: {
            'Authorization': `${localStorage.getItem('token')}`,
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) throw new Error('Server Error');
        const result: StatDataItem[] = await response.json();

        setChartData({
          labels: result.map((d) => `Week (${dayjs(d.startDate).format('DD/MM/YYYY')})`),
          datasets: [
            {
              label: 'Total System Orders',
              data: result.map(d => d.count),
              backgroundColor: '#1a3e2b',
              borderRadius: 4,
            },
          ],
        });
      } catch (error) {
        setSnackMessage(error instanceof Error ? error.message : 'error');
        setSnackOpen(true);
      }
    };

    fetchAdminStats();
  }, []);

  return (
      <div className="admin-chart-wrapper" style={{ padding: '20px', borderRadius: '12px', height: '400px', width: '600px' }}>
        <h3 style={{ marginBottom: '20px', fontFamily: 'Montserrat' }}>Global System Statistics</h3>
        {chartData && (
            <Bar
                data={chartData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  scales: {
                    y: { beginAtZero: true, ticks: { stepSize: 1, precision: 0 } },
                    x: {
                      ticks: {
                        maxRotation: 45,
                        minRotation: 45
                      }
                    }
                  }
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