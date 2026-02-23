import './App.css';

import Header from './components/Header/header.tsx';
import { Routes, Route } from 'react-router-dom';
import Footer from './components/Footer/Footer.tsx';
import { HomePage } from './pages/home-page/home-page.tsx';
import { CatalogPage } from './pages/catalog-page/catalog-page.tsx';

export function App() {
  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/catalog" element={<CatalogPage />} />
      </Routes>
      <Footer />
    </>
  );
}
