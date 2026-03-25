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
  Upload,
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

  // API Mutation
  const [deliverPrasadam, { isLoading: isAPILoading }] = useDeliverPrasadamMutation();

  // Selected Yatra from storage (for manual fallback)
  const [selectedYatraId, setSelectedYatraId] = useState<string | null>(null);

  useEffect(() => {
    const yatraId = yatraStorage.getSelectedYatraId();
    setSelectedYatraId(yatraId);

    const handleStorageChange = () => {
      const newYatraId = yatraStorage.getSelectedYatraId();
      setSelectedYatraId(newYatraId);
    };

    window.addEventListener('storage', handleStorageChange);
    const interval = setInterval(handleStorageChange, 1000);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(interval);
    };
  }, []);

  // Modal State
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [scannedData, setScannedData] = useState<any>(null);

  const scannerRef = useRef<Html5Qrcode | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const isHandlingStateChange = useRef(false);
  const scannerRegionId = "prasadam-qr-reader";

  // ────────────────────────────────────────────────
  //          CAMERA CLEANUP HELPER
  // ────────────────────────────────────────────────
  const stopScannerCleanly = useCallback(async () => {
    if (!scannerRef.current) return;
    const currentState = scannerRef.current.getState();

    try {
      if (currentState === Html5QrcodeScannerState.SCANNING) {
        await scannerRef.current.stop();
      }
    } catch (err) {
      console.warn("Stop camera failed during cleanup:", err);
    } finally {
      // In all cases, try to wipe the container to avoid React/html5-qrcode conflicts
      const el = document.getElementById(scannerRegionId);
      if (el) el.innerHTML = '';
      setIsScanning(false);
      setIsTorchOn(false);
    }
  }, []);

  // ────────────────────────────────────────────────
  //          MAIN LIFECYCLE EFFECT
  // ────────────────────────────────────────────────
  useEffect(() => {
    let isMounted = true;

    const manageScanner = async () => {
      if (isHandlingStateChange.current) return;
      isHandlingStateChange.current = true;

      const shouldBeScanning = !showManualEntry && !isProcessing && !cameraError && !showInfoModal && !isAPILoading;

      try {
        const container = document.getElementById(scannerRegionId);
        if (!container) return;

        if (!scannerRef.current) {
          scannerRef.current = new Html5Qrcode(scannerRegionId, { verbose: false });
        }

        const currentState = scannerRef.current.getState();
        const isCurrentlyScanning = currentState === Html5QrcodeScannerState.SCANNING;

        if (shouldBeScanning && !isCurrentlyScanning) {
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
          
          // Use currentCameraIndex if it was already selected/set to a valid index >= 0
          if (currentCameraIndex >= 0 && currentCameraIndex < cameras.length) {
            cameraConfig = { deviceId: { exact: cameras[currentCameraIndex].id } };
          } else {
            // New selection: Prioritize back/rear camera
            const back = cameras.find(c => /back|rear|environment/i.test(c.label));
            
            if (back) {
              cameraConfig = { deviceId: { exact: back.id } };
              const backIdx = cameras.findIndex(c => c.id === back.id);
              setCurrentCameraIndex(backIdx);
            } else {
              // Standard facingMode fallback for mobile (no specific labels found)
              cameraConfig = { facingMode: "environment" };
              // Default to 0 if we can't label it specifically
              setCurrentCameraIndex(0);
            }
          }

          try {
            await scannerRef.current.start(
              cameraConfig,
              {
                fps: 20,
                qrbox: (w, h) => {
                  const minDim = Math.min(w, h);
                  const size = Math.max(50, Math.floor(minDim * 0.70));
                  return { width: size, height: size };
                },
                aspectRatio: 1.0,
              },
              onScanSuccess,
              onScanFailure
            );

            if (isMounted) {
              setIsScanning(true);
              try {
                const caps = await scannerRef.current.getRunningTrackCapabilities();
                setHasTorch(!!(caps as any)?.torch);
              } catch {
                setHasTorch(false);
              }
            }
          } catch (startErr: any) {
            console.warn("Primary start failed", startErr);
          }
        }
        else if (!shouldBeScanning && isCurrentlyScanning) {
          await stopScannerCleanly();
        }

      } catch (err: any) {
        console.error("[Scanner Lifecycle]", err);
        if (shouldBeScanning && isMounted) {
          setCameraError(err.message || "Failed to start camera");
          await stopScannerCleanly();
        }
      } finally {
        isHandlingStateChange.current = false;
      }
    };

    const timer = setTimeout(manageScanner, 500);

    return () => {
      clearTimeout(timer);
      isMounted = false;
      stopScannerCleanly().catch(console.warn);
    };
  }, [showManualEntry, isProcessing, cameraError, currentCameraIndex, stopScannerCleanly, showInfoModal]);

  const switchCamera = useCallback(async () => {
    if (availableCameras.length < 2 || !scannerRef.current || !isScanning) return;
    const nextIndex = (currentCameraIndex + 1) % availableCameras.length;
    await stopScannerCleanly();
    setCurrentCameraIndex(nextIndex);
  }, [availableCameras, currentCameraIndex, isScanning, stopScannerCleanly]);

  const toggleTorch = async () => {
    if (!scannerRef.current || !hasTorch || !isScanning) return;
    try {
      const desired = !isTorchOn;
      await scannerRef.current.applyVideoConstraints({ advanced: [{ torch: desired } as any] });
      setIsTorchOn(desired);
    } catch {
      setHasTorch(false);
    }
  };

  const onScanSuccess = (decodedText: string) => {
    processScanResult(decodedText);
  };

  const onScanFailure = () => { };

  const processScanResult = async (decodedText: string) => {
    if (isProcessing || isAPILoading) return;
    setIsProcessing(true);

    try {
      // 1. Validation: Verify DGNST exists
      if (!decodedText.includes('DGNST')) {
        toast.error('Incorrect QR Code', { position: 'top-center' });
        setIsProcessing(false);
        return;
      }

      // 2. Parse Data
      let parsed: any = null;
      try {
        parsed = JSON.parse(decodedText.trim());
      } catch {
        toast.error('Invalid QR Format', { position: 'top-center' });
        setIsProcessing(false);
        return;
      }

      const { pnr, yatraId, persons } = parsed || {};

      if (!pnr || !yatraId) {
        toast.error('Incomplete QR Data', { position: 'top-center' });
        setIsProcessing(false);
        return;
      }

      // 3. Stop Scanner during API call to release resources
      await stopScannerCleanly();

      // 4. API Call
      const response = await deliverPrasadam({ pnr, yatraId }).unwrap();

      if (response.success) {
        // 5. Show Success Popup with API data
        // Priority: API data > QR data > Default
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
      setIsProcessing(false);
    }
  };

  const forceReset = async () => {
    setIsProcessing(true);
    setCameraError(null);
    await stopScannerCleanly();
    scannerRef.current = null;
    setIsProcessing(false);
  };

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
        setScannedData(response.data || { 
          pnr: manualPnr.trim().toUpperCase(), 
          persons: 1 
        });
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
        {/* Scanner Container */}
        <div className="relative group w-full max-w-[420px]">
          <div className="relative aspect-square rounded-[2.5rem] overflow-hidden bg-slate-900 shadow-2xl border-4 border-white">
            <div className="absolute inset-0 pointer-events-none z-0">
              <div id={scannerRegionId} className="w-full h-full pointer-events-auto" />
            </div>

            {/* Viewfinder Overlay */}
            <div className="absolute inset-0 pointer-events-none z-10">
              <AnimatePresence>
                {(isProcessing || isAPILoading) && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    className="absolute inset-0 flex flex-col items-center justify-center bg-slate-900/60 backdrop-blur-sm z-30">
                    <Loader2 className="w-10 h-10 text-heritage-maroon animate-spin mb-4" />
                    <p className="text-[10px] font-black text-white uppercase tracking-widest">Processing...</p>
                  </motion.div>
                )}
                {!isScanning && !cameraError && !isProcessing && !isAPILoading && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="absolute inset-0 flex flex-col items-center justify-center bg-slate-900">
                    <Loader2 className="w-10 h-10 text-heritage-maroon animate-spin mb-4" />
                    <p className="text-[10px] font-black text-white/40 uppercase tracking-widest">Initialising...</p>
                  </motion.div>
                )}
              </AnimatePresence>

              {isScanning && (
                <div className="absolute inset-0">
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[70%] h-[70%] border border-white/10 rounded-2xl">
                    {/* Simplified Corners */}
                    <div className="absolute top-0 left-0 w-10 h-10 border-t-4 border-l-4 border-heritage-gold rounded-tl-2xl" />
                    <div className="absolute top-0 right-0 w-10 h-10 border-t-4 border-r-4 border-heritage-gold rounded-tr-2xl" />
                    <div className="absolute bottom-0 left-0 w-10 h-10 border-b-4 border-l-4 border-heritage-gold rounded-bl-2xl" />
                    <div className="absolute bottom-0 right-0 w-10 h-10 border-b-4 border-r-4 border-heritage-gold rounded-br-2xl" />

                    {/* Scanning Line */}
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

        {/* Essential Controls */}
        <div className="flex items-center justify-center gap-4 mt-10">
          {/* <button onClick={() => fileInputRef.current?.click()} className="flex items-center gap-2 px-6 py-3 bg-white border border-heritage-gold/10 rounded-2xl text-heritage-textDark hover:bg-heritage-bgMain transition-colors hover:shadow-sm">
            <Upload className="w-4 h-4 text-heritage-maroon" />
            <span className="text-xs font-bold uppercase tracking-widest">Upload Image</span>
          </button> */}

          <button onClick={toggleTorch} className={`p-4 rounded-2xl border transition-all ${isTorchOn ? 'bg-heritage-gold text-white border-transparent shadow-lg' : 'bg-white text-heritage-textDark border-heritage-gold/10'}`}>
            <Zap className={`w-5 h-5 ${isTorchOn ? 'fill-current' : ''}`} />
          </button>

          <button onClick={switchCamera} className="p-4 bg-white border border-heritage-gold/10 rounded-2xl text-heritage-textDark hover:bg-heritage-bgMain transition-colors">
            <SwitchCamera className="w-5 h-5" />
          </button>
        </div>

        <button onClick={() => setShowManualEntry(true)} className="mt-6 text-[10px] font-black text-heritage-text/40 hover:text-heritage-maroon transition-colors uppercase tracking-[0.2em] flex items-center gap-2 border-b border-transparent hover:border-heritage-maroon/20 pb-0.5">
          <Keyboard className="w-3 h-3" />
          Enter PNR Manually
        </button>
      </div>

      {/* Manual Entry Sidebar */}
      <AnimatePresence>
        {showManualEntry && (
          <motion.div
            initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
            className="absolute right-0 top-0 bottom-0 w-full lg:w-[400px] bg-white border-l border-heritage-gold/10 p-10 z-[100] shadow-2xl flex flex-col"
          >
            <button onClick={() => setShowManualEntry(false)} className="absolute top-8 right-8 p-2 text-heritage-text/30 hover:text-heritage-maroon transition-colors">
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
              <button type="submit" className="w-full h-16 bg-heritage-maroon text-white font-bold rounded-2xl shadow-lg hover:bg-heritage-textDark active:scale-95 transition-all text-xs uppercase tracking-widest">
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
