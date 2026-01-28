'use client';

import React from 'react';
import {
    PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend
} from 'recharts';
import { motion } from 'framer-motion';
import { Hotel, Bed, CheckCircle2, AlertCircle } from 'lucide-react';

interface HotelInfographicsProps {
    hotelAvailability: {
        name: string;
        totalRooms: number;
        availableRooms: number;
        totalBeds: number;
        availableBeds: number;
    }[];
}

const COLORS = ['#EBA83A', '#D97A32', '#762A25', '#C8A55C', '#6B5A45'];

const HotelInfographics: React.FC<HotelInfographicsProps> = ({ hotelAvailability }) => {
    // Aggregated data for overall room utilization
    const totalRooms = hotelAvailability?.reduce((acc, h) => acc + h.totalRooms, 0);
    const availableRooms = hotelAvailability?.reduce((acc, h) => acc + h.availableRooms, 0);
    const occupiedRooms = totalRooms - availableRooms;

    const roomChartData = [
        { name: 'Occupied', value: occupiedRooms },
        { name: 'Available', value: availableRooms },
    ];

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8 relative">
            <style jsx global>{`
                .recharts-surface:focus, 
                .recharts-wrapper:focus,
                path:focus,
                rect:focus,
                .recharts-rectangle:focus,
                .recharts-pie-sector:focus {
                    outline: none !important;
                }
            `}</style>

            {/* Overall Utilization */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white/70 backdrop-blur-xl border border-white/40 p-6 rounded-glass shadow-glass-soft"
            >
                <div className="flex items-center gap-2 mb-6">
                    <Hotel className="w-5 h-5 text-heritage-primary" />
                    <h3 className="text-lg font-bold text-heritage-textDark">Room Utilization</h3>
                </div>
                <div className="h-64 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={roomChartData}
                                innerRadius={60}
                                outerRadius={80}
                                paddingAngle={5}
                                dataKey="value"
                            >
                                <Cell fill="#762A25" />
                                <Cell fill="#C8A55C" />
                            </Pie>
                            <Tooltip />
                            <Legend />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
                <div className="mt-4 flex justify-between text-sm text-heritage-text/70 border-t border-white/40 pt-4">
                    <div className="flex items-center gap-1">
                        <CheckCircle2 className="w-4 h-4 text-green-600" />
                        <span>Total: {totalRooms} Rooms</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <AlertCircle className="w-4 h-4 text-heritage-primary" />
                        <span>{Math.round((occupiedRooms / totalRooms) * 100)}% Occupied</span>
                    </div>
                </div>
            </motion.div>

            {/* Hotel Wise Availability */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white/70 backdrop-blur-xl border border-white/40 p-6 rounded-glass shadow-glass-soft lg:col-span-2"
            >
                <div className="flex items-center gap-2 mb-6">
                    <Bed className="w-5 h-5 text-heritage-secondary" />
                    <h3 className="text-lg font-bold text-heritage-textDark">Hotel Availability Breakdown</h3>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="text-xs uppercase tracking-wider text-heritage-text/50 border-b border-white/40">
                                <th className="pb-3 font-bold">Hotel Name</th>
                                <th className="pb-3 font-bold text-center">Rooms (Avail/Total)</th>
                                <th className="pb-3 font-bold text-center">Beds (Avail/Total)</th>
                                <th className="pb-3 font-bold text-right">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/20">
                            {hotelAvailability?.map((hotel, idx) => (
                                <tr key={idx} className="group hover:bg-white/30 transition-colors">
                                    <td className="py-4 font-semibold text-heritage-textDark">{hotel.name}</td>
                                    <td className="py-4 text-center">
                                        <div className="flex flex-col items-center">
                                            <span className="text-sm font-bold text-heritage-maroon">{hotel.availableRooms} / {hotel.totalRooms}</span>
                                            <div className="w-20 h-1 bg-white/50 rounded-full mt-1 overflow-hidden">
                                                <div
                                                    className="h-full bg-heritage-maroon"
                                                    style={{ width: `${(hotel.availableRooms / hotel.totalRooms) * 100}%` }}
                                                />
                                            </div>
                                        </div>
                                    </td>
                                    <td className="py-4 text-center">
                                        <div className="flex flex-col items-center">
                                            <span className="text-sm font-bold text-heritage-primary">{hotel.availableBeds} / {hotel.totalBeds}</span>
                                            <div className="w-20 h-1 bg-white/50 rounded-full mt-1 overflow-hidden">
                                                <div
                                                    className="h-full bg-heritage-primary"
                                                    style={{ width: `${(hotel.availableBeds / hotel.totalBeds) * 100}%` }}
                                                />
                                            </div>
                                        </div>
                                    </td>
                                    <td className="py-4 text-right">
                                        <span className={`px-2 py-1 rounded-full text-xs font-bold ${hotel.availableRooms > 5 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                                            }`}>
                                            {hotel.availableRooms > 5 ? 'Stable' : 'Limited'}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </motion.div>
        </div>
    );
};

export default HotelInfographics;
