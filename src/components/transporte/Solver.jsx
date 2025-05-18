import React from 'react';

const Solver = ({ method, costs, supplies, demands, setSolution, setTotalCost }) => {
  const solve = () => {
    let adjustedCosts = [...costs.map(row => [...row])];
    let adjustedSupplies = [...supplies];
    let adjustedDemands = [...demands];

    const totalSupply = adjustedSupplies.reduce((a, b) => a + b, 0);
    const totalDemand = adjustedDemands.reduce((a, b) => a + b, 0);

    // Balancear la matriz
    if (totalSupply > totalDemand) {
      const diff = totalSupply - totalDemand;
      adjustedDemands.push(diff);
      adjustedCosts = adjustedCosts.map(row => [...row, 0]);
    } else if (totalDemand > totalSupply) {
      const diff = totalDemand - totalSupply;
      adjustedSupplies.push(diff);
      const newRow = Array(adjustedDemands.length).fill(0);
      adjustedCosts.push(newRow);
    }

    const m = adjustedSupplies.length;
    const n = adjustedDemands.length;
    let allocation = Array.from({ length: m }, () => Array(n).fill(0));
    let total = 0;

    if (method === 'northwest') {
      let i = 0, j = 0;
      while (i < m && j < n) {
        const qty = Math.min(adjustedSupplies[i], adjustedDemands[j]);
        allocation[i][j] = qty;
        total += qty * adjustedCosts[i][j];
        adjustedSupplies[i] -= qty;
        adjustedDemands[j] -= qty;
        if (adjustedSupplies[i] === 0) i++;
        else if (adjustedDemands[j] === 0) j++;
      }
    }

    if (method === 'mincost') {
      let supplyLeft = [...adjustedSupplies];
      let demandLeft = [...adjustedDemands];
      let used = Array.from({ length: m }, () => Array(n).fill(false));

      while (true) {
        let min = Infinity;
        let minCell = [-1, -1];
        for (let i = 0; i < m; i++) {
          for (let j = 0; j < n; j++) {
            if (!used[i][j] && adjustedCosts[i][j] < min) {
              min = adjustedCosts[i][j];
              minCell = [i, j];
            }
          }
        }

        const [i, j] = minCell;
        if (i === -1 || j === -1) break;

        const qty = Math.min(supplyLeft[i], demandLeft[j]);
        allocation[i][j] = qty;
        total += qty * adjustedCosts[i][j];
        supplyLeft[i] -= qty;
        demandLeft[j] -= qty;
        used[i][j] = true;

        if (supplyLeft[i] === 0) for (let k = 0; k < n; k++) used[i][k] = true;
        if (demandLeft[j] === 0) for (let k = 0; k < m; k++) used[k][j] = true;
      }
    }

    setSolution(allocation);
    setTotalCost(total);
  };

  return (
    <div>
      <button onClick={solve} className="btn w-30" style={{ color: "#7fc0f5", backgroundColor: "#17191a", border:'none', padding: '10px' }} >Resolver</button>
    </div>
  );
};

export default Solver;