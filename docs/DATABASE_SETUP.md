# ✅ Configuración de SQLite - Completada

**Fecha**: 31 de Marzo de 2026  
**Base de Datos**: SQLite 3.43.2  
**Ubicación**: `database/database.sqlite`

---

## 📊 Estado de la Base de Datos

### Configuración Aplicada

```env
DB_CONNECTION=sqlite
APP_LOCALE=es
APP_FALLBACK_LOCALE=es
APP_NAME="BSC Scorecard"
```

### Optimizaciones SQLite

```php
// config/database.php
'sqlite' => [
    'busy_timeout' => 5000,      // Timeout de 5 segundos para concurrencia
    'journal_mode' => 'WAL',     // Write-Ahead Logging para mejor performance
    'synchronous' => 'NORMAL',   // Balance entre seguridad y velocidad
    'foreign_key_constraints' => true, // Integridad referencial activada
]
```

---

## 🗄️ Tablas Creadas (20 tablas)

### Tablas Laravel Base (7)
- ✅ `users` - Usuarios del sistema
- ✅ `password_reset_tokens` - Tokens de reset
- ✅ `sessions` - Sesiones activas
- ✅ `cache` - Cache de Laravel
- ✅ `cache_locks` - Locks de cache
- ✅ `jobs` - Cola de trabajos
- ✅ `job_batches` - Batches de jobs
- ✅ `failed_jobs` - Jobs fallidos

### Tablas BSC Core (11)

#### 1. strategic_plans
Plan estratégico maestro (ej: Plan 2026)
```
- id, name, year, status, description
- status: active | archived
```

#### 2. perspectives
Perspectivas BSC (Financiera, Cliente, Procesos, Aprendizaje, Personalizada)
```
- id, strategic_plan_id, name, type, order, active, color, description
- type: financial | customer | process | learning | custom
```

#### 3. strategic_objectives
Objetivos estratégicos por perspectiva
```
- id, perspective_id, owner_id, name, description
- start_date, end_date, active
```

#### 4. kpis
Indicadores clave de desempeño
```
- id, strategic_objective_id, owner_id, name, formula
- unit, frequency, target
- threshold_green (0.95 = 95%)
- threshold_yellow (0.80 = 80%)
- active, audit_trail
- frequency: daily | monthly | quarterly | annual
```

#### 5. measurement_periods
Periodos de medición (mensual, trimestral, anual)
```
- id, year, month, quarter, status
- start_date, end_date
- status: open | closed | locked
- UNIQUE(year, month, quarter)
```

#### 6. kpi_values
Valores de KPIs por periodo
```
- id, kpi_id, measurement_period_id, loaded_by_user_id
- value, traffic_light, source_type, source_id
- superseded, notes
- traffic_light: green | yellow | red | grey
- source_type: manual | excel | connector | api
- UNIQUE(kpi_id, measurement_period_id, superseded)
```

#### 7. causal_relations
Relaciones causa-efecto entre objetivos (para mapa estratégico)
```
- id, cause_objective_id, effect_objective_id
- description, strength (1-10)
- UNIQUE(cause_objective_id, effect_objective_id)
```

#### 8. initiatives
Iniciativas estratégicas vinculadas a objetivos
```
- id, strategic_objective_id, owner_id, name
- status, progress_percentage, budget, spent
- start_date, end_date
- status: planned | in_progress | completed | cancelled
```

#### 9. data_sources
Fuentes de datos para ETL
```
- id, name, type, config (JSON cifrado)
- active, cron_expression, last_run_at
- type: sql_server | mysql | postgresql | oracle | rest_api | file
```

#### 10. etl_logs
Logs de procesos ETL (inmutables)
```
- id, data_source_id, triggered_by, status
- total_records, success_count, failed_count
- error_details (JSON), started_at, completed_at
- status: running | success | partial | failed
```

#### 11. audit_logs
Logs de auditoría (inmutables)
```
- id, user_id, action, entity_type, entity_id
- metadata (JSON), ip_address, user_agent
- action: LOAD_DATA | LOGIN | EXPORT | UPDATE_KPI | etc.
```

---

## 🔄 Migraciones Ejecutadas

```bash
Batch 1 (Inicial):
  ✅ 0001_01_01_000000_create_users_table
  ✅ 0001_01_01_000001_create_cache_table
  ✅ 0001_01_01_000002_create_jobs_table
  ✅ 2025_08_14_170933_add_two_factor_columns_to_users_table

Batch 2 (BSC System):
  ✅ 2026_03_31_025150_create_etl_logs_table
  ✅ 2026_03_31_025151_create_audit_logs_table
  ✅ 2026_03_31_025151_create_initiatives_table
  ✅ 2026_03_31_025151_create_strategic_plans_table
  ✅ 2026_03_31_025152_create_perspectives_table
  ✅ 2026_03_31_025153_create_measurement_periods_table
  ✅ 2026_03_31_025153_create_strategic_objectives_table
  ✅ 2026_03_31_025154_create_causal_relations_table
  ✅ 2026_03_31_025154_create_kpi_values_table
  ✅ 2026_03_31_025154_create_kpis_table
  ✅ 2026_03_31_025155_create_data_sources_table
```

