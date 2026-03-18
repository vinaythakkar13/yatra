import React from 'react';
import { RefreshCw, Phone } from 'lucide-react';
import Table from '@/components/ui/Table';
import HouseMedicalXmarkIcon from '@/components/ui/svg/HouseMedicalXmarkIcon';

interface UserStatusTableProps {
    data: any[];
    onUnassignRoom: (user: any) => void;
    isLoading?: boolean;
    userRole?: string;
}

const UserStatusTable: React.FC<UserStatusTableProps> = ({
    data,
    onUnassignRoom,
    isLoading = false,
    userRole,
}) => {
    const columns = [
        {
            key: 'pnr',
            header: 'PNR',
            render: (row: any) => (
                <span className="font-mono font-semibold text-heritage-primary">{row.pnr}</span>
            ),
        },
        {
            key: 'name',
            header: 'Name',
            render: (row: any) => (
                <span className="font-bold text-heritage-textDark">{row.name}</span>
            ),
        },
        {
            key: 'contact',
            header: 'Contact',
            render: (row: any) => (
                <span className="text-heritage-text flex items-center gap-2">
                    <Phone className="w-3 h-3 inline-block" />
                    <span className="font-medium">{row.whatsappNumber}</span>
                </span>
            ),
        },
        {
            key: 'numberOfPersons',
            header: 'Passengers',
            render: (row: any) => (
                <span className="bg-heritage-highlight/30 text-heritage-textDark px-3 py-1 rounded-full text-sm font-semibold">
                    {row.numberOfPersons || 0}
                </span>
            ),
        },
        {
            key: 'roomStatus',
            header: 'Room Status',
            render: (row: any) => (
                <span
                    className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold w-fit ${
                        row.status === 'checked in'
                            ? 'bg-green-100 text-green-700'
                            : row.status === 'checked out'
                            ? 'bg-blue-100 text-blue-700'
                            : 'bg-yellow-100 text-yellow-700'
                    }`}
                >
                    {row.status ? row.status.charAt(0).toUpperCase() + row.status.slice(1) : ''}
                </span>
            ),
        },
        {
            key: 'actions',
            header: 'Actions',
            render: (row: any) => (
                <div className="flex gap-2">
                    {userRole !== 'staff' && (
                        <button
                            onClick={() => onUnassignRoom(row)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Remove Assignment"
                        >
                            <HouseMedicalXmarkIcon size={24} stroke="red" />
                        </button>
                    )}
                </div>
            ),
        },
    ];

    return (
        <div className="relative bg-white/70 backdrop-blur-md border border-white/40 rounded-glass shadow-glass font-inter">
            {isLoading && (
                <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/40 backdrop-blur-[2px] rounded-glass transition-all duration-300">
                    <div className="flex flex-col items-center gap-3">
                        <RefreshCw className="w-10 h-10 text-heritage-primary animate-spin" />
                        <span className="text-sm font-semibold text-heritage-textDark tracking-wide">
                            Updating data...
                        </span>
                    </div>
                </div>
            )}
            <div className="overflow-hidden rounded-glass">
                <Table
                    columns={columns}
                    data={data}
                    emptyMessage="No registrations found"
                />
            </div>
        </div>
    );
};

export default UserStatusTable;
