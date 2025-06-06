import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";

function Asignacion() {
  const navigate = useNavigate();
  const [tamanio, setTamanio] = useState('');
  const [mostrarInputs, setMostrarInputs] = useState(false);
  const [matrizDatos, setMatrizDatos] = useState([]);
  const [matrizReduccionFila, setMatrizReduccionFila] = useState([]);
  const [matrizReduccionColumna, setMatrizReduccionColumna] = useState([]);
  const [taches, setTaches] = useState([]);
  const [minimoLibre, setMinimoLibre] = useState(null);
  const [matrizTransformada, setMatrizTransformada] = useState([]);
  const [tachesFinales, setTachesFinales] = useState([]);
  const [asignacionListo, setAsignacionListo] = useState(false);
  const [asignacionesFinales, setAsignacionesFinales] = useState([]);
  const letras = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

  const handleChange = (e) => {
    const valor = e.target.value;
    if (/^\d*\.?\d*$/.test(valor)) {
      setTamanio(valor);
    }
  };

  const generarInputs = () => {
    const n = parseInt(tamanio);
    if (isNaN(n) || n <= 0) return;

    const vacia = Array.from({ length: n }, () => Array(n).fill(''));
    setMatrizDatos(vacia);
    setMostrarInputs(true);
    setMatrizReduccionFila([]);
    setMatrizReduccionColumna([]);
    setTaches([]);
    setMinimoLibre(null);
    setMatrizTransformada([]);
    setTachesFinales([]);
    setAsignacionesFinales([]);
    setAsignacionListo(false);
  };

  const aplicarTachesFinales = () => {
    let matrizActual = matrizTransformada;
    let tachesTemp;
    const n = matrizActual.length;

    const contarCeros = (tipo, index, matriz, cubierto) => {
      let count = 0;
      for (let i = 0; i < matriz.length; i++) {
        if (tipo === 'fila' && matriz[index][i] === 0 && !cubierto[index][i]) count++;
        if (tipo === 'columna' && matriz[i][index] === 0 && !cubierto[i][index]) count++;
      }
      return count;
    };

    while (true) {
      const cubierto = Array.from({ length: n }, () => Array(n).fill(false));
      tachesTemp = [];

      while (true) {
        let mejorTipo = null;
        let mejorIndex = -1;
        let maxCeros = 0;

        for (let i = 0; i < n; i++) {
          const cerosFila = contarCeros('fila', i, matrizActual, cubierto);
          const cerosCol = contarCeros('columna', i, matrizActual, cubierto);

          if (cerosFila > maxCeros) {
            mejorTipo = 'fila';
            mejorIndex = i;
            maxCeros = cerosFila;
          }
          if (cerosCol > maxCeros) {
            mejorTipo = 'columna';
            mejorIndex = i;
            maxCeros = cerosCol;
          }
        }

        if (maxCeros === 0) break;

        tachesTemp.push({ type: mejorTipo, index: mejorIndex });
        for (let i = 0; i < n; i++) {
          if (mejorTipo === 'fila') cubierto[mejorIndex][i] = true;
          else cubierto[i][mejorIndex] = true;
        }
      }

      if (tachesTemp.length === n) {
        setTachesFinales(tachesTemp);
        setAsignacionListo(true);
        alert("¡Número de líneas suficiente! Ya puedes pasar al paso final. No se generará más Matriz 5 ni 6.");
        break;
      }

      const filasTachadas = tachesTemp.filter(t => t.type === 'fila').map(t => t.index);
      const columnasTachadas = tachesTemp.filter(t => t.type === 'columna').map(t => t.index);

      let minValor = Infinity;
      let posicion = null;

      for (let i = 0; i < n; i++) {
        for (let j = 0; j < n; j++) {
          const valor = matrizActual[i][j];
          const filaTachada = filasTachadas.includes(i);
          const columnaTachada = columnasTachadas.includes(j);
          if (!filaTachada && !columnaTachada && valor < minValor) {
            minValor = valor;
            posicion = { fila: i, columna: j };
          }
        }
      }

      setMinimoLibre(posicion);

      if (posicion) {
        const transformada = matrizActual.map((fila, i) =>
          fila.map((valor, j) => {
            const filaT = filasTachadas.includes(i);
            const colT = columnasTachadas.includes(j);
            if (!filaT && !colT) return valor - minValor;
            if (filaT && colT) return valor + minValor;
            return valor;
          })
        );
        matrizActual = transformada;
      }
    }

    setTachesFinales(tachesTemp);
    setMatrizTransformada(matrizActual);
  };

  const resolverAsignacionFinal = () => {
    const n = matrizTransformada.length;
    const matrizTrabajo = matrizTransformada.map(f => [...f]);
    const asignaciones = [];
    const filasUsadas = new Set();
    const columnasUsadas = new Set();

    while (asignaciones.length < n) {
      let asignado = false;

      for (let i = 0; i < n; i++) {
        if (filasUsadas.has(i)) continue;
        const ceros = matrizTrabajo[i].map((v, j) => (v === 0 && !columnasUsadas.has(j) ? j : -1)).filter(j => j !== -1);
        if (ceros.length === 1) {
          asignaciones.push({ fila: i, columna: ceros[0] });
          filasUsadas.add(i);
          columnasUsadas.add(ceros[0]);
          asignado = true;
          break;
        }
      }

      if (!asignado) {
        for (let i = 0; i < n; i++) {
          if (filasUsadas.has(i)) continue;
          const ceros = matrizTrabajo[i].map((v, j) => (v === 0 && !columnasUsadas.has(j) ? j : -1)).filter(j => j !== -1);
          if (ceros.length > 1) {
            let min = Infinity;
            let mejorCol = -1;
            ceros.forEach(j => {
              const valorOriginal = parseFloat(matrizDatos[i][j]);
              if (valorOriginal < min) {
                min = valorOriginal;
                mejorCol = j;
              }
            });
            asignaciones.push({ fila: i, columna: mejorCol });
            filasUsadas.add(i);
            columnasUsadas.add(mejorCol);
            break;
          }
        }
      }
    }

    const resultado = asignaciones.map(a => {
      const letra = letras[a.columna];
      const valor = parseFloat(matrizDatos[a.fila][a.columna]);
      return { asignacion: `${a.fila + 1}${letra}`, valor };
    });

    setAsignacionesFinales(resultado);
  };

  const renderMatrizConTachesFinales = () => {
    return (
      <div style={{ marginTop: '30px' }}>
        <h3 style={{ color: "#b3cdca", marginBottom: '20px' }}>Matriz 6: Taches Finales</h3>
        <div style={{ position: 'relative', display: 'inline-block', overflowX: 'auto' }}>
          <table 
            className="table table-bordered"
            style={{ 
              backgroundColor: "#17191a",
              color: "#7fc0f5",
              borderColor: "#1972a7",
              margin: "0 auto"
            }}
          >
            <thead>
              <tr>
                <th style={{ backgroundColor: "#2d3133", color: "#b3cdca", textAlign: 'center' }}></th>
                {matrizTransformada[0].map((_, colIndex) => (
                  <th key={colIndex} style={{ backgroundColor: "#2d3133", color: "#b3cdca", textAlign: 'center' }}>
                    {letras[colIndex]}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {matrizTransformada.map((fila, rowIndex) => (
                <tr key={rowIndex}>
                  <td style={{ backgroundColor: "#2d3133", color: "#b3cdca", textAlign: 'center', fontWeight: 'bold' }}>
                    {rowIndex + 1}
                  </td>
                  {fila.map((valor, colIndex) => {
                    const tacheFila = tachesFinales.find(t => t.type === 'fila' && t.index === rowIndex);
                    const tacheCol = tachesFinales.find(t => t.type === 'columna' && t.index === colIndex);
                    let estilo = {
                      textAlign: 'center',
                      padding: '8px',
                      position: 'relative',
                      backgroundColor: "#17191a",
                      color: "#7fc0f5"
                    };

                    return (
                      <td key={colIndex} style={estilo}>
                        {valor}
                        {tacheFila && (
                          <div style={{
                            position: 'absolute',
                            top: '50%',
                            left: 0,
                            width: '100%',
                            height: '2px',
                            backgroundColor: tacheCol ? 'blue' : 'red',
                            transform: 'translateY(-50%)'
                          }}></div>
                        )}
                        {tacheCol && (
                          <div style={{
                            position: 'absolute',
                            top: 0,
                            left: '50%',
                            width: '2px',
                            height: '100%',
                            backgroundColor: tacheFila ? 'blue' : 'red',
                            transform: 'translateX(-50%)'
                          }}></div>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  const handleInputChange = (e, row, col) => {
    const valor = e.target.value;
    if (/^\d*\.?\d*$/.test(valor)) {
      const nuevaMatriz = [...matrizDatos];
      nuevaMatriz[row][col] = valor;
      setMatrizDatos(nuevaMatriz);
    }
  };

  const aplicarReduccionPorFila = () => {
    const reducida = matrizDatos.map((fila) => {
      const filaNumeros = fila.map(Number);
      const min = Math.min(...filaNumeros);
      return filaNumeros.map(num => Math.abs(num - min));
    });

    setMatrizReduccionFila(reducida);
    aplicarReduccionPorColumna(reducida);
  };

  const aplicarReduccionPorColumna = (matriz) => {
    const n = matriz.length;
    const resultado = Array.from({ length: n }, () => Array(n).fill(0));

    for (let col = 0; col < n; col++) {
      const columnaValores = matriz.map(fila => fila[col]);
      const minCol = Math.min(...columnaValores);

      for (let fila = 0; fila < n; fila++) {
        resultado[fila][col] = Math.abs(matriz[fila][col] - minCol);
      }
    }

    setMatrizReduccionColumna(resultado);
  };

  const aplicarTaches = () => {
    const n = matrizReduccionColumna.length;
    const cubierto = Array.from({ length: n }, () => Array(n).fill(false));
    const tachesTemp = [];

    const contarCeros = (tipo, index) => {
      let count = 0;
      for (let i = 0; i < n; i++) {
        if (tipo === 'fila' && matrizReduccionColumna[index][i] === 0 && !cubierto[index][i]) count++;
        if (tipo === 'columna' && matrizReduccionColumna[i][index] === 0 && !cubierto[i][index]) count++;
      }
      return count;
    };

    while (true) {
      let mejorTipo = null;
      let mejorIndex = -1;
      let maxCeros = 0;

      for (let i = 0; i < n; i++) {
        const cerosFila = contarCeros('fila', i);
        const cerosCol = contarCeros('columna', i);
        if (cerosFila > maxCeros) {
          mejorTipo = 'fila';
          mejorIndex = i;
          maxCeros = cerosFila;
        }
        if (cerosCol > maxCeros) {
          mejorTipo = 'columna';
          mejorIndex = i;
          maxCeros = cerosCol;
        }
      }

      if (maxCeros === 0) break;

      tachesTemp.push({ type: mejorTipo, index: mejorIndex });
      for (let i = 0; i < n; i++) {
        if (mejorTipo === 'fila') cubierto[mejorIndex][i] = true;
        else cubierto[i][mejorIndex] = true;
      }
    }

    setTaches(tachesTemp);

    const filasTachadas = tachesTemp.filter(t => t.type === 'fila').map(t => t.index);
    const columnasTachadas = tachesTemp.filter(t => t.type === 'columna').map(t => t.index);

    let minValor = Infinity;
    let posicion = null;

    for (let i = 0; i < n; i++) {
      for (let j = 0; j < n; j++) {
        const valor = matrizReduccionColumna[i][j];
        const filaTachada = filasTachadas.includes(i);
        const columnaTachada = columnasTachadas.includes(j);
        if (!filaTachada && !columnaTachada && valor < minValor) {
          minValor = valor;
          posicion = { fila: i, columna: j };
        }
      }
    }

    setMinimoLibre(posicion);

    if (posicion) {
      const transformada = matrizReduccionColumna.map((fila, i) =>
        fila.map((valor, j) => {
          const filaT = filasTachadas.includes(i);
          const colT = columnasTachadas.includes(j);
          if (!filaT && !colT) return valor - minValor;
          if (filaT && colT) return valor + minValor;
          return valor;
        })
      );
      setMatrizTransformada(transformada);
    }
  };

  function renderMatriz(matriz, titulo) {
    return (
      <div style={{ marginTop: '30px' }}>
        <h3 style={{ color: "#b3cdca", marginBottom: '20px' }}>{titulo}</h3>
        <div style={{ overflowX: 'auto' }}>
          <table 
            className="table table-bordered"
            style={{ 
              backgroundColor: "#17191a",
              color: "#7fc0f5",
              borderColor: "#1972a7",
              margin: "0 auto"
            }}
          >
            <thead>
              <tr>
                <th style={{ backgroundColor: "#2d3133", color: "#b3cdca", textAlign: 'center' }}></th>
                {matriz[0].map((_, colIndex) => (
                  <th key={colIndex} style={{ backgroundColor: "#2d3133", color: "#b3cdca", textAlign: 'center' }}>
                    {letras[colIndex]}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {matriz.map((fila, rowIndex) => (
                <tr key={rowIndex}>
                  <td style={{ backgroundColor: "#2d3133", color: "#b3cdca", textAlign: 'center', fontWeight: 'bold' }}>
                    {rowIndex + 1}
                  </td>
                  {fila.map((valor, colIndex) => (
                    <td key={colIndex} style={{ textAlign: 'center', backgroundColor: "#17191a", color: "#7fc0f5", padding: '8px' }}>
                      {valor}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

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
            maxWidth: "90rem",
            backgroundColor: "#2d3133",
            color: "#7fc0f5",
          }}
        >
          <div className="card-body text-center">
            <h1 className="card-title mb-4" style={{ color: "#7fc0f5" }}>
              Método de Asignación
            </h1>
            
            {/* Input para tamaño de matriz */}
            <div className="mb-4">
              <label
                className="form-label fw-bold fs-5"
                style={{ color: "#b3cdca" }}
              >
                Ingrese el tamaño de la matriz:
              </label>
              <div className="d-flex align-items-center justify-content-center gap-3 mt-3">
                <input
                  type="text"
                  className="form-control text-center"
                  style={{
                    width: "100px",
                    backgroundColor: "#17191a",
                    color: "#7fc0f5",
                    border: "1px solid #1972a7",
                  }}
                  value={tamanio}
                  onChange={handleChange}
                  maxLength={2}
                  placeholder="Ej: 3"
                />
                <button
                  className="btn"
                  style={{
                    background: "#1972a7",
                    color: "#fff",
                    border: "none",
                    padding: "0 25px",
                    borderRadius: "2rem",
                    fontWeight: "bold",
                  }}
                  onClick={generarInputs}
                >
                  Generar matriz
                </button>
              </div>
            </div>

            {/* Matriz de entrada */}
            {mostrarInputs && matrizDatos.length > 0 && (
              <div style={{ marginTop: '30px' }}>
                <h3 style={{ color: "#b3cdca", marginBottom: '20px' }}>Ingrese los valores de la matriz:</h3>
                <div style={{ overflowX: 'auto' }}>
                  <table 
                    className="table table-bordered"
                    style={{ 
                      backgroundColor: "#17191a",
                      color: "#7fc0f5",
                      borderColor: "#1972a7",
                      margin: "0 auto"
                    }}
                  >
                    <thead>
                      <tr>
                        <th style={{ backgroundColor: "#2d3133", color: "#b3cdca", textAlign: 'center' }}></th>
                        {matrizDatos[0].map((_, colIndex) => (
                          <th key={colIndex} style={{ backgroundColor: "#2d3133", color: "#b3cdca", textAlign: 'center' }}>
                            {letras[colIndex]}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {matrizDatos.map((fila, rowIndex) => (
                        <tr key={rowIndex}>
                          <td style={{ backgroundColor: "#2d3133", color: "#b3cdca", textAlign: 'center', fontWeight: 'bold' }}>
                            {rowIndex + 1}
                          </td>
                          {fila.map((valor, colIndex) => (
                            <td key={colIndex} style={{ padding: '5px' }}>
                              <input
                                type="text"
                                className="form-control text-center"
                                style={{
                                  width: "60px",
                                  backgroundColor: "#17191a",
                                  color: "#7fc0f5",
                                  border: "1px solid #1972a7",
                                }}
                                value={matrizDatos[rowIndex][colIndex]}
                                onChange={(e) => handleInputChange(e, rowIndex, colIndex)}
                              />
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <button 
                  className="btn mt-4"
                  style={{
                    background: "#8bc34a",
                    color: "#fff",
                    border: "none",
                    padding: "10px 30px",
                    borderRadius: "2rem",
                    fontWeight: "bold",
                  }}
                  onClick={aplicarReduccionPorFila}
                >
                  Generar Matriz Reducida por Fila y Columna
                </button>
              </div>
            )}

            {/* Matriz Reducción por Fila */}
            {matrizReduccionFila.length > 0 && 
              renderMatriz(matrizReduccionFila, "Matriz Reducción por Fila")
            }

            {/* Matriz Reducción por Columna */}
            {matrizReduccionColumna.length > 0 && (
              <>
                {renderMatriz(matrizReduccionColumna, "Matriz Reducción por Columna")}
                <button 
                  className="btn mt-4"
                  style={{
                    background: "#8bc34a",
                    color: "#fff",
                    border: "none",
                    padding: "10px 30px",
                    borderRadius: "2rem",
                    fontWeight: "bold",
                  }}
                  onClick={aplicarTaches}
                >
                  Aplicar Taches (Matriz 4)
                </button>
              </>
            )}

            {/* Matriz 4: Taches */}
            {taches.length > 0 && (
              <div style={{ marginTop: '30px' }}>
                <h3 style={{ color: "#b3cdca", marginBottom: '20px' }}>Matriz 4: Taches</h3>
                <div style={{ position: 'relative', display: 'inline-block', overflowX: 'auto' }}>
                  <table 
                    className="table table-bordered"
                    style={{ 
                      backgroundColor: "#17191a",
                      color: "#7fc0f5",
                      borderColor: "#1972a7",
                      margin: "0 auto"
                    }}
                  >
                    <thead>
                      <tr>
                        <th style={{ backgroundColor: "#2d3133", color: "#b3cdca", textAlign: 'center' }}></th>
                        {matrizReduccionColumna[0].map((_, colIndex) => (
                          <th key={colIndex} style={{ backgroundColor: "#2d3133", color: "#b3cdca", textAlign: 'center' }}>
                            {letras[colIndex]}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {matrizReduccionColumna.map((fila, rowIndex) => (
                        <tr key={rowIndex}>
                          <td style={{ backgroundColor: "#2d3133", color: "#b3cdca", textAlign: 'center', fontWeight: 'bold' }}>
                            {rowIndex + 1}
                          </td>
                          {fila.map((valor, colIndex) => {
                            const tacheFila = taches.find(t => t.type === 'fila' && t.index === rowIndex);
                            const tacheCol = taches.find(t => t.type === 'columna' && t.index === colIndex);
                            let estilo = {
                              textAlign: 'center',
                              padding: '8px',
                              position: 'relative',
                              backgroundColor: minimoLibre && minimoLibre.fila === rowIndex && minimoLibre.columna === colIndex ? '#8bc34a' : '#17191a',
                              color: "#7fc0f5"
                            };

                            return (
                              <td key={colIndex} style={estilo}>
                                {valor}
                                {tacheFila && (
                                  <div style={{
                                    position: 'absolute',
                                    top: '50%',
                                    left: 0,
                                    width: '100%',
                                    height: '2px',
                                    backgroundColor: tacheCol ? 'blue' : 'red',
                                    transform: 'translateY(-50%)'
                                  }}></div>
                                )}
                                {tacheCol && (
                                  <div style={{
                                    position: 'absolute',
                                    top: 0,
                                    left: '50%',
                                    width: '2px',
                                    height: '100%',
                                    backgroundColor: tacheFila ? 'blue' : 'red',
                                    transform: 'translateX(-50%)'
                                  }}></div>
                                )}
                              </td>
                            );
                          })}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Mensaje de asignación lista */}
            {asignacionListo && (
              <div 
                className="alert mt-4"
                style={{ 
                  backgroundColor: "#8bc34a", 
                  color: "#fff", 
                  border: "none",
                  fontWeight: "bold"
                }}
              >
                ✅ Ya puedes pasar al paso final. No es necesario aplicar Matriz 5 ni Matriz 6.
              </div>
            )}

            {/* Matriz 5: Transformada */}
            {matrizTransformada.length > 0 && (
              <div style={{ marginTop: '30px' }}>
                {renderMatriz(matrizTransformada, "Matriz 5: Transformada")}

                <div style={{ marginTop: '20px' }}>
                  <button 
                    className="btn"
                    style={{
                      background: "#8bc34a",
                      color: "#fff",
                      border: "none",
                      padding: "10px 30px",
                      borderRadius: "2rem",
                      fontWeight: "bold",
                    }}
                    onClick={aplicarTachesFinales}
                  >
                    Aplicar Taches Finales (Matriz 6)
                  </button>
                </div>

                {tachesFinales.length > 0 && (
                  <>
                    {renderMatrizConTachesFinales()}

                    <button 
                      className="btn mt-4"
                      style={{
                        background: "#1972a7",
                        color: "#fff",
                        border: "none",
                        padding: "10px 30px",
                        borderRadius: "2rem",
                        fontWeight: "bold",
                      }}
                      onClick={resolverAsignacionFinal}
                    >
                      Resolver Asignación Final
                    </button>

                    {asignacionesFinales.length > 0 && (
                      <div style={{ marginTop: '30px' }}>
                        <h3 style={{ color: "#b3cdca", marginBottom: '20px' }}>Resultado Final:</h3>
                        <div
                          style={{
                            backgroundColor: "#17191a",
                            color: "#7fc0f5",
                            padding: "20px",
                            borderRadius: "10px",
                            border: "1px solid #1972a7",
                            maxWidth: "400px",
                            margin: "0 auto"
                          }}
                        >
                          <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                            {asignacionesFinales.map((a, i) => (
                              <li key={i} style={{ padding: '5px 0', borderBottom: i < asignacionesFinales.length - 1 ? '1px solid #2d3133' : 'none' }}>
                                <strong>{a.asignacion}</strong> - {a.valor}
                              </li>
                            ))}
                          </ul>
                          <div style={{ marginTop: '15px', padding: '10px', backgroundColor: '#8bc34a', borderRadius: '5px' }}>
                            <strong style={{ color: '#fff' }}>
                              Total: {asignacionesFinales.reduce((sum, a) => sum + a.valor, 0)}
                            </strong>
                          </div>
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Asignacion;