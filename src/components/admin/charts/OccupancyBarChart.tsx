'use client';

import React from 'react';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Cell,
} from 'recharts';

interface OccupancyData {
    name: string;
    percent: number;
}

interface OccupancyBarChartProps {
    data: OccupancyData[];
}

const OccupancyBarChart: React.FC<OccupancyBarChartProps> = ({ data }) => {
    return (
        <div className="w-full h-48">
            <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                    <XAxis
                        dataKey="name"
                        tick={{ fontSize: 10, fill: '#6B7280' }}
                        axisLine={false}
                        tickLine={false}
                        interval={0}
                        tickFormatter={(value) => value.split(' ')[0]}
                    />
                    <YAxis
                        tick={{ fontSize: 10, fill: '#6B7280' }}
                        axisLine={false}
                        tickLine={false}
                        domain={[0, 100]}
                    />
                    <Tooltip
                        cursor={{ fill: '#F3F4F6' }}
                        contentStyle={{
                            backgroundColor: 'rgba(255, 255, 255, 0.9)',
                            borderRadius: '12px',
                            border: '1px solid rgba(255, 255, 255, 0.4)',
                            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                        }}
                        itemStyle={{ color: '#1F2937', fontSize: '12px', fontWeight: 600 }}
                        formatter={(value: number | undefined) => [`${value ?? 0}%`, 'Occupancy']}
                    />
                    <Bar dataKey="percent" radius={[4, 4, 0, 0]}>
                        {data.map((entry, index) => (
                            <Cell
                                key={`cell-${index}`}
                                fill={index % 2 === 0 ? '#EBA83A' : '#D97A32'}
                            />
                        ))}
                    </Bar>
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
};

export default OccupancyBarChart;
