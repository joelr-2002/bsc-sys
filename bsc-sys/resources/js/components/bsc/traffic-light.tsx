import { Badge } from '@/components/antd';
import type { BadgeProps } from 'antd';

type TrafficLightColor = 'green' | 'yellow' | 'red' | 'grey';

interface TrafficLightProps {
    color: TrafficLightColor;
    size?: 'small' | 'default';
    showText?: boolean;
}

const colorMap: Record<TrafficLightColor, { status: BadgeProps['status']; text: string }> = {
    green: { status: 'success', text: 'Cumplido' },
    yellow: { status: 'warning', text: 'En Riesgo' },
    red: { status: 'error', text: 'Crítico' },
    grey: { status: 'default', text: 'Sin Datos' },
};

export function TrafficLight({ color, size = 'default', showText = true }: TrafficLightProps) {
    const { status, text } = colorMap[color];

    return (
        <Badge 
            status={status} 
            text={showText ? text : undefined}
            className={size === 'small' ? 'text-xs' : ''}
        />
    );
}
