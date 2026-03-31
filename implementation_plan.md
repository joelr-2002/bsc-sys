# BSC Institucional v4.0 — Plan de Implementación

Rediseño completo del sistema BSC para soportar **Scorecards individuales por nodo organizacional** con jerarquía dinámica, flujo de aprobación, y carga manual de datos.

**Stack:** Laravel 13 + React 19 + Ant Design 6.3.5 + Inertia.js + SQLite (existente, no cambia)

## User Review Required

> [!IMPORTANT]
> **Eliminación completa del esquema anterior.** Se borrarán todos los modelos, migraciones y páginas del esquema v2/v3 (StrategicPlan, StrategicObjective, CausalRelation, DataSource, ETLLog, Initiative, KPI antiguo, KPIValue, MeasurementPeriod, AuditLog, Perspective antiguo). Estos se reemplazan con el esquema v4.0 descrito en los requisitos.

> [!WARNING]
> **Se perderán datos del SQLite actual.** Se necesitará ejecutar `php artisan migrate:fresh --seed` para aplicar el nuevo esquema. Cualquier dato de prueba existente se eliminará.

> [!IMPORTANT]
> **Implementación por fases.** Dado el tamaño del sistema, se propone implementar en 8 fases incrementales. Solicito aprobación para comenzar con las **Fases 1–3** (backend + navegación) como primer bloque, entregando un sistema funcional mínimo con admin de organización antes de avanzar a dashboards y scorecards completos.

---

## Proposed Changes

### Fase 1: Backend — Eliminar esquema antiguo y crear nuevo

#### [DELETE] Modelos antiguos

