import { Head } from '@inertiajs/react';
import { Button, Table, Tag, Space, Card } from '@/components/antd';
import { 
    PlusOutlined, 
    EditOutlined, 
    DeleteOutlined,
    MailOutlined 
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';

interface User {
    id: number;
    name: string;
    email: string;
    role: 'admin' | 'manager' | 'analyst' | 'viewer';
    created_at: string;
}

const roleColors = {
    admin: 'red',
    manager: 'orange',
    analyst: 'blue',
    viewer: 'green',
} as const;

const roleLabels = {
    admin: 'Administrador',
    manager: 'Gerente',
    analyst: 'Analista',
    viewer: 'Visualizador',
};

export default function UsersIndex() {
    // Mock data
    const users: User[] = [
        {
            id: 1,
            name: 'Juan Pérez',
            email: 'juan.perez@example.com',
            role: 'admin',
            created_at: '2026-01-15',
        },
        {
            id: 2,
            name: 'María García',
            email: 'maria.garcia@example.com',
            role: 'manager',
            created_at: '2026-02-20',
        },
        {
            id: 3,
            name: 'Carlos López',
            email: 'carlos.lopez@example.com',
            role: 'analyst',
            created_at: '2026-03-10',
        },
        {
            id: 4,
            name: 'Ana Martínez',
            email: 'ana.martinez@example.com',
            role: 'viewer',
            created_at: '2026-03-25',
        },
    ];

    const columns: ColumnsType<User> = [
        {
            title: 'Nombre',
            dataIndex: 'name',
            key: 'name',
            sorter: (a, b) => a.name.localeCompare(b.name),
        },
        {
            title: 'Email',
            dataIndex: 'email',
            key: 'email',
        },
        {
            title: 'Rol',
            dataIndex: 'role',
            key: 'role',
            render: (role: keyof typeof roleColors) => (
                <Tag color={roleColors[role]}>
                    {roleLabels[role]}
                </Tag>
            ),
            filters: Object.entries(roleLabels).map(([value, text]) => ({ text, value })),
            onFilter: (value, record) => record.role === value,
        },
        {
            title: 'Fecha de Registro',
            dataIndex: 'created_at',
            key: 'created_at',
            sorter: (a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime(),
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
                        disabled={record.role === 'admin'}
                    >
                        Eliminar
                    </Button>
                </Space>
            ),
        },
    ];

    return (
        <>
            <Head title="Usuarios" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <Card>
                    <div className="mb-4 flex items-center justify-between">
                        <div>
                            <h1 className="text-2xl font-bold">Gestión de Usuarios</h1>
                            <p className="text-gray-600 dark:text-gray-400">
                                Administra los usuarios y sus roles en el sistema
                            </p>
                        </div>
                        <Space>
                            <Button
                                icon={<MailOutlined />}
                                size="large"
                                onClick={() => console.log('Invitar usuario')}
                            >
                                Invitar Usuario
                            </Button>
                            <Button
                                type="primary"
                                icon={<PlusOutlined />}
                                size="large"
                                onClick={() => console.log('Crear usuario')}
                            >
                                Nuevo Usuario
                            </Button>
                        </Space>
                    </div>

                    <Table
                        columns={columns}
                        dataSource={users}
                        rowKey="id"
                        pagination={{
                            pageSize: 10,
                            showSizeChanger: true,
                            showTotal: (total) => `Total: ${total} usuarios`,
                        }}
                    />
                </Card>
            </div>
        </>
    );
}

UsersIndex.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Usuarios', href: '/users' },
    ],
};
