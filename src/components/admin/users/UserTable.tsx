import React from 'react';
import { Eye, RefreshCw, UserX, Home, FileText, CheckCircle, XCircle, ArrowRight, ArrowLeft, Plane, Train, Bus, Phone } from 'lucide-react';
import Table from '@/components/ui/Table';
import moment from 'moment';
import { RiUserStarLine } from 'react-icons/ri';
import HouseIcon from '@/components/ui/svg/HouseIcon';
import EyeSquareIcon from '@/components/ui/svg/EyeSquareIcon';

const TICKET_BADGE_CONFIG: Record<
    string,
    {
        label: string;
        icon: React.JSX.Element;
        className: string;
    }
> = {
    FLIGHT: {
        label: 'Flight',
        icon: <Plane className="w-3 h-3" />,
        className: 'bg-blue-100 text-blue-700 flex items-center gap-1.5'
    },
    FIRST_AC: {
        label: '1st AC',
        icon: <Train className="w-3 h-3" />,
        className: 'bg-green-100 text-green-700 flex items-center gap-1.5'
    },
    SECOND_AC: {
        label: '2nd AC',
        icon: <Train className="w-3 h-3" />,
        className: 'bg-green-100 text-green-700 flex items-center gap-1.5'
    },
    THIRD_AC: {
        label: '3rd AC',
        icon: <Train className="w-3 h-3" />,
        className: 'bg-green-100 text-green-700 flex items-center gap-1.5'
    },
    SLEEPER: {
        label: 'Sleeper',
        icon: <Train className="w-3 h-3" />,
        className: 'bg-yellow-100 text-yellow-800 flex items-center gap-1.5'
    },
    GENERAL: {
        label: 'General',
        icon: <Train className="w-3 h-3" />,
        className: 'bg-gray-100 text-gray-700 flex items-center gap-1.5'
    },
    BUS: {
        label: 'Bus',
        icon: <Bus className="w-3 h-3" />,
        className: 'bg-indigo-100 text-indigo-700 flex items-center gap-1.5'
    },
    TBS: {
        label: 'TBS',
        icon: <RiUserStarLine className="w-3 h-3" />,
        className: 'bg-indigo-100 border text-xs rounded-lg px-2 py-1 w-fit border-indigo-700 text-indigo-700 flex items-center gap-1.5'
    },
    WL: {
        label: 'Waiting List',
        icon: <Train className="w-3 h-3" />,
        className: 'bg-yellow-100 text-yellow-800 flex items-center gap-1.5'
    },
    RAC: {
        label: 'RAC',
        icon: <Train className="w-3 h-3" />,
        className: 'bg-yellow-100 text-yellow-800 flex items-center gap-1.5'
    }
};


const TicketBadge = ({ type }: { type: string }) => {
    const badge = TICKET_BADGE_CONFIG[type];
    if (!badge) return null;

    return (
        <span
            className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[10px] font-bold ${badge.className}`}
        >
            {badge.icon}
            {badge.label}
        </span>
    );
};


interface UserTableProps {
    data: any[];
    onViewDetails: (user: any) => void;
    onAssignRoom: (user: any) => void;
    onReassignRoom: (user: any) => void;
    onUnassignRoom: (user: any) => void;
    onViewDocuments: (user: any) => void;
    isLoading?: boolean;
    userRole?: string;
}

const UserTable: React.FC<UserTableProps> = ({
    data,
    onViewDetails,
    onAssignRoom,
    onReassignRoom,
    onUnassignRoom,
    onViewDocuments,
    isLoading = false,
    userRole,
}) => {

    const columns = [
        {
            key: 'pnr',
            header: 'PNR',
            render: (row: any) => (
                <div className="flex flex-col gap-1">
                    <span className="font-mono font-semibold text-heritage-primary">{row.pnr}</span>
                    {
                        row.ticketType && <TicketBadge type={row.ticketType} />
                    }

                </div>
            ),
        },

        // name and number of persons in single line with gap and in next line contact number
        {
            key: 'name',
            header: 'Name',
            render: (row: any) => (
                <div className="flex flex-col gap-2">
                    <div className="flex flex-row gap-2">
                        <span className="font-bold text-heritage-textDark">{row.name}</span>
                        {/* <span className="text-heritage-text p-1 rounded-full bg-heritage-primary/10">{row.numberOfPersons}</span> */}
                    </div>
                    <span className="text-heritage-text flex items-center gap-2">
                        <Phone className="w-3 h-3 inline-block" />
                        <span className="font-medium">{row.contactNumber}</span>
                    </span>
                </div>
            ),
        },
        // {
        //     key: 'contactNumber',
        //     header: 'Contact',
        //     render: (row: any) => (
        //         <span className="text-heritage-text">{row.contactNumber}</span>
        //     ),
        // },
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
                    <span className="text-heritage-text whitespace-nowrap bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs font-semibold max-w-fit">
                        {/* arrival icon */}
                        <ArrowRight className="w-3 h-3 inline-block" />
                        <span className="ml-1">{row.arrivalDate}</span>
                    </span>

                    {/* make it badge red for departure with exit icon */}
                    <span className="text-heritage-text whitespace-nowrap bg-red-100 text-red-700 px-2 py-1 rounded-full text-xs font-semibold max-w-fit">
                        <ArrowLeft className="w-3 h-3 inline-block" />
                        <span className="ml-1">{row.returnDate}</span>
                    </span>
                </div>
            ),
        },
        // created at based on IST
        {
            key: 'createdAt',
            header: 'Created At',
            render: (row: any) => (
                <span className="text-heritage-text">
                    {moment.utc(row.createdAt).format('DD-MM-YYYY')}
                </span>
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
            render: (row: any) => {
                return (
                    <div className="flex flex-col gap-1">
                        {row.ticketImages && row.ticketImages.length > 0 ? (
                            <>
                                <button
                                    onClick={() => onViewDocuments(row)}
                                    className="inline-flex items-center gap-1 px-2 py-1 text-xs font-semibold text-heritage-primary hover:bg-heritage-highlight/20 rounded-lg transition-colors w-fit"
                                    title="View Documents"
                                >
                                    <FileText className="w-3 h-3" />
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
                )
            },
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
                        <EyeSquareIcon size={24} />
                    </button>

                    {userRole !== 'staff' && (
                        <>
                            {row?.roomStatus === 'Assigned' ? (
                                <>
                                    <button
                                        onClick={() => onReassignRoom(row)}
                                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                        title="Reassign Room"
                                    >
                                        <RefreshCw className="w-3 h-3" />
                                    </button>
                                    <button
                                        onClick={() => onUnassignRoom(row)}
                                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                        title="Remove Assignment"
                                    >
                                        <EyeSquareIcon size={24} />
                                    </button>
                                </>
                            ) : (
                                <button
                                    onClick={() => onAssignRoom(row)}
                                    className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                                    title="Assign Room"
                                >
                                    <HouseIcon size={24} />
                                </button>
                            )}
                        </>
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
                        <div className="relative">
                            <RefreshCw className="w-10 h-10 text-heritage-primary animate-spin" />
                            <div className="absolute inset-0 flex items-center justify-center">
                                <FileText className="w-4 h-4 text-heritage-primary/60" />
                            </div>
                        </div>
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
                    getRowClassName={(row) => row.documentStatus === 'cancelled' ? 'bg-red-50 hover:bg-red-100/80 transition-colors' : ''}
                />
            </div>
        </div>
    );
};

export default UserTable;
