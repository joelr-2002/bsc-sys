import { Head } from '@inertiajs/react';
import { Card, Empty, Button } from '@/components/antd';
import { ApartmentOutlined } from '@ant-design/icons';

export default function StrategicMapIndex() {
    return (
        <>
            <Head title="Mapa Estratégico" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <Card>
                    <div className="mb-4">
                        <h1 className="text-2xl font-bold">Mapa Estratégico</h1>
                        <p className="text-gray-600 dark:text-gray-400">
                            Visualiza las relaciones causa-efecto entre objetivos estratégicos
                        </p>
                    </div>

                    <div className="flex min-h-[400px] items-center justify-center">
                        <Empty
                            image={Empty.PRESENTED_IMAGE_SIMPLE}
                            description={
                                <span className="text-gray-600 dark:text-gray-400">
                                    El mapa estratégico se generará automáticamente<br />
                                    cuando se definan relaciones causales entre objetivos
                                </span>
                            }
                        >
                            <Button type="primary" icon={<ApartmentOutlined />}>
                                Configurar Relaciones Causales
                            </Button>
                        </Empty>
                    </div>
                </Card>
            </div>
        </>
    );
}

StrategicMapIndex.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Mapa Estratégico', href: '/strategic-map' },
    ],
};
