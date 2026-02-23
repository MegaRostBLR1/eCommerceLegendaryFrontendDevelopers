import './App.css';

import Header from './pages/components/header/Header.tsx';
import { Routes, Route } from 'react-router-dom';
import Footer from './pages/components/footer/Footer.tsx';
import Header from './components/Header/header.tsx';
import { Routes, Route } from 'react-router-dom';
import Footer from './components/Footer/Footer.tsx';
import { HomePage } from './pages/home-page/home-page.tsx';

export function App() {
  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<HomePage />} />
      </Routes>
      <Footer />
    </>
  );
}
