import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./index.jsx";
import Maximizacion from "./components/maximizacion.jsx"; // tu otro componente

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/grafico-maximizacion" element={<Maximizacion />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;