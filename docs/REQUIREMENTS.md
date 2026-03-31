# Requisitos del Sistema BSC

> Referenciado desde CLAUDE.md con `@docs/REQUIREMENTS.md`
> Versión 1.0 | Marzo 2026

---

## Requisitos Funcionales (RF)

### Módulo 1 — Gestión Estratégica BSC

| ID | Nombre | Descripción | Prioridad |
|----|--------|-------------|-----------|
| RF-01 | Definición de Perspectivas | CRUD de las 4 perspectivas BSC estándar + perspectivas personalizadas. Activar/desactivar sin borrar histórico. | Alta |
| RF-02 | Objetivos Estratégicos | Registrar objetivos por perspectiva: nombre, descripción, responsable (`userId`), fechaInicio, fechaFin. | Alta |
| RF-03 | Mapa Estratégico Visual | Mapa interactivo con relaciones causa-efecto entre objetivos. Nodos clicables con drill-down a KPIs. | Alta |
| RF-04 | Gestión de KPIs | Definir KPIs: nombre, fórmula, unidad, frecuencia (`DAILY/MONTHLY/QUARTERLY/ANNUAL`), meta, umbrales, responsable. | Alta |
| RF-05 | Configuración de Semáforos | Rangos de semáforo por KPI (valores absolutos o % de meta). Campo `thresholdGreen`, `thresholdYellow`. | Alta |
| RF-06 | Versionamiento de Planes | Soporte para múltiples planes estratégicos (ej. Plan 2025, Plan 2026) con comparativas entre versiones. | Media |
| RF-07 | Iniciativas y Proyectos | Vincular iniciativas a objetivos con: avance (%), presupuesto, responsable, estado. | Media |

### Módulo 2 — Carga y Procesamiento de Datos (ETL)

| ID | Nombre | Descripción | Prioridad |
|----|--------|-------------|-----------|
| RF-08 | Carga Manual | Formulario web para ingresar valores de KPI por periodo. Validación de rango, tipo, duplicados. | Alta |
| RF-09 | Importación Excel/CSV | Carga masiva con plantillas descargables. Preview antes de confirmar. Reporte de errores por fila. | Alta |
| RF-10 | Conectores Externos | Conectores nativos: SQL Server, MySQL, PostgreSQL, APIs REST. Credenciales cifradas en DB. | Alta |
| RF-11 | Cargas Automáticas | Scheduler configurable por fuente: horario, diario, semanal, mensual. Interfaz de administración de jobs. | Alta |
| RF-12 | Transformación de Datos | Reglas de transformación configurables sin código: conversión de unidades, filtros, agregaciones. | Alta |
| RF-13 | Validación y Calidad | Validar integridad, completitud y consistencia. Reporte de calidad con registros rechazados y motivo. | Alta |
| RF-14 | Log de Auditoría ETL | Registrar cada carga: usuario, fuente, fecha/hora, total procesados, exitosos, fallidos. Inmutable. | Alta |
| RF-15 | Histórico de Valores | Historial completo de valores por KPI y periodo. Exportable. Nunca eliminar — desactivar periodos. | Alta |
| RF-16 | Recálculo Manual | Disparar recálculo de KPIs derivados manualmente desde UI. Registrado en log con usuario y timestamp. | Media |
| RF-17 | Gestión de Periodos | Gestión de periodos de medición. Cierre/bloqueo de periodos auditados (`status: CLOSED`). | Media |

### Módulo 3 — Dashboards Gerenciales

| ID | Nombre | Descripción | Prioridad |
|----|--------|-------------|-----------|
| RF-18 | Dashboard Ejecutivo | Vista consolidada: cumplimiento global %, estado por perspectiva, KPIs críticos, tendencias. | Alta |
| RF-19 | Dashboard por Perspectiva | Dashboard individual por perspectiva: objetivos, KPIs, semáforos, metas, variación vs periodo anterior. | Alta |
| RF-20 | Gráficos Interactivos | Tipos: líneas, barras, gauge/velocímetro, mapa de calor, scatter, tabla pivote. Con Recharts + D3. | Alta |
| RF-21 | Drill-Down de KPIs | Desde un KPI en dashboard → detalle: histórico de valores, fórmula, fuente de datos, responsable. | Alta |
| RF-22 | Filtros Dinámicos | Filtros por: periodo, perspectiva, objetivo, área/unidad de negocio, responsable, estado semáforo. | Alta |
| RF-23 | Dashboards Personalizados | Cada usuario puede crear y guardar vistas con los KPIs y widgets de su preferencia. Almacenar en DB. | Media |
| RF-24 | Comparativo de Periodos | Comparativa automática: mes actual vs anterior, mismo mes año pasado, promedio anual. | Alta |
| RF-25 | Mapa de Calor BSC | Vista matricial con todos los KPIs coloreados por semáforo, agrupados por perspectiva y objetivo. | Alta |
| RF-26 | Exportación | Exportar dashboards y gráficos en: PDF (Puppeteer), PNG (html2canvas), Excel (ExcelJS), PPTX (pptxgenjs). | Alta |
| RF-27 | Mobile Responsive | Diseño responsivo completo. Breakpoints: desktop 1366+, tablet 768, mobile 375. | Media |

