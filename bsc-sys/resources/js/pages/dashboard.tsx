import { Head } from '@inertiajs/react';
import { Row, Col, Card, Statistic } from '@/components/antd';
import { 
    RiseOutlined, 
    FallOutlined, 
    CheckCircleOutlined,
    ClockCircleOutlined 
} from '@ant-design/icons';
import { KPICard, PerspectiveCard } from '@/components/bsc';
import { dashboard } from '@/routes';

export default function Dashboard() {
    // Mock data - esto se reemplazará con datos reales del backend
    const kpis = [
        {
            name: 'Ingresos Totales',
            value: 2500000,
            target: 2400000,
            unit: '$',
            trafficLight: 'green' as const,
            trend: 'up' as const,
            trendValue: 8.5,
        },
        {
            name: 'Satisfacción del Cliente',
            value: 8.2,
            target: 9.0,
            unit: '/10',
            trafficLight: 'yellow' as const,
            trend: 'up' as const,
            trendValue: 2.3,
        },
        {
            name: 'Tiempo de Respuesta',
            value: 24,
            target: 20,
            unit: 'hrs',
            trafficLight: 'red' as const,
            trend: 'down' as const,
            trendValue: 5.2,
        },
        {
            name: 'Tasa de Retención',
            value: 92.5,
            target: 95.0,
            unit: '%',
            trafficLight: 'yellow' as const,
            trend: 'up' as const,
            trendValue: 1.8,
        },
    ];

    const perspectives = [
        {
            name: 'Perspectiva Financiera',
            type: 'financial' as const,
            objectivesCount: 5,
            kpisCount: 12,
        },
        {
            name: 'Perspectiva del Cliente',
            type: 'customer' as const,
            objectivesCount: 4,
            kpisCount: 8,
        },
        {
            name: 'Procesos Internos',
            type: 'process' as const,
            objectivesCount: 6,
            kpisCount: 15,
        },
        {
            name: 'Aprendizaje y Crecimiento',
            type: 'learning' as const,
            objectivesCount: 3,
            kpisCount: 7,
        },
    ];

    const stats = {
        totalKPIs: 42,
        greenKPIs: 28,
        yellowKPIs: 10,
        redKPIs: 4,
    };

    const greenPercentage = ((stats.greenKPIs / stats.totalKPIs) * 100).toFixed(1);

    return (
        <>
            <Head title="Dashboard BSC" />
            <div className="flex h-full flex-1 flex-col gap-6 overflow-x-auto rounded-xl p-4">
                {/* Header Stats */}
                <Row gutter={[16, 16]}>
                    <Col xs={24} sm={12} lg={6}>
                        <Card>
                            <Statistic
                                title="Total KPIs"
                                value={stats.totalKPIs}
                                prefix={<CheckCircleOutlined />}
                                valueStyle={{ color: '#1890ff' }}
                            />
                        </Card>
                    </Col>
                    <Col xs={24} sm={12} lg={6}>
                        <Card>
                            <Statistic
                                title="Cumpliendo Meta"
                                value={greenPercentage}
                                suffix="%"
                                prefix={<RiseOutlined />}
                                valueStyle={{ color: '#52c41a' }}
                            />
                        </Card>
                    </Col>
                    <Col xs={24} sm={12} lg={6}>
                        <Card>
                            <Statistic
                                title="En Riesgo"
                                value={stats.yellowKPIs}
                                prefix={<ClockCircleOutlined />}
                                valueStyle={{ color: '#faad14' }}
                            />
                        </Card>
                    </Col>
                    <Col xs={24} sm={12} lg={6}>
                        <Card>
                            <Statistic
                                title="Críticos"
                                value={stats.redKPIs}
                                prefix={<FallOutlined />}
                                valueStyle={{ color: '#ff4d4f' }}
                            />
                        </Card>
                    </Col>
                </Row>

                {/* KPIs Destacados */}
                <div>
                    <h2 className="mb-4 text-xl font-semibold">KPIs Destacados</h2>
                    <Row gutter={[16, 16]}>
                        {kpis.map((kpi, index) => (
                            <Col xs={24} sm={12} lg={6} key={index}>
                                <KPICard {...kpi} />
                            </Col>
                        ))}
                    </Row>
                </div>

                {/* Perspectivas BSC */}
                <div>
                    <h2 className="mb-4 text-xl font-semibold">Perspectivas del Balanced Scorecard</h2>
                    <Row gutter={[16, 16]}>
                        {perspectives.map((perspective, index) => (
                            <Col xs={24} sm={12} lg={6} key={index}>
                                <PerspectiveCard
                                    {...perspective}
                                    onClick={() => console.log(`Clicked: ${perspective.name}`)}
                                />
                            </Col>
                        ))}
                    </Row>
                </div>
            </div>
        </>
    );
}

Dashboard.layout = {
    breadcrumbs: [
        {
            title: 'Dashboard',
            href: dashboard(),
        },
    ],
};

