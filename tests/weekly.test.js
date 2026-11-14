import { test } from 'node:test';
import assert from 'node:assert';

// Feature 002 - Objetivo Semanal de Estudio (T1 - Fase Red).
// Pruebas unitarias para la logica pura de semana ISO 8601 y suma de
// minutos de la semana actual. Quedan en Red hasta que js/weekly.js
// exponga las funciones de calculo.

import { getISOWeekStartKey, getWeeklyTotal, getCurrentWeekTotal, getWeeklyGoalMinutes, setWeeklyGoalMinutes, isWeeklyGoalAchieved, isWeekGoalAchieved, isCurrentWeekGoalAchieved, trackWeeklyGoalAchievement, getWeeklyGoalStatusText } from '../js/weekly.js';

test('getISOWeekStartKey retorna el lunes inicio de la semana ISO', () => {
  // 2026-11-12 es jueves y 2026-11-15 es domingo: misma semana, empieza el lunes.
  assert.strictEqual(getISOWeekStartKey('2026-11-12'), '2026-11-09');
  assert.strictEqual(getISOWeekStartKey('2026-11-15'), '2026-11-09');
});

test('getISOWeekStartKey calcula el lunes del primer periodo ISO del ano', () => {
  // 2026-01-01 es jueves (primer jueves del ano 2026): semana 1 empieza el 2025-12-29.
  assert.strictEqual(getISOWeekStartKey('2026-01-01'), '2025-12-29');
});

test('getWeeklyTotal suma los minutos de las sesiones dentro de la semana indicada', () => {
  const sessions = [
    { fecha: '2026-11-09', minutos: 30 },
    { fecha: '2026-11-12', minutos: 45 },
  ];

  assert.strictEqual(getWeeklyTotal(sessions, '2026-11-09'), 75);
});

test('getCurrentWeekTotal suma los minutos de la semana actual', () => {
  const sessions = [
    { fecha: '2026-11-09', minutos: 30 },
    { fecha: '2026-11-12', minutos: 45 },
  ];

  assert.strictEqual(getCurrentWeekTotal(sessions, '2026-11-12'), 75);
});

test('getCurrentWeekTotal retorna 0 cuando la semana actual no tiene sesiones', () => {
  const sessions = [
    { fecha: '2026-11-01', minutos: 30 },
  ];

  assert.strictEqual(getCurrentWeekTotal(sessions, '2026-11-12'), 0);
});

test('getWeeklyTotal excluye las sesiones con fecha futura del calculo', () => {
  const sessions = [
    { fecha: '2026-11-09', minutos: 30 },
    { fecha: '2026-11-12', minutos: 45 },
    { fecha: '2026-11-13', minutos: 60 },
    { fecha: '2026-11-15', minutos: 90 },
  ];

  // Hoy es 2026-11-12: la sesion del 2026-11-13 y del 2026-11-15 son futuras
  // y no deben sumarse a la semana iniciada el 2026-11-09.
  assert.strictEqual(getWeeklyTotal(sessions, '2026-11-09', '2026-11-12'), 75);
});

test('getCurrentWeekTotal no suma al total las sesiones con fecha futura', () => {
  const sessions = [
    { fecha: '2026-11-09', minutos: 30 },
    { fecha: '2026-11-12', minutos: 45 },
    { fecha: '2026-11-13', minutos: 60 },
  ];

  assert.strictEqual(getCurrentWeekTotal(sessions, '2026-11-12'), 75);
});

// Feature 002 - Objetivo Semanal de Estudio (T3 - Fase Red).
// Pruebas unitarias para la persistencia del objetivo semanal en el registro
// (`diario-estudio-v1`). Quedan en Red hasta que js/weekly.js exponga las
// funciones de objetivo y registro.

test('getWeeklyGoalMinutes retorna null cuando el registro no tiene objetivo', () => {
  assert.strictEqual(getWeeklyGoalMinutes({ sessions: [] }), null);
});

