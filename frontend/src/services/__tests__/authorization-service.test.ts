import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { authorizationService } from '../authorization-service';

const mockJwtDecode = vi.hoisted(() => vi.fn());
vi.mock('jwt-decode', () => ({
  jwtDecode: (...args: unknown[]) => mockJwtDecode(...args),
}));

describe('AuthorizationService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  it('should decode JWT token and return user data', () => {
    const mockDecoded = {
      id: 42,
      exp: 9999999999,
      role: 'admin',
    };
    mockJwtDecode.mockReturnValue(mockDecoded);

    const result = authorizationService.decodeToken('fake-token');

    expect(result).toEqual(mockDecoded);
    expect(mockJwtDecode).toHaveBeenCalledWith('fake-token');
  });

  it('should store token in localStorage', () => {
    const tokenData = {
      status: 'success',
      token: 'new-token-xyz',
      exp: 1234567890,
    };

    authorizationService.setUserInLocalStorage(tokenData);

    expect(localStorage.getItem('token')).toBe('new-token-xyz');
  });

  it('should return true for valid non-expired token', () => {
    const futureExp = Math.floor(Date.now() / 1000) + 3600;
    localStorage.setItem('token', 'valid-token');
    mockJwtDecode.mockReturnValue({
      id: 1,
      exp: futureExp,
      role: 'user',
    });

    const result = authorizationService.isAuthUser();

    expect(result).toBe(true);
  });

  it('should return false for expired token', () => {
    const pastExp = Math.floor(Date.now() / 1000) - 3600;
    localStorage.setItem('token', 'expired-token');
    mockJwtDecode.mockReturnValue({
      id: 1,
      exp: pastExp,
      role: 'user',
    });

    const result = authorizationService.isAuthUser();

    expect(result).toBe(false);
  });

  it('should correctly identify admin user', () => {
    localStorage.setItem('token', 'admin-token');
    mockJwtDecode.mockReturnValue({
      id: 100,
      exp: Math.floor(Date.now() / 1000) + 3600,
      role: 'admin',
    });

    const result = authorizationService.userIsAdmin();

    expect(result).toBe(true);
  });

  it('should return false for non-admin user', () => {
    localStorage.setItem('token', 'user-token');
    mockJwtDecode.mockReturnValue({
      id: 200,
      exp: Math.floor(Date.now() / 1000) + 3600,
      role: 'user',
    });

    const result = authorizationService.userIsAdmin();

    expect(result).toBe(false);
  });

  it('should return user ID from token', () => {
    localStorage.setItem('token', 'test-token');
    mockJwtDecode.mockReturnValue({
      id: 555,
      exp: Math.floor(Date.now() / 1000) + 3600,
      role: 'user',
    });

    const userId = authorizationService.getUserId();

    expect(userId).toBe(555);
  });

  it('should return null when no token exists', () => {
    const userId = authorizationService.getUserId();

    expect(userId).toBeNull();
  });

  it('should logout user by removing token', () => {
    localStorage.setItem('token', 'to-be-removed');

    authorizationService.logoutUser();

    expect(localStorage.getItem('token')).toBeNull();
  });

  it('should handle invalid token gracefully', () => {
    localStorage.setItem('token', 'invalid-token');
    mockJwtDecode.mockImplementation(() => {
      throw new Error('Invalid token');
    });

    const result = authorizationService.isAuthUser();

    expect(result).toBe(false);
  });
});