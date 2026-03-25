import './authorization-modal.css';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  IconButton,
  TextField,
  Snackbar,
  InputAdornment,
} from '@mui/material';
import React, { useState } from 'react';
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { authorizationService } from '../../../services/authorization-service';
import { apiService } from '../../../services/api-service.ts';
import { errorMessages } from '../../../../constants/errors';
import type { IUserToken } from '../../../types';
import { useAuth } from '../../../context/useAuth';

export default function AuthorizationModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const { updateAuth } = useAuth();
  const [snackOpen, setSnackOpen] = useState(false);
  const [snackMessage, setSnackMessage] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleConfirm = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const formValues = Object.fromEntries(formData.entries());

    const emailRegexp = /@/;
    const passwordRegexp = /^(?=.*[A-Z])(?=.*\d).{4,10}$/;

    const userEmail = formValues.userEmail.toString();
    const userPassword = formValues.password.toString();
    const userPayload = { email: userEmail, password: userPassword };

    if (emailRegexp.test(userEmail) && passwordRegexp.test(userPassword)) {
      try {
        const result = await apiService<IUserToken>('/login', {
          method: 'POST',
          body: JSON.stringify(userPayload),
        });

        authorizationService.setUserInLocalStorage(result);

        updateAuth();

        onClose();
      } catch (error) {
        const errorMessage =
          error instanceof Error
            ? error.message
            : errorMessages.errorFromServer;

        if (errorMessage.includes('401')) {
          setSnackMessage(errorMessages.wrongPasswordOrEmail);
        } else {
          setSnackMessage(errorMessage);
        }

        setSnackOpen(true);
      }
    } else {
      setSnackMessage(errorMessages.incorrectPassword);
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
        onClose={(_event, reason) => {
          if (reason === 'backdropClick' || reason === 'escapeKeyDown') {
            return;
          }
          onClose();
        }}
        disableEscapeKeyDown={true}
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
          <div className={'order-form-logo'}>
            <img src={'/page-logo.svg'} alt="logo" />
            <span className={'team-name-order'}>
              Legendary <br /> Frontend
            </span>
          </div>
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
            type={showPassword ? 'text' : 'password'}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={handleClickShowPassword}
                    onMouseDown={(e) => e.preventDefault()}
                    edge="end"
                  >
                    {showPassword ? <Visibility /> : <VisibilityOff />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
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