### Módulo 4 — Alertas y Notificaciones

| ID | Nombre | Descripción | Prioridad |
|----|--------|-------------|-----------|
| RF-28 | Alertas por Umbral | Alertas automáticas cuando KPI entra en estado YELLOW o RED. Configurable por KPI y responsable. | Alta |
| RF-29 | Notificaciones Email | Envío por correo a responsables de KPIs críticos. Frecuencia configurable: inmediata, diaria, semanal. | Alta |
| RF-30 | Centro de Notificaciones | Panel in-app con alertas activas, leídas y no leídas. Badge contador en navbar. | Media |
| RF-31 | Alertas de Pendientes | Notificar responsables cuando se acerque la fecha límite de carga sin datos ingresados (T-3 días, T-1 día). | Alta |
| RF-32 | Comentarios en KPIs | Responsables pueden adjuntar comentarios/justificaciones a KPIs en estado crítico. Visible en dashboard. | Media |

### Módulo 5 — Administración y Seguridad

| ID | Nombre | Descripción | Prioridad |
|----|--------|-------------|-----------|
| RF-33 | Gestión de Usuarios | CRUD de usuarios: rol, área, correo, estado (activo/inactivo). Invitación por email. | Alta |
| RF-34 | RBAC | Roles: ADMIN, MANAGER, ANALYST, VIEWER. Permisos granulares por módulo y perspectiva. | Alta |
| RF-35 | SSO / LDAP | Autenticación con Active Directory/LDAP y proveedores SSO (SAML 2.0 / OAuth 2.0). NextAuth.js v5. | Alta |
| RF-36 | Log de Auditoría | Registrar todas las acciones: accesos, modificaciones, exportaciones. Con timestamp, IP, userId. Inmutable. | Alta |
| RF-37 | Parámetros Globales | Configurar: moneda, zona horaria, idioma, logotipo, colores de marca (CSS variables). | Baja |

### Módulo 6 — Reportes Ejecutivos

| ID | Nombre | Descripción | Prioridad |
|----|--------|-------------|-----------|
| RF-38 | Reporte de Cumplimiento | % cumplimiento global del BSC, por perspectiva y objetivo, por periodo seleccionado. | Alta |
| RF-39 | Evolución de KPIs | Historial de KPIs individuales o agrupados con gráfico de tendencia + tabla de datos. | Alta |
| RF-40 | Reporte de Semáforos | Consolidado de semáforos de todos los KPIs, filtrable por área, perspectiva, estado. | Alta |
| RF-41 | Generador Ad-Hoc | Constructor de reportes flexible: selección de KPIs, periodos, agrupaciones, tipo de gráfico. | Media |
| RF-42 | Reporte de Iniciativas | Avance de iniciativas estratégicas vinculadas a objetivos BSC. | Media |
| RF-43 | Envío Programado | Programar envío automático de reportes PDF/Excel por correo. Interfaz de scheduler. | Media |

---

## Requisitos No Funcionales (RNF)

### Rendimiento

| ID | Requisito | Criterio de Aceptación |
|----|-----------|----------------------|
| RNF-01 | Carga de dashboards | ≤ 3 segundos con 100 usuarios concurrentes |
| RNF-02 | Procesamiento ETL | ≤ 5 minutos para ≤ 500,000 registros |
| RNF-03 | Cálculo de KPIs | ≤ 30 segundos para ≤ 200 KPIs activos |
| RNF-04 | Tiempo de respuesta API | ≤ 800 ms al percentil P95 |
| RNF-05 | Exportación de reportes | ≤ 20 segundos para reportes de hasta 50 páginas |
| RNF-06 | Concurrencia | ≥ 200 usuarios concurrentes sin degradación > 20% |

### Disponibilidad

