import { useState, useEffect } from 'react';
import dayjs from 'dayjs';
import 'dayjs/locale/ru';
import isoWeek from 'dayjs/plugin/isoWeek';
import { AdminOrdersChart } from '../../../components/graphics/AdminGraphicStats/AdminGraphicStats.tsx';
import { IconButton, Typography, Paper } from '@mui/material';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import './admin-stats-page.css';
import { UserOrdersChart } from '../../../components/graphics/UserGraphicStats/UserGraphicStats.tsx';
import { authorizationService } from '../../../services/authorization-service.ts';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

dayjs.extend(isoWeek);

export const AdminStatsPage = () => {
  const { i18n } = useTranslation();
  const currentWeekStart = dayjs().startOf('isoWeek');
  const [startDate, setStartDate] = useState(currentWeekStart);

  const handlePrevWeek = () => setStartDate(startDate.subtract(1, 'week'));
  const handleNextWeek = () => setStartDate(startDate.add(1, 'week'));

  const endDate = startDate.endOf('isoWeek');
  const isLastAvailableWeek =
    startDate.isSame(currentWeekStart, 'day') ||
    startDate.isAfter(currentWeekStart);

  const navigate = useNavigate();

  useEffect(() => {
    if (
      !authorizationService.isAuthUser() ||
      !authorizationService.userIsAdmin()
    ) {
      navigate('/');
    }
  }, [navigate]);

  return (
    <section className="stats-preview">
      <div className="stats-page-container">
        <div className="weekpicker-container">
          <Paper
            elevation={0}
            variant="outlined"
            sx={{
              display: 'flex',
              alignItems: 'center',
              p: 0.5,
              borderRadius: 2,
              bgcolor: 'background.paper',
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
              {startDate.locale(i18n.language).format('DD MMM')} —{' '}
              {endDate.locale(i18n.language).format('DD MMM YYYY')}
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

        <div className="graphic-container">
          <div className="stats-card">
            <UserOrdersChart startDate={startDate} endDate={endDate} />
          </div>
          <div className="stats-card">
            <AdminOrdersChart />
          </div>
        </div>
      </div>
    </section>
  );
};
