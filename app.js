import { getDailyTotals, getIntensityLevel } from './js/heatmap.js';

'use strict';

const STORAGE_KEY = 'diario-estudio-v1';

const form = document.getElementById('sessionForm');
const fechaInput = document.getElementById('fecha');
const materiaInput = document.getElementById('materia');
const temaInput = document.getElementById('tema');
const minutosInput = document.getElementById('minutos');
const historyList = document.getElementById('historyList');
const historyEmpty = document.getElementById('historyEmpty');
const historyCount = document.getElementById('historyCount');
const streakValue = document.getElementById('streakValue');

/* ---------- Utilidades de fecha (zona horaria local, sin errores UTC) */

function toKey(year, month, day) {
  const mm = String(month).padStart(2, '0');
  const dd = String(day).padStart(2, '0');
  return `${year}-${mm}-${dd}`;
}

function todayKey() {
  const now = new Date();
  return toKey(now.getFullYear(), now.getMonth() + 1, now.getDate());
}

function shiftKey(key, days) {
  const [year, month, day] = key.split('-').map(Number);
  const date = new Date(year, month - 1, day);
  date.setDate(date.getDate() + days);
  return toKey(date.getFullYear(), date.getMonth() + 1, date.getDate());
}

function formatDateLong(key) {
  const [year, month, day] = key.split('-').map(Number);
  const date = new Date(year, month - 1, day);
  return new Intl.DateTimeFormat('es-ES', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(date);
}

/* ---------- Persistencia en localStorage ---------- */

function loadSessions() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const data = raw ? JSON.parse(raw) : [];
    return Array.isArray(data) ? data : [];
  } catch (error) {
    return [];
  }
}

function saveSessions(sessions) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(sessions));
}

function createSession({ fecha, materia, tema, minutos }) {
  const id = `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 9)}`;
  return {
    id,
    fecha,
    materia: materia.trim(),
    tema: tema.trim(),
    minutos,
    createdAt: Date.now(),
  };
}

function deleteSession(id) {
  const sessions = loadSessions().filter((session) => session.id !== id);
  saveSessions(sessions);
}

/* ---------- Cálculo de la racha ---------- */

function calculateStreak(sessions) {
  const today = todayKey();
  const activeDays = new Set();

  for (const session of sessions) {
    if (session && session.fecha && session.fecha <= today) {
      activeDays.add(session.fecha);
    }
  }

  let cursor = activeDays.has(today) ? today : shiftKey(today, -1);

  if (!activeDays.has(cursor)) {
    return 0;
  }

  let streak = 0;
  while (activeDays.has(cursor)) {
    streak += 1;
    cursor = shiftKey(cursor, -1);
  }

  return streak;
}

/* ---------- Render ---------- */

function sortedSessions(sessions) {
  return [...sessions].sort((a, b) => {
    if (a.fecha !== b.fecha) {
      return a.fecha < b.fecha ? 1 : -1;
    }
    return b.createdAt - a.createdAt;
  });
}

function renderStreak() {
  const streak = calculateStreak(loadSessions());
  streakValue.textContent = streak;
}

function renderHeatMap() {
  const container = document.getElementById('heatmap');
  if (!container) {
    return;
  }

  const sessions = loadSessions();
  const totals = getDailyTotals(sessions);
  const today = todayKey();

  container.innerHTML = '';

  const weeks = new Map();

  for (let offset = 364; offset >= 0; offset -= 1) {
    const key = shiftKey(today, -offset);
    const date = new Date(Number(key.slice(0, 4)), Number(key.slice(5, 7)) - 1, Number(key.slice(8, 10)));
    const weekday = (date.getDay() + 6) % 7;
    const weekStart = shiftKey(key, -weekday);

    if (!weeks.has(weekStart)) {
      weeks.set(weekStart, []);
    }
    weeks.get(weekStart).push(key);
  }

  const sortedWeeks = [...weeks.keys()].sort();

  for (const weekStart of sortedWeeks) {
    const days = weeks.get(weekStart);
    for (const dayKey of days) {
      const level = getIntensityLevel(totals.get(dayKey) || 0);
      const cell = document.createElement('span');
      cell.className = `heatmap__cell heatmap__cell--level-${level}`;
      cell.setAttribute('data-date', dayKey);
      cell.setAttribute('title', dayKey);
      container.appendChild(cell);
    }
  }
}

function renderAll() {
  renderHistory();
  renderStreak();
  renderHeatMap();
}

function renderHistory() {
  const sessions = sortedSessions(loadSessions());

  historyList.innerHTML = '';

  historyEmpty.style.display = sessions.length > 0 ? 'none' : 'block';
  historyCount.textContent =
    sessions.length > 0
      ? `${sessions.length} ${sessions.length === 1 ? 'sesión registrada' : 'sesiones registradas'}`
      : '';

  for (const session of sessions) {
    const item = document.createElement('li');
    item.className = 'history__item';

    const date = document.createElement('span');
    date.className = 'history__date';
    date.textContent = formatDateLong(session.fecha);

    const info = document.createElement('div');
    info.className = 'history__info';

    const materia = document.createElement('span');
    materia.className = 'history__materia';
    materia.textContent = session.materia;

    const tema = document.createElement('span');
    tema.className = 'history__tema';
    tema.textContent = `Tema: ${session.tema}`;

    info.append(materia, tema);

    const minutes = document.createElement('span');
    minutes.className = 'history__minutos';
    minutes.textContent = `${session.minutos} min`;

    const deleteButton = document.createElement('button');
    deleteButton.type = 'button';
    deleteButton.className = 'history__delete';
    deleteButton.setAttribute('aria-label', `Eliminar sesión de ${session.materia}`);
    deleteButton.textContent = '✕';

    deleteButton.addEventListener('click', () => {
      deleteSession(session.id);
      renderAll();
    });

    item.append(date, info, minutes, deleteButton);
    historyList.appendChild(item);
  }
}

/* ---------- Evento del formulario ---------- */

form.addEventListener('submit', (event) => {
  event.preventDefault();

  const fecha = fechaInput.value;
  const materia = materiaInput.value.trim();
  const tema = temaInput.value.trim();
  const minutos = Number(minutosInput.value);

  // Validación básica + rechazo de fechas futuras.
  if (!fecha || fecha > todayKey()) {
    fechaInput.focus();
    return;
  }

  if (!materia || !tema || !Number.isFinite(minutos) || minutos < 1) {
    return;
  }

  const sessions = loadSessions();
  sessions.push(createSession({ fecha, materia, tema, minutos }));
  saveSessions(sessions);

  // Limpiar el formulario después de guardar.
  form.reset();
  fechaInput.value = todayKey();
  fechaInput.max = todayKey();
  materiaInput.value = '';
  temaInput.value = '';
  minutosInput.value = '';

  renderAll();
});

/* ---------- Inicialización ---------- */

function init() {
  const today = todayKey();
  fechaInput.max = today;
  fechaInput.value = today;

  renderAll();
}

document.addEventListener('DOMContentLoaded', init);
