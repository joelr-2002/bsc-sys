# Integración de Ant Design 6.3.5 en BSC Scorecard

## ✅ Instalación Completada

Ant Design 6.3.5 ha sido instalado e integrado exitosamente en el proyecto Laravel + React + Inertia.js.

## 📦 Paquetes Instalados

```json
{
  "antd": "6.3.5",
  "@ant-design/icons": "^5.x",
  "dayjs": "^1.x"
}
```

## 🎨 Configuración

### 1. ConfigProvider en app.tsx

El `ConfigProvider` de Ant Design está configurado en `resources/js/app.tsx` con:

- **Locale**: Español (esES)
- **Tema**: Sincronizado con dark/light mode del sistema
- **Tokens personalizados**: Colores, tipografía, espaciado
- **Componentes ajustados**: Altura uniforme de controles (36px)

### 2. Tema Personalizado

Archivo: `resources/js/lib/antd-theme.ts`

- Configuración de tema claro y oscuro
- Tokens BSC personalizados (semáforos, perspectivas)
- Integración con variables de Tailwind CSS

### 3. Exportaciones Centralizadas

Archivo: `resources/js/components/antd/index.ts`

Todos los componentes de Ant Design están re-exportados desde un único punto. Usar siempre:

```typescript
import { Button, Card, Table } from '@/components/antd';
```

En lugar de:

```typescript
import { Button, Card, Table } from 'antd'; // ❌ No usar
```

## 📄 Página Demo

### Ubicación
`resources/js/pages/antd-demo.tsx`

### Contenido
- Dashboard ejecutivo de ejemplo
- Tabla de KPIs con semáforos
- Estadísticas (Statistic components)
- Componentes de acción (Botones)
- Integración de colores BSC

### Cómo verla

1. Agregar ruta en `routes/web.php`:

```php
Route::get('/antd-demo', function () {
    return inertia('antd-demo');
})->name('antd-demo');
```

2. Iniciar servidor:

```bash
php artisan serve
npm run dev
```

3. Visitar: `http://localhost:8000/antd-demo`

## 🎨 Tokens BSC Personalizados

### Semáforos de KPIs

```typescript
import { bscTrafficLightColors } from '@/lib/antd-theme';

// Uso:
<Tag color={bscTrafficLightColors.green}>Óptimo</Tag>
<Tag color={bscTrafficLightColors.yellow}>Aceptable</Tag>
<Tag color={bscTrafficLightColors.red}>Crítico</Tag>
<Tag color={bscTrafficLightColors.grey}>Sin datos</Tag>
```

### Perspectivas BSC

```typescript
import { bscPerspectiveColors } from '@/lib/antd-theme';

// Uso:
<Tag color={bscPerspectiveColors.financial}>Financiera</Tag>
<Tag color={bscPerspectiveColors.customer}>Cliente</Tag>
<Tag color={bscPerspectiveColors.process}>Procesos</Tag>
<Tag color={bscPerspectiveColors.learning}>Aprendizaje</Tag>
<Tag color={bscPerspectiveColors.custom}>Personalizada</Tag>
```

## 🌓 Soporte Dark Mode

El tema se sincroniza automáticamente con el modo oscuro del sistema:

- Detecta la clase `.dark` en el `<html>`
- Aplica `theme.darkAlgorithm` o `theme.defaultAlgorithm`
- Los cambios se reflejan en tiempo real

## 📚 Componentes Más Usados para BSC

### Visualización de Datos
- `Table` - Tablas de KPIs
- `Card` - Contenedores de dashboards
- `Statistic` - Métricas clave
- `Progress` - Barras de cumplimiento
- `Tag` - Etiquetas de estado/categoría
- `Badge` - Contadores y alertas

### Formularios
- `Form` - Formularios completos
- `Input` - Campos de texto
- `Select` - Selectores
- `DatePicker` - Selección de fechas/períodos
- `InputNumber` - Valores numéricos de KPIs

### Feedback
- `Modal` - Diálogos
- `Drawer` - Paneles laterales
- `message` - Notificaciones temporales
- `notification` - Alertas persistentes
- `Alert` - Mensajes de información

### Layout
- `Layout` - Estructura principal
- `Space` - Espaciado entre elementos
- `Divider` - Separadores
- `Row/Col` - Sistema de grilla

## 🔧 Uso Recomendado

### Ejemplo: Tabla de KPIs

```typescript
import { Table, Tag, Progress } from '@/components/antd';
import { bscTrafficLightColors } from '@/lib/antd-theme';

const columns = [
  {
    title: 'KPI',
    dataIndex: 'name',
    key: 'name',
  },
  {
    title: 'Cumplimiento',
    key: 'compliance',
    render: (record) => (
      <Progress percent={record.percentage} size="small" />
    ),
  },
  {
    title: 'Estado',
    dataIndex: 'status',
    key: 'status',
    render: (status) => {
      const colors = {
        green: bscTrafficLightColors.green,
        yellow: bscTrafficLightColors.yellow,
        red: bscTrafficLightColors.red,
      };
      return <Tag color={colors[status]}>{status.toUpperCase()}</Tag>;
    },
  },
];

<Table columns={columns} dataSource={data} />
```

### Ejemplo: Formulario de KPI

```typescript
import { Form, Input, InputNumber, Select, DatePicker, Button } from '@/components/antd';

<Form layout="vertical" onFinish={handleSubmit}>
  <Form.Item label="Nombre del KPI" name="name" rules={[{ required: true }]}>
    <Input placeholder="Ej: ROI Anual" />
  </Form.Item>
  
  <Form.Item label="Meta" name="target">
    <InputNumber min={0} style={{ width: '100%' }} />
  </Form.Item>
  
  <Form.Item label="Perspectiva" name="perspective">
    <Select>
      <Select.Option value="financial">Financiera</Select.Option>
      <Select.Option value="customer">Cliente</Select.Option>
      <Select.Option value="process">Procesos</Select.Option>
      <Select.Option value="learning">Aprendizaje</Select.Option>
    </Select>
  </Form.Item>
  
  <Form.Item>
    <Button type="primary" htmlType="submit">
      Guardar KPI
    </Button>
  </Form.Item>
</Form>
```

## 📖 Recursos

- [Documentación oficial](https://ant.design)
- [Componentes disponibles](https://ant.design/components/overview)
- [Guía de migración v5 → v6](https://ant.design/docs/react/migration-v6)
- [Personalización de tema](https://ant.design/docs/react/customize-theme)

## ⚠️ Notas Importantes

1. **No importar directamente de 'antd'**: Usar siempre `@/components/antd`
2. **message y notification**: Son funciones, no componentes (lowercase)
3. **Locale español**: Ya configurado globalmente con `esES`
4. **dayjs**: Ant Design 6.x usa dayjs en lugar de moment.js
5. **Tree-shaking**: Vite maneja automáticamente la optimización

## 🚀 Próximos Pasos

1. Crear componentes BSC personalizados basados en Ant Design
2. Implementar dashboards gerenciales
3. Configurar tablas de datos con filtros y exportación
4. Implementar formularios de carga de KPIs
5. Crear sistema de alertas y notificaciones
