import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { IconButton, Menu, MenuItem, useMediaQuery } from '@mui/material';
import LoginIcon from '@mui/icons-material/Login';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import logo from '../../assets/icons/logo.svg';
import './header.css';
import AuthorizationModal from '../../components/modals/AuthorizationModal/AuthorizationModal';
import { useAuth } from '../../context/useAuth';
import LanguageIcon from '@mui/icons-material/Language';
import { useTranslation } from 'react-i18next';

type Role = 'admin' | 'user';
type MenuItemType =
  | { title: string; path: string; isExit?: false }
  | { title: string; isExit: true };

const NAV_LINKS = [
  { id: 'catalog', title: 'nav.catalog', path: '/catalog' },
  { id: 'about', title: 'nav.about', path: '/about' },
];

const MENU_ITEMS: Record<Role, MenuItemType[]> = {
  admin: [
    { title: 'menu.profile', path: '/profile' },
    { title: 'menu.users', path: '/admin/users' },
    { title: 'menu.statistics', path: '/admin/statistics' },
    { title: 'menu.services', path: '/admin/services' },
    { title: 'menu.orders', path: '/admin/orders' },
    { title: 'menu.logout', isExit: true },
  ],
  user: [
    { title: 'menu.profile', path: '/profile' },
    { title: 'menu.statistics', path: '/statistics' },
    { title: 'menu.orders', path: '/orders' },
    { title: 'menu.logout', isExit: true },
  ],
};

const Header = () => {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const isMobile = useMediaQuery('(max-width:405px)');

  const {
    isAuth,
    isAdmin,
    userEmail,
    logout,
    isLoginModalOpen,
    setLoginModalOpen,
  } = useAuth();

  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const isMenuOpen = Boolean(anchorEl);

  const toggleLanguage = () => {
    const nextLang = i18n.language === 'ru' ? 'en' : 'ru';
    i18n.changeLanguage(nextLang);
  };

  const handleOpenMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  const handleMenuItemClick = (item: MenuItemType) => {
    handleCloseMenu();

    if (item.isExit) {
      logout();
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

  const currentMenuItems = MENU_ITEMS[role].filter(item => {
    if (isMobile && !item.isExit && item.path.includes('statistics')) {
      return false;
    }
    return true;
  });

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
                {t(link.title)}
              </Link>
            ))}
          </nav>

          <div className="actions">
            {!isAuth ? (
              <IconButton
                aria-label="Login"
                onClick={() => setLoginModalOpen(true)}
                className="profileIconButton"
              >
                <LoginIcon />
              </IconButton>
            ) : (
              <>
                <div className="profile-wrapper" onClick={handleOpenMenu}>
                  <IconButton
                    className="profileIconButton"
                    sx={{ padding: 0, minWidth: 'auto' }}
                  >
                    <PersonOutlineIcon />
                  </IconButton>
                  {userEmail && (
                    <span className="profile-email">{userEmail}</span>
                  )}
                </div>

                <Menu
                  id="profile-menu"
                  anchorEl={anchorEl}
                  open={isMenuOpen}
                  onClose={handleCloseMenu}
                  PaperProps={{ className: 'profileMenu' }}
                >
                  {currentMenuItems.map((item, index) => (
                    <MenuItem
                      key={item.isExit ? 'logout' : `${item.path}-${index}`}
                      onClick={() => handleMenuItemClick(item)}
                      className={`profileMenuItem ${item.isExit ? 'profileMenuItemExit' : ''}`}
                    >
                      {t(item.title)}
                    </MenuItem>
                  ))}
                </Menu>
              </>
            )}

            <div className="lang-switcher" onClick={toggleLanguage}>
              <IconButton className="lang-icon-btn" color="inherit">
                <LanguageIcon className="lang-icon" />
              </IconButton>
              <span className="lang-text">{i18n.language}</span>
            </div>
          </div>
        </div>
      </header>
      <AuthorizationModal
        open={isLoginModalOpen}
        onClose={() => setLoginModalOpen(false)}
      />
    </>
  );
};

export default Header;
