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
import type { Service, Category, UpdateServiceDto } from '../../../types';
import { validationRules } from '../../../../constants/validation-rules.ts';
import { userService } from '../../../services/user.service.ts';
import { SelectComponent } from '../../../pages/catalog-page/ui/select-component/select-component.tsx';

interface ServerError {
  response?: {
    data?: {
      error?: string;
    };
  };
}

interface EditCardModalProps {
  open: boolean;
  onClose: () => void;
  service?: Service;
  onUpdateSuccess?: () => void;
  isDraft?: boolean;
  onLocalUpdate?: (updatedData: Service) => void;
  onSendToServer?: (finalData: Service) => void;
  availableCategories?: Category[];
}

export default function EditCardModal({
  open,
  onClose,
  service,
  onUpdateSuccess,
  isDraft,
  onLocalUpdate,
  onSendToServer,
  availableCategories = [],
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
        duration: String(service.duration),
        description: service.description,
        categories: service.categories?.map((c) => c.id) || [],
      });
    }
  }, [service, open]);

  const handleConfirm = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!service) return;

    let errorMessage = '';
    if (!validationRules.serviceName.test(values.name))
      errorMessage = 'Incorrect service name (3-50 characters).';
    else if (!validationRules.discount.test(values.discount))
      errorMessage = 'Discount must be a number.';
    else if (!validationRules.numberRegExp.test(values.amount))
      errorMessage = 'Amount must be an integer.';
    else if (!validationRules.description.test(values.description))
      errorMessage = 'Description length must be up to 150 characters.';

    if (errorMessage) {
      setSnackMessage(errorMessage);
      setSnackOpen(true);
      return;
    }

    setIsSubmitting(true);
    try {
      if (isDraft && onLocalUpdate) {
        const fullCategories = values.categories.map((id) => {
          const found = availableCategories.find((c) => c.id === id);
          return found ? found : { id, name: `ID: ${id}`, description: '' };
        });

        onLocalUpdate({
          ...service,
          name: values.name,
          discount: parseFloat(values.discount),
          amount: parseInt(values.amount),
          workersCount: parseInt(values.workersCount),
          duration: Number(values.duration),
          description: values.description,
          categories: fullCategories as Category[],
        });
        setSnackMessage('Draft updated');
        setSnackOpen(true);
        return;
      }

      const updateData: UpdateServiceDto = {
        name: values.name,
        discount: parseFloat(values.discount),
        amount: parseInt(values.amount),
        workersCount: parseInt(values.workersCount),
        duration: Number(values.duration),
        description: values.description,
        categories: values.categories,
      };

      await userService.updateService(service.id, updateData);
      setSnackMessage('Service updated successfully!');
      setSnackOpen(true);
      setTimeout(() => {
        onClose();
        onUpdateSuccess?.();
      }, 600);
    } catch (err: unknown) {
      const error = err as ServerError;
      if (error.response?.data?.error?.includes('P2002')) {
        setSnackMessage('Name already exists');
      } else {
        setSnackMessage('Update failed');
      }
      setSnackOpen(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePublish = async () => {
    if (!onSendToServer || !service) return;
    setIsSubmitting(true);
    try {
      const dataToPublish: Service = {
        ...service,
        name: values.name,
        discount: parseFloat(values.discount) || 0,
        amount: parseInt(values.amount) || 0,
        workersCount: parseInt(values.workersCount) || 1,
        duration: Number(values.duration) || 0,
        description: values.description,
        categories: values.categories.map((id) => {
           const found = availableCategories.find(c => c.id === id);
           return found ? found : { id, name: '', description: '' };
        }) as Category[],
      };
      await onSendToServer(dataToPublish);
    } catch (err: unknown) {
      const error = err as ServerError;
      if (error.response?.data?.error?.includes('P2002')) {
        setSnackMessage('Name already exists. Change it!');
      } else {
        setSnackMessage('Failed to publish');
      }
      setSnackOpen(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Snackbar
        open={snackOpen}
        autoHideDuration={3000}
        onClose={() => setSnackOpen(false)}
        message={snackMessage}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      />
      <Dialog
        open={open}
        onClose={onClose}
        PaperProps={{
          component: 'form',
          onSubmit: handleConfirm,
          sx: { width: '466px', p: '30px 40px', borderRadius: '8px' },
        }}
      >
        <DialogTitle sx={{ p: 0, mb: 3 }}>
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
          sx={{ p: 0, display: 'flex', flexDirection: 'column', gap: 2 }}
        >
          <TextField
            name="name"
            label="Service name"
            variant="standard"
            fullWidth
            value={values.name}
            onChange={(e) => setValues({ ...values, name: e.target.value })}
          />
          <div style={{ display: 'flex', gap: '20px' }}>
            <TextField
              name="discount"
              label="Discount %"
              variant="standard"
              fullWidth
              value={values.discount}
              onChange={(e) =>
                setValues({ ...values, discount: e.target.value })
              }
            />
            <TextField
              name="amount"
              label="Price"
              variant="standard"
              fullWidth
              value={values.amount}
              onChange={(e) => setValues({ ...values, amount: e.target.value })}
            />
          </div>
          <SelectComponent
            selectedCategories={values.categories.map(String)}
            setSelectedCategories={(vals) =>
              setValues((p) => ({
                ...p,
                categories: vals.filter((v) => v !== 'all').map(Number),
              }))
            }
          />
          <TextField
            name="description"
            label="Description"
            variant="standard"
            fullWidth
            multiline
            rows={3}
            value={values.description}
            onChange={(e) =>
              setValues({ ...values, description: e.target.value })
            }
          />
        </DialogContent>

        <DialogActions sx={{ p: 0, mt: 4 }}>
          {isDraft ? (
            <div style={{ display: 'flex', gap: '12px', width: '100%' }}>
              <Button
                type="submit"
                variant="contained"
                className="confirm-order-btn"
                sx={{ flex: 1, py: 1.2, textTransform: 'none' }}
              >
                Update Draft
              </Button>
              <Button
                variant="outlined"
                disabled={isSubmitting}
                onClick={handlePublish}
                sx={{
                  flex: 1,
                  py: 1.2,
                  textTransform: 'none',
                  color: '#074733',
                  borderColor: '#074733',
                  '&:hover': {
                    borderColor: '#053628',
                    backgroundColor: 'rgba(7, 71, 51, 0.04)',
                  },
                }}
              >
                {isSubmitting ? 'Publishing...' : 'Publish Now'}
              </Button>
            </div>
          ) : (
            <Button
              type="submit"
              variant="contained"
              className="confirm-order-btn"
              fullWidth
              disabled={isSubmitting}
              sx={{ py: 1.5 }}
            >
              {isSubmitting ? 'Saving...' : 'Edit'}
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </>
  );
}