import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Menu from "./menu.jsx";
import Maximizacion from "./components/metodoGrafico/maximizacion.jsx"; 
import Minimizacion from "./components/metodoGrafico/minimizacion.jsx";
import Asignacion from "./components/asignacion/asignacion.jsx";
import Cmp from "./components/cpm/cpm.jsx";
import Transporte from "./components/transporte/transporte.jsx";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Menu />} />
        <Route path="/metodo-asignacion" element={<Asignacion />} />
        <Route path="/metodo-cpm" element={<Cmp />} />
        <Route path="/metodo-transporte" element={<Transporte />} />
        <Route path="/grafico-maximizacion" element={<Maximizacion />} />
        <Route path="/grafico-minimizacion" element={<Minimizacion />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;