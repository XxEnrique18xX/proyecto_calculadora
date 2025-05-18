import React, { useState } from 'react';

function CPM() {
  const [cantidadActividades, setCantidadActividades] = useState('');
  const [cantidadPredecesores, setCantidadPredecesores] = useState('');
  const [errorPredecesores, setErrorPredecesores] = useState('');
  const [mostrarSelecciones, setMostrarSelecciones] = useState(false);
  const [seleccionados, setSeleccionados] = useState([]);
  const [actividadesConfirmadas, setActividadesConfirmadas] = useState(false);
  const [predecesoresPorActividad, setPredecesoresPorActividad] = useState({});
  const [duraciones, setDuraciones] = useState({});
  const [resultados, setResultados] = useState([]);
  const [rutaCritica, setRutaCritica] = useState([]);
  const letras = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

  const handleActividadesChange = (e) => {
    const valor = e.target.value;
    if (/^\d*$/.test(valor)) {
      setCantidadActividades(valor);
      setCantidadPredecesores('');
      setErrorPredecesores('');
      setMostrarSelecciones(false);
      setSeleccionados([]);
      setActividadesConfirmadas(false);
      setPredecesoresPorActividad({});
      setDuraciones({});
      setResultados([]);
      setRutaCritica([]);
    }
  };

  const handlePredecesoresChange = (e) => {
    const valor = e.target.value;
    if (/^\d*$/.test(valor)) {
      const num = parseInt(valor);
      const max = parseInt(cantidadActividades);

      if (!isNaN(num) && num >= max) {
        setErrorPredecesores('⚠️ Debe ser menor que el número de actividades.');
      } else {
        setErrorPredecesores('');
      }

      setCantidadPredecesores(valor);
      setMostrarSelecciones(false);
      setSeleccionados([]);
      setActividadesConfirmadas(false);
    }
  };

  const handleCheckboxChange = (letra) => {
    let copia = [...seleccionados];
    if (copia.includes(letra)) {
      copia = copia.filter(item => item !== letra);
    } else {
      if (copia.length < parseInt(cantidadPredecesores)) {
        copia.push(letra);
      }
    }
    setSeleccionados(copia);
  };

  const handlePredecesorChange = (actividad, letra) => {
    setPredecesoresPorActividad(prev => {
      const nuevos = { ...prev };
      if (!nuevos[actividad]) nuevos[actividad] = [];
      if (nuevos[actividad].includes(letra)) {
        nuevos[actividad] = nuevos[actividad].filter(p => p !== letra);
      } else {
        nuevos[actividad].push(letra);
      }
      return nuevos;
    });
  };

  const handleDuracionChange = (actividad, valor) => {
    if (/^\d*$/.test(valor)) {
      setDuraciones(prev => ({ ...prev, [actividad]: valor }));
    }
  };

  const handleAceptarClick = () => {
    if (cantidadActividades && cantidadPredecesores && !errorPredecesores) {
      setMostrarSelecciones(true);
      setActividadesConfirmadas(false);
      setSeleccionados([]);
    }
  };

  const confirmarSeleccion = () => {
    if (seleccionados.length === parseInt(cantidadPredecesores)) {
      setActividadesConfirmadas(true);
    }
  };

  const generarValores = () => {
    const nodos = {};
    const orden = [];
    const duracionesInt = {};

    for (let i = 0; i < parseInt(cantidadActividades); i++) {
      const letra = letras[i];
      nodos[letra] = {
        es: 0, ef: 0, ls: 0, lf: 0,
        duracion: parseInt(duraciones[letra]) || 0,
        predecesores: predecesoresPorActividad[letra] || [],
        sucesores: []
      };
      duracionesInt[letra] = parseInt(duraciones[letra]) || 0;
    }

    for (const act in predecesoresPorActividad) {
      const pres = predecesoresPorActividad[act];
      pres.forEach(p => {
        if (!nodos[p].sucesores.includes(act)) {
          nodos[p].sucesores.push(act);
        }
      });
    }

    const visitados = new Set();
    const resolver = (letra) => {
      if (visitados.has(letra)) return;
      const { predecesores } = nodos[letra];
      let maxEF = 0;
      for (const p of predecesores) {
        if (!visitados.has(p)) resolver(p);
        maxEF = Math.max(maxEF, nodos[p].ef);
      }
      nodos[letra].es = maxEF;
      nodos[letra].ef = maxEF + nodos[letra].duracion;
      visitados.add(letra);
      orden.push(letra);
    };

    for (const letra in nodos) {
      resolver(letra);
    }

    let tiempoFinal = Math.max(...orden.map(l => nodos[l].ef));

    const ordenReverso = [...orden].reverse();
    for (const letra of ordenReverso) {
      const nodo = nodos[letra];
      if (nodo.sucesores.length === 0) {
        nodo.lf = tiempoFinal;
      } else {
        nodo.lf = Math.min(...nodo.sucesores.map(s => nodos[s].ls));
      }
      nodo.ls = nodo.lf - nodo.duracion;
    }

    const resultadoFinal = orden.map(l => ({ letra: l, ...nodos[l] }));
    setResultados(resultadoFinal);

    const ruta = ['Inicio'];
    let suma = 0;
    resultadoFinal.forEach((nodo) => {
      const h1 = nodo.ls - nodo.es;
      const h2 = nodo.lf - nodo.ef;
      if (h1 === 0 && h2 === 0) {
        ruta.push(nodo.letra);
        suma += nodo.duracion;
      }
    });
    ruta.push('Fin');
    ruta.push('=' + suma);
    setRutaCritica(ruta);
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>Método CPM (Ruta Crítica)</h2>

      <div style={{ marginBottom: '15px' }}>
        <label>Ingrese el número de actividades a trabajar:</label>
        <input
          type="text"
          value={cantidadActividades}
          onChange={handleActividadesChange}
          maxLength={2}
          style={{ marginLeft: '10px', padding: '5px', width: '60px', textAlign: 'center' }}
          placeholder="0"
        />
      </div>

      {cantidadActividades && parseInt(cantidadActividades) > 0 && (
        <div>
          <label>Indique el número de predecesores:</label>
          <input
            type="text"
            value={cantidadPredecesores}
            onChange={handlePredecesoresChange}
            maxLength={2}
            style={{ marginLeft: '10px', padding: '5px', width: '60px', textAlign: 'center' }}
            placeholder="0"
          />
          {errorPredecesores && (
            <div style={{ color: 'red', marginTop: '5px' }}>{errorPredecesores}</div>
          )}
        </div>
      )}

      {(cantidadActividades && cantidadPredecesores && !errorPredecesores) && (
        <div style={{ marginTop: '15px' }}>
          <button onClick={handleAceptarClick}>Aceptar</button>
        </div>
      )}

      {mostrarSelecciones && (
        <div style={{ marginTop: '25px' }}>
          <h4>Seleccione los predecesores iniciales:</h4>
          {Array.from({ length: parseInt(cantidadActividades) }, (_, i) => {
            const letra = letras[i];
            return (
              <div key={letra} style={{ marginBottom: '5px' }}>
                <label>
                  <input
                    type="checkbox"
                    checked={seleccionados.includes(letra)}
                    onChange={() => handleCheckboxChange(letra)}
                    disabled={!seleccionados.includes(letra) && seleccionados.length >= parseInt(cantidadPredecesores)}
                  />
                  {'  '}{letra}
                </label>
              </div>
            );
          })}
          <button onClick={confirmarSeleccion} style={{ marginTop: '10px' }}>
            Confirmar Predecesores
          </button>
        </div>
      )}

      {actividadesConfirmadas && (
        <div style={{ marginTop: '30px' }}>
          <h3>Tabla de Actividades</h3>
          <table border="1" style={{ borderCollapse: 'collapse', width: '100%', textAlign: 'center' }}>
            <thead>
              <tr>
                <th>Actividad</th>
                <th>Predecesor</th>
                <th>Duración</th>
              </tr>
            </thead>
            <tbody>
              {Array.from({ length: parseInt(cantidadActividades) }, (_, i) => {
                const actividad = letras[i];
                const esPredecesora = seleccionados.includes(actividad);
                return (
                  <tr key={actividad}>
                    <td><strong>{actividad}</strong></td>
                    <td>
                      {esPredecesora ? '-' : (
                        <>
                          {Array.from({ length: parseInt(cantidadActividades) }, (_, j) => {
                            const opcion = letras[j];
                            if (opcion === actividad) return null;
                            return (
                              <label key={opcion} style={{ marginRight: '10px' }}>
                                <input
                                  type="checkbox"
                                  onChange={() => handlePredecesorChange(actividad, opcion)}
                                /> {opcion}
                              </label>
                            );
                          })}
                        </>
                      )}
                    </td>
                    <td>
                      <input
                        type="number"
                        min="1"
                        value={duraciones[actividad] || ''}
                        onChange={(e) => handleDuracionChange(actividad, e.target.value)}
                        style={{ width: '60px', textAlign: 'center' }}
                        placeholder="0"
                      />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          <button onClick={generarValores} style={{ marginTop: '20px' }}>Generar valores de arriba</button>

          {resultados.length > 0 && (
            <div style={{ marginTop: '30px' }}>
              <h3>Resultados CPM (Inicio temprano / Fin temprano)</h3>
              <ul>
                {resultados.map((r, i) => (
                  <li key={i}>
                    <strong>{r.letra}</strong>: {r.es} | {r.ef} / {r.ls} | {r.lf}
                  </li>
                ))}
              </ul>
            </div>
          )}
          {rutaCritica.length > 0 && (
            <div style={{ marginTop: '30px' }}>
              <h3>Ruta Crítica:</h3>
              <p>
                <strong>
                  {rutaCritica.slice(0, -1).join(', ')} = {rutaCritica.at(-1).replace('=', '')}
                </strong>
              </p>
            </div>
          )}

        </div>
      )}
    </div>
  );
}

export default CPM;