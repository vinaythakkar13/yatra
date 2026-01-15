import React from 'react';
import { ChevronLeft, ChevronRight, XCircle, CheckCircle, FileText } from 'lucide-react';
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
    const handlePrevDocument = () => {
        setCurrentDocumentIndex(currentDocumentIndex > 0 ? currentDocumentIndex - 1 : currentDocumentIndex);
    };

    const handleNextDocument = () => {
        setCurrentDocumentIndex(
            currentDocumentIndex < currentDocuments.length - 1 ? currentDocumentIndex + 1 : currentDocumentIndex
        );
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
                    <div className="relative bg-black rounded-xl overflow-hidden" style={{ minHeight: '500px' }}>
                        <img
                            src={currentDocuments[currentDocumentIndex]}
                            alt={`Document ${currentDocumentIndex + 1}`}
                            className="w-full h-auto max-h-[600px] object-contain"
                            onError={(e) => {
                                (e.target as HTMLImageElement).src =
                                    'https://via.placeholder.com/800x600?text=Image+Not+Found';
                            }}
                        />

                        {/* Navigation Arrows */}
                        {currentDocuments.length > 1 && (
                            <>
                                <button
                                    onClick={handlePrevDocument}
                                    disabled={currentDocumentIndex === 0}
                                    className={`absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/70 text-white transition-all ${currentDocumentIndex === 0
                                            ? 'opacity-30 cursor-not-allowed'
                                            : 'hover:bg-black/90 hover:scale-110'
                                        }`}
                                >
                                    <ChevronLeft className="w-6 h-6" />
                                </button>
                                <button
                                    onClick={handleNextDocument}
                                    disabled={currentDocumentIndex === currentDocuments.length - 1}
                                    className={`absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/70 text-white transition-all ${currentDocumentIndex === currentDocuments.length - 1
                                            ? 'opacity-30 cursor-not-allowed'
                                            : 'hover:bg-black/90 hover:scale-110'
                                        }`}
                                >
                                    <ChevronRight className="w-6 h-6" />
                                </button>
                            </>
                        )}

                        {/* Document Counter */}
                        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/80 text-white px-4 py-2 rounded-full text-sm font-semibold">
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