test('getWeeklyGoalMinutes retorna el objetivo en minutos configurado', () => {
  assert.strictEqual(getWeeklyGoalMinutes({ sessions: [], weeklyGoal: 120 }), 120);
});

test('setWeeklyGoalMinutes persiste el objetivo en el registro', () => {
  const record = setWeeklyGoalMinutes({ sessions: [], weeklyGoal: null }, 120);

  assert.deepStrictEqual(record, { sessions: [], weeklyGoal: 120 });
});

test('setWeeklyGoalMinutes ignora objetivos invalidos y no altera el registro', () => {
  const record = { sessions: [], weeklyGoal: null };

  assert.deepStrictEqual(setWeeklyGoalMinutes(record, 0), record);
  assert.deepStrictEqual(setWeeklyGoalMinutes(record, -5), record);
  assert.deepStrictEqual(setWeeklyGoalMinutes(record, Number.NaN), record);
});

// Feature 002 - Objetivo Semanal de Estudio (T4 - Fase Red).
// Pruebas unitarias para la comparacion del total semanal contra el objetivo
// y el reporte de logro (AC-001, AC-002). Quedan en Red hasta que
// js/weekly.js exponga la funcion de comparacion.

test('AC-001: meta 120 con total 150 se considera logrado', () => {
  assert.strictEqual(isWeeklyGoalAchieved(120, 150), true);
});

test('AC-002: meta 120 con total 60 no se considera logrado', () => {
  assert.strictEqual(isWeeklyGoalAchieved(120, 60), false);
});

test('isWeeklyGoalAchieved marca como logrado cuando el total alcanza el objetivo', () => {
  // Regla de comparacion: totalSemanal >= objetivoSemanal.
  assert.strictEqual(isWeeklyGoalAchieved(120, 120), true);
});

test('isWeeklyGoalAchieved retorna false cuando no hay objetivo configurado', () => {
  assert.strictEqual(isWeeklyGoalAchieved(null, 150), false);
});

// Feature 002 - Objetivo Semanal de Estudio (T5 - Fase Red).
// Pruebas unitarias para el tracking del logro semanal por ISO week
// (FR-005 / AC-003). Quedan en Red hasta que js/weekly.js exponga las
// funciones de seguimiento de logro por semana.

test('AC-003: la semana actual se marca como lograda cuando el total alcanza el objetivo', () => {
  const record = {
    sessions: [
      { fecha: '2026-11-09', minutos: 60 },
      { fecha: '2026-11-12', minutos: 60 },
    ],
    weeklyGoal: 120,
  };

  assert.strictEqual(isCurrentWeekGoalAchieved(record, '2026-11-12'), true);
});

test('AC-003: la semana actual no se marca como lograda cuando el total no alcanza el objetivo', () => {
  const record = {
    sessions: [
      { fecha: '2026-11-09', minutos: 30 },
    ],
    weeklyGoal: 120,
  };

  assert.strictEqual(isCurrentWeekGoalAchieved(record, '2026-11-12'), false);
});

test('isCurrentWeekGoalAchieved retorna false cuando no hay objetivo configurado', () => {
  const record = { sessions: [], weeklyGoal: null };

  assert.strictEqual(isCurrentWeekGoalAchieved(record, '2026-11-12'), false);
});

test('isWeekGoalAchieved marca la semana ISO como lograda cuando el total alcanza el objetivo', () => {
  const record = {
    sessions: [
      { fecha: '2026-11-09', minutos: 120 },
    ],
    weeklyGoal: 120,
  };

  assert.strictEqual(isWeekGoalAchieved(record, '2026-11-09', '2026-11-12'), true);
});

test('AC-003: trackWeeklyGoalAchievement marca la semana actual como lograda en el registro', () => {
  const record = {
    sessions: [
      { fecha: '2026-11-09', minutos: 60 },
      { fecha: '2026-11-12', minutos: 60 },
    ],
    weeklyGoal: 120,
  };

  const updated = trackWeeklyGoalAchievement(record, '2026-11-12');

  assert.strictEqual(updated.weeklyAchievements['2026-11-09'], true);
});

