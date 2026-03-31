# 📦 Referencia de Models Eloquent - BSC System

**Fecha**: 31 de Marzo de 2026  
**Total Models**: 11 modelos core + 1 modelo User (Laravel base)

---

## 📋 Resumen de Models Implementados

| # | Modelo | Tabla | Soft Deletes | Relaciones | Características |
|---|--------|-------|--------------|------------|-----------------|
| 1 | **StrategicPlan** | strategic_plans | ✅ | perspectives | status, archived scope |
| 2 | **Perspective** | perspectives | ✅ | plan, objectives | type, default colors |
| 3 | **StrategicObjective** | strategic_objectives | ✅ | perspective, owner, kpis, causal | period validation |
| 4 | **KPI** | kpis | ✅ | objective, owner, values | traffic light calc |
| 5 | **MeasurementPeriod** | measurement_periods | ✅ | kpiValues | status (open/closed/locked) |
| 6 | **KPIValue** | kpi_values | ❌ | kpi, period, user | **Inmutable** |
| 7 | **CausalRelation** | causal_relations | ❌ | cause/effect objectives | strength 1-10 |
| 8 | **Initiative** | initiatives | ✅ | objective, owner | progress, budget |
| 9 | **DataSource** | data_sources | ✅ | etlLogs | config JSON, cron |
| 10 | **ETLLog** | etl_logs | ❌ | dataSource | **Inmutable** |
| 11 | **AuditLog** | audit_logs | ❌ | user | **Inmutable** |

---

## 🔑 Características Comunes

### ✅ Todos los Models Tienen:
- `declare(strict_types=1);` — PHP strict mode
- `HasFactory` trait para factories
- PHPDoc completo con `@property` annotations
- `$fillable` array completo
- `$casts` para type safety
- Relaciones con type hints
- Métodos helper cuando aplica

### 🗑️ Soft Deletes vs Inmutables
- **Con SoftDeletes**: StrategicPlan, Perspective, StrategicObjective, KPI, MeasurementPeriod, Initiative, DataSource
- **Sin SoftDeletes (inmutables)**: KPIValue, CausalRelation, ETLLog, AuditLog

---

## 📊 Models Core BSC

### 1. StrategicPlan
**Propósito**: Plan estratégico de la organización

```php
// Campos principales
- name: string
- description: string|null
- status: enum('draft', 'active', 'archived')
- start_date: date
- end_date: date

// Relaciones
- perspectives(): HasMany<Perspective>

// Scopes
- active(): solo planes activos
- archived(): solo planes archivados
- ordered(): ordenados por fecha de inicio DESC

// Métodos
- isActive(): bool
- archive(): void
- activate(): void
```

**Ejemplo de uso**:
```php
$plan = StrategicPlan::active()->first();
$plan->perspectives; // Cargar perspectivas
$plan->archive();    // Archivar plan
```

---

### 2. Perspective
**Propósito**: Perspectivas del BSC (Financiera, Cliente, Procesos, Aprendizaje, Personalizada)

```php
// Campos principales
- strategic_plan_id: int
- name: string
- type: enum('financial', 'customer', 'process', 'learning', 'custom')
- icon: string|null
- color: string (#hex)
- display_order: int

// Relaciones
- strategicPlan(): BelongsTo<StrategicPlan>
- objectives(): HasMany<StrategicObjective>

// Scopes
- ordered(): por display_order
- ofType(string $type): filtrar por tipo

// Métodos
- isFinancial(): bool
- isCustom(): bool
- getDefaultColor(): string (según tipo)
```

**Colores por defecto**:
```php
'financial' => '#3b82f6',  // blue
'customer'  => '#10b981',  // green
'process'   => '#f59e0b',  // amber
'learning'  => '#8b5cf6',  // purple
'custom'    => '#6b7280',  // gray
```

**Ejemplo de uso**:
```php
$perspective = Perspective::ofType('financial')->first();
$perspective->getDefaultColor(); // '#3b82f6'
$perspective->objectives;        // Cargar objetivos
```

---

### 3. StrategicObjective
**Propósito**: Objetivos estratégicos por perspectiva

