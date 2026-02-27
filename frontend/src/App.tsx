import './App.css';
import Header from './components/header/Header';
import Footer from './components/footer/Footer';
import { Routes, Route } from 'react-router-dom';

import { HomePage } from './pages/home-page/HomePage';
import { ProfilePage } from './pages/profile/ProfilePage';
import { UsersPage } from './pages/admin/UsersPage';
import { AdminStatsPage } from './pages/admin/AdminStatsPage';
import { ServicesPage } from './pages/admin/ServicesPage';
import { AdminOrdersPage } from './pages/admin/AdminOrdersPage';
import { UserStatsPage } from './pages/user/UserStatsPage';
import { UserOrdersPage } from './pages/user/UserOrdersPage';

export function App() {
  return (
    <div className="app-wrapper">
      <Header />
      <main className="page-container">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/profile" element={<ProfilePage />} />

          <Route path="/admin/users" element={<UsersPage />} />
          <Route path="/admin/stats" element={<AdminStatsPage />} />
          <Route path="/admin/services" element={<ServicesPage />} />
          <Route path="/admin/orders" element={<AdminOrdersPage />} />

          <Route path="/stats" element={<UserStatsPage />} />
          <Route path="/orders" element={<UserOrdersPage />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}