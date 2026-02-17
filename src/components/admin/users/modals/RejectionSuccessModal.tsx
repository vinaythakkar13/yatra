import React from 'react';
import { CheckCircle2, MessageSquare, Phone, User, Hash, AlertTriangle, ArrowRight } from 'lucide-react';
import Modal from '@/components/ui/Modal';
import Button from '@/components/ui/Button';
import { BsWhatsapp } from 'react-icons/bs';

interface RejectionSuccessModalProps {
    isOpen: boolean;
    onClose: () => void;
    registration: {
        pnr: string;
        name: string;
        contactNumber: string;
    };
    reason: string;
}

const RejectionSuccessModal: React.FC<RejectionSuccessModalProps> = ({
    isOpen,
    onClose,
    registration,
    reason,
}) => {
    const handleSendWhatsApp = () => {
        const message = `Namaste ${registration.name}, your document for PNR: ${registration.pnr} has been rejected due to: ${reason}. Please re-register with correct details at your earliest convenience. \n\n SEWA ME: ADI AMMA GROUP, ULHASNAGAR 3.`;
        const whatsappUrl = `https://wa.me/${registration.contactNumber.replace(/\D/g, '')}?text=${encodeURIComponent(message)}`;
        window.open(whatsappUrl, '_blank');
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            size="md"
            variant="admin"
            showHeader={false}
        >
            <div className="space-y-6 py-2">
                {/* Success Animation/Icon */}
                <div className="flex flex-col items-center justify-center text-center space-y-3">
                    <div className="bg-green-50 p-4 rounded-full ring-8 ring-green-50 mb-2 shadow-inner">
                        <CheckCircle2 className="w-12 h-12 text-green-600" />
                    </div>
                    <div>
                        <h3 className="text-xl font-bold text-heritage-textDark">Document Rejected</h3>
                        <p className="text-sm text-heritage-text/70 max-w-[280px] mx-auto mt-1">
                            The document has been marked as rejected and the system has been updated.
                        </p>
                    </div>
                </div>

                {/* Details Card - Heritage Style */}
                <div className="bg-heritage-highlight/20 border border-heritage-maroon/10 rounded-2xl overflow-hidden shadow-sm">
                    <div className="bg-heritage-highlight/30 px-5 py-2.5 border-b border-heritage-gold/20 flex items-center justify-between">
                        <span className="text-[11px] font-bold text-heritage-maroon uppercase tracking-wider">Registration Details</span>
                        <div className="flex gap-1.5">
                            <div className="w-1.5 h-1.5 rounded-full bg-heritage-primary" />
                            <div className="w-1.5 h-1.5 rounded-full bg-heritage-primary/40" />
                        </div>
                    </div>

                    <div className="p-5 space-y-5">
                        <div className="grid grid-cols-2 gap-6">
                            <div className="space-y-1">
                                <div className="flex items-center gap-1.5 text-heritage-text/60">
                                    <Hash className="w-3.5 h-3.5" />
                                    <span className="text-[10px] font-bold uppercase tracking-wide">PNR Number</span>
                                </div>
                                <p className="font-mono font-bold text-heritage-maroon text-lg tracking-tight">
                                    {registration.pnr}
                                </p>
                            </div>
                            <div className="space-y-1 text-right">
                                <div className="flex items-center gap-1.5 text-heritage-text/60 justify-end">
                                    <User className="w-3.5 h-3.5" />
                                    <span className="text-[10px] font-bold uppercase tracking-wide">Full Name</span>
                                </div>
                                <p className="font-bold text-heritage-textDark truncate text-sm">
                                    {registration.name}
                                </p>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-6 pt-4 border-t border-dashed border-heritage-gold/20">
                            <div className="space-y-1">
                                <div className="flex items-center gap-1.5 text-heritage-text/60">
                                    <Phone className="w-3.5 h-3.5" />
                                    <span className="text-[10px] font-bold uppercase tracking-wide">Mobile</span>
                                </div>
                                <p className="font-bold text-heritage-textDark text-sm tracking-wide">
                                    {registration.contactNumber}
                                </p>
                            </div>
                            <div className="space-y-1 text-right">
                                <div className="flex items-center gap-1.5 text-heritage-text/60 justify-end">
                                    <AlertTriangle className="w-3.5 h-3.5 text-heritage-primary" />
                                    <span className="text-[10px] font-bold uppercase tracking-wide">Reason</span>
                                </div>
                                <p className="font-bold text-heritage-maroon text-sm leading-tight">
                                    {reason}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Action Section */}
                <div className="space-y-3 pt-2">
                    <Button
                        variant="success"
                        onClick={handleSendWhatsApp}
                        className="w-full bg-[#25D366] hover:bg-[#20ba5a] text-white border-none shadow-lg shadow-green-500/20 py-4 rounded-xl flex items-center justify-center gap-3 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
                    >
                        <BsWhatsapp className="w-5 h-5 fill-white" />
                        <span className="text-base font-bold">Send Rejection on WhatsApp</span>
                    </Button>

                    <Button
                        variant="admin-outline"
                        onClick={onClose}
                        className="w-full border-heritage-gold/30 text-heritage-text hover:bg-heritage-highlight/30 hover:text-heritage-maroon py-3 rounded-xl font-bold group"
                    >
                        Done & Refresh
                        <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
                    </Button>
                </div>

                <p className="text-[10px] text-heritage-text/40 text-center px-4 leading-relaxed font-medium italic">
                    This action will notify the user to re-register. WhatsApp opens in a new tab.
                </p>
            </div>
        </Modal>
    );
};

export default RejectionSuccessModal;
