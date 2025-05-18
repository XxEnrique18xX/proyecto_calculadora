import { useEffect, useState } from 'react';

const CostMatrix = ({ costs, setCosts, supplies, setSupplies, demands, setDemands }) => {
  const [balanced] = useState(true);

  useEffect(() => {
  const totalSupply = supplies.reduce((sum, val) => sum + Number(val), 0);
  const totalDemand = demands.reduce((sum, val) => sum + Number(val), 0);

  if (totalSupply > totalDemand) {
  } else if (totalDemand > totalSupply) {
  }
  }, [supplies, demands]);



  const handleCostChange = (i, j, value) => {
    const updatedCosts = costs.map((row, rowIndex) =>
      row.map((cell, colIndex) => (rowIndex === i && colIndex === j ? Number(value) : cell))
    );
    setCosts(updatedCosts);
  };

  const handleSupplyChange = (i, value) => {
    const updatedSupplies = supplies.map((supply, index) => (index === i ? Number(value) : supply));
    setSupplies(updatedSupplies);
  };

  const handleDemandChange = (j, value) => {
    const updatedDemands = demands.map((demand, index) => (index === j ? Number(value) : demand));
    setDemands(updatedDemands);
  };

  return (
    <div>
      <h3 className="text" style={{ color: '#1d80ab' }}>Matriz de Costos</h3>
      <table>
        <thead>
          <tr>
            <th></th>
            {demands.map((_, j) => (
              <th style= {{color : '#FFFFFF'}} key={j}>Destino {j + 1}</th>
            ))}
            <th style={{ color: '#f2f24c' }}>Oferta</th>
          </tr>
        </thead>
        <tbody>
          {costs.map((row, i) => (
            <tr key={i}>
              <th style= {{color : '#FFFFFF'}}>Origen {i + 1}</th>
              {row.map((cell, j) => (
                <td key={j}>
                  <input
                    type="number"
                    value={cell}
                    onChange={(e) => handleCostChange(i, j, e.target.value)}
                  />
                </td>
              ))}
              <td>
                <input
                  type="number"
                  value={supplies[i]}
                  onChange={(e) => handleSupplyChange(i, e.target.value)}
                />
              </td>
            </tr>
          ))}
          <tr>
            <th style= {{color : '#319ce5'}}>Demanda</th>
            {demands.map((demand, j) => (
              <td key={j}>
                <input
                  type="number"
                  value={demand}
                  onChange={(e) => handleDemandChange(j, e.target.value)}
                />
              </td>
            ))}
            <td></td>
          </tr>
        </tbody>
      </table>
      {!balanced && <p>Se ha añadido una fila o columna ficticia para equilibrar la oferta y la demanda.</p>}
    </div>
  );
};

export default CostMatrix;