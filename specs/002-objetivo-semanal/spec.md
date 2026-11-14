# Especificación de Requisitos — 002: Objetivo Semanal de Estudio

**Estado: aprobada por el usuario**

## Contexto
El Diario de Estudio registra sesiones de estudio individuales, calcula la racha de días consecutivos y expone un mapa de calor de los últimos 365 días. La feature "Objetivo semanal de estudio" incorpora la fijación de una meta de estudio por semana y la evaluación del progreso hacia esa meta.

## Historias de usuario
- **HU-001:** Como estudiante, quiero fijar un objetivo semanal de estudio en minutos, para tener una meta concreta a alcanzar.
- **HU-002:** Como estudiante, quiero ver el total de minutos estudiados durante la semana actual, para conocer mi progreso hacia el objetivo.
- **HU-003:** Como estudiante, quiero saber si alcancé mi objetivo semanal, para evaluar mi constancia.

## Requisitos funcionales (notación EARS)

- FR-001: The student SHALL be able to set a weekly study goal in minutes as a fixed configurable value.
- FR-002: The study log system SHALL define the weekly period by ISO 8601 calendar weeks, where each week starts on Monday and the first week of the year is the week containing the first Thursday of the year.
- FR-003: The study log system SHALL calculate the total study minutes of the current ISO week across all subjects by summing the minutes of the sessions registered within that week.
- FR-004: The study log system SHALL compare the weekly total against the weekly goal and SHALL report whether the goal was achieved.
- FR-005: The study log system SHALL track whether the weekly goal was achieved for each ISO week within the study log record.

## Casos límite

- Semana sin sesiones registradas: el sistema SHALL considerar un total semanal de 0 minutos.
- Sesiones con fecha futura: SHALL estar fuera del período de la semana ISO actual y SHALL no incluirse en el cálculo.

## Criterios de aceptación

- AC-001: Given a weekly goal of 120 minutes and a total of 150 minutes in the current ISO week, the system SHALL report the goal as achieved.
- AC-002: Given a weekly goal of 120 minutes and a total of 60 minutes in the current ISO week, the system SHALL report the goal as not achieved.
- AC-003: Given a weekly goal configured by the student, when the total of the current ISO week reaches the goal, the system SHALL mark the goal as achieved for that ISO week.

## Alineación con docs/constitution.md

- Stack: HTML5/CSS3/JS vanilla sin dependencias externas — ALINEADO.
- Persistencia: localStorage con clave `diario-estudio-v1` — ALINEADO (objetivo fijo y seguimiento de cumplimiento semanal dentro del mismo registro).
- Lógica: descarte de fechas futuras y acumulación de minutos por semana — APLICABLE.
- Código: funciones puras de cálculo, render declarativo, consola sin errores — APLICABLE.
- Interfaz: textos en español, etiquetas y ARIA, responsive — APLICABLE.
- Datos: historial persistente íntegro — APLICABLE.
