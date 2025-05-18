import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Menu from "./menu.jsx";
import Maximizacion from "./components/metodoGrafico/maximizacion.jsx"; // tu otro componente
import SimplexSolver from "./components/simplex/SimplexSolver.js"; // tu otro componente
//import Simplex

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Menu />} />
        <Route path="/grafico-maximizacion" element={<Maximizacion />} />
        <Route path="/simplex" element={<SimplexSolver />} />
        {/* Agrega más rutas según sea necesario */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;