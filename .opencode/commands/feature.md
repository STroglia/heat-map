---
description: Planifica una nueva funcionalidad
agent: plan
---
Especificación de la Feature 001: Mapa de calor del Diario de Estudio.

- Vista tipo mapa de calor estilo GitHub de los últimos 365 días.
- Grilla de 7 filas (días de la semana).
- Intensidad por niveles N0 a N4 según umbrales fijos de minutos.
- Funciones puras: getDailyTotals (suma de minutos por día) y getIntensityLevel (umbración de niveles).

Antes de escribir código, prepárame un plan con:
1. Cómo la vas a implementar.
2. Qué archivos va a modificar.
3. Casos límite y dudas a decidir.
4. Qué actualizar en AGENTS.md y MEMORY.md.
Estado actual: @MEMORY.md
No modifiques ningún archivo hasta que apruebe el plan.
