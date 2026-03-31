# Setup del Proyecto BSC Scorecard

## Prerrequisitos

- PHP 8.3+
- Composer 2.x
- Node.js 20+ y npm
- SQLite3 (ya incluido en PHP)

## Comandos de Inicialización

### 1. Crear proyecto Laravel

```bash
# Crear proyecto Laravel 11 en el directorio actual
composer create-project laravel/laravel bsc-backend "11.*"

# O si prefieres instalarlo en el directorio actual:
# composer create-project laravel/laravel . "11.*"
```

### 2. Configurar Base de Datos SQLite

```bash
# Crear archivo de base de datos
touch database/database.sqlite

# Configurar .env para usar SQLite
# Cambiar DB_CONNECTION=mysql a DB_CONNECTION=sqlite
# Comentar DB_HOST, DB_PORT, DB_DATABASE, DB_USERNAME, DB_PASSWORD
```

### 3. Instalar Dependencias Laravel

```bash
# Sanctum para API authentication
composer require laravel/sanctum

# Laravel Queue UI (opcional, para monitorear jobs)
composer require --dev laravel/horizon

# LDAP para Active Directory
composer require directorytree/ldaprecord-laravel

# Browsershot para exportación PDF
composer require spatie/browsershot

# Excel import/export
composer require maatwebsite/excel
```

### 4. Configurar Frontend React + Vite

```bash
# Instalar Vite y React
npm install vite @vitejs/plugin-react --save-dev
npm install react react-dom react-router-dom

# TypeScript
npm install -D typescript @types/react @types/react-dom

# Ant Design
npm install antd @ant-design/icons @ant-design/charts

# Utilidades
npm install axios dayjs zustand react-query
npm install -D @types/node
```

### 5. Configurar Vite en Laravel

Crear `vite.config.ts`:

```typescript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import laravel from 'laravel-vite-plugin';

export default defineConfig({
    plugins: [
        laravel({
            input: ['resources/react/main.tsx'],
            refresh: true,
        }),
        react(),
    ],
    resolve: {
        alias: {
            '@': '/resources/react',
        },
    },
    server: {
        port: 5173,
        strictPort: true,
    },
});
```

### 6. Estructura de Directorios

```bash
# Crear directorios base
mkdir -p resources/react/{components,pages,services,utils}
mkdir -p resources/react/components/{ui,bsc,charts,etl}
mkdir -p app/Services/{KPI,ETL,Notification}
mkdir -p app/Jobs/ETL
mkdir -p storage/app/etl
```

### 7. Migraciones Base

```bash
# Generar migraciones iniciales
php artisan make:migration create_strategic_plans_table
php artisan make:migration create_perspectives_table
php artisan make:migration create_strategic_objectives_table
php artisan make:migration create_kpis_table
php artisan make:migration create_kpi_values_table
php artisan make:migration create_measurement_periods_table
php artisan make:migration create_audit_logs_table
php artisan make:migration create_etl_logs_table
php artisan make:migration create_data_sources_table

# Ejecutar migraciones
php artisan migrate
```

### 8. Configurar API Routes

En `routes/api.php`:

```php
Route::prefix('v1')->group(function () {
    Route::post('/login', [AuthController::class, 'login']);
    
    Route::middleware('auth:sanctum')->group(function () {
        // Rutas protegidas
        Route::apiResource('perspectives', PerspectiveController::class);
        Route::apiResource('objectives', ObjectiveController::class);
        Route::apiResource('kpis', KPIController::class);
        // ... más rutas
    });
});
```

### 9. Desarrollo

```bash
# Terminal 1: Laravel backend
php artisan serve

# Terminal 2: Vite frontend  
npm run dev

# Terminal 3: Queue worker (para ETL)
php artisan queue:work
```

### 10. Variables de Entorno

Configurar `.env`:

```env
APP_NAME="BSC Scorecard"
APP_ENV=local
APP_DEBUG=true
APP_URL=http://localhost:8000

DB_CONNECTION=sqlite

QUEUE_CONNECTION=database

SESSION_DRIVER=database
SESSION_LIFETIME=120

# LDAP (configurar cuando se necesite)
LDAP_LOGGING=true
LDAP_CONNECTION=default
```

## Próximos Pasos

1. Implementar Models Eloquent según `docs/ARCHITECTURE.md`
2. Crear Controllers para cada módulo
3. Implementar Services para lógica de negocio (KPI Engine, ETL)
4. Configurar componentes React base con Ant Design
5. Implementar autenticación con Sanctum

Ver `docs/TASKS.md` para el plan de implementación completo.
