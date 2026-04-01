import { useState } from 'react';
import { useParams } from 'react-router-dom';
import dayjs from 'dayjs';
import 'dayjs/locale/ru';
import 'dayjs/locale/en';
import isoWeek from 'dayjs/plugin/isoWeek';
import { UserOrdersChart } from '../../../components/graphics/UserGraphicStats/UserGraphicStats.tsx';
import { IconButton, Typography, Paper } from '@mui/material';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import { useTranslation } from 'react-i18next';
import './user-stats-page.css';

dayjs.extend(isoWeek);

export const UserStatsPage = () => {
  const { userId } = useParams<{ userId: string }>();
  const { i18n } = useTranslation();

  const currentWeekStart = dayjs().startOf('isoWeek');
  const [startDate, setStartDate] = useState(currentWeekStart);

  const handlePrevWeek = () => setStartDate(startDate.subtract(1, 'week'));
  const handleNextWeek = () => setStartDate(startDate.add(1, 'week'));

  const endDate = startDate.endOf('isoWeek');

  return (
    <section className="stats-preview">
      <div className="page-container">
        <div className="stats-header">
          <div
            className="weekpicker-container"
            style={{ marginBottom: '20px' }}
          >
            <Paper
              elevation={0}
              variant="outlined"
              sx={{
                display: 'flex',
                alignItems: 'center',
                p: 0.5,
                borderRadius: 2,
                bgcolor: 'background.paper',
                width: 'fit-content',
              }}
            >
              <IconButton onClick={handlePrevWeek} size="small">
                <ArrowBackIosNewIcon fontSize="small" />
              </IconButton>

              <Typography
                sx={{
                  mx: 2,
                  fontWeight: 500,
                  minWidth: '180px',
                  textAlign: 'center',
                  textTransform: 'capitalize',
                }}
              >
                {startDate.locale(i18n.language).format('DD MMM')} — {endDate.locale(i18n.language).format('DD MMM YYYY')}
              </Typography>

              <IconButton
                onClick={handleNextWeek}
                size="small"
              >
                <ArrowForwardIosIcon fontSize="small" />
              </IconButton>
            </Paper>
          </div>
        </div>

        <div className="stats-grid">
          <div className="stats-card">
            <UserOrdersChart
              startDate={startDate}
              endDate={endDate}
              userId={userId ? Number(userId) : undefined}
            />
          </div>
        </div>
      </div>
    </section>
  );
};