import React, { useState, useRef, useEffect } from 'react';

interface TooltipProps {
    content: string;
    children: React.ReactElement;
    position?: 'top' | 'bottom' | 'left' | 'right';
}

const Tooltip: React.FC<TooltipProps> = ({ content, children, position = 'right' }) => {
    const [isVisible, setIsVisible] = useState(false);
    const [tooltipStyle, setTooltipStyle] = useState<React.CSSProperties>({});
    const triggerRef = useRef<HTMLDivElement>(null);
    const tooltipRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (isVisible && triggerRef.current && tooltipRef.current) {
            const triggerRect = triggerRef.current.getBoundingClientRect();
            const tooltipRect = tooltipRef.current.getBoundingClientRect();

            let top = 0;
            let left = 0;

            switch (position) {
                case 'right':
                    top = triggerRect.top + (triggerRect.height - tooltipRect.height) / 2;
                    left = triggerRect.right + 12;
                    break;
                case 'left':
                    top = triggerRect.top + (triggerRect.height - tooltipRect.height) / 2;
                    left = triggerRect.left - tooltipRect.width - 12;
                    break;
                case 'top':
                    top = triggerRect.top - tooltipRect.height - 12;
                    left = triggerRect.left + (triggerRect.width - tooltipRect.width) / 2;
                    break;
                case 'bottom':
                    top = triggerRect.bottom + 12;
                    left = triggerRect.left + (triggerRect.width - tooltipRect.width) / 2;
                    break;
            }

            setTooltipStyle({
                position: 'fixed',
                top: `${top}px`,
                left: `${left}px`,
            });
        }
    }, [isVisible, position]);

    const handleMouseEnter = () => {
        setIsVisible(true);
    };

    const handleMouseLeave = () => {
        setIsVisible(false);
    };

    return (
        <>
            <div
                ref={triggerRef}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                className="inline-block"
            >
                {children}
            </div>

            {isVisible && (
                <div
                    ref={tooltipRef}
                    style={tooltipStyle}
                    className="z-[9999] px-3 py-2 text-sm font-medium text-white bg-gradient-to-r from-heritage-maroon to-heritage-textDark rounded-lg shadow-lg animate-fade-in pointer-events-none whitespace-nowrap"
                >
                    {content}
                    {/* Arrow */}
                    <div
                        className={`absolute w-2 h-2 bg-heritage-maroon transform rotate-45 ${position === 'right' ? '-left-1 top-1/2 -translate-y-1/2' :
                                position === 'left' ? '-right-1 top-1/2 -translate-y-1/2' :
                                    position === 'top' ? 'left-1/2 -translate-x-1/2 -bottom-1' :
                                        'left-1/2 -translate-x-1/2 -top-1'
                            }`}
                    />
                </div>
            )}
        </>
    );
};

export default Tooltip;
