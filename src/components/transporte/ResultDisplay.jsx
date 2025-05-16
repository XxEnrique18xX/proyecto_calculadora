import React from 'react';

const ResultDisplay = ({ solution, totalCost, supplies, demands }) => {
  if (!solution || solution.length === 0) return null;

  return (
    <div
      className="card mt-4"
      style={{
        backgroundColor: '#1f1f1f',
        color: '#e0e0e0',
        border: '1px solid #333',
        borderRadius: '10px',
        padding: '20px',
      }}
    >
      <h4 className="text-center mb-4" style={{ color: '#00bcd4' }}>Solución Óptima</h4>

      <div className="table-responsive">
        <table className="table table-bordered table-dark text-center align-middle">
          <thead style={{ backgroundColor: '#2c2f33' }}>
            <tr>
              <th style={{ backgroundColor: '#212529' }}>Origen / Destino</th>
              {demands.map((_, j) => (
                <th key={j} style={{ color: '#ffc107' }}>D{j + 1}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {solution.map((row, i) => (
              <tr key={i}>
                <th style={{ backgroundColor: '#212529', color: '#ffc107' }}>O{i + 1}</th>
                {row.map((val, j) => (
                  <td key={j}>{val}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="text-end mt-3">
        <span style={{ fontWeight: 'bold', color: '#00e676' }}>
          Costo total: ${totalCost}
        </span>
      </div>
    </div>
  );
};

export default ResultDisplay;
