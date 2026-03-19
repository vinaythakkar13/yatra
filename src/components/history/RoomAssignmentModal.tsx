import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, MapPin, Waves, Phone, ExternalLink, Gift, BedDouble, Sparkles, ChevronRight } from 'lucide-react';
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
    yatra: string;
}

const RoomAssignmentModal: React.FC<RoomAssignmentModalProps> = ({
    isOpen,
    onClose,
    hotel,
    registration,
    yatra
}) => {
    const [mounted, setMounted] = React.useState(false);
    const [isFlipped, setIsFlipped] = React.useState(false);
    const [isFlipping, setIsFlipping] = React.useState(false);

    React.useEffect(() => {
        setMounted(true);
        return () => setMounted(false);
    }, []);

    // Reset flip when modal closes
    React.useEffect(() => {
        if (!isOpen) {
            setTimeout(() => setIsFlipped(false), 300);
        }
    }, [isOpen]);

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

    const handleFlip = () => {
        if (isFlipping) return;
        setIsFlipping(true);
        setTimeout(() => {
            setIsFlipped(prev => !prev);
            setIsFlipping(false);
        }, 400);
    };

    if (!hotel || !registration || !mounted) return null;

    const h = hotel as any;
    const mName = h.managerName || h.manager_name;
    const mContact = h.managerContact || h.manager_contact;
    const mLink = h.mapLink || h.map_link;

    // Show Prasadam QR only if yatra includes 'haridwar'
    const showPrasadam = yatra?.toLowerCase().includes('haridwar');

    // Prasadam QR value
    const prasadamQRValue = JSON.stringify({
        origin: 'DGNST',
        pnr: registration.pnr,
        action: 'prasadam',
        persons: registration.numberOfPersons,
    });

    // Room QR value
    const roomQRValue = JSON.stringify({
        origin: 'DGNST',
        pnr: registration.pnr,
        action: registration.check_in_status === 'checked_in' ? 'check_out' : 'check_in',
    });

    const modalContent = (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 !mt-0">
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 bg-black/70 backdrop-blur-md"
                    />

                    {/* Floating particles on backdrop */}
                    <div className="absolute inset-0 pointer-events-none overflow-hidden">
                        {[...Array(8)].map((_, i) => (
                            <motion.div
                                key={i}
                                className="absolute w-1 h-1 rounded-full bg-amber-400/40"
                                style={{
                                    left: `${10 + i * 12}%`,
                                    top: `${20 + (i % 3) * 20}%`,
                                }}
                                animate={{
                                    y: [-20, 20, -20],
                                    opacity: [0.2, 0.6, 0.2],
                                    scale: [1, 1.5, 1],
                                }}
                                transition={{
                                    duration: 3 + i * 0.4,
                                    repeat: Infinity,
                                    ease: 'easeInOut',
                                    delay: i * 0.3,
                                }}
                            />
                        ))}
                    </div>

                    {/* Card Container with 3D perspective */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.85, y: 30 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.85, y: 30 }}
                        transition={{ type: 'spring', damping: 20, stiffness: 300 }}
                        className="relative z-10 my-auto"
                        style={{ perspective: '1200px' }}
                    >
                        {/* Glow aura behind card */}
                        <motion.div
                            className="absolute inset-0 rounded-[2rem] blur-2xl"
                            animate={{
                                background: isFlipped
                                    ? 'radial-gradient(ellipse, rgba(251,191,36,0.35) 0%, transparent 70%)'
                                    : 'radial-gradient(ellipse, rgba(139,92,246,0.3) 0%, transparent 70%)',
                                scale: [1, 1.05, 1],
                            }}
                            transition={{ duration: 0.6, scale: { duration: 2, repeat: Infinity } }}
                        />

                        {/* The Flipping Card */}
                        <motion.div
                            animate={{ rotateY: isFlipped ? 180 : 0 }}
                            transition={{
                                duration: 0.75,
                                ease: [0.645, 0.045, 0.355, 1.0], // easeInOutCubic
                            }}
                            style={{ transformStyle: 'preserve-3d', position: 'relative', width: '350px' }}
                        >
                            {/* ─── FRONT: Room Pass ─── */}
                            <div
                                style={{ backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden' }}
                                className="w-full h-full flex flex-col bg-white rounded-[2rem] overflow-hidden shadow-[0_30px_80px_rgba(0,0,0,0.5)]"
                            >
                                {/* Header */}
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

                                {/* Content */}
                                <div 
                                    className="bg-white px-5 py-5 overflow-y-auto premium-scrollbar flex-1 max-h-[calc(100vh-250px)] sm:max-h-[500px] relative z-[1] touch-pan-y"
                                    style={{ transform: 'translateZ(0)', WebkitTransform: 'translateZ(0)' }}
                                >
                                    {/* Hotel */}
                                    <div className="text-center mb-4">
                                        <h3 className="text-lg font-bold text-heritage-textDark leading-tight mb-1">{hotel.name}</h3>
                                        <div className="flex flex-col items-center gap-1">
                                            <div className="flex items-start justify-center gap-1.5 text-heritage-text/70 px-4">
                                                <MapPin className="w-3 h-3 text-heritage-primary mt-0.5 flex-shrink-0" />
                                                <p className="text-[10px] font-medium leading-normal">{hotel.address}</p>
                                            </div>
                                            {mLink && (
                                                <a href={mLink} target="_blank" rel="noopener noreferrer"
                                                    className="flex items-center gap-1 text-[9px] font-bold text-heritage-primary hover:text-heritage-secondary transition-colors mt-0.5">
                                                    <ExternalLink className="w-2.5 h-2.5" />
                                                    Get Directions on Map
                                                </a>
                                            )}
                                        </div>
                                    </div>

                                    {/* Manager */}
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

                                    {/* Rooms */}
                                    <div className="space-y-1.5 mb-4">
                                        {registration.assignedRooms.map((room) => (
                                            <div key={room.id ?? room.room_number}
                                                className="bg-heritage-highlight/10 border border-heritage-highlight rounded-xl px-3 py-2 flex items-center justify-between">
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

                                    {/* QR + Info row */}
                                    <div className="flex items-center gap-4 pt-4 border-t border-dashed border-heritage-gold/30">
                                        <div className="relative flex-shrink-0">
                                            <div className="bg-white p-2.5 rounded-2xl border border-heritage-highlight shadow-sm">
                                                <QRCodeSVG value={roomQRValue} size={75} level="M" />
                                            </div>
                                            <p className="text-[7px] font-black text-heritage-primary uppercase tracking-widest text-center mt-1.5">
                                                {registration.check_in_status === 'checked_in' ? 'Check-Out QR' : 'Check-In QR'}
                                            </p>
                                        </div>
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
                                                    Present this digital pass at reception.
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* FLIP CTA — Get Prasadam QR */}
                                {showPrasadam && (
                                    <button
                                        onClick={handleFlip}
                                        className="w-full group relative z-10 overflow-hidden"
                                        style={{
                                            background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 50%, #b45309 100%)',
                                        }}
                                    >
                                        {/* Shimmer sweep */}
                                        <span className="absolute inset-0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 ease-in-out"
                                            style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.25), transparent)' }} />

                                        <div className="relative flex items-center justify-center gap-2 py-3 px-4">
                                            <Gift className="w-4 h-4 text-white drop-shadow" />
                                            <span className="text-[11px] font-black text-white uppercase tracking-[0.2em] drop-shadow">
                                                Get Prasadam QR
                                            </span>
                                            <ChevronRight className="w-3.5 h-3.5 text-white/80 group-hover:translate-x-0.5 transition-transform" />
                                        </div>
                                    </button>
                                )}
                            </div>

                            {/* ─── BACK: Prasadam QR ─── */}
                            {showPrasadam && (
                                <div
                                    style={{
                                        backfaceVisibility: 'hidden',
                                        WebkitBackfaceVisibility: 'hidden',
                                        transform: 'rotateY(180deg)',
                                        position: 'absolute',
                                        top: 0,
                                        left: 0,
                                        width: '100%',
                                        height: '100%',
                                    }}
                                    className="bg-white flex flex-col rounded-[2rem] overflow-hidden shadow-[0_30px_80px_rgba(0,0,0,0.5)]"
                                >
                                    {/* Ornate golden header */}
                                    <div className="relative pt-5 pb-4 px-6 text-center overflow-hidden"
                                        style={{ background: 'linear-gradient(135deg, #78350f 0%, #b45309 40%, #d97706 70%, #f59e0b 100%)' }}>
                                        {/* Decorative rings */}
                                        <div className="absolute -top-6 -right-6 w-24 h-24 rounded-full border-4 border-amber-300/20" />
                                        <div className="absolute -top-3 -right-3 w-16 h-16 rounded-full border-2 border-amber-300/15" />
                                        <div className="absolute -bottom-4 -left-4 w-20 h-20 rounded-full border-4 border-amber-300/10" />

                                        <button
                                            onClick={onClose}
                                            className="absolute top-3 right-4 p-1.5 hover:bg-white/20 rounded-full transition-colors z-10"
                                        >
                                            <X className="w-4 h-4 text-white/80" />
                                        </button>

                                        <div className="flex flex-col items-center relative z-10">
                                            <motion.div
                                                animate={{ rotate: [0, 10, -10, 0], scale: [1, 1.1, 1] }}
                                                transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                                            >
                                                <Sparkles className="w-6 h-6 text-amber-200 mb-1" />
                                            </motion.div>
                                            <h2 className="text-[9px] font-black text-amber-100 uppercase tracking-[0.4em]">
                                                Prasadam Pass
                                            </h2>
                                        </div>
                                    </div>

                                    {/* Prasadam QR content */}
                                    <div 
                                        className="px-5 py-6 flex flex-col items-center overflow-y-auto premium-scrollbar flex-1 max-h-[calc(100vh-250px)] sm:max-h-[500px] relative z-[1] touch-pan-y"
                                        style={{ transform: 'translateZ(0)', WebkitTransform: 'translateZ(0)' }}
                                    >
                                        {/* Sacred divider */}
                                        <div className="flex items-center gap-2 mb-5 w-full">
                                            <div className="flex-1 h-px bg-amber-200" />
                                            <span className="text-[9px] font-black text-amber-600 uppercase tracking-widest">Divine Blessing</span>
                                            <div className="flex-1 h-px bg-amber-200" />
                                        </div>

                                        {/* Big Prasadam QR */}
                                        <div className="relative mb-4">
                                            {/* Glowing ring around QR */}
                                            <motion.div
                                                className="absolute -inset-3 rounded-3xl"
                                                animate={{ opacity: [0.4, 0.8, 0.4] }}
                                                transition={{ duration: 2, repeat: Infinity }}
                                                style={{ background: 'radial-gradient(ellipse, rgba(245,158,11,0.4) 0%, transparent 70%)' }}
                                            />
                                            <div className="relative bg-white p-4 rounded-3xl border-2 border-amber-200 shadow-[0_0_30px_rgba(245,158,11,0.25)]">
                                                <QRCodeSVG
                                                    value={prasadamQRValue}
                                                    size={160}
                                                    level="M"
                                                    fgColor="#78350f"
                                                />
                                            </div>
                                        </div>

                                        <p className="text-[8px] font-black text-amber-700 uppercase tracking-[0.35em] mb-1 text-center">
                                            Prasadam QR Code
                                        </p>
                                        <p className="text-[9px] font-medium text-amber-600/70 text-center mb-5 leading-relaxed px-4">
                                            Present at the Prasadam counter to receive your divine offering
                                        </p>

                                        {/* PNR pill */}
                                        <div className='flex justify-center gap-5'>
                                            <div className="bg-amber-50 border border-amber-200 rounded-xl px-3 py-2">
                                                <p className="text-xs font-bold text-amber-400 text-center uppercase tracking-wider mb-0.5">PNR</p>
                                                <p className="text-md font-black text-amber-800">{registration.pnr}</p>
                                            </div>

                                            {/* Info pills */}
                                            <div className="flex gap-3">
                                                <div className="bg-amber-50 border border-amber-100 rounded-xl px-3 py-2 text-center">
                                                    <p className="text-xs font-bold text-amber-400 uppercase tracking-wider mb-0.5">Guests</p>
                                                    <p className="text-md font-black text-amber-800">{registration.numberOfPersons}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* FLIP BACK CTA — View Rooms */}
                                    <button
                                        onClick={handleFlip}
                                        className="w-full group relative z-10 overflow-hidden"
                                        style={{ background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 50%, #4338ca 100%)' }}
                                    >
                                        <span className="absolute inset-0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 ease-in-out"
                                            style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.15), transparent)' }} />

                                        <div className="relative flex items-center justify-center gap-2 py-3 px-4">
                                            <BedDouble className="w-4 h-4 text-white/90" />
                                            <span className="text-[11px] font-black text-white uppercase tracking-[0.2em]">
                                                View Rooms
                                            </span>
                                            <ChevronRight className="w-3.5 h-3.5 text-white/70 group-hover:translate-x-0.5 transition-transform" />
                                        </div>
                                    </button>
                                </div>
                            )}
                        </motion.div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );

    return createPortal(modalContent, document.body);
};

export default RoomAssignmentModal;