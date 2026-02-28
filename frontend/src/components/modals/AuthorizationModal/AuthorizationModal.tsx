import './authorization-modal.css';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  IconButton,
  TextField,
} from '@mui/material';
import React, { useState } from 'react';
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';
import Snackbar from '@mui/material/Snackbar';
import { authorizationService } from '../../../services/authorization-service.ts';

const DEV_URL = import.meta.env.VITE_DEV_URL;
export default function OpenLoginModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const [snackOpen, setSnackOpen] = useState(false);
  const [snackMessage, setSnackMessage] = useState('');
  const handleConfirm = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());
    const emailRegexp = /@/;
    const passwordRegexp = /^(?=.*[A-Z])(?=.*\d).{4,10}$/;
    const userEmail = data.userEmail.toString();
    const userPassword = data.password.toString();
    const user = { email: userEmail, password: userPassword };

    if (emailRegexp.test(userEmail) && passwordRegexp.test(userPassword)) {
      try {
        const response = await fetch(`${DEV_URL}/login`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json;charset=utf-8',
          },
          body: JSON.stringify(user),
        });
        if (response.ok) {
          const json = await response.json();
          authorizationService.setUserInLocalStorage(json)
          onClose();
        } else {
          const errorData = await response.json();
          setSnackMessage(errorData.message);
          setSnackOpen(true);
        }
      } catch (error) {
        setSnackMessage(`${error}`);
        setSnackOpen(true);
      }
    } else {
      setSnackMessage(
        'Password: Latin characters only. At least one digit. At least 4 characters. No more than 10.'
      );
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
        onClose={onClose}
        PaperProps={{
          component: 'form',
          onSubmit: handleConfirm,
          sx: {
            width: '366px',
            height: '504px',
            padding: '20px',
            borderRadius: 0,
          },
        }}
      >
        <DialogTitle className={'create-acc-form-title'}>
          <div className={'close-create-acc-form-container'}>
            <IconButton
              className={'close-create-acc-form-btn'}
              onClick={onClose}
            >
              <CloseOutlinedIcon />
            </IconButton>
          </div>
        </DialogTitle>
        <DialogContent className={'create-acc-form-dialog-content'}>
          <div className={'create-acc-title-container'}>
            <span>Authorization</span>
          </div>
          <TextField
            name="userEmail"
            label={'Email'}
            variant={'standard'}
            required={true}
            type={'email'}
            className={'create-acc-form-text-field'}
          />
          <TextField
            name="password"
            label={'Password'}
            variant={'standard'}
            type={'password'}
            required={true}
            className={'create-acc-form-text-field'}
          />
        </DialogContent>
        <DialogActions sx={{ justifyContent: 'center' }}>
          <Button
            type={'submit'}
            variant="contained"
            className={'confirm-send-btn'}
          >
            Send
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
