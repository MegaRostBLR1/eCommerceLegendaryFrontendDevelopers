import './create-accout-modal.css';
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

export default function OpenLoginModal() {
  {
    /* если кто-то хечет просто проверить модалку useState(true) и модалка покажется при загрузке страницы*/
  }
  const [open, setOpen] = useState(false);
  {
    /* тут открывается модалка const handleClickOpen = () => setOpen(true);*/
  }
  const handleClose = () => setOpen(false);
  const handleConfirm = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());
    console.log(data);
    {
      /*временно ставлю console log чтобы по коду не горела ошибка*/
    }
    handleClose();
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
              onClick={handleClose}
            >
              <CloseOutlinedIcon />
            </IconButton>
          </div>
        </DialogTitle>
        <DialogContent className={'create-acc-form-dialog-content'}>
          <div className={'create-acc-title-container'}>
            <span>Create Account</span>
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
