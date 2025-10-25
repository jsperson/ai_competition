import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Game from './pages/Game';
import WichitaMoonbase from './pages/WichitaMoonbase';
import LunarLander from './pages/LunarLander';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/game" element={<Game />} />
        <Route path="/wichita-moonbase" element={<WichitaMoonbase />} />
        <Route path="/lunar-lander" element={<LunarLander />} />
      </Routes>
    </BrowserRouter>
  );
}
