import {
    Button,
    Card,
    Space,
    Typography,
    Table,
    Tag,
    Progress,
    Statistic,
    Row,
    Col,
    Badge,
    Alert,
} from '@/components/antd';
import {
    CheckCircleOutlined,
    CloseCircleOutlined,
    DashboardOutlined,
} from '@ant-design/icons';
import { bscTrafficLightColors } from '@/lib/antd-theme';

const { Title, Paragraph, Text } = Typography;

/**
 * Página de demostración de Ant Design
 * Esta página muestra ejemplos de componentes de Ant Design
 * integrados con el sistema BSC Scorecard
 */
export default function AntdDemo() {
    // Datos de ejemplo para tabla de KPIs
    const kpiData = [
        {
            key: '1',
            name: 'ROI Anual',
            value: 15.2,
            target: 18.0,
            status: 'yellow',
            perspective: 'Financiera',
        },
        {
            key: '2',
            name: 'Satisfacción de Cliente',
            value: 92.5,
            target: 90.0,
            status: 'green',
            perspective: 'Cliente',
        },
        {
            key: '3',
            name: 'Tiempo de Respuesta',
            value: 45,
            target: 30,
            status: 'red',
            perspective: 'Procesos',
        },
        {
            key: '4',
            name: 'Capacitación Anual',
            value: 38,
            target: 40,
            status: 'yellow',
            perspective: 'Aprendizaje',
        },
    ];

    const columns = [
        {
            title: 'KPI',
            dataIndex: 'name',
            key: 'name',
            render: (text: string) => <Text strong>{text}</Text>,
        },
        {
            title: 'Perspectiva',
            dataIndex: 'perspective',
            key: 'perspective',
            render: (text: string) => <Tag color="blue">{text}</Tag>,
        },
        {
            title: 'Valor Actual',
            dataIndex: 'value',
            key: 'value',
            align: 'right' as const,
        },
        {
            title: 'Meta',
            dataIndex: 'target',
            key: 'target',
            align: 'right' as const,
        },
        {
            title: 'Cumplimiento',
            key: 'compliance',
            render: (_: unknown, record: typeof kpiData[0]) => {
                const percentage = (record.value / record.target) * 100;
                return <Progress percent={Number(percentage.toFixed(1))} size="small" />;
            },
        },
        {
            title: 'Estado',
            dataIndex: 'status',
            key: 'status',
            render: (status: 'green' | 'yellow' | 'red') => {
                const config = {
                    green: {
                        color: bscTrafficLightColors.green,
                        icon: <CheckCircleOutlined />,
                        text: 'Óptimo',
                    },
                    yellow: {
                        color: bscTrafficLightColors.yellow,
                        icon: <DashboardOutlined />,
                        text: 'Aceptable',
                    },
                    red: {
                        color: bscTrafficLightColors.red,
                        icon: <CloseCircleOutlined />,
                        text: 'Crítico',
                    },
                };
                const current = config[status];
                return (
                    <Tag color={current.color} icon={current.icon}>
                        {current.text}
                    </Tag>
                );
            },
        },
    ];

    return (
        <Space direction="vertical" size="large" style={{ width: '100%' }}>
            <Alert
                message="¡Ant Design 6.3.5 Integrado!"
                description="Esta página demuestra la integración de Ant Design con Laravel + React + Inertia.js. Los componentes están listos para usar en el sistema BSC Scorecard."
                type="success"
                showIcon
                closable
            />

            <Title level={2}>Dashboard Ejecutivo - Demo</Title>

            {/* Estadísticas principales */}
            <Row gutter={16}>
                <Col span={6}>
                    <Card>
                        <Statistic
                            title="Cumplimiento Global"
                            value={78.5}
                            precision={1}
                            valueStyle={{ color: bscTrafficLightColors.yellow }}
                            suffix="%"
                        />
                    </Card>
                </Col>
                <Col span={6}>
                    <Card>
                        <Statistic
                            title="KPIs en Verde"
                            value={12}
                            valueStyle={{ color: bscTrafficLightColors.green }}
                            prefix={<CheckCircleOutlined />}
                        />
                    </Card>
                </Col>
                <Col span={6}>
                    <Card>
                        <Statistic
                            title="KPIs en Amarillo"
                            value={5}
                            valueStyle={{ color: bscTrafficLightColors.yellow }}
                        />
                    </Card>
                </Col>
                <Col span={6}>
                    <Card>
                        <Badge count={3} offset={[10, 0]}>
                            <Statistic
                                title="KPIs Críticos"
                                value={3}
                                valueStyle={{ color: bscTrafficLightColors.red }}
                                prefix={<CloseCircleOutlined />}
                            />
                        </Badge>
                    </Card>
                </Col>
            </Row>

            {/* Tabla de KPIs */}
            <Card title="Estado de KPIs por Perspectiva">
                <Table
                    columns={columns}
                    dataSource={kpiData}
                    pagination={false}
                    size="middle"
                />
            </Card>

            {/* Botones de ejemplo */}
            <Card title="Componentes de Acción">
                <Space wrap>
                    <Button type="primary">Botón Principal</Button>
                    <Button>Botón Default</Button>
                    <Button type="dashed">Botón Dashed</Button>
                    <Button type="text">Botón Texto</Button>
                    <Button type="link">Botón Link</Button>
                    <Button type="primary" danger>
                        Botón Peligro
                    </Button>
                    <Button type="primary" loading>
                        Cargando...
                    </Button>
                </Space>
            </Card>

            {/* Información adicional */}
            <Card title="Sobre esta integración">
                <Paragraph>
                    <Text strong>Ant Design 6.3.5</Text> está completamente
                    integrado con el stack tecnológico del proyecto:
                </Paragraph>
                <ul>
                    <li>✅ Laravel 11 como backend</li>
                    <li>✅ React 19 con TypeScript</li>
                    <li>✅ Inertia.js para SPA sin API REST</li>
                    <li>✅ Vite como bundler</li>
                    <li>✅ Tema personalizado con soporte dark mode</li>
                    <li>✅ Componentes en español (esES locale)</li>
                </ul>
            </Card>
        </Space>
    );
}
