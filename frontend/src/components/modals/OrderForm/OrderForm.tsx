import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  IconButton,
  TextField,
  Snackbar,
} from '@mui/material';
import { useState, useMemo } from 'react';
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import dayjs, { Dayjs } from 'dayjs';
import React from 'react';
import type { Service } from '../../../types';
import { apiService } from '../../../services/api-service.ts';
import './order-form.css';

interface OpenOrderFormProps {
  open: boolean;
  onClose: () => void;
  service?: Service;
  orderId?: number;
  isEdit?: boolean;
  onRefresh?: () => void;
  initialDate?: string;
}

export default function OpenOrderForm({
  open,
  onClose,
  service,
  orderId,
  isEdit,
  onRefresh,
  initialDate,
}: OpenOrderFormProps) {
  const defaultDateTime = dayjs()
    .add(1, 'day')
    .set('hour', 8)
    .set('minute', 0)
    .set('second', 0);

  const [date, setDate] = useState<Dayjs | null>(
    initialDate ? dayjs(initialDate) : defaultDateTime
  );
  const [snackOpen, setSnackOpen] = useState(false);
  const [snackMessage, setSnackMessage] = useState('');
  const [quantity, setQuantity] = useState(() => {
    if (isEdit && service?.workersCount) {
      return service.workersCount;
    }
    return 1;
  });

  const descriptionText = service?.description || 'No description provided';

  const isExpired = useMemo(() => {
    if (!initialDate) return false;
    return dayjs(initialDate).isBefore(dayjs(), 'day');
  }, [initialDate]);

  const handleConfirm = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const startDate = date ? date.toISOString() : null;
    if (!startDate) return;

    const url = isEdit ? `/orders/${orderId}` : `/orders`;
    const method = isEdit ? 'PATCH' : 'POST';

    const payload = {
      startDate,
      quantity,
      duration: service?.duration || 0,
      price: service?.amount,
      ...(isEdit ? {} : { serviceId: service?.id }),
    };
    if (payload.price === undefined || payload.price === null) {
      console.error(
        'Error: The service does not have a price (amount) specified'
      );
    }
    try {
      await apiService(url, {
        method: method,
        body: JSON.stringify(payload),
      });

      onRefresh?.();
      onClose();
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Error creating order';
      setSnackMessage(errorMessage);
      setSnackOpen(true);
    }
  };

  return (
    <>
      <Snackbar
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        open={snackOpen}
        autoHideDuration={5000}
        onClose={() => setSnackOpen(false)}
        message={snackMessage}
      />
      <Dialog
        open={open}
        onClose={(_, reason) => {
          if (reason !== 'backdropClick' && reason !== 'escapeKeyDown') {
            onClose();
          }
        }}
        PaperProps={{
          component: 'form',
          onSubmit: handleConfirm,
          sx: { width: '466px', p: '40px', borderRadius: 0 },
        }}
      >
        <DialogTitle className="order-form-title">
          <div className="order-form-logo">
            <img src="/page-logo.svg" alt="logo" />
            <span className="team-name-order">
              Legendary <br /> Frontend
            </span>
          </div>
          <div className="close-order-form-container">
            <IconButton onClick={onClose}>
              <CloseOutlinedIcon />
            </IconButton>
          </div>
        </DialogTitle>

        <DialogContent className="dialog-content">
          <div className="order-title-container">
            <span>{isEdit ? 'edit order' : 'to order'}</span>
          </div>

          <TextField
            label="Service"
            variant="standard"
            value={service?.name || ''}
            fullWidth
            InputProps={{ readOnly: true, tabIndex: -1 }}
            sx={{
              mb: 2,
              '& .MuiInput-underline:before': {
                borderBottom: '1px solid rgba(0,0,0,0.12) !important',
              },
              '& .MuiInput-underline:after': { display: 'none' },
            }}
          />

          {!isExpired ? (
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                label="Date"
                value={date}
                disablePast
                onChange={(newValue) => setDate(newValue)}
                slotProps={{
                  textField: {
                    required: true,
                    variant: 'standard',
                    fullWidth: true,
                    sx: { mb: 2 },
                  },
                }}
              />
              <TimePicker
                label="Time"
                value={date}
                onChange={(newValue) => setDate(newValue)}
                slotProps={{
                  textField: {
                    required: true,
                    variant: 'standard',
                    fullWidth: true,
                    sx: { mb: 2 },
                  },
                }}
              />
            </LocalizationProvider>
          ) : (
            <div
              style={{
                color: '#d32f2f',
                textAlign: 'center',
                fontSize: '14px',
                fontWeight: 'bold',
              }}
            >
              Order date has arrived.
            </div>
          )}

          <TextField
            label="Quantity"
            type="number"
            variant="standard"
            value={quantity}
            onChange={(e) => setQuantity(Math.max(1, Number(e.target.value)))}
            fullWidth
            inputProps={{ min: 1 }}
            sx={{ mb: 2 }}
          />

          <TextField
            label="Description"
            variant="standard"
            multiline
            rows={2}
            value={descriptionText}
            fullWidth
            InputProps={{
              readOnly: true,
              tabIndex: -1,
            }}
            sx={{
              mb: 2,
              '& .MuiInput-underline:after': { display: 'none' },
              '& .MuiInput-underline:hover:not(.Mui-disabled):before': {
                borderBottom: '1px solid rgba(0,0,0,0.42)',
              },
            }}
          />

          <span
            className="order-form-message"
            style={{ display: 'block', fontSize: '12px' }}
          >
            {isEdit
              ? 'You can only change the date and time.'
              : 'Order created.'}
          </span>
        </DialogContent>

        <DialogActions sx={{ justifyContent: 'center', gap: 2, pb: 2 }}>
          {!isExpired && (
            <Button
              type="submit"
              variant="contained"
              className="confirm-order-btn"
            >
              confirm
            </Button>
          )}
          <Button onClick={onClose} className="cancel-order-btn">
            {isExpired ? 'close' : 'cancel'}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