```php
// Campos principales
- perspective_id: int
- owner_id: int
- name: string
- description: string|null
- target_date: date|null
- completion_percentage: decimal|null

// Relaciones
- perspective(): BelongsTo<Perspective>
- owner(): BelongsTo<User>
- kpis(): HasMany<KPI>
- causedObjectives(): HasMany<StrategicObjective> (para mapa estratégico)
- causingObjectives(): HasMany<StrategicObjective>

// Scopes
- inProgress(): completion < 100%
- completed(): completion >= 100%

// Métodos
- isCompleted(): bool
- isInActivePeriod(): bool (validar fechas)
```

**Ejemplo de uso**:
```php
$objective = StrategicObjective::inProgress()
    ->with(['kpis', 'owner'])
    ->first();
    
$objective->isInActivePeriod(); // true/false
$objective->causedObjectives;   // Objetivos que dependen de este
```

---

### 4. KPI
**Propósito**: Indicadores clave de desempeño

```php
// Campos principales
- strategic_objective_id: int
- owner_id: int
- name: string
- formula: string|null (e.g., "Ventas / Clientes")
- unit: string (%, $, #, días, etc.)
- frequency: enum('daily', 'monthly', 'quarterly', 'annual')
- target: decimal
- threshold_green: decimal (e.g., 0.95 = 95%)
- threshold_yellow: decimal (e.g., 0.80 = 80%)
- active: boolean
- audit_trail: boolean (para KPIs financieros)
- description: string|null

// Relaciones
- strategicObjective(): BelongsTo<StrategicObjective>
- owner(): BelongsTo<User>
- values(): HasMany<KPIValue> (solo no superseded)
- latestValue(): HasOne<KPIValue>

// Scopes
- active(): solo KPIs activos
- frequency(string $freq): filtrar por frecuencia
- financial(): solo con audit_trail

// Métodos
- calculateTrafficLight(float $value): string ('green'|'yellow'|'red')
- calculateCompliance(float $value): float (porcentaje)
- isFinancial(): bool
```

**Lógica de semáforos**:
```php
$kpi = KPI::find(1);
$kpi->target = 100;
$kpi->threshold_green = 0.95;  // 95%
$kpi->threshold_yellow = 0.80; // 80%

$kpi->calculateTrafficLight(97);  // 'green'  (97% >= 95%)
$kpi->calculateTrafficLight(85);  // 'yellow' (85% >= 80%)
$kpi->calculateTrafficLight(75);  // 'red'    (75% < 80%)

$kpi->calculateCompliance(97);    // 97.00
```

**Ejemplo de uso**:
```php
$kpi = KPI::active()
    ->with(['values', 'owner'])
    ->where('frequency', 'monthly')
    ->first();

$value = $kpi->latestValue;
$trafficLight = $kpi->calculateTrafficLight($value->value);
```

---

### 5. MeasurementPeriod
**Propósito**: Períodos de medición (años, meses, trimestres)

```php
// Campos principales
- year: int (e.g., 2026)
- month: int|null (1-12)
- quarter: int|null (1-4)
- status: enum('open', 'closed', 'locked')
- start_date: date
- end_date: date

// Relaciones
- kpiValues(): HasMany<KPIValue>

// Scopes
- open(): solo períodos abiertos
- closed(): solo períodos cerrados
- byYear(int $year): filtrar por año

// Métodos
- isClosed(): bool
- isLocked(): bool
```

**Ejemplo de uso**:
```php
// Período mensual: Enero 2026
$period = MeasurementPeriod::create([
    'year' => 2026,
    'month' => 1,
    'status' => 'open',
    'start_date' => '2026-01-01',
    'end_date' => '2026-01-31',
]);

// Período trimestral: Q1 2026
$period = MeasurementPeriod::create([
    'year' => 2026,
    'quarter' => 1,
    'status' => 'open',
    'start_date' => '2026-01-01',
    'end_date' => '2026-03-31',
]);

// Cerrar período (no se pueden agregar más valores)
$period->update(['status' => 'closed']);
$period->isClosed(); // true
```

---

### 6. KPIValue ⚠️ INMUTABLE
**Propósito**: Valores capturados para KPIs en un período

```php
// Campos principales
- kpi_id: int
- measurement_period_id: int
- loaded_by_user_id: int
- value: decimal
- traffic_light: enum('red', 'yellow', 'green', 'grey')
- source_type: string|null ('manual', 'api', 'file', 'sql_query')
- source_id: int|null (ID del ETLLog si aplica)
- superseded: boolean (para versionado)
- notes: string|null

// Relaciones
- kpi(): BelongsTo<KPI>
- measurementPeriod(): BelongsTo<MeasurementPeriod>
- loadedByUser(): BelongsTo<User>

// Scopes
- notSuperseded(): solo valores actuales
- byTrafficLight(string $color): filtrar por semáforo

// ⚠️ NO tiene SoftDeletes
// Los valores son inmutables para auditoría
```

