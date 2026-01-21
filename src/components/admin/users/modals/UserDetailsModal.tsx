import React from 'react';
import Modal from '@/components/ui/Modal';
import { XCircle } from 'lucide-react';

interface UserDetailsModalProps {
    isOpen: boolean;
    onClose: () => void;
    user: any;
}

const UserDetailsModal: React.FC<UserDetailsModalProps> = ({ isOpen, onClose, user }) => {
    if (!user) return null;

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title="Registration Details"
            size="lg"
            variant="admin"
        >
            <div className={`space-y-6 ${user.documentStatus === 'cancelled' ? 'bg-red-50/30' : ''}`}>
                {/* Cancellation Alert */}
                {user.documentStatus === 'cancelled' && (
                    <div className="bg-red-600 text-white p-4 rounded-xl shadow-md border-b-4 border-red-800 animate-pulse-slow">
                        <div className="flex items-start gap-4">
                            <div className="bg-white/20 p-2 rounded-lg">
                                <XCircle className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <h4 className="text-lg font-bold uppercase tracking-wider">Registration Cancelled</h4>
                                {user.cancellationReason ? (
                                    <p className="text-sm opacity-90 mt-1 font-medium italic">
                                        " {user.cancellationReason} "
                                    </p>
                                ) : (
                                    <p className="text-sm opacity-90 mt-1">No reason provided</p>
                                )}
                            </div>
                        </div>
                    </div>
                )}
                {/* Personal Info */}
                <div>
                    <h3 className="text-lg font-bold text-heritage-textDark mb-3">
                        Personal Information
                    </h3>
                    <div className="grid grid-cols-2 gap-4 bg-heritage-highlight/10 p-4 rounded-lg border border-heritage-highlight/20">
                        <div>
                            <p className="text-sm text-heritage-text/70">Name</p>
                            <p className="font-semibold text-heritage-textDark">{user.name}</p>
                        </div>
                        <div>
                            <p className="text-sm text-heritage-text/70">PNR Number</p>
                            <p className="font-semibold text-heritage-textDark">{user.pnr}</p>
                        </div>
                        <div>
                            <p className="text-sm text-heritage-text/70">Contact</p>
                            <p className="font-semibold text-heritage-textDark">{user.contactNumber}</p>
                        </div>
                        <div>
                            <p className="text-sm text-heritage-text/70">Number of Persons</p>
                            <p className="font-semibold text-heritage-textDark">{user.numberOfPersons}</p>
                        </div>
                    </div>
                </div>

                {/* Travel Info */}
                <div>
                    <h3 className="text-lg font-bold text-heritage-textDark mb-3">
                        Travel Information
                    </h3>
                    <div className="grid grid-cols-2 gap-4 bg-heritage-highlight/10 p-4 rounded-lg border border-heritage-highlight/20">
                        <div>
                            <p className="text-sm text-heritage-text/70">Boarding Point</p>
                            <p className="font-semibold text-heritage-textDark">
                                {user.boardingPoint.city}, {user.boardingPoint.state}
                            </p>
                        </div>
                        <div>
                            <p className="text-sm text-heritage-text/70">Room Status</p>
                            <p className="font-semibold text-heritage-textDark">
                                {user.roomStatus}
                                {user.roomNumber && ` - Room ${user.roomNumber}`}
                            </p>
                        </div>
                        <div>
                            <p className="text-sm text-heritage-text/70">Arrival Date</p>
                            <p className="font-semibold text-heritage-textDark">
                                {user.arrivalDate}
                            </p>
                        </div>
                        <div>
                            <p className="text-sm text-heritage-text/70">Return Date</p>
                            <p className="font-semibold text-heritage-textDark">
                                {user.returnDate}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Travelers */}
                <div>
                    <h3 className="text-lg font-bold text-heritage-textDark mb-3">
                        Traveler Details
                    </h3>
                    <div className="space-y-2">
                        {user.persons.map((person: any, index: number) => (
                            <div
                                key={index}
                                className="flex items-center justify-between bg-white p-3 rounded-lg border border-gray-100 shadow-sm"
                            >
                                <div>
                                    <p className="font-semibold text-heritage-textDark">{person.name}</p>
                                    <p className="text-sm text-heritage-text/70">
                                        {person.age} years • {person.gender}

                                        {/* is handicaped badge UI */}
                                        {person.isHandicapped && (
                                            <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                                Handicapped
                                            </span>
                                        )}
                                    </p>


                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </Modal>
    );
};

export default UserDetailsModal;
