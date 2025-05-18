import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Menu from "./menu.jsx";
import Maximizacion from "./components/metodoGrafico/maximizacion.jsx"; 
import Minimizacion from "./components/metodoGrafico/minimizacion.jsx";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Menu />} />
        <Route path="/grafico-maximizacion" element={<Maximizacion />} />
        <Route path="/grafico-minimizacion" element={<Minimizacion />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;