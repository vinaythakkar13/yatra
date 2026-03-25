import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import Button from '@/components/ui/Button';

interface PrasadamInfoModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: {
    pnr: string;
    persons: number;
    name?: string;
    [key: string]: any;
  } | null;
}

/* ─── Animated Check with ripples + sparkles ─── */
const AnimatedCheck = () => {
  const sparks = [
    { angle: 30, dist: 54, delay: 0.70, color: '#c5a059', size: 5 },
    { angle: 100, dist: 50, delay: 0.82, color: '#6a9e8a', size: 4 },
    { angle: 175, dist: 52, delay: 0.76, color: '#e8c87a', size: 5 },
    { angle: 250, dist: 48, delay: 0.88, color: '#6a9e8a', size: 3.5 },
    { angle: 325, dist: 54, delay: 0.79, color: '#c5a059', size: 4 },
    { angle: 60, dist: 46, delay: 0.93, color: '#e8c87a', size: 3.5 },
  ];

  return (
    <div style={{ position: 'relative', width: 96, height: 96, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      {/* Ripple rings */}
      {[0, 1, 2].map(i => (
        <motion.div
          key={i}
          style={{
            position: 'absolute',
            width: 80, height: 80,
            borderRadius: '50%',
            border: '1.5px solid rgba(106,158,138,0.55)',
          }}
          initial={{ scale: 0.85, opacity: 0.7 }}
          animate={{ scale: 2.6, opacity: 0 }}
          transition={{
            delay: 0.55 + i * 0.28,
            duration: 1.3,
            repeat: Infinity,
            repeatDelay: 0.5,
            ease: 'easeOut',
          }}
        />
      ))}

      {/* Soft glow */}
      <motion.div
        style={{
          position: 'absolute',
          width: 96, height: 96,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(106,158,138,0.22) 0%, transparent 70%)',
        }}
        initial={{ scale: 0.6, opacity: 0 }}
        animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
        transition={{ delay: 0.3, duration: 2.8, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* Circle */}
      <motion.div
        style={{
          position: 'relative',
          zIndex: 2,
          width: 80, height: 80,
          borderRadius: '50%',
          background: 'linear-gradient(145deg, #eaf6f1 0%, #d2ece4 100%)',
          boxShadow: '0 0 0 5px rgba(106,158,138,0.14), 0 10px 36px rgba(61,138,114,0.22)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}
        initial={{ scale: 0, rotate: -30 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ delay: 0.12, type: 'spring', damping: 13, stiffness: 270 }}
      >
        <svg width="38" height="38" viewBox="0 0 38 38" fill="none">
          <motion.path
            d="M8 19 L15.5 27 L30 11"
            stroke="#2d7a62"
            strokeWidth="3.4"
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ delay: 0.42, duration: 0.52, ease: 'easeOut' }}
          />
        </svg>
      </motion.div>

      {/* Sparkle particles */}
      {sparks.map(({ angle, dist, delay, color, size }, i) => {
        const rad = (angle * Math.PI) / 180;
        const x = Math.cos(rad) * dist;
        const y = Math.sin(rad) * dist;
        return (
          <motion.div
            key={i}
            style={{
              position: 'absolute',
              width: size, height: size,
              borderRadius: '50%',
              background: color,
              left: '50%', top: '50%',
              marginLeft: -size / 2, marginTop: -size / 2,
            }}
            initial={{ x: 0, y: 0, scale: 0, opacity: 0 }}
            animate={{ x: [0, x * 0.5, x], y: [0, y * 0.5, y], scale: [0, 1.6, 0], opacity: [0, 1, 0] }}
            transition={{ delay, duration: 0.65, ease: 'easeOut' }}
          />
        );
      })}
    </div>
  );
};

/* ─── Main Modal ─── */
const PrasadamInfoModal: React.FC<PrasadamInfoModalProps> = ({ isOpen, onClose, data }) => {
  useEffect(() => {
    if (isOpen) {
      const sy = window.scrollY;
      document.body.style.cssText = `position:fixed;top:-${sy}px;left:0;right:0;overflow-y:scroll`;
    } else {
      const sy = document.body.style.top;
      document.body.style.cssText = '';
      window.scrollTo(0, parseInt(sy || '0') * -1);
    }
    return () => { document.body.style.cssText = ''; };
  }, [isOpen]);

  if (!isOpen || !data) return null;

  return (
    <AnimatePresence>
      <div style={{ position: 'fixed', inset: 0, zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}>

        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          onClick={onClose}
          style={{
            position: 'absolute', inset: 0,
            background: 'radial-gradient(ellipse at 50% 40%, rgba(250,246,237,0.96) 0%, rgba(242,235,218,0.97) 100%)',
            backdropFilter: 'blur(14px)',
          }}
        />

        {/* Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.88, y: 24 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.88, y: 24 }}
          transition={{ type: 'spring', damping: 24, stiffness: 240 }}
          style={{
            position: 'relative',
            width: '100%', maxWidth: 360,
            maxHeight: '92vh',
            display: 'flex', flexDirection: 'column',
            borderRadius: '2.2rem',
            background: 'linear-gradient(168deg, #fffef9 0%, #fdf8ed 55%, #f8f2e2 100%)',
            boxShadow: '0 0 0 1px rgba(197,160,89,0.24), 0 36px 90px rgba(90,70,20,0.18), 0 8px 24px rgba(197,160,89,0.12)',
            overflow: 'hidden',
          }}
        >
          {/* Top gold bar */}
          <div style={{ height: 3, flexShrink: 0, background: 'linear-gradient(90deg, transparent, rgba(197,160,89,0.4) 20%, rgba(228,175,55,0.9) 50%, rgba(197,160,89,0.4) 80%, transparent)' }} />

          {/* Close btn */}
          <button
            onClick={onClose}
            style={{
              position: 'absolute', top: 14, right: 14, zIndex: 20,
              width: 32, height: 32, borderRadius: '50%',
              background: 'rgba(255,253,247,0.9)',
              border: '1px solid rgba(197,160,89,0.22)',
              boxShadow: '0 2px 10px rgba(100,80,20,0.1)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: '#b8a060', cursor: 'pointer',
              backdropFilter: 'blur(6px)',
            }}
          >
            <X size={13} strokeWidth={2.4} />
          </button>

          {/* Scrollable area */}
          <div style={{ overflowY: 'auto', flex: 1, scrollbarWidth: 'none' }}>
            <div style={{ padding: '26px 26px 24px', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>

              {/* Label */}
              <motion.div
                initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.07 }}
                style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 18 }}
              >
                <div style={{ width: 32, height: 1, background: 'linear-gradient(90deg, transparent, rgba(197,160,89,0.65))' }} />
                <span style={{ fontFamily: "'Outfit', sans-serif", fontSize: 8.5, fontWeight: 800, letterSpacing: '0.3em', textTransform: 'uppercase', color: '#c5a059' }}>
                  Sacred Pass
                </span>
                <div style={{ width: 32, height: 1, background: 'linear-gradient(90deg, rgba(197,160,89,0.65), transparent)' }} />
              </motion.div>

              {/* Animated Check */}
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }} style={{ marginBottom: 18 }}>
                <AnimatedCheck />
              </motion.div>

              {/* Title */}
              <motion.h2
                initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
                style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: '2rem', fontWeight: 600, color: '#1c1608', letterSpacing: '-0.01em', lineHeight: 1.08, marginBottom: 6 }}
              >
                Verified Successfully
              </motion.h2>

              {/* Subtitle */}
              <motion.p
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.36 }}
                style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: '0.92rem', fontStyle: 'italic', color: '#9a8060', lineHeight: 1.55, marginBottom: 20 }}
              >
                Please Provide Prasadam for{' '}
                <strong style={{ fontStyle: 'normal', color: '#2d7a62', fontWeight: 700 }}>
                  {data.persons} {data.persons === 1 ? 'Person' : 'Persons'}
                </strong>
              </motion.p>

              {/* Divider */}
              <motion.div
                initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ delay: 0.4, duration: 0.45 }}
                style={{ width: '100%', height: 1, marginBottom: 18, background: 'linear-gradient(90deg, transparent, rgba(197,160,89,0.28) 30%, rgba(197,160,89,0.28) 70%, transparent)' }}
              />

              {/* Name + PNR cards */}
              <motion.div
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.44 }}
                style={{ width: '100%', display: 'grid', gridTemplateColumns: data.name ? '1fr 1fr' : '1fr', gap: 10, marginBottom: 20 }}
              >
                {/* Name */}
                {data.name && (
                  <div style={{
                    borderRadius: '1.05rem',
                    padding: '14px 10px',
                    background: 'linear-gradient(145deg, rgba(106,158,138,0.07), rgba(106,158,138,0.14))',
                    border: '1px solid rgba(106,158,138,0.22)',
                    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 5,
                  }}>
                    <div style={{
                      width: 30, height: 30, borderRadius: '50%',
                      background: 'rgba(106,158,138,0.13)', border: '1px solid rgba(106,158,138,0.28)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 1,
                    }}>
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#3d8a72" strokeWidth="2.3" strokeLinecap="round">
                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
                      </svg>
                    </div>
                    <span style={{ fontFamily: "'Outfit', sans-serif", fontSize: 7.5, fontWeight: 800, letterSpacing: '0.22em', textTransform: 'uppercase', color: '#5a9080' }}>Name</span>
                    <span style={{ fontFamily: "'Outfit', sans-serif", fontSize: 13, fontWeight: 700, color: '#1c1608', letterSpacing: '0.02em', lineHeight: 1.25, wordBreak: 'break-word' }}>
                      {data.name}
                    </span>
                  </div>
                )}

                {/* PNR */}
                <div style={{
                  borderRadius: '1.05rem',
                  padding: '14px 10px',
                  background: 'linear-gradient(145deg, rgba(197,160,89,0.07), rgba(197,160,89,0.14))',
                  border: '1px solid rgba(197,160,89,0.25)',
                  display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 5,
                }}>
                  <div style={{
                    width: 30, height: 30, borderRadius: '50%',
                    background: 'rgba(197,160,89,0.12)', border: '1px solid rgba(197,160,89,0.3)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 1,
                  }}>
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#c5a059" strokeWidth="2.3" strokeLinecap="round">
                      <rect x="2" y="5" width="20" height="14" rx="2" /><line x1="2" y1="10" x2="22" y2="10" />
                    </svg>
                  </div>
                  <span style={{ fontFamily: "'Outfit', sans-serif", fontSize: 7.5, fontWeight: 800, letterSpacing: '0.22em', textTransform: 'uppercase', color: '#b89448' }}>PNR</span>
                  <span style={{ fontFamily: "'Outfit', sans-serif", fontSize: 16, fontWeight: 800, color: '#1c1608', letterSpacing: '0.14em', textTransform: 'uppercase' }}>
                    {data.pnr}
                  </span>
                </div>
              </motion.div>
            </div>
          </div>

          {/* Bottom gold bar */}
          <div style={{ height: 3, flexShrink: 0, background: 'linear-gradient(90deg, transparent, rgba(197,160,89,0.38) 20%, rgba(228,175,55,0.8) 50%, rgba(197,160,89,0.38) 80%, transparent)' }} />
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default PrasadamInfoModal;