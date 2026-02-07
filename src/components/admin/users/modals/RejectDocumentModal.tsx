import React from 'react';
import { XCircle, AlertCircle, Trash2, Image as ImageIcon, FileWarning, Check } from 'lucide-react';
import Modal from '@/components/ui/Modal';
import Button from '@/components/ui/Button';

interface RejectDocumentModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    rejectionReason: string;
    setRejectionReason: (reason: string) => void;
    isLoading?: boolean;
}

const REJECTION_OPTIONS = [
    {
        id: 'blurry',
        label: 'Image is blurry or unreadable',
        description: 'The uploaded image is not clear enough to verify details.',
        icon: <ImageIcon className="w-5 h-5" />,
    },
    {
        id: 'incorrect',
        label: 'Incorrect document uploaded',
        description: 'The document provided is not the required ticket or identity proof.',
        icon: <Trash2 className="w-5 h-5" />,
    },
    {
        id: 'mismatch',
        label: 'PNR / Details mismatch',
        description: 'The PNR number or names on the ticket do not match the registration.',
        icon: <FileWarning className="w-5 h-5" />,
    }
];

const RejectDocumentModal: React.FC<RejectDocumentModalProps> = ({
    isOpen,
    onClose,
    onConfirm,
    rejectionReason,
    setRejectionReason,
    isLoading = false,
}) => {
    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title="Reject Document"
            size="md"
            variant="admin"
            footer={
                <div className="flex gap-3 w-full">
                    <Button
                        variant="admin-outline"
                        onClick={onClose}
                        className="flex-1 rounded-xl py-3 font-bold border-heritage-gold/30 text-heritage-text hover:bg-heritage-highlight/30"
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={onConfirm}
                        variant="admin"
                        disabled={!rejectionReason || isLoading}
                        isLoading={isLoading}
                        className="flex-1 bg-heritage-maroon hover:bg-heritage-maroon/90 text-white rounded-xl py-3 font-bold shadow-lg shadow-heritage-maroon/20"
                    >
                        <Check className="w-4 h-4 mr-2" />
                        {isLoading ? 'Processing...' : 'Confirm Rejection'}
                    </Button>
                </div>
            }
        >
            <div className="space-y-5">
                {/* Reason Selection Group */}
                <div className="space-y-2.5">
                    <div className="flex items-center justify-between px-1">
                        <label className="text-xs font-bold text-heritage-maroon/60 uppercase tracking-widest">
                            Selection Reason
                        </label>
                        <span className="text-[10px] font-bold text-heritage-primary bg-heritage-primary/10 px-2 py-0.5 rounded-full">
                            Required
                        </span>
                    </div>

                    <div className="grid gap-2.5">
                        {REJECTION_OPTIONS.map((option) => (
                            <button
                                key={option.id}
                                onClick={() => setRejectionReason(option.label)}
                                className={`flex items-start gap-4 p-4 rounded-2xl border-2 text-left transition-all duration-300 group ${rejectionReason === option.label
                                    ? 'border-heritage-primary bg-white shadow-md ring-4 ring-heritage-primary/5'
                                    : 'border-heritage-gold/10 bg-heritage-highlight/5 hover:border-heritage-primary/30 hover:bg-white hover:shadow-sm'
                                    }`}
                            >
                                <div className={`p-2.5 rounded-xl transition-all duration-300 ${rejectionReason === option.label
                                    ? 'bg-heritage-primary text-white shadow-inner scale-110'
                                    : 'bg-white text-heritage-gold group-hover:text-heritage-primary group-hover:bg-heritage-highlight/40'
                                    }`}>
                                    {option.icon}
                                </div>
                                <div className="flex-1 min-w-0 pr-2">
                                    <h5 className={`font-bold text-sm transition-colors ${rejectionReason === option.label ? 'text-heritage-textDark' : 'text-heritage-text'
                                        }`}>
                                        {option.label}
                                    </h5>
                                    <p className={`text-[12px] mt-0.5 line-clamp-1 transition-colors ${rejectionReason === option.label ? 'text-heritage-text' : 'text-heritage-text/60'
                                        }`}>
                                        {option.description}
                                    </p>
                                </div>
                                <div className={`mt-1.5 h-6 w-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all duration-300 ${rejectionReason === option.label
                                    ? 'border-heritage-primary bg-heritage-primary'
                                    : 'border-heritage-gold/20 group-hover:border-heritage-primary/30'
                                    }`}>
                                    {rejectionReason === option.label && (
                                        <Check className="h-3.5 w-3.5 text-white stroke-[3px]" />
                                    )}
                                </div>
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </Modal>
    );
};

export default RejectDocumentModal;
