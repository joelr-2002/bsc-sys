# Plan de Implementación por Fases

> Referenciado desde CLAUDE.md con `@docs/TASKS.md`
> Usa este archivo para rastrear el progreso de implementación.

---

## Estado del Proyecto

- [ ] **Fase 1** — Fundaciones (Semanas 1-2)
- [ ] **Fase 2** — Núcleo BSC (Semanas 3-4)
- [ ] **Fase 3** — Motor ETL (Semanas 5-6)
- [ ] **Fase 4** — Dashboards (Semanas 7-8)
- [ ] **Fase 5** — Alertas y Reportes (Semanas 9-10)
- [ ] **Fase 6** — QA, Seguridad y Producción (Semanas 11-12)

---

## Fase 1 — Fundaciones del Proyecto

**Objetivo**: Infraestructura base, autenticación y scaffolding del proyecto.

### T1.1 — Setup del Proyecto
- [ ] Inicializar Next.js 14 con TypeScript strict mode y App Router
- [ ] Configurar ESLint + Prettier + Husky pre-commit hooks
- [ ] Configurar Tailwind CSS + shadcn/ui (tema con colores corporativos)
- [ ] Setup de Docker Compose: PostgreSQL + Redis para desarrollo local
- [ ] Configurar Prisma con schema inicial (ver `ARCHITECTURE.md`)
- [ ] Setup de tRPC con primer router de prueba

**Verificación**: `npm run dev` funciona, Prisma Studio conecta a DB local.

### T1.2 — Autenticación y Autorización
- [ ] Implementar NextAuth.js v5 con credenciales locales
- [ ] Implementar conector LDAP/Active Directory (RF-35)
- [ ] Crear middleware RBAC en `lib/auth/rbac.ts` con los 4 roles (RF-34)
- [ ] Crear helper `protectedProcedure` con `requireRole()`
- [ ] Implementar cierre de sesión por inactividad (30 min) (RNF-16)
- [ ] Páginas de login, logout y gestión de sesión

**Verificación**: Usuario puede loguearse, RBAC bloquea rutas incorrectamente autorizadas, test unitario del middleware RBAC con 100% cobertura.

### T1.3 — Gestión de Usuarios (RF-33)
- [ ] CRUD completo de usuarios en `(admin)/users`
- [ ] Asignación de roles y áreas
- [ ] Invitación por email (envío con Resend o Nodemailer)
- [ ] Activar/desactivar usuarios (nunca eliminar)
- [ ] Tests de integración para CRUD de usuarios

---

## Fase 2 — Núcleo del BSC

**Objetivo**: Implementar el modelo estratégico completo.

### T2.1 — Gestión Estratégica (RF-01 a RF-07)
- [ ] CRUD de Planes Estratégicos con soporte multi-versión
- [ ] CRUD de Perspectivas (RF-01): estándar + personalizadas, orden arrastrable
- [ ] CRUD de Objetivos Estratégicos (RF-02): formulario completo con responsable y fechas
- [ ] Relaciones causa-efecto entre objetivos (RF-03): UI de vinculación
- [ ] CRUD de KPIs (RF-04): fórmula, unidad, frecuencia, meta, umbrales
- [ ] Configuración de semáforos por KPI (RF-05): sliders o inputs numéricos
- [ ] CRUD de Iniciativas vinculadas a objetivos (RF-07)

**Verificación**: Un plan estratégico completo puede crearse desde cero a través de la UI. Tests e2e cubren el flujo de creación completo.

### T2.2 — Motor de KPIs (`lib/kpi/`)
- [ ] Implementar `calculateTrafficLight(kpi: KPI, value: number): TrafficLight`
- [ ] Implementar `getCompliancePercentage(kpi: KPI, value: number): number`
- [ ] Implementar `triggerDependentRecalculations(kpiId: string): Promise<void>`
- [ ] Implementar `aggregatePerspectiveHealth(perspectiveId: string): PerspectiveHealth`
- [ ] Tests unitarios con 100% de cobertura para `lib/kpi/`

### T2.3 — Mapa Estratégico Visual (RF-03)
- [ ] Componente `<StrategicMap>` usando D3.js o React Flow
- [ ] Nodos por objetivo con color según estado de KPIs hijos
- [ ] Flechas direccionales para relaciones causa-efecto
- [ ] Click en nodo → panel lateral con detalle del objetivo y KPIs
- [ ] Zoom y pan

