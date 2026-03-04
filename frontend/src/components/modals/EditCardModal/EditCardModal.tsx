import './edit-card-modal.css';
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
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';
import React, { useState } from 'react';
import type { Service } from '../../../types';
import { validationRules } from '../../../../constants/validation-rules.ts';
import { environment } from '../../../assets/environment/environment.ts';

export default function OpenOrderForm({
  open,
  onClose,
  service,
}: {
  open: boolean;
  onClose: () => void;
  service?: Service;
}) {
  const [snackOpen, setSnackOpen] = useState(false);
  const [snackMessage, setSnackMessage] = useState('');
  const BASE_URL = environment.baseUrl;

  const handleConfirm = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());

    let errorMessage = '';

    if (!validationRules.serviceName.test(data.serviceName as string)) {
      errorMessage = 'Incorrect service name (3-50 characters).';
    } else if (!validationRules.discount.test(data.discount as string)) {
      errorMessage = 'The discount must be a number (eg 1.1).';
    } else if (!validationRules.amount.test(data.amount as string)) {
      errorMessage = 'Amount must be an integer.';
    } else if (!validationRules.categories.test(data.categories as string)) {
      errorMessage = 'Categories must be numbers separated by commas (1, 2).';
    }

    if (errorMessage) {
      setSnackMessage(errorMessage);
      setSnackOpen(true);
      return;
    }

    const serviceId = service?.id;

    const json = {
      name: data.serviceName,
      discount: parseFloat(data.discount as string),
      amount: parseInt(data.amount as string),
      workersCount: parseInt(data.workersCount as string),
      duration: parseInt(data.duration as string),
      description: data.description,
      categories: (data.categories as string)
        .split(',')
        .map((id) => parseInt(id.trim())),
    };

    try {
      const response = await fetch(`${BASE_URL}/services/${serviceId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(json),
      });

      if (response.ok) {
        setSnackMessage('Service update successfully');
        setSnackOpen(true);
        window.location.reload();
      } else if (response.status === 403) {
        setSnackMessage('Sorry, you are denied access.');
        setSnackOpen(true);
      } else {
        const errorData = await response.json();
        setSnackMessage(`${errorData.message}` || 'Failed');
        setSnackOpen(true);
      }
    } catch (error) {
      setSnackMessage('Server error');
      setSnackOpen(true);
      console.log(error);
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
        onClose={onClose}
        key={service?.id}
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
        <DialogTitle className={'edit-card-modal-title'}>
          <div className={'order-form-logo'}>
            <img src={'/page-logo.svg'} alt="logo" />
            <span className={'team-name-order'}>
              Legendary <br /> Frontend
            </span>
          </div>
          <div className={'close-edit-card-modal-container'}>
            <IconButton className={'close-order-form-btn'} onClick={onClose}>
              <CloseOutlinedIcon />
            </IconButton>
          </div>
        </DialogTitle>
        <DialogContent className={'edit-card-modal-dialog-content'}>
          <TextField
            name="serviceName"
            label={'Service name'}
            variant={'standard'}
            required={true}
            defaultValue={service?.name}
            className={'order-form-text-field'}
          />
          <TextField
            name="discount"
            label={'Discount'}
            required={true}
            variant={'standard'}
            defaultValue={service?.discount || 0}
            className={'order-form-text-field'}
          />
          <TextField
            name="amount"
            label={'Amount'}
            required={true}
            variant={'standard'}
            defaultValue={service?.amount}
            className={'order-form-text-field'}
          />
          <TextField
            name="workersCount"
            label={'Workers count'}
            required={true}
            variant={'standard'}
            defaultValue={service?.workersCount}
            className={'order-form-text-field'}
          />
          <TextField
            name="duration"
            label={'Duration'}
            required={true}
            variant={'standard'}
            defaultValue={service?.duration}
            className={'order-form-text-field'}
          />
          <TextField
            name="description"
            label={'Description'}
            required={true}
            variant={'standard'}
            defaultValue={service?.description}
            className={'order-form-text-field'}
          />
          <TextField
            name="categories"
            label={'Categories'}
            variant={'standard'}
            defaultValue={service?.categories?.map((c) => c.id).join(', ')}
            className={'order-form-text-field'}
          />
        </DialogContent>
        <DialogActions sx={{ justifyContent: 'center' }}>
          <Button
            type={'submit'}
            variant="contained"
            className={'confirm-order-btn'}
          >
            send
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
