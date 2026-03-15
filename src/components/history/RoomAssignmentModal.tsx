import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, MapPin, Calendar, Waves, Phone, ExternalLink } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { formatDate } from '@/utils/dateUtils';

import { createPortal } from 'react-dom';

interface RoomInfo {
    id?: string;
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
        managerName?: string;
        managerContact?: string;
        mapLink?: string;
    } | null;
    registration: {
        registrationId: string;
        pnr: string;
        arrivalDate: string;
        numberOfPersons: number;
        assignedRooms: RoomInfo[];
        check_in_status: 'not_checked_in' | 'checked_in' | 'checked_out';
    } | null;
}

const RoomAssignmentModal: React.FC<RoomAssignmentModalProps> = ({
    isOpen,
    onClose,
    hotel,
    registration
}) => {
    const [mounted, setMounted] = React.useState(false);

    React.useEffect(() => {
        setMounted(true);
        return () => setMounted(false);
    }, []);

    // Prevent body scroll when modal is open
    React.useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
            document.body.style.height = '100%';
        } else {
            document.body.style.overflow = '';
            document.body.style.height = '';
        }
        return () => {
            document.body.style.overflow = '';
            document.body.style.height = '';
        };
    }, [isOpen]);

    if (!hotel || !registration || !mounted) return null;

    const modalContent = (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 !mt-0">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-black/60 backdrop-blur-md"
                    />

                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="relative w-full max-w-[350px] bg-white rounded-[2rem] overflow-hidden shadow-[0_25px_70px_rgba(0,0,0,0.4)] flex flex-col my-auto"
                    >
                        {/* Ultra Compact Header */}
                        <div className="bg-heritage-primary pt-5 pb-4 px-6 text-center relative">
                            <button
                                onClick={onClose}
                                className="absolute top-3 right-4 p-1.5 hover:bg-white/20 rounded-full transition-colors z-10"
                            >
                                <X className="w-4 h-4 text-white/80" />
                            </button>
                            <div className="flex flex-col items-center">
                                <Waves className="w-5 h-5 text-white/90 animate-pulse mb-1" />
                                <h2 className="text-[9px] font-black text-white uppercase tracking-[0.4em]">
                                    Sacred Pass
                                </h2>
                            </div>
                        </div>

                        {/* Content - No Scroll Viewport */}
                        <div className="flex-1 bg-white px-5 py-5 overflow-y-auto scrollbar-none" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                            {/* Safely extract properties that might be snake_case or camelCase */}
                            {(() => {
                                const h = hotel as any;
                                const mName = h.managerName || h.manager_name;
                                const mContact = h.managerContact || h.manager_contact;
                                const mLink = h.mapLink || h.map_link;

                                return (
                                    <>
                                        {/* Hotel Section */}
                                        <div className="text-center mb-4">
                                            <h3 className="text-lg font-bold text-heritage-textDark leading-tight mb-1">{hotel.name}</h3>
                                            <div className="flex flex-col items-center gap-1">
                                                <div className="flex items-start justify-center gap-1.5 text-heritage-text/70 px-4">
                                                    <MapPin className="w-3 h-3 text-heritage-primary mt-0.5 flex-shrink-0" />
                                                    <p className="text-[10px] font-medium leading-normal">{hotel.address}</p>
                                                </div>
                                                {mLink && (
                                                    <a
                                                        href={mLink}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="flex items-center gap-1 text-[9px] font-bold text-heritage-primary hover:text-heritage-secondary transition-colors mt-0.5"
                                                    >
                                                        <ExternalLink className="w-2.5 h-2.5" />
                                                        Get Directions on Map
                                                    </a>
                                                )}
                                            </div>
                                        </div>

                                        {/* Manager/Support Info */}
                                        {(mName || mContact) && (
                                            <div className="bg-heritage-maroon/5 border border-heritage-maroon/10 rounded-xl px-3 py-2 mb-3 flex items-center justify-between">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-6 h-6 rounded-full bg-heritage-maroon/10 flex items-center justify-center">
                                                        <Phone className="w-3 h-3 text-heritage-maroon" />
                                                    </div>
                                                    <div>
                                                        <p className="text-[10px] font-black text-heritage-textDark leading-none">{mName || 'Hotel Support'}</p>
                                                        <p className="text-[7px] font-bold text-heritage-text/40 uppercase tracking-tighter">Manager Support</p>
                                                    </div>
                                                </div>
                                                {mContact && (
                                                    <a href={`tel:${mContact}`} className="text-[9px] font-black text-heritage-maroon hover:underline">
                                                        {mContact}
                                                    </a>
                                                )}
                                            </div>
                                        )}
                                    </>
                                );
                            })()}

                            {/* Room View - Single Row if multiple? No, stacked but very tight */}
                            <div className="space-y-1.5 mb-5">
                                {registration.assignedRooms.map((room) => (
                                    <div
                                        key={room.id ?? room.room_number}
                                        className="bg-heritage-highlight/10 border border-heritage-highlight rounded-xl px-3 py-2 flex items-center justify-between"
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className="w-7 h-7 rounded-lg bg-heritage-primary/20 flex items-center justify-center text-heritage-primary text-[10px] font-black">
                                                {room.room_number.slice(0, 1)}
                                            </div>
                                            <div>
                                                <p className="text-[14px] font-black text-heritage-textDark leading-none">{room.room_number}</p>
                                                <p className="text-[8px] font-bold text-heritage-text/40 uppercase tracking-tighter">Room Number</p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-[10px] font-bold text-heritage-primary leading-none">Floor {room.floor}</p>
                                            <p className="text-[8px] font-bold text-heritage-text/40 uppercase tracking-tighter">Level</p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Horizontal QR & Info Section */}
                            <div className="flex items-center gap-4 pt-4 border-t border-dashed border-heritage-gold/30">
                                {/* QR Left */}
                                <div className="relative flex-shrink-0">
                                    <div className="bg-white p-2.5 rounded-2xl border border-heritage-highlight shadow-sm">
                                        <QRCodeSVG
                                            value={JSON.stringify({
                                                origin: 'DGNST',
                                                pnr: registration.pnr,
                                                action: registration.check_in_status === 'checked_in' ? 'check_out' : 'check_in',
                                            })}
                                            size={75}
                                            level="M"
                                        />
                                    </div>
                                    <p className="text-[7px] font-black text-heritage-primary uppercase tracking-widest text-center mt-1.5">
                                        {registration.check_in_status === 'checked_in' ? 'Check-Out QR' : 'Check-In QR'}
                                    </p>
                                </div>

                                {/* Info Right */}
                                <div className="flex-1 space-y-3">
                                    <div>
                                        <p className="text-[8px] font-bold text-heritage-text/40 uppercase tracking-widest leading-none mb-1">Pass PNR</p>
                                        <p className="text-sm font-black text-heritage-maroon uppercase">{registration.pnr}</p>
                                    </div>
                                    <div className="grid grid-cols-2 gap-2">
                                        <div>
                                            <p className="text-[8px] font-bold text-heritage-text/40 uppercase tracking-widest leading-none mb-1">Arrival</p>
                                            <p className="text-[10px] font-bold text-heritage-textDark">{formatDate(registration.arrivalDate)}</p>
                                        </div>
                                        <div>
                                            <p className="text-[8px] font-bold text-heritage-text/40 uppercase tracking-widest leading-none mb-1">Guests</p>
                                            <p className="text-[10px] font-bold text-heritage-textDark">{registration.numberOfPersons}</p>
                                        </div>
                                    </div>
                                    <div className="pt-1.5 border-t border-heritage-highlight">
                                        <p className="text-[8px] font-medium text-heritage-text/60 italic leading-tight">
                                            Present this digital pass at the reception counter.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Bottom Tag */}
                        <div className="bg-heritage-highlight/20 py-2.5 text-center">
                            <p className="text-[8px] font-black text-heritage-primary/40 uppercase tracking-[0.6em]">
                                Divine Journey • Yatra 2026
                            </p>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );

    return createPortal(modalContent, document.body);
};

export default RoomAssignmentModal;
