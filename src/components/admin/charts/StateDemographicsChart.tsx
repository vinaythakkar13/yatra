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
    Cell
} from 'recharts';

interface DemographicsData {
    state: string;
    total: number;
    male: number;
    female: number;
    ageGroups: {
        '0-18': number;
        '19-40': number;
        '41-60': number;
        '60+': number;
    };
}

interface StateDemographicsChartProps {
    data: DemographicsData[];
}

const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
        const data = payload[0].payload as DemographicsData;
        return (
            <div className="bg-white/90 backdrop-blur-md border border-white/40 p-4 rounded-xl shadow-glass text-sm">
                <p className="font-bold text-heritage-textDark mb-2 text-base">{label}</p>

                <div className="grid grid-cols-2 gap-x-6 gap-y-1 mb-3">
                    <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-heritage-primary"></span>
                        <span className="text-heritage-text/70">Total:</span>
                        <span className="font-semibold text-heritage-textDark">{data.total}</span>
                    </div>
                </div>

                <div className="space-y-3">
                    <div>
                        <p className="text-xs font-semibold text-heritage-text/50 uppercase tracking-wider mb-1">Gender</p>
                        <div className="grid grid-cols-2 gap-2">
                            <div className="flex justify-between bg-blue-50 px-2 py-1 rounded-md">
                                <span className="text-blue-700">Male</span>
                                <span className="font-semibold text-blue-900">{data.male}</span>
                            </div>
                            <div className="flex justify-between bg-pink-50 px-2 py-1 rounded-md">
                                <span className="text-pink-700">Female</span>
                                <span className="font-semibold text-pink-900">{data.female}</span>
                            </div>
                        </div>
                    </div>

                    <div>
                        <p className="text-xs font-semibold text-heritage-text/50 uppercase tracking-wider mb-1">Age Groups</p>
                        <div className="grid grid-cols-2 gap-2 text-xs">
                            {Object.entries(data.ageGroups).map(([range, count]) => (
                                <div key={range} className="flex justify-between items-center bg-heritage-highlight/30 px-2 py-1 rounded-md">
                                    <span className="text-heritage-text/70">{range}</span>
                                    <span className="font-semibold text-heritage-textDark">{count}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        );
    }
    return null;
};

const StateDemographicsChart: React.FC<StateDemographicsChartProps> = ({ data }) => {
    return (
        <div className="w-full h-72">
            <ResponsiveContainer width="100%" height="100%">
                <BarChart
                    data={data}
                    margin={{
                        top: 20,
                        right: 10,
                        left: -20,
                        bottom: 0,
                    }}
                >
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                    <XAxis
                        dataKey="state"
                        tick={{ fontSize: 11, fill: '#6B7280' }}
                        axisLine={false}
                        tickLine={false}
                        interval={0}
                    />
                    <YAxis
                        tick={{ fontSize: 11, fill: '#6B7280' }}
                        axisLine={false}
                        tickLine={false}
                    />
                    <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(0,0,0,0.05)', radius: 8 }} />
                    <Bar dataKey="total" radius={[6, 6, 0, 0]} barSize={40}>
                        {data.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={index % 2 === 0 ? '#EBA83A' : '#D97A32'} />
                        ))}
                    </Bar>
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
};

export default StateDemographicsChart;