---

## Fase 3 — Motor ETL y Carga de Datos

**Objetivo**: Implementar toda la capa de ingesta de datos.

### T3.1 — Carga Manual y Excel/CSV (RF-08, RF-09)
- [ ] Formulario de carga manual por KPI y periodo con validaciones Zod
- [ ] Parser de Excel/CSV con ExcelJS: detección de columnas, preview de datos
- [ ] Plantillas descargables por KPI o por perspectiva
- [ ] Reporte de errores por fila antes de confirmar importación
- [ ] Gestión de periodos: abrir, cerrar, bloquear (RF-17)

**Verificación**: Importar un Excel de 10,000 filas en < 30 segundos.

### T3.2 — Conectores Externos (RF-10, RF-11)
- [ ] Implementar `lib/etl/connectors/`:
  - [ ] `PostgreSQLConnector.ts`
  - [ ] `MySQLConnector.ts`
  - [ ] `SqlServerConnector.ts`
  - [ ] `RestApiConnector.ts`
- [ ] Cifrado de credenciales con AES-256 antes de persistir (RNF-13)
- [ ] UI de administración de fuentes de datos
- [ ] Configuración de cargas programadas (schedulers) con cron expressions (RF-11)

### T3.3 — Worker ETL Asíncrono (BullMQ)
- [ ] Configurar `workers/etl-worker.ts` como proceso independiente
- [ ] Job types: `MANUAL_LOAD`, `SCHEDULED_LOAD`, `RECALCULATE_KPIS`
- [ ] Transformaciones configurables: conversión de unidades, filtros, agregaciones (RF-12)
- [ ] Validación de calidad de datos con reporte de rechazados (RF-13)
- [ ] Log ETL inmutable en `ETLLog` (RF-14)
- [ ] Monitoreo en tiempo real del estado de jobs en UI (RF-11)

**Verificación**: Carga automatizada de 500,000 registros completa en < 5 minutos (RNF-02). Worker se recupera automáticamente ante fallos.

### T3.4 — Historial y Trazabilidad (RF-15, RF-16)
- [ ] Vista de historial de valores por KPI con filtro por periodo
- [ ] Exportación del historial a Excel
- [ ] Trigger de recálculo manual desde UI con confirmación (RF-16)
- [ ] Garantizar que periodos CLOSED rechazan escrituras (RNF-40)

---

## Fase 4 — Dashboards Gerenciales

**Objetivo**: Visualizaciones interactivas y dashboards completos.

### T4.1 — Dashboard Ejecutivo (RF-18)
- [ ] Layout de tarjetas por perspectiva con gauge de cumplimiento
- [ ] Lista de KPIs críticos (RED) con drill-down
- [ ] Gráfico de tendencia del cumplimiento global últimos 12 meses
- [ ] Widget de semáforo global del BSC
- [ ] Skeleton loaders para UX durante carga

### T4.2 — Dashboard por Perspectiva (RF-19, RF-21)
- [ ] Vista de perspectiva con todos sus objetivos y KPIs
- [ ] Componente `<KPICard>` con semáforo, valor actual, meta, % cumplimiento
- [ ] Click en KPI → drawer lateral con historial completo, fórmula, fuente
- [ ] Comparativa con periodo anterior automática (RF-24)

### T4.3 — Gráficos y Visualizaciones (RF-20, RF-25)
- [ ] `<LineChart>` para evolución temporal de KPIs
- [ ] `<GaugeChart>` para cumplimiento de metas (D3.js)
- [ ] `<HeatMap>` para el Mapa de Calor BSC (RF-25)
- [ ] `<BarChart>` para comparativos
- [ ] `<ScatterPlot>` para correlación entre KPIs

### T4.4 — Filtros y Personalización (RF-22, RF-23)
- [ ] Panel de filtros persistentes: periodo, perspectiva, área, semáforo
- [ ] Dashboard personalizado: drag-and-drop de widgets con react-grid-layout
- [ ] Guardar layouts por usuario en DB
- [ ] Compartir dashboards entre usuarios

### T4.5 — Exportación (RF-26)
- [ ] PDF: Puppeteer headless, renderizar ruta `/dashboard/export/[id]`
- [ ] PNG: html2canvas para exportar widgets individuales
- [ ] Excel: ExcelJS para tablas de datos
- [ ] PowerPoint: pptxgenjs con branding corporativo

