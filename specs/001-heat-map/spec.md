# Especificación de Requisitos — 001: Heat Map de Días Estudiados

## Contexto
El Diario de Estudio registra sesiones de estudio. Se desea agregar una visualización tipo mapa de calor estilo GitHub que muestre los días estudiados en un rango fijo de las últimas semanas, con intensidad según los minutos invertidos.

## Historias de usuario
- **HU-001:** Como estudiante, quiero ver un mapa de calor tipo GitHub con los últimos 365 días en una grilla de 7 filas, para visualizar mi actividad de estudio de un vistazo.
- **HU-002:** Como estudiante, quiero que al pasar el mouse sobre un cuadrado se muestre la fecha correspondiente, para identificar el día estudiado.
- **HU-003:** Como estudiante, quiero que la intensidad del cuadrado se calcule con niveles N0 a N4 según umbrales fijos de minutos, para distinguir días de diferente dedicación.
- **HU-004:** Como estudiante, quiero que los minutos de múltiples sesiones del mismo día se sumen antes de asignar el nivel, para que la intensidad refleje el total del día.

## Requisitos funcionales (notación EARS)

- FR-001: The study log system SHALL display a heat map grid covering the last 365 days, organized in seven rows of the week.
- FR-002: The study log system SHALL assign each day an intensity level from 0 to 4 based on fixed minute thresholds applied to the daily total of study minutes.
- FR-003: When a day has multiple recorded sessions, the system SHALL sum the session minutes to compute the daily total before assigning the level.
- FR-004: The study log system SHALL assign level 0 to days with no recorded study minutes.

## Umbrales de intensidad (fijos)

| Nivel | Rango de minutos |
|---|---|
| 0 | 0 min |
| 1 | 1–30 min |
| 2 | 31–60 min |
| 3 | 61–120 min |
| 4 | 121+ min |

## Casos límite

- Día sin sesiones: el sistema SHALL renderizar el día con nivel 0.
- Sesiones con fecha futura: SHALL estar fuera del rango fijo de 365 días y SHALL no incluirse en el cálculo.

## Criterios de aceptación

- AC-001: Given a day with total minutes between 1 and 30, the system SHALL render the corresponding day cell at level 1.
- AC-002: Given a day with total minutes of 121 or above, the system SHALL render the corresponding day cell at level 4.
- AC-003: Given multiple sessions on the same day, the system SHALL compute the level from the summed total.
- AC-004: Given the last 365 days, the system SHALL render a grid of 365 day cells.

## Alineación con docs/constitution.md

- Stack: HTML5/CSS3/JS vanilla sin dependencias externas — ALINEADO.
- Persistencia: localStorage con clave `diario-estudio-v1` sin cambios de esquema — ALINEADO.
- Lógica: descarte de fechas futuras, acumulación de minutos por día, umbrales fijos — ALINEADO.
- Código: funciones puras de cálculo, render declarativo, consola sin errores — ALINEADO.
- Interfaz: textos en español, etiquetas y ARIA, responsive — ALINEADO.
- Datos: historial persistido intacto, recargas no alteran registros — ALINEADO.
