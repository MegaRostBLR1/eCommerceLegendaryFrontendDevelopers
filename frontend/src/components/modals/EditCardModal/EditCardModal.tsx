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
import React, { useState, useEffect } from 'react';
import type { Service } from '../../../types';
import { validationRules } from '../../../../constants/validation-rules.ts';
import { userService } from '../../../services/user.service.ts';
import { SelectComponent } from '../../../pages/catalog-page/ui/select-component/select-component.tsx';

interface EditCardModalProps {
  open: boolean;
  onClose: () => void;
  service?: Service;
  onUpdateSuccess?: () => void;
}

export default function EditCardModal({
  open,
  onClose,
  service,
  onUpdateSuccess,
}: EditCardModalProps) {
  const [snackOpen, setSnackOpen] = useState(false);
  const [snackMessage, setSnackMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [values, setValues] = useState({
    name: '',
    discount: '0',
    amount: '0',
    workersCount: '0',
    duration: '',
    description: '',
    categories: [] as number[],
  });

  useEffect(() => {
    if (service && open) {
      setValues({
        name: service.name,
        discount: String(service.discount || 0),
        amount: String(service.amount),
        workersCount: String(service.workersCount),
        duration: service.duration,
        description: service.description,
        categories: service.categories?.map((c) => c.id) || [],
      });
    }
  }, [service, open]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleConfirm = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!service) return;

    let errorMessage = '';
    if (!validationRules.serviceName.test(values.name)) {
      errorMessage = 'Incorrect service name (3-50 characters).';
    } else if (!validationRules.discount.test(values.discount)) {
      errorMessage = 'The discount must be a number.';
    } else if (!validationRules.numberRegExp.test(values.amount)) {
      errorMessage = 'Amount must be an integer.';
    } else if (!validationRules.description.test(values.description)) {
      errorMessage = 'Description length must be up to 150 characters.';
    } else if (values.categories.length === 0) {
      errorMessage = 'Please select at least one category.';
    }

    if (errorMessage) {
      setSnackMessage(errorMessage);
      setSnackOpen(true);
      return;
    }

    setIsSubmitting(true);

    try {
      const updateData = {
        name: values.name,
        discount: parseFloat(values.discount),
        amount: parseInt(values.amount),
        workersCount: parseInt(values.workersCount),
        duration: values.duration,
        description: values.description,
        categories: values.categories,
      };

      await userService.updateService(service.id, updateData);

      setSnackMessage('Service updated successfully!');
      setSnackOpen(true);

      setTimeout(() => {
        onClose();
        if (onUpdateSuccess) onUpdateSuccess();
      }, 600);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Update failed';

      setSnackMessage(errorMessage);
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
        onClose={onClose}
        PaperProps={{
          component: 'form',
          onSubmit: handleConfirm,
          sx: {
            width: '466px',
            padding: '30px 40px',
            borderRadius: '8px',
          },
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
            name="name"
            label="Service name"
            variant="standard"
            fullWidth
            value={values.name}
            onChange={handleChange}
          />

          <div style={{ display: 'flex', gap: '20px' }}>
            <TextField
              name="discount"
              label="Discount (%)"
              variant="standard"
              fullWidth
              value={values.discount}
              onChange={handleChange}
            />
            <TextField
              name="amount"
              label="Price"
              variant="standard"
              fullWidth
              value={values.amount}
              onChange={handleChange}
            />
          </div>

          <SelectComponent
            selectedCategories={values.categories.map((id) => String(id))}
            setSelectedCategories={(newValues: string[]) => {
              const newIds = newValues
                .filter((val) => val !== 'all')
                .map((val) => Number(val));

              setValues((prev) => ({ ...prev, categories: newIds }));
            }}
          />

          <TextField
            name="description"
            label="Description"
            variant="standard"
            fullWidth
            multiline
            rows={3}
            value={values.description}
            onChange={handleChange}
          />
        </DialogContent>

        <DialogActions sx={{ justifyContent: 'center', mt: 4, p: 0 }}>
          <Button
            type="submit"
            variant="contained"
            disabled={isSubmitting}
            className="confirm-order-btn"
            sx={{ width: '100%', py: 1.5 }}
          >
            {isSubmitting ? 'Saving...' : 'Save'}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
