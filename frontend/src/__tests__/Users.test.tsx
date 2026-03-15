import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, it, vi } from 'vitest';
import { UsersPage } from '../pages/admin/users-page/UsersPage.tsx';

vi.mock('../../../services/authorization-service.ts', () => ({
  authorizationService: {
    isAuthUser: () => true,
    userIsAdmin: () => true,
  },
}));

describe('UsersPage Component', () => {

  it('should render the main users page container', () => {
    render(
      <MemoryRouter>
        <UsersPage />
      </MemoryRouter>
    );
    const container = screen.getByTestId('users-page-container');
    expect(container).toBeInTheDocument();
  });

  it('should render the search input', () => {
    render(
      <MemoryRouter>
        <UsersPage />
      </MemoryRouter>
    );
    const searchInput = screen.getByLabelText(/Enter user e-mail/i);
    expect(searchInput).toBeInTheDocument();
  });

  it('should render the search button', () => {
    render(
      <MemoryRouter>
        <UsersPage />
      </MemoryRouter>
    );
    const searchButton = screen.getByRole('button', { name: /search/i });
    expect(searchButton).toBeInTheDocument();
  });

  it('should render the users container', () => {
    render(
      <MemoryRouter>
        <UsersPage />
      </MemoryRouter>
    );
    const usersContainer = screen.getByTestId('users-container');
    expect(usersContainer).toBeInTheDocument();
  });

  it('should render the pagination container', () => {
    render(
      <MemoryRouter>
        <UsersPage />
      </MemoryRouter>
    );
    const pagination = screen.getByTestId('navigation-menu');
    expect(pagination).toBeInTheDocument();
  });
});