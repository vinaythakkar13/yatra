'use client';

import React from 'react';
import { Users, UserMinus, Home, Bed, Clock, UserCheck, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';

interface StatCardProps {
    title: string;
    value: string | number;
    icon: React.ElementType;
    color: string;
    description?: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon: Icon, color, description }) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/70 backdrop-blur-xl border border-white/40 p-6 rounded-glass shadow-glass-soft flex items-center gap-4"
    >
        <div className={`p-4 rounded-2xl ${color} bg-opacity-20 flex items-center justify-center flex-shrink-0`}>
            <Icon className={`w-8 h-8 ${color.replace('bg-', 'text-')}`} />
        </div>
        <div className="min-w-0">
            <p className="text-sm font-medium text-heritage-text/70 truncate">{title}</p>
            <h3 className="text-2xl font-bold text-heritage-textDark">{value}</h3>
            {description && <p className="text-xs text-heritage-text/50 mt-1 truncate">{description}</p>}
        </div>
    </motion.div>
);

interface DashboardStatsProps {
    stats: {
        totalRegistrations: number;
        totalPeople: number;
        allottedRegistrations: number;
        pendingAllotment: number;
        cancelledRegistrations: number;
        availableRooms: number;
        availableBeds: number;
    };
}

const DashboardStats: React.FC<DashboardStatsProps> = ({ stats }) => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatCard
                title="Registration Entries"
                value={stats.totalRegistrations}
                icon={Users}
                color="bg-heritage-primary"
                description="Total booking forms"
            />
            <StatCard
                title="Total Participants"
                value={stats.totalPeople}
                icon={UserCheck}
                color="bg-heritage-gold"
                description="Count across all entries"
            />
            <StatCard
                title="Allotted"
                value={stats.allottedRegistrations}
                icon={CheckCircle2}
                color="bg-green-100"
                description="Finalized bookings"
            />
            <StatCard
                title="Pending Allotment"
                value={stats.pendingAllotment}
                icon={Clock}
                color="bg-heritage-maroon"
                description="Waitlisted for rooms"
            />
            <StatCard
                title="Cancelled"
                value={stats.cancelledRegistrations}
                icon={UserMinus}
                color="bg-heritage-secondary"
                description="Withdrawals"
            />
            <StatCard
                title="Available Rooms"
                value={stats.availableRooms}
                icon={Home}
                color="bg-heritage-gold"
                description="Current vacant rooms"
            />
            <StatCard
                title="Available Beds"
                value={stats.availableBeds}
                icon={Bed}
                color="bg-kesari-light"
                description="Current vacant beds"
            />
        </div>
    );
};

export default DashboardStats;