test('AC-003: trackWeeklyGoalAchievement marca la semana actual como NO lograda en el registro cuando el total no alcanza el objetivo', () => {
  const record = {
    sessions: [
      { fecha: '2026-11-09', minutos: 30 },
    ],
    weeklyGoal: 120,
  };

  const updated = trackWeeklyGoalAchievement(record, '2026-11-12');

  assert.strictEqual(updated.weeklyAchievements['2026-11-09'], false);
});

test('trackWeeklyGoalAchievement acepta una ISO week objetivo para evaluar el logro', () => {
  const record = {
    sessions: [
      { fecha: '2026-11-09', minutos: 120 },
    ],
    weeklyGoal: 120,
  };

  const updated = trackWeeklyGoalAchievement(record, '2026-11-12', '2026-11-09');

  assert.strictEqual(updated.weeklyAchievements['2026-11-09'], true);
});

test('trackWeeklyGoalAchievement mantiene los logros de otras semanas ISO', () => {
  const first = trackWeeklyGoalAchievement(
    { sessions: [{ fecha: '2026-11-02', minutos: 60 }], weeklyGoal: 60 },
    '2026-11-12',
    '2026-11-02'
  );

  assert.strictEqual(first.weeklyAchievements['2026-11-02'], true);

  const second = trackWeeklyGoalAchievement(
    { sessions: [{ fecha: '2026-11-09', minutos: 60 }], weeklyGoal: 60, weeklyAchievements: first.weeklyAchievements },
    '2026-11-12',
    '2026-11-09'
  );

  assert.strictEqual(second.weeklyAchievements['2026-11-02'], true);
  assert.strictEqual(second.weeklyAchievements['2026-11-09'], true);
});

test('trackWeeklyGoalAchievement recalcula el flag de logro cuando cambia la meta', () => {
  let record = {
    sessions: [
      { fecha: '2026-11-09', minutos: 60 },
    ],
    weeklyGoal: 60,
  };

  let updated = trackWeeklyGoalAchievement(record, '2026-11-12');
  assert.strictEqual(updated.weeklyAchievements['2026-11-09'], true);

  record = setWeeklyGoalMinutes(record, 120);
  updated = trackWeeklyGoalAchievement(record, '2026-11-12');

  assert.strictEqual(updated.weeklyAchievements['2026-11-09'], false);
});

test('Regresión FR-005/AC-003: al eliminar una sesión que hacía cumplir el objetivo, el logro semanal de la semana actual queda en false', () => {
  const record = trackWeeklyGoalAchievement({
    sessions: [
      { id: 'a', fecha: '2026-11-09', minutos: 60 },
      { id: 'b', fecha: '2026-11-12', minutos: 60 },
    ],
    weeklyGoal: 120,
    weeklyAchievements: {},
  }, '2026-11-12');

  assert.strictEqual(record.weeklyAchievements['2026-11-09'], true);

  const updated = trackWeeklyGoalAchievement({
    ...record,
    sessions: record.sessions.filter((session) => session.id !== 'b'),
  }, '2026-11-12');

  assert.strictEqual(updated.weeklyAchievements['2026-11-09'], false);
});

// Feature 002 - Objetivo Semanal de Estudio (T8 - HU-003).
// UI debe informar si el objetivo semanal fue alcanzado con texto en español.

test('getWeeklyGoalStatusText informa que el objetivo fue alcanzado', () => {
  assert.strictEqual(getWeeklyGoalStatusText(120, 150), 'Objetivo semanal alcanzado.');
});

test('getWeeklyGoalStatusText informa que el objetivo no fue alcanzado', () => {
  assert.strictEqual(getWeeklyGoalStatusText(120, 60), 'Objetivo semanal no alcanzado.');
});

test('getWeeklyGoalStatusText retorna cadena vacia cuando no hay objetivo configurado', () => {
  assert.strictEqual(getWeeklyGoalStatusText(null, 60), '');
});
