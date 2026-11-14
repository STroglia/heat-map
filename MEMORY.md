# Bitácora de Decisiones Técnicas y Aprendizaje (MEMORY)
## Proyecto: Diario de Estudio

### Estado del Proyecto
- **Fase:** Versión 1.0 finalizada + Feature 001 (Mapa de calor) y Feature 002 (Objetivo Semanal de Estudio) implementadas e integradas.
- **Componentes validados:** Interfaz web lista, consola sin errores, persistencia operativa en `localStorage` bajo la clave exacta `diario-estudio-v1`, lógica de rachas consecutivas probada, mapa de calor operativo y flujo de objetivo semanal verificado de punta a punta.
- **Pruebas:** `node --test` en verde (31 pruebas: heatmap + weekly).
- **Feature 002:** spec `specs/002-objetivo-semanal/spec.md` (aprobada), plan `specs/002-objetivo-semanal/plan.md`, tareas `specs/002-objetivo-semanal/tasks.md` (T1–T9 completadas). Cierre con corrección aplicada: al eliminar sesiones se recalcula y persiste `weeklyAchievements` de la semana actual (evita estado stale FR-005/AC-003), con prueba de regresión en `tests/weekly.test.js`.
- **Flujo SDD (Feature 002):** orquestador (dirige el flujo), `@planner` (spec/plan/tareas), `@reviewer` (QA RF por RF y validación en paralelo para informe unificado) e `@implementer` (implementación por tarea, corrección y documentación).

### Decisiones de Arquitectura
- **Persistencia Local:** `localStorage` con clave `'diario-estudio-v1'`. El registro persiste `{ sessions, weeklyGoal, weeklyAchievements }` (compatible con formatos previos al cargar).
- **Manejo de Fechas sin Desfasaje UTC:** Fechas en formato `YYYY-MM-DD` generadas con `toLocaleDateString('en-CA')` y cálculos locales por componentes (año/mes/día).
- **Mapa de Calor (Feature 001):** Grilla de 365 días en 7 filas, niveles N0–N4 por umbrales fijos, lógica pura en `js/heatmap.js` (`getDailyTotals`, `getIntensityLevel`).
- **Objetivo Semanal (Feature 002):** Lógica pura en `js/weekly.js` (semana ISO 8601 con inicio lunes, suma semanal, exclusión de fechas futuras respecto al horizonte de cálculo, comparación `totalSemanal >= objetivoSemanal`, tracking por `weekStartKey` ISO en `weeklyAchievements`). UI en `index.html`/`app.js` (formulario de objetivo, progreso y estado con `aria-live`/`role="status"`). En `init` se persiste el tracking del logro de la semana actual para mantener el registro consistente al cargar.

### Reglas de Negocio Implementadas
1. **Registro de Sesión:** Exige Fecha, Materia, Tema y Minutos; rechaza fechas futuras.
2. **Cálculo de Racha Consecutiva:** Agrupa fechas únicas, ignora fechas mayores a hoy y mantiene racha activa si hay sesión ayer sin contar hoy.
3. **Feature 001 - Mapa de Calor:** Últimos 365 días; minutos sumados por día calendario; niveles N0–N4.
4. **Feature 002 - Objetivo Semanal:** Objetivo en minutos configurable y persistido; semana ISO (lunes, primera semana con el primer jueves del año); total de la semana actual sobre todas las materias excluyendo sesiones futuras; reporte logrado/no logrado; seguimiento de logro por ISO week (`weeklyAchievements`).

### Desafíos Superados y Buenas Prácticas
- **Depuración:** Consola del navegador sin errores (`No issues`); validación con Chrome DevTools (incluida vista móvil).
- **Persistencia:** Recarga (F5) no altera sesiones, objetivo ni estado visible; el logro semanal queda marcado en el registro cuando corresponde.
- **Ajuste T9:** Se añadió persistencia del tracking en inicialización (`trackWeeklyGoalAchievement` + guardado) para asegurar que AC-003 quede reflejado en el registro almacenado al cargar estados ya cumplidos.
- **Code review 002 (CAMBIOS NECESARIOS):** Se completó el tracking FR-005 — `trackWeeklyGoalAchievement` persiste `true`/`false` por ISO week, acepta semana objetivo a evaluar y recalcula el flag al cambiar la meta (evita estado stale); heatmap en móvil con contenedor scrollable (`overflow-x: auto`) sin overflow horizontal de página.
- **Corrección de cierre Feature 002:** al eliminar sesiones se recalcula y persiste `weeklyAchievements` de la semana actual para evitar estado stale (FR-005/AC-003), con prueba de regresión que verifica el paso a `false` al remover la sesión que hacía cumplir el objetivo.

### Entorno y Herramientas Utilizadas
- **CLI / Asistencia:** OpenCode configurado con GitHub/Copilot.
- **Editor:** Cursor como entorno de desarrollo principal.
