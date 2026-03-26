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
  SwitchCamera,
  Gift,
  AlertCircle
} from 'lucide-react';
import { useDeliverPrasadamMutation } from '@/services/registrationApi';
import { yatraStorage } from '@/utils/storage';
import { toast } from 'react-toastify';
import PrasadamInfoModal from '@/components/admin/prasadam/PrasadamInfoModal';

// ── Polyfill for browsers without native BarcodeDetector (e.g. Firefox, Safari) ──
async function loadBarcodeDetector() {
  if ('BarcodeDetector' in window) return (window as any).BarcodeDetector;
  const { BarcodeDetector } = await import('barcode-detector/ponyfill');
  return BarcodeDetector;
}

export default function PrasadamScanner() {
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

  const [deliverPrasadam, { isLoading: isAPILoading }] = useDeliverPrasadamMutation();
  const [selectedYatraId, setSelectedYatraId] = useState<string | null>(null);

  useEffect(() => {
    const yatraId = yatraStorage.getSelectedYatraId();
    setSelectedYatraId(yatraId);
    const handleStorageChange = () => setSelectedYatraId(yatraStorage.getSelectedYatraId());
    window.addEventListener('storage', handleStorageChange);
    const interval = setInterval(handleStorageChange, 1000);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(interval);
    };
  }, []);

  const [showInfoModal, setShowInfoModal] = useState(false);
  const [scannedData, setScannedData] = useState<any>(null);

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const animFrameRef = useRef<number | null>(null);
  const detectorRef = useRef<any>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const isProcessingRef = useRef(false);
  const isMountedRef = useRef(true);
  // ✅ SPEED FIX 1: Removed lastScanTimeRef throttle entirely.
  // We rely on requestAnimationFrame natural cadence (~60fps) which is
  // what Google Pay does. The async detect() call itself acts as the limiter.
  const isDetectingRef = useRef(false); // Separate flag: prevents concurrent detect() calls

  // ─── Clean stop ───────────────────────────────────────────────────────────
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

  // ─── Scan Loop ─────────────────────────────────────────────────────────────
  // ✅ SPEED FIX 2: isDetectingRef prevents stacking detect() promises while
  //    still running every animation frame. GPay pattern: fire-and-forget with guard.
  // ✅ SPEED FIX 3: Pass `video` element directly to detect() instead of canvas.
  //    Native BarcodeDetector handles hardware acceleration internally.
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
        } catch {
          // Frame not ready, skip silently
        } finally {
          isDetectingRef.current = false;
        }
      }
      // ✅ SPEED FIX 4: Always re-queue next frame regardless of detect outcome.
      //    Never block the RAF loop on async work.
      animFrameRef.current = requestAnimationFrame(tick);
    };

    animFrameRef.current = requestAnimationFrame(tick);
  }, []); // eslint-disable-line

  // ─── Start camera ─────────────────────────────────────────────────────────
  const startCamera = useCallback(async (cameraIndex = 0) => {
    if (!isMountedRef.current) return;
    stopCamera();
    setCameraError(null);
    isDetectingRef.current = false;

    try {
      // ✅ SPEED FIX 5: Pre-load detector once and reuse. Avoid re-instantiating on every startCamera.
      if (!detectorRef.current) {
        const Detector = await loadBarcodeDetector();
        detectorRef.current = new Detector({ formats: ['qr_code'] });
      }

      const devices = (await navigator.mediaDevices.enumerateDevices())
        .filter(d => d.kind === 'videoinput');
      setAvailableCameras(devices);

      if (!devices.length) {
        setCameraError('No camera found on this device');
        return;
      }

      const backIdx = devices.findIndex(d => /back|rear|environment/i.test(d.label));
      const idx = cameraIndex === 0 && backIdx >= 0 ? backIdx : cameraIndex;
      setCurrentCameraIndex(idx);

      // ✅ SPEED FIX 6: Higher resolution = more pixels = better far-distance QR detection.
      //    GPay uses 1080p on flagship devices. Use ideal 1920x1080 so the browser picks
      //    the closest available. Also request continuous autofocus explicitly.
      const constraints = {
        video: {
          deviceId: devices[idx] ? { exact: devices[idx].deviceId } : undefined,
          facingMode: devices[idx] ? undefined : 'environment',
          width: { ideal: 1920, min: 1280 },
          height: { ideal: 1080, min: 720 },
          // ✅ SPEED FIX 7: Explicitly request continuous AF + exposure.
          //    Blurry frames are the #1 reason QR scans are slow at distance.
          focusMode: 'continuous',
          exposureMode: 'continuous',
          whiteBalanceMode: 'continuous',
        } as any
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      if (!isMountedRef.current) {
        stream.getTracks().forEach(t => t.stop());
        return;
      }
      streamRef.current = stream;

      const video = videoRef.current!;
      video.srcObject = stream;

      // ✅ SPEED FIX 8: Set low-latency hint on video element.
      (video as any).disablePictureInPicture = true;

      try {
        await video.play();
      } catch (err: any) {
        if (err.name !== 'AbortError') throw err;
      }

      const track = stream.getVideoTracks()[0];
      const caps = track.getCapabilities() as any;
      setHasTorch(!!caps?.torch);

      // ✅ SPEED FIX 9: Apply zoom-out (wide angle) constraint if supported.
      //    This increases the field of view and helps detect QR from farther away.
      if (caps?.zoom) {
        try {
          await track.applyConstraints({
            advanced: [{ zoom: caps.zoom.min } as any]
          });
        } catch { /* zoom not supported, ignore */ }
      }

      setIsScanning(true);
      startScanLoop(detectorRef.current);

    } catch (err: any) {
      console.error('[Camera]', err);
      let msg = 'Failed to start camera';
      if (/permission/i.test(err.message)) msg = 'Camera permission denied. Please enable in settings.';
      setCameraError(msg);
    }
  }, [stopCamera, startScanLoop]);

  // ─── Lifecycle ────────────────────────────────────────────────────────────
  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
      stopCamera();
    };
  }, [stopCamera]);

  useEffect(() => {
    const shouldScan = !showManualEntry && !showInfoModal && !cameraError && !isProcessing;

    if (shouldScan) {
      const t = setTimeout(() => startCamera(currentCameraIndex), 150);
      return () => clearTimeout(t);
    } else {
      stopCamera();
    }
  }, [showManualEntry, showInfoModal, cameraError, isProcessing]); // eslint-disable-line

  // ─── Switch camera ────────────────────────────────────────────────────────
  const switchCamera = useCallback(async () => {
    if (availableCameras.length < 2) return;
    const next = (currentCameraIndex + 1) % availableCameras.length;
    toast.info(`Switching camera...`);
    await startCamera(next);
  }, [availableCameras, currentCameraIndex, startCamera]);

  // ─── Torch ───────────────────────────────────────────────────────────────
  const toggleTorch = async () => {
    if (!streamRef.current || !hasTorch || !isScanning) return;
    try {
      const track = streamRef.current.getVideoTracks()[0];
      const desired = !isTorchOn;
      await track.applyConstraints({ advanced: [{ torch: desired } as any] });
      setIsTorchOn(desired);
    } catch {
      toast.warn('Flashlight not available');
    }
  };

  // ─── Process result ───────────────────────────────────────────────────────
  const processScanResult = async (decodedText: string) => {
    // isProcessingRef already set true by caller before this runs
    setIsProcessing(true);

    try {
      if (!decodedText.includes('DGNST')) {
        toast.error('Incorrect QR Code', { position: 'top-center' });
        return;
      }

      let parsed: any = null;
      try { parsed = JSON.parse(decodedText.trim()); }
      catch { toast.error('Invalid QR Format', { position: 'top-center' }); return; }

      const { pnr, yatraId, persons } = parsed || {};

      if (!pnr || !yatraId) {
        toast.error('Incomplete QR Data', { position: 'top-center' });
        return;
      }

      await stopCamera();

      const response = await deliverPrasadam({ pnr, yatraId }).unwrap();

      if (response.success) {
        setScannedData({
          pnr: response.data?.pnr || pnr,
          persons: persons || 1,
          name: response.data?.name || parsed?.name || ''
        });
        setShowInfoModal(true);
        toast.success('Prasadam Delivery Confirmed', { position: 'top-right' });
      } else {
        toast.error(response.error || response.message || 'Verification Failed', { position: 'top-center' });
      }
    } catch (err: any) {
      console.error("API Error:", err);
      toast.error(err?.data?.message || err?.message || 'Error processing delivery', { position: 'top-center' });
    } finally {
      // ✅ SPEED FIX 10: Always reset BOTH refs so the scan loop can resume
      //    immediately after a failed scan — no need to manually refresh.
      isProcessingRef.current = false;
      isDetectingRef.current = false;
      setIsProcessing(false);
    }
  };

  // ─── Force reset ──────────────────────────────────────────────────────────
  const forceReset = async () => {
    isProcessingRef.current = false;
    isDetectingRef.current = false;
    setIsProcessing(false);
    setCameraError(null);
    detectorRef.current = null; // Force re-init of detector
    stopCamera();
    toast.info('Restarting camera...');
    await startCamera(currentCameraIndex);
  };

  // ─── Manual submit ────────────────────────────────────────────────────────
  const handleManualSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualPnr.trim()) return;
    if (!selectedYatraId) {
      toast.error('Please select a Yatra from the header first', { position: 'top-center' });
      return;
    }
    setIsProcessing(true);
    try {
      const response = await deliverPrasadam({
        pnr: manualPnr.trim().toUpperCase(),
        yatraId: selectedYatraId
      }).unwrap();
      if (response.success) {
        setScannedData(response.data || { pnr: manualPnr.trim().toUpperCase(), persons: 1 });
        setShowInfoModal(true);
        setShowManualEntry(false);
        setManualPnr('');
        toast.success('Prasadam Delivery Confirmed', { position: 'top-right' });
      } else {
        toast.error(response.error || response.message || 'Manual Verification Failed');
      }
    } catch (err: any) {
      toast.error(err?.data?.message || 'Error processing manual delivery');
    } finally {
      setIsProcessing(false);
    }
  };

  // ─── Render ───────────────────────────────────────────────────────────────
  return (
    <div className="flex flex-col h-full w-full bg-[#fdf8f3] rounded-[2rem] overflow-hidden border border-heritage-gold/20 shadow-xl relative">
      <style jsx global>{`
        #prasadam-video-container video {
          width: 100% !important;
          height: 100% !important;
          object-fit: cover !important;
          border-radius: 2rem;
        }
      `}</style>

      {/* Header */}
      <div className="px-8 py-6 flex items-center justify-between border-b border-heritage-gold/10 bg-white/50 backdrop-blur-md">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-heritage-maroon rounded-xl flex items-center justify-center shadow-md">
            <Gift className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-heritage-textDark tracking-tight">Prasadam Scanner</h2>
            <p className="text-[10px] text-heritage-text/40 font-black uppercase tracking-[0.1em]">Divine Registration Verification</p>
          </div>
        </div>
        <button onClick={forceReset} className="p-2 text-heritage-text/40 hover:text-heritage-maroon transition-colors">
          <RefreshCw className={`w-5 h-5 ${isProcessing ? 'animate-spin' : ''}`} />
        </button>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center p-8 relative">
        <div className="relative group w-full max-w-[420px]">
          <div className="relative aspect-square rounded-[2.5rem] overflow-hidden bg-slate-900 shadow-2xl border-4 border-white">
            <div id="prasadam-video-container" className="absolute inset-0 pointer-events-none z-0">
              <video
                ref={videoRef}
                className="w-full h-full object-cover pointer-events-auto"
                playsInline
                muted
                autoPlay
              />
              <canvas ref={canvasRef} className="hidden" />
            </div>

            <div className="absolute inset-0 pointer-events-none z-10">
              <AnimatePresence>
                {(isProcessing || isAPILoading) && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    className="absolute inset-0 flex flex-col items-center justify-center bg-slate-900/60 backdrop-blur-sm z-30">
                    <Loader2 className="w-10 h-10 text-heritage-maroon animate-spin mb-4" />
                    <p className="text-[10px] font-black text-white uppercase tracking-widest">Processing...</p>
                  </motion.div>
                )}

                {cameraError && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                    className="absolute inset-0 flex flex-col items-center justify-center bg-slate-900 z-30 px-8 text-center">
                    <AlertCircle className="w-10 h-10 text-red-400 mb-4" />
                    <p className="text-xs font-bold text-white/80 mb-2">Camera Error</p>
                    <p className="text-[10px] text-white/40 mb-6">{cameraError}</p>
                    <button onClick={forceReset}
                      className="px-6 py-3 bg-heritage-maroon text-white text-xs font-bold rounded-xl uppercase tracking-widest">
                      Retry
                    </button>
                  </motion.div>
                )}

                {!isScanning && !cameraError && !isProcessing && !isAPILoading && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                    className="absolute inset-0 flex flex-col items-center justify-center bg-slate-900">
                    <Loader2 className="w-10 h-10 text-heritage-maroon animate-spin mb-4" />
                    <p className="text-[10px] font-black text-white/40 uppercase tracking-widest">Initialising...</p>
                  </motion.div>
                )}
              </AnimatePresence>

              {isScanning && (
                <div className="absolute inset-0">
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[70%] h-[70%] border border-white/10 rounded-2xl">
                    <div className="absolute top-0 left-0 w-10 h-10 border-t-4 border-l-4 border-heritage-gold rounded-tl-2xl" />
                    <div className="absolute top-0 right-0 w-10 h-10 border-t-4 border-r-4 border-heritage-gold rounded-tr-2xl" />
                    <div className="absolute bottom-0 left-0 w-10 h-10 border-b-4 border-l-4 border-heritage-gold rounded-bl-2xl" />
                    <div className="absolute bottom-0 right-0 w-10 h-10 border-b-4 border-r-4 border-heritage-gold rounded-br-2xl" />
                    <motion.div
                      animate={{ top: ['10%', '90%'] }}
                      transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                      className="absolute left-4 right-4 h-0.5 bg-heritage-gold shadow-[0_0_10px_#eba83a] z-20"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center justify-center gap-4 mt-10">
          <button onClick={toggleTorch}
            className={`p-4 rounded-2xl border transition-all ${isTorchOn ? 'bg-heritage-gold text-white border-transparent shadow-lg' : 'bg-white text-heritage-textDark border-heritage-gold/10'}`}>
            <Zap className={`w-5 h-5 ${isTorchOn ? 'fill-current' : ''}`} />
          </button>
          <button onClick={switchCamera}
            className="p-4 bg-white border border-heritage-gold/10 rounded-2xl text-heritage-textDark hover:bg-heritage-bgMain transition-colors">
            <SwitchCamera className="w-5 h-5" />
          </button>
        </div>

        <button onClick={() => setShowManualEntry(true)}
          className="mt-6 text-[10px] font-black text-heritage-text/40 hover:text-heritage-maroon transition-colors uppercase tracking-[0.2em] flex items-center gap-2 border-b border-transparent hover:border-heritage-maroon/20 pb-0.5">
          <Keyboard className="w-3 h-3" />
          Enter PNR Manually
        </button>
      </div>

      {/* Manual Entry Sidebar */}
      <AnimatePresence>
        {showManualEntry && (
          <motion.div
            initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
            className="absolute right-0 top-0 bottom-0 w-full lg:w-[400px] bg-white border-l border-heritage-gold/10 p-10 z-[100] shadow-2xl flex flex-col">
            <button onClick={() => setShowManualEntry(false)}
              className="absolute top-8 right-8 p-2 text-heritage-text/30 hover:text-heritage-maroon transition-colors">
              <X className="w-6 h-6" />
            </button>
            <div className="mt-6 mb-10">
              <h3 className="text-2xl font-bold text-heritage-textDark mb-2">Manual Verification</h3>
              <p className="text-xs text-heritage-text/40 font-bold uppercase tracking-widest">Enter PNR Reference</p>
            </div>
            <form onSubmit={handleManualSubmit} className="space-y-6">
              <input
                type="text"
                value={manualPnr}
                onChange={(e) => setManualPnr(e.target.value.toUpperCase())}
                placeholder="E.G. HAR-12345"
                className="w-full bg-[#fdf8f3] border-2 border-heritage-highlight rounded-2xl px-6 py-5 font-bold text-xl tracking-widest text-heritage-textDark focus:border-heritage-maroon/40 outline-none transition-all uppercase"
                autoFocus
              />
              <button type="submit"
                className="w-full h-16 bg-heritage-maroon text-white font-bold rounded-2xl shadow-lg hover:bg-heritage-textDark active:scale-95 transition-all text-xs uppercase tracking-widest">
                Verify Pass Credentials
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      <input type="file" ref={fileInputRef} onChange={async (e) => {
        const file = e.target.files?.[0];
        if (!file || !detectorRef.current) return;
        setIsProcessing(true);
        try {
          const bitmap = await createImageBitmap(file);
          const codes = await detectorRef.current.detect(bitmap);
          if (codes.length > 0) {
            await processScanResult(codes[0].rawValue);
          } else {
            toast.error("No valid QR code found in image");
          }
        } catch {
          toast.error("No valid QR code found in image");
        } finally {
          setIsProcessing(false);
          if (fileInputRef.current) fileInputRef.current.value = '';
        }
      }} accept="image/*" className="hidden" />

      <PrasadamInfoModal isOpen={showInfoModal} onClose={() => setShowInfoModal(false)} data={scannedData} />
    </div>
  );
}