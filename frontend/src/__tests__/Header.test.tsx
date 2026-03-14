import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, it, expect, vi } from 'vitest';
import Header from '../components/header/Header';

vi.mock('../../services/authorization-service.ts', () => ({
  authorizationService: {
    isAuthUser: () => false,
    userIsAdmin: () => false,
  },
}));

describe('Header Component', () => {
  // Тест 1
  it('should display a link to Catalog', () => {
    render(
      <MemoryRouter>
        <Header />
      </MemoryRouter>
    );
    expect(screen.getByText(/Catalog/i)).toBeInTheDocument();
  });

  // Тест 2
  it('should display a link to About', () => {
    render(
      <MemoryRouter>
        <Header />
      </MemoryRouter>
    );
    expect(screen.getByText(/About/i)).toBeInTheDocument();
  });

  // Тест 3
  it('should display the Legendary Frontend brand name', () => {
    render(
      <MemoryRouter>
        <Header />
      </MemoryRouter>
    );
    expect(screen.getByText(/Legendary/i)).toBeInTheDocument();
    expect(screen.getByText(/Frontend/i)).toBeInTheDocument();
  });

  // Тест 4
  it('should display the login icon (LoginIcon) if the user is not logged in', () => {
    render(
      <MemoryRouter>
        <Header />
      </MemoryRouter>
    );
    const loginButton = screen.getByLabelText(/Login/i);
    expect(loginButton).toBeInTheDocument();
  });

  // Тест 5
  it('The logo should be a link to the home page', () => {
    render(
      <MemoryRouter>
        <Header />
      </MemoryRouter>
    );
    const logoLink = screen.getByRole('link', {
      name: /legendary/i,
    });
    expect(logoLink).toHaveAttribute('href', '/');
  });
});
