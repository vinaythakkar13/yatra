import React from 'react';
import { X, IndianRupee, AlertCircle } from 'lucide-react';
import Button from '@/components/ui/Button';

interface PaymentConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  hotelName: string;
  totalAmount: number;
  advancePaid: number;
  pendingAmount: number;
}

const PaymentConfirmationModal: React.FC<PaymentConfirmationModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  hotelName,
  totalAmount,
  advancePaid,
  pendingAmount,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 font-inter">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-fade-in scale-100 transition-all border border-heritage-text/10">
        {/* Header */}
        <div className="bg-heritage-primary px-6 py-5 flex items-center justify-between text-white">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/10 rounded-xl backdrop-blur-md">
              <IndianRupee className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-lg leading-tight text-white">Payment Confirmation</h3>
              <p className="text-white/70 text-xs mt-0.5 font-medium">{hotelName}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-white/10 rounded-lg transition-colors text-white/80 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Info Banner */}
        <div className="bg-blue-50 border-b border-blue-100 px-6 py-3 flex items-start gap-3">
          <AlertCircle className="w-4 h-4 text-blue-500 mt-0.5" />
          <p className="text-blue-700 text-xs font-medium leading-relaxed">
            Please verify the payment details below before marking as paid.
          </p>
        </div>

        {/* Content */}
        <div className="px-6 py-6 space-y-4">
          <div className="flex justify-between items-center py-2 border-b border-slate-100">
            <span className="text-sm text-slate-500 font-medium">Total Amount</span>
            <span className="font-bold text-slate-800">
              ₹{totalAmount.toLocaleString('en-IN')}
            </span>
          </div>
          <div className="flex justify-between items-center py-2 border-b border-slate-100">
            <span className="text-sm text-slate-500 font-medium">Advance Paid</span>
            <span className="font-bold text-green-600">
              ₹{advancePaid.toLocaleString('en-IN')}
            </span>
          </div>
          <div className="flex justify-between items-center py-3 bg-slate-50 rounded-xl px-4">
            <span className="text-sm text-slate-600 font-bold uppercase tracking-wider">
              Pending Amount
            </span>
            <span className="text-xl font-black text-heritage-maroon">
              ₹{pendingAmount.toLocaleString('en-IN')}
            </span>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="px-6 pb-6 pt-2 flex items-center gap-3">
          <Button
            onClick={onClose}
            variant="outline"
            className="flex-1 py-3 border-slate-200 text-slate-600 hover:bg-slate-50 font-bold"
          >
            Cancel
          </Button>
          <Button
            onClick={onConfirm}
            className="flex-1 py-3 bg-heritage-primary hover:bg-heritage-primary/90 text-white font-bold shadow-lg shadow-heritage-primary/20"
          >
            Confirm Paid
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PaymentConfirmationModal;
