import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { IconButton, Menu, MenuItem } from '@mui/material';
import LoginIcon from '@mui/icons-material/Login';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import logo from '../../assets/logo.svg';
import styles from './header.module.css';
import AuthorizationModal from '../AuthorizationModal/authorization-modal.tsx';

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
    { title: 'Statistics', path: '/admin/stats' },
    { title: 'Services', path: '/admin/services' },
    { title: 'Orders', path: '/admin/orders' },
    { title: 'Logout', isExit: true },
  ],
  user: [
    { title: 'Profile', path: '/profile' },
    { title: 'Statistics', path: '/stats' },
    { title: 'Orders', path: '/orders' },
    { title: 'Logout', isExit: true },
  ],
};

const Header = () => {
  const navigate = useNavigate();

  // Пока сочтояния локальные
  const isAuth = false;
  const isAdmin = true;

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const isMenuOpen = Boolean(anchorEl);

  const handleOpenMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  const handleMenuItemClick = (item: MenuItemType) => {
    handleCloseMenu();

    if (item.isExit) {
      console.log('Logout logic here');
      return;
    }

    navigate(item.path);
  };

  const role: Role = isAdmin ? 'admin' : 'user';
  const currentMenuItems = MENU_ITEMS[role];

  return (
    <>
      <header className={styles.header}>
        <div className={styles.container}>
          <Link to="/" className={styles.logoSection}>
            <img src={logo} alt="Logo" className={styles.logo} />
            <span className={styles.brandName}>Legendary Frontend</span>
          </Link>

          <nav className={styles.nav}>
            {NAV_LINKS.map((link) => (
              <Link key={link.id} to={link.path} className={styles.navLink}>
                {link.title}
              </Link>
            ))}
          </nav>

          <div className={styles.actions}>
            {!isAuth ? (
              <IconButton
                aria-label="Login"
                onClick={() => setIsModalOpen(true)}
                className={styles.profileIconButton}
              >
                <LoginIcon />
              </IconButton>
            ) : (
              <>
                <IconButton
                  aria-label="Profile"
                  aria-controls={isMenuOpen ? 'profile-menu' : undefined}
                  aria-haspopup="true"
                  aria-expanded={isMenuOpen ? 'true' : undefined}
                  onClick={handleOpenMenu}
                  className={styles.profileIconButton}
                >
                  <PersonOutlineIcon />
                </IconButton>

                <Menu
                  id="profile-menu"
                  anchorEl={anchorEl}
                  open={isMenuOpen}
                  onClose={handleCloseMenu}
                  PaperProps={{ className: styles.profileMenu }}
                >
                  {currentMenuItems.map((item) => (
                    <MenuItem
                      key={item.isExit ? 'logout' : item.path}
                      onClick={() => handleMenuItemClick(item)}
                      className={`${styles.profileMenuItem} ${item.isExit ? styles.profileMenuItemExit : ''}`}
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
