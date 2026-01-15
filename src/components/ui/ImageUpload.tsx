'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Camera, Upload, X, Image as ImageIcon, AlertCircle, Info, RefreshCw } from 'lucide-react';
import Button from './Button';
import Modal from './Modal';

interface ImageUploadProps {
  label?: string;
  error?: string;
  helperText?: string;
  maxFiles?: number;
  onChange: (files: File[]) => void;
  value?: File[];
}

interface InstructionStep {
  device: string;
  browser: string;
  steps: string[];
}

/**
 * ImageUpload Component with Camera and File Upload
 * 
 * Features:
 * - Upload via file selection
 * - Capture via device camera
 * - Multiple image support
 * - Camera permission handling
 * - Device/browser-specific instructions for enabling camera
 * - Preview uploaded images
 * - Remove individual images
 */
export default function ImageUpload({
  label = 'Upload Images',
  error,
  helperText,
  maxFiles = 5,
  onChange,
  value = [],
}: ImageUploadProps) {
  const [uploadedFiles, setUploadedFiles] = useState<File[]>(value);
  const [showCamera, setShowCamera] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [showPermissionModal, setShowPermissionModal] = useState(false);
  const [showInstructionsModal, setShowInstructionsModal] = useState(false);
  const [permissionDenied, setPermissionDenied] = useState(false);
  const [cameraMode, setCameraMode] = useState<'user' | 'environment'>('environment');
  const [availableCameras, setAvailableCameras] = useState<number>(0);
  const [isMobile, setIsMobile] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [capturedFile, setCapturedFile] = useState<File | null>(null);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Detect device and browser
  const getDeviceInfo = () => {
    // Check if we're on the client side
    if (typeof window === 'undefined' || typeof navigator === 'undefined') {
      return { device: 'Desktop', browser: 'Chrome' };
    }

    const userAgent = navigator.userAgent.toLowerCase();
    const isAndroid = /android/.test(userAgent);
    const isIOS = /iphone|ipad|ipod/.test(userAgent);
    const isChrome = /chrome/.test(userAgent) && !/edg/.test(userAgent);
    const isFirefox = /firefox/.test(userAgent);
    const isSafari = /safari/.test(userAgent) && !/chrome/.test(userAgent);
    const isEdge = /edg/.test(userAgent);

    let device = 'Desktop';
    if (isAndroid) device = 'Android';
    else if (isIOS) device = 'iOS';

    let browser = 'Chrome';
    if (isFirefox) browser = 'Firefox';
    else if (isSafari) browser = 'Safari';
    else if (isEdge) browser = 'Edge';

    return { device, browser };
  };

  // Instructions for enabling camera permission
  const permissionInstructions: InstructionStep[] = [
    {
      device: 'Android',
      browser: 'Chrome',
      steps: [
        'Tap the lock icon or "i" icon in the address bar',
        'Tap "Permissions" or "Site settings"',
        'Find "Camera" and tap it',
        'Select "Allow" or "Ask"',
        'Refresh the page and try again',
      ],
    },
    {
      device: 'Android',
      browser: 'Firefox',
      steps: [
        'Tap the shield icon in the address bar',
        'Tap "Settings" for this site',
        'Find "Camera" permission',
        'Change to "Allow"',
        'Refresh the page and try again',
      ],
    },
    {
      device: 'iOS',
      browser: 'Safari',
      steps: [
        'Go to iPhone Settings app',
        'Scroll down and tap "Safari"',
        'Tap "Camera" under Settings for Websites',
        'Choose "Ask" or "Allow"',
        'Go back to Safari and refresh the page',
      ],
    },
    {
      device: 'iOS',
      browser: 'Chrome',
      steps: [
        'Go to iPhone Settings app',
        'Scroll down and tap "Chrome"',
        'Tap "Camera"',
        'Enable camera access',
        'Go back to Chrome and refresh the page',
      ],
    },
    {
      device: 'Desktop',
      browser: 'Chrome',
      steps: [
        'Click the camera icon with "X" in the address bar',
        'Click "Always allow [website] to access your camera"',
        'Click "Done"',
        'Or go to Settings → Privacy and security → Site Settings → Camera',
        'Remove this site from blocked list and add to allowed',
      ],
    },
    {
      device: 'Desktop',
      browser: 'Firefox',
      steps: [
        'Click the camera icon with slash in the address bar',
        'Click the "X" to clear the blocked permission',
        'Refresh the page and allow camera access',
        'Or go to Settings → Privacy & Security → Permissions → Camera',
        'Remove this site from blocked list',
      ],
    },
    {
      device: 'Desktop',
      browser: 'Safari',
      steps: [
        'Go to Safari → Settings/Preferences',
        'Click "Websites" tab',
        'Click "Camera" in the left sidebar',
        'Find this website and change to "Allow"',
        'Refresh the page',
      ],
    },
  ];

  // Get relevant instructions based on device and browser
  const getRelevantInstructions = () => {
    const { device, browser } = getDeviceInfo();
    return permissionInstructions.filter(
      (inst) => inst.device === device && inst.browser === browser
    );
  };

  // Detect device type and available cameras on mount
  useEffect(() => {
    const detectDeviceAndCameras = async () => {
      // Check if we're on the client side
      if (typeof window === 'undefined' || typeof navigator === 'undefined') {
        return;
      }

      // Detect if mobile device
      const userAgent = navigator.userAgent.toLowerCase();
      const mobile = /android|iphone|ipad|ipod/.test(userAgent);
      setIsMobile(mobile);

      // Detect available cameras
      try {
        if (navigator.mediaDevices && navigator.mediaDevices.enumerateDevices) {
          const devices = await navigator.mediaDevices.enumerateDevices();
          const videoDevices = devices.filter(device => device.kind === 'videoinput');
          setAvailableCameras(videoDevices.length);

          // Set default camera mode based on device type
          if (mobile && videoDevices.length >= 2) {
            // Mobile with multiple cameras: default to back camera
            setCameraMode('environment');
          } else if (!mobile || videoDevices.length === 1) {
            // Laptop/tablet with only front camera: default to front camera
            setCameraMode('user');
          }
        }
      } catch (error) {
        console.error('Error detecting cameras:', error);
      }
    };

    detectDeviceAndCameras();
  }, []);

  // Attach stream to video element when stream changes
  useEffect(() => {
    if (stream && videoRef.current) {
      videoRef.current.srcObject = stream;
      videoRef.current.play().catch(err => {
        console.error('Error playing video:', err);
      });
    }
  }, [stream]);

  // Clean up camera stream when component unmounts or camera closes
  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach((track) => {
        track.stop();
      });
      setStream(null);
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  };

  const startCamera = async (mode?: 'user' | 'environment') => {
    // Check if we're on the client side and mediaDevices is available
    if (typeof window === 'undefined' || typeof navigator === 'undefined' || !navigator.mediaDevices) {
      alert('Camera is not available in this environment');
      return;
    }

    try {
      setPermissionDenied(false);
      const facingMode = mode || cameraMode;
      
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { 
          facingMode: { ideal: facingMode },
          width: { ideal: 1920 },
          height: { ideal: 1080 }
        },
        audio: false,
      });

      setStream(mediaStream);
      setShowCamera(true);
    } catch (err: any) {
      console.error('Camera error:', err);
      
      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        setPermissionDenied(true);
        setShowPermissionModal(true);
      } else if (err.name === 'NotFoundError') {
        alert('No camera found on your device');
      } else {
        alert('Unable to access camera. Please check your browser settings.');
      }
    }
  };

  const switchCamera = async () => {
    // Stop current stream
    stopCamera();
    
    // Toggle camera mode
    const newMode = cameraMode === 'user' ? 'environment' : 'user';
    setCameraMode(newMode);
    
    // Start camera with new mode
    await startCamera(newMode);
  };

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(video, 0, 0);
        
        // Get image data URL for preview
        const imageDataUrl = canvas.toDataURL('image/jpeg', 0.9);
        setCapturedImage(imageDataUrl);
        
        // Stop camera to save resources
        stopCamera();
        
        // Create file for later submission
        canvas.toBlob((blob) => {
          if (blob) {
            const file = new File(
              [blob],
              `ticket-photo-${Date.now()}.jpg`,
              { type: 'image/jpeg' }
            );
            setCapturedFile(file);
          }
        }, 'image/jpeg', 0.9);
      }
    }
  };

  const handleRetake = async () => {
    setCapturedImage(null);
    setCapturedFile(null);
    // Restart camera for retake
    await startCamera();
  };

  const handleSubmitPhoto = () => {
    if (capturedFile) {
     stopCamera();
      handleAddFile(capturedFile);
      setCapturedImage(null);
      setCapturedFile(null);
      closeCamera();
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    files.forEach((file) => handleAddFile(file));
    
    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleAddFile = (file: File) => {
    if (uploadedFiles.length >= maxFiles) {
      alert(`Maximum ${maxFiles} images allowed`);
      return;
    }

    const newFiles = [...uploadedFiles, file];
    setUploadedFiles(newFiles);
    onChange(newFiles);
  };

  const handleRemoveFile = (index: number) => {
    const newFiles = uploadedFiles.filter((_, i) => i !== index);
    setUploadedFiles(newFiles);
    onChange(newFiles);
  };

  const closeCamera = () => {
    setShowCamera(false);
    setCapturedImage(null);
    setCapturedFile(null);
  };

  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          {label}
        </label>
      )}

      {/* Upload Options */}
      <div className="space-y-4">
        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          <Button
            type="button"
            variant="admin-outline"
            size="sm"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploadedFiles.length >= maxFiles}
            className="flex-1 sm:flex-initial border-spiritual-zen-accent/30 hover:border-spiritual-zen-accent/50 hover:bg-spiritual-zen-accent/5 text-spiritual-zen-charcoal"
          >
            <Upload className="w-4 h-4 mr-2" />
            <span className="hidden sm:inline">Choose Files</span>
            <span className="sm:hidden">Files</span>
          </Button>

          <Button
            type="button"
            variant="admin-outline"
            size="sm"
            onClick={() => startCamera()}
            disabled={uploadedFiles.length >= maxFiles}
            className="flex-1 sm:flex-initial border-spiritual-zen-forest/30 hover:border-spiritual-zen-forest/50 hover:bg-spiritual-zen-forest/5 text-spiritual-zen-charcoal"
          >
            <Camera className="w-4 h-4 mr-2" />
            <span className="hidden sm:inline">Open Camera</span>
            <span className="sm:hidden">Camera</span>
          </Button>

          {uploadedFiles.length > 0 && (
            <div className="flex items-center gap-2 px-3 py-1.5 bg-spiritual-zen-forest/10 border border-spiritual-zen-forest/20 rounded-lg">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-xs sm:text-sm font-medium text-spiritual-zen-charcoal">
                {uploadedFiles.length} / {maxFiles}
              </span>
            </div>
          )}
        </div>

        {/* Hidden File Input */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          onChange={handleFileSelect}
          className="hidden"
          id="image-upload-input"
        />

        {/* Image Previews */}
        {uploadedFiles.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4">
            {uploadedFiles.map((file, index) => (
              <div
                key={index}
                className="relative group border-2 border-spiritual-zen-accent/20 rounded-xl overflow-hidden aspect-square shadow-md hover:shadow-lg transition-all duration-300 hover:border-spiritual-zen-accent/40 bg-white"
              >
                <img
                  src={URL.createObjectURL(file)}
                  alt={`Preview ${index + 1}`}
                  className="w-full h-full object-cover"
                />
                <button
                  type="button"
                  onClick={() => handleRemoveFile(index)}
                  className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-200 shadow-lg transform hover:scale-110"
                  aria-label={`Remove ${file.name}`}
                >
                  <X className="w-3.5 h-3.5" />
                </button>
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 via-black/50 to-transparent text-white text-xs p-2 truncate">
                  <span className="font-medium">Ticket {index + 1}</span>
                </div>
                <div className="absolute top-2 left-2 bg-spiritual-zen-forest/90 text-white text-xs font-semibold px-2 py-0.5 rounded-full">
                  #{index + 1}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {uploadedFiles.length === 0 && (
          <label htmlFor="image-upload-input" className="cursor-pointer border-2 border-dashed border-spiritual-zen-accent/40 rounded-xl p-6 sm:p-8 text-center flex flex-col items-center justify-center bg-gradient-to-br from-spiritual-zen-mist/20 to-white hover:border-spiritual-zen-accent/60 hover:bg-spiritual-zen-mist/30 transition-all duration-300 group">
            <div className="p-3 bg-gradient-to-br from-spiritual-zen-forest/10 to-spiritual-zen-accent/10 rounded-full mb-3 group-hover:scale-110 transition-transform">
              <ImageIcon className="w-8 h-8 sm:w-10 sm:h-10 text-spiritual-zen-forest" />
            </div>
            <p className="text-sm sm:text-base font-medium text-spiritual-zen-charcoal mb-1.5">
              Click to upload or use camera
            </p>
            <p className="text-xs text-spiritual-textLight">
              PNG, JPG up to 5MB each • Maximum {maxFiles} images
            </p>
          </label>
        )}
      </div>

      {helperText && !error && (
        <p className="mt-2 text-sm text-gray-500">{helperText}</p>
      )}

      {error && (
        <p className="mt-2 text-sm text-red-600 flex items-center">
          <AlertCircle className="w-4 h-4 mr-1" />
          {error}
        </p>
      )}

      {/* Camera Modal */}
      <Modal
        isOpen={showCamera}
        onClose={closeCamera}
        title={capturedImage ? "Preview Photo" : "Capture Ticket Photo"}
        size="lg"
        footer={
          capturedImage ? (
            <>
              <Button variant="outline" onClick={handleRetake}>
                <RefreshCw className="w-4 h-4 mr-2" />
                Retake
              </Button>
              <Button onClick={handleSubmitPhoto}>
                <Camera className="w-4 h-4 mr-2" />
                Submit Photo
              </Button>
            </>
          ) : (
            <>
              <Button variant="outline" onClick={closeCamera}>
                Cancel
              </Button>
              <Button onClick={capturePhoto}>
                <Camera className="w-4 h-4 mr-2" />
                Capture Photo
              </Button>
            </>
          )
        }
      >
        <div className="space-y-4">
          {capturedImage ? (
            /* Preview Mode */
            <div className="space-y-4">
              <div className="relative bg-black rounded-lg overflow-hidden aspect-video">
                <img
                  src={capturedImage}
                  alt="Captured preview"
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="text-center">
                <p className="text-sm text-green-600 font-medium flex items-center justify-center gap-2">
                  <Camera className="w-4 h-4" />
                  Photo captured successfully!
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  Review your photo and click "Submit" or "Retake" to capture again
                </p>
              </div>
            </div>
          ) : (
            /* Camera Mode */
            <>
              <div className="relative bg-black rounded-lg overflow-hidden aspect-video">
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full h-full object-cover"
                />
                
                {/* Loading indicator */}
                {!stream && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                    <div className="text-white text-center">
                      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-2"></div>
                      <p className="text-sm">Starting camera...</p>
                    </div>
                  </div>
                )}
                
                {/* Camera Switcher - Only show on mobile with multiple cameras */}
                {isMobile && availableCameras >= 2 && (
                  <button
                    onClick={switchCamera}
                    className="absolute top-4 right-4 bg-white/90 hover:bg-white text-gray-800 p-3 rounded-full shadow-lg transition-all hover:scale-110 z-10"
                    aria-label="Switch camera"
                  >
                    <RefreshCw className="w-5 h-5" />
                  </button>
                )}
              </div>
              <div className="text-center space-y-2">
                <p className="text-sm text-gray-600">
                  Position your ticket in the frame and click "Capture Photo"
                </p>
                {isMobile && availableCameras >= 2 && (
                  <p className="text-xs text-gray-500 flex items-center justify-center gap-1">
                    <Info className="w-3 h-3" />
                    Using {cameraMode === 'environment' ? 'back' : 'front'} camera • Tap 
                    <RefreshCw className="w-3 h-3 inline" /> to switch
                  </p>
                )}
                {!isMobile && availableCameras === 1 && (
                  <p className="text-xs text-gray-500 flex items-center justify-center gap-1">
                    <Info className="w-3 h-3" />
                    Using front camera
                  </p>
                )}
              </div>
            </>
          )}
        </div>
        <canvas ref={canvasRef} className="hidden" />
      </Modal>

      {/* Permission Denied Modal */}
      <Modal
        isOpen={showPermissionModal}
        onClose={() => setShowPermissionModal(false)}
        title={
          <div className="flex items-center gap-1.5 sm:gap-2">
            <Camera className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-yellow-600 flex-shrink-0" />
            <span className="font-semibold text-yellow-800 text-sm sm:text-base md:text-lg">
              Camera Access Required
            </span>
          </div>
        }
        size="md"
        footer={
          <>
            <Button
              variant="outline"
              onClick={() => {
                setShowPermissionModal(false);
                setShowInstructionsModal(true);
              }}
            >
              <Info className="w-4 h-4 mr-2" />
              Show Instructions
            </Button>
            <Button onClick={() => setShowPermissionModal(false)}>
              Got it
            </Button>
          </>
        }
      >
        <div className="space-y-3 sm:space-y-4">
          <div className="flex items-center gap-2 sm:gap-3 p-3 sm:p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <AlertCircle className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-600 flex-shrink-0" />
            <div className="min-w-0 flex-1">
              <p className="font-semibold text-yellow-800 text-sm sm:text-base">
                Camera Permission Denied
              </p>
              <p className="text-xs sm:text-sm text-yellow-700">
                Please allow camera access to capture photos
              </p>
            </div>
          </div>

          <div className="space-y-2">
            <p className="text-xs sm:text-sm text-gray-700 font-medium">
              To use the camera feature, you need to:
            </p>
            <ol className="list-decimal list-inside space-y-1 text-xs sm:text-sm text-gray-600 ml-1 sm:ml-2">
              <li className="leading-relaxed">Allow camera permission in your browser</li>
              <li className="leading-relaxed">Make sure no other app is using the camera</li>
              <li className="leading-relaxed">Refresh the page and try again</li>
            </ol>
          </div>

          <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
            Click "Show Instructions" below for device-specific steps to enable camera access.
          </p>
        </div>
      </Modal>

      {/* Instructions Modal */}
      <Modal
        isOpen={showInstructionsModal}
        onClose={() => setShowInstructionsModal(false)}
        title="Enable Camera Access"
        size="lg"
      >
        <div className="space-y-4 sm:space-y-6">
          {getRelevantInstructions().length > 0 ? (
            getRelevantInstructions().map((instruction, idx) => (
              <div key={idx} className="border border-gray-200 rounded-lg p-3 sm:p-4">
                <div className="flex items-center gap-2 mb-3">
                  <div className="bg-primary-100 p-1.5 sm:p-2 rounded-lg flex-shrink-0">
                    <Camera className="w-4 h-4 sm:w-5 sm:h-5 text-primary-600" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="font-semibold text-gray-800 text-sm sm:text-base truncate">
                      {instruction.device} - {instruction.browser}
                    </h3>
                  </div>
                </div>

                <ol className="space-y-2">
                  {instruction.steps.map((step, stepIdx) => (
                    <li key={stepIdx} className="flex gap-2 sm:gap-3 text-xs sm:text-sm text-gray-700">
                      <span className="flex-shrink-0 w-5 h-5 sm:w-6 sm:h-6 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center font-semibold text-[10px] sm:text-xs">
                        {stepIdx + 1}
                      </span>
                      <span className="pt-0.5 leading-relaxed">{step}</span>
                    </li>
                  ))}
                </ol>
              </div>
            ))
          ) : (
            <div className="text-center py-6 sm:py-8">
              <Info className="w-10 h-10 sm:w-12 sm:h-12 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-600 text-xs sm:text-sm px-4">
                General instructions: Check your browser settings and allow camera access for this website.
              </p>
            </div>
          )}

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 sm:p-4">
            <p className="text-xs sm:text-sm text-blue-800 leading-relaxed">
              <strong>Note:</strong> After enabling camera access, refresh this page and try the camera feature again.
            </p>
          </div>
        </div>
      </Modal>
    </div>
  );
}

