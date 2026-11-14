# Guía de Contexto para Agentes de IA - Diario de Estudio

## Propósito del Proyecto
Este proyecto es un prototipo funcional de un "Diario de Estudio" orientado a estudiantes de nivel terciario. Permite registrar sesiones de estudio, mantener un historial persistente, calcular la racha de días consecutivos de estudio de forma automatizada, mostrar un mapa de calor de los últimos 365 días con niveles de intensidad y gestionar un objetivo semanal de estudio (meta configurable en minutos, progreso semanal y estado logrado/no logrado).

## Arquitectura y Stack Tecnológico
- **Frontend:** HTML5, CSS3 y JavaScript vanilla (ES6+), módulos ESM en `js/`, estilos en `styles.css`.
- **Sin Dependencias:** No se utilizan frameworks (React, Vue, etc.) ni paquetes de Node/npm. Las pruebas usan el test runner nativo de Node (`node --test`).
- **Persistencia:** Datos almacenados localmente mediante `localStorage` utilizando exactamente la clave `diario-estudio-v1`.

## Estructura de Archivos
- **index.html:** Estructura semántica de la interfaz (formulario de registro, tarjeta de racha, mapa de calor, sección de objetivo semanal con progreso/estado e historial).
- **styles.css:** Diseños y estilos responsivos estructurados con CSS Grid/Flexbox.
- **app.js:** Lógica de interacción, manipulación del DOM, cálculos (racha, totales, niveles, objetivo semanal) y render.
- **js/heatmap.js:** Lógica pura del mapa de calor (getDailyTotals, getIntensityLevel).
- **js/weekly.js:** Lógica pura del objetivo semanal (semana ISO 8601 con inicio lunes, totales semanales, comparación de logro y tracking por ISO week).
- **tests/heatmap.test.js:** Pruebas unitarias del mapa de calor (`node --test`).
- **tests/weekly.test.js:** Pruebas unitarias del objetivo semanal (`node --test`).
- **AGENTS.md / MEMORY.md / specs/:** Documentación del proyecto.

## Reglas Principales para Modificaciones
1. **Independencia Tecnológica:** Mantener la solución en JavaScript puro, evitando incorporar librerías externas o gestores de paquetes.
2. **Formato de Fechas:** Las fechas almacenadas en `localStorage` deben mantenerse en formato `YYYY-MM-DD`, alineadas estrictamente a la zona horaria local mediante `toLocaleDateString('en-CA')`.
3. **Validación Temporal:** El cálculo de la racha debe omitir y filtrar de forma automática cualquier registro con fechas futuras.

## Instrucciones de Verificación
- **Consola del Navegador:** Al inspeccionar la aplicación (F12), la consola debe mantenerse limpia y libre de errores en tiempo de ejecución (`No issues`).
- **Persistencia:** Recargar la página (F5) no debe alterar ni eliminar los registros previos del historial ni el contador de rachas.
- **Pruebas:** Ejecutar `node --test` para validar la lógica pura cubierta (mapa de calor y objetivo semanal).

## Equipo de agentes (Feature 002)
Flujo SDD empleado en la Feature 002 (`specs/002-objetivo-semanal/`):
- **Orquestador:** dirige el flujo y coordina las etapas.
- **@planner:** elabora y ajusta spec, plan y tareas.
- **@reviewer:** realiza QA RF por RF, validación paralela y emite veredicto.
- **@implementer:** ejecuta la implementación por tarea y aplica correcciones.
