'use client';

import React, { useEffect, useState, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Keyboard, Loader2, RefreshCw, Zap, ZapOff, Upload, SwitchCamera } from 'lucide-react';
import { toast } from 'react-toastify';
import { useHotelCheckInOutMutation } from '@/services/hotelApi';

// ── Polyfill for browsers without native BarcodeDetector (e.g. Firefox, Safari) ──
async function loadBarcodeDetector() {
    if ('BarcodeDetector' in window) return (window as any).BarcodeDetector;
    const { BarcodeDetector } = await import('barcode-detector/ponyfill');
    return BarcodeDetector;
}

export default function QRScanner() {
    const router = useRouter();
    const [isScanning, setIsScanning] = useState(false);
    const [cameraError, setCameraError] = useState<string | null>(null);
    const [showManualEntry, setShowManualEntry] = useState(false);
    const [manualPnr, setManualPnr] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);
    const [isTorchOn, setIsTorchOn] = useState(false);
    const [hasTorch, setHasTorch] = useState(false);
    const [availableCameras, setAvailableCameras] = useState<MediaDeviceInfo[]>([]);
    const [currentCameraIndex, setCurrentCameraIndex] = useState(0);

    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const streamRef = useRef<MediaStream | null>(null);
    const animFrameRef = useRef<number | null>(null);
    const detectorRef = useRef<any>(null);
    const isProcessingRef = useRef(false);
    const isDetectingRef = useRef(false); // ✅ Separate flag — prevents stacking detect() calls
    const fileInputRef = useRef<HTMLInputElement>(null);
    const isMountedRef = useRef(true);

    const [checkInOut] = useHotelCheckInOutMutation();

    // ────────────────────────────────────────────────
    //   STOP CAMERA
    // ────────────────────────────────────────────────
    const stopCamera = useCallback(() => {
        if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
        if (streamRef.current) {
            streamRef.current.getTracks().forEach(t => t.stop());
            streamRef.current = null;
        }
        if (videoRef.current) videoRef.current.srcObject = null;
        setIsScanning(false);
        setIsTorchOn(false);
    }, []);

    // ────────────────────────────────────────────────
    //   SCAN LOOP
    // ────────────────────────────────────────────────
    // ✅ Removed 100ms throttle — isDetectingRef guards concurrent calls instead.
    //    RAF runs at ~60fps; detect() itself limits the rate naturally.
    const startScanLoop = useCallback((detector: any) => {
        const video = videoRef.current;
        if (!video) return;

        const tick = async () => {
            if (!isProcessingRef.current && video.readyState >= video.HAVE_ENOUGH_DATA && !isDetectingRef.current) {
                isDetectingRef.current = true;
                try {
                    const codes = await detector.detect(video);
                    if (codes.length > 0 && !isProcessingRef.current) {
                        isProcessingRef.current = true;
                        await processScanResult(codes[0].rawValue);
                    }
                } catch { /* frame not ready */ }
                finally {
                    isDetectingRef.current = false;
                }
            }
            animFrameRef.current = requestAnimationFrame(tick);
        };

        animFrameRef.current = requestAnimationFrame(tick);
    }, []); // eslint-disable-line

    // ────────────────────────────────────────────────
    //   START CAMERA
    // ────────────────────────────────────────────────
    const startCamera = useCallback(async (cameraIndex = 0) => {
        if (!isMountedRef.current) return;
        stopCamera();
        setCameraError(null);
        isDetectingRef.current = false;

        try {
            // ── Guard: mediaDevices unavailable in HTTP or in-app browsers ───────
            if (!navigator?.mediaDevices?.getUserMedia) {
                setCameraError('Camera not supported. Open in Chrome or Safari directly (not inside Instagram/WhatsApp).');
                return;
            }

            // ── Load BarcodeDetector ─────────────────────────────────────────────
            if (!detectorRef.current) {
                const Detector = await loadBarcodeDetector();
                detectorRef.current = new Detector({ formats: ['qr_code'] });
            }

            // ── FIX 1: Request permission FIRST with simple constraints ──────────
            // On mobile, enumerateDevices() returns empty labels until permission
            // is granted — so we ask first, then enumerate with real device info.
            let initialStream: MediaStream | null = null;
            try {
                initialStream = await navigator.mediaDevices.getUserMedia({
                    video: { facingMode: { ideal: 'environment' } }
                });
            } catch (permErr: any) {
                if (/permission|denied|notallowed/i.test(permErr.name + permErr.message)) {
                    setCameraError('Camera permission denied. Please allow camera access in your browser settings and reload.');
                } else {
                    setCameraError(`Camera error: ${permErr.message || permErr.name}`);
                }
                return;
            }

            // ── FIX 2: Enumerate AFTER permission so labels are populated ────────
            const devices = (await navigator.mediaDevices.enumerateDevices())
                .filter(d => d.kind === 'videoinput');
            setAvailableCameras(devices);

            // Stop initial stream — we'll restart with proper device + settings
            initialStream.getTracks().forEach(t => t.stop());
            initialStream = null;

            // ── Pick back camera ─────────────────────────────────────────────────
            const backIdx = devices.findIndex(d => /back|rear|environment/i.test(d.label));
            const idx = devices.length > 0
                ? (cameraIndex === 0 && backIdx >= 0 ? backIdx : Math.min(cameraIndex, devices.length - 1))
                : 0;
            if (devices.length > 0) setCurrentCameraIndex(idx);

            // ── FIX 3: Safe constraints — no min values, no root-level advanced props ──
            // focusMode/exposureMode in root constraints cause iOS Safari to reject
            // the entire constraint object. Apply via applyConstraints() after stream starts.
            const constraints: MediaStreamConstraints = {
                video: devices.length > 0 && devices[idx]?.deviceId
                    ? { deviceId: { exact: devices[idx].deviceId }, width: { ideal: 1920 }, height: { ideal: 1080 } }
                    : { facingMode: { ideal: 'environment' }, width: { ideal: 1920 }, height: { ideal: 1080 } }
            };

            const stream = await navigator.mediaDevices.getUserMedia(constraints);

            if (!isMountedRef.current) {
                stream.getTracks().forEach(t => t.stop());
                return;
            }

            streamRef.current = stream;
            const video = videoRef.current!;
            video.srcObject = stream;
            (video as any).disablePictureInPicture = true;

            // ── FIX 4: Wait for loadedmetadata before play() — required on iOS ───
            await new Promise<void>((resolve) => {
                const onReady = () => { video.removeEventListener('loadedmetadata', onReady); resolve(); };
                video.addEventListener('loadedmetadata', onReady);
                video.play().catch((err) => { if (err.name !== 'AbortError') console.warn('[play]', err); resolve(); });
                setTimeout(resolve, 3000); // Fallback for stubborn Android WebViews
            });

            if (!isMountedRef.current) return;

            // ── FIX 5: Apply advanced constraints AFTER stream is live ───────────
            // getCapabilities() only works reliably after stream starts.
            const track = stream.getVideoTracks()[0];
            const caps = track.getCapabilities?.() as any ?? {};
            setHasTorch(!!caps?.torch);

            const advanced: any[] = [];
            if (caps?.focusMode?.includes?.('continuous')) advanced.push({ focusMode: 'continuous' });
            if (caps?.exposureMode?.includes?.('continuous')) advanced.push({ exposureMode: 'continuous' });
            if (caps?.whiteBalanceMode?.includes?.('continuous')) advanced.push({ whiteBalanceMode: 'continuous' });
            if (caps?.zoom) advanced.push({ zoom: caps.zoom.min });
            if (advanced.length) {
                try { await track.applyConstraints({ advanced }); } catch { /* best-effort */ }
            }

            setIsScanning(true);
            startScanLoop(detectorRef.current);

        } catch (err: any) {
            console.error('[Camera]', err);
            let msg = 'Failed to start camera.';
            if (/overconstrained/i.test(err.name)) msg = 'Camera settings not supported. Try refreshing.';
            else if (/permission|denied|notallowed/i.test(err.name + err.message)) msg = 'Camera permission denied. Please allow in browser settings.';
            else if (/notfound|devicenotfound/i.test(err.name)) msg = 'No camera found on this device.';
            else if (/notreadable|trackstarterror/i.test(err.name)) msg = 'Camera is in use by another app. Close it and retry.';
            setCameraError(msg);
        }
    }, [stopCamera, startScanLoop]);

    // ────────────────────────────────────────────────
    //   LIFECYCLE
    // ────────────────────────────────────────────────
    useEffect(() => {
        isMountedRef.current = true;
        return () => {
            isMountedRef.current = false;
            stopCamera();
        };
    }, [stopCamera]);

    useEffect(() => {
        if (!showManualEntry && !isProcessing) {
            const t = setTimeout(() => startCamera(currentCameraIndex), 150);
            return () => clearTimeout(t);
        } else {
            stopCamera();
        }
    }, [showManualEntry]); // eslint-disable-line

    // ────────────────────────────────────────────────
    //   TORCH
    // ────────────────────────────────────────────────
    const toggleTorch = async () => {
        if (!streamRef.current || !hasTorch) return;
        const track = streamRef.current.getVideoTracks()[0];
        const desired = !isTorchOn;
        try {
            await track.applyConstraints({ advanced: [{ torch: desired } as any] });
            setIsTorchOn(desired);
        } catch {
            toast.warn('Flashlight not available');
        }
    };

    // ────────────────────────────────────────────────
    //   SWITCH CAMERA
    // ────────────────────────────────────────────────
    const switchCamera = useCallback(async () => {
        if (availableCameras.length < 2) return;
        const next = (currentCameraIndex + 1) % availableCameras.length;
        toast.info(`Switching to: ${availableCameras[next]?.label || 'Camera ' + (next + 1)}`);
        await startCamera(next);
    }, [availableCameras, currentCameraIndex, startCamera]);

    // ────────────────────────────────────────────────
    //   PROCESS RESULT
    // ────────────────────────────────────────────────
    const processScanResult = async (decodedText: string) => {
        setIsProcessing(true);
        stopCamera();

        try {
            let parsed: { origin?: string; pnr: string; action: 'check_in' | 'check_out' } | null = null;
            try {
                const obj = JSON.parse(decodedText.trim());
                if (obj?.pnr && obj?.action) parsed = obj;
            } catch { /* not JSON */ }

            if (parsed) {
                if (parsed.origin !== 'DGNST') {
                    toast.error('Incorrect QR Code', { position: 'top-center' });
                    return;
                }
                const result = await checkInOut({ pnr: parsed.pnr, type: parsed.action }).unwrap();
                if (result.success) {
                    toast.success(result.message, { position: 'top-center' });
                } else {
                    toast.error(result.message || 'Action failed');
                }
            } else {
                toast.error('Incorrect QR Code', { position: 'top-center' });
            }
        } catch (err: any) {
            toast.error(err?.data?.message || err?.message || 'Scan failed. Please try again.', { position: 'top-center' });
        } finally {
            isProcessingRef.current = false;
            isDetectingRef.current = false;
            setIsProcessing(false);
            router.push('/hotel/bookings');
        }
    };

    // ────────────────────────────────────────────────
    //   FILE UPLOAD
    // ────────────────────────────────────────────────
    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file || !detectorRef.current) return;
        setIsProcessing(true);
        try {
            const bitmap = await createImageBitmap(file);
            const codes = await detectorRef.current.detect(bitmap);
            if (codes.length > 0) {
                await processScanResult(codes[0].rawValue);
            } else {
                toast.error('No valid QR code found in image');
            }
        } catch {
            toast.error('No valid QR code found in image');
        } finally {
            setIsProcessing(false);
            if (fileInputRef.current) fileInputRef.current.value = '';
        }
    };

    const forceReset = async () => {
        isProcessingRef.current = false;
        isDetectingRef.current = false;
        setCameraError(null);
        detectorRef.current = null;
        setIsProcessing(false);
        stopCamera();
        toast.info('Camera reset — restarting...');
        await startCamera(currentCameraIndex);
    };

    const handleManualSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (manualPnr.trim()) processScanResult(manualPnr.trim());
    };

    // ────────────────────────────────────────────────
    //   RENDER
    // ────────────────────────────────────────────────
    return (
        <div className="fixed inset-0 bg-[#2D3139] flex flex-col font-sans z-50 overflow-hidden text-white">

            <header className="px-6 py-6 flex items-center justify-between z-50">
                <button onClick={() => router.back()} className="p-3 bg-white/10 rounded-full hover:bg-white/20 transition-all active:scale-95">
                    <X className="w-5 h-5 text-slate-300" />
                </button>
                <h2 className="text-sm font-bold tracking-wider text-slate-100 uppercase">Scan Guest QR</h2>
                <button onClick={forceReset} className="p-3 bg-white/10 rounded-full hover:bg-white/20 transition-all active:scale-95">
                    <RefreshCw className={`w-5 h-5 text-slate-300 ${isProcessing ? 'animate-spin' : ''}`} />
                </button>
            </header>

            <div className="flex-1 relative flex flex-col items-center justify-center">
                <div className="relative w-[345px] h-[345px]">

                    <video
                        ref={videoRef}
                        className="absolute inset-0 w-full h-full object-cover rounded-3xl z-0"
                        playsInline
                        muted
                        autoPlay
                    />
                    <canvas ref={canvasRef} className="hidden" />

                    {/* Visual Overlay */}
                    <div className="absolute inset-0 z-10 pointer-events-none">
                        <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-[#00E5FF] rounded-tl-xl"></div>
                        <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-[#00E5FF] rounded-tr-xl"></div>
                        <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-[#00E5FF] rounded-bl-xl"></div>
                        <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-[#00E5FF] rounded-br-xl"></div>
                        <motion.div
                            initial={{ top: '10%' }}
                            animate={{ top: '90%' }}
                            transition={{ duration: 1.5, repeat: Infinity, repeatType: 'reverse', ease: 'easeInOut' }}
                            className="absolute left-2 right-2 h-[2px] bg-[#00E5FF] shadow-[0_0_20px_#00E5FF] z-20"
                        />
                        <div className="absolute inset-0 flex items-center justify-center opacity-20">
                            <svg width="60" height="60" viewBox="0 0 24 24" fill="none">
                                <path d="M3 7V5C3 3.89543 3.89543 3 5 3H7" stroke="white" strokeWidth="2" strokeLinecap="round" />
                                <path d="M17 3H19C20.1046 3 21 3.89543 21 5V7" stroke="white" strokeWidth="2" strokeLinecap="round" />
                                <path d="M3 17V19C3 20.1046 3.89543 21 5 21H7" stroke="white" strokeWidth="2" strokeLinecap="round" />
                                <path d="M17 21H19C20.1046 21 21 20.1046 21 19V17" stroke="white" strokeWidth="2" strokeLinecap="round" />
                                <rect x="7" y="7" width="10" height="10" rx="1" stroke="white" strokeWidth="1.5" />
                            </svg>
                        </div>
                    </div>

                    {/* Camera Error */}
                    {cameraError && (
                        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-[#2D3139]/90 rounded-3xl text-center px-6">
                            <p className="text-red-400 text-sm font-semibold mb-4">{cameraError}</p>
                            <button onClick={forceReset} className="px-4 py-2 bg-[#00E5FF]/20 text-[#00E5FF] rounded-xl text-sm font-bold">Retry</button>
                        </div>
                    )}

                    {/* Initialising state */}
                    {!isScanning && !cameraError && !isProcessing && (
                        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-[#2D3139]/80 rounded-3xl">
                            <Loader2 className="w-8 h-8 text-[#00E5FF] animate-spin mb-3" />
                            <p className="text-[10px] font-black text-white/40 uppercase tracking-widest">Initialising...</p>
                        </div>
                    )}
                </div>

                {/* Processing Overlay */}
                <AnimatePresence>
                    {isProcessing && (
                        <motion.div
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#2D3139]/90 backdrop-blur-xl"
                        >
                            <div className="relative">
                                <motion.div
                                    animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
                                    transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                                    className="absolute inset-0 rounded-full bg-[#00E5FF]/20 blur-xl"
                                />
                                <div className="relative z-10 w-24 h-24 bg-white/10 rounded-3xl border border-white/20 shadow-2xl flex items-center justify-center backdrop-blur-md mb-6">
                                    <Loader2 className="w-10 h-10 text-[#00E5FF] animate-spin" />
                                </div>
                            </div>
                            <motion.h3 initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="text-xl font-bold text-white tracking-wide mb-2">
                                Fetching Details
                            </motion.h3>
                            <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="text-sm font-medium text-slate-400 max-w-[250px] text-center leading-relaxed">
                                Validating sacred pass and preparing accommodation details...
                            </motion.p>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Action Buttons */}
                <div className="flex items-center gap-6 mt-16 px-4">
                    <button onClick={() => fileInputRef.current?.click()} className="flex flex-col items-center gap-2 group w-16">
                        <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center text-slate-300 group-hover:bg-white/20 transition-all active:scale-95 shadow-lg backdrop-blur-sm">
                            <Upload className="w-5 h-5" />
                        </div>
                        <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">Library</span>
                    </button>

                    {availableCameras.length >= 2 && (
                        <button onClick={switchCamera} disabled={!isScanning || isProcessing} className="flex flex-col items-center gap-2 group w-16">
                            <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center text-slate-300 group-hover:bg-white/20 transition-all active:scale-95 shadow-lg backdrop-blur-sm">
                                <SwitchCamera className="w-5 h-5" />
                            </div>
                            <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">Switch</span>
                        </button>
                    )}

                    {hasTorch && (
                        <button onClick={toggleTorch} disabled={!isScanning || isProcessing} className={`flex flex-col items-center gap-2 group w-16 ${!isScanning ? 'opacity-40' : 'opacity-100'}`}>
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

            {/* Manual Entry */}
            <AnimatePresence>
                {showManualEntry && (
                    <motion.div
                        initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 40 }}
                        className="fixed inset-0 z-[100] flex flex-col items-center justify-end bg-black/60 backdrop-blur-sm"
                        onClick={() => setShowManualEntry(false)}
                    >
                        <div className="w-full bg-[#2D3139] rounded-t-3xl p-6 pb-10" onClick={e => e.stopPropagation()}>
                            <h3 className="text-white font-bold text-lg mb-4">Enter PNR Manually</h3>
                            <form onSubmit={handleManualSubmit} className="flex gap-3">
                                <input
                                    type="text" value={manualPnr} onChange={e => setManualPnr(e.target.value)}
                                    placeholder="Enter PNR number" autoFocus
                                    className="flex-1 bg-white/10 text-white placeholder-slate-400 rounded-xl px-4 py-3 text-sm outline-none border border-white/10 focus:border-[#00E5FF]/50"
                                />
                                <button type="submit" disabled={!manualPnr.trim()} className="px-5 py-3 bg-[#00E5FF] text-[#2D3139] font-black rounded-xl text-sm disabled:opacity-40 active:scale-95 transition-all">
                                    Go
                                </button>
                            </form>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}