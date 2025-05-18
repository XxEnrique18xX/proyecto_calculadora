import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import MethodSelector from './MethodSelector';
import CostMatrix from './CostMatrix.jsx';
import Solver from './Solver';
import ResultDisplay from './ResultDisplay';
import 'bootstrap/dist/css/bootstrap.min.css';

const App = () => {
  const [method, setMethod] = useState('northwest');
  const [rows, setRows] = useState(0);
  const [cols, setCols] = useState(0);
  const [costs, setCosts] = useState([]);
  const [supplies, setSupplies] = useState([]);
  const [demands, setDemands] = useState([]);
  const [solution, setSolution] = useState([]);
  const [totalCost, setTotalCost] = useState(0);

  const generateMatrix = (rows, cols) => {
    const initialCosts = Array.from({ length: rows }, () =>
      Array.from({ length: cols }, () => 0)
    );
    setCosts(initialCosts);
    setSupplies(Array.from({ length: rows }, () => 0));
    setDemands(Array.from({ length: cols }, () => 0));
    setSolution([]);
    setTotalCost(0);
  };

  return (
    <div style={{ background: 'linear-gradient(to right, #1f1f1f, #2c2f33)', minHeight: '100vh', padding: '40px 0', color: '#e0e0e0' }}>
      <div className="container">
        <div className="card shadow-lg border-0" style={{ backgroundColor: '#2e3235', padding: '30px', borderRadius: '15px' }}>
          <h2 className="text-center mb-4" style={{ color: '#00bcd4' }}>Calculadora de Métodos de Transporte</h2>
          <Routes>
            <Route
              path="/"
              element={
                <div>
                  <div className="mb-4">
                    <MethodSelector method={method} setMethod={setMethod} />
                  </div>

                  <div className="row mb-4">
                    <div className="col-md-4">
                      <label className="form-label" style={{ color: '#e0e0e0' }}>Número de orígenes (filas):</label>
                      <input
                        type="number"
                        className="form-control"
                        style={{ backgroundColor: '#1f1f1f', color: '#ffffff', borderColor: '#555' }}
                        value={rows}
                        onChange={(e) => setRows(parseInt(e.target.value) || 0)}
                      />
                    </div>
                    <div className="col-md-4">
                      <label className="form-label" style={{ color: '#e0e0e0' }}>Número de destinos (columnas):</label>
                      <input
                        type="number"
                        className="form-control"
                        style={{ backgroundColor: '#1f1f1f', color: '#ffffff', borderColor: '#555' }}
                        value={cols}
                        onChange={(e) => setCols(parseInt(e.target.value) || 0)}
                      />
                    </div>
                    <div className="col-md-4 d-flex align-items-end">
                      <button
                        className="btn w-100"
                        style={{ backgroundColor: '#00bcd4', color: '#fff', border: 'none' }}
                        onClick={() => generateMatrix(rows, cols)}
                      >
                        Generar Matriz
                      </button>
                    </div>
                  </div>

                  {costs.length > 0 && (
                    <div className="mb-5">
                      <div className="table-responsive">
                        <CostMatrix
                          rows={rows}
                          cols={cols}
                          costs={costs}
                          setCosts={setCosts}
                          supplies={supplies}
                          setSupplies={setSupplies}
                          demands={demands}
                          setDemands={setDemands}
                        />
                      </div>
                    </div>
                  )}

                  {costs.length > 0 && supplies.length > 0 && demands.length > 0 && (
                    <div className="mb-4 text-center">
                      <Solver
                        method={method}
                        costs={costs}
                        supplies={supplies}
                        demands={demands}
                        setSolution={setSolution}
                        setTotalCost={setTotalCost}
                      />
                    </div>
                  )}

                  {solution.length > 0 && (
                    <div className="mb-3">
                      <ResultDisplay
                        solution={solution}
                        totalCost={totalCost}
                        supplies={supplies}
                        demands={demands}
                      />
                    </div>
                  )}
                </div>
              }
            />
          </Routes>
        </div>
      </div>
    </div>
  );
};

export default App;