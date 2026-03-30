import { useEffect } from 'react';
import dayjs, { Dayjs } from 'dayjs';
import 'dayjs/locale/ru';
import 'dayjs/locale/en';
import { Paper } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { UserGraphicOrdersStats } from '../../../components/graphics/UserGraphicOrdersStats/UserGraphicOrdersStats.tsx';
import { AdminOrdersChart } from '../../../components/graphics/AdminGraphicStats/AdminGraphicStats.tsx';
import { authorizationService } from '../../../services/authorization-service.ts';
import './admin-stats-page.css';

export const AdminStatsPage = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const startDateParam = searchParams.get('startDate');
  const endDateParam = searchParams.get('endDate');

  const startDate = startDateParam
    ? dayjs(startDateParam)
    : dayjs().startOf('month');
  const endDate = endDateParam ? dayjs(endDateParam) : dayjs().endOf('month');

  const dateStartStr = startDate.format('YYYY-MM-DD');
  const dateEndStr = endDate.format('YYYY-MM-DD');

  useEffect(() => {
    if (
      !authorizationService.isAuthUser() ||
      !authorizationService.userIsAdmin()
    ) {
      navigate('/');
      return;
    }

    if (!startDateParam || !endDateParam) {
      setSearchParams(
        (prev) => {
          if (!startDateParam) prev.set('startDate', dateStartStr);
          if (!endDateParam) prev.set('endDate', dateEndStr);
          return prev;
        },
        { replace: true }
      );
    }
  }, [
    navigate,
    startDateParam,
    endDateParam,
    dateStartStr,
    dateEndStr,
    setSearchParams,
  ]);

  const handleStartDateChange = (newValue: Dayjs | null) => {
    if (newValue) {
      setSearchParams((prev) => {
        prev.set('startDate', newValue.format('YYYY-MM-DD'));
        return prev;
      });
    }
  };

  const handleEndDateChange = (newValue: Dayjs | null) => {
    if (newValue) {
      setSearchParams((prev) => {
        prev.set('endDate', newValue.format('YYYY-MM-DD'));
        return prev;
      });
    }
  };

  return (
    <section className="stats-preview">
      <div className="stats-page-container">
        <div className="weekpicker-container">
          <LocalizationProvider
            dateAdapter={AdapterDayjs}
            adapterLocale={i18n.language}
          >
            <Paper
              elevation={0}
              variant="outlined"
              sx={{
                display: 'flex',
                gap: 2,
                p: 2,
                borderRadius: 2,
                bgcolor: 'background.paper',
                flexWrap: 'wrap',
                justifyContent: 'center',
              }}
            >
              <DatePicker
                label={t('stats.dateFrom')}
                value={startDate}
                onChange={handleStartDateChange}
                format="DD.MM.YYYY"
                slotProps={{ textField: { size: 'small' } }}
              />

              <DatePicker
                label={t('stats.tillDate')}
                value={endDate}
                onChange={handleEndDateChange}
                minDate={startDate}
                format="DD.MM.YYYY"
                slotProps={{ textField: { size: 'small' } }}
              />
            </Paper>
          </LocalizationProvider>
        </div>

        <div
          className="graphic-container"
          style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}
        >
          <div className="stats-card">
            <AdminOrdersChart />
          </div>
          <div className="stats-card">
            <UserGraphicOrdersStats
              startDate={dateStartStr}
              endDate={dateEndStr}
            />
          </div>
        </div>
      </div>
    </section>
  );
};