**Verificación**: Dashboard ejecutivo carga en < 3 segundos con datos de 200 KPIs (RNF-01). Exportación PDF en < 20 segundos (RNF-05).

---

## Fase 5 — Alertas, Notificaciones y Reportes

### T5.1 — Motor de Alertas (RF-28, RF-29, RF-31)
- [ ] Job BullMQ `CHECK_ALERTS` que corre tras cada recálculo de KPIs
- [ ] Detectar cambios de semáforo y crear `AlertEvent` en DB
- [ ] Envío de email con plantilla HTML con Resend (frecuencia configurable)
- [ ] Alertas de pendientes de carga: job diario a T-3 y T-1 días
- [ ] Centro de notificaciones in-app con badge en navbar (RF-30)

### T5.2 — Comentarios en KPIs (RF-32)
- [ ] Componente `<KPICommentThread>` en el drawer de detalle de KPI
- [ ] ANALYST y MANAGER pueden adjuntar comentarios a KPIs en RED/YELLOW
- [ ] Comentarios visibles en el dashboard para MANAGER y ADMIN

### T5.3 — Módulo de Reportes (RF-38 a RF-43)
- [ ] Reporte de Cumplimiento Global con selector de periodo
- [ ] Reporte de Evolución de KPIs con gráfico de tendencia
- [ ] Reporte Consolidado de Semáforos
- [ ] Constructor de reportes ad-hoc: selector de KPIs + periodo + tipo de gráfico
- [ ] Reporte de Iniciativas con avance y presupuesto
- [ ] Scheduler de envío de reportes: cron + Resend

---

## Fase 6 — QA, Seguridad y Go-Live

### T6.1 — Testing Completo
- [ ] Cobertura de tests unitarios ≥ 80% en `lib/` (RNF-35)
- [ ] Tests e2e con Playwright:
  - [ ] Flujo de login → dashboard ejecutivo
  - [ ] Flujo de carga manual de KPI
  - [ ] Flujo de importación Excel
  - [ ] Flujo de generación y descarga de reporte PDF
- [ ] Tests de carga con k6: 200 usuarios concurrentes en dashboard (RNF-06)

### T6.2 — Seguridad
- [ ] Revisión OWASP Top 10: SQLi, XSS, CSRF (RNF-17)
- [ ] Implementar MFA para roles ADMIN y MANAGER (RNF-14)
- [ ] Auditar headers HTTP: CSP, HSTS, X-Frame-Options
- [ ] Verificar que AES-256 está aplicado en todas las credenciales de conectores (RNF-13)
- [ ] Revisar que ningún secret está en código o logs

### T6.3 — Rendimiento y Optimización
- [ ] Añadir índices en DB: `KPIValue(kpiId, periodId)`, `AuditLog(userId, createdAt)`
- [ ] Implementar caché con Redis para dashboards ejecutivos (TTL 5 min)
- [ ] Lazy loading de gráficos pesados con React Suspense
- [ ] Verificar RNF-01: dashboard < 3s con Lighthouse y k6

### T6.4 — Documentación y Entrega
- [ ] README.md con instrucciones de instalación y variables de entorno
- [ ] Documentación OpenAPI en `/api/docs` (RNF-30)
- [ ] Manual de usuario en `/docs/user-guide/`
- [ ] Diccionario de datos actualizado en `docs/DATA_MODEL.md`
- [ ] Runbook de operaciones: backups, monitoreo, alertas de infraestructura

### T6.5 — Deploy a Producción
- [ ] Pipeline GitHub Actions: test → lint → build → deploy
- [ ] Configurar entornos: Development, QA, Production
- [ ] Variables de entorno en plataforma de deploy (nunca en código)
- [ ] Verificar backups automáticos diarios con retención 30 días (RNF-11)
- [ ] UAT con al menos 3 usuarios por perfil (Directivo, Gerente, Analista)

---

## Criterios de Done por Fase

Antes de pasar a la siguiente fase, verificar:

1. Todos los tasks de la fase están marcados como completados
2. Tests pasan en CI sin errores ni warnings
3. El código fue revisado (o auto-revisado con `claude "review this PR as a staff engineer"`)
4. La documentación relevante en `docs/` está actualizada
5. No hay secrets o credenciales en código
6. El feature funciona en mobile (Chrome DevTools responsive mode)
