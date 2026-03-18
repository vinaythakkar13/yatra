'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface CurtainsProps {
    children?: React.ReactNode;
}

export default function Curtains({ children }: CurtainsProps) {
    const [isOpen, setIsOpen] = useState(false);

    // CSS curtain texture using gradients
    const curtainStyle = {
        background: `repeating-linear-gradient(
            90deg,
            #8b0000 0px,
            #a52a2a 20px,
            #8b0000 40px
        )`,
        boxShadow: 'inset 0 0 100px rgba(0,0,0,0.5)',
    };

    return (
        <div className="relative w-full h-full bg-slate-900 rounded-3xl overflow-hidden shadow-2xl border border-white/10">
            {/* Background Content (Hidden behind curtains) */}
            <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center bg-[#1a1c23]">
                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={isOpen ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
                    transition={{ delay: 0.5, duration: 1 }}
                    className="w-full h-full flex flex-col items-center justify-center"
                >
                    {children}
                </motion.div>
            </div>

            {/* Curtains */}
            <div className="absolute inset-0 z-10 flex pointer-events-none">
                {/* Left Curtain */}
                <motion.div
                    animate={isOpen ? { x: '-100%' } : { x: '0%' }}
                    transition={{ duration: 2, ease: [0.45, 0.05, 0.55, 0.95] }}
                    className="flex-1 h-full relative"
                    style={curtainStyle}
                >
                    <div className="absolute top-0 bottom-0 right-0 w-[20px] bg-black/30 blur-sm" />
                </motion.div>

                {/* Right Curtain */}
                <motion.div
                    animate={isOpen ? { x: '100%' } : { x: '0%' }}
                    transition={{ duration: 2, ease: [0.45, 0.05, 0.55, 0.95] }}
                    className="flex-1 h-full relative"
                    style={curtainStyle}
                >
                    <div className="absolute top-0 bottom-0 left-0 w-[20px] bg-black/30 blur-sm" />
                </motion.div>
            </div>

            {/* Button Container Overlay */}
            <AnimatePresence>
                {!isOpen && (
                    <motion.div
                        initial={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 z-20 flex items-center justify-center bg-black/20"
                    >
                        <motion.button
                            onClick={() => setIsOpen(true)}
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            className="px-12 py-6 bg-white text-slate-900 font-black rounded-2xl shadow-2xl uppercase tracking-[0.2em] text-lg hover:bg-[#4ADE80] hover:text-white transition-colors"
                        >
                            OPEN CURTAIN
                        </motion.button>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Reset Button (Optional, for demo) */}
            {isOpen && (
                <button
                    onClick={() => setIsOpen(false)}
                    className="absolute bottom-6 right-6 z-50 p-3 bg-white/10 hover:bg-white/20 text-white rounded-full backdrop-blur-md transition-all"
                >
                    RESET
                </button>
            )}
        </div>
    );
}
