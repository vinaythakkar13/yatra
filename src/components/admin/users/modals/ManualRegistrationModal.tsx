import React, { useState } from 'react';
import { X } from 'lucide-react';
import Modal from '@/components/ui/Modal';
import RegisterClient from '@/app/register/components/RegisterClient';
import RegistrationSuccessModal from './RegistrationSuccessModal';

interface ManualRegistrationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess?: () => void;
}

const ManualRegistrationModal: React.FC<ManualRegistrationModalProps> = ({
    isOpen,
    onClose,
    onSuccess,
}) => {
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [registrationData, setRegistrationData] = useState<any>(null);

    const handleRegistrationSuccess = (data: any) => {
        setRegistrationData(data);
        setShowSuccessModal(true);
    };

    const handleSuccessModalClose = () => {
        setShowSuccessModal(false);
        setRegistrationData(null);
        onClose();
        onSuccess?.();
    };

    const handleCancel = () => {
        onClose();
    };

    return (
        <>
            <Modal
                isOpen={isOpen && !showSuccessModal}
                onClose={handleCancel}
                title=""
                size="full"
                showHeader={false}
                className="p-0"
            >
                <div className="relative h-full">
                    {/* Close button */}
                    <button
                        onClick={handleCancel}
                        className="absolute top-4 right-4 z-50 p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-lg hover:bg-white transition-colors"
                    >
                        <X className="w-5 h-5 text-gray-600" />
                    </button>

                    {/* RegisterClient component */}
                    <div className="h-full overflow-y-auto">
                        <RegisterClient
                            isAdminMode={true}
                            onSuccess={handleRegistrationSuccess}
                            onCancel={handleCancel}
                        />
                    </div>
                </div>
            </Modal>

            <RegistrationSuccessModal
                isOpen={showSuccessModal}
                onClose={handleSuccessModalClose}
                registrationData={registrationData}
            />
        </>
    );
};

export default ManualRegistrationModal;