**Constraint único**: (kpi_id, measurement_period_id, superseded)
- Solo puede haber un registro con `superseded = false` por KPI y período
- Si se carga un nuevo valor, el anterior se marca como `superseded = true`

**Ejemplo de uso**:
```php
// Cargar valor inicial
$value = KPIValue::create([
    'kpi_id' => 1,
    'measurement_period_id' => 5,
    'loaded_by_user_id' => auth()->id(),
    'value' => 85.5,
    'traffic_light' => 'yellow',
    'source_type' => 'manual',
    'superseded' => false,
]);

// Corregir valor (versionar)
$oldValue = KPIValue::where('kpi_id', 1)
    ->where('measurement_period_id', 5)
    ->where('superseded', false)
    ->first();
    
$oldValue->update(['superseded' => true]);

$newValue = KPIValue::create([
    'kpi_id' => 1,
    'measurement_period_id' => 5,
    'loaded_by_user_id' => auth()->id(),
    'value' => 87.2, // Valor corregido
    'traffic_light' => 'yellow',
    'source_type' => 'manual',
    'superseded' => false,
    'notes' => 'Corrección por error de captura',
]);

// Historial completo (incluyendo valores superados)
$history = KPIValue::where('kpi_id', 1)
    ->where('measurement_period_id', 5)
    ->orderBy('created_at', 'desc')
    ->get();
```

---

### 7. CausalRelation
**Propósito**: Relaciones causa-efecto entre objetivos (para mapa estratégico)

```php
// Campos principales
- cause_objective_id: int
- effect_objective_id: int
- description: string|null
- strength: int (1-10, intensidad de la relación)

// Relaciones
- causeObjective(): BelongsTo<StrategicObjective>
- effectObjective(): BelongsTo<StrategicObjective>

// ⚠️ NO tiene SoftDeletes
```

**Ejemplo de uso**:
```php
// "Aumentar satisfacción del cliente" → "Aumentar ventas"
CausalRelation::create([
    'cause_objective_id' => 3, // Satisfacción del cliente
    'effect_objective_id' => 1, // Ventas
    'description' => 'Clientes satisfechos compran más',
    'strength' => 8, // Relación fuerte
]);

// Obtener objetivos que causan efectos en otro
$objective = StrategicObjective::find(1);
$causes = $objective->causingObjectives; // Objetivos que lo causan
$effects = $objective->causedObjectives; // Objetivos que causa
```

---

### 8. Initiative
**Propósito**: Iniciativas y proyectos estratégicos

```php
// Campos principales
- strategic_objective_id: int
- owner_id: int
- name: string
- description: string|null
- status: enum('planned', 'in_progress', 'completed', 'cancelled')
- progress_percentage: decimal|null (0-100)
- budget: decimal|null
- spent: decimal|null
- start_date: date|null
- end_date: date|null

// Relaciones
- strategicObjective(): BelongsTo<StrategicObjective>
- owner(): BelongsTo<User>

// Scopes
- inProgress(): status = 'in_progress'
- completed(): status = 'completed'
```

**Ejemplo de uso**:
```php
$initiative = Initiative::create([
    'strategic_objective_id' => 2,
    'owner_id' => auth()->id(),
    'name' => 'Implementar CRM',
    'status' => 'in_progress',
    'progress_percentage' => 45.5,
    'budget' => 50000,
    'spent' => 22500,
    'start_date' => '2026-01-01',
    'end_date' => '2026-06-30',
]);

// Actualizar progreso
$initiative->update(['progress_percentage' => 60.0]);
```

---

## 🔌 Models de Integración

### 9. DataSource
**Propósito**: Fuentes de datos externas para alimentar KPIs

```php
// Campos principales
- name: string
- type: enum('sql_server', 'mysql', 'postgresql', 'oracle', 'rest_api', 'file')
- config: array (JSON) — credenciales, endpoints, etc.
- active: boolean
- cron_expression: string|null (e.g., '0 0 * * *' = diario a medianoche)
- last_run_at: datetime|null
- description: string|null

// Relaciones
- etlLogs(): HasMany<ETLLog>

// Casts
- config: 'array' (automáticamente JSON <-> array)
```

