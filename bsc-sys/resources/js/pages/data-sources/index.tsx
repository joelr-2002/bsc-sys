import { Head } from '@inertiajs/react';
import { Button, Table, Tag, Space, Card } from '@/components/antd';
import { 
    PlusOutlined, 
    EditOutlined, 
    DeleteOutlined,
    CheckCircleOutlined,
    CloseCircleOutlined 
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';

interface DataSource {
    id: number;
    name: string;
    type: string;
    active: boolean;
    last_run_at: string | null;
}

const typeLabels: Record<string, string> = {
    sql_server: 'SQL Server',
    mysql: 'MySQL',
    postgresql: 'PostgreSQL',
    oracle: 'Oracle',
    rest_api: 'REST API',
    file: 'Archivo',
};

export default function DataSourcesIndex() {
    // Mock data
    const dataSources: DataSource[] = [
        {
            id: 1,
            name: 'ERP Principal',
            type: 'sql_server',
            active: true,
            last_run_at: '2026-03-31 02:30:00',
        },
        {
            id: 2,
            name: 'Google Analytics API',
            type: 'rest_api',
            active: true,
            last_run_at: '2026-03-31 03:00:00',
        },
        {
            id: 3,
            name: 'Base de Datos Legado',
            type: 'mysql',
            active: false,
            last_run_at: null,
        },
    ];

    const columns: ColumnsType<DataSource> = [
        {
            title: 'Nombre',
            dataIndex: 'name',
            key: 'name',
            sorter: (a, b) => a.name.localeCompare(b.name),
        },
        {
            title: 'Tipo',
            dataIndex: 'type',
            key: 'type',
            render: (type: string) => (
                <Tag color="blue">{typeLabels[type] || type}</Tag>
            ),
            filters: Object.entries(typeLabels).map(([value, text]) => ({ text, value })),
            onFilter: (value, record) => record.type === value,
        },
        {
            title: 'Estado',
            dataIndex: 'active',
            key: 'active',
            align: 'center',
            render: (active: boolean) => (
                active ? (
                    <Tag icon={<CheckCircleOutlined />} color="success">
                        Activo
                    </Tag>
                ) : (
                    <Tag icon={<CloseCircleOutlined />} color="default">
                        Inactivo
                    </Tag>
                )
            ),
            filters: [
                { text: 'Activo', value: true },
                { text: 'Inactivo', value: false },
            ],
            onFilter: (value, record) => record.active === value,
        },
        {
            title: 'Última Ejecución',
            dataIndex: 'last_run_at',
            key: 'last_run_at',
            render: (date: string | null) => date || 'Nunca',
            sorter: (a, b) => {
                if (!a.last_run_at) return 1;
                if (!b.last_run_at) return -1;
                return new Date(a.last_run_at).getTime() - new Date(b.last_run_at).getTime();
            },
        },
        {
            title: 'Acciones',
            key: 'actions',
            align: 'center',
            render: (_, record) => (
                <Space size="small">
                    <Button
                        type="link"
                        icon={<EditOutlined />}
                        onClick={() => console.log('Editar', record.id)}
                    >
                        Editar
                    </Button>
                    <Button
                        type="link"
                        danger
                        icon={<DeleteOutlined />}
                        onClick={() => console.log('Eliminar', record.id)}
                    >
                        Eliminar
                    </Button>
                </Space>
            ),
        },
    ];

    return (
        <>
            <Head title="Fuentes de Datos" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <Card>
                    <div className="mb-4 flex items-center justify-between">
                        <div>
                            <h1 className="text-2xl font-bold">Fuentes de Datos</h1>
                            <p className="text-gray-600 dark:text-gray-400">
                                Configura las fuentes de datos para alimentar tus KPIs
                            </p>
                        </div>
                        <Button
                            type="primary"
                            icon={<PlusOutlined />}
                            size="large"
                            onClick={() => console.log('Crear fuente')}
                        >
                            Nueva Fuente
                        </Button>
                    </div>

                    <Table
                        columns={columns}
                        dataSource={dataSources}
                        rowKey="id"
                        pagination={{
                            pageSize: 10,
                            showSizeChanger: true,
                            showTotal: (total) => `Total: ${total} fuentes`,
                        }}
                    />
                </Card>
            </div>
        </>
    );
}

DataSourcesIndex.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Fuentes de Datos', href: '/data-sources' },
    ],
};
