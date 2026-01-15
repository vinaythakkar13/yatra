'use client';

import React from 'react';
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from 'recharts';

interface ActivityData {
    name: string;
    registrations: number;
    assignments: number;
}

interface ActivityAreaChartProps {
    data: ActivityData[];
}

const ActivityAreaChart: React.FC<ActivityAreaChartProps> = ({ data }) => {
    return (
        <div className="w-full h-64">
            <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                    data={data}
                    margin={{
                        top: 10,
                        right: 10,
                        left: -20,
                        bottom: 0,
                    }}
                >
                    <defs>
                        <linearGradient id="colorRegistrations" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#7C8CFB" stopOpacity={0.3} />
                            <stop offset="95%" stopColor="#7C8CFB" stopOpacity={0} />
                        </linearGradient>
                        <linearGradient id="colorAssignments" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#EBA83A" stopOpacity={0.3} />
                            <stop offset="95%" stopColor="#EBA83A" stopOpacity={0} />
                        </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                    <XAxis
                        dataKey="name"
                        tick={{ fontSize: 10, fill: '#6B7280' }}
                        axisLine={false}
                        tickLine={false}
                    />
                    <YAxis
                        tick={{ fontSize: 10, fill: '#6B7280' }}
                        axisLine={false}
                        tickLine={false}
                    />
                    <Tooltip
                        contentStyle={{
                            backgroundColor: 'rgba(255, 255, 255, 0.9)',
                            borderRadius: '12px',
                            border: '1px solid rgba(255, 255, 255, 0.4)',
                            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                        }}
                        itemStyle={{ fontSize: '12px', fontWeight: 600 }}
                    />
                    <Area
                        type="monotone"
                        dataKey="registrations"
                        name="New Registrations"
                        stroke="#7C8CFB"
                        fillOpacity={1}
                        fill="url(#colorRegistrations)"
                        strokeWidth={2}
                    />
                    <Area
                        type="monotone"
                        dataKey="assignments"
                        name="Rooms Assigned"
                        stroke="#EBA83A"
                        fillOpacity={1}
                        fill="url(#colorAssignments)"
                        strokeWidth={2}
                    />
                </AreaChart>
            </ResponsiveContainer>
        </div>
    );
};

export default ActivityAreaChart;
