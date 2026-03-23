import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { IconButton, Menu, MenuItem } from '@mui/material';
import LoginIcon from '@mui/icons-material/Login';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import logo from '../../assets/icons/logo.svg';
import './header.css';
import AuthorizationModal from '../../components/modals/AuthorizationModal/AuthorizationModal';
import { authorizationService } from '../../services/authorization-service';

type Role = 'admin' | 'user';
type MenuItemType =
  | { title: string; path: string; isExit?: false }
  | { title: 'Logout'; isExit: true };

const NAV_LINKS = [
  { id: 'catalog', title: 'Catalog', path: '/catalog' },
  { id: 'about', title: 'About', path: '/about' },
];

const MENU_ITEMS: Record<Role, MenuItemType[]> = {
  admin: [
    { title: 'Profile', path: '/profile' },
    { title: 'Users', path: '/admin/users' },
    { title: 'Statistics', path: '/admin/statistics' },
    { title: 'Services', path: '/admin/services' },
    { title: 'Orders', path: '/admin/orders' },
    { title: 'Logout', isExit: true },
  ],
  user: [
    { title: 'Profile', path: '/profile' },
    { title: 'Statistics', path: '/statistics' },
    { title: 'Orders', path: '/orders' },
    { title: 'Logout', isExit: true },
  ],
};

const Header = () => {
  const navigate = useNavigate();
  const [isAuth, setIsAuth] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const isMenuOpen = Boolean(anchorEl);

  const checkAuth = () => {
    const auth = authorizationService.isAuthUser();
    const admin = authorizationService.userIsAdmin();
    const user = authorizationService.getUser();

    setIsAuth(auth);
    setIsAdmin(admin);
    setUserEmail(user?.email || null);
  };

  useEffect(() => {
    checkAuth();

    const handleAuthChange = () => {
      checkAuth();
    };

    window.addEventListener('auth-change', handleAuthChange);

    return () => {
      window.removeEventListener('auth-change', handleAuthChange);
    };
  }, []);

  const handleOpenMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  const handleMenuItemClick = (item: MenuItemType) => {
    handleCloseMenu();

    if (item.isExit) {
      authorizationService.logoutUser();
      const privateRoutes = ['/profile', '/admin', '/orders', '/statistics'];
      const isPrivatePage = privateRoutes.some((path) =>
        location.pathname.startsWith(path)
      );

      if (isPrivatePage) {
        navigate('/', { replace: true });
      }
      return;
    }

    navigate(item.path);
  };

  const role: Role = isAdmin ? 'admin' : 'user';
  const currentMenuItems = MENU_ITEMS[role];

  return (
    <>
      <header className="header">
        <div className="container">
          <Link to="/" className="logoSection">
            <img src={logo} alt="Logo" className="logo" />
            <span className="brandName">
              Legendary
              <br />
              Frontend
            </span>
          </Link>

          <nav className="nav">
            {NAV_LINKS.map((link) => (
              <Link key={link.id} to={link.path} className="navLink">
                {link.title}
              </Link>
            ))}
          </nav>

          <div className="actions">
            {!isAuth ? (
              <IconButton
                aria-label="Login"
                onClick={() => setIsModalOpen(true)}
                className="profileIconButton"
              >
                <LoginIcon />
              </IconButton>
            ) : (
              <>
                <div className="profile-wrapper" onClick={handleOpenMenu}>
                  <IconButton
                    aria-label="Profile"
                    aria-controls={isMenuOpen ? 'profile-menu' : undefined}
                    aria-haspopup="true"
                    aria-expanded={isMenuOpen ? 'true' : undefined}
                    className="profileIconButton"
                    sx={{ padding: 0, minWidth: 'auto' }}
                  >
                    <PersonOutlineIcon />
                  </IconButton>

                  {userEmail && (
                    <span className="profile-email">
                      {userEmail}
                    </span>
                  )}
                </div>

                <Menu
                  id="profile-menu"
                  anchorEl={anchorEl}
                  open={isMenuOpen}
                  onClose={handleCloseMenu}
                  PaperProps={{ className: 'profileMenu' }}
                >
                  {currentMenuItems.map((item) => (
                    <MenuItem
                      key={item.isExit ? 'logout' : item.path}
                      onClick={() => handleMenuItemClick(item)}
                      className={`profileMenuItem ${item.isExit ? 'profileMenuItemExit' : ''}`}
                    >
                      {item.title}
                    </MenuItem>
                  ))}
                </Menu>
              </>
            )}
          </div>
        </div>
      </header>
      <AuthorizationModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
};

export default Header;