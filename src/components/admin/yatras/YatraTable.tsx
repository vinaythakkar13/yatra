import React from 'react';
import { Yatra } from '@/types';
import { Mountain, Calendar, CheckCircle, XCircle, Edit2, Trash2 } from 'lucide-react';
import Table from '@/components/ui/Table';
import Image from 'next/image';

interface YatraTableProps {
    yatras: Yatra[];
    onEdit: (yatra: Yatra) => void;
    onDelete: (id: string) => void;
}

const YatraTable: React.FC<YatraTableProps> = ({ yatras, onEdit, onDelete }) => {
    const columns = [
        {
            key: 'name',
            header: 'Yatra Name',
            render: (yatra: Yatra) => (
                <div className="flex items-center gap-2">
                     <div className="flex items-center gap-2 cursor-pointer" onClick={() => window.open(yatra.banner_image, '_blank')}>
                    <Image src={yatra.banner_image} alt={yatra.name} width={100} height={100} className="w-10 h-10 object-cover rounded-lg" />
                </div>
                <div className="flex items-center gap-2">
                    <span className="font-semibold text-heritage-textDark">{yatra.name}</span>
                </div>
                </div>
            )
        },

        // make Yatra dates combine start and end date in a single column
        {
            key: 'dates',
            header: 'Yatra Dates',
            render: (yatra: Yatra) => (
                <div className="flex items-center gap-1.5 text-sm text-heritage-text">
                    <Calendar className="w-4 h-4 text-heritage-secondary" />
                    {new Date(yatra.start_date).toLocaleDateString('en-IN', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric'
                    })} - {new Date(yatra.end_date).toLocaleDateString('en-IN', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric'
                    })}
                </div>
            )
        },

        // make Registration dates combine start and end date in a single column
        {
            key: 'registration_dates',
            header: 'Registration Dates',
            render: (yatra: Yatra) => (
                <div className="flex items-center gap-1.5 text-sm text-heritage-text">
                    <Calendar className="w-4 h-4 text-heritage-secondary" />
                    {new Date(yatra.registration_start_date).toLocaleDateString('en-IN', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric'
                    })} - {new Date(yatra.registration_end_date).toLocaleDateString('en-IN', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric'
                    })}
                </div>
            )
        },
        {
            key: 'actions',
            header: 'Actions',
            render: (yatra: Yatra) => (
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => onEdit(yatra)}
                        className="p-2 text-heritage-primary hover:bg-heritage-highlight/50 rounded-lg transition-colors"
                        title="Edit Yatra"
                    >
                        <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                        onClick={() => onDelete(yatra.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete Yatra"
                    >
                        <Trash2 className="w-4 h-4" />
                    </button>
                </div>
            )
        }
    ];

    return (
        <div className="bg-white/70 backdrop-blur-md border border-white/40 shadow-glass rounded-2xl overflow-hidden font-inter">
            <div className="p-5 border-b border-heritage-gold/20 bg-heritage-highlight/20">
                <h2 className="text-xl font-bold text-heritage-textDark">All Yatras</h2>
            </div>
            <Table
                data={yatras}
                columns={columns}
                emptyMessage="No yatras found. Create your first yatra to get started."
            />
        </div>
    );
};

export default YatraTable;
