import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  IconButton,
  TextField,
  Snackbar,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  type SelectChangeEvent,
} from '@mui/material';
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';
import React, { useState, useEffect } from 'react';
import { userService } from '../../../services/user.service.ts';
import type { UpdateUserDto } from '../../../types';

type UserRole = 'user' | 'admin';

interface EditUserModalProps {
  open: boolean;
  onClose: () => void;
  user: {
    id: number;
    firstName: string;
    lastName: string;
    patronymic: string;
    email: string;
    role: string;
  };
  onUpdateSuccess?: () => void;
}

export default function EditUserModal({
  open,
  onClose,
  user,
  onUpdateSuccess,
}: EditUserModalProps) {
  const [snackOpen, setSnackOpen] = useState(false);
  const [snackMessage, setSnackMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [values, setValues] = useState({
    firstName: '',
    lastName: '',
    patronymic: '',
    email: '',
    role: '',
  });

  useEffect(() => {
    if (open && user) {
      setValues({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        patronymic: user.patronymic || '',
        email: user.email || '',
        role: user.role || '',
      });
    }
  }, [user, open]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleRoleChange = (e: SelectChangeEvent) => {
    setValues((prev) => ({ ...prev, role: e.target.value }));
  };

  const handleConfirm = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !values.firstName ||
      !values.lastName ||
      !values.email ||
      !values.role
    ) {
      setSnackMessage('Please fill all required fields');
      setSnackOpen(true);
      return;
    }

    setIsSubmitting(true);

    const updateData: UpdateUserDto = {
      firstName: values.firstName,
      lastName: values.lastName,
      patronymic: values.patronymic,
      email: values.email,
      role: values.role as UserRole,
    };

    try {
      await userService.updateProfile(user.id, updateData);
      setSnackMessage('Data updated successfully');
      setSnackOpen(true);
      setTimeout(() => {
        onClose();
        if (onUpdateSuccess) onUpdateSuccess();
      }, 600);
    } catch (error) {
      if (error instanceof Error) {
        setSnackMessage(error.message);
      } else {
        setSnackMessage(String(error));
      }
      setSnackOpen(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Snackbar
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        open={snackOpen}
        autoHideDuration={4000}
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
          sx: { width: '466px', padding: '30px 40px', borderRadius: '8px' },
        }}
      >
        <DialogTitle className="edit-card-modal-title" sx={{ p: 0, mb: 3 }}>
          <div className="order-form-logo">
            <img src="/page-logo.svg" alt="logo" />
            <span className="team-name-order">
              Legendary <br /> Frontend
            </span>
          </div>
          <IconButton
            onClick={onClose}
            sx={{ position: 'absolute', right: 16, top: 16 }}
          >
            <CloseOutlinedIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent
          className="edit-card-modal-dialog-content"
          sx={{ p: 0, display: 'flex', flexDirection: 'column', gap: 2 }}
        >
          <TextField
            name="firstName"
            label="Name"
            variant="standard"
            fullWidth
            value={values.firstName}
            onChange={handleChange}
          />
          <TextField
            name="lastName"
            label="Last name"
            variant="standard"
            fullWidth
            value={values.lastName}
            onChange={handleChange}
          />
          <TextField
            name="patronymic"
            label="Patronymic"
            variant="standard"
            fullWidth
            value={values.patronymic}
            onChange={handleChange}
          />
          <TextField
            name="email"
            label="E-mail"
            variant="standard"
            fullWidth
            value={values.email}
            onChange={handleChange}
          />
          <FormControl variant="standard" fullWidth>
            <InputLabel id="role-select-label">Role</InputLabel>
            <Select
              labelId="role-select-label"
              name="role"
              value={values.role}
              onChange={handleRoleChange}
              label="Role"
            >
              <MenuItem value="user">User</MenuItem>
              <MenuItem value="admin">Admin</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions sx={{ justifyContent: 'center', mt: 4, p: 0 }}>
          <Button
            type="submit"
            variant="contained"
            disabled={isSubmitting}
            className="confirm-order-btn"
            sx={{ width: '100%', py: 1.5 }}
          >
            {isSubmitting ? 'Saving...' : 'SAVE CHANGES'}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
