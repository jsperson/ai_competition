import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Game from './pages/Game';
import WichitaMoonbase from './pages/WichitaMoonbase';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/game" element={<Game />} />
        <Route path="/wichita-moonbase" element={<WichitaMoonbase />} />
      </Routes>
    </BrowserRouter>
  );
}
