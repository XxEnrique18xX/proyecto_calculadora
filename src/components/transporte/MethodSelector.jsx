import React from 'react';

const MethodSelector = ({ method, setMethod }) => {
  return (
    <div>
      <label className="form-label" style={{ color: '#e0e0e0' }}>Selecciona el método de transporte: </label>
      <select
        id="method-select"
        value={method}
        onChange={(e) => setMethod(e.target.value)}
      >
        <option value="northwest">Esquina Nor-Oeste</option>
        <option value="mincost">Costo Mínimo</option>
      </select>
    </div>
  );
};

export default MethodSelector;
