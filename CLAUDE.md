# BSC Scorecard — Sistema de Cuadro de Mando Integral

Sistema web para gestión estratégica BSC con carga de datos ETL y dashboards gerenciales interactivos. Orientado a alta dirección y gerencias intermedias.

## Stack Tecnológico

| Capa | Tecnología |
|------|-----------|
| Backend | Laravel 11 + PHP 8.3 |
| Frontend | React 18 + TypeScript + Ant Design + Vite |
| Base de datos | SQLite (desarrollo) / PostgreSQL (producción) |
| ORM | Eloquent ORM |
| ETL / Jobs | Laravel Queue + Database driver |
| Auth | Laravel Sanctum + LDAP |
| Charts | Ant Design Charts + Recharts |
| Testing | PHPUnit (backend) + Vitest (frontend) |
| CI/CD | GitHub Actions → Docker → Deploy |

## Comandos Esenciales

```bash
# Backend Laravel
php artisan serve              # Servidor desarrollo (puerto 8000)
php artisan migrate            # Aplicar migraciones
php artisan db:seed            # Poblar datos de prueba
php artisan queue:work         # Worker de cola para ETL
php artisan test               # Tests PHPUnit

# Frontend React
npm run dev                    # Vite dev server (puerto 5173)
npm run build                  # Build de producción
npm run test                   # Tests Vitest
npm run lint                   # ESLint + TypeScript check

# Desarrollo simultáneo
npm run dev:all                # Laravel + Vite en paralelo
```

## Estructura del Proyecto

```
/
├── CLAUDE.md
├── docs/
│   ├── ARCHITECTURE.md      # Diagrama de capas, decisiones ADR
│   ├── REQUIREMENTS.md      # RF y RNF completos (43 RF / 29 RNF)
│   ├── TASKS.md             # Plan de implementación por fases
│   └── DATA_MODEL.md        # Diccionario de datos y esquema
├── app/                     # Laravel App
│   ├── Http/
│   │   ├── Controllers/     # API Controllers
│   │   └── Middleware/      # RBAC, Auth
│   ├── Models/              # Eloquent Models
│   ├── Services/            # Lógica de negocio (KPI Engine, ETL)
│   └── Jobs/                # Jobs de cola (ETL, Alertas)
├── database/
│   ├── migrations/          # Migraciones Laravel
│   └── seeders/             # Seeders de datos
├── routes/
│   ├── api.php              # Rutas API REST
│   └── web.php              # Rutas web
├── resources/
│   └── react/               # Aplicación React
│       ├── components/
│       │   ├── ui/          # Ant Design wrappers
│       │   ├── bsc/         # Componentes dominio BSC
│       │   ├── charts/      # Visualizaciones
│       │   └── etl/         # UI de carga de datos
│       ├── pages/           # Páginas principales
│       ├── services/        # API client (Axios)
│       └── utils/           # Helpers y constantes
├── storage/
│   └── app/
│       └── etl/             # Archivos temporales ETL
└── tests/
    ├── Feature/             # Tests de integración Laravel
    └── Unit/                # Tests unitarios Laravel
```

## Reglas de Desarrollo

- **TypeScript strict mode** en frontend — sin `any`, sin `as unknown`
- **PHP strict types** en backend — `declare(strict_types=1);` en todos los archivos
- **Named exports** en React — nunca `export default` en componentes
- **Form Validation** — Laravel Form Requests en backend, Ant Design Form en frontend
- **API REST** — Seguir convenciones RESTful, versionado en URL `/api/v1/`
- **RBAC obligatorio** — Middleware en rutas Laravel, verificar permisos en cada endpoint
- **NEVER** hacer commit de `.env`, secrets, API keys ni credenciales
- **NEVER** exponer datos de KPIs financieros sin validar el rol del usuario
- Cada PR debe incluir tests — cobertura mínima 80% en `app/Services/`
- Commits en español, convención: `feat:`, `fix:`, `chore:`, `docs:`

## Contexto de Dominio

Ver @docs/REQUIREMENTS.md para requisitos funcionales y no funcionales completos.
Ver @docs/ARCHITECTURE.md para decisiones de arquitectura y modelo de datos.
Ver @docs/TASKS.md para el plan de implementación por fases.

## Usuarios y Roles

| Rol | Puede hacer |
|-----|------------|
| `ADMIN` | Todo — configuración, usuarios, parámetros globales |
| `MANAGER` | Ver todos los dashboards, comentar KPIs, aprobar cargas |
| `ANALYST` | Cargar datos, gestionar KPIs de su área, generar reportes |
| `VIEWER` | Solo lectura de dashboards y reportes |

## Modelo BSC Core

Las cuatro perspectivas estándar + perspectivas personalizadas. Jerarquía:
`Perspectiva → Objetivo Estratégico → KPI → Valor por Periodo`

El campo `trafficLight` de un KPI se calcula automáticamente al guardar un valor:
- `GREEN`: valor >= meta * umbralVerde
- `YELLOW`: valor >= meta * umbralAmarillo  
- `RED`: valor < meta * umbralAmarillo

## Notas Críticas

- Los workers ETL corren como Jobs de Laravel Queue — `php artisan queue:work` en proceso separado
- Los datos financieros tienen `$auditTrail = true` en Models — usar soft deletes, nunca `forceDelete()`
- Los periodos cerrados (`status: CLOSED`) son inmutables — validar en Form Request antes de guardar
- La exportación PDF usa Browsershot (Puppeteer wrapper) — instalar `puppeteer` con npm
- Los semáforos se recalculan en background via Laravel Jobs, no de forma síncrona en requests
