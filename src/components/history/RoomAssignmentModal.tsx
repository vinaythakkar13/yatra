import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, MapPin, Calendar, Waves } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { formatDate } from '@/utils/dateUtils';

interface RoomInfo {
    id: string;
    room_number: string;
    floor: string;
}

interface RoomAssignmentModalProps {
    isOpen: boolean;
    onClose: () => void;
    hotel: {
        name: string;
        address: string;
        distanceFromBhavan?: string;
    } | null;
    registration: {
        pnr: string;
        arrivalDate: string;
        numberOfPersons: number;
        assignedRooms: RoomInfo[];
    } | null;
}

const RoomAssignmentModal: React.FC<RoomAssignmentModalProps> = ({
    isOpen,
    onClose,
    hotel,
    registration
}) => {
    if (!hotel || !registration) return null;

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 !mt-0">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                    />

                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 30 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 30 }}
                        className="relative w-full max-w-[380px] bg-white rounded-3xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.4)] flex flex-col"
                    >
                        {/* Ticket Header - Dark Blue */}
                        <div className="bg-[#1a2536] pt-8 pb-6 px-6 text-center relative border-b border-[#2d3a4d]">
                            {/* Close Button - Outside the dark header usually but here it works inside */}
                            <button
                                onClick={onClose}
                                className="absolute top-4 right-4 p-1.5 bg-white/10 hover:bg-white/20 rounded-full transition-colors"
                                aria-label="Close"
                            >
                                <X className="w-4 h-4 text-white/70" />
                            </button>

                            <div className="flex justify-center gap-2">
                                <div className="w-8 h-8 flex items-center justify-center text-amber-500">
                                    <Waves className="w-7 h-7" />
                                </div>
                                <p className="text-lg font-bold text-gray-400 uppercase tracking-[0.4em]">
                                    Sacred M-Ticket
                                </p>
                            </div>

                        </div>

                        <div className="flex-1 bg-white px-6 py-6 overflow-hidden  overflow-y-auto max-h-[70vh]">
                            {/* Hotel Main Section */}
                            <div className="flex gap-4 mb-6">
                                <div className="flex-1 flex flex-col justify-center gap-1">
                                    <h3 className="text-lg font-bold text-slate-800 leading-none">{hotel.name}</h3>
                                    <div className="space-y-1.5">
                                        <div className="flex items-start gap-2">
                                            <MapPin className="w-3 h-3 text-slate-400 mt-0.5" />
                                            <span className="text-[10px] text-slate-500 font-medium leading-tight line-clamp-2">
                                                {hotel.address}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Calendar className="w-3 h-3 text-slate-400" />
                                            <span className="text-[10px] text-slate-500 font-medium tracking-wide">
                                                {formatDate(registration.arrivalDate)}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Quote Section */}
                            {/* <div className="bg-slate-50/80 rounded-2xl py-3 px-4 mb-8 text-center border border-slate-100 italic font-serif">
                                <p className="text-[11px] text-slate-500 tracking-wide">
                                    "Divine Presence, Humble Service"
                                </p>
                            </div> */}

                            {/* Dotted Separator with Notches */}
                            <div className="relative mb-8">
                                <div className="absolute left-[-32px] top-1/2 -translate-y-1/2 w-4 h-8 bg-[#111] rounded-r-full z-10 shadow-inner" />
                                <div className="absolute right-[-32px] top-1/2 -translate-y-1/2 w-4 h-8 bg-[#111] rounded-l-full z-10 shadow-inner" />
                                <div className="border-t-2 border-dashed border-slate-100 w-full" />
                            </div>

                            {/* Travelers & PNR Section */}
                            <div className="grid grid-cols-2 gap-4 mb-8">
                                <div className="bg-amber-50/50 rounded-2xl p-4 text-center border border-amber-100/50">
                                    <p className="text-[9px] font-black text-amber-600 uppercase tracking-widest mb-1">
                                        Traveler(s)
                                    </p>
                                    <p className="text-3xl font-bold text-amber-700 leading-none">
                                        {registration.numberOfPersons}
                                    </p>
                                </div>
                                <div className="bg-slate-50/50 rounded-2xl p-4 text-center border border-slate-100/50">
                                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">
                                        PNR
                                    </p>
                                    <p className="text-sm font-bold text-slate-700 tracking-wider">
                                        {registration.pnr}
                                    </p>
                                </div>
                            </div>

                            {/* Individual Room Cards */}
                            <div className="space-y-3 mb-8">
                                {registration.assignedRooms.map((room) => (
                                    <div key={room.id} className="bg-white border border-slate-100 rounded-3xl p-5 flex items-center justify-between shadow-[0_2px_8px_rgba(0,0,0,0.02)]">
                                        <div>
                                            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">Room</p>
                                            <p className="text-xl font-bold text-slate-800 leading-none">{room.room_number}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">Level</p>
                                            <p className="text-sm font-bold text-slate-600">Floor {room.floor}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* QR Section */}
                            <div className="flex flex-col items-center gap-4 py-4">
                                <div className="relative p-7 bg-white rounded-[40px] shadow-[0_10px_35px_rgba(0,0,0,0.06)] border border-slate-50">
                                    {/* Phone Frame Styling Subtly */}
                                    <div className="bg-[#1a1c23] p-1.5 rounded-[22px]">
                                        <div className="bg-white p-2.5 rounded-[20px]">
                                            <QRCodeSVG
                                                value={`PNR:${registration.pnr}|HOTEL:${hotel.name}|ROOMS:${registration.assignedRooms.map(r => r.room_number).join(',')}`}
                                                size={110}
                                                level="H"
                                            />
                                        </div>
                                    </div>
                                </div>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">
                                    Scan for Check-In
                                </p>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default RoomAssignmentModal;
