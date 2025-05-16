import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import { Routes, Route } from 'react-router-dom';
import Menu from './menu.jsx';
import Maximizacion from './components/metodoGrafico/maximizacion.jsx'; 
import Transporte from './components/transporte/transporte.jsx';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Menu />} />
      <Route path="/grafico-maximizacion" element={<Maximizacion />} />
      <Route path="/Transporte" element={<Transporte />} />
    </Routes>
  );
}

export default App;