**Ejemplo de configuración**:
```php
// SQL Server
$sqlServer = DataSource::create([
    'name' => 'ERP Principal',
    'type' => 'sql_server',
    'config' => [
        'host' => '192.168.1.100',
        'port' => 1433,
        'database' => 'ERP_DB',
        'username' => 'etl_user',
        'password' => encrypt('secret'), // ⚠️ Encriptar passwords
    ],
    'active' => true,
    'cron_expression' => '0 2 * * *', // 2 AM diario
]);

// REST API
$api = DataSource::create([
    'name' => 'Google Analytics API',
    'type' => 'rest_api',
    'config' => [
        'base_url' => 'https://analytics.google.com/api/v4',
        'auth_type' => 'oauth2',
        'client_id' => 'xxx',
        'client_secret' => encrypt('yyy'),
        'refresh_token' => encrypt('zzz'),
    ],
    'active' => true,
]);
```

---

### 10. ETLLog ⚠️ INMUTABLE
**Propósito**: Log de ejecuciones de procesos ETL

```php
// Campos principales
- data_source_id: int
- triggered_by: string|null ('manual', 'cron', 'api')
- status: enum('running', 'success', 'partial', 'failed')
- total_records: int|null
- success_count: int|null
- failed_count: int|null
- error_details: array|null (JSON)
- started_at: datetime|null
- completed_at: datetime|null

// Relaciones
- dataSource(): BelongsTo<DataSource>

// Scopes
- successful(): status = 'success'
- failed(): status = 'failed'

// ⚠️ NO tiene SoftDeletes
```

**Ejemplo de uso**:
```php
// Iniciar ejecución ETL
$log = ETLLog::create([
    'data_source_id' => 1,
    'triggered_by' => 'cron',
    'status' => 'running',
    'started_at' => now(),
]);

// ... procesar datos ...

// Finalizar con éxito
$log->update([
    'status' => 'success',
    'total_records' => 100,
    'success_count' => 98,
    'failed_count' => 2,
    'error_details' => ['rows' => [5, 23]],
    'completed_at' => now(),
]);

// Consultar últimas ejecuciones
$recentLogs = ETLLog::where('data_source_id', 1)
    ->orderBy('started_at', 'desc')
    ->take(10)
    ->get();
```

---

### 11. AuditLog ⚠️ INMUTABLE
**Propósito**: Auditoría completa de acciones del sistema

```php
// Campos principales
- user_id: int|null (null si fue acción del sistema)
- action: string (e.g., 'kpi.create', 'user.login', 'kpi_value.update')
- entity_type: string (e.g., 'KPI', 'User', 'StrategicPlan')
- entity_id: int|null
- metadata: array (JSON) — datos adicionales
- ip_address: string|null
- user_agent: string|null

// Relaciones
- user(): BelongsTo<User>

// Scopes
- byAction(string $action): filtrar por acción
- byUser(int $userId): filtrar por usuario

// ⚠️ NO tiene SoftDeletes
```

**Ejemplo de uso**:
```php
// Registrar creación de KPI
AuditLog::create([
    'user_id' => auth()->id(),
    'action' => 'kpi.create',
    'entity_type' => 'KPI',
    'entity_id' => $kpi->id,
    'metadata' => [
        'name' => $kpi->name,
        'target' => $kpi->target,
    ],
    'ip_address' => request()->ip(),
    'user_agent' => request()->userAgent(),
]);

// Registrar cambio de valor de KPI
AuditLog::create([
    'user_id' => auth()->id(),
    'action' => 'kpi_value.update',
    'entity_type' => 'KPIValue',
    'entity_id' => $value->id,
    'metadata' => [
        'kpi_id' => $value->kpi_id,
        'old_value' => $oldValue,
        'new_value' => $value->value,
        'reason' => 'Corrección por error de captura',
    ],
    'ip_address' => request()->ip(),
    'user_agent' => request()->userAgent(),
]);

// Consultar historial de un usuario
$userHistory = AuditLog::byUser(auth()->id())
    ->orderBy('created_at', 'desc')
    ->paginate(20);

// Consultar todas las modificaciones de un KPI
$kpiHistory = AuditLog::where('entity_type', 'KPI')
    ->where('entity_id', 5)
    ->orderBy('created_at', 'desc')
    ->get();
```

