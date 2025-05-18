// src/SimplexSolver.js
import React, { useState, useRef, useEffect } from 'react';
import {
  Container,
  Box,
  Typography,
  TextField,
  Select,
  MenuItem,
  Button,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import { ChevronLeft, ChevronRight, RestartAlt } from '@mui/icons-material';
import Tableau from './Tableau';

export default function SimplexSolver() {
  // Estado de pasos: 0 = configuración inicial; 1 = ingresar coeficientes; 2 = mostrar iteraciones y resultado
  const [step, setStep] = useState(0);

  // Enunciado / descripción del problema (se conserva siempre)
  const [problemDesc, setProblemDesc] = useState('');

  // Número de variables (x1, x2, ..., xn)
  const [numVars, setNumVars] = useState(0);

  // Número de restricciones
  const [numRes, setNumRes] = useState(0);

  // Coeficientes de la función objetivo
  const [objective, setObjective] = useState([]);

  // Matriz de coeficientes de restricciones (cada fila: [coef_x1, coef_x2, ..., coef_xn, RHS])
  const [constraints, setConstraints] = useState([]);

  // Tipo de desigualdad para cada restricción ('<=', '>=', '=')
  const [inequalities, setInequalities] = useState([]);

  // Historial de pasos (array de objetos { phase, iteration, tableau: [...] })
  const [stepsData, setStepsData] = useState([]);

  // Parámetros globales para construir cabeceras en las tablas
  const [originalVars, setOriginalVars] = useState(0);
  const [numSlack, setNumSlack] = useState(0);
  const [numArt, setNumArt] = useState(0);

  // Estado y datos de la solución óptima (para el modal y para mostrar abajo)
  const [showResultModal, setShowResultModal] = useState(false);
  const [optimalSolution, setOptimalSolution] = useState({ optValue: 0, sol: [] });

  // Ref para hacer scroll automático en la zona de tablas
  const textAreaRef = useRef(null);

  // --- Función para pasar de paso 0 a paso 1: inicializa vectores y matrices ---
  const initTable = () => {
    if (numVars <= 0 || numRes <= 0) {
      alert('Ingrese valores válidos para número de variables y restricciones.');
      return;
    }

    // Inicializar coeficientes de Z como strings vacíos
    setObjective(Array(numVars).fill(''));

    // Inicializar cada fila de restricciones con (numVars + 1) celdas vacías
    setConstraints(
      Array(numRes)
        .fill(null)
        .map(() => Array(numVars + 1).fill(''))
    );

    // Todas las desigualdades empiezan como '<='
    setInequalities(Array(numRes).fill('<='));

    // Guardar numVars para las cabeceras
    setOriginalVars(numVars);

    // Limpiar historial previo y modal
    setStepsData([]);
    setOptimalSolution({ optValue: 0, sol: [] });
    setShowResultModal(false);

    // Avanzar a paso 1
    setStep(1);
  };

  // --- Extraer y mostrar solución óptima en modal (solo guarda objeto) ---
  const extractAndShowOptimal = (solutionObj) => {
    setOptimalSolution(solutionObj);
    setShowResultModal(true);
  };

  // --- De paso 1 a paso 2: arma datos numéricos y ejecuta simplex ---
  const handleSolve = () => {
    try {
      // Convertir objective de strings a números
      const c = objective.map((v) => parseFloat(v) || 0);

      // Construir array de restricciones: { lhs: [...], ineq, rhs }
      const constr = constraints.map((row, i) => ({
        lhs: row.slice(0, -1).map((v) => parseFloat(v) || 0),
        ineq: inequalities[i],
        rhs: parseFloat(row[row.length - 1]) || 0
      }));

      // Ejecutar Dos Fases → retorna { steps, solution, numSlack, numArt }
      const result = runTwoPhase(c, constr);

      // Guardar resultados para render
      setStepsData(result.steps);
      setNumSlack(result.numSlack);
      setNumArt(result.numArt);

      // Mostrar modal con solución óptima
      extractAndShowOptimal(result.solution);

      // Avanzar a paso 2
      setStep(2);
    } catch (e) {
      alert('Error: ' + e.message);
    }
  };

  // --- Implementación de Dos Fases que devuelve datos estructurados (no texto) ---
  function runTwoPhase(c, constraints) {
    const steps = [];
    const { tableau: T1, numSlack, numArt } = buildTableau(c, constraints);

    // Tabla inicial fase 1 (iteración 0)
    steps.push({
      phase: 1,
      iteration: 0,
      tableau: T1.map((fila) => [...fila])
    });

    // Itera fase 1
    let tableau = T1;
    let iter1 = 0;
    while (!isOptimal(tableau)) {
      const col = selectPivotColumn(tableau);
      if (col === null) throw new Error('Problema no acotado en fase 1');
      const row = selectPivotRow(tableau, col);
      if (row === null) throw new Error('Problema no acotado en fase 1');
      pivot(tableau, row, col);
      iter1++;
      steps.push({
        phase: 1,
        iteration: iter1,
        tableau: tableau.map((fila) => [...fila])
      });
    }

    // Verificar factibilidad: valor de Z fase 1
    const phase1Val = tableau[tableau.length - 1][tableau[0].length - 1];
    if (Math.abs(phase1Val) > 1e-6) {
      throw new Error('El problema es infactible (fase 1)');
    }

    // --- Fase 2 ---
    const phase2Tableau = toPhase2(tableau, c, numSlack, numArt);

    // Tabla inicial fase 2 (iteración 0)
    steps.push({
      phase: 2,
      iteration: 0,
      tableau: phase2Tableau.map((fila) => [...fila])
    });

    let iter2 = 0;
    let T2 = phase2Tableau;
    while (!isOptimal(T2)) {
      const col = selectPivotColumn(T2);
      if (col === null) throw new Error('Problema no acotado en fase 2');
      const row = selectPivotRow(T2, col);
      if (row === null) throw new Error('Problema no acotado en fase 2');
      pivot(T2, row, col);
      iter2++;
      steps.push({
        phase: 2,
        iteration: iter2,
        tableau: T2.map((fila) => [...fila])
      });
    }

    // Leer solución óptima fase 2
    const sol = readSolution(T2, c.length);
    const opt = T2[T2.length - 1][T2[0].length - 1];

    return {
      steps,
      solution: { optValue: opt, sol },
      numSlack,
      numArt
    };
  }

  // --- Construir tabla inicial con slacks y artificiales ---
  function buildTableau(c, constraints) {
    const m = constraints.length;
    let countSlack = 0,
      countArt = 0;
    constraints.forEach(({ ineq }) => {
      if (ineq === '<=') countSlack++;
      else if (ineq === '>=') {
        countSlack++;
        countArt++;
      } else {
        countArt++;
      }
    });
    const totalCols = c.length + countSlack + countArt + 1;
    const T = Array(m + 1)
      .fill(null)
      .map(() => Array(totalCols).fill(0));

    // Copiar LHS y RHS
    constraints.forEach(({ lhs, rhs }, i) => {
      lhs.forEach((v, j) => {
        T[i][j] = v;
      });
      T[i][totalCols - 1] = rhs;
    });

    // Agregar slacks y artificiales
    let s = 0,
      a = 0;
    constraints.forEach(({ ineq }, i) => {
      if (ineq === '<=') {
        T[i][c.length + s] = 1;
        s++;
      } else if (ineq === '>=') {
        T[i][c.length + s] = -1;
        s++;
        T[i][c.length + countSlack + a] = 1;
        T[m][c.length + countSlack + a] = -1; // coef artificial en función objetivo fase 1
        a++;
      } else {
        // igualdad "="
        T[i][c.length + countSlack + a] = 1;
        T[m][c.length + countSlack + a] = -1; // coef artificial en fase 1
        a++;
      }
    });

    return { tableau: T, numSlack: countSlack, numArt: countArt };
  }

  // --- Convertir tabla de fase 1 a fase 2 (eliminar columnas artificiales) ---
  function toPhase2(T, c, numSlack, numArt) {
    const m = T.length - 1;
    const n = T[0].length;
    // Columnas a mantener: 0..(n - numArt - 1) más la última columna RHS (índice n-1)
    const keep = [...Array(n - numArt).keys(), n - 1];
    const P = T.slice(0, m).map((fila) => keep.map((j) => fila[j]));
    // Reconstruir la fila Z en fase 2
    const objRow = Array(P[0].length).fill(0);
    c.forEach((v, i) => {
      objRow[i] = -v;
    });
    P.push(objRow);
    return P;
  }

  function isOptimal(T) {
    return T[T.length - 1]
      .slice(0, -1)
      .every((val) => val >= -1e-6);
  }

  function selectPivotColumn(T) {
    const lastRow = T[T.length - 1].slice(0, -1);
    const minVal = Math.min(...lastRow);
    return minVal < -1e-6 ? lastRow.indexOf(minVal) : null;
  }

  function selectPivotRow(T, col) {
    const ratios = T.slice(0, -1).map((r) => {
      const a = r[col],
        b = r[r.length - 1];
      return a > 0 ? b / a : Infinity;
    });
    const minRatio = Math.min(...ratios);
    return isFinite(minRatio) ? ratios.indexOf(minRatio) : null;
  }

  function pivot(T, pr, pc) {
    const pv = T[pr][pc];
    // Dividir fila pivote
    T[pr] = T[pr].map((v) => v / pv);
    // Restar múltiplos de la fila pivote a las demás
    T.forEach((fila, i) => {
      if (i !== pr) {
        const factor = fila[pc];
        T[i] = fila.map((v, j) => v - factor * T[pr][j]);
      }
    });
  }

  function readSolution(T, nVars) {
    const sol = Array(nVars).fill(0);
    for (let j = 0; j < nVars; j++) {
      const col = T.slice(0, -1).map((r) => r[j]);
      // Verificar si es columna básica: un 1 y ceros
      if (
        col.filter((v) => Math.abs(v - 1) < 1e-6).length === 1 &&
        col.filter((v) => Math.abs(v) > 1e-6).length === 1
      ) {
        const iBasic = col.findIndex((v) => Math.abs(v - 1) < 1e-6);
        sol[j] = T[iBasic][T[0].length - 1];
      }
    }
    return sol;
  }

  // --- Helpers para generar cabeceras y etiquetas de filas ---
  function getHeaders(phase, originalVars, numSlack, numArt) {
    const headers = [];
    // Variables x1..x_originalVars
    for (let i = 1; i <= originalVars; i++) {
      headers.push(`x${i}`);
    }
    // Holguras s1..s_numSlack
    for (let i = 1; i <= numSlack; i++) {
      headers.push(`s${i}`);
    }
    // Artificiales a1..a_numArt (solo en fase 1)
    if (phase === 1) {
      for (let i = 1; i <= numArt; i++) {
        headers.push(`a${i}`);
      }
    }
    // Finalmente RHS
    headers.push('RHS');
    return headers;
  }

  function getRowLabels(tableau) {
    const filas = tableau.length;
    const labels = [];
    for (let i = 0; i < filas; i++) {
      labels.push(i === filas - 1 ? 'Z' : `F${i + 1}`);
    }
    return labels;
  }

  // Mantener scroll al final cuando cambien las tablas
  useEffect(() => {
    if (step === 2 && textAreaRef.current) {
      textAreaRef.current.scrollTop = textAreaRef.current.scrollHeight;
    }
  }, [stepsData, step]);

  return (
    <Container maxWidth="lg" sx={{ my: 4 }}>
      <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
        <Typography variant="h4" gutterBottom sx={{ color: 'primary.main', mb: 4 }}>
          Método Simplex
        </Typography>

        {/* Modal para mostrar solución óptima */}
        <Dialog
          open={showResultModal}
          onClose={() => setShowResultModal(false)}
          maxWidth="md"
          fullWidth
        >
          <DialogTitle sx={{ bgcolor: 'primary.main', color: 'white' }}>
            🎉 Solución Óptima Encontrada
          </DialogTitle>
          <DialogContent sx={{ pt: 3 }}>
            <Box
              sx={{
                fontFamily: 'monospace',
                whiteSpace: 'pre-wrap',
                p: 2,
                bgcolor: '#f5f5f5',
                borderRadius: 1,
                fontSize: '0.9rem'
              }}
            >
              Valor óptimo: {optimalSolution.optValue.toFixed(2)}
              {'\n'}
              {optimalSolution.sol.map((v, i) => `x${i + 1} = ${v.toFixed(2)}`).join('\n')}
            </Box>
          </DialogContent>
          <DialogActions>
            <Button
              onClick={() => setShowResultModal(false)}
              variant="contained"
              color="primary"
              sx={{ mb: 2, mr: 2 }}
            >
              Cerrar
            </Button>
          </DialogActions>
        </Dialog>

        {/* == STEP 0: Configuración inicial == */}
        {step === 0 && (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            <Typography variant="h6">Descripción del problema</Typography>
            <TextField
              label="Escribe aquí el enunciado o problema"
              multiline
              minRows={3}
              fullWidth
              value={problemDesc}
              onChange={(e) => setProblemDesc(e.target.value)}
            />

            <Typography variant="h6">Configuración de variables y restricciones</Typography>
            <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 3 }}>
              <TextField
                label="Número de variables"
                type="number"
                variant="outlined"
                value={numVars}
                onChange={(e) => setNumVars(Number(e.target.value))}
                InputProps={{ inputProps: { min: 1 } }}
                fullWidth
              />
              <TextField
                label="Número de restricciones"
                type="number"
                variant="outlined"
                value={numRes}
                onChange={(e) => setNumRes(Number(e.target.value))}
                InputProps={{ inputProps: { min: 1 } }}
                fullWidth
              />
            </Box>

            <Button
              variant="contained"
              size="large"
              onClick={initTable}
              endIcon={<ChevronRight />}
              disabled={numVars <= 0 || numRes <= 0}
              sx={{ alignSelf: 'flex-end' }}
            >
              Continuar
            </Button>
          </Box>
        )}

        {/* == STEP 1: Ingresar coeficientes == */}
        {step === 1 && (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <Button
              variant="outlined"
              startIcon={<ChevronLeft />}
              onClick={() => setStep(0)}
              sx={{ alignSelf: 'flex-start' }}
            >
              Volver
            </Button>

            <Box>
              <Typography variant="h6" gutterBottom>
                Función objetivo (Maximizar Z)
              </Typography>
              <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                {objective.map((val, i) => (
                  <TextField
                    key={i}
                    label={`x${i + 1}`}
                    variant="outlined"
                    value={val}
                    onChange={(e) => {
                      const o = [...objective];
                      o[i] = e.target.value;
                      setObjective(o);
                    }}
                    sx={{ width: 100 }}
                    InputLabelProps={{ shrink: true }}
                  />
                ))}
              </Box>
            </Box>

            <Box>
              <Typography variant="h6" gutterBottom>
                Restricciones
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                {constraints.map((row, i) => (
                  <Box
                    key={i}
                    sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'center' }}
                  >
                    {row.slice(0, -1).map((v, j) => (
                      <TextField
                        key={`${i}-${j}`}
                        label={`x${j + 1}`}
                        variant="outlined"
                        value={constraints[i][j]}
                        onChange={(e) => {
                          const C = constraints.map((r) => [...r]);
                          C[i][j] = e.target.value;
                          setConstraints(C);
                        }}
                        sx={{ width: 100 }}
                        InputLabelProps={{ shrink: true }}
                      />
                    ))}

                    <Select
                      value={inequalities[i]}
                      onChange={(e) => {
                        const I = [...inequalities];
                        I[i] = e.target.value;
                        setInequalities(I);
                      }}
                      sx={{ minWidth: 80 }}
                    >
                      <MenuItem value="<=">≤</MenuItem>
                      <MenuItem value=">=">≥</MenuItem>
                      <MenuItem value="=">=</MenuItem>
                    </Select>

                    <TextField
                      label="Valor"
                      variant="outlined"
                      value={constraints[i][row.length - 1]}
                      onChange={(e) => {
                        const C = constraints.map((r) => [...r]);
                        C[i][row.length - 1] = e.target.value;
                        setConstraints(C);
                      }}
                      sx={{ width: 120 }}
                      InputLabelProps={{ shrink: true }}
                    />
                  </Box>
                ))}
              </Box>
            </Box>

            <Button
              variant="contained"
              size="large"
              onClick={handleSolve}
              sx={{ alignSelf: 'flex-end' }}
            >
              Resolver
            </Button>
          </Box>
        )}

        {/* == STEP 2: Mostrar iteraciones, resultado en modal y resultado fijo abajo == */}
        {step === 2 && (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            {/* Botones: Volver a editar (mantiene datos) o Nuevo Problema (reinicia todo) */}
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Button
                variant="outlined"
                startIcon={<ChevronLeft />}
                onClick={() => setStep(1)}
              >
                Volver a editar
              </Button>
              <Button
                variant="outlined"
                startIcon={<RestartAlt />}
                onClick={() => {
                  setStep(0);
                  setStepsData([]);
                  setShowResultModal(false);
                }}
              >
                Nuevo Problema
              </Button>
            </Box>

            <Typography variant="h6">Proceso completo de solución</Typography>

            <Paper
              variant="outlined"
              sx={{
                p: 2,
                maxHeight: 550,
                overflowY: 'auto',
                fontFamily: 'monospace'
              }}
              ref={textAreaRef}
            >
              {stepsData.map((item, idx) => {
                const headers = getHeaders(
                  item.phase,
                  originalVars,
                  numSlack,
                  numArt
                );
                const rowLabels = getRowLabels(item.tableau);
                return (
                  <Tableau
                    key={idx}
                    phase={item.phase}
                    iteration={item.iteration}
                    headers={headers}
                    rowLabels={rowLabels}
                    data={item.tableau}
                  />
                );
              })}
            </Paper>

            {/* Mostrar solución óptima debajo de las tablas, siempre visible */}
            <Box sx={{ mt: 2, p: 2, bgcolor: '#e8f5e9', borderRadius: 1 }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 1 }}>
                🏁 Solución Óptima
              </Typography>
              <Box sx={{ fontFamily: 'monospace', whiteSpace: 'pre-wrap' }}>
                Valor óptimo: {optimalSolution.optValue.toFixed(2)}
                {'\n'}
                {optimalSolution.sol.map((v, i) => `x${i + 1} = ${v.toFixed(2)}`).join('\n')}
              </Box>
            </Box>
          </Box>
        )}
      </Paper>
    </Container>
  );
}
