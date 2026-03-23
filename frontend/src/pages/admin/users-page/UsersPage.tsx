import './users-page.css';
import { TextField, IconButton, InputAdornment, Pagination, Snackbar } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { UserCard } from './UserCard/UserCard.tsx';
import { PAGINATION_STYLE } from '../../catalog-page/constants.tsx';
import { authorizationService } from '../../../services/authorization-service.ts';
import { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserNotFound } from './UserNorFound/UserNotFound.tsx';
import { apiService } from '../../../services/api-service.ts';

interface User {
  id: number;
  email: string;
  role: string;
  lastName: string | null;
  firstName: string | null;
  patronymic: string | null;
}

interface UsersResponse {
  data: User[];
  pages: number;
  total: number;
}

export const UsersPage = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [inputValue, setInputValue] = useState('');
  const [debouncedValue, setDebouncedValue] = useState('');

  const [snackOpen, setSnackOpen] = useState(false);
  const [snackMessage, setSnackMessage] = useState('');

  const loadUsers = useCallback(async () => {
    setIsLoading(true);
    try {
      const searchParam = debouncedValue ? `&search=${debouncedValue}` : '';
      const result = await apiService<UsersResponse>(`/users?page=${page}&count=8${searchParam}`);

      setUsers(result.data);
      setTotalPages(result.pages);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to load users';
      setSnackMessage(errorMessage);
      setSnackOpen(true);
    } finally {
      setIsLoading(false);
    }
  }, [page, debouncedValue]);

  useEffect(() => {
    if (!authorizationService.isAuthUser() || !authorizationService.userIsAdmin()) {
      navigate('/', { replace: true });
      return;
    }
    loadUsers();
  }, [navigate, loadUsers]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(inputValue);
      setPage(1);
    }, 500);

    return () => clearTimeout(timer);
  }, [inputValue]);

  return (
    <div className={'users-page-container'} data-testid="users-page-container">
      <Snackbar
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        open={snackOpen}
        autoHideDuration={5000}
        onClose={() => setSnackOpen(false)}
        message={snackMessage}
      />

      <div className={'search-input'}>
        <TextField
          value={inputValue}
          label="Enter user e-mail"
          variant="outlined"
          onChange={(e) => setInputValue(e.target.value)}
          sx={{
            width: '100%',
            height: '60px',
            '& .MuiInputBase-input': { color: '#063526' },
            '& .MuiInputLabel-root.Mui-focused': { color: '#063526' },
            '& .MuiOutlinedInput-root': {
              '& fieldset': { borderColor: '#063526' },
              '&:hover fieldset': { borderColor: '#063526' },
              '&.Mui-focused fieldset': { borderColor: '#063526' },
              borderRadius: '0',
            },
          }}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton edge="end" aria-label="Search" disabled={true}>
                  <SearchIcon sx={{ color: '#063526' }} />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
      </div>

      <div className={'users-container'} data-testid="users-container">
        {isLoading ? (
          <div className="loader-wrapper">Loading...</div>
        ) : users.length > 0 ? (
          users.map((user) => (
            <UserCard
              key={user.id}
              userId={user.id}
              userFirstName={user.firstName || ''}
              userLastName={user.lastName || ''}
              userPatronymic={user.patronymic || ''}
              userEmail={user.email}
              userRole={user.role}
              onRefresh={loadUsers}
            />
          ))
        ) : (
          <div style={{ gridColumn: '1 / -1', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <UserNotFound />
          </div>
        )}
      </div>

      <div className={'navigation-menu'} data-testid="navigation-menu">
        <Pagination
          count={totalPages}
          page={page}
          onChange={(_, value) => setPage(value)}
          variant="outlined"
          shape="rounded"
          sx={PAGINATION_STYLE}
        />
      </div>
    </div>
  );
};