**Total**: 15 migraciones ejecutadas ✅

---

## 🔐 Seguridad

### Foreign Key Constraints
Todas las relaciones tienen integridad referencial activada:
- `CASCADE ON DELETE` para relaciones padre-hijo
- Previene datos huérfanos automáticamente

### Soft Deletes
Tablas con soft deletes (no se eliminan físicamente):
- `strategic_plans`
- `perspectives`
- `strategic_objectives`
- `kpis`
- `initiatives`
- `data_sources`

### Logs Inmutables
Las tablas `audit_logs` y `etl_logs` **NO tienen soft deletes** - son permanentes para cumplir requisitos de auditoría (RNF-18, RNF-41).

---

## 📈 Índices Creados

Índices optimizados para consultas frecuentes:

```sql
-- Perspectivas
INDEX(strategic_plan_id, active, order)

-- Objetivos
INDEX(perspective_id, active)
INDEX(owner_id)

-- KPIs
INDEX(strategic_objective_id, active)
INDEX(owner_id)
INDEX(frequency, active)

-- Valores KPI
INDEX(kpi_id, traffic_light)
INDEX(measurement_period_id)
INDEX(created_at)
UNIQUE(kpi_id, measurement_period_id, superseded)

-- Periodos
INDEX(year, status)
UNIQUE(year, month, quarter)

-- Logs
INDEX(user_id, created_at)
INDEX(entity_type, entity_id)
INDEX(action)
INDEX(data_source_id, status)
```

---

## 🧪 Verificación

### Ver estado de migraciones
```bash
php artisan migrate:status
```

### Ver información de la DB
```bash
php artisan db:show
```

### Acceder a la DB con SQLite CLI
```bash
# Windows
sqlite3 database\database.sqlite

# Linux/Mac
sqlite3 database/database.sqlite
```

### Consultas útiles
```sql
-- Ver todas las tablas
SELECT name FROM sqlite_master WHERE type='table';

-- Contar registros en users
SELECT COUNT(*) FROM users;

-- Ver estructura de una tabla
PRAGMA table_info(kpis);

-- Ver índices de una tabla
PRAGMA index_list(kpis);

-- Ver foreign keys
PRAGMA foreign_key_list(kpi_values);
```

---

## 📝 Comandos Laravel DB

```bash
# Fresh migration (WARNING: borra todos los datos)
php artisan migrate:fresh

# Fresh + seeders
php artisan migrate:fresh --seed

# Rollback última migración
php artisan migrate:rollback

# Rollback todas
php artisan migrate:reset

# Ver SQL de una migración sin ejecutar
php artisan migrate --pretend
```

---

## 🎯 Próximos Pasos

1. **Crear Models Eloquent** para cada tabla
2. **Implementar Seeders** con datos de prueba
3. **Crear Factories** para testing
4. **Implementar Repositories** (opcional, patrón repositorio)
5. **Crear API Controllers** para cada entidad

---

## 📊 Diagrama ER Simplificado

```
StrategicPlan (1) ─────┐
                       │
                       ▼
              Perspective (N) ─────┐
                                   │
                                   ▼
                      StrategicObjective (N) ─────┬────┐
                                   │              │    │
                         ┌─────────┴────┐         │    │
                         ▼              ▼         ▼    ▼
                      KPI (N)     Initiative  CausalRelation
                         │
                         ▼
                   KPIValue (N) ──► MeasurementPeriod
                         │
                         ├──► DataSource ──► ETLLog
                         │
                         └──► User ──► AuditLog
```

---

## ⚡ Performance

### Configuración WAL (Write-Ahead Logging)
```php
'journal_mode' => 'WAL'
```

**Ventajas**:
- Lecturas y escrituras simultáneas
- Mejor performance en concurrencia
- Menos bloqueos

**Archivos generados**:
- `database.sqlite` - Base de datos principal
- `database.sqlite-wal` - Write-ahead log
- `database.sqlite-shm` - Shared memory

---

## 🐛 Troubleshooting

### Error: "database is locked"
**Solución**: Aumentar `busy_timeout`:
```php
'busy_timeout' => 10000, // 10 segundos
```

### Foreign key constraint failed
**Solución**: Verificar que existen los registros relacionados antes de insertar.

### Ver queries ejecutados
```php
// En código
DB::enableQueryLog();
// ... hacer queries
dd(DB::getQueryLog());
```

---

**Estado**: ✅ **BASE DE DATOS LISTA** para desarrollo

**Siguiente fase**: Implementar Models Eloquent (Fase 1, T1.1)
