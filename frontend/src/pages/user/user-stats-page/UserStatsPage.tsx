import { useSearchParams } from 'react-router-dom';
import dayjs from 'dayjs';
import 'dayjs/locale/ru';
import isoWeek from 'dayjs/plugin/isoWeek';
import { UserOrdersChart } from '../../../components/graphics/UserGraphicStats/UserGraphicStats.tsx';
import { IconButton, Typography, Paper } from '@mui/material';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import './user-stats-page.css';

dayjs.extend(isoWeek);

export const UserStatsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const dateStartParam = searchParams.get('dateStart');
  const dateEndParam = searchParams.get('dateEnd');

  const startDate = dateStartParam
    ? dayjs(dateStartParam)
    : dayjs().startOf('month');

  const endDate = dateEndParam ? dayjs(dateEndParam) : dayjs().endOf('month');

  const updatePeriod = (newStart: dayjs.Dayjs) => {
    setSearchParams({
      dateStart: newStart.format('YYYY-MM-DD'),
      dateEnd: newStart.endOf('isoWeek').format('YYYY-MM-DD'),
    });
  };

  const handlePrevWeek = () =>
    updatePeriod(startDate.subtract(1, 'week').startOf('isoWeek'));
  const handleNextWeek = () =>
    updatePeriod(startDate.add(1, 'week').startOf('isoWeek'));

  const isLastAvailableWeek =
    startDate.isAfter(dayjs(), 'week') || startDate.isSame(dayjs(), 'week');

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
            <div className="chart-wrapper">
              <UserOrdersChart startDate={startDate} endDate={endDate} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
