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
import { Html5Qrcode, Html5QrcodeScannerState } from 'html5-qrcode';
import { toast } from 'react-toastify';
import PrasadamInfoModal from '@/components/admin/prasadam/PrasadamInfoModal';

export default function PrasadamScanner() {
  const router = useRouter();
  const [isScanning, setIsScanning] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [showManualEntry, setShowManualEntry] = useState(false);
  const [manualPnr, setManualPnr] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isTorchOn, setIsTorchOn] = useState(false);
  const [hasTorch, setHasTorch] = useState(false);
  const [availableCameras, setAvailableCameras] = useState<{ id: string; label: string }[]>([]);
  const [currentCameraIndex, setCurrentCameraIndex] = useState(-1);

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

  const scannerRef = useRef<Html5Qrcode | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const isProcessingRef = useRef(false);
  const isMountedRef = useRef(true);
  const scannerRegionId = "prasadam-qr-reader";

  // ─── Clean stop ───────────────────────────────────────────────────────────
  const stopScannerCleanly = useCallback(async () => {
    const scanner = scannerRef.current;
    if (!scanner) return;
    try {
      if (scanner.getState() === Html5QrcodeScannerState.SCANNING) {
        await scanner.stop();
      }
    } catch (err) {
      console.warn("Stop failed:", err);
    }
    try {
      const el = document.getElementById(scannerRegionId);
      if (el) el.innerHTML = '';
    } catch (_) { }
    setIsScanning(false);
    setIsTorchOn(false);
  }, []);

  // ─── Start scanner ────────────────────────────────────────────────────────
  const startScanner = useCallback(async (cameraIndexOverride?: number) => {
    if (!isMountedRef.current) return;

    // Always wipe the container first to avoid "already exists" errors
    const el = document.getElementById(scannerRegionId);
    if (!el) return;
    el.innerHTML = '';

    // Fresh instance every time
    scannerRef.current = new Html5Qrcode(scannerRegionId, { verbose: false });

    // Enumerate cameras
    let cameras: { id: string; label: string }[] = [];
    try {
      cameras = await Html5Qrcode.getCameras();
    } catch (err: any) {
      const msg = err?.message || 'Camera permission denied';
      console.error('[getCameras]', err);
      if (isMountedRef.current) setCameraError(msg);
      return;
    }

    if (!cameras.length) {
      if (isMountedRef.current) setCameraError('No cameras found on this device');
      return;
    }

    if (isMountedRef.current) setAvailableCameras(cameras);

    // Resolve camera
    const idxToUse = cameraIndexOverride !== undefined ? cameraIndexOverride : currentCameraIndex;
    let resolvedIndex: number;
    let cameraConfig: any;

    if (idxToUse >= 0 && idxToUse < cameras.length) {
      resolvedIndex = idxToUse;
      cameraConfig = { deviceId: { exact: cameras[resolvedIndex].id } };
    } else {
      // Prefer back/rear/environment camera
      const backIdx = cameras.findIndex(c => /back|rear|environment/i.test(c.label));
      resolvedIndex = backIdx !== -1 ? backIdx : 0;
      cameraConfig = backIdx !== -1
        ? { deviceId: { exact: cameras[resolvedIndex].id } }
        : { facingMode: { ideal: 'environment' } };
      if (isMountedRef.current) setCurrentCameraIndex(resolvedIndex);
    }

    const scanConfig = {
      fps: 30,
      qrbox: (w: number, h: number) => {
        const size = Math.max(180, Math.floor(Math.min(w, h) * 0.55));
        return { width: size, height: size };
      },
      aspectRatio: 1.0,
      disableFlip: false,
      experimentalFeatures: { useBarCodeDetectorIfSupported: true },
    };

    // Try fallback chain
    const attempts: any[] = [
      cameraConfig,
      { facingMode: 'environment' },
      { facingMode: 'user' },
    ];

    for (const config of attempts) {
      try {
        await scannerRef.current.start(config, scanConfig, onScanSuccess, () => { });
        if (isMountedRef.current) {
          setIsScanning(true);
          setCameraError(null);
          try {
            const caps = await scannerRef.current.getRunningTrackCapabilities();
            setHasTorch(!!(caps as any)?.torch);
          } catch { setHasTorch(false); }
        }
        return; // success
      } catch (err) {
        console.warn('[Scanner start attempt failed]', config, err);
        try { await scannerRef.current.stop(); } catch (_) { }
        el.innerHTML = '';
        scannerRef.current = new Html5Qrcode(scannerRegionId, { verbose: false });
      }
    }

    if (isMountedRef.current) {
      setCameraError('Could not open camera. Please allow camera access and retry.');
    }
  }, [currentCameraIndex]); // eslint-disable-line

  // ─── Mount / unmount ──────────────────────────────────────────────────────
  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
      stopScannerCleanly().catch(console.warn);
    };
  }, []); // eslint-disable-line

  // ─── React to visibility changes ──────────────────────────────────────────
  useEffect(() => {
    const shouldScan = !showManualEntry && !showInfoModal && !cameraError;

    if (shouldScan) {
      const t = setTimeout(() => startScanner(), 150);
      return () => clearTimeout(t);
    } else {
      stopScannerCleanly().catch(console.warn);
    }
  }, [showManualEntry, showInfoModal, cameraError]); // eslint-disable-line

  // ─── Switch camera ────────────────────────────────────────────────────────
  const switchCamera = useCallback(async () => {
    if (availableCameras.length < 2) return;
    const nextIndex = (currentCameraIndex + 1) % availableCameras.length;
    await stopScannerCleanly();
    setCurrentCameraIndex(nextIndex);
    setTimeout(() => startScanner(nextIndex), 150);
  }, [availableCameras, currentCameraIndex, stopScannerCleanly, startScanner]);

  // ─── Torch ───────────────────────────────────────────────────────────────
  const toggleTorch = async () => {
    if (!scannerRef.current || !hasTorch || !isScanning) return;
    try {
      const desired = !isTorchOn;
      await scannerRef.current.applyVideoConstraints({ advanced: [{ torch: desired } as any] });
      setIsTorchOn(desired);
    } catch { setHasTorch(false); }
  };

  // ─── Scan callbacks ───────────────────────────────────────────────────────
  const onScanSuccess = useCallback((decodedText: string) => {
    if (isProcessingRef.current) return;
    processScanResult(decodedText);
  }, []); // eslint-disable-line

  const processScanResult = async (decodedText: string) => {
    if (isProcessingRef.current) return;
    isProcessingRef.current = true;
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

      await stopScannerCleanly();

      const response = await deliverPrasadam({ pnr, yatraId }).unwrap();

      if (response.success) {
        setScannedData({
          pnr: response.data?.pnr || pnr,
          persons: response.data?.persons || persons || 1,
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
      isProcessingRef.current = false;
      setIsProcessing(false);
    }
  };

  // ─── Force reset ──────────────────────────────────────────────────────────
  const forceReset = async () => {
    isProcessingRef.current = false;
    setIsProcessing(false);
    setCameraError(null);       // this triggers the visibility effect → startScanner
    setCurrentCameraIndex(-1);
    await stopScannerCleanly();
    scannerRef.current = null;
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
        #prasadam-qr-reader video {
          width: 100% !important;
          height: 100% !important;
          object-fit: cover !important;
          border-radius: 2rem;
        }
        #prasadam-qr-reader { border: none !important; }
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
            <div className="absolute inset-0 pointer-events-none z-0">
              <div id={scannerRegionId} className="w-full h-full pointer-events-auto" />
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
                      transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
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
      }} accept="image/*" className="hidden" />

      <PrasadamInfoModal isOpen={showInfoModal} onClose={() => setShowInfoModal(false)} data={scannedData} />
    </div>
  );
}