| ID | Requisito | Criterio |
|----|-----------|---------|
| RNF-07 | Uptime | ≥ 99.5% mensual (≤ 3.6 horas downtime/mes) |
| RNF-08 | Mantenimiento | Fuera de horario laboral, notificación ≥ 48 horas |
| RNF-09 | RTO | ≤ 4 horas ante fallo mayor |
| RNF-10 | RPO | ≤ 1 hora de pérdida máxima de datos |
| RNF-11 | Backups | Automáticos diarios, retención 30 días |

### Seguridad

| ID | Requisito | Descripción |
|----|-----------|-------------|
| RNF-12 | TLS | Cifrado en tránsito TLS 1.2+ en todas las comunicaciones |
| RNF-13 | Cifrado en reposo | AES-256 para datos sensibles (credenciales, financieros) |
| RNF-14 | MFA | Autenticación multifactor para roles ADMIN y MANAGER |
| RNF-15 | Contraseñas | Mínimo 10 caracteres, complejidad requerida, expiración 90 días |
| RNF-16 | Sesiones | Cierre automático tras 30 min inactividad. Máx. 3 sesiones por usuario |
| RNF-17 | OWASP Top 10 | Protección contra: SQLi, XSS, CSRF, exposición de datos sensibles |
| RNF-18 | Auditoría | Logs inmutables de todos los accesos y acciones. Retención mínima 1 año |
| RNF-19 | Pentest | Análisis semestral por entidad externa. Plan de remediación documentado |

### Escalabilidad

| ID | Requisito | Métrica |
|----|-----------|---------|
| RNF-20 | Escalabilidad horizontal | Arquitectura stateless, soporte de múltiples réplicas sin cambios de código |
| RNF-21 | Volumen de datos | Hasta 10 millones de registros históricos de KPIs sin degradación |
| RNF-22 | Usuarios | Hasta 1,000 registrados, 300 concurrentes |
| RNF-23 | KPIs activos | Hasta 500 KPIs activos simultáneos |

### Usabilidad

| ID | Requisito | Descripción |
|----|-----------|-------------|
| RNF-24 | Intuitividad | Usuario VIEWER navega dashboards sin capacitación formal |
| RNF-25 | Responsivo | Desktop 1366×768+, tablet 768px, mobile 375px |
| RNF-26 | Multiidioma | Español e inglés. i18n con next-intl, sin cambios de código para agregar idiomas |
| RNF-27 | Accesibilidad | WCAG 2.1 nivel AA (contraste, teclado, ARIA) |
| RNF-28 | Curva de aprendizaje | Analista completa carga de periodo + revisión de dashboards en < 2 horas de uso inicial |
| RNF-29 | Ayuda contextual | Tooltips y guías paso a paso en todas las funciones principales |

### Integración e Interoperabilidad

| ID | Requisito | Descripción |
|----|-----------|-------------|
| RNF-30 | API REST | Documentación OpenAPI/Swagger en `/api/docs`. Versión en URL: `/api/v1/` |
| RNF-31 | Conectores DB | SQL Server 2016+, MySQL 5.7+, PostgreSQL 10+, Oracle 12c+, Azure SQL |
| RNF-32 | Formatos | Intercambio en: JSON, XML, CSV, XLSX, OData |
| RNF-33 | Webhooks | Notificar sistemas externos ante cambios de semáforo o completion de carga ETL |

### Mantenibilidad

| ID | Requisito | Descripción |
|----|-----------|-------------|
| RNF-34 | Arquitectura modular | Módulos bien delimitados. Actualización de uno sin afectar otros |
| RNF-35 | Cobertura de tests | Mínimo 80% en `lib/` con Vitest. E2E para flujos críticos con Playwright |
| RNF-36 | Documentación | Arquitectura, instalación, diccionario de datos, guía de APIs, manual de usuario |
| RNF-37 | CI/CD | Entornos: Desarrollo, QA, Producción. Pipeline automatizado con GitHub Actions |
| RNF-38 | Análisis estático | ESLint + TypeScript strict + Prettier verificados en CI |

### Normatividad y Cumplimiento

| ID | Requisito | Descripción |
|----|-----------|-------------|
| RNF-39 | Protección de datos | Cumplimiento con legislación local de protección de datos personales |
| RNF-40 | Retención | KPIs e históricos conservados mínimo 5 años. Exportación completa para auditorías |
| RNF-41 | Trazabilidad financiera | KPIs financieros con trazabilidad hasta fuente original. `auditTrail: true` en schema |
