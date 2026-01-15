// Custom hook to get the viewport width and height
// Fixed hydration issues by ensuring consistent server/client initial state

import { useState, useEffect } from 'react';

export const useWindowSize = () => {
    // Initialize with 0 on both server and client to prevent hydration mismatch
    const [width, setWidth] = useState<number>(0);
    const [height, setHeight] = useState<number>(0);

    useEffect(() => {
        // Only set dimensions after component mounts (client-side only)
        if (typeof window !== 'undefined') {
            setWidth(window.innerWidth);
            setHeight(window.innerHeight);

            const handleResize = () => {
                setWidth(window.innerWidth);
                setHeight(window.innerHeight);
            };

            window.addEventListener('resize', handleResize);
            return () => window.removeEventListener('resize', handleResize);
        }
    }, []);

    return { width, height };
};