# Arquitectura del Sistema BSC

> Referenciado desde CLAUDE.md con `@docs/ARCHITECTURE.md`

---

## Diagrama de Capas

```
┌─────────────────────────────────────────────────────────┐
│                    CLIENTE (Browser)                     │
│  Next.js App Router · Recharts · shadcn/ui · Tailwind   │
└──────────────────────┬──────────────────────────────────┘
                       │ HTTPS / tRPC
┌──────────────────────▼──────────────────────────────────┐
│                  API LAYER (Next.js)                      │
│   tRPC Router · NextAuth.js · Zod Validators             │
│   RBAC Middleware · Rate Limiting                        │
└──────────────────────┬──────────────────────────────────┘
                       │
        ┌──────────────┼──────────────┐
        │              │              │
┌───────▼──────┐ ┌─────▼──────┐ ┌───▼──────────────────┐
│  KPI Engine  │ │ Auth/LDAP  │ │   Notification Svc   │
│  lib/kpi/    │ │ lib/auth/  │ │  lib/notifications/  │
└───────┬──────┘ └────────────┘ └──────────────────────┘
        │
┌───────▼──────────────────────────────────────────────────┐
│                   DATA LAYER                              │
│          PostgreSQL 16 + Prisma ORM                       │
└──────────────────────────────────────────────────────────┘
                       │
┌──────────────────────▼──────────────────────────────────┐
│                 ETL WORKER (proceso separado)             │
│   BullMQ + Redis · Conectores · Transformaciones         │
│   workers/etl-worker.ts                                  │
└──────────────────────────────────────────────────────────┘
        │ conecta a fuentes externas
┌───────▼──────────────────────────────────────────────────┐
│  SQL Server │ MySQL │ PostgreSQL │ APIs REST │ CSV/Excel  │
└──────────────────────────────────────────────────────────┘
```

---

## Modelo de Datos (Prisma Schema — Core)

```prisma
// Plano estratégico (soporte multi-versión RF-06)
model StrategicPlan {
  id          String   @id @default(cuid())
  name        String
  year        Int
  status      PlanStatus  @default(ACTIVE)
  perspectives Perspective[]
  createdAt   DateTime @default(now())
}

// Perspectiva BSC (RF-01)
model Perspective {
  id          String   @id @default(cuid())
  planId      String
  plan        StrategicPlan @relation(fields: [planId], references: [id])
  name        String
  type        PerspectiveType  // FINANCIAL | CUSTOMER | PROCESS | LEARNING | CUSTOM
  order       Int
  active      Boolean  @default(true)
  objectives  StrategicObjective[]
}

// Objetivo estratégico (RF-02)
model StrategicObjective {
  id             String   @id @default(cuid())
  perspectiveId  String
  perspective    Perspective @relation(fields: [perspectiveId], references: [id])
  name           String
  description    String?
  ownerId        String
  owner          User @relation(fields: [ownerId], references: [id])
  startDate      DateTime
  endDate        DateTime
  kpis           KPI[]
  initiatives    Initiative[]
  // Relaciones causa-efecto para mapa estratégico (RF-03)
  causeOf        CausalRelation[] @relation("cause")
  effectOf       CausalRelation[] @relation("effect")
}

// Relación causa-efecto entre objetivos (RF-03)
model CausalRelation {
  id       String @id @default(cuid())
  causeId  String
  effectId String
  cause    StrategicObjective @relation("cause", fields: [causeId], references: [id])
  effect   StrategicObjective @relation("effect", fields: [effectId], references: [id])
}

// KPI / Indicador (RF-04, RF-05)
model KPI {
  id              String   @id @default(cuid())
  objectiveId     String
  objective       StrategicObjective @relation(fields: [objectiveId], references: [id])
  name            String
  formula         String?          // Fórmula de cálculo en texto
  unit            String           // %, $, #, días, etc.
  frequency       MeasurementFrequency  // DAILY | MONTHLY | QUARTERLY | ANNUAL
  target          Float            // Meta
  thresholdGreen  Float            // ej: 0.95 = 95% de la meta
  thresholdYellow Float            // ej: 0.80 = 80% de la meta
  ownerId         String
  owner           User @relation(fields: [ownerId], references: [id])
  active          Boolean @default(true)
  auditTrail      Boolean @default(false)  // true para KPIs financieros (RNF-41)
  values          KPIValue[]
  alerts          AlertConfig[]
  comments        KPIComment[]
}

// Valor de KPI por periodo (RF-15)
model KPIValue {
  id           String   @id @default(cuid())
  kpiId        String
  kpi          KPI @relation(fields: [kpiId], references: [id])
  periodId     String
  period       MeasurementPeriod @relation(fields: [periodId], references: [id])
  value        Float
  trafficLight TrafficLight     // GREEN | YELLOW | RED — calculado automáticamente
  sourceType   DataSourceType   // MANUAL | EXCEL | CONNECTOR | API
  sourceId     String?          // ID del conector si aplica
  loadedById   String
  loadedBy     User @relation(fields: [loadedById], references: [id])
  createdAt    DateTime @default(now())
  // Inmutable: no se borra, solo se marca como superseded
  superseded   Boolean @default(false)

  @@unique([kpiId, periodId])  // Un valor por KPI por periodo
}

// Periodo de medición (RF-17)
model MeasurementPeriod {
  id        String   @id @default(cuid())
  year      Int
  month     Int?     // null para periodos anuales
  quarter   Int?     // null para periodos mensuales
  status    PeriodStatus  @default(OPEN)  // OPEN | CLOSED | LOCKED
  values    KPIValue[]
}

// Usuario del sistema (RF-33)
model User {
  id            String   @id @default(cuid())
  email         String   @unique
  name          String
  role          UserRole  // ADMIN | MANAGER | ANALYST | VIEWER
  areaId        String?
  active        Boolean  @default(true)
  // NextAuth
  accounts      Account[]
  sessions      Session[]
}

// Log de auditoría (RF-14, RF-36)
model AuditLog {
  id        String   @id @default(cuid())
  userId    String
  action    String   // LOAD_DATA | LOGIN | EXPORT | UPDATE_KPI | etc.
  entityType String
  entityId  String?
  metadata  Json?
  ipAddress String?
  createdAt DateTime @default(now())
  // NUNCA eliminar registros de este modelo
}

// Fuente de datos para ETL (RF-10)
model DataSource {
  id          String   @id @default(cuid())
  name        String
  type        ConnectorType  // SQL_SERVER | MYSQL | POSTGRESQL | REST_API | FILE
  config      Json           // Configuración cifrada con AES-256
  active      Boolean @default(true)
  schedules   ETLSchedule[]
  etlLogs     ETLLog[]
}

// Log de carga ETL (RF-14)
model ETLLog {
  id           String   @id @default(cuid())
  dataSourceId String
  dataSource   DataSource @relation(fields: [dataSourceId], references: [id])
  triggeredBy  String   // userId o "SCHEDULER"
  status       ETLStatus  // RUNNING | SUCCESS | PARTIAL | FAILED
  totalRecords Int?
  successCount Int?
  failedCount  Int?
  errorDetails Json?
  startedAt    DateTime @default(now())
  completedAt  DateTime?
}

// Enums
enum PlanStatus      { ACTIVE ARCHIVED }
enum PerspectiveType { FINANCIAL CUSTOMER PROCESS LEARNING CUSTOM }
enum MeasurementFrequency { DAILY MONTHLY QUARTERLY ANNUAL }
enum TrafficLight    { GREEN YELLOW RED GREY }
enum PeriodStatus    { OPEN CLOSED LOCKED }
enum UserRole        { ADMIN MANAGER ANALYST VIEWER }
enum DataSourceType  { MANUAL EXCEL CONNECTOR API }
enum ConnectorType   { SQL_SERVER MYSQL POSTGRESQL ORACLE REST_API FILE }
enum ETLStatus       { RUNNING SUCCESS PARTIAL FAILED }
```

