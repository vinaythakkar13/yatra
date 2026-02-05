import React from 'react';
import { CheckCircle, Copy, ExternalLink } from 'lucide-react';
import { BsWhatsapp } from 'react-icons/bs';
import Modal from '@/components/ui/Modal';
import Button from '@/components/ui/Button';
import AnimatedSuccessIcon from '@/components/ui/AnimatedSuccessIcon';
import { toast } from 'react-toastify';

interface RegistrationData {
    pnr: string;
    name: string;
    whatsappNumber: string;
    numberOfPersons: number;
    yatraName?: string;
    arrivalDate?: string;
    returnDate?: string;
    split_pnr: string;
}

interface RegistrationSuccessModalProps {
    isOpen: boolean;
    onClose: () => void;
    registrationData: RegistrationData | null;
}

const RegistrationSuccessModal: React.FC<RegistrationSuccessModalProps> = ({
    isOpen,
    onClose,
    registrationData,
}) => {
    if (!registrationData) return null;

    const handleCopyPnr = () => {
        navigator.clipboard.writeText(registrationData.split_pnr);
        toast.success('PNR copied to clipboard!');
    };

    const handleSendWhatsApp = () => {
        const message = formatWhatsAppMessage(registrationData);
        const whatsappUrl = `https://wa.me/91${registrationData.whatsappNumber}?text=${encodeURIComponent(message)}`;
        window.open(whatsappUrl, '_blank');
    };

    //     const formatWhatsAppMessage = (data: RegistrationData): string => {
    //         return `🙏 *Yatra Registration Confirmed* 🙏

    // ✅ *Your registration has been successfully processed!*

    // 📋 *Registration Details:*
    // 🎫 PNR Number: *${data.pnr}*
    // 👤 Primary Contact: ${data.name}
    // 👥 Total Persons: ${data.numberOfPersons}
    // ${data.yatraName ? `🏛️ Yatra: ${data.yatraName}\n` : ''}${data.arrivalDate ? `📅 Arrival Date: ${data.arrivalDate}\n` : ''}${data.returnDate ? `📅 Return Date: ${data.returnDate}\n` : ''}
    // 📱 *Important Instructions:*
    // • Keep this PNR number safe for future reference
    // • You will receive room allocation details soon
    // • Carry a valid ID proof during the yatra
    // • Follow all yatra guidelines and timings

    // 🔔 *Next Steps:*
    // • Wait for room allocation confirmation
    // • Check for further updates on this number
    // • Contact support if you have any queries

    // Thank you for registering with us! 🙏

    // _This is an automated message from Yatra Management System_`;
    //     };

    const formatWhatsAppMessage = (data: RegistrationData): string => {
        return `Hello ${data.name}, your registration for *${data.yatraName}* is successfully completed.

You can check your details using this PNR number: *${data.split_pnr}*.

Thank you.`;
    };


    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title=""
            size="md"
            showHeader={false}
            variant="admin"
            className="overflow-hidden"
        >
            <div className="relative">
                {/* Background decoration */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-heritage-primary/10 to-heritage-secondary/10 rounded-full -mr-16 -mt-16"></div>
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-heritage-gold/10 to-heritage-highlight/20 rounded-full -ml-12 -mb-12"></div>

                <div className="relative z-10 p-6 text-center">
                    {/* Success Animation */}
                    <div className="flex justify-center mb-6">
                        <div className="relative">
                            <AnimatedSuccessIcon size={120} loop={false} />
                        </div>
                    </div>

                    {/* Success Message */}
                    <div className="mb-6">
                        <h2 className="text-2xl font-bold text-heritage-textDark mb-2">
                            Registration Created Successfully!
                        </h2>
                        <p className="text-sm text-heritage-text leading-relaxed">
                            The registration has been created and assigned a PNR number.
                        </p>
                    </div>

                    {/* PNR Display Card */}
                    <div className="bg-gradient-to-br from-heritage-highlight/30 to-heritage-gold/20 rounded-xl p-5 mb-6 border border-heritage-gold/30 shadow-glass">
                        <p className="text-xs font-bold text-heritage-text/70 mb-2 uppercase tracking-widest">
                            Generated PNR Number
                        </p>
                        <div className="flex items-center justify-center gap-3 mb-4">
                            <div className="p-2 bg-heritage-primary/10 rounded-lg">
                                <CheckCircle className="w-5 h-5 text-heritage-primary" />
                            </div>
                            <p className="text-3xl font-bold text-heritage-textDark font-mono tracking-wider">
                                {registrationData.split_pnr}
                            </p>
                        </div>
                        <button
                            onClick={handleCopyPnr}
                            className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm border border-heritage-gold/30 rounded-lg hover:bg-white hover:border-heritage-primary/50 transition-all duration-200 group shadow-sm"
                        >
                            <Copy className="w-4 h-4 text-heritage-primary group-hover:scale-110 transition-transform" />
                            <span className="text-sm font-semibold text-heritage-textDark">Copy PNR</span>
                        </button>
                    </div>

                    {/* Registration Details */}
                    <div className="bg-white/50 backdrop-blur-sm rounded-xl p-4 mb-6 border border-heritage-gold/20">
                        <h3 className="text-sm font-bold text-heritage-textDark mb-3 uppercase tracking-wide">
                            Registration Details
                        </h3>
                        <div className="space-y-2 text-left">
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-heritage-text">Name:</span>
                                <span className="text-sm font-semibold text-heritage-textDark">{registrationData.name}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-heritage-text">Persons:</span>
                                <span className="text-sm font-semibold text-heritage-textDark">{registrationData.numberOfPersons}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-heritage-text">WhatsApp:</span>
                                <span className="text-sm font-semibold text-heritage-textDark">+91 {registrationData.whatsappNumber}</span>
                            </div>
                            {registrationData.yatraName && (
                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-heritage-text">Yatra:</span>
                                    <span className="text-sm font-semibold text-heritage-textDark">{registrationData.yatraName}</span>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col gap-3">
                        {/* WhatsApp Button */}
                        <Button
                            variant='success'
                            onClick={handleSendWhatsApp}
                            className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white shadow-lg hover:shadow-xl transition-all duration-200 py-3"
                        >
                            <div className="flex items-center justify-center gap-3">
                                <div className="p-1 bg-white/20 rounded-full">
                                    <BsWhatsapp className="w-5 h-5" />
                                </div>
                                <span className="font-semibold">Send Ticket on WhatsApp</span>
                                {/* <ExternalLink className="w-4 h-4" /> */}
                            </div>
                        </Button>

                        {/* Close Button */}
                        <Button
                            onClick={onClose}
                            variant="outline"
                            className="w-full border-heritage-gold/30 text-heritage-textDark hover:bg-heritage-highlight/30 hover:border-heritage-primary/50 py-2.5"
                        >
                            Close
                        </Button>
                    </div>


                </div>
            </div>
        </Modal>
    );
};

export default RegistrationSuccessModal;