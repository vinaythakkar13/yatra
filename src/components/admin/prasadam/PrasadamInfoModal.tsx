import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Gift, Users, CreditCard, Sparkles, CheckCircle2 } from 'lucide-react';
import Button from '@/components/ui/Button';

interface PrasadamInfoModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: {
    pnr: string;
    persons: number;
    [key: string]: any;
  } | null;
}

const PrasadamInfoModal: React.FC<PrasadamInfoModalProps> = ({ isOpen, onClose, data }) => {
  if (!isOpen || !data) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          onClick={onClose}
        />

        {/* Modal Outer Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="relative bg-white rounded-[2rem] shadow-2xl w-full max-w-md overflow-hidden border border-heritage-text/10"
        >
          {/* Success Banner */}
          <div className="bg-green-500 py-3 px-6 flex items-center justify-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-white" />
            <span className="text-white text-xs font-bold uppercase tracking-[0.2em]">QR Successfully Scanned</span>
          </div>

          {/* Header - Ornate Admin Theme */}
          <div className="bg-heritage-maroon px-8 py-8 relative overflow-hidden text-center">
            {/* Decorative background elements */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16 blur-2xl" />
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-heritage-gold/10 rounded-full -ml-12 -mb-12 blur-xl" />
            
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors z-20"
            >
              <X className="w-4 h-4 text-white/80" />
            </button>

            <div className="flex flex-col items-center relative z-10">
              <div className="w-16 h-16 rounded-2xl bg-white/10 flex items-center justify-center backdrop-blur-md mb-4 border border-white/20">
                <Gift className="w-8 h-8 text-heritage-gold" />
              </div>
              <h3 className="text-2xl font-black text-white leading-tight mb-1">Prasadam Details</h3>
              <div className="flex items-center gap-2 text-heritage-gold/80 italic text-sm">
                <Sparkles className="w-3 h-3" />
                <span>Divine Offering Pass</span>
                <Sparkles className="w-3 h-3" />
              </div>
            </div>
          </div>

          {/* Information Section */}
          <div className="px-8 py-8 space-y-6 bg-heritage-bgMain/30">
            {/* PNR Information */}
            <div className="bg-white border border-heritage-highlight rounded-[1.5rem] p-5 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-heritage-maroon/5 flex items-center justify-center">
                  <CreditCard className="w-6 h-6 text-heritage-maroon" />
                </div>
                <div>
                  <p className="text-[10px] font-black text-heritage-text/40 uppercase tracking-widest leading-none mb-1.5">Pass PNR</p>
                  <p className="text-2xl font-black text-heritage-textDark tracking-wider uppercase">{data.pnr}</p>
                </div>
              </div>
            </div>

            {/* Guests Information */}
            <div className="bg-white border border-heritage-highlight rounded-[1.5rem] p-5 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-heritage-primary/5 flex items-center justify-center">
                  <Users className="w-6 h-6 text-heritage-primary" />
                </div>
                <div>
                  <p className="text-[10px] font-black text-heritage-text/40 uppercase tracking-widest leading-none mb-1.5">Total Guests</p>
                  <p className="text-2xl font-black text-heritage-textDark tracking-tight">
                    {data.persons} <span className="text-sm font-bold text-heritage-text/40 ml-1">Persons</span>
                  </p>
                </div>
              </div>
            </div>

            {/* Verification Success Text */}
            <div className="text-center pt-2">
              <p className="text-[10px] font-bold text-green-600 uppercase tracking-[0.1em] flex items-center justify-center gap-1.5">
                <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                Authorized for Prasadam Distribution
              </p>
            </div>
          </div>

          {/* Action Button */}
          <div className="px-8 pb-8 pt-2">
            <Button
              onClick={onClose}
              className="w-full py-4 text-base font-black uppercase tracking-[0.2em] bg-heritage-maroon hover:bg-heritage-textDark text-white shadow-[0_10px_30px_rgba(131,25,35,0.3)] transition-all hover:-translate-y-0.5"
            >
              Close and Continue
            </Button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>

  );
};

export default PrasadamInfoModal;
