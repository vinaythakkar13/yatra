'use client';

import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

interface RegistrationData {
    label: string;
    value: number;
    color: string;
    [key: string]: any;
}

interface RegistrationPieChartProps {
    data: RegistrationData[];
}

const RegistrationPieChart: React.FC<RegistrationPieChartProps> = ({ data }) => {
    return (
        <div className="w-full h-full font-inter">
            <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                    <Pie
                        data={data}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                        nameKey="label"
                    >
                        {data.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                        ))}
                    </Pie>
                    <Tooltip
                        wrapperStyle={{ zIndex: '100' }}
                        contentStyle={{
                            backgroundColor: 'rgba(255, 255, 255, 1)',
                            borderRadius: '12px',
                            border: '1px solid rgba(255, 255, 255, 0.4)',
                            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                        }}
                        itemStyle={{ color: '#1F2937', fontSize: '12px', fontWeight: 600 }}
                    />
                </PieChart>
            </ResponsiveContainer>
        </div>
    );
};

export default RegistrationPieChart;
