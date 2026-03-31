import { Head } from '@inertiajs/react';
import { Button, Table, Tag, Space, Card } from '@/components/antd';
import { 
    PlusOutlined, 
    EditOutlined, 
    EyeOutlined,
    DeleteOutlined 
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';

interface StrategicPlan {
    id: number;
    name: string;
    status: 'draft' | 'active' | 'archived';
    start_date: string;
    end_date: string;
    perspectives_count: number;
}

const statusColors = {
    draft: 'default',
    active: 'success',
    archived: 'warning',
} as const;

const statusLabels = {
    draft: 'Borrador',
    active: 'Activo',
    archived: 'Archivado',
};

export default function StrategicPlansIndex() {
    // Mock data - se reemplazará con props de Inertia
    const plans: StrategicPlan[] = [
        {
            id: 1,
            name: 'Plan Estratégico 2026-2028',
            status: 'active',
            start_date: '2026-01-01',
            end_date: '2028-12-31',
            perspectives_count: 4,
        },
        {
            id: 2,
            name: 'Plan Operativo 2026',
            status: 'draft',
            start_date: '2026-01-01',
            end_date: '2026-12-31',
            perspectives_count: 3,
        },
        {
            id: 3,
            name: 'Plan Estratégico 2023-2025',
            status: 'archived',
            start_date: '2023-01-01',
            end_date: '2025-12-31',
            perspectives_count: 4,
        },
    ];

    const columns: ColumnsType<StrategicPlan> = [
        {
            title: 'Nombre',
            dataIndex: 'name',
            key: 'name',
            sorter: (a, b) => a.name.localeCompare(b.name),
        },
        {
            title: 'Estado',
            dataIndex: 'status',
            key: 'status',
            render: (status: keyof typeof statusColors) => (
                <Tag color={statusColors[status]}>
                    {statusLabels[status]}
                </Tag>
            ),
            filters: [
                { text: 'Borrador', value: 'draft' },
                { text: 'Activo', value: 'active' },
                { text: 'Archivado', value: 'archived' },
            ],
            onFilter: (value, record) => record.status === value,
        },
        {
            title: 'Fecha Inicio',
            dataIndex: 'start_date',
            key: 'start_date',
            sorter: (a, b) => new Date(a.start_date).getTime() - new Date(b.start_date).getTime(),
        },
        {
            title: 'Fecha Fin',
            dataIndex: 'end_date',
            key: 'end_date',
            sorter: (a, b) => new Date(a.end_date).getTime() - new Date(b.end_date).getTime(),
        },
        {
            title: 'Perspectivas',
            dataIndex: 'perspectives_count',
            key: 'perspectives_count',
            align: 'center',
        },
        {
            title: 'Acciones',
            key: 'actions',
            align: 'center',
            render: (_, record) => (
                <Space size="small">
                    <Button
                        type="link"
                        icon={<EyeOutlined />}
                        onClick={() => console.log('Ver', record.id)}
                    >
                        Ver
                    </Button>
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
            <Head title="Planes Estratégicos" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <Card>
                    <div className="mb-4 flex items-center justify-between">
                        <div>
                            <h1 className="text-2xl font-bold">Planes Estratégicos</h1>
                            <p className="text-gray-600 dark:text-gray-400">
                                Gestiona los planes estratégicos de tu organización
                            </p>
                        </div>
                        <Button
                            type="primary"
                            icon={<PlusOutlined />}
                            size="large"
                            onClick={() => console.log('Crear plan')}
                        >
                            Nuevo Plan
                        </Button>
                    </div>

                    <Table
                        columns={columns}
                        dataSource={plans}
                        rowKey="id"
                        pagination={{
                            pageSize: 10,
                            showSizeChanger: true,
                            showTotal: (total) => `Total: ${total} planes`,
                        }}
                    />
                </Card>
            </div>
        </>
    );
}

StrategicPlansIndex.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Planes Estratégicos', href: '/strategic-plans' },
    ],
};
