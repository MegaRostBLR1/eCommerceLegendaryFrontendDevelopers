import { useState } from 'react';
import { useParams } from 'react-router-dom';
import dayjs from 'dayjs';
import 'dayjs/locale/ru';
import isoWeek from 'dayjs/plugin/isoWeek';
import { UserOrdersChart } from '../../../components/graphics/UserGraphicStats/UserGraphicStats.tsx';
import { IconButton, Typography, Paper } from '@mui/material';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import { useTranslation } from 'react-i18next';
import './user-stats-page.css';

dayjs.extend(isoWeek);

export const UserStatsPage = () => {
  const { t } = useTranslation();
  const { userId } = useParams<{ userId: string }>();

  const currentWeekStart = dayjs().startOf('isoWeek');
  const [startDate, setStartDate] = useState(currentWeekStart);

  const handlePrevWeek = () => setStartDate(startDate.subtract(1, 'week'));
  const handleNextWeek = () => setStartDate(startDate.add(1, 'week'));

  const endDate = startDate.endOf('isoWeek');

  const isLastAvailableWeek =
    startDate.isSame(currentWeekStart, 'day') ||
    startDate.isAfter(currentWeekStart);

  return (
    <section className="stats-preview">
      <div className="page-container">
        <div className="stats-header">
          <Typography
            variant="h5"
            sx={{
              mr: 3,
              mb: 2,
              fontFamily: 'Montserrat',
              fontWeight: 600,
            }}
          >
            {userId
              ? `${t('stats.userActivityTitle', 'Активность пользователя')} (ID: ${userId})`
              : t('stats.myActivityTitle', 'Ваша активность')}
          </Typography>

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
                {startDate.format('DD MMM')} — {endDate.format('DD MMM YYYY')}
              </Typography>

              <IconButton
                onClick={handleNextWeek}
                size="small"
                disabled={isLastAvailableWeek}
              >
                <ArrowForwardIosIcon
                  fontSize="small"
                  sx={{
                    color: isLastAvailableWeek ? 'action.disabled' : 'inherit',
                  }}
                />
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
