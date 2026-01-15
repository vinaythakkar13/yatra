import React from 'react';
import { XCircle, CheckCircle } from 'lucide-react';
import Modal from '@/components/ui/Modal';
import Button from '@/components/ui/Button';

interface RejectDocumentModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    rejectionReason: string;
    setRejectionReason: (reason: string) => void;
}

const RejectDocumentModal: React.FC<RejectDocumentModalProps> = ({
    isOpen,
    onClose,
    onConfirm,
    rejectionReason,
    setRejectionReason,
}) => {
    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title="Reject Document"
            size="md"
            variant="admin"
            footer={
                <>
                    <Button variant="outline" onClick={onClose}>
                        Cancel
                    </Button>
                    <Button onClick={onConfirm} variant="danger" disabled={!rejectionReason.trim()}>
                        <XCircle className="w-4 h-4 mr-2" />
                        Reject Document
                    </Button>
                </>
            }
        >
            <div className="space-y-4">
                {/* Warning */}
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                        <div className="bg-red-100 p-2 rounded-lg">
                            <XCircle className="w-5 h-5 text-red-600" />
                        </div>
                        <div>
                            <h4 className="font-semibold text-red-900">Document Rejection</h4>
                            <p className="text-sm text-red-700 mt-1">
                                Please provide a clear reason for rejecting this document. The user will be notified
                                and can reupload corrected documents.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Rejection Reason Input */}
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Rejection Reason <span className="text-red-500">*</span>
                    </label>
                    <textarea
                        value={rejectionReason}
                        onChange={(e) => setRejectionReason(e.target.value)}
                        placeholder="e.g., Image is blurry, PNR number is not visible, wrong document uploaded..."
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all resize-none"
                        rows={4}
                    />
                    {!rejectionReason.trim() && (
                        <p className="mt-1 text-xs text-gray-500">
                            Please provide a detailed reason to help the user understand the issue
                        </p>
                    )}
                    {rejectionReason.trim() && (
                        <p className="mt-1 text-xs text-green-600 flex items-center gap-1">
                            <CheckCircle className="w-3 h-3" />
                            Reason provided ({rejectionReason.trim().length} characters)
                        </p>
                    )}
                </div>
            </div>
        </Modal>
    );
};

export default RejectDocumentModal;
