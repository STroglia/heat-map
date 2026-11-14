'use strict';

function toKey(year, month, day) {
  const mm = String(month).padStart(2, '0');
  const dd = String(day).padStart(2, '0');
  return `${year}-${mm}-${dd}`;
}

export function getISOWeekStartKey(dateKey) {
  const [year, month, day] = dateKey.split('-').map(Number);
  const date = new Date(year, month - 1, day);
  const weekday = (date.getDay() + 6) % 7;
  const monday = new Date(date);
  monday.setDate(date.getDate() - weekday);
  return toKey(monday.getFullYear(), monday.getMonth() + 1, monday.getDate());
}

function addDaysKey(key, days) {
  const [year, month, day] = key.split('-').map(Number);
  const date = new Date(year, month - 1, day);
  date.setDate(date.getDate() + days);
  return toKey(date.getFullYear(), date.getMonth() + 1, date.getDate());
}

export function getWeeklyTotal(sessions, weekStartKey, todayKey) {
  const weekEndKey = addDaysKey(weekStartKey, 6);
  const horizon = todayKey || weekEndKey;
  let total = 0;

  for (const session of sessions) {
    if (!session || !session.fecha) {
      continue;
    }

    // Descarta sesiones con fecha futura (posterior al horizonte de cierre).
    if (session.fecha > horizon) {
      continue;
    }

    if (session.fecha < weekStartKey || session.fecha > weekEndKey) {
      continue;
    }

    const minutos = Number(session.minutos);
    if (!Number.isFinite(minutos)) {
      continue;
    }

    total += minutos;
  }

  return total;
}

export function getCurrentWeekTotal(sessions, todayKey) {
  const weekStartKey = getISOWeekStartKey(todayKey);
  return getWeeklyTotal(sessions, weekStartKey, todayKey);
}

export function getWeeklyGoalMinutes(record) {
  const goal = record ? Number(record.weeklyGoal) : Number.NaN;
  if (!Number.isFinite(goal) || goal < 1) {
    return null;
  }
  return goal;
}

export function setWeeklyGoalMinutes(record, minutes) {
  const value = Number(minutes);
  if (!Number.isFinite(value) || value < 1) {
    return record;
  }
  return { ...record, weeklyGoal: value };
}

export function isWeeklyGoalAchieved(weeklyGoal, weeklyTotal) {
  const goal = Number(weeklyGoal);
  const total = Number(weeklyTotal);

  // Sin objetivo configurado no hay nada que comparar.
  if (!Number.isFinite(goal) || goal < 1) {
    return false;
  }

  if (!Number.isFinite(total) || total < 0) {
    return false;
  }

  // Regla de comparacion: el objetivo semanal se logra cuando totalSemanal >= objetivoSemanal.
  return total >= goal;
}

export function isWeekGoalAchieved(record, weekStartKey, todayKey) {
  const weeklyGoal = getWeeklyGoalMinutes(record);
  const weeklyTotal = getWeeklyTotal(record ? record.sessions : [], weekStartKey, todayKey);

  // Reusa la comparacion del logro semanal (FR-004 / T4) para la ISO week indicada.
  return isWeeklyGoalAchieved(weeklyGoal, weeklyTotal);
}

export function isCurrentWeekGoalAchieved(record, todayKey) {
  const weekStartKey = getISOWeekStartKey(todayKey);
  return isWeekGoalAchieved(record, weekStartKey, todayKey);
}

export function trackWeeklyGoalAchievement(record, todayKey, weekStartKey) {
  const safeRecord = record || { sessions: [] };
  const key = weekStartKey || getISOWeekStartKey(todayKey);
  const achieved = isWeekGoalAchieved(safeRecord, key, todayKey);
  const weeklyAchievements = { ...(safeRecord.weeklyAchievements || {}) };

  // FR-005: persistir logrado/no logrado (true/false) por ISO week evaluada.
  weeklyAchievements[key] = achieved;

  return { ...safeRecord, weeklyAchievements };
}

export function getWeeklyGoalStatusText(weeklyGoal, weeklyTotal) {
  const goal = Number(weeklyGoal);
  if (!Number.isFinite(goal) || goal < 1) {
    return '';
  }

  return isWeeklyGoalAchieved(weeklyGoal, weeklyTotal)
    ? 'Objetivo semanal alcanzado.'
    : 'Objetivo semanal no alcanzado.';
}
