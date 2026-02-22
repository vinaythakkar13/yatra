'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface ConfettiButtonProps {
    onClick?: () => Promise<void> | void;
    text?: string;
    loadingText?: string;
    successText?: string;
    className?: string;
}

const confettiCount = 20;
const sequinCount = 10;
const gravityConfetti = 0.3;
const gravitySequins = 0.55;
const dragConfetti = 0.075;
const dragSequins = 0.02;
const terminalVelocity = 3;

const colors = [
    { front: '#7b5cff', back: '#6245e0' }, // Purple
    { front: '#b3c7ff', back: '#8fa5e5' }, // Light Blue
    { front: '#5c86ff', back: '#345dd1' }  // Darker Blue
];

const randomRange = (min: number, max: number) => Math.random() * (max - min) + min;

const initConfettoVelocity = (xRange: [number, number], yRange: [number, number]) => {
    const x = randomRange(xRange[0], xRange[1]);
    const range = yRange[1] - yRange[0] + 1;
    let y = yRange[1] - Math.abs(randomRange(0, range) + randomRange(0, range) - range);
    if (y >= yRange[1] - 1) {
        y += (Math.random() < .25) ? randomRange(1, 3) : 0;
    }
    return { x: x, y: -y };
};

class Confetto {
    randomModifier: number;
    color: { front: string, back: string };
    dimensions: { x: number, y: number };
    position: { x: number, y: number };
    rotation: number;
    scale: { x: number, y: number };
    velocity: { x: number, y: number };

    constructor(canvasWidth: number, canvasHeight: number, buttonWidth: number, buttonHeight: number) {
        this.randomModifier = randomRange(0, 99);
        this.color = colors[Math.floor(randomRange(0, colors.length))];
        this.dimensions = {
            x: randomRange(5, 9),
            y: randomRange(8, 15),
        };
        this.position = {
            x: randomRange(canvasWidth / 2 - buttonWidth / 4, canvasWidth / 2 + buttonWidth / 4),
            y: randomRange(canvasHeight / 2 + buttonHeight / 2 + 8, canvasHeight / 2 + (1.5 * buttonHeight) - 8),
        };
        this.rotation = randomRange(0, 2 * Math.PI);
        this.scale = {
            x: 1,
            y: 1,
        };
        this.velocity = initConfettoVelocity([-9, 9], [6, 11]);
    }

    update() {
        this.velocity.x -= this.velocity.x * dragConfetti;
        this.velocity.y = Math.min(this.velocity.y + gravityConfetti, terminalVelocity);
        this.velocity.x += Math.random() > 0.5 ? Math.random() : -Math.random();
        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;
        this.scale.y = Math.cos((this.position.y + this.randomModifier) * 0.09);
    }
}

class Sequin {
    color: string;
    radius: number;
    position: { x: number, y: number };
    velocity: { x: number, y: number };

    constructor(canvasWidth: number, canvasHeight: number, buttonWidth: number, buttonHeight: number) {
        this.color = colors[Math.floor(randomRange(0, colors.length))].back;
        this.radius = randomRange(1, 2);
        this.position = {
            x: randomRange(canvasWidth / 2 - buttonWidth / 3, canvasWidth / 2 + buttonWidth / 3),
            y: randomRange(canvasHeight / 2 + buttonHeight / 2 + 8, canvasHeight / 2 + (1.5 * buttonHeight) - 8),
        };
        this.velocity = {
            x: randomRange(-6, 6),
            y: randomRange(-8, -12)
        };
    }

    update() {
        this.velocity.x -= this.velocity.x * dragSequins;
        this.velocity.y = this.velocity.y + gravitySequins;
        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;
    }
}

