import { test } from 'node:test';
import assert from 'node:assert';

// Feature 001 - Heat Map de Dias Estudiados (TDD - Fase Red).
// Pruebas unitarias para la logica pura del mapa de calor y la suma de
// minutos por dia. Quedan en Red hasta que la implementacion exponga las
// funciones de calculo en js/heatmap.js.

import { getDailyTotals, getIntensityLevel } from '../js/heatmap.js';

test('getDailyTotals suma los minutos de las sesiones del mismo dia calendario', () => {
  const sessions = [
    { fecha: '2026-11-01', minutos: 30 },
    { fecha: '2026-11-01', minutos: 20 },
    { fecha: '2026-11-02', minutos: 45 },
  ];

  const totals = getDailyTotals(sessions);

  assert.ok(totals instanceof Map);
  assert.strictEqual(totals.get('2026-11-01'), 50);
  assert.strictEqual(totals.get('2026-11-02'), 45);
});

test('getDailyTotals retorna un mapa vacio cuando no hay sesiones', () => {
  const totals = getDailyTotals([]);

  assert.ok(totals instanceof Map);
  assert.strictEqual(totals.size, 0);
});

test('getIntensityLevel asigna el nivel correcto segun los umbrales fijos', () => {
  assert.strictEqual(getIntensityLevel(0), 0);
  assert.strictEqual(getIntensityLevel(30), 1);
  assert.strictEqual(getIntensityLevel(31), 2);
  assert.strictEqual(getIntensityLevel(60), 2);
  assert.strictEqual(getIntensityLevel(61), 3);
  assert.strictEqual(getIntensityLevel(120), 3);
  assert.strictEqual(getIntensityLevel(121), 4);
});
