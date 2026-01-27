import React from 'react';
import { Eye, RefreshCw, UserX, Home, FileText, CheckCircle, XCircle, ArrowRight, ArrowLeft } from 'lucide-react';
import Table from '@/components/ui/Table';

interface UserTableProps {
    data: any[];
    onViewDetails: (user: any) => void;
    onAssignRoom: (user: any) => void;
    onReassignRoom: (user: any) => void;
    onUnassignRoom: (user: any) => void;
    onViewDocuments: (user: any) => void;
}

const UserTable: React.FC<UserTableProps> = ({
    data,
    onViewDetails,
    onAssignRoom,
    onReassignRoom,
    onUnassignRoom,
    onViewDocuments,
}) => {

    console.log(data);

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
                <span className="font-semibold text-heritage-textDark">{row.name}</span>
            ),
        },
        {
            key: 'contactNumber',
            header: 'Contact',
            render: (row: any) => (
                <span className="text-heritage-text">{row.contactNumber}</span>
            ),
        },
        {
            key: 'numberOfPersons',
            header: 'Persons',
            render: (row: any) => (
                <span className="bg-heritage-highlight/30 text-heritage-textDark px-3 py-1 rounded-full text-sm font-semibold">
                    {row.numberOfPersons}
                </span>
            ),
        },
        {
            key: 'boardingPoint',
            header: 'Boarding Point',
            render: (row: any) => (
                <span className="text-heritage-text">
                    {row.boardingPoint.city}, {row.boardingPoint.state}
                </span>
            ),
        },
        {
            key: 'arrivalDate',
            header: 'Journey Dates',
            render: (row: any) => (
                <div className="flex flex-col gap-1">
                    <span className="text-heritage-text whitespace-nowrap bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs font-semibold">
                        {/* arrival icon */}
                        <ArrowRight className="w-4 h-4 inline-block" />
                        <span className="ml-1">{row.arrivalDate}</span>
                    </span>

                    {/* make it badge red for departure with exit icon */}
                    <span className="text-heritage-text whitespace-nowrap bg-red-100 text-red-700 px-2 py-1 rounded-full text-xs font-semibold">
                        <ArrowLeft className="w-4 h-4 inline-block" />
                        <span className="ml-1">{row.returnDate}</span>
                    </span>
                </div>
            ),
        },
        {
            key: 'roomStatus',
            header: 'Room Status',
            render: (row: any) => (
                <div className="flex flex-col gap-1">
                    <span
                        className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold w-fit ${row.roomStatus === 'Assigned'
                            ? 'bg-green-100 text-green-700'
                            : 'bg-yellow-100 text-yellow-700'
                            }`}
                    >
                        {row.roomStatus}
                    </span>
                    {row?.roomNumber && (
                        <span className="text-xs text-heritage-text/70">Room: {row.roomNumber}</span>
                    )}
                </div>
            ),
        },
        {
            key: 'documents',
            header: 'Documents',
            render: (row: any) => (
                <div className="flex flex-col gap-1">
                    {row.ticketImages && row.ticketImages.length > 0 ? (
                        <>
                            <button
                                onClick={() => onViewDocuments(row)}
                                className="inline-flex items-center gap-1 px-2 py-1 text-xs font-semibold text-heritage-primary hover:bg-heritage-highlight/20 rounded-lg transition-colors w-fit"
                                title="View Documents"
                            >
                                <FileText className="w-3.5 h-3.5" />
                                {row.ticketImages.length} doc(s)
                            </button>
                            <span
                                className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold w-fit ${row.documentStatus === 'approved'
                                    ? 'bg-green-100 text-green-700'
                                    : row.documentStatus === 'rejected'
                                        ? 'bg-red-100 text-red-700'
                                        : row.documentStatus === 'cancelled'
                                            ? 'bg-red-600 text-white shadow-sm'
                                            : 'bg-yellow-100 text-yellow-700'
                                    }`}
                            >
                                {row.documentStatus === 'approved' ? '✓ Approved' : row.documentStatus === 'rejected' ? '✕ Rejected' : row.documentStatus === 'cancelled' ? '🗙 Cancelled' : '⏳ Pending'}
                            </span>
                        </>
                    ) : (
                        <span className="text-xs text-gray-400">No docs</span>
                    )}
                </div>
            ),
        },
        {
            key: 'actions',
            header: 'Actions',
            render: (row: any) => (
                <div className="flex gap-2">
                    <button
                        onClick={() => onViewDetails(row)}
                        className="p-2 text-heritage-primary hover:bg-heritage-highlight/20 rounded-lg transition-colors"
                        title="View Details"
                    >
                        <Eye className="w-4 h-4" />
                    </button>
                    {row?.roomStatus === 'Assigned' ? (
                        <>
                            <button
                                onClick={() => onReassignRoom(row)}
                                className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                title="Reassign Room"
                            >
                                <RefreshCw className="w-4 h-4" />
                            </button>
                            <button
                                onClick={() => onUnassignRoom(row)}
                                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                title="Remove Assignment"
                            >
                                <UserX className="w-4 h-4" />
                            </button>
                        </>
                    ) : (
                        <button
                            onClick={() => onAssignRoom(row)}
                            className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                            title="Assign Room"
                        >
                            <Home className="w-4 h-4" />
                        </button>
                    )}
                </div>
            ),
        },
    ];

    return (
        <div className="bg-white/70 backdrop-blur-md border border-white/40 rounded-glass shadow-glass overflow-hidden font-inter">
            <Table
                columns={columns}
                data={data}
                emptyMessage="No registrations found"
                getRowClassName={(row) => row.documentStatus === 'cancelled' ? 'bg-red-50 hover:bg-red-100/80 transition-colors' : ''}
            />
        </div>
    );
};

export default UserTable;
