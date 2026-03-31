import { Card, Statistic, Progress } from '@/components/antd';
import { TrafficLight } from '@/components/bsc/traffic-light';
import { ArrowUpOutlined, ArrowDownOutlined } from '@ant-design/icons';

interface KPICardProps {
    name: string;
    value: number;
    target: number;
    unit: string;
    trafficLight: 'green' | 'yellow' | 'red' | 'grey';
    trend?: 'up' | 'down';
    trendValue?: number;
    loading?: boolean;
}

export function KPICard({
    name,
    value,
    target,
    unit,
    trafficLight,
    trend,
    trendValue,
    loading = false,
}: KPICardProps) {
    const compliance = target > 0 ? (value / target) * 100 : 0;
    const isPositiveTrend = trend === 'up';

    return (
        <Card loading={loading} hoverable>
            <div className="space-y-4">
                <div className="flex items-start justify-between">
                    <div className="flex-1">
                        <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">
                            {name}
                        </h3>
                    </div>
                    <TrafficLight color={trafficLight} showText={false} />
                </div>

                <div className="space-y-2">
                    <Statistic
                        value={value}
                        suffix={unit}
                        precision={2}
                        valueStyle={{ fontSize: '1.75rem', fontWeight: 600 }}
                    />
                    
                    <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                        <span>Meta: {target} {unit}</span>
                        {trend && trendValue !== undefined && (
                            <span className={isPositiveTrend ? 'text-green-600' : 'text-red-600'}>
                                {isPositiveTrend ? <ArrowUpOutlined /> : <ArrowDownOutlined />}
                                {' '}{Math.abs(trendValue)}%
                            </span>
                        )}
                    </div>

                    <Progress
                        percent={Math.min(compliance, 100)}
                        status={trafficLight === 'green' ? 'success' : trafficLight === 'yellow' ? 'normal' : 'exception'}
                        strokeColor={
                            trafficLight === 'green' ? '#52c41a' :
                            trafficLight === 'yellow' ? '#faad14' : '#ff4d4f'
                        }
                        size="small"
                    />
                </div>
            </div>
        </Card>
    );
}
