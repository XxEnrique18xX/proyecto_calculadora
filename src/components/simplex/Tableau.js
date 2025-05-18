// src/Tableau.js
import React from 'react';
import {
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Typography,
  Box
} from '@mui/material';

/**
 * <Tableau />
 *
 * Props esperados:
 *   - phase: número de fase (1 o 2).
 *   - iteration: número de iteración (0 = tabla inicial; 1,2,... para cada iteración).
 *   - headers:    array de strings con los nombres de columnas (ej: ['x1', 'x2', 's1', 'a1', 'RHS']).
 *   - rowLabels:  array de strings con etiquetas de filas (ej: ['F1', 'F2', 'Z']).
 *   - data:       matriz bidimensional (array de arrays) de números: cada fila es un array de floats.
 *
 * Retorna una tabla MUI con encabezados, etiquetas de fila y valores formateados a 2 decimales.
 */
export default function Tableau({ phase, iteration, headers, rowLabels, data }) {
  return (
    <Box sx={{ mb: 4 }}>
      <Typography variant="subtitle1" sx={{ fontFamily: 'monospace', mb: 1 }}>
        {phase === 1 ? 'FASE 1' : 'FASE 2'} – Iteración {iteration}
      </Typography>
      <Table size="small" sx={{ border: 1, borderColor: 'grey.300' }}>
        <TableHead>
          <TableRow>
            <TableCell sx={{ fontWeight: 'bold', bgcolor: 'grey.100' }}></TableCell>
            {headers.map((h, idx) => (
              <TableCell
                key={idx}
                align="right"
                sx={{ fontWeight: 'bold', bgcolor: 'grey.100', fontFamily: 'monospace', p: 1 }}
              >
                {h}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((row, i) => (
            <TableRow key={i}>
              <TableCell
                component="th"
                scope="row"
                sx={{ fontFamily: 'monospace', p: 1, bgcolor: 'grey.50', fontWeight: 'medium' }}
              >
                {rowLabels[i]}
              </TableCell>
              {row.map((val, j) => {
                const formatted = Math.abs(val) < 1e-6 ? '0.00' : val.toFixed(2);
                return (
                  <TableCell
                    key={j}
                    align="right"
                    sx={{ fontFamily: 'monospace', p: 1 }}
                  >
                    {formatted}
                  </TableCell>
                );
              })}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Box>
  );
}
