'use strict';

export function getDailyTotals(sessions) {
  const totals = new Map();

  for (const session of sessions) {
    if (!session || !session.fecha) {
      continue;
    }

    const minutos = Number(session.minutos);
    if (!Number.isFinite(minutos)) {
      continue;
    }

    const acumulado = totals.get(session.fecha) || 0;
    totals.set(session.fecha, acumulado + minutos);
  }

  return totals;
}

export function getIntensityLevel(minutos) {
  const total = Number(minutos) || 0;

  if (total <= 0) {
    return 0;
  }
  if (total <= 30) {
    return 1;
  }
  if (total <= 60) {
    return 2;
  }
  if (total <= 120) {
    return 3;
  }
  return 4;
}
