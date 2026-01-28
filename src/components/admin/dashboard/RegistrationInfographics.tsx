import React, { useMemo } from 'react';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    PieChart, Pie, Cell, Legend
} from 'recharts';
import { motion } from 'framer-motion';
import { Accessibility, Users, MapPin, User, UserPlus } from 'lucide-react';
import { StateData } from '@/services/dashboardApi';

interface RegistrationInfographicsProps {
    stateData: StateData[];
    genderData: { name: string; value: number }[];
    ageData: { range: string; count: number }[];
    handicapCount: number;
}

const COLORS = ['#EBA83A', '#D97A32', '#762A25', '#C8A55C', '#6B5A45'];

const CustomStateTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
        const data = payload[0].payload as StateData;

        // Aggregate data from cities
        const stats = data.cities.reduce((acc, city) => {
            acc.male += city.gender.male;
            acc.female += city.gender.female;
            acc.handicapped += city.handicappedCount;
            acc.age0_18 += city.ageRanges['0-18'];
            acc.age19_35 += city.ageRanges['19-35'];
            acc.age36_50 += city.ageRanges['36-50'];
            acc.age50_plus += city.ageRanges['50+'];
            return acc;
        }, {
            male: 0,
            female: 0,
            handicapped: 0,
            age0_18: 0,
            age19_35: 0,
            age36_50: 0,
            age50_plus: 0
        });

        return (
            <div className="bg-white/95 backdrop-blur-md border border-white/40 p-4 rounded-2xl shadow-xl min-w-[200px] pointer-events-none">
                <h4 className="text-heritage-textDark font-bold border-b border-heritage-primary/20 pb-2 mb-3 flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-heritage-maroon" />
                    {data.state}
                </h4>

                <div className="space-y-3">
                    <div className="flex justify-between items-center text-sm">
                        <span className="text-heritage-text/70 flex items-center gap-1">Total</span>
                        <span className="font-bold text-heritage-maroon">{data.totalCount}</span>
                    </div>

                    <div className="pt-2 border-t border-heritage-primary/10">
                        <p className="text-[10px] uppercase tracking-wider text-heritage-text/40 mb-2 font-bold">Gender Distribution</p>
                        <div className="flex justify-between gap-4">
                            <div className="flex items-center gap-1.5">
                                <User className="w-3.5 h-3.5 text-blue-600" />
                                <span className="text-xs text-heritage-text/70">Male: </span>
                                <span className="text-xs font-bold text-heritage-textDark">{stats.male}</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                                <UserPlus className="w-3.5 h-3.5 text-pink-600" />
                                <span className="text-xs text-heritage-text/70">Female: </span>
                                <span className="text-xs font-bold text-heritage-textDark">{stats.female}</span>
                            </div>
                        </div>
                    </div>

                    <div className="pt-2 border-t border-heritage-primary/10">
                        <p className="text-[10px] uppercase tracking-wider text-heritage-text/40 mb-2 font-bold">Special Assistance</p>
                        <div className="flex items-center gap-1.5 text-orange-600">
                            <Accessibility className="w-3.5 h-3.5" />
                            <span className="text-xs">Handicapped: </span>
                            <span className="text-xs font-bold ml-auto">{stats.handicapped}</span>
                        </div>
                    </div>

                    <div className="pt-2 border-t border-heritage-primary/10">
                        <p className="text-[10px] uppercase tracking-wider text-heritage-text/40 mb-2 font-bold">Age Groups</p>
                        <div className="grid grid-cols-2 gap-y-1 gap-x-3">
                            <div className="flex justify-between">
                                <span className="text-[11px] text-heritage-text/60">0-18:</span>
                                <span className="text-[11px] font-bold">{stats.age0_18}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-[11px] text-heritage-text/60">19-35:</span>
                                <span className="text-[11px] font-bold">{stats.age19_35}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-[11px] text-heritage-text/60">36-50:</span>
                                <span className="text-[11px] font-bold">{stats.age36_50}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-[11px] text-heritage-text/60">50+:</span>
                                <span className="text-[11px] font-bold">{stats.age50_plus}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
    return null;
};

const RegistrationInfographics: React.FC<RegistrationInfographicsProps> = ({
    stateData, genderData, ageData, handicapCount
}) => {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8 relative">
            {/* Global style for Recharts to remove focus outline */}
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

            {/* State-wise Registration */}
            <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-white/70 backdrop-blur-xl border border-white/40 p-6 rounded-glass shadow-glass-soft"
            >
                <div className="flex items-center gap-2 mb-6">
                    <MapPin className="w-5 h-5 text-heritage-maroon" />
                    <h3 className="text-lg font-bold text-heritage-textDark">Registrations by State</h3>
                </div>
                <div className="h-80 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={stateData || []} layout="vertical">
                            <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="rgba(0,0,0,0.05)" />
                            <XAxis type="number" hide />
                            <YAxis
                                dataKey="state"
                                type="category"
                                width={100}
                                axisLine={false}
                                tickLine={false}
                                tick={{ fill: '#6B5A45', fontSize: 12, fontWeight: 500 }}
                            />
                            <Tooltip
                                content={<CustomStateTooltip />}
                                cursor={{ fill: 'rgba(235,168,58,0.05)' }}
                            />
                            <Bar
                                dataKey="totalCount"
                                fill="#EBA83A"
                                radius={[0, 8, 8, 0]}
                                barSize={20}
                                animationDuration={1500}
                            />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </motion.div>

            {/* Demographics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Gender Distribution */}
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="bg-white/70 backdrop-blur-xl border border-white/40 p-6 rounded-glass shadow-glass-soft"
                >
                    <div className="flex items-center gap-2 mb-4">
                        <Users className="w-5 h-5 text-heritage-secondary" />
                        <h3 className="text-lg font-bold text-heritage-textDark">Gender</h3>
                    </div>
                    <div className="h-48 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={genderData}
                                    innerRadius={50}
                                    outerRadius={70}
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {genderData?.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip cursor={{ fill: 'transparent' }} />
                                <Legend verticalAlign="bottom" height={36} />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </motion.div>

                {/* Handicap Count Card */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-gradient-to-br from-heritage-maroon to-heritage-textDark p-6 rounded-glass shadow-glass-soft text-white flex flex-col items-center justify-center text-center"
                >
                    <Accessibility className="w-12 h-12 mb-3 text-heritage-gold" />
                    <p className="text-sm opacity-80 uppercase tracking-widest font-medium">Handicap Registrations</p>
                    <h3 className="text-5xl font-black mt-2">{handicapCount}</h3>
                    <p className="text-xs mt-3 opacity-60">Requires special assistance</p>
                </motion.div>

                {/* Age Range Distribution */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white/70 backdrop-blur-xl border border-white/40 p-6 rounded-glass shadow-glass-soft md:col-span-2"
                >
                    <div className="flex items-center gap-2 mb-6">
                        <Users className="w-5 h-5 text-heritage-primary" />
                        <h3 className="text-lg font-bold text-heritage-textDark">Age Distribution</h3>
                    </div>
                    <div className="h-48 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={ageData}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(0,0,0,0.05)" />
                                <XAxis
                                    dataKey="range"
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: '#6B5A45', fontSize: 12 }}
                                />
                                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#6B5A45', fontSize: 12 }} />
                                <Tooltip
                                    cursor={{ fill: 'rgba(235,168,58,0.1)' }}
                                    contentStyle={{ borderRadius: '12px', border: 'none' }}
                                />
                                <Bar dataKey="count" fill="#D97A32" radius={[8, 8, 0, 0]} barSize={40} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default RegistrationInfographics;
