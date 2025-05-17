import './App.css';
import { Routes, Route, useNavigate } from 'react-router-dom';
import Asignacion from './asignacion';

function App(){
  const navigate = useNavigate();
  return (
    <div className="App">
      <h1>Calculadora de Programación Lineal</h1>

      <div>
        <button onClick={() => alert("Ir al Método Simplex")}>Método Simplex</button>
        <button onClick={() => alert("Ir al Método Gráfico")}>Método Gráfico</button>
        <button onClick={() => alert("Ir al Método de Transporte")}>Método de Transporte</button>
        <button onClick={() => navigate("/asignacion")}>Método de asignación</button>
        <button onClick={() => alert("Ir al Método CPM")}>Método CPM</button>
      </div>

      <Routes>
        <Route path="/asignacion" element={<Asignacion/>}/>
      </Routes>
    </div>
  );
}

export default App;