Se eliminarán estos archivos de `app/Models/`:
- [StrategicPlan.php](file:///c:/Code/php/bsc-sys/bsc-sys/app/Models/StrategicPlan.php), [StrategicObjective.php](file:///c:/Code/php/bsc-sys/bsc-sys/app/Models/StrategicObjective.php), [Perspective.php](file:///c:/Code/php/bsc-sys/bsc-sys/app/Models/Perspective.php) (antiguo), [KPI.php](file:///c:/Code/php/bsc-sys/bsc-sys/app/Models/KPI.php) (antiguo), [KPIValue.php](file:///c:/Code/php/bsc-sys/bsc-sys/app/Models/KPIValue.php), [MeasurementPeriod.php](file:///c:/Code/php/bsc-sys/bsc-sys/app/Models/MeasurementPeriod.php), [DataSource.php](file:///c:/Code/php/bsc-sys/bsc-sys/app/Models/DataSource.php), [ETLLog.php](file:///c:/Code/php/bsc-sys/bsc-sys/app/Models/ETLLog.php), [AuditLog.php](file:///c:/Code/php/bsc-sys/bsc-sys/app/Models/AuditLog.php), [CausalRelation.php](file:///c:/Code/php/bsc-sys/bsc-sys/app/Models/CausalRelation.php), [Initiative.php](file:///c:/Code/php/bsc-sys/bsc-sys/app/Models/Initiative.php)

#### [DELETE] Migraciones antiguas

Se eliminarán las 10 migraciones de `database/migrations/` con prefijo `2026_03_31_*` (todas las del esquema v2/v3).

#### [DELETE] Páginas frontend antiguas

Se eliminarán los directorios de `resources/js/pages/`:
- `data-sources/`, `kpis/`, `perspectives/`, `reports/`, `strategic-map/`, `strategic-plans/`, `users/` (se recreará con nuevo esquema)
- [antd-demo.tsx](file:///c:/Code/php/bsc-sys/bsc-sys/resources/js/pages/antd-demo.tsx) (ya no necesario)

Se eliminarán los componentes BSC antiguos de `resources/js/components/bsc/`:
- [kpi-card.tsx](file:///c:/Code/php/bsc-sys/bsc-sys/resources/js/components/bsc/kpi-card.tsx), [perspective-card.tsx](file:///c:/Code/php/bsc-sys/bsc-sys/resources/js/components/bsc/perspective-card.tsx), [traffic-light.tsx](file:///c:/Code/php/bsc-sys/bsc-sys/resources/js/components/bsc/traffic-light.tsx), [index.ts](file:///c:/Code/php/bsc-sys/bsc-sys/resources/js/types/index.ts)

#### [DELETE] Controladores antiguos

Se eliminarán de `app/Http/Controllers/`:
- [DashboardController.php](file:///c:/Code/php/bsc-sys/bsc-sys/app/Http/Controllers/DashboardController.php), [KPIController.php](file:///c:/Code/php/bsc-sys/bsc-sys/app/Http/Controllers/KPIController.php), [PerspectiveController.php](file:///c:/Code/php/bsc-sys/bsc-sys/app/Http/Controllers/PerspectiveController.php), [StrategicPlanController.php](file:///c:/Code/php/bsc-sys/bsc-sys/app/Http/Controllers/StrategicPlanController.php)

---

#### [NEW] Migraciones v4.0

Se crearán migraciones en `database/migrations/`:

1. `2026_03_31_200000_create_nodos_organizacionales_table.php` — Árbol jerárquico dinámico
2. `2026_03_31_200001_add_bsc_fields_to_users_table.php` — Agrega `nodo_id` y `rol_sistema`
3. `2026_03_31_200002_create_periodos_table.php`
4. `2026_03_31_200003_create_scorecards_table.php`
5. `2026_03_31_200004_create_perspectivas_table.php`
6. `2026_03_31_200005_create_kpis_table.php`
7. `2026_03_31_200006_create_kpi_subtareas_table.php`
8. `2026_03_31_200007_create_kpi_distribucion_meta_table.php`
9. `2026_03_31_200008_create_kpi_valores_mensuales_table.php`
10. `2026_03_31_200009_create_kpi_auditoria_table.php`

Esquema exactamente como se define en la sección 11 de los requisitos.

#### [NEW] Modelos Eloquent — `app/Models/`

| Modelo | Relaciones clave |
|---|---|
| `NodoOrganizacional` | `padre()`, `hijos()`, `responsable()`, `scorecards()`, `descendientes()` (recursive) |
| `Periodo` | `abriertoPor()`, `cerradoPor()` |
| `Scorecard` | `nodo()`, `perspectivas()`, `creadoPor()`, `aprobadoPor()`, `kpis()` (hasManyThrough) |
| `Perspectiva` | `scorecard()`, `kpis()`, `pesoTotal()` (accessor) |
| `Kpi` | `perspectiva()`, `subtareas()`, `distribucionMeta()`, `valoresMensuales()`, `scorecard()` (through) |
| `KpiSubtarea` | `kpi()` |
| `KpiDistribucionMeta` | `kpi()` |
| `KpiValorMensual` | `kpi()`, `cargadoPor()` |
| `KpiAuditoria` | `kpiValor()`, `kpi()`, `realizadoPor()` |

#### [MODIFY] [User.php](file:///c:/Code/php/bsc-sys/bsc-sys/app/Models/User.php)
- Agregar relación `nodo()`, accessor `isAdmin()`, `isAltaGerencia()`, método `puedeVerBsc(Scorecard)`, `subordinados()` (basado en jerarquía)

#### [NEW] [BscDatabaseSeeder.php](file:///c:/Code/php/bsc-sys/bsc-sys/database/seeders/BscDatabaseSeeder.php)
- Árbol organizacional inicial (Presidente → VP → Gerencias + Jefatura TI)
- Usuario admin de prueba
- Período 2026 abierto
- Un scorecard de ejemplo con perspectivas y KPIs

#### [MODIFY] [DatabaseSeeder.php](file:///c:/Code/php/bsc-sys/bsc-sys/database/seeders/DatabaseSeeder.php)
- Invocar `BscDatabaseSeeder`

---

### Fase 2: Backend — Controladores, Políticas y Rutas

#### [NEW] `app/Http/Middleware/CheckHierarchyAccess.php`
- Middleware que verifica `admin || nodo en subárbol del usuario` para acceso a BSC de otros

#### [NEW] `app/Policies/ScorecardPolicy.php`
- `view()`, `create()`, `update()`, `approve()`, `loadData()` — basados en jerarquía

#### [NEW] `app/Policies/NodoOrganizacionalPolicy.php`
- Solo admin puede gestionar

#### [NEW] Controladores — `app/Http/Controllers/`

| Controlador | Responsabilidad |
|---|---|
| `DashboardController` | Dashboard según rol (admin/alta_gerencia vs usuario normal) |
| `NodoOrganizacionalController` | CRUD del árbol organizacional |
| `UsuarioController` | CRUD de usuarios + asignación a nodos |
| `PeriodoController` | Gestión de períodos anuales |
| `ScorecardController` | CRUD + flujo de estados + clonación |
| `PerspectivaController` | CRUD perspectivas dentro de un scorecard |
| `KpiController` | CRUD KPIs + aprobación individual |
| `KpiValorController` | Carga de datos mensuales + lógica de cálculo |

#### [NEW] Form Requests — `app/Http/Requests/`
- `StoreNodoRequest`, `StoreScorecardRequest`, `StoreKpiRequest`, `StoreKpiValorRequest`, etc.

#### [NEW] `app/Services/BscCalculationService.php`
- Encapsula la lógica de cálculo: acumulados, % logro, semáforo, score global
- Idéntico a las fórmulas del Excel de referencia

#### [MODIFY] [web.php](file:///c:/Code/php/bsc-sys/bsc-sys/routes/web.php)
- Reemplazar rutas antiguas con la estructura de pantallas del requisito §10

---

### Fase 3: Frontend — Navegación y Tipos

#### [MODIFY] [app-sidebar.tsx](file:///c:/Code/php/bsc-sys/bsc-sys/resources/js/components/app-sidebar.tsx)
- Reemplazar `mainNavItems` con nueva estructura:
  - Panel de control (`/dashboard`)
  - Scorecards (`/scorecards`)
  - Sección Admin (condicional a rol): Organización, Usuarios, Períodos, Plantillas
  - Configuración (`/settings`)

#### [NEW] `resources/js/types/bsc.ts`
- Interfaces TypeScript: `NodoOrganizacional`, `Scorecard`, `Perspectiva`, `Kpi`, `KpiSubtarea`, `KpiDistribucionMeta`, `KpiValorMensual`, `Periodo`, etc.

#### [MODIFY] [index.ts](file:///c:/Code/php/bsc-sys/bsc-sys/resources/js/types/index.ts)
- Agregar `export type * from './bsc'`

#### [MODIFY] [auth.ts](file:///c:/Code/php/bsc-sys/bsc-sys/resources/js/types/auth.ts)
- Agregar campos `nodo_id`, `rol_sistema`, `nodo?` al tipo [User](file:///c:/Code/php/bsc-sys/bsc-sys/app/Models/User.php#14-35)

---

### Fase 4: Frontend — Admin Pages

#### [NEW] `resources/js/pages/admin/organizacion/index.tsx`
- Árbol interactivo con Ant Design `Tree` component
- CRUD modal para crear/editar nodos
- Drag & drop para mover nodos (cambiar `padre_id`)
- Indicador de estado del Scorecard por nodo

#### [NEW] `resources/js/pages/admin/usuarios/index.tsx`
- Tabla de usuarios con Ant Design `Table`
- Formulario de crear/editar usuario con selector de nodo (TreeSelect)

#### [NEW] `resources/js/pages/admin/periodos/index.tsx`
- Lista de períodos con acciones (abrir/cerrar/bloquear)

#### [NEW] `resources/js/pages/admin/plantillas/index.tsx`
- Lista de Scorecards marcados como plantilla

---

### Fase 5: Frontend — Dashboards

#### [NEW] [resources/js/pages/dashboard.tsx](file:///c:/Code/php/bsc-sys/bsc-sys/resources/js/pages/dashboard.tsx) (reescritura total)
- Detecta rol del usuario:
  - **Admin / Alta Gerencia:** Muestra árbol interactivo + panel consolidado (RF-02)
  - **Cualquier otro:** Muestra BSC resumen propio (RF-03)
- Panel consolidado: stats de Scorecards activos, distribución semáforos, tabla comparativa

---

### Fase 6: Frontend — Scorecards y KPIs

#### [NEW] `resources/js/pages/scorecards/index.tsx`
- Lista de scorecards visibles según jerarquía

#### [NEW] `resources/js/pages/scorecards/nuevo.tsx`
- Wizard: elegir nodo + año + opción de clonar plantilla

#### [NEW] `resources/js/pages/scorecards/[id]/index.tsx`
- Dashboard del BSC individual (RF-03): tabla con perspectivas, KPIs, pesos, metas, semáforos

#### [NEW] `resources/js/pages/scorecards/[id]/editar.tsx`
- Configurar perspectivas y proponer KPIs (solo en borrador)

#### [NEW] `resources/js/pages/scorecards/[id]/revision.tsx`
- Vista de aprobación para el superior

#### [NEW] `resources/js/pages/scorecards/[id]/kpis/[kpiId]/index.tsx`
- Ficha mensual del KPI (RF-04): tabla 12 meses, gráfico de líneas, sub-tareas

#### [NEW] `resources/js/pages/scorecards/[id]/kpis/[kpiId]/cargar.tsx`
- Formulario de carga de valor real mensual

#### [NEW] `resources/js/pages/scorecards/[id]/exportar.tsx`
- Controles de exportación Excel/PDF

---

### Fase 7: Importación/Exportación

#### [NEW] `app/Services/ExcelImportService.php`
- Parsear plantilla Excel BSC y extraer valores reales por hoja y mes
- Previsualización de cambios

#### [NEW] `app/Services/ExcelExportService.php`
- Generar Excel replicando formato de `BSC_Jefe_de_TI.xlsx`
- Hoja resumen + hojas individuales por KPI

Paquete necesario: `maatwebsite/excel` (Laravel Excel)

---

### Fase 8: Verificación

No se encontraron tests que cubran la funcionalidad BSC en la suite actual — solo existe [DashboardTest.php](file:///c:/Code/php/bsc-sys/bsc-sys/tests/Feature/DashboardTest.php) que verifica navegación básica.

---

## Verification Plan

### Automated Tests

**Comando para ejecutar:** `cd c:\Code\php\bsc-sys\bsc-sys && php artisan test`

Se crearán los siguientes tests Pest en `tests/Feature/`:

1. **`NodoOrganizacionalTest.php`** — CRUD nodos, validación de jerarquía, solo admin
2. **`ScorecardTest.php`** — CRUD scorecard, flujo de estados, permisos por jerarquía
3. **`KpiValorTest.php`** — Carga de datos, cálculo de acumulados, semáforos, auditoría
4. **`BscCalculationTest.php`** — Unit tests en `tests/Unit/` para el servicio de cálculos:
   - `pct_logro_mensual = null` cuando meta = 0
   - Acumulados correctos
   - Semáforos según umbrales
   - Score global ponderado
5. **`VisibilidadJerarquicaTest.php`** — Verificar que un usuario solo ve BSC de su subárbol

### Manual Verification

1. **Iniciar la aplicación:** `cd c:\Code\php\bsc-sys\bsc-sys && composer dev`
2. **Login como admin** y verificar:
   - El sidebar muestra las secciones de Admin
   - Se puede crear el árbol organizacional
   - Se puede crear un período
3. **Crear un Scorecard** con perspectivas y KPIs, enviarlo a revisión
4. **Login como usuario supervisor** y verificar la aprobación del Scorecard
5. **Cargar datos mensuales** y verificar que los cálculos y semáforos son correctos
6. **Verificar visibilidad**: un usuario normal NO puede ver BSC de otro nodo fuera de su subárbol

---

## Orden de implementación sugerido

| Bloque | Fases | Entregable |
|---|---|---|
| **Bloque 1** | Fases 1–3 | Backend completo + navegación. Sistema funcional con `migrate:fresh --seed` |
| **Bloque 2** | Fases 4–5 | Admin pages + dashboards. Interfaz operativa completa |
| **Bloque 3** | Fases 6 | Scorecards + KPIs. Flujo de trabajo completo |
| **Bloque 4** | Fases 7–8 | Import/Export Excel + tests + verificación final |

> [!TIP]
> Solicito aprobación para comenzar con el **Bloque 1** (Fases 1–3). Esto entrega el esquema de base de datos completo, modelos con relaciones, controladores con permisos jerárquicos, y la navegación actualizada — todo verificable con `migrate:fresh --seed`.
