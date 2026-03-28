import React from 'react';
import { X, IndianRupee, AlertCircle } from 'lucide-react';
import Button from '@/components/ui/Button';

interface PaymentConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (amount: number, type: 'discount' | 'premium', comment: string) => void;
  hotelName: string;
  totalAmount: number;
  advancePaid: number;
  pendingAmount: number;
  isLoading?: boolean;
}

const PaymentConfirmationModal: React.FC<PaymentConfirmationModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  hotelName,
  totalAmount,
  advancePaid,
  pendingAmount,
  isLoading = false,
}) => {
  const [adjustment, setAdjustment] = React.useState<string>('');
  const [adjustmentType, setAdjustmentType] = React.useState<'premium' | 'discount'>('premium');
  const [remarks, setRemarks] = React.useState<string>('');

  if (!isOpen) return null;

  const adjValue = parseFloat(adjustment) || 0;
  const finalAdjustment = adjustmentType === 'premium' ? adjValue : -adjValue;
  const finalPending = pendingAmount + finalAdjustment;

  const isAdjustmentMade = adjValue !== 0;
  const isRemarksValid = !isAdjustmentMade || remarks.trim().length > 0;

  const handleConfirm = () => {
    if (!isRemarksValid) return;
    onConfirm(adjValue, adjustmentType, remarks.trim());
  };

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
        <div className="px-6 py-4 space-y-4">
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
          <div className="flex justify-between items-center py-2 border-b border-slate-100">
            <span className="text-sm text-slate-500 font-medium">Base Pending</span>
            <span className="font-bold text-slate-800">
              ₹{pendingAmount.toLocaleString('en-IN')}
            </span>
          </div>

          {/* Adjustment Section */}
          <div className="space-y-3 pt-2">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Adjustment (Extra Charge/Discount)
            </label>
            <div className="flex gap-2">
              <div className="flex rounded-lg overflow-hidden border border-slate-200">
                <button
                  onClick={() => setAdjustmentType('premium')}
                  className={`px-3 py-2 flex items-center justify-center transition-colors ${
                    adjustmentType === 'premium' ? 'bg-heritage-primary text-white' : 'bg-slate-100 text-slate-400 hover:bg-slate-200'
                  }`}
                >
                  +
                </button>
                <button
                  onClick={() => setAdjustmentType('discount')}
                  className={`px-3 py-2 flex items-center justify-center transition-colors ${
                    adjustmentType === 'discount' ? 'bg-heritage-maroon text-white' : 'bg-slate-100 text-slate-400 hover:bg-slate-200'
                  }`}
                >
                  -
                </button>
              </div>
              <div className="relative flex-1">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">₹</div>
                <input
                  type="number"
                  value={adjustment}
                  onChange={(e) => setAdjustment(e.target.value)}
                  placeholder="0"
                  className="w-full pl-7 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-heritage-primary/20 focus:border-heritage-primary outline-none transition-all font-bold"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Comment / Reason {isAdjustmentMade && <span className="text-heritage-maroon">*</span>}
                </label>
                {isAdjustmentMade && !remarks.trim() && (
                  <span className="text-[10px] text-heritage-maroon font-bold animate-pulse">Required for adjustment</span>
                )}
              </div>
              <input
                type="text"
                value={remarks}
                onChange={(e) => setRemarks(e.target.value)}
                placeholder="e.g. Unused 2 rooms saved 10000"
                className={`w-full px-4 py-2 bg-white border rounded-lg text-sm focus:ring-2 focus:ring-heritage-primary/20 focus:border-heritage-primary outline-none transition-all ${
                  isAdjustmentMade && !remarks.trim() ? 'border-heritage-maroon/50 ring-2 ring-heritage-maroon/5' : 'border-slate-200'
                }`}
              />
            </div>
          </div>

          <div className="flex justify-between items-center py-3 bg-slate-50 rounded-xl px-4 mt-2">
            <span className="text-sm text-slate-600 font-bold uppercase tracking-wider">
              Final Payment
            </span>
            <span className="text-xl font-black text-heritage-maroon">
              ₹{finalPending.toLocaleString('en-IN')}
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
            onClick={handleConfirm}
            disabled={isLoading || !isRemarksValid}
            className={`flex-1 py-3 bg-heritage-primary hover:bg-heritage-primary/90 text-white font-bold shadow-lg shadow-heritage-primary/20 transition-all ${
              !isRemarksValid ? 'opacity-50 grayscale cursor-not-allowed scale-[0.98]' : ''
            }`}
          >
            {isLoading ? (
              <>
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                Processing...
              </>
            ) : (
              'Confirm Paid'
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PaymentConfirmationModal;
