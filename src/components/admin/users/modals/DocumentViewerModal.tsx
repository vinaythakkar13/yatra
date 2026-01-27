import React, { useState, useRef, useEffect } from 'react';
import {
    ChevronLeft, ChevronRight, XCircle, CheckCircle,
    FileText, ZoomIn, ZoomOut, RotateCcw, Move
} from 'lucide-react';
import Modal from '@/components/ui/Modal';
import Button from '@/components/ui/Button';

interface DocumentViewerModalProps {
    isOpen: boolean;
    onClose: () => void;
    documentOwner: any;
    currentDocuments: string[];
    currentDocumentIndex: number;
    setCurrentDocumentIndex: (index: number) => void;
    onApprove: () => void;
    onReject: () => void;
}

const DocumentViewerModal: React.FC<DocumentViewerModalProps> = ({
    isOpen,
    onClose,
    documentOwner,
    currentDocuments,
    currentDocumentIndex,
    setCurrentDocumentIndex,
    onApprove,
    onReject,
}) => {
    // Zoom and Pan State
    const [scale, setScale] = useState<number>(1);
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [isDragging, setIsDragging] = useState(false);
    const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
    const containerRef = useRef<HTMLDivElement>(null);

    // Reset zoom when switching documents
    useEffect(() => {
        handleResetZoom();
    }, [currentDocumentIndex]);

    const handlePrevDocument = () => {
        setCurrentDocumentIndex(currentDocumentIndex > 0 ? currentDocumentIndex - 1 : currentDocumentIndex);
    };

    const handleNextDocument = () => {
        setCurrentDocumentIndex(
            currentDocumentIndex < currentDocuments.length - 1 ? currentDocumentIndex + 1 : currentDocumentIndex
        );
    };

    const handleZoomIn = () => setScale(prev => Math.min(prev + 0.25, 3));
    const handleZoomOut = () => {
        setScale((prev) => {
            const newScale = Math.max(prev - 0.25, 1);

            if (newScale === 1) {
                setPosition({ x: 0, y: 0 });
            }

            return newScale;
        });
    };

    const handleResetZoom = () => {
        setScale(1);
        setPosition({ x: 0, y: 0 });
    };

    const handleMouseDown = (e: React.MouseEvent) => {
        if (scale > 1) {
            setIsDragging(true);
            setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y });
        }
    };

    const handleMouseMove = (e: React.MouseEvent) => {
        if (isDragging && scale > 1) {
            setPosition({
                x: e.clientX - dragStart.x,
                y: e.clientY - dragStart.y
            });
        }
    };

    const handleMouseUp = () => {
        setIsDragging(false);
    };

    const title = documentOwner ? (
        <div className="flex items-center justify-between w-full pr-8">
            <div>
                <span className="text-gray-900">Documents - {documentOwner.name}</span>
                <span className="text-sm text-gray-500 ml-2">(PNR: {documentOwner.pnr})</span>
            </div>
            {documentOwner.documentStatus && (
                <span
                    className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${documentOwner.documentStatus === 'approved'
                        ? 'bg-green-100 text-green-700 border border-green-300'
                        : documentOwner.documentStatus === 'rejected'
                            ? 'bg-red-100 text-red-700 border border-red-300'
                            : 'bg-yellow-100 text-yellow-700 border border-yellow-300'
                        }`}
                >
                    {documentOwner.documentStatus === 'approved' ? (
                        <>
                            <CheckCircle className="w-3.5 h-3.5" />
                            Approved
                        </>
                    ) : documentOwner.documentStatus === 'rejected' ? (
                        <>
                            <XCircle className="w-3.5 h-3.5" />
                            Rejected
                        </>
                    ) : (
                        <>
                            <FileText className="w-3.5 h-3.5" />
                            Pending Review
                        </>
                    )}
                </span>
            )}
        </div>
    ) : (
        'Documents'
    );

    const footer = documentOwner?.documentStatus === 'pending' && (
        <div className="flex justify-end gap-2 w-full">
            <Button
                onClick={onReject}
                variant="outline"
                className="flex items-center gap-2 border-red-300 text-red-600 hover:bg-red-50"
            >
                <XCircle className="w-4 h-4" />
                Reject
            </Button>
            <Button
                onClick={onApprove}
                variant="outline"
                className="flex items-center gap-2 border-green-300 text-green-600 hover:bg-green-50"
            >
                <CheckCircle className="w-4 h-4" />
                Approve
            </Button>
        </div>
    );

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={title} size="xl" variant="admin" footer={footer}>
            {currentDocuments.length > 0 && (
                <div className="space-y-4">
                    {/* Rejection Reason Display (if rejected) */}
                    {documentOwner?.documentStatus === 'rejected' && documentOwner?.rejectionReason && (
                        <div className="bg-red-50 border-2 border-red-300 rounded-lg p-4">
                            <div className="flex items-start gap-3">
                                <div className="bg-red-100 p-2 rounded-lg flex-shrink-0">
                                    <XCircle className="w-5 h-5 text-red-600" />
                                </div>
                                <div className="flex-1">
                                    <p className="text-sm font-bold text-red-800 mb-1">Rejection Reason</p>
                                    <p className="text-sm text-red-700">{documentOwner.rejectionReason}</p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Image Viewer */}
                    <div
                        ref={containerRef}
                        className={`relative bg-black rounded-xl overflow-hidden select-none ${scale > 1 ? 'cursor-grab active:cursor-grabbing' : 'cursor-default'}`}
                        style={{ minHeight: '500px' }}
                        onMouseDown={handleMouseDown}
                        onMouseMove={handleMouseMove}
                        onMouseUp={handleMouseUp}
                        onMouseLeave={handleMouseUp}
                    >
                        <div
                            className="w-full h-full flex items-center justify-center transition-transform duration-200"
                            style={{
                                transform: `scale(${scale}) translate(${position.x / scale}px, ${position.y / scale}px)`,
                            }}
                        >
                            <img
                                src={currentDocuments[currentDocumentIndex]}
                                alt={`Document ${currentDocumentIndex + 1}`}
                                className="max-w-full max-h-[600px] object-contain"
                                draggable={false}
                                onError={(e) => {
                                    (e.target as HTMLImageElement).src =
                                        'https://via.placeholder.com/800x600?text=Image+Not+Found';
                                }}
                            />
                        </div>

                        {/* Zoom Controls Overlay */}
                        <div className="absolute top-4 right-4 flex flex-col gap-2 z-10">
                            <button
                                onClick={handleZoomIn}
                                className="p-2 bg-black/60 hover:bg-black/80 text-white rounded-lg backdrop-blur-sm transition-all border border-white/20"
                                title="Zoom In"
                            >
                                <ZoomIn className="w-5 h-5" />
                            </button>
                            <button
                                onClick={handleZoomOut}
                                className="p-2 bg-black/60 hover:bg-black/80 text-white rounded-lg backdrop-blur-sm transition-all border border-white/20"
                                title="Zoom Out"
                            >
                                <ZoomOut className="w-5 h-5" />
                            </button>
                            <button
                                onClick={handleResetZoom}
                                className="p-2 bg-black/60 hover:bg-black/80 text-white rounded-lg backdrop-blur-sm transition-all border border-white/20"
                                title="Reset Zoom"
                            >
                                <RotateCcw className="w-5 h-5" />
                            </button>
                            {scale > 1 && (
                                <div
                                    className="p-2 bg-heritage-primary/90 text-white rounded-lg backdrop-blur-sm border border-heritage-gold/30 animate-pulse"
                                    title="You can drag to pan"
                                >
                                    <Move className="w-5 h-5" />
                                </div>
                            )}
                        </div>

                        {/* Navigation Arrows */}
                        {currentDocuments.length > 1 && (
                            <>
                                <button
                                    onClick={handlePrevDocument}
                                    disabled={currentDocumentIndex === 0}
                                    className={`absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/70 text-white transition-all z-10 ${currentDocumentIndex === 0
                                        ? 'opacity-30 cursor-not-allowed'
                                        : 'hover:bg-black/90 hover:scale-110'
                                        }`}
                                >
                                    <ChevronLeft className="w-6 h-6" />
                                </button>
                                <button
                                    onClick={handleNextDocument}
                                    disabled={currentDocumentIndex === currentDocuments.length - 1}
                                    className={`absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/70 text-white transition-all z-10 ${currentDocumentIndex === currentDocuments.length - 1
                                        ? 'opacity-30 cursor-not-allowed'
                                        : 'hover:bg-black/90 hover:scale-110'
                                        }`}
                                >
                                    <ChevronRight className="w-6 h-6" />
                                </button>
                            </>
                        )}

                        {/* Document Counter */}
                        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/80 text-white px-4 py-2 rounded-full text-sm font-semibold z-10">
                            {currentDocumentIndex + 1} / {currentDocuments.length}
                        </div>
                    </div>

                    {/* Thumbnail Strip */}
                    {currentDocuments.length > 1 && (
                        <div className="flex gap-2 overflow-x-auto pb-2">
                            {currentDocuments.map((doc, index) => (
                                <button
                                    key={index}
                                    onClick={() => setCurrentDocumentIndex(index)}
                                    className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${index === currentDocumentIndex
                                        ? 'border-heritage-primary ring-2 ring-heritage-highlight'
                                        : 'border-gray-300 hover:border-heritage-highlight'
                                        }`}
                                >
                                    <img
                                        src={doc}
                                        alt={`Thumbnail ${index + 1}`}
                                        className="w-full h-full object-cover"
                                    />
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </Modal>
    );
};

export default DocumentViewerModal;
