import { Head } from '@inertiajs/react';
import { Button, Table, Space, Card, Input, Select } from '@/components/antd';
import { 
    PlusOutlined, 
    EditOutlined, 
    EyeOutlined,
    SearchOutlined,
    UploadOutlined
} from '@ant-design/icons';
import { TrafficLight } from '@/components/bsc';
import type { ColumnsType } from 'antd/es/table';

interface KPI {
    id: number;
    name: string;
    objective: string;
    unit: string;
    frequency: string;
    current_value: number;
    target: number;
    traffic_light: 'green' | 'yellow' | 'red' | 'grey';
    owner: string;
}

export default function KPIsIndex() {
    // Mock data
    const kpis: KPI[] = [
        {
            id: 1,
            name: 'Ingresos Totales',
            objective: 'Incrementar rentabilidad',
            unit: '$',
            frequency: 'Mensual',
            current_value: 2500000,
            target: 2400000,
            traffic_light: 'green',
            owner: 'Juan Pérez',
        },
        {
            id: 2,
            name: 'Satisfacción del Cliente',
            objective: 'Mejorar experiencia del cliente',
            unit: '/10',
            frequency: 'Trimestral',
            current_value: 8.2,
            target: 9.0,
            traffic_light: 'yellow',
            owner: 'María García',
        },
        {
            id: 3,
            name: 'Tiempo de Respuesta',
            objective: 'Optimizar procesos',
            unit: 'hrs',
            frequency: 'Semanal',
            current_value: 24,
            target: 20,
            traffic_light: 'red',
            owner: 'Carlos López',
        },
        {
            id: 4,
            name: 'Tasa de Retención',
            objective: 'Fidelizar clientes',
            unit: '%',
            frequency: 'Mensual',
            current_value: 92.5,
            target: 95.0,
            traffic_light: 'yellow',
            owner: 'Ana Martínez',
        },
        {
            id: 5,
            name: 'Capacitación Empleados',
            objective: 'Desarrollar talento',
            unit: 'hrs',
            frequency: 'Anual',
            current_value: 0,
            target: 40,
            traffic_light: 'grey',
            owner: 'Pedro Rodríguez',
        },
    ];

    const columns: ColumnsType<KPI> = [
        {
            title: 'Nombre',
            dataIndex: 'name',
            key: 'name',
            fixed: 'left',
            width: 200,
            sorter: (a, b) => a.name.localeCompare(b.name),
        },
        {
            title: 'Objetivo Estratégico',
            dataIndex: 'objective',
            key: 'objective',
            width: 200,
        },
        {
            title: 'Valor Actual',
            dataIndex: 'current_value',
            key: 'current_value',
            align: 'right',
            width: 120,
            render: (value, record) => `${value.toLocaleString()} ${record.unit}`,
        },
        {
            title: 'Meta',
            dataIndex: 'target',
            key: 'target',
            align: 'right',
            width: 120,
            render: (value, record) => `${value.toLocaleString()} ${record.unit}`,
        },
        {
            title: 'Cumplimiento',
            key: 'compliance',
            align: 'center',
            width: 120,
            render: (_, record) => {
                const compliance = record.target > 0 ? (record.current_value / record.target) * 100 : 0;
                return `${compliance.toFixed(1)}%`;
            },
        },
        {
            title: 'Estado',
            dataIndex: 'traffic_light',
            key: 'traffic_light',
            align: 'center',
            width: 150,
            render: (color: 'green' | 'yellow' | 'red' | 'grey') => (
                <TrafficLight color={color} />
            ),
            filters: [
                { text: 'Cumplido', value: 'green' },
                { text: 'En Riesgo', value: 'yellow' },
                { text: 'Crítico', value: 'red' },
                { text: 'Sin Datos', value: 'grey' },
            ],
            onFilter: (value, record) => record.traffic_light === value,
        },
        {
            title: 'Frecuencia',
            dataIndex: 'frequency',
            key: 'frequency',
            width: 120,
        },
        {
            title: 'Responsable',
            dataIndex: 'owner',
            key: 'owner',
            width: 150,
        },
        {
            title: 'Acciones',
            key: 'actions',
            fixed: 'right',
            width: 200,
            align: 'center',
            render: (_, record) => (
                <Space size="small">
                    <Button
                        type="link"
                        size="small"
                        icon={<EyeOutlined />}
                        onClick={() => console.log('Ver', record.id)}
                    >
                        Ver
                    </Button>
                    <Button
                        type="link"
                        size="small"
                        icon={<EditOutlined />}
                        onClick={() => console.log('Editar', record.id)}
                    >
                        Editar
                    </Button>
                </Space>
            ),
        },
    ];

    return (
        <>
            <Head title="KPIs" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <Card>
                    <div className="mb-4 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                        <div>
                            <h1 className="text-2xl font-bold">Indicadores de Desempeño (KPIs)</h1>
                            <p className="text-gray-600 dark:text-gray-400">
                                Monitorea y gestiona los indicadores clave de tu organización
                            </p>
                        </div>
                        <Space>
                            <Button
                                icon={<UploadOutlined />}
                                size="large"
                                onClick={() => console.log('Cargar datos')}
                            >
                                Cargar Datos
                            </Button>
                            <Button
                                type="primary"
                                icon={<PlusOutlined />}
                                size="large"
                                onClick={() => console.log('Crear KPI')}
                            >
                                Nuevo KPI
                            </Button>
                        </Space>
                    </div>

                    <div className="mb-4 flex flex-col gap-4 md:flex-row">
                        <Input
                            placeholder="Buscar KPIs..."
                            prefix={<SearchOutlined />}
                            size="large"
                            style={{ maxWidth: 300 }}
                        />
                        <Select
                            placeholder="Filtrar por perspectiva"
                            size="large"
                            style={{ width: 200 }}
                            options={[
                                { label: 'Todas', value: 'all' },
                                { label: 'Financiera', value: 'financial' },
                                { label: 'Cliente', value: 'customer' },
                                { label: 'Procesos', value: 'process' },
                                { label: 'Aprendizaje', value: 'learning' },
                            ]}
                        />
                    </div>

                    <Table
                        columns={columns}
                        dataSource={kpis}
                        rowKey="id"
                        scroll={{ x: 1500 }}
                        pagination={{
                            pageSize: 10,
                            showSizeChanger: true,
                            showTotal: (total) => `Total: ${total} KPIs`,
                        }}
                    />
                </Card>
            </div>
        </>
    );
}

KPIsIndex.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'KPIs', href: '/kpis' },
    ],
};
