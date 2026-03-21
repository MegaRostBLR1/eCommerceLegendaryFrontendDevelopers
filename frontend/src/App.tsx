import './App.css';
import Header from './components/header/Header';
import Footer from './components/footer/Footer';
import { Routes, Route } from 'react-router-dom';
import { CatalogPage } from './pages/catalog-page/catalog-page.tsx';
import { AboutPage } from './pages/about-page/AboutPage.tsx';

import { HomePage } from './pages/home-page/HomePage';
import { ProfilePage } from './pages/profile/ProfilePage';
import { UsersPage } from './pages/admin/users-page/UsersPage.tsx';
import { AdminStatsPage } from './pages/admin/AdminStatsPage';
import { ServicesPage } from './pages/admin/Services/ServicesPage.tsx';
import { AIGenerationPage } from './pages/admin/AIGenerationPage/AIGenerationPage';
import { OrdersPage } from './pages/OrdersPage/OrdersPage.tsx';
import { UserStatsPage } from './pages/user/UserStatsPage';
import { NotFoundPage } from './pages/NotFoundPage/NotFoundPage.tsx';

export function App() {
  return (
    <div className="app-wrapper">
      <Header />
      <main className="page-container">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/catalog" element={<CatalogPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/orders" element={<OrdersPage />} />
          <Route path="/admin/orders" element={<OrdersPage />} />
          <Route path="/orders/:userId" element={<OrdersPage />} />
          <Route path="/admin/users/:id" element={<ProfilePage />} />
          <Route path="/admin/users" element={<UsersPage />} />
          <Route path="/admin/stats" element={<AdminStatsPage />} />
          <Route path="/admin/services" element={<ServicesPage />} />
          <Route path="/admin/create-ai" element={<AIGenerationPage />} />

          <Route path="/stats" element={<UserStatsPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}
