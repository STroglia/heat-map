# Constitución del Proyecto — Diario de Estudio

1. **Stack:** HTML5 + CSS3 + JS vanilla ES6+; sin frameworks ni dependencias externas.
2. **Persistencia:** `localStorage` con clave exacta `diario-estudio-v1`; fechas en `YYYY-MM-DD` vía `toLocaleDateString('en-CA')`.
3. **Lógica:** cálculos (racha, totales semanales) ignoran fechas futuras; validación de fecha/materia/tema/minutos ≥ 1.
4. **Código:** cálculos en funciones puras desacopladas del DOM; render declarativo; consola sin errores (`No issues`).
5. **Interfaz:** textos en español; etiquetas, roles y `aria-live` correctos; responsive con Grid/Flexbox.
6. **Datos:** historial persistente íntegro (fecha, materia, tema, minutos); recargas no alteran registros.
