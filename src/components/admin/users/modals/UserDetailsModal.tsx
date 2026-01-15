import React from 'react';
import Modal from '@/components/ui/Modal';

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
            <div className="space-y-6">
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
                                {new Date(user.arrivalDate).toLocaleDateString()}
                            </p>
                        </div>
                        <div>
                            <p className="text-sm text-heritage-text/70">Return Date</p>
                            <p className="font-semibold text-heritage-textDark">
                                {new Date(user.returnDate).toLocaleDateString()}
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
