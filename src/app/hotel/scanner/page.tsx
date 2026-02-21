'use client';

import React, { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
    X,
    Trash2,
    Image as ImageIcon,
    Keyboard,
    Loader2,
    AlertCircle,
    RefreshCw
} from 'lucide-react';
import { Html5Qrcode, Html5QrcodeScannerState } from 'html5-qrcode';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { toast } from 'react-toastify';
import { useLazyGetRegistrationByPnrQuery } from '@/services/registrationApi';

export default function QRScanner() {
    const router = useRouter();
    const [isScanning, setIsScanning] = useState(true);
    const [cameraError, setCameraError] = useState<string | null>(null);
    const [showManualEntry, setShowManualEntry] = useState(false);
    const [manualPnr, setManualPnr] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);

    // RTK Query to verify PNR
    const [verifyPnr] = useLazyGetRegistrationByPnrQuery();

    const scannerRef = useRef<Html5Qrcode | null>(null);
    const scannerRegionId = "qr-reader";

    useEffect(() => {
        const startScanner = async () => {
            try {
                const html5QrCode = new Html5Qrcode(scannerRegionId);
                scannerRef.current = html5QrCode;

                const config = {
                    fps: 10,
                    qrbox: { width: 280, height: 280 },
                    aspectRatio: 1.0
                };

                await html5QrCode.start(
                    { facingMode: "environment" },
                    config,
                    onScanSuccess,
                    onScanFailure
                );

                setIsScanning(true);
            } catch (err: any) {
                console.error("Error starting QR scanner:", err);
                setCameraError(err.message || "Unable to access camera. Please ensure camera permissions are granted.");
                setIsScanning(false);
            }
        };

        startScanner();

        return () => {
            if (scannerRef.current && scannerRef.current.getState() === Html5QrcodeScannerState.SCANNING) {
                scannerRef.current.stop().catch(err => console.error("Error stopping scanner:", err));
            }
        };
    }, []);

    const onScanSuccess = async (decodedText: string) => {
        if (scannerRef.current) {
            await scannerRef.current.stop();
        }
        processScanResult(decodedText);
    };

    const onScanFailure = (error: any) => { };

    const processScanResult = async (pnr: string) => {
        setIsProcessing(true);
        try {
            const result = await verifyPnr(pnr).unwrap();
            if (result.success) {
                router.push(`/hotel/verification/${pnr}`);
            } else {
                toast.error("Invalid QR Code or PNR not found.");
                restartScanner();
            }
        } catch (err: any) {
            console.error("Verification error:", err);
            toast.error(err?.data?.message || "Failed to verify. Please try again.");
            restartScanner();
        } finally {
            setIsProcessing(false);
        }
    };

    const restartScanner = async () => {
        if (scannerRef.current) {
            try {
                await scannerRef.current.start(
                    { facingMode: "environment" },
                    { fps: 10, qrbox: { width: 280, height: 280 } },
                    onScanSuccess,
                    onScanFailure
                );
                setIsScanning(true);
            } catch (err) {
                setCameraError("Failed to restart camera.");
            }
        }
    };

    const handleManualSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (manualPnr.trim()) {
            processScanResult(manualPnr.trim());
        }
    };

    return (
        <div className="fixed inset-0 bg-[#2D3139] flex flex-col font-sans z-50 overflow-hidden text-white">
            {/* Top Navigation */}
            <header className="px-6 py-6 flex items-center justify-between z-50">
                <button
                    onClick={() => router.back()}
                    className="p-3 bg-white/10 rounded-full hover:bg-white/20 transition-all active:scale-95"
                >
                    <X className="w-5 h-5 text-slate-300" />
                </button>
                <h2 className="text-sm font-bold tracking-wider text-slate-100 uppercase">Scan Guest QR</h2>
                <button className="p-3 bg-white/10 rounded-full hover:bg-white/20 transition-all active:scale-95">
                    <Trash2 className="w-5 h-5 text-slate-300" />
                </button>
            </header>

            {/* Viewfinder Section */}
            <div className="flex-1 relative flex flex-col items-center justify-center -mt-10">
                <div id={scannerRegionId} className="absolute inset-0 z-0"></div>

                {/* Visual Overlay */}
                <div className="relative w-[280px] h-[280px] z-10">
                    {/* Glowing Corners */}
                    <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-[#00E5FF] rounded-tl-xl shadow-[0_0_15px_rgba(0,229,255,0.4)]"></div>
                    <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-[#00E5FF] rounded-tr-xl shadow-[0_0_15px_rgba(0,229,255,0.4)]"></div>
                    <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-[#00E5FF] rounded-bl-xl shadow-[0_0_15px_rgba(0,229,255,0.4)]"></div>
                    <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-[#00E5FF] rounded-br-xl shadow-[0_0_15px_rgba(0,229,255,0.4)]"></div>

                    {/* Laser Line Animation */}
                    <motion.div
                        initial={{ top: '10%' }}
                        animate={{ top: '90%' }}
                        transition={{
                            duration: 2,
                            repeat: Infinity,
                            repeatType: 'reverse',
                            ease: "easeInOut"
                        }}
                        className="absolute left-2 right-2 h-[2px] bg-[#00E5FF] shadow-[0_0_20px_#00E5FF] z-20"
                    />

                    {/* Guide Icon (Background) */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-20">
                        <svg width="60" height="60" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M3 7V5C3 3.89543 3.89543 3 5 3H7" stroke="white" strokeWidth="2" strokeLinecap="round" />
                            <path d="M17 3H19C20.1046 3 21 3.89543 21 5V7" stroke="white" strokeWidth="2" strokeLinecap="round" />
                            <path d="M3 17V19C3 20.1046 3.89543 21 5 21H7" stroke="white" strokeWidth="2" strokeLinecap="round" />
                            <path d="M17 21H19C20.1046 21 21 20.1046 21 19V17" stroke="white" strokeWidth="2" strokeLinecap="round" />
                            <rect x="7" y="7" width="10" height="10" rx="1" stroke="white" strokeWidth="1.5" />
                        </svg>
                    </div>
                </div>

                <p className="mt-12 text-slate-400 text-xs font-medium tracking-wide">
                    Align QR code within the frame to check-in guest
                </p>

                {/* Processing Overlay */}
                <AnimatePresence>
                    {isProcessing && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-[#2D3139]/90 backdrop-blur-md z-40 flex flex-col items-center justify-center"
                        >
                            <Loader2 className="w-12 h-12 text-[#00E5FF] animate-spin mb-4" />
                            <h3 className="text-lg font-bold">Verifying Guest</h3>
                            <p className="text-slate-400 text-sm">Please wait a moment...</p>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Action Buttons */}
                <div className="flex items-center gap-6 mt-16">
                    <button className="flex flex-col items-center gap-3 group">
                        <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center text-slate-300 group-hover:bg-white/20 transition-all active:scale-95">
                            <ImageIcon className="w-6 h-6" />
                        </div>
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Upload</span>
                    </button>
                    <button
                        onClick={() => setShowManualEntry(true)}
                        className="flex flex-col items-center gap-3 group"
                    >
                        <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center text-slate-300 group-hover:bg-white/20 transition-all active:scale-95">
                            <Keyboard className="w-6 h-6" />
                        </div>
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Manual</span>
                    </button>
                </div>
            </div>

            {/* Branding Footer */}
            <footer className="py-10 flex items-center justify-center gap-3">
                <div className="w-5 h-5 bg-[#00E5FF] rounded-full flex items-center justify-center text-[#2D3139] font-black text-[10px]">
                    G
                </div>
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Ganga View Grand</span>
            </footer>

            {/* Manual Entry Sidebar/Modal */}
            <AnimatePresence>
                {showManualEntry && (
                    <motion.div
                        initial={{ y: '100%' }}
                        animate={{ y: 0 }}
                        exit={{ y: '100%' }}
                        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                        className="absolute inset-0 bg-[#2D3139] z-[60] p-8 flex flex-col"
                    >
                        <button
                            onClick={() => setShowManualEntry(false)}
                            className="self-end p-3 bg-white/10 rounded-full mb-12"
                        >
                            <X className="w-6 h-6" />
                        </button>

                        <div className="flex-1 space-y-8">
                            <div>
                                <h3 className="text-3xl font-black tracking-tight mb-2">Manual Entry</h3>
                                <p className="text-slate-400">Enter the guest's PNR number found on their ticket or mobile app.</p>
                            </div>

                            <form onSubmit={handleManualSubmit} className="space-y-6">
                                <Input
                                    label="PNR Number"
                                    placeholder="e.g. PNR789234"
                                    value={manualPnr}
                                    onChange={(e) => setManualPnr(e.target.value.toUpperCase())}
                                    className="bg-white/5 border-white/10 text-xl font-bold tracking-widest uppercase h-16"
                                    autoFocus
                                />
                                <Button
                                    type="submit"
                                    size="lg"
                                    className="w-full h-16 bg-[#00E5FF] text-[#2D3139] font-black text-xl hover:bg-[#00E5FF]/90 rounded-2xl"
                                    disabled={!manualPnr.trim() || isProcessing}
                                    isLoading={isProcessing}
                                >
                                    VERIFY GUEST
                                </Button>
                            </form>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Error Overlay */}
            {cameraError && (
                <div className="absolute inset-0 bg-[#2D3139] z-[70] flex flex-col items-center justify-center p-8 text-center">
                    <div className="w-20 h-20 bg-red-500/20 rounded-full flex items-center justify-center mb-6">
                        <AlertCircle className="w-10 h-10 text-red-500" />
                    </div>
                    <h3 className="text-2xl font-black mb-3">Camera Access Denied</h3>
                    <p className="text-slate-400 mb-10">{cameraError}</p>
                    <div className="flex flex-col w-full gap-4">
                        <Button
                            className="w-full h-14 bg-white/10 text-white rounded-2xl font-bold"
                            onClick={() => window.location.reload()}
                        >
                            <RefreshCw className="w-5 h-5 mr-3" />
                            RETRY CAMERA
                        </Button>
                        <Button
                            className="w-full h-14 bg-[#00E5FF] text-[#2D3139] rounded-2xl font-black"
                            onClick={() => setShowManualEntry(true)}
                        >
                            USE MANUAL ENTRY
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
}
