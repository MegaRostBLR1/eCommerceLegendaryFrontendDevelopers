import './App.css';
import Header from './components/Header/header.tsx';
import {Routes, Route } from 'react-router-dom';
import MainPage from './components/MainPage/MainPage.tsx';
import Footer from './components/Footer/Footer.tsx';

function App() {
  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<MainPage />} />
      </Routes>
      <Footer />
    </>
  );
}

export default App;