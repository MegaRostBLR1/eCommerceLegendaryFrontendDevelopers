import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { IconButton, Menu, MenuItem } from '@mui/material';
import LoginIcon from '@mui/icons-material/Login';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import logo from '../../../assets/icons/logo.svg';
import './header.css';
import AuthorizationModal from '../../modals/AuthorizationModal/AuthorizationModal.tsx';
import {authorizationService} from "../../../services/authorization-service.ts";

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

  const isAuth = authorizationService.isAuthUser();
  const isAdmin = authorizationService.userIsAdmin();

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
      authorizationService.logoutUser();
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
                <IconButton
                  aria-label="Profile"
                  aria-controls={isMenuOpen ? 'profile-menu' : undefined}
                  aria-haspopup="true"
                  aria-expanded={isMenuOpen ? 'true' : undefined}
                  onClick={handleOpenMenu}
                  className="profileIconButton"
                >
                  <PersonOutlineIcon />
                </IconButton>

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
