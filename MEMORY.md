# Bitácora de Decisiones Técnicas y Aprendizaje (MEMORY)
## Proyecto: Diario de Estudio

### Estado del Proyecto
- **Fase:** Versión 1.0 Finalizada y funcional al 100% + Feature 001 (Mapa de calor) implementada e integrada.
- **Componentes validados:** Interfaz web lista, consola sin errores, persistencia operativa en el navegador mediante la clave exacta `diario-estudio-v1`, lógica de rachas consecutivas probada, pruebas unitarias (`node --test`) del mapa de calor en verde, y flujo de registro de sesiones verificado de punta a punta.

### Decisiones de Arquitectura
- **Persistencia Local:** Se optó por utilizar `localStorage` con la clave `'diario-estudio-v1'` para cumplir con los requerimientos de la cátedra, logrando un prototipo ligero y directo sin necesidad de levantar un backend o base de datos externa.
- **Manejo de Fechas sin Desfasaje UTC:** Para evitar discrepancias de zona horaria al guardar y comparar fechas, se utiliza el formato estandarizado `YYYY-MM-DD` generado mediante `toLocaleDateString('en-CA')`.
- **Mapa de Calor (Feature 001):** Se optó por una grilla de 365 días en 7 filas, con niveles discretos N0 a N4 según umbrales fijos de minutos, y funciones puras en `js/heatmap.js` (`getDailyTotals`, `getIntensityLevel`).

### Reglas de Negocio Implementadas
1. **Registro de Sesión:** Exige de manera obligatoria la carga de Fecha, Materia, Tema y Minutos.
2. **Cálculo de Racha Consecutiva:** Agrupa y ordena las fechas únicas de estudio, ignora las fechas mayores al día de hoy y mantiene la racha activa si hay sesión ayer sin contar hoy.
3. **Feature 001 - Mapa de Calor:** Muestra los últimos 365 días en grilla de 7 filas; los minutos se suman por día calendario y se asigna un nivel N0 a N4 según umbrales fijos.

### Desafíos Superados y Buenas Prácticas
- **Autenticación y Entorno:** Configuración inicial del entorno CLI y resolución de credenciales mediante GitHub Copilot dentro de OpenCode.
- **Depuración:** Validación de la consola del navegador (`No issues`) para garantizar un código limpio y libre de errores en tiempo de ejecución.
- **Depuración de runtime:** Se detectó y corrigió el error `renderAll is not defined` al omitirse la definición de la función durante la reescritura del render; se revalidó el flujo completo (registro → persistencia → historial → heatmap).

### Entorno y Herramientas Utilizadas
- **CLI / Asistencia:** OpenCode configurado con GitHub/Copilot para el generación asistida del prototipo inicial de código.
- **Editor:** Cursor como entorno de desarrollo principal.
