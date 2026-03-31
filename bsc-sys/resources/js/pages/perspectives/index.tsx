import { Head } from '@inertiajs/react';
import { Button, Card, Row, Col } from '@/components/antd';
import { PlusOutlined } from '@ant-design/icons';
import { PerspectiveCard } from '@/components/bsc';

export default function PerspectivesIndex() {
    // Mock data - se reemplazará con props de Inertia
    const perspectives = [
        {
            id: 1,
            name: 'Perspectiva Financiera',
            type: 'financial' as const,
            objectivesCount: 5,
            kpisCount: 12,
        },
        {
            id: 2,
            name: 'Perspectiva del Cliente',
            type: 'customer' as const,
            objectivesCount: 4,
            kpisCount: 8,
        },
        {
            id: 3,
            name: 'Procesos Internos',
            type: 'process' as const,
            objectivesCount: 6,
            kpisCount: 15,
        },
        {
            id: 4,
            name: 'Aprendizaje y Crecimiento',
            type: 'learning' as const,
            objectivesCount: 3,
            kpisCount: 7,
        },
    ];

    return (
        <>
            <Head title="Perspectivas BSC" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <Card>
                    <div className="mb-4 flex items-center justify-between">
                        <div>
                            <h1 className="text-2xl font-bold">Perspectivas del Balanced Scorecard</h1>
                            <p className="text-gray-600 dark:text-gray-400">
                                Las cuatro perspectivas estratégicas de tu organización
                            </p>
                        </div>
                        <Button
                            type="primary"
                            icon={<PlusOutlined />}
                            size="large"
                            onClick={() => console.log('Crear perspectiva')}
                        >
                            Nueva Perspectiva
                        </Button>
                    </div>

                    <Row gutter={[16, 16]}>
                        {perspectives.map((perspective) => (
                            <Col xs={24} sm={12} lg={6} key={perspective.id}>
                                <PerspectiveCard
                                    {...perspective}
                                    onClick={() => console.log(`Ver perspectiva ${perspective.id}`)}
                                />
                            </Col>
                        ))}
                    </Row>
                </Card>
            </div>
        </>
    );
}

PerspectivesIndex.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Perspectivas', href: '/perspectives' },
    ],
};