export default function ConfettiButton({
    onClick,
    text = "Submit",
    loadingText = "Loading...",
    successText = "Success",
    className = ""
}: ConfettiButtonProps) {
    const [status, setStatus] = useState<'ready' | 'loading' | 'complete'>('ready');
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const buttonRef = useRef<HTMLButtonElement>(null);
    const particles = useRef<{ confetti: Confetto[], sequins: Sequin[] }>({ confetti: [], sequins: [] });
    const animationFrame = useRef<number>(0);

    const initBurst = useCallback(() => {
        if (!canvasRef.current || !buttonRef.current) return;
        const { width, height } = canvasRef.current;
        const { offsetWidth, offsetHeight } = buttonRef.current;

        for (let i = 0; i < confettiCount; i++) {
            particles.current.confetti.push(new Confetto(width, height, offsetWidth, offsetHeight));
        }
        for (let i = 0; i < sequinCount; i++) {
            particles.current.sequins.push(new Sequin(width, height, offsetWidth, offsetHeight));
        }
    }, []);

    const render = useCallback(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx || !buttonRef.current) return;

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        const { offsetWidth, offsetHeight } = buttonRef.current;

        particles.current.confetti.forEach((confetto, index) => {
            let width = (confetto.dimensions.x * confetto.scale.x);
            let height = (confetto.dimensions.y * confetto.scale.y);

            ctx.translate(confetto.position.x, confetto.position.y);
            ctx.rotate(confetto.rotation);
            confetto.update();
            ctx.fillStyle = confetto.scale.y > 0 ? confetto.color.front : confetto.color.back;
            ctx.fillRect(-width / 2, -height / 2, width, height);
            ctx.setTransform(1, 0, 0, 1, 0, 0);

            if (confetto.velocity.y < 0) {
                ctx.clearRect(canvas.width / 2 - offsetWidth / 2, canvas.height / 2 + offsetHeight / 2, offsetWidth, offsetHeight);
            }
        });

        particles.current.sequins.forEach((sequin, index) => {
            ctx.translate(sequin.position.x, sequin.position.y);
            sequin.update();
            ctx.fillStyle = sequin.color;
            ctx.beginPath();
            ctx.arc(0, 0, sequin.radius, 0, 2 * Math.PI);
            ctx.fill();
            ctx.setTransform(1, 0, 0, 1, 0, 0);

            if (sequin.velocity.y < 0) {
                ctx.clearRect(canvas.width / 2 - offsetWidth / 2, canvas.height / 2 + offsetHeight / 2, offsetWidth, offsetHeight);
            }
        });

        particles.current.confetti = particles.current.confetti.filter(p => p.position.y < canvas.height);
        particles.current.sequins = particles.current.sequins.filter(p => p.position.y < canvas.height);

        animationFrame.current = requestAnimationFrame(render);
    }, []);

    useEffect(() => {
        const handleResize = () => {
            if (canvasRef.current) {
                canvasRef.current.width = window.innerWidth;
                canvasRef.current.height = window.innerHeight;
            }
        };
        window.addEventListener('resize', handleResize);
        handleResize();
        render();
        return () => {
            window.removeEventListener('resize', handleResize);
            if (animationFrame.current) cancelAnimationFrame(animationFrame.current);
        };
    }, [render]);

    const handleClick = async () => {
        if (status !== 'ready') return;

        setStatus('loading');

        try {
            if (onClick) {
                await onClick();
            } else {
                // Mock delay if no onClick provided
                await new Promise(resolve => setTimeout(resolve, 1800));
            }

            setStatus('complete');
            setTimeout(() => {
                initBurst();
                setTimeout(() => {
                    setStatus('ready');
                }, 4000);
            }, 320);
        } catch (error) {
            setStatus('ready');
        }
    };

    return (
        <div className={`relative flex items-center justify-center ${className}`}>
            <canvas
                ref={canvasRef}
                className="fixed inset-0 pointer-events-none z-50 w-full h-full"
            />

            <button
                ref={buttonRef}
                onClick={handleClick}
                disabled={status !== 'ready'}
                className={`
                    relative w-72 h-14 rounded-2xl font-black transition-all duration-300 overflow-hidden
                    ${status === 'ready' ? 'bg-[#1a1c23] text-white hover:bg-[#252833] hover:scale-[1.02] active:scale-[0.98]' : ''}
                    ${status === 'loading' ? 'bg-[#1a1c23]' : ''}
                    ${status === 'complete' ? 'bg-[#1a1c23]' : ''}
                    flex items-center justify-center shadow-[0_10px_30px_rgba(0,0,0,0.3)] border border-white/5
                `}
            >
                {/* Background "inner" effect - elegant progress track */}
                <div className={`
                    absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20 opacity-0 transition-opacity duration-300
                    ${status === 'loading' ? 'opacity-100' : ''}
                `} />

                <div className={`
                    absolute bottom-0 left-0 h-1 bg-gradient-to-r from-[#5c86ff] to-[#5cffa1] transition-all duration-[2000ms] ease-out
                    ${status === 'loading' ? 'w-full' : 'w-0'}
                    ${status === 'complete' ? 'w-full opacity-0' : ''}
                `} />

                <AnimatePresence mode="wait">
                    {status === 'ready' && (
                        <motion.div
                            key="ready"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="relative flex items-center gap-2"
                        >
                            <svg className="w-4 h-4 text-[#5c86ff]" viewBox="0 0 13 12.2">
                                <polyline fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" points="2,7.1 6.5,11.1 11,7.1 " />
                                <line fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" x1="6.5" y1="1.2" x2="6.5" y2="10.3" />
                            </svg>
                            <span className="tracking-wide">{text}</span>
                        </motion.div>
                    )}

                    {status === 'loading' && (
                        <motion.div
                            key="loading"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="relative flex items-center gap-1"
                        >
                            {[0, 1, 2].map((i) => (
                                <motion.div
                                    key={i}
                                    className="w-1.5 h-1.5 bg-[#5c86ff] rounded-full"
                                    animate={{ y: [0, -7, 0] }}
                                    transition={{ duration: 1, repeat: Infinity, delay: i * 0.1 }}
                                />
                            ))}
                        </motion.div>
                    )}

                    {status === 'complete' && (
                        <motion.div
                            key="complete"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="relative flex items-center gap-2"
                        >
                            <svg className="w-5 h-5 text-[#5cffa1]" viewBox="0 0 13 11">
                                <motion.polyline
                                    initial={{ pathLength: 0 }}
                                    animate={{ pathLength: 1 }}
                                    transition={{ duration: 0.3, delay: 0.2 }}
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    points="1.4,5.8 5.1,9.5 11.6,2.1 "
                                />
                            </svg>
                            <span className="tracking-wide text-[#5cffa1]">{successText}</span>
                        </motion.div>
                    )}
                </AnimatePresence>
            </button>
        </div>
    );
}
