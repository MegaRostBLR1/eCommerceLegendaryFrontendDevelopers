import './order-form.css';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  IconButton,
  TextField,
} from '@mui/material';
import { useState } from 'react';
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { Dayjs } from 'dayjs';
import React from 'react';

export default function OpenOrderForm() {
  const [open, setOpen] = useState(false);
  const [date, setDate] = useState<Dayjs | null>(null);
  {
    /* тут открывается модалка const handleClickOpen = () => setOpen(true);*/
  }
  const handleClose = () => setOpen(false);

  const handleConfirm = (e: React.FormEvent<HTMLFormElement>) => {
    {
      /*Обрабатываем результаты работы с инпутами и кладем их ве объект*/
    }
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());
    data.date = date ? date.format('DD.MM.YYYY') : '';
  };
  return (
    <>
      <Dialog
        open={open}
        onClose={handleClose}
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
            <IconButton
              className={'close-order-form-btn'}
              onClick={handleClose}
            >
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
          <Button onClick={handleClose} className={'cancel-order-btn'}>
            cancel
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
