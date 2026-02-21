'use client';

import React, { useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
    User,
    Users,
    MapPin,
    CheckCircle2,
    ChevronLeft,
    Home,
    Bed,
    Info,
    Loader2,
    Calendar,
    Phone,
    ArrowRight
} from 'lucide-react';
import Button from '@/components/ui/Button';
import { useGetRegistrationByPnrQuery } from '@/services/registrationApi';
import { useHotelCheckInMutation } from '@/services/hotelApi';
import { toast } from 'react-toastify';

export default function VerificationDetail() {
    const router = useRouter();
    const { pnr } = useParams<{ pnr: string }>();
    const [isSuccess, setIsSuccess] = useState(false);

    // Fetch registration details
    const { data, isLoading, error } = useGetRegistrationByPnrQuery(pnr);
    const registration = data?.success ? data.data : null;

    // Check-in mutation
    const [checkIn, { isLoading: isCheckingIn }] = useHotelCheckInMutation();

    const handleConfirmCheckIn = async () => {
        if (!registration) return;

        try {
            const result = await checkIn(registration.id).unwrap();
            if (result.success) {
                setIsSuccess(true);
                toast.success("Check-In Confirmed!", { position: 'top-center' });

                // Wait for animation then redirect
                setTimeout(() => {
                    router.push('/hotel/bookings');
                }, 2500);
            }
        } catch (err: any) {
            console.error("Check-in error:", err);
            toast.error(err?.data?.message || "Failed to confirm check-in. Please try again.");
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50">
                <Loader2 className="w-12 h-12 text-primary-600 animate-spin mb-4" />
                <p className="text-gray-500 font-medium">Loading guest details...</p>
            </div>
        );
    }

    if (error || !registration) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 p-6 text-center">
                <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mb-6">
                    <Info className="w-10 h-10 text-red-500" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Guest Not Found</h3>
                <p className="text-gray-500 mb-8">We couldn't find any reservation for PNR: <span className="font-bold text-gray-900">{pnr}</span></p>
                <Button onClick={() => router.back()} className="w-full max-w-xs">
                    Go Back
                </Button>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 pb-32">
            {/* Header */}
            <div className="bg-white border-b border-slate-200 px-4 py-4 flex items-center gap-4 sticky top-0 z-30">
                <button onClick={() => router.back()} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
                    <ChevronLeft className="w-6 h-6 text-gray-600" />
                </button>
                <h1 className="text-xl font-bold text-gray-900">Verify Allocation</h1>
            </div>

            <div className="p-4 space-y-6">
                {/* Guest Summary Card */}
                <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    className="bg-white rounded-[2rem] p-6 shadow-sm border border-slate-100"
                >
                    <div className="flex items-center gap-4 mb-6">
                        <div className="w-16 h-16 bg-primary-50 rounded-2xl flex items-center justify-center">
                            <User className="w-8 h-8 text-primary-600" />
                        </div>
                        <div>
                            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-0.5">Primary Guest</p>
                            <h2 className="text-2xl font-bold text-gray-900">{registration.name}</h2>
                            <p className="text-sm font-bold text-primary-600 tracking-wider">PNR: {registration.pnr}</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="bg-slate-50 rounded-2xl p-4">
                            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-1 leading-none">Total Persons</p>
                            <div className="flex items-center gap-2">
                                <Users className="w-4 h-4 text-secondary-500" />
                                <span className="text-lg font-bold text-gray-900">{registration.number_of_persons}</span>
                            </div>
                        </div>
                        <div className="bg-slate-50 rounded-2xl p-4">
                            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-1 leading-none">Contact</p>
                            <div className="flex items-center gap-2">
                                <Phone className="w-4 h-4 text-blue-500" />
                                <span className="text-sm font-bold text-gray-900 truncate">{registration.whatsapp_number}</span>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Room Allocation Info */}
                <div className="space-y-4">
                    <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                        Allocated Accommodations
                        <div className="h-1 flex-1 bg-slate-100 rounded-full mt-1"></div>
                    </h3>

                    <div className="space-y-3">
                        {registration.assignedRooms && registration.assignedRooms.length > 0 ? (
                            registration.assignedRooms.map((room: any, index: number) => (
                                <motion.div
                                    key={index}
                                    initial={{ x: 20, opacity: 0 }}
                                    animate={{ x: 0, opacity: 1 }}
                                    transition={{ delay: index * 0.1 }}
                                    className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm flex items-center gap-4"
                                >
                                    <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center">
                                        <Home className="w-6 h-6 text-green-600" />
                                    </div>
                                    <div className="flex-1">
                                        <h4 className="font-bold text-gray-900">Room {room.roomNumber}</h4>
                                        <p className="text-xs text-gray-500 font-medium">Floor {room.floor} • {registration.hotel?.name}</p>
                                    </div>
                                    <div className="text-right">
                                        <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded-md">Assigned</span>
                                    </div>
                                </motion.div>
                            ))
                        ) : (
                            <div className="p-8 bg-amber-50 border border-amber-200 rounded-3xl text-center">
                                <Info className="w-10 h-10 text-amber-500 mx-auto mb-3" />
                                <h4 className="font-bold text-amber-900 mb-1">Room Not Assigned</h4>
                                <p className="text-xs text-amber-700">This guest has no rooms assigned yet. Please contact the front desk.</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Verification Checklist */}
                <div className="bg-slate-900 rounded-[2rem] p-6 text-white overflow-hidden relative">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-primary-500/10 blur-3xl rounded-full"></div>
                    <h3 className="text-lg font-bold mb-4 relative z-10">Verification Checklist</h3>
                    <div className="space-y-4 relative z-10">
                        <div className="flex items-center gap-3">
                            <div className="w-5 h-5 rounded-full border-2 border-primary-500 flex items-center justify-center">
                                <div className="w-2.5 h-2.5 bg-primary-500 rounded-full"></div>
                            </div>
                            <p className="text-sm font-medium text-slate-300">Verify original ID proof of all members</p>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="w-5 h-5 rounded-full border-2 border-primary-500 flex items-center justify-center">
                                <div className="w-2.5 h-2.5 bg-primary-500 rounded-full"></div>
                            </div>
                            <p className="text-sm font-medium text-slate-300">Confirm mobile number for notifications</p>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="w-5 h-5 rounded-full border-2 border-primary-500 flex items-center justify-center">
                                <div className="w-2.5 h-2.5 bg-primary-500 rounded-full"></div>
                            </div>
                            <p className="text-sm font-medium text-slate-300">Hand over the room keys to the guest</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Floating Action Button / CTA */}
            <div className="fixed bottom-0 inset-x-0 p-6 bg-slate-50/80 backdrop-blur-md z-40">
                <Button
                    onClick={handleConfirmCheckIn}
                    isLoading={isCheckingIn}
                    disabled={isCheckingIn || !registration.assignedRooms?.length}
                    className="w-full h-16 bg-primary-600 rounded-2xl shadow-2xl shadow-primary-500/30 text-xl font-black group"
                >
                    <span className="flex items-center justify-center gap-3">
                        Confirm Check-In
                        {!isCheckingIn && <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />}
                    </span>
                </Button>
            </div>

            {/* Success Overlay */}
            <AnimatePresence>
                {isSuccess && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="fixed inset-0 z-[100] bg-white flex flex-col items-center justify-center text-center p-8"
                    >
                        <motion.div
                            initial={{ scale: 0, rotate: -45 }}
                            animate={{ scale: 1, rotate: 0 }}
                            transition={{ type: "spring", damping: 12, stiffness: 200 }}
                            className="w-32 h-32 bg-green-500 rounded-full flex items-center justify-center mb-10 shadow-3xl"
                        >
                            <CheckCircle2 className="w-16 h-16 text-white" />
                        </motion.div>
                        <motion.h2
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.3 }}
                            className="text-4xl font-black text-gray-900 mb-4"
                        >
                            Check-In Done!
                        </motion.h2>
                        <motion.p
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.4 }}
                            className="text-gray-500 font-medium max-w-xs"
                        >
                            Guests have been successfully checked in to their assigned rooms.
                        </motion.p>

                        <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: "80%" }}
                            transition={{ delay: 0.8, duration: 1.5 }}
                            className="h-1 bg-slate-100 rounded-full mt-12 overflow-hidden"
                        >
                            <motion.div
                                initial={{ x: "-100%" }}
                                animate={{ x: "0%" }}
                                transition={{ delay: 0.8, duration: 1.5 }}
                                className="h-full bg-green-500"
                            />
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
