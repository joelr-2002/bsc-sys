# 🎨 Frontend BSC - Componentes y Páginas

**Fecha**: 31 de Marzo de 2026  
**Stack**: React 19 + Ant Design 6.3.5 + TypeScript + Tailwind CSS

---

## 📦 Componentes BSC Creados

### 1. TrafficLight Component
**Ubicación**: `resources/js/components/bsc/traffic-light.tsx`

Componente para mostrar el estado de cumplimiento de KPIs con colores de semáforo.

```tsx
import { TrafficLight } from '@/components/bsc';

<TrafficLight color="green" />
<TrafficLight color="yellow" showText={false} size="small" />
<TrafficLight color="red" />
<TrafficLight color="grey" />
```

**Props**:
- `color`: 'green' | 'yellow' | 'red' | 'grey'
- `size?`: 'small' | 'default' (default: 'default')
- `showText?`: boolean (default: true)

**Colores**:
- 🟢 Verde = Cumplido (≥95%)
- 🟡 Amarillo = En Riesgo (80-94%)
- 🔴 Rojo = Crítico (<80%)
- ⚪ Gris = Sin Datos

---

### 2. KPICard Component
**Ubicación**: `resources/js/components/bsc/kpi-card.tsx`

Tarjeta para mostrar un KPI con su valor actual, meta, progreso y semáforo.

```tsx
import { KPICard } from '@/components/bsc';

<KPICard
    name="Ingresos Totales"
    value={2500000}
    target={2400000}
    unit="$"
    trafficLight="green"
    trend="up"
    trendValue={8.5}
/>
```

**Props**:
- `name`: string - Nombre del KPI
- `value`: number - Valor actual
- `target`: number - Meta objetivo
- `unit`: string - Unidad de medida (%, $, hrs, etc.)
- `trafficLight`: 'green' | 'yellow' | 'red' | 'grey'
- `trend?`: 'up' | 'down' - Tendencia
- `trendValue?`: number - Porcentaje de cambio
- `loading?`: boolean

**Características**:
- Calcula automáticamente el porcentaje de cumplimiento
- Muestra barra de progreso con colores según semáforo
- Muestra tendencia con iconos y colores
- Soporte para estado loading (skeleton)
- Efecto hover

---

### 3. PerspectiveCard Component
**Ubicación**: `resources/js/components/bsc/perspective-card.tsx`

Tarjeta para mostrar una perspectiva del BSC con su tipo, objetivos y KPIs.

```tsx
import { PerspectiveCard } from '@/components/bsc';

<PerspectiveCard
    name="Perspectiva Financiera"
    type="financial"
    objectivesCount={5}
    kpisCount={12}
    onClick={() => navigate('/perspectives/1')}
/>
```

**Props**:
- `name`: string - Nombre de la perspectiva
- `type`: 'financial' | 'customer' | 'process' | 'learning' | 'custom'
- `objectivesCount`: number - Cantidad de objetivos
- `kpisCount`: number - Cantidad de KPIs
- `color?`: string - Color personalizado (#hex)
- `onClick?`: () => void - Handler de clic

**Tipos de Perspectivas**:
| Tipo | Icono | Color | Label |
|------|-------|-------|-------|
| financial | 💰 | #3b82f6 (blue) | Financiera |
| customer | 👤 | #10b981 (green) | Cliente |
| process | ⚙️ | #f59e0b (amber) | Procesos |
| learning | 📚 | #8b5cf6 (purple) | Aprendizaje |
| custom | ⭐ | #6b7280 (gray) | Personalizada |

---

## 📄 Páginas Creadas

### 1. Dashboard Principal
**Ubicación**: `resources/js/pages/dashboard.tsx`  
**Ruta**: `/dashboard`

**Características**:
- 4 tarjetas con estadísticas generales (Total KPIs, Cumpliendo Meta, En Riesgo, Críticos)
- Sección "KPIs Destacados" con 4 KPICards
- Sección "Perspectivas del BSC" con 4 PerspectiveCards
- Layout responsive (Grid adaptativo)
- Datos mock (se reemplazarán con Inertia props)

**Componentes Ant Design usados**:
- Row / Col (grid system)
- Card
- Statistic (con iconos)

---

### 2. Planes Estratégicos Index
**Ubicación**: `resources/js/pages/strategic-plans/index.tsx`  
**Ruta**: `/strategic-plans`

**Características**:
- Tabla con lista de planes estratégicos
- Filtros por estado (Borrador, Activo, Archivado)
- Ordenamiento por nombre, fecha inicio, fecha fin
- Acciones: Ver, Editar, Eliminar
- Botón "Nuevo Plan"
- Paginación (10 por página)
- Tags con colores según estado

**Columnas de la tabla**:
- Nombre (sortable)
- Estado (filterable)
- Fecha Inicio (sortable)
- Fecha Fin (sortable)
- Perspectivas (cantidad)
- Acciones (Ver, Editar, Eliminar)

---

### 3. KPIs Index
**Ubicación**: `resources/js/pages/kpis/index.tsx`  
**Ruta**: `/kpis`

**Características**:
- Tabla con lista de KPIs
- Búsqueda por nombre
- Filtro por perspectiva (select)
- Filtro por semáforo (tabla)
- Ordenamiento por nombre
- Acciones: Ver, Editar
- Botones: "Cargar Datos", "Nuevo KPI"
- Scroll horizontal para tablas anchas
- Columnas fixed (left/right)

**Columnas de la tabla**:
- Nombre (fixed left, sortable)
- Objetivo Estratégico
- Valor Actual (con unidad)
- Meta (con unidad)
- Cumplimiento (%)
- Estado (TrafficLight component, filterable)
- Frecuencia
- Responsable
- Acciones (fixed right)

**Componentes Ant Design usados**:
- Table (con scroll horizontal)
- Input (con SearchOutlined icon)
- Select (filtro perspectivas)
- Button
- Space

---

## 🎨 Sidebar Actualizado

**Ubicación**: `resources/js/components/app-sidebar.tsx`

### Navegación Principal Agregada:

```
📊 Dashboard
🎯 Planes Estratégicos
   - Ver Planes
   - Crear Plan
📍 Perspectivas
📈 KPIs
   - Ver KPIs
   - Cargar Datos
📄 Reportes
📊 Mapa Estratégico
💾 Fuentes de Datos
👥 Usuarios
⚙️ Configuración
```

**Items con subitems**:
- Planes Estratégicos (expandible)
- KPIs (expandible)

**Iconos usados** (lucide-react):
- LayoutGrid (Dashboard)
- Target (Planes)
- MapPin (Perspectivas)
- TrendingUp (KPIs)
- FileText (Reportes)
- BarChart3 (Mapa Estratégico)
- Database (Fuentes)
- Users (Usuarios)
- Settings (Configuración)

---

## 🔧 Cambios en Types

**Archivo**: `resources/js/types/navigation.ts`

Se agregó soporte para subitems en NavItem:

```typescript
export type NavItem = {
    title: string;
    href: NonNullable<InertiaLinkProps['href']>;
    icon?: LucideIcon | null;
    isActive?: boolean;
    items?: NavItem[]; // ✨ NUEVO
};
```

---

## 🎨 Integración con Ant Design

### Theme Tokens BSC

Definidos en `resources/js/lib/antd-theme.ts`:

```typescript
// Traffic Lights
bscTrafficLightColors: {
  green: '#52c41a',
  yellow: '#faad14',
  red: '#ff4d4f',
  grey: '#d9d9d9',
}

// Perspectives
bscPerspectiveColors: {
  financial: '#3b82f6',
  customer: '#10b981',
  process: '#f59e0b',
  learning: '#8b5cf6',
  custom: '#6b7280',
}
```

### Componentes Usados

De `@/components/antd`:
- **Layout**: Row, Col
- **Display**: Card, Statistic, Tag, Badge, Progress
- **Input**: Input, Select, Button
- **Data**: Table
- **Feedback**: message, notification
- **Icons**: @ant-design/icons

---

## 📱 Responsive Design

Todos los componentes son responsive usando:

### Grid System de Ant Design
```tsx
<Row gutter={[16, 16]}>
    <Col xs={24} sm={12} lg={6}>
        {/* Contenido */}
    </Col>
</Row>
```

**Breakpoints**:
- `xs`: <576px (móviles)
- `sm`: ≥576px (tablets)
- `md`: ≥768px
- `lg`: ≥992px (desktop)
- `xl`: ≥1200px
- `xxl`: ≥1600px

### Flexbox con Tailwind
```tsx
<div className="flex flex-col gap-4 md:flex-row md:items-center">
    {/* Contenido */}
</div>
```

---

## 🎯 Próximos Pasos

### Componentes Pendientes

1. **FormularioKPI** - Crear/Editar KPIs
   - Ant Design Form
   - Validaciones Zod
   - Selección de Objetivo Estratégico
   - Configuración de umbrales

2. **FormularioPlan** - Crear/Editar Planes
   - Form con fechas (DatePicker)
   - TextArea para descripción
   - Select para estado

3. **MapaEstrategico** - Visualización de relaciones causales
   - React Flow o D3.js
   - Nodos con colores por perspectiva
   - Flechas con strength

4. **CargaDatos** - Subir datos de KPIs
   - Upload component
   - Drag & Drop
   - Validación de archivos Excel/CSV
   - Vista previa de datos

5. **GraficosKPI** - Visualizaciones
   - Recharts o Ant Charts
   - Líneas de tendencia
   - Barras comparativas
   - Área de cumplimiento

### Integraciones Backend

Convertir datos mock a Inertia props:

```php
// DashboardController.php
return Inertia::render('Dashboard', [
    'stats' => [
        'totalKPIs' => KPI::count(),
        'greenKPIs' => KPI::whereHas('latestValue', fn($q) => 
            $q->where('traffic_light', 'green')
        )->count(),
        // ...
    ],
    'kpis' => KPI::with(['latestValue', 'owner'])
        ->take(4)
        ->get(),
    'perspectives' => Perspective::withCount(['objectives', 'kpis'])
        ->get(),
]);
```

### Rutas Pendientes

```php
// routes/web.php
Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/dashboard', [DashboardController::class, 'index'])
        ->name('dashboard');
    
    Route::resource('strategic-plans', StrategicPlanController::class);
    Route::resource('perspectives', PerspectiveController::class);
    Route::resource('kpis', KPIController::class);
    
    Route::post('/kpis/load-data', [KPIController::class, 'loadData'])
        ->name('kpis.load-data');
    
    Route::get('/strategic-map', [StrategicMapController::class, 'index'])
        ->name('strategic-map');
    
    Route::resource('data-sources', DataSourceController::class);
    Route::resource('users', UserController::class);
});
```

---

## 🧪 Testing

### Verificación Manual

1. **Build exitoso** ✅
   ```bash
   npm run build
   # ✓ 5476 modules transformed
   # ✓ built in 6.30s
   ```

2. **TypeScript check** ✅
   ```bash
   npm run types:check
   # No errors
   ```

3. **Páginas accesibles**:
   - `/dashboard` ✅
   - `/strategic-plans` ✅
   - `/kpis` ✅

### Tests Pendientes

```typescript
// KPICard.test.tsx
describe('KPICard', () => {
  it('calculates compliance correctly', () => {
    const { getByText } = render(
      <KPICard value={95} target={100} unit="%" />
    );
    expect(getByText('95.0%')).toBeInTheDocument();
  });
  
  it('shows green traffic light when value >= target * 0.95', () => {
    // ...
  });
});
```

---

## 📊 Estadísticas del Frontend

- **Componentes BSC**: 3 creados (TrafficLight, KPICard, PerspectiveCard)
- **Páginas**: 3 creadas (Dashboard, Planes, KPIs)
- **Navegación**: 9 items en sidebar
- **Bundle size**: 
  - CSS: 90.84 KB (15.01 KB gzip)
  - JS total: ~1.2 MB (~370 KB gzip)
  - Dashboard: 6.38 KB (2.35 KB gzip)
  - KPIs page: 15.40 KB (6.65 KB gzip)
- **Módulos transformados**: 5,476
- **Tiempo de build**: 6.30s

---

## 🎨 Design System

### Colores Principales

```css
/* Traffic Lights */
--bsc-green: #52c41a;    /* Cumplido */
--bsc-yellow: #faad14;   /* En Riesgo */
--bsc-red: #ff4d4f;      /* Crítico */
--bsc-grey: #d9d9d9;     /* Sin Datos */

/* Perspectives */
--bsc-financial: #3b82f6;   /* Blue */
--bsc-customer: #10b981;    /* Green */
--bsc-process: #f59e0b;     /* Amber */
--bsc-learning: #8b5cf6;    /* Purple */
--bsc-custom: #6b7280;      /* Gray */
```

### Espaciado

```tsx
// Gap entre elementos
gap-4   // 1rem (16px)
gap-6   // 1.5rem (24px)

// Padding en containers
p-4     // 1rem (16px)

// Margin en secciones
mb-4    // 1rem (16px)
```

### Typography

```tsx
// Headings
text-2xl font-bold           // H1
text-xl font-semibold        // H2
text-lg font-semibold        // H3

// Body
text-sm                      // Small text
text-gray-600 dark:text-gray-400  // Secondary text
```

---

## 📖 Recursos

- **Ubicación componentes**: `resources/js/components/bsc/`
- **Ubicación páginas**: `resources/js/pages/`
- **Ant Design Docs**: https://ant.design
- **Lucide Icons**: https://lucide.dev
- **Tailwind CSS**: https://tailwindcss.com

---

## ✅ Checklist

- [x] Componentes BSC base creados
- [x] Dashboard principal implementado
- [x] Página de Planes Estratégicos
- [x] Página de KPIs
- [x] Sidebar con navegación completa
- [x] Types actualizados (NavItem con subitems)
- [x] Build exitoso
- [x] TypeScript sin errores
- [x] Responsive design implementado
- [ ] Formularios (Crear/Editar)
- [ ] Mapa estratégico
- [ ] Gráficos y charts
- [ ] Integración backend (Inertia props)
- [ ] Tests unitarios

---

**Última Actualización**: 31 de Marzo de 2026  
**Estado**: ✅ **FRONTEND BASE COMPLETADO**
