# Plan de Implementación — 002: Objetivo Semanal de Estudio

- **Spec de referencia:** `specs/002-objetivo-semanal/spec.md` (Estado: aprobada por el usuario)
- **Fecha:** 2026-11-12
- **Estado:** Pendiente de aprobación

## Objetivo

Implementar el flujo "Objetivo Semanal de Estudio" del Diario de Estudio: fijar una meta
de estudio semanal en minutos, calcular el total de minutos estudiados durante la semana
ISO actual y reportar si el objetivo semanal fue alcanzado.

## Alcance propuesto

Basado en la spec aprobada (HU-001 a HU-003, FR-001 a FR-005, AC-001 a AC-003 y casos límite).

### Dentro del alcance
- Persistencia del objetivo semanal en minutos como valor configurable/fijo (FR-001).
- Definición del período semanal por ISO 8601: cada semana inicia el lunes y la primera
  semana del año es la que contiene el primer jueves del año (FR-002).
- Cálculo del total de minutos de la semana actual sumando las sesiones registradas de
  todos los temas (FR-003).
- Comparación del total semanal contra el objetivo y reporte de logro (FR-004).
- Seguimiento del logro semanal para cada ISO week dentro del registro (FR-005).

### Casos límite previstos
- Semana sin sesiones registradas: total semanal de 0 minutos.
- Sesiones con fecha futura: fuera del período de la semana ISO actual y no se incluyen
  en el cálculo.

## Diseño propuesto (pre-implementación)

- **Lógica pura:** nueva función(es) en un módulo `js/weekly.js`, siguiendo el patrón de
  `js/heatmap.js` (`getDailyTotals`, `getIntensityLevel`): cálculo de semana ISO 8601,
  agrupación de sesiones por semana y suma de minutos.
- **Persistencia:** dentro de `localStorage` con la clave exacta `diario-estudio-v1`
  (objetivo fijo + seguimiento de cumplimiento semanal dentro del mismo registro),
  respetando el formato de fechas `YYYY-MM-DD` (vía `toLocaleDateString('en-CA')`).
- **Regla de comparación:** el objetivo semanal se considera alcanzado cuando
  `totalSemanal >= objetivoSemanal`.
- **Interfaz:** card/formulario en `index.html`; render y eventos en `app.js`; render
  declarativo, textos en español, etiquetas y ARIA correctos, responsive.

## Criterios de verificación

- Unitarios: `node --test` sobre la lógica pura semanal.
- Consola del navegador: sin errores (`No issues`).
- Persistencia: recarga (F5) no altera registros ni objetivo.
- Aceptación: AC-001, AC-002 y AC-003.

## Tareas

Detalle en `tasks.md` (mismo directorio). Máximo 10 tareas permitidas.
