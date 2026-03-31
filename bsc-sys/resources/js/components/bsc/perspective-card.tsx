import { Card, Tag } from '@/components/antd';
import { 
    DollarOutlined, 
    UserOutlined, 
    SettingOutlined, 
    ReadOutlined,
    StarOutlined 
} from '@ant-design/icons';

type PerspectiveType = 'financial' | 'customer' | 'process' | 'learning' | 'custom';

interface PerspectiveCardProps {
    name: string;
    type: PerspectiveType;
    objectivesCount: number;
    kpisCount: number;
    color?: string;
    onClick?: () => void;
}

const perspectiveConfig: Record<PerspectiveType, { icon: React.ReactNode; defaultColor: string; label: string }> = {
    financial: { 
        icon: <DollarOutlined />, 
        defaultColor: '#3b82f6',
        label: 'Financiera'
    },
    customer: { 
        icon: <UserOutlined />, 
        defaultColor: '#10b981',
        label: 'Cliente'
    },
    process: { 
        icon: <SettingOutlined />, 
        defaultColor: '#f59e0b',
        label: 'Procesos'
    },
    learning: { 
        icon: <ReadOutlined />, 
        defaultColor: '#8b5cf6',
        label: 'Aprendizaje'
    },
    custom: { 
        icon: <StarOutlined />, 
        defaultColor: '#6b7280',
        label: 'Personalizada'
    },
};

export function PerspectiveCard({
    name,
    type,
    objectivesCount,
    kpisCount,
    color,
    onClick,
}: PerspectiveCardProps) {
    const config = perspectiveConfig[type];
    const cardColor = color || config.defaultColor;

    return (
        <Card 
            hoverable 
            onClick={onClick}
            className="border-t-4"
            style={{ borderTopColor: cardColor }}
        >
            <div className="space-y-4">
                <div className="flex items-start justify-between">
                    <div 
                        className="flex h-12 w-12 items-center justify-center rounded-lg text-xl"
                        style={{ 
                            backgroundColor: `${cardColor}20`,
                            color: cardColor 
                        }}
                    >
                        {config.icon}
                    </div>
                    <Tag color={cardColor}>{config.label}</Tag>
                </div>

                <div>
                    <h3 className="text-lg font-semibold">{name}</h3>
                </div>

                <div className="flex gap-4 text-sm text-gray-600 dark:text-gray-400">
                    <div>
                        <span className="font-semibold">{objectivesCount}</span>
                        {' '}Objetivos
                    </div>
                    <div>
                        <span className="font-semibold">{kpisCount}</span>
                        {' '}KPIs
                    </div>
                </div>
            </div>
        </Card>
    );
}
