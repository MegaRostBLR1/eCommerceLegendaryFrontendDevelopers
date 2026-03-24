import { Outlet } from 'react-router-dom';
import Header from '../components/header/Header';
import Footer from '../components/footer/Footer';

export function MainLayout() {
  return (
    <>
      <Header />
      <main className="page-container">
        <Outlet />
      </main>
      <Footer />
    </>
  );
}
