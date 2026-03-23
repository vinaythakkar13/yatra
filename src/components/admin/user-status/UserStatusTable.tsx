import React from 'react';
import { RefreshCw, Phone, Eye } from 'lucide-react';
import Table from '@/components/ui/Table';
import HouseMedicalXmarkIcon from '@/components/ui/svg/HouseMedicalXmarkIcon';
import Modal from '@/components/ui/Modal';
import Button from '@/components/ui/Button';

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
    const [viewRoomsData, setViewRoomsData] = React.useState<{ rooms: any[], name: string } | null>(null);

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
            key: 'hotel',
            header: 'Hotel',
            render: (row: any) => {
                return (
                    <span className="font-semibold text-heritage-textDark italic">
                        {row.hotelName || <span className="text-gray-400 font-normal">Not Assigned</span>}
                    </span>
                );
            },
        },
        {
            key: 'rooms',
            header: 'Rooms',
            render: (row: any) => {
                const rooms = row.assignedRooms || [];
                if (rooms.length === 0) return <span className="text-gray-400 italic text-sm">None</span>;

                if (rooms.length > 2) {
                    return (
                        <button
                            onClick={() => setViewRoomsData({ rooms, name: row.name })}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-heritage-primary/10 text-heritage-primary border border-heritage-primary/20 hover:bg-heritage-primary/20 transition-all shadow-sm"
                        >
                            <Eye className="w-3.5 h-3.5" />
                            View {rooms.length} Rooms
                        </button>
                    );
                }

                return (
                    <div className="flex flex-col gap-1.5 min-w-[120px]">
                        <div className="flex flex-wrap gap-1">
                            {rooms.map((room: any, idx: number) => (
                                <span key={idx} className="text-[10px] bg-white text-heritage-textDark px-1.5 py-0.5 rounded border border-heritage-gold/30 shadow-sm font-medium whitespace-nowrap">
                                    R: {room.roomName} <span className="text-heritage-gold mx-0.5">|</span> F: {room.floorName}
                                </span>
                            ))}
                        </div>
                    </div>
                );
            },
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

            {/* View Rooms Modal */}
            <Modal
                isOpen={!!viewRoomsData}
                onClose={() => setViewRoomsData(null)}
                title={`Assigned Rooms - ${viewRoomsData?.name}`}
                variant="admin"
                size="md"
                footer={
                    <Button variant="outline" onClick={() => setViewRoomsData(null)}>
                        Close
                    </Button>
                }
            >
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 p-1">
                    {viewRoomsData?.rooms.map((room, idx) => (
                        <div 
                            key={idx} 
                            className="bg-white border border-heritage-gold/30 rounded-xl p-3 shadow-sm hover:shadow-md transition-shadow flex flex-col items-center justify-center text-center"
                        >
                            <span className="text-[10px] uppercase tracking-wider text-heritage-gold font-bold mb-1">
                                Floor {room.floorName}
                            </span>
                            <span className="text-lg font-bold text-heritage-textDark">
                                Room {room.roomName}
                            </span>
                        </div>
                    ))}
                </div>
            </Modal>
        </div>
    );
};

export default UserStatusTable;