---

## Decisiones de Arquitectura (ADR)

### ADR-01: tRPC sobre REST puro
**Decisión**: Usar tRPC para toda la API interna.
**Razón**: Type-safety end-to-end sin código extra. El frontend y backend comparten tipos automáticamente. Zod en los routers garantiza validación en el borde.
**Trade-off**: Requiere TypeScript en ambos lados (ya asumido).

### ADR-02: BullMQ para ETL asíncrono
**Decisión**: El procesamiento ETL corre en workers BullMQ con Redis como broker.
**Razón**: Las cargas de datos pueden tardar minutos. No bloquear el servidor HTTP. Reintentos automáticos, logs de estado en tiempo real, jobs programados.
**Trade-off**: Requiere instancia Redis. Proceso separado (`workers/etl-worker.ts`).

### ADR-03: KPI Engine en `lib/kpi/`
**Decisión**: El cálculo de semáforos y KPIs derivados es un módulo puro separado.
**Razón**: Testeable independientemente, reutilizable en worker ETL y en API. La lógica de negocio no depende de Next.js.
**Cómo funciona**: Al guardar un `KPIValue`, el worker llama `kpiEngine.calculateTrafficLight(kpi, value)` y `kpiEngine.triggerDependentRecalculations(kpiId)`.

### ADR-04: Periodos como entidades de primera clase
**Decisión**: Los periodos de medición son entidades en DB, no solo campos de fecha.
**Razón**: Soporte para cierre/bloqueo (RNF-40, RF-17). Los periodos `LOCKED` rechazan cualquier escritura. Facilita auditorías.

### ADR-05: Logs inmutables por diseño
**Decisión**: Los modelos `AuditLog` y `ETLLog` no tienen operaciones `update` ni `delete` en el schema Prisma.
**Razón**: Requisito de trazabilidad financiera (RNF-41) y cumplimiento de auditoría (RNF-39). Los tRPC procedures de audit nunca expondrán mutaciones sobre estos modelos.

---

## Capas de Seguridad

```
Request → TLS 1.2+ → Rate Limiter → NextAuth Session Check
       → RBAC Middleware (verifica rol + permiso por módulo)
       → Zod Input Validation
       → tRPC Procedure Handler
       → Prisma Query (con Row-Level filtering por área si aplica)
       → Response
```

El middleware RBAC vive en `lib/auth/rbac.ts` y se aplica como wrapper en cada tRPC procedure:

```typescript
// Ejemplo de uso en un router
export const kpiRouter = router({
  updateValue: protectedProcedure
    .use(requireRole(['ADMIN', 'MANAGER', 'ANALYST']))
    .use(requirePeriodOpen)        // Rechaza si periodo está CLOSED/LOCKED
    .input(updateKPIValueSchema)
    .mutation(async ({ ctx, input }) => { ... })
})
```
