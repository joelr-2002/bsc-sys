import { Head } from '@inertiajs/react';
import { Card, Empty, Button } from '@/components/antd';
import { FileTextOutlined } from '@ant-design/icons';

export default function ReportsIndex() {
    return (
        <>
            <Head title="Reportes" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <Card>
                    <div className="mb-4">
                        <h1 className="text-2xl font-bold">Reportes y Análisis</h1>
                        <p className="text-gray-600 dark:text-gray-400">
                            Genera reportes personalizados de tus indicadores estratégicos
                        </p>
                    </div>

                    <Empty
                        image={Empty.PRESENTED_IMAGE_SIMPLE}
                        description={
                            <span className="text-gray-600 dark:text-gray-400">
                                No hay reportes configurados aún
                            </span>
                        }
                    >
                        <Button type="primary" icon={<FileTextOutlined />}>
                            Crear Primer Reporte
                        </Button>
                    </Empty>
                </Card>
            </div>
        </>
    );
}

ReportsIndex.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Reportes', href: '/reports' },
    ],
};
