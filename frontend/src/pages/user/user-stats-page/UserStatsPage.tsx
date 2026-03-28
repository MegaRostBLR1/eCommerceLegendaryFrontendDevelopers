import { useState, useEffect } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import dayjs from 'dayjs';
import 'dayjs/locale/ru';
import isoWeek from 'dayjs/plugin/isoWeek';
import { UserOrdersChart } from '../../../components/graphics/UserGraphicStats/UserGraphicStats.tsx';
import { IconButton, Typography, Paper } from '@mui/material';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import { authorizationService } from '../../../services/authorization-service.ts';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import './user-stats-page.css';

dayjs.extend(isoWeek);

export const UserStatsPage = () => {
  const { i18n } = useTranslation();
  const { userId } = useParams<{ userId: string }>();
  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    dayjs.locale(i18n.language);
  }, [i18n.language]);

  const currentWeekStart = dayjs().startOf('isoWeek');
  const [startDate, setStartDate] = useState(currentWeekStart);

  const handlePrevWeek = () =>
    setStartDate(startDate.subtract(1, 'week').startOf('isoWeek'));
  const handleNextWeek = () =>
    setStartDate(startDate.add(1, 'week').startOf('isoWeek'));

  const endDate = startDate.endOf('isoWeek');

  const isLastAvailableWeek =
    startDate.isSame(currentWeekStart, 'day') ||
    startDate.isAfter(currentWeekStart);

  const navigate = useNavigate();

  useEffect(() => {
    if (!authorizationService.isAuthUser()) {
      navigate('/');
    }
  }, [navigate]);

  return (
    <section className="stats-preview">
      <div className="page-container">
        <div className="stats-header">
          <div className="weekpicker-container">
            <Paper
              elevation={0}
              variant="outlined"
              sx={{
                display: 'flex',
                alignItems: 'center',
                p: 0.5,
                borderRadius: 2,
              }}
            >
              <IconButton onClick={handlePrevWeek} size="small">
                <ArrowBackIosNewIcon fontSize="small" />
              </IconButton>

              <Typography
                sx={{
                  mx: 2,
                  fontWeight: 500,
                  minWidth: '200px',
                  textAlign: 'center',
                  textTransform: 'capitalize',
                }}
              >
                {startDate.locale(i18n.language).format('DD MMM')} —{' '}
                {endDate.locale(i18n.language).format('DD MMM YYYY')}
              </Typography>

              <IconButton
                onClick={handleNextWeek}
                size="small"
                disabled={isLastAvailableWeek}
              >
                <ArrowForwardIosIcon fontSize="small" />
              </IconButton>
            </Paper>
          </div>
        </div>

        <div className="stats-grid">
          <div className="stats-card">
            <div className="chart-wrapper">
              <UserOrdersChart 
                startDate={startDate} 
                endDate={endDate} 
                userId={userId ? Number(userId) : undefined} 
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};