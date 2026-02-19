import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import MainPage from './components/MainPage/MainPage.tsx';
import Footer from './components/Footer/Footer.tsx';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainPage />} />
      </Routes>
      <Footer />
    </BrowserRouter>
  );
}

export default App;
