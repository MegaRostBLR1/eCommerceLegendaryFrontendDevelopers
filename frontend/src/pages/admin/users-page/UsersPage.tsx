import './users-page.css';
import { TextField } from '@mui/material';
import { IconButton } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import InputAdornment from '@mui/material/InputAdornment';
import { UserCard } from './UserCard/UserCard.tsx';
import { Pagination } from '@mui/material';
import { PAGINATION_STYLE } from '../../catalog-page/constants.tsx';
import { environment } from '../../../assets/environment/environment.ts';
import { authorizationService } from '../../../services/authorization-service.ts';
import { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserNotFound } from './UserNorFound/UserNotFound.tsx';

const BASE_URL = environment.baseUrl;

interface User {
  id: number;
  email: string;
  role: string;
  lastName: string | null;
  firstName: string | null;
  patronymic: string | null;
}

export const UsersPage = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [inputValue, setInputValue] = useState('');
  const [debouncedValue, setDebouncedValue] = useState('');

  const loadUsers = useCallback(async () => {
    setIsLoading(true);
    try {
      const searchParam = debouncedValue ? `&search=${debouncedValue}` : '';
      const response = await fetch(
        `${BASE_URL}/users?page=${page}&count=8${searchParam}`,
        {
          headers: {
            Authorization: `${localStorage.getItem('token')}`,
          },
        }
      );

      if (response.ok) {
        const result = await response.json();
        setUsers(result.data);
        setTotalPages(result.pages);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  }, [page, debouncedValue]);

  useEffect(() => {
    if (
      !authorizationService.isAuthUser() ||
      !authorizationService.userIsAdmin()
    ) {
      navigate('/', { replace: true });
      return;
    }

    const fetchData = async () => {
      await loadUsers();
    };

    fetchData();
  }, [navigate, loadUsers]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(inputValue);
      setPage((prev) => (prev !== 1 ? 1 : prev));
    }, 500);

    return () => clearTimeout(timer);
  }, [inputValue]);

  return (
    <div className={'users-page-container'} data-testid="users-page-container">
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
          <div
            style={{
              gridColumn: '1 / -1',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
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
