import React, { useState } from 'react';

const MatrixGenerator = ({ setRows, setCols, generateMatrix }) => {
  const [inputRows, setInputRows] = useState(0);
  const [inputCols, setInputCols] = useState(0);

  const handleGenerate = () => {
    const rows = parseInt(inputRows, 10);
    const cols = parseInt(inputCols, 10);

    if (rows > 0 && cols > 0) {
      setRows(rows);
      setCols(cols);
      generateMatrix(rows, cols);
    } else {
      alert('Por favor, ingresa valores válidos para filas y columnas.');
    }
  };

  return (
    <div>
      <label>
        Número de orígenes (filas):
        <input
          type="number"
          value={inputRows}
          onChange={(e) => setInputRows(e.target.value)}
          min="1"
        />
      </label>
      <br />
      <label>
        Número de destinos (columnas):
        <input
          type="number"
          value={inputCols}
          onChange={(e) => setInputCols(e.target.value)}
          min="1"
        />
      </label>
      <br />
      <button onClick={handleGenerate}>Generar Matriz</button>
    </div>
  );
};

export default MatrixGenerator;