# Tareas — 002: Objetivo Semanal de Estudio

- [x] **T1** — RF-002, FR-002 · RF-003, FR-003 — Implementar funciones puras de semana ISO 8601 y cálculo del total semanal.
  **Hecho cuando:** `js/weekly.js` expone las funciones de semana ISO y suma de minutos y `node --test` pasa, incluyendo semana sin sesiones (total 0).

- [x] **T2** — FR-003, FR-003 — Excluir sesiones con fecha futura del cálculo semanal.
  **Hecho cuando:** Las sesiones con fecha futura no se suman al total de la semana actual.

- [x] **T3** — RF-001, FR-001 — Persistir el objetivo semanal en minutos en `localStorage` (`diario-estudio-v1`).
  **Hecho cuando:** El objetivo fijado por el estudiante persiste tras recarga (F5).

- [x] **T4** — RF-004, FR-004 — Comparar el total semanal contra el objetivo y reportar el logro.
  **Hecho cuando:** AC-001 y AC-002: objetivo 120 / total 150 → logrado; objetivo 120 / total 60 → no logrado.

- [x] **T5** — RF-005, FR-005 — Rastrear el logro semanal por ISO week en el registro.
  **Hecho cuando:** AC-003: cuando el total alcanza el objetivo, se marca la semana como lograda.
  **Code review 002 (CAMBIOS NECESARIOS):** tracking completo FR-005 implementado — persiste estado `true`/`false` por ISO week, acepta ISO week objetivo a evaluar y recalcula el flag (true/false) al cambiar la meta.

- [x] **T6** — HU-001 — Añadir UI para fijar el objetivo semanal en minutos.
  **Hecho cuando:** El estudiante puede fijar un objetivo semanal desde la interfaz y se persiste.

- [x] **T7** — HU-002 — Añadir UI para mostrar el total de minutos de la semana actual.
  **Hecho cuando:** La interfaz muestra el total de la semana actual frente al objetivo.

- [x] **T8** — HU-003 — Añadir UI para reportar si el objetivo semanal fue alcanzado.
  **Hecho cuando:** La interfaz informa (texto en español, ARIA) si el objetivo se alcanzó.

- [x] **T9** — AC-001, AC-002, AC-003 — Verificación final del flujo.
  **Hecho cuando:** `node --test` en verde, consola del navegador sin errores, persistencia intacta tras F5 y criterios de aceptación validados.

**Total:** 9 tareas (máximo permitido: 10).
