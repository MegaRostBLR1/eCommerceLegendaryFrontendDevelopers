import './order-form.css';
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
import { useState } from 'react';
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { Dayjs } from 'dayjs';
import React from 'react';
import type { Service } from '../../../types';

const DEV_URL = import.meta.env.VITE_DEV_URL;

export default function OpenOrderForm({
  open,
  onClose,
  service,
}: {
  open: boolean;
  onClose: () => void;
  service?: Service;
}) {
  const [date, setDate] = useState<Dayjs | null>(null);
  const [snackOpen, setSnackOpen] = useState(false);
  const [snackMessage, setSnackMessage] = useState('');
  {
    /* тут открывается модалка const handleClickOpen = () => setOpen(true);*/
  }

  const handleConfirm = (e: React.FormEvent<HTMLFormElement>) => {
    {
      /*Обрабатываем результаты работы с инпутами и кладем их ве объект*/
    }
    e.preventDefault();

    const startDate = date ? date.format('DD.MM.YYYY') : '';
    const serviceId = service?.id;
    const price = service?.amount;

    fetch(`${DEV_URL}/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json;charset=utf-8',
      },
      body: JSON.stringify({ startDate, serviceId, price, quantity: 1 }),
    })
      .then((response) => {
        if (response.ok) {
          onClose();
        } else {
          response.json().then((errorData) => {
            setSnackMessage(errorData.message);
            setSnackOpen(true);
          });
        }
      })
      .catch((error) => {
        setSnackMessage(`${error}`);
        setSnackOpen(true);
      });
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
        onClose={onClose}
        PaperProps={{
          component: 'form',
          onSubmit: handleConfirm,
          sx: {
            width: '466px',
            height: '604px',
            padding: '40px',
            borderRadius: 0,
          },
        }}
      >
        <DialogTitle className={'order-form-title'}>
          <div className={'order-form-logo'}>
            <img src={'/page-logo.svg'} alt="logo" />
            <span className={'team-name-order'}>
              Legendary <br /> Frontend
            </span>
          </div>
          <div className={'close-order-form-container'}>
            <IconButton className={'close-order-form-btn'} onClick={onClose}>
              <CloseOutlinedIcon />
            </IconButton>
          </div>
        </DialogTitle>
        <DialogContent className={'dialog-content'}>
          <div className={'order-title-container'}>
            <span>to order</span>
          </div>
          <TextField
            name="userName"
            label={'Name'}
            variant={'standard'}
            required={true}
            className={'order-form-text-field'}
          />
          <TextField
            name="service"
            label={'Service'}
            variant={'standard'}
            required={true}
            value={service?.name}
            className={'order-form-text-field'}
          />
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              label="Date"
              value={date}
              onChange={(newValue) => setDate(newValue)}
              slotProps={{
                textField: {
                  required: true,
                  variant: 'standard',
                  fullWidth: true,
                  className: 'order-form-text-field',
                },
              }}
            />
          </LocalizationProvider>
          <span className={'order-form-message'}>
            Your order has been created. Please wait for confirmation in your
            profile.
          </span>
        </DialogContent>
        <DialogActions sx={{ justifyContent: 'center' }}>
          <Button
            type={'submit'}
            variant="contained"
            className={'confirm-order-btn'}
          >
            confirm
          </Button>
          <Button onClick={onClose} className={'cancel-order-btn'}>
            cancel
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
