import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Scatter } from "react-chartjs-2";
import { Chart, registerables } from "chart.js";
Chart.register(...registerables);

function Minimizacion() {
  const [restricciones, setRestricciones] = useState([
    { x1: "", x2: "", signo: "≥", valor: "" },
    { x1: "", x2: "", signo: "≥", valor: "" },
  ]);
  const [objetivo, setObjetivo] = useState({ x1: "", x2: "" });
  const [resultados, setResultados] = useState([]);
  const navigate = useNavigate();

  // Agregar y eliminar restricciones
  const agregarRestriccion = () => {
    setRestricciones([
      ...restricciones,
      { x1: "", x2: "", signo: "≥", valor: "" },
    ]);
  };

  const eliminarRestriccion = () => {
    if (restricciones.length > 2) {
      setRestricciones(restricciones.slice(0, -1));
    } else {
      alert("Debe haber al menos 2 restricciones.");
    }
  };

  // Manejar cambios en restricciones y objetivo
  const handleRestriccionChange = (idx, field, value) => {
    const nuevas = restricciones.map((r, i) =>
      i === idx ? { ...r, [field]: value } : r
    );
    setRestricciones(nuevas);
  };

  const handleObjetivoChange = (field, value) => {
    setObjetivo({ ...objetivo, [field]: value });
  };

  // Calcular intersecciones y resultados
  const calcularResultados = () => {
    // Convertir a números y filtrar restricciones válidas
    const restrics = restricciones
      .map(r => ({
        x1: parseFloat(r.x1),
        x2: parseFloat(r.x2),
        signo: r.signo,
        valor: parseFloat(r.valor),
      }))
      .filter(r => !isNaN(r.x1) && !isNaN(r.x2) && !isNaN(r.valor));

    // Encontrar intersecciones de pares de restricciones
    let puntos = [];
    for (let i = 0; i < restrics.length; i++) {
      for (let j = i + 1; j < restrics.length; j++) {
        const r1 = restrics[i];
        const r2 = restrics[j];
        // Resolver sistema de ecuaciones lineales
        const det = r1.x1 * r2.x2 - r2.x1 * r1.x2;
        if (det !== 0) {
          const x1 =
            (r1.valor * r2.x2 - r2.valor * r1.x2) / det;
          const x2 =
            (r1.x1 * r2.valor - r2.x1 * r1.valor) / det;
          if (isFinite(x1) && isFinite(x2)) {
            puntos.push({ x1, x2 });
          }
        }
      }
    }

    // Intersecciones con ejes (x1=0 o x2=0)
    restrics.forEach(r => {
      if (r.x2 !== 0) {
        const x2 = r.valor / r.x2;
        puntos.push({ x1: 0, x2 });
      }
      if (r.x1 !== 0) {
        const x1 = r.valor / r.x1;
        puntos.push({ x1, x2: 0 });
      }
    });

    // Filtrar puntos factibles (que cumplen todas las restricciones)
    const factibles = puntos.filter(p =>
      restrics.every(r => {
        const val = r.x1 * p.x1 + r.x2 * p.x2;
        if (r.signo === "≤") return val <= r.valor + 1e-6;
        if (r.signo === "≥") return val >= r.valor - 1e-6;
        return Math.abs(val - r.valor) < 1e-6;
      }) && p.x1 >= 0 && p.x2 >= 0
    );

    // Calcular valor de la función objetivo en cada punto
    const objX1 = parseFloat(objetivo.x1);
    const objX2 = parseFloat(objetivo.x2);
    const resultados = factibles.map(p => ({
      ...p,
      z: (objX1 || 0) * p.x1 + (objX2 || 0) * p.x2,
    }));

    setResultados(resultados);
  };

  // --- GRAFICAR RESTRICCIONES Y PUNTOS FACTIBLES ---
  // Prepara los datasets para Chart.js
  const datasets = [];

  // Líneas de restricciones
  restricciones.forEach((r, idx) => {
    const x1 = parseFloat(r.x1);
    const x2 = parseFloat(r.x2);
    const valor = parseFloat(r.valor);
    if (!isNaN(x1) && !isNaN(x2) && !isNaN(valor) && (x1 !== 0 || x2 !== 0)) {
      let puntosLinea = [];
      // Intersección con eje X2 (x1=0)
      if (x2 !== 0) {
        puntosLinea.push({ x: 0, y: valor / x2 });
      }
      // Intersección con eje X1 (x2=0)
      if (x1 !== 0) {
        puntosLinea.push({ x: valor / x1, y: 0 });
      }
      // Si ambos coeficientes son distintos de cero, graficar la línea
      if (puntosLinea.length === 2 && isFinite(puntosLinea[0].y) && isFinite(puntosLinea[1].x)) {
        datasets.push({
          label: `Restricción ${idx + 1}`,
          data: puntosLinea,
          showLine: true,
          borderColor: "#ff9800",
          backgroundColor: "rgba(255,152,0,0.2)",
          borderWidth: 2,
          pointRadius: 0,
          fill: false,
        });
      }
    }
  });

  // Puntos factibles
  if (resultados.length > 0) {
    datasets.push({
      label: "Puntos factibles",
      data: resultados.map((p) => ({ x: p.x1, y: p.x2 })),
      backgroundColor: "#8bc34a",
      borderColor: "#388e3c",
      pointRadius: 6,
      showLine: false,
      type: "scatter",
    });
  }

  const data = { datasets };

  const options = {
    scales: {
      x: {
        title: { display: true, text: "X₁" },
        min: 0,
        grid: { color: "#444" },
        ticks: { color: "#b3cdca" },
      },
      y: {
        title: { display: true, text: "X₂" },
        min: 0,
        grid: { color: "#444" },
        ticks: { color: "#b3cdca" },
      },
    },
    plugins: {
      legend: { labels: { color: "#b3cdca" } },
    },
  };

  // --- VISUAL CON PALETA Y BOOTSTRAP ---
  return (
    <div
      style={{
        backgroundColor: "#242728",
        minHeight: "100vh",
        padding: "40px 0",
        fontFamily: "Arial, sans-serif"
      }}
    >
    {/* Botón de retroceso */}
      <button
        className="btn btn-danger position-absolute"
        style={{ top: 30, left: 30, zIndex: 10 }}
        onClick={() => navigate("/")}
      >
        ← Volver
      </button>
      <div className="container mt-5 d-flex justify-content-center">
        <div
          className="card border"
          style={{
            width: "60rem",
            backgroundColor: "#2d3133",
            color: "#7fc0f5",
          }}
        >
          <div className="card-body text-center">
            <h1 className="card-title mb-4" style={{ color: "#7fc0f5" }}>
              Método gráfico con minimización
            </h1>
            <form className="mt-4">
              {/* Función Objetivo */}
              <div className="mb-4">
                <label
                  className="form-label fw-bold fs-5"
                  style={{ color: "#b3cdca" }}
                >
                  Función Objetivo:
                </label>
                <div className="d-flex align-items-center justify-content-center gap-2">
                  <input
                    type="text"
                    className="form-control text-center"
                    style={{
                      width: "90px",
                      backgroundColor: "#17191a",
                      color: "#7fc0f5",
                      border: "1px solid #1972a7",
                    }}
                    placeholder="Coef. X1"
                    value={objetivo.x1}
                    onChange={e => handleObjetivoChange("x1", e.target.value)}
                  />
                  <span className="mx-1" style={{ color: "#b3cdca" }}>
                    X<sub>1</sub> +
                  </span>
                  <input
                    type="text"
                    className="form-control text-center"
                    style={{
                      width: "90px",
                      backgroundColor: "#17191a",
                      color: "#7fc0f5",
                      border: "1px solid #1972a7",
                    }}
                    placeholder="Coef. X2"
                    value={objetivo.x2}
                    onChange={e => handleObjetivoChange("x2", e.target.value)}
                  />
                  <span className="mx-1" style={{ color: "#b3cdca" }}>
                    X<sub>2</sub>
                  </span>
                </div>
              </div>
              {/* Restricciones */}
              {restricciones.map((r, idx) => (
                <div className="mb-3" key={idx}>
                  <label
                    className="form-label fw-bold fs-5"
                    style={{ color: "#b3cdca" }}
                  >{`Restricción ${idx + 1}:`}</label>
                  <div className="d-flex align-items-center justify-content-center gap-2">
                    <input
                      type="text"
                      className="form-control text-center"
                      style={{
                        width: "60px",
                        backgroundColor: "#17191a",
                        color: "#7fc0f5",
                        border: "1px solid #1972a7",
                      }}
                      placeholder="X1"
                      value={r.x1}
                      onChange={e =>
                        handleRestriccionChange(idx, "x1", e.target.value)
                      }
                    />
                    <span className="mx-1" style={{ color: "#b3cdca" }}>
                      X<sub>1</sub> +
                    </span>
                    <input
                      type="text"
                      className="form-control text-center"
                      style={{
                        width: "60px",
                        backgroundColor: "#17191a",
                        color: "#7fc0f5",
                        border: "1px solid #1972a7",
                      }}
                      placeholder="X2"
                      value={r.x2}
                      onChange={e =>
                        handleRestriccionChange(idx, "x2", e.target.value)
                      }
                    />
                    <span className="mx-1" style={{ color: "#b3cdca" }}>
                      X<sub>2</sub>
                    </span>
                    <select
                      className="form-select text-center"
                      style={{
                        width: "60px",
                        backgroundColor: "#17191a",
                        color: "#7fc0f5",
                        border: "1px solid #1972a7",
                      }}
                      value={r.signo}
                      onChange={e =>
                        handleRestriccionChange(idx, "signo", e.target.value)
                      }
                    >
                      <option value="≥">≥</option>
                      <option value="≤">≤</option>
                      <option value="=">=</option>
                    </select>
                    <input
                      type="text"
                      className="form-control text-center"
                      style={{
                        width: "80px",
                        backgroundColor: "#17191a",
                        color: "#7fc0f5",
                        border: "1px solid #1972a7",
                      }}
                      placeholder="Valor"
                      value={r.valor}
                      onChange={e =>
                        handleRestriccionChange(idx, "valor", e.target.value)
                      }
                    />
                  </div>
                </div>
              ))}
              {/* Botones agregar/quitar/calcular */}
              <div className="d-flex justify-content-center mt-4 gap-3">
                <button
                  type="button"
                  className="btn rounded-circle"
                  style={{
                    width: "48px",
                    height: "48px",
                    fontSize: "2rem",
                    backgroundColor: "#8bc34a",
                    color: "#fff",
                    border: "none",
                  }}
                  onClick={agregarRestriccion}
                >
                  +
                </button>
                <button
                  type="button"
                  className="btn rounded-circle"
                  style={{
                    width: "48px",
                    height: "48px",
                    fontSize: "2rem",
                    backgroundColor: "#8bc34a",
                    color: "#fff",
                    border: "none",
                  }}
                  onClick={eliminarRestriccion}
                >
                  −
                </button>
                <button
                  type="button"
                  className="btn"
                  style={{
                    background: "#1972a7",
                    color: "#fff",
                    border: "none",
                    padding: "0 25px",
                    borderRadius: "2rem",
                    fontWeight: "bold",
                    fontSize: "1.2rem",
                  }}
                  onClick={calcularResultados}
                >
                  Calcular
                </button>
              </div>
            </form>
            {/* Resultados */}
            {resultados.length > 0 && (
              <div style={{ marginTop: 30 }}>
                <h3 style={{ color: "#b3cdca" }}>Resultados (Puntos factibles):</h3>
                <table
                  border="1"
                  cellPadding="6"
                  style={{
                    borderCollapse: "collapse",
                    margin: "0 auto",
                    backgroundColor: "#17191a",
                    color: "#7fc0f5",
                    borderColor: "#1972a7",
                  }}
                >
                  <thead>
                    <tr>
                      <th>X₁</th>
                      <th>X₂</th>
                      <th>Z</th>
                    </tr>
                  </thead>
                  <tbody>
                    {resultados.map((p, i) => (
                      <tr key={i}>
                        <td>{p.x1.toFixed(2)}</td>
                        <td>{p.x2.toFixed(2)}</td>
                        <td>{p.z.toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <h4 style={{ marginTop: 15, color: "#8bc34a" }}>
                  Mínimo Z:{" "}
                  {Math.min(...resultados.map(r => r.z)).toFixed(2)}
                </h4>
                {/* Gráfico */}
                <div style={{ maxWidth: 500, margin: "30px auto" }}>
                  <Scatter data={data} options={options} />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Minimizacion;