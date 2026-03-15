'use client';

import React, { useEffect, useState, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
    X,
    Keyboard,
    Loader2,
    RefreshCw,
    Zap,
    ZapOff,
    Upload,
    SwitchCamera
} from 'lucide-react';
import { Html5Qrcode, Html5QrcodeScannerState } from 'html5-qrcode';
import { toast } from 'react-toastify';
import { useHotelCheckInOutMutation } from '@/services/hotelApi';

export default function QRScanner() {
    const router = useRouter();
    const [isScanning, setIsScanning] = useState(false);
    const [cameraError, setCameraError] = useState<string | null>(null);
    const [showManualEntry, setShowManualEntry] = useState(false);
    const [manualPnr, setManualPnr] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);
    const [isTorchOn, setIsTorchOn] = useState(false);
    const [hasTorch, setHasTorch] = useState(false);
    const [availableCameras, setAvailableCameras] = useState<{ id: string; label: string }[]>([]);
    const [currentCameraIndex, setCurrentCameraIndex] = useState(0);

    const [checkInOut] = useHotelCheckInOutMutation();

    const scannerRef = useRef<Html5Qrcode | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const isHandlingStateChange = useRef(false);
    const scannerRegionId = "qr-reader";

    // ────────────────────────────────────────────────
    //          CAMERA CLEANUP HELPER
    // ────────────────────────────────────────────────
    const stopScannerCleanly = useCallback(async () => {
        if (!scannerRef.current) return;
        const state = scannerRef.current.getState();

        if (state === Html5QrcodeScannerState.SCANNING ||
            state === Html5QrcodeScannerState.NOT_STARTED) {
            try {
                await scannerRef.current.stop();
            } catch (err) {
                console.warn("Stop camera failed during cleanup:", err);
            }
        }
        setIsScanning(false);
        setIsTorchOn(false);
    }, []);

    // ────────────────────────────────────────────────
    //          MAIN LIFECYCLE EFFECT
    // ────────────────────────────────────────────────
    useEffect(() => {
        let isMounted = true;

        const manageScanner = async () => {
            if (isHandlingStateChange.current) return;
            isHandlingStateChange.current = true;

            const shouldBeScanning = !showManualEntry && !isProcessing && !cameraError;

            try {
                const container = document.getElementById(scannerRegionId);
                if (!container) return;

                // Lazy init scanner instance
                if (!scannerRef.current) {
                    scannerRef.current = new Html5Qrcode(scannerRegionId, {
                        verbose: true
                    });
                }

                const currentState = scannerRef.current.getState();
                const isCurrentlyScanning = currentState === Html5QrcodeScannerState.SCANNING;

                if (shouldBeScanning && !isCurrentlyScanning) {
                    // Get cameras once (only when needed)
                    let cameras: any[] = [];
                    try {
                        cameras = await Html5Qrcode.getCameras();
                    } catch (err: any) {
                        console.error("getCameras failed:", err);
                        throw new Error("Cannot access camera list");
                    }

                    if (cameras.length === 0) {
                        throw new Error("No cameras detected on this device");
                    }

                    if (!isMounted) return;

                    setAvailableCameras(cameras);

                    let cameraConfig: any;

                    // Prefer previously selected camera if valid
                    if (availableCameras.length > 0 && currentCameraIndex < cameras.length) {
                        cameraConfig = { deviceId: { exact: cameras[currentCameraIndex].id } };
                    } else {
                        // Smart back camera detection
                        const back = cameras.find(c =>
                            /back|rear|environment/i.test(c.label) ||
                            c.label.includes("0")
                        );

                        cameraConfig = back
                            ? { deviceId: { exact: back.id } }
                            : { facingMode: "environment" };

                        const backIndex = back ? cameras.findIndex(c => c.id === back.id) : -1;
                        if (backIndex >= 0) setCurrentCameraIndex(backIndex);
                    }

                    try {
                        await scannerRef.current.start(
                            cameraConfig,
                            {
                                fps: 12,           // slightly lower → better battery/heat
                                qrbox: (w, h) => ({ width: Math.min(w, h) * 0.72, height: Math.min(w, h) * 0.72 }),
                                aspectRatio: 1.0,
                            },
                            onScanSuccess,
                            onScanFailure
                        );

                        if (isMounted) {
                            setIsScanning(true);

                            // Torch support check
                            try {
                                const caps = await scannerRef.current.getRunningTrackCapabilities();
                                setHasTorch(!!(caps as any)?.torch);
                            } catch {
                                setHasTorch(false);
                            }
                        }
                    } catch (startErr: any) {
                        console.warn("Primary start failed → fallback", startErr);
                        // Fallback chain already exists in your code — keeping similar logic
                        // You may simplify or keep as-is
                        await scannerRef.current?.start(
                            { facingMode: "environment" },
                            { fps: 12, qrbox: { width: 240, height: 240 } },
                            onScanSuccess,
                            onScanFailure
                        ).catch(() => {
                            throw startErr; // let outer catch handle
                        });
                    }
                }
                // ─── Stop when not needed ───────────────────────────────
                else if (!shouldBeScanning && isCurrentlyScanning) {
                    await stopScannerCleanly();
                }

            } catch (err: any) {
                console.error("[Scanner Lifecycle]", err);
                if (shouldBeScanning && isMounted) {
                    let msg = "Failed to start camera";
                    if (/permission/i.test(err.message)) msg = "Camera permission denied. Please enable in settings.";
                    if (/notfound|unavailable/i.test(err.message)) msg = "No camera found on this device.";
                    setCameraError(msg);
                    await stopScannerCleanly();
                }
            } finally {
                isHandlingStateChange.current = false;
            }
        };

        const timer = setTimeout(manageScanner, 400);

        return () => {
            clearTimeout(timer);
            isMounted = false;
            stopScannerCleanly().catch(console.warn);
        };
    }, [
        showManualEntry,
        isProcessing,
        cameraError,
        currentCameraIndex,
        stopScannerCleanly
    ]);

    // ────────────────────────────────────────────────
    //          CAMERA SWITCHING (only when useful)
    // ────────────────────────────────────────────────
    const switchCamera = useCallback(async () => {
        if (availableCameras.length < 2 || !scannerRef.current || !isScanning) return;

        const nextIndex = (currentCameraIndex + 1) % availableCameras.length;
        const nextCamera = availableCameras[nextIndex];

        try {
            await stopScannerCleanly();
            setCurrentCameraIndex(nextIndex);
            toast.info(`Switching to: ${nextCamera.label || 'Camera ' + (nextIndex + 1)}`);
            // lifecycle effect will restart with new index
        } catch (err) {
            console.error("Camera switch failed", err);
            toast.error("Could not switch camera");
        }
    }, [availableCameras, currentCameraIndex, isScanning, stopScannerCleanly]);

    // ────────────────────────────────────────────────
    //          TORCH TOGGLE
    // ────────────────────────────────────────────────
    const toggleTorch = async () => {
        if (!scannerRef.current || !hasTorch || !isScanning) return;

        try {
            const desired = !isTorchOn;
            await scannerRef.current.applyVideoConstraints({
                advanced: [{ torch: desired } as any]
            });
            setIsTorchOn(desired);
        } catch (err) {
            console.error("Torch toggle failed", err);
            toast.warn("Flashlight may not be available");
            setHasTorch(false); // disable button next time
        }
    };

    // ────────────────────────────────────────────────
    //          Other handlers (unchanged logic, minor cleanup)
    // ────────────────────────────────────────────────
    const onScanSuccess = (decodedText: string) => {
        processScanResult(decodedText);
    };

    const onScanFailure = () => { /* silent */ };

    const processScanResult = async (decodedText: string) => {
        if (isProcessing) return;
        setIsProcessing(true);

        // Stop the camera immediately so the user stops scanning
        await stopScannerCleanly();

        try {
            // ── Try to parse structured QR payload ──────────────────
            let parsed: { origin?: string; pnr: string; action: 'check_in' | 'check_out' } | null = null;
            try {
                const obj = JSON.parse(decodedText.trim());
                if (obj?.pnr && obj?.action) parsed = obj;
            } catch {
                // not JSON
            }

            if (parsed) {
                // ── Validate origin before calling API ───────────────
                if (parsed.origin !== 'DGNST') {
                    toast.error('Incorrect QR Code', { position: 'top-center' });
                    return;
                }

                const { pnr, action } = parsed;
                const result = await checkInOut({ pnr, type: action }).unwrap();

                if (result.success) {
                    toast.success(
                        result.message,
                        { position: 'top-center' }
                    );
                    router.push('/hotel/bookings');
                } else {
                    toast.error(result.message || 'Action failed');
                }
            } else {
                // ── Non-JSON / plain text — invalid for direct action ─
                toast.error('Incorrect QR Code', { position: 'top-center' });
            }
        } catch (err: any) {
            toast.error(err?.data?.message || err?.message || 'Scan failed. Please try again.', { position: 'top-center' });
        } finally {
            setIsProcessing(false);
            router.push('/hotel/bookings');
        }
    };

    const forceReset = async () => {
        setIsProcessing(true);
        setCameraError(null);
        await stopScannerCleanly();
        scannerRef.current = null;
        const el = document.getElementById(scannerRegionId);
        if (el) el.innerHTML = '';
        toast.info("Camera reset — restarting...");
        setIsProcessing(false);
    };

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file || !scannerRef.current) return;

        setIsProcessing(true);
        try {
            const text = await scannerRef.current.scanFile(file, true);
            await processScanResult(text);
        } catch {
            toast.error("No valid QR code found in image");
        } finally {
            setIsProcessing(false);
            if (fileInputRef.current) fileInputRef.current.value = '';
        }
    };

    const handleManualSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (manualPnr.trim()) processScanResult(manualPnr.trim());
    };

    // ────────────────────────────────────────────────
    //          RENDER
    // ────────────────────────────────────────────────
    return (
        <div className="fixed inset-0 bg-[#2D3139] flex flex-col font-sans z-50 overflow-hidden text-white">
            {/* Top Navigation – unchanged */}

            <header className="px-6 py-6 flex items-center justify-between z-50">
                <button onClick={() => router.back()} className="p-3 bg-white/10 rounded-full hover:bg-white/20 transition-all active:scale-95">
                    <X className="w-5 h-5 text-slate-300" />
                </button>
                <h2 className="text-sm font-bold tracking-wider text-slate-100 uppercase">Scan Guest QR</h2>
                <button onClick={forceReset} className="p-3 bg-white/10 rounded-full hover:bg-white/20 transition-all active:scale-95">
                    <RefreshCw className={`w-5 h-5 text-slate-300 ${isProcessing ? 'animate-spin' : ''}`} />
                </button>
            </header>

            <style jsx global>{`
                #qr-reader video {
                    width: 100% !important;
                    height: 100% !important;
                    object-fit: cover !important;
                    border-radius: 24px;
                }
                #qr-reader { border: none !important; }
            `}</style>

            {/* Viewfinder Section – unchanged layout */}
            <div className="flex-1 relative flex flex-col items-center justify-center">
                <div className="relative w-fit h-fit">
                    <div id={scannerRegionId} className="absolute inset-0 z-0"></div>

                    {/* Visual Overlay – unchanged */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[345px] h-[345px] z-10">
                        {/* corners, laser, guide icon ... unchanged */}
                        <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-[#00E5FF] rounded-tl-xl "></div>
                        <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-[#00E5FF] rounded-tr-xl "></div>
                        <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-[#00E5FF] rounded-bl-xl "></div>
                        <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-[#00E5FF] rounded-br-xl "></div>

                        <motion.div
                            initial={{ top: '10%' }}
                            animate={{ top: '90%' }}
                            transition={{ duration: 2, repeat: Infinity, repeatType: 'reverse', ease: "easeInOut" }}
                            className="absolute left-2 right-2 h-[2px] bg-[#00E5FF] shadow-[0_0_20px_#00E5FF] z-20"
                        />

                        <div className="absolute inset-0 flex items-center justify-center opacity-20">
                            {/* svg unchanged */}
                            <svg width="60" height="60" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M3 7V5C3 3.89543 3.89543 3 5 3H7" stroke="white" strokeWidth="2" strokeLinecap="round" />
                                <path d="M17 3H19C20.1046 3 21 3.89543 21 5V7" stroke="white" strokeWidth="2" strokeLinecap="round" />
                                <path d="M3 17V19C3 20.1046 3.89543 21 5 21H7" stroke="white" strokeWidth="2" strokeLinecap="round" />
                                <path d="M17 21H19C20.1046 21 21 20.1046 21 19V17" stroke="white" strokeWidth="2" strokeLinecap="round" />
                                <rect x="7" y="7" width="10" height="10" rx="1" stroke="white" strokeWidth="1.5" />
                            </svg>
                        </div>
                    </div>
                </div>

                {/* Processing Overlay */}
                <AnimatePresence>
                    {isProcessing && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-[#2D3139]/90 backdrop-blur-xl"
                        >
                            <div className="relative">
                                {/* Outer ring pulse */}
                                <motion.div
                                    animate={{
                                        scale: [1, 1.2, 1],
                                        opacity: [0.3, 0.6, 0.3]
                                    }}
                                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                                    className="absolute inset-0 rounded-full bg-[#00E5FF]/20 blur-xl"
                                />

                                {/* Loader icon container */}
                                <div className="relative z-10 w-24 h-24 bg-white/10 rounded-3xl border border-white/20 shadow-2xl flex items-center justify-center backdrop-blur-md mb-6">
                                    <Loader2 className="w-10 h-10 text-[#00E5FF] animate-spin" />
                                </div>
                            </div>

                            <motion.h3
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 }}
                                className="text-xl font-bold text-white tracking-wide mb-2"
                            >
                                Fetching Details
                            </motion.h3>

                            <motion.p
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3 }}
                                className="text-sm font-medium text-slate-400 max-w-[250px] text-center leading-relaxed"
                            >
                                Validating sacred pass and preparing accommodation details...
                            </motion.p>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Action Buttons – only show Switch when useful */}
                <div className="flex items-center gap-6 mt-16 px-4">
                    <button onClick={() => fileInputRef.current?.click()} className="flex flex-col items-center gap-2 group w-16">
                        <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center text-slate-300 group-hover:bg-white/20 transition-all active:scale-95 shadow-lg backdrop-blur-sm">
                            <Upload className="w-5 h-5" />
                        </div>
                        <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">Library</span>
                    </button>

                    {availableCameras.length >= 2 && (
                        <button
                            onClick={switchCamera}
                            disabled={!isScanning || isProcessing}
                            className="flex flex-col items-center gap-2 group w-16 opacity-100 transition-opacity"
                        >
                            <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center text-slate-300 group-hover:bg-white/20 transition-all active:scale-95 shadow-lg backdrop-blur-sm">
                                <SwitchCamera className="w-5 h-5" />
                            </div>
                            <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">Switch</span>
                        </button>
                    )}

                    {hasTorch && (
                        <button
                            onClick={toggleTorch}
                            disabled={!isScanning || isProcessing}
                            className={`flex flex-col items-center gap-2 group w-16 ${!isScanning ? 'opacity-40' : 'opacity-100'}`}
                        >
                            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all active:scale-95 shadow-lg backdrop-blur-sm ${isTorchOn ? 'bg-[#00E5FF] text-[#2D3139]' : 'bg-white/10 text-slate-300 group-hover:bg-white/20'}`}>
                                {isTorchOn ? <Zap className="w-5 h-5" /> : <ZapOff className="w-5 h-5" />}
                            </div>
                            <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">Torch</span>
                        </button>
                    )}

                    <button onClick={() => setShowManualEntry(true)} className="flex flex-col items-center gap-2 group w-16">
                        <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center text-slate-300 group-hover:bg-white/20 transition-all active:scale-95 shadow-lg backdrop-blur-sm">
                            <Keyboard className="w-5 h-5" />
                        </div>
                        <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">Manual</span>
                    </button>
                </div>

                <input type="file" ref={fileInputRef} onChange={handleFileUpload} accept="image/*" className="hidden" />
            </div>

            {/* Footer & Manual Entry & Error Overlay – unchanged */}

            {/* ... rest of your JSX (branding footer, manual sidebar, error screen) remains exactly the same ... */}

            {/* Processing Overlay - Moved to top level for full screen coverage */}
            <AnimatePresence>
                {isProcessing && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#2D3139]/90 backdrop-blur-xl"
                    >
                        <div className="relative">
                            {/* Outer ring pulse */}
                            <motion.div
                                animate={{
                                    scale: [1, 1.2, 1],
                                    opacity: [0.3, 0.6, 0.3]
                                }}
                                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                                className="absolute inset-0 rounded-full bg-[#00E5FF]/20 blur-xl"
                            />

                            {/* Loader icon container */}
                            <div className="relative z-10 w-24 h-24 bg-white/10 rounded-3xl border border-white/20 shadow-2xl flex items-center justify-center backdrop-blur-md mb-6">
                                <Loader2 className="w-10 h-10 text-[#00E5FF] animate-spin" />
                            </div>
                        </div>

                        <motion.h3
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="text-xl font-bold text-white tracking-wide mb-2"
                        >
                            Fetching Details
                        </motion.h3>

                        <motion.p
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            className="text-sm font-medium text-slate-400 max-w-[250px] text-center leading-relaxed"
                        >
                            Validating sacred pass and preparing accommodation details...
                        </motion.p>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}