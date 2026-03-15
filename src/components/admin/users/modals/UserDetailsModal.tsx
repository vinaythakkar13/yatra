import React from 'react';
import Modal from '@/components/ui/Modal';
import { XCircle, User, Phone, MapPin, Calendar, Users, Hotel as HotelIcon, BedDouble } from 'lucide-react';

interface UserDetailsModalProps {
    isOpen: boolean;
    onClose: () => void;
    user: any;
}

const UserDetailsModal: React.FC<UserDetailsModalProps> = ({ isOpen, onClose, user }) => {
    if (!user) return null;

    const hotel = user?.user?.hotel || user?.hotel;
    const assignedRooms = user?.user?.assignedRooms || user?.assignedRooms || [];
    const hasHotelAssigned = hotel && assignedRooms.length > 0;

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title="Registration Details"
            size="lg"
            variant="admin"
        >
            <div className={`space-y-5 font-inter ${(user.documentStatus || user.document_status) === 'cancelled' ? 'bg-red-50/30' : ''}`}>

                {/* Cancellation Alert */}
                {(user.documentStatus || user.document_status) === 'cancelled' && (
                    <div className="bg-red-50 text-red-800 p-4 rounded-xl border border-red-200">
                        <div className="flex items-start gap-3">
                            <XCircle className="w-5 h-5 text-red-600 mt-0.5" />
                            <div>
                                <h4 className="text-sm font-bold uppercase tracking-wider text-red-700">Registration Cancelled</h4>
                                {(user.cancellationReason || user.cancellation_reason) ? (
                                    <p className="text-sm mt-1 italic opacity-90">
                                        "{user.cancellationReason || user.cancellation_reason}"
                                    </p>
                                ) : (
                                    <p className="text-sm mt-1 opacity-90">No reason provided</p>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {/* Primary Info Header Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* User Summary Widget */}
                    <div className="bg-gradient-to-br from-heritage-highlight/20 to-heritage-highlight/5 border border-heritage-highlight/20 rounded-xl p-4 flex items-start gap-4">
                        <div className="bg-white p-3 rounded-xl shadow-sm border border-heritage-text/10 text-heritage-primary">
                            <User className="w-6 h-6" />
                        </div>
                        <div className="min-w-0 flex-1">
                            <div className="flex items-center justify-between gap-2 mb-1">
                                <h3 className="text-lg font-bold text-heritage-textDark truncate">{user.name}</h3>
                                <span className="text-xs font-mono font-bold bg-white px-2 py-0.5 rounded-full border border-heritage-text/10 shadow-sm text-heritage-primary">{user.pnr}</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-heritage-text/80 mb-1">
                                <Phone className="w-3.5 h-3.5" />
                                <span>{user.whatsapp_number}</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-heritage-text/80">
                                <Users className="w-3.5 h-3.5" />
                                <span>{user.persons?.length || 0} Persons</span>
                            </div>
                        </div>
                    </div>

                    {/* Travel Summary Widget */}
                    <div className="bg-white border border-heritage-text/10 rounded-xl p-4 shadow-sm flex flex-col justify-center">
                        <div className="flex items-center gap-2 mb-3">
                            <div className="bg-heritage-primary/10 p-1.5 rounded-lg text-heritage-primary">
                                <MapPin className="w-4 h-4" />
                            </div>
                            <div className="text-sm font-semibold text-heritage-textDark truncate">
                                {user.boarding_city}, {user.boarding_state}
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-3 border-t border-heritage-text/5 pt-3">
                            <div>
                                <p className="text-[10px] font-bold text-heritage-text/50 uppercase tracking-widest mb-0.5">Arrival</p>
                                <div className="flex items-center gap-1.5 text-sm font-semibold text-heritage-textDark">
                                    <Calendar className="w-3.5 h-3.5 text-heritage-primary/60" />
                                    {user.arrival_date}
                                </div>
                            </div>
                            <div>
                                <p className="text-[10px] font-bold text-heritage-text/50 uppercase tracking-widest mb-0.5">Return</p>
                                <div className="flex items-center gap-1.5 text-sm font-semibold text-heritage-textDark">
                                    <Calendar className="w-3.5 h-3.5 text-heritage-primary/60" />
                                    {user.return_date}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Hotel Allocation (Conditional) */}
                {hasHotelAssigned && (
                    <div>
                        <h3 className="text-sm font-bold text-heritage-textDark mb-2 flex items-center gap-2">
                            <HotelIcon className="w-4 h-4 text-heritage-primary" />
                            Assigned Hotel & Rooms
                        </h3>
                        <div className="bg-blue-50/50 border border-blue-100 rounded-xl p-4">
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                                <div>
                                    <h4 className="text-base font-bold text-blue-900 mb-1">{hotel.name}</h4>
                                    <div className="flex items-center gap-1.5 text-sm text-blue-700/80">
                                        <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
                                        <span className="truncate">{hotel.address}</span>
                                    </div>
                                </div>
                                {hotel.manager_name && (
                                    <div className="text-right md:text-left text-sm">
                                        <div className="font-semibold text-blue-900">{hotel.manager_name}</div>
                                        <div className="text-blue-700/80 flex items-center gap-1 justify-end md:justify-start">
                                            <Phone className="w-3 h-3" /> {hotel.manager_contact}
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Rooms List */}
                            <div className="flex flex-wrap gap-2 pt-3 border-t border-blue-200/50">
                                {assignedRooms.map((room: any, index: number) => (
                                    <div key={index} className="flex items-center gap-2 bg-white border border-blue-200 shadow-sm rounded-lg px-3 py-1.5">
                                        <div className="bg-blue-100 text-blue-600 p-1 rounded">
                                            <BedDouble className="w-3.5 h-3.5" />
                                        </div>
                                        <div>
                                            <div className="text-xs font-bold text-blue-900 leading-none mb-0.5">Room {room.room_number || room.roomNumber}</div>
                                            <div className="text-[10px] text-blue-700/70 font-medium leading-none">Floor {room.floor}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* Travelers */}
                <div>
                    <div className="flex items-center justify-between mb-2">
                        <h3 className="text-sm font-bold text-heritage-textDark flex items-center gap-2">
                            <Users className="w-4 h-4 text-heritage-primary" />
                            Traveler Details
                        </h3>
                        <span className="text-xs font-semibold bg-heritage-highlight/20 text-heritage-textDark px-2 py-0.5 rounded-full">
                            {user.persons?.length || 0} Total
                        </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {user.persons?.map((person: any, index: number) => (
                            <div
                                key={index}
                                className="flex items-start gap-3 bg-white p-3 rounded-xl border border-heritage-text/10 shadow-sm hover:border-heritage-gold/30 transition-colors"
                            >
                                <div className="bg-heritage-highlight/10 text-heritage-primary w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs flex-shrink-0">
                                    {index + 1}
                                </div>
                                <div className="min-w-0 flex-1">
                                    <h4 className="font-bold text-sm text-heritage-textDark truncate mb-0.5">{person.name}</h4>
                                    <div className="flex flex-wrap items-center gap-2 text-xs text-heritage-text/70">
                                        <span className="bg-gray-100 px-1.5 py-0.5 rounded text-gray-700 font-medium">{person.age} yrs</span>
                                        <span className="capitalize text-gray-600">{person.gender}</span>
                                        {person.is_handicapped || person.isHandicapped ? (
                                            <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold bg-red-100 text-red-700">
                                                Handicapped
                                            </span>
                                        ) : null}
                                    </div>
                                </div>
                            </div>
                        ))}
                        {(!user.persons || user.persons.length === 0) && (
                            <div className="col-span-full py-4 text-center text-sm text-heritage-text/50">
                                No traveler details found.
                            </div>
                        )}
                    </div>
                </div>

            </div>
        </Modal>
    );
};

export default UserDetailsModal;
