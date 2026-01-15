import React from 'react';
import { 
    Building2, 
    Users, 
    CheckCircle2, 
    UserCheck, 
    MapPin, 
    Phone, 
    CreditCard,
    AlertCircle,
    Hotel
} from 'lucide-react';
import Modal from '@/components/ui/Modal';
import Button from '@/components/ui/Button';
import SelectDropdown from '@/components/ui/SelectDropdown';

interface AssignRoomModalProps {
    isOpen: boolean;
    onClose: () => void;
    isReassigning: boolean;
    selectedUser: any;
    selectedHotel: string;
    setSelectedHotel: (hotelId: string) => void;
    hotelOptions: { value: string; label: string }[];
    availableRoomsForHotel: any[];
    selectedRooms: string[];
    handleRoomToggle: (roomNumber: string) => void;
    totalPassengers: number;
    onConfirmAssignment: () => void;
}

const AssignRoomModal: React.FC<AssignRoomModalProps> = ({
    isOpen,
    onClose,
    isReassigning,
    selectedUser,
    selectedHotel,
    setSelectedHotel,
    hotelOptions,
    availableRoomsForHotel,
    selectedRooms,
    handleRoomToggle,
    totalPassengers,
    onConfirmAssignment,
}) => {
    if (!selectedUser) return null;

    return (
        <>
            <Modal
                isOpen={isOpen}
                onClose={onClose}
                title={isReassigning ? 'Reassign Room' : 'Assign Room'}
                size="xl"
                variant="admin"
                footer={
                    <>
                        <Button variant="admin-outline" onClick={onClose}>
                            Cancel
                        </Button>
                        <Button 
                            variant="admin"
                            onClick={onConfirmAssignment} 
                            disabled={selectedRooms.length === 0}
                            className="bg-gradient-to-r from-heritage-primary to-heritage-secondary hover:from-heritage-secondary hover:to-heritage-primary text-white shadow-lg shadow-heritage-primary/30 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <UserCheck className="w-4 h-4 mr-2" />
                            {isReassigning ? 'Confirm Reassignment' : 'Confirm Assignment'} 
                            {selectedRooms.length > 0 && ` (${selectedRooms.length} room${selectedRooms.length > 1 ? 's' : ''} / ${totalPassengers} person${totalPassengers > 1 ? 's' : ''})`}
                        </Button>
                    </>
                }
            >
                <div className="space-y-5">
                    {/* Current Room Info (for reassignment) */}
                    {isReassigning && selectedUser.roomNumber && (
                        <div className="bg-gradient-to-r from-heritage-primary/10 to-heritage-secondary/10 border-2 border-heritage-primary/30 rounded-xl p-4">
                            <div className="flex items-start gap-3">
                                <div className="bg-gradient-to-br from-heritage-primary to-heritage-secondary p-2.5 rounded-xl shadow-lg">
                                    <Building2 className="w-5 h-5 text-white" />
                                </div>
                                <div className="flex-1">
                                    <h4 className="text-sm font-bold text-heritage-textDark mb-1 flex items-center gap-2">
                                        <MapPin className="w-4 h-4 text-heritage-primary" />
                                        Current Room Assignment
                                    </h4>
                                    <p className="text-sm text-heritage-text">
                                        Currently assigned to <strong className="text-heritage-textDark">Room {selectedUser.roomNumber}</strong>
                                    </p>
                                    <p className="text-xs text-heritage-text/60 mt-1">
                                        This room will be freed after reassignment
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* User Information Summary */}
                    <div className="bg-white/70 backdrop-blur-xl border border-white/40 rounded-xl p-5 shadow-glass">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="bg-gradient-to-br from-heritage-primary to-heritage-secondary p-3 rounded-xl shadow-lg">
                                    <Users className="w-6 h-6 text-white" />
                                </div>
                            <div>
                                    <h3 className="text-base font-bold text-heritage-textDark flex items-center gap-2">
                                    {selectedUser.name}
                                </h3>
                                    <div className="flex items-center gap-3 mt-1.5 text-xs text-heritage-text/70">
                                        <span className="flex items-center gap-1">
                                            <CreditCard className="w-3 h-3" />
                                            {selectedUser.pnr}
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <Phone className="w-3 h-3" />
                                            {selectedUser.contactNumber}
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <div className="text-right bg-gradient-to-br from-heritage-highlight/30 to-heritage-highlight/20 px-4 py-3 rounded-xl border border-heritage-highlight/40">
                                <p className="text-xs font-medium text-heritage-text/60 uppercase tracking-wide">Passengers</p>
                                <p className="text-3xl font-bold text-heritage-textDark mt-1">
                                    {selectedUser.numberOfPersons}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Room Selection Summary */}
                    <div className="bg-white/70 backdrop-blur-xl border border-white/40 rounded-xl p-4 shadow-glass">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-semibold text-heritage-textDark flex items-center gap-2">
                                    <Building2 className="w-4 h-4 text-heritage-primary" />
                                    Room Selection Summary
                                </p>
                                <p className="text-xs text-heritage-text/60 mt-1.5">
                                    Selected rooms vs total passengers
                                </p>
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="text-right px-4 py-2 rounded-lg bg-gradient-to-br from-heritage-highlight/30 to-heritage-highlight/20 border border-heritage-primary/30">
                                    <p className="text-xs font-medium text-heritage-text/60 uppercase tracking-wide">Rooms</p>
                                    <p className="text-2xl font-bold text-heritage-textDark mt-1">
                                        {selectedRooms.length}
                                    </p>
                                </div>
                                <div className="text-heritage-text/40">/</div>
                                <div className="text-right px-4 py-2 rounded-lg bg-gradient-to-br from-heritage-highlight/30 to-heritage-highlight/20 border border-heritage-primary/30">
                                    <p className="text-xs font-medium text-heritage-text/60 uppercase tracking-wide">Persons</p>
                                    <p className="text-2xl font-bold text-heritage-textDark mt-1">
                                        {totalPassengers}
                                </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Step 1: Hotel Selection */}
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <Hotel className="w-4 h-4 text-heritage-primary" />
                            <label className="block text-sm font-semibold text-heritage-textDark">
                                Step 1: Select Hotel
                            </label>
                        </div>
                        <SelectDropdown
                            dropdownPosition="top"
                            options={hotelOptions}
                            value={selectedHotel}
                            onChange={setSelectedHotel}
                            placeholder="Choose a hotel"
                            searchable
                            required
                            variant="admin"
                        />
                    </div>

                    {/* Step 2: Room Selection */}
                    {selectedHotel && (
                        <div className="space-y-4">
                            <h4 className="text-sm font-bold text-heritage-textDark flex items-center gap-2">
                                <Building2 className="w-4 h-4 text-heritage-primary" />
                                Step 2: Select Room(s)
                            </h4>

                            {availableRoomsForHotel.length === 0 ? (
                                <div className="bg-gradient-to-r from-heritage-highlight/20 to-heritage-highlight/10 border-2 border-heritage-primary/30 rounded-xl p-4 flex items-center gap-3">
                                    <AlertCircle className="w-5 h-5 text-heritage-primary flex-shrink-0" />
                                    <p className="text-sm text-heritage-textDark font-medium">No available rooms in this hotel.</p>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-96 overflow-y-auto pr-2 custom-scrollbar">
                                    {availableRoomsForHotel.map((room) => {
                                        const isRoomSelected = selectedRooms.includes(room.roomNumber);

                                        return (
                                            <div
                                                key={room.roomNumber}
                                                onClick={() => handleRoomToggle(room.roomNumber)}
                                                className={`border-2 rounded-xl p-4 transition-all cursor-pointer ${
                                                    isRoomSelected
                                                        ? 'border-heritage-primary bg-gradient-to-br from-heritage-highlight/20 to-heritage-highlight/10 shadow-lg shadow-heritage-primary/10'
                                                        : 'border-white/40 bg-white/70 backdrop-blur-sm hover:border-heritage-primary/30 hover:shadow-md'
                                                    }`}
                                            >
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center gap-3 flex-1">
                                                        <div className={`w-7 h-7 rounded-lg border-2 flex items-center justify-center transition-all shadow-sm ${
                                                            isRoomSelected
                                                                ? 'bg-gradient-to-br from-heritage-primary to-heritage-secondary border-heritage-primary text-white'
                                                                : 'bg-white border-white/60'
                                                        }`}>
                                                            {isRoomSelected && <CheckCircle2 className="w-4 h-4" />}
                                                        </div>
                                                        <div className="flex-1">
                                                            <p className="font-bold text-heritage-textDark flex items-center gap-2">
                                                                <Building2 className="w-4 h-4 text-heritage-primary" />
                                                                Room {room.roomNumber}
                                                            </p>
                                                            <p className="text-xs text-heritage-text/70 mt-1">
                                                                Floor {room.floor} • {room.numberOfBeds || 0} beds • {room.toiletType} toilet
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <div className="text-right bg-gradient-to-br from-green-50 to-green-100/50 px-3 py-2 rounded-lg border border-green-200 ml-3">
                                                        <p className="text-xs font-medium text-heritage-text/60">Charge</p>
                                                        <p className="font-bold text-green-700">₹{room.chargePerDay || 0}<span className="text-xs font-normal">/day</span></p>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </Modal>

        </>
    );
};

export default AssignRoomModal;