---

## 🧪 Testing Models

### Factory Pattern
```php
// Crear datos de prueba con factories
use App\Models\StrategicPlan;
use App\Models\Perspective;
use App\Models\KPI;

$plan = StrategicPlan::factory()->create();

$perspective = Perspective::factory()
    ->for($plan)
    ->create(['type' => 'financial']);

$kpi = KPI::factory()
    ->for($perspective->objectives()->first())
    ->create([
        'target' => 100,
        'threshold_green' => 0.95,
        'threshold_yellow' => 0.80,
    ]);
```

### Seeders
```bash
php artisan make:seeder StrategicPlanSeeder
php artisan make:seeder BSCDemoSeeder
```

---

## 📚 Relaciones Complejas

### Cargar Datos Anidados
```php
// Cargar plan completo con todas sus relaciones
$plan = StrategicPlan::with([
    'perspectives' => function ($query) {
        $query->ordered();
    },
    'perspectives.objectives' => function ($query) {
        $query->inProgress();
    },
    'perspectives.objectives.kpis' => function ($query) {
        $query->active();
    },
    'perspectives.objectives.kpis.latestValue',
])->active()->first();

// Acceder a los datos
foreach ($plan->perspectives as $perspective) {
    foreach ($perspective->objectives as $objective) {
        foreach ($objective->kpis as $kpi) {
            $value = $kpi->latestValue;
            $trafficLight = $kpi->calculateTrafficLight($value->value);
            // ...
        }
    }
}
```

### Mapa Estratégico (Relaciones Causales)
```php
// Obtener todas las relaciones causales del plan
$plan = StrategicPlan::with([
    'perspectives.objectives.causedObjectives',
    'perspectives.objectives.causingObjectives',
])->find(1);

// Construir grafo de dependencias
$graph = [];
foreach ($plan->perspectives as $perspective) {
    foreach ($perspective->objectives as $objective) {
        $graph[] = [
            'id' => $objective->id,
            'name' => $objective->name,
            'causes' => $objective->causedObjectives->pluck('id'),
            'caused_by' => $objective->causingObjectives->pluck('id'),
        ];
    }
}
```

---

## 🔒 Consideraciones de Seguridad

### 1. Encriptar Credenciales
```php
// ⚠️ SIEMPRE encriptar passwords en config
$dataSource->config = [
    'password' => encrypt('secret_password'),
];

// Desencriptar al usar
$password = decrypt($dataSource->config['password']);
```

### 2. Mass Assignment Protection
```php
// ✅ TODOS los models tienen $fillable definido
// No se puede hacer mass assignment de campos no listados
```

### 3. Audit Trail
```php
// KPIs financieros SIEMPRE con audit_trail = true
$kpi = KPI::create([
    'name' => 'Revenue',
    'audit_trail' => true, // ⚠️ Obligatorio para financieros
]);

// Registrar en AuditLog
AuditLog::create([
    'user_id' => auth()->id(),
    'action' => 'kpi.create',
    'entity_type' => 'KPI',
    'entity_id' => $kpi->id,
]);
```

### 4. Períodos Cerrados
```php
// NO permitir cargar valores en períodos cerrados/locked
$period = MeasurementPeriod::find(1);

if ($period->isClosed() || $period->isLocked()) {
    throw new \Exception('Cannot load values in closed period');
}
```

---

## 📖 Recursos Adicionales

- **Ubicación**: `D:\code\javascript\BSC SYS\bsc-sys\app\Models\`
- **Migraciones**: `database/migrations/`
- **Documentación BD**: `docs/DATABASE_SETUP.md`
- **Arquitectura**: `docs/ARCHITECTURE.md`
- **Tests**: `tests/Unit/Models/` (por crear)

---

## ✅ Checklist de Implementación

- [x] 11 Models Eloquent creados
- [x] Relaciones configuradas
- [x] Scopes implementados
- [x] Métodos helper agregados
- [x] PHPDoc completo
- [x] Casts configurados
- [ ] Factories creadas (pendiente)
- [ ] Seeders creados (pendiente)
- [ ] Tests unitarios (pendiente)

---

**Última Actualización**: 31 de Marzo de 2026  
**Estado**: ✅ **COMPLETADO**
