import { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import dayjs from 'dayjs';
import isoWeek from 'dayjs/plugin/isoWeek';
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

dayjs.extend(isoWeek);

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
      const dateEnd = dayjs().endOf('isoWeek').format('YYYY-MM-DD');

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

        const cleanResult = result.filter(d => d.startDate !== d.endDate);

        setChartData({
          labels: cleanResult.map((d) => {
            const start = dayjs(d.startDate).format('DD/MM');
            const end = dayjs(d.endDate).format('DD/MM/YYYY');
            return `${start} - ${end}`;
          }),
          datasets: [
            {
              label: 'Total System Orders',
              data: cleanResult.map(d => d.count),
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
      <div className="admin-chart-wrapper" style={{
        padding: '10px 20px',
        borderRadius: '12px',
        height: '400px',
        width: '600px',
        display: 'flex',
        flexDirection: 'column'
      }}>
        <h3 style={{ marginBottom: '15px', fontFamily: 'Montserrat', fontSize: '18px' }}>
          Global System Statistics
        </h3>

        {chartData && (
            <div style={{ flex: 1, position: 'relative' }}>
              <Bar
                  data={chartData}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    layout: {
                      padding: {
                        bottom: 15
                      }
                    },
                    scales: {
                      y: {
                        beginAtZero: true,
                        ticks: {
                          stepSize: 1,
                          precision: 0,
                          font: { size: 10 }
                        }
                      },
                      x: {
                        grid: { display: false },
                        ticks: {
                          maxRotation: 0,
                          autoSkip: false,
                          padding: 8,
                          font: { size: 9 }
                        }
                      }
                    },
                    plugins: {
                      legend: {
                        labels: { boxWidth: 12, font: { size: 11 } }
                      }
                    }
                  }}
              />
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