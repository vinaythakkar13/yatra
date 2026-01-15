import React from 'react';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';

interface LoadingEmojiProps {
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
  text?: string;
}

const LoadingEmoji: React.FC<LoadingEmojiProps> = ({ 
  size = 'md', 
  showText = false, 
  text = 'Loading...' 
}) => {
  const sizeClasses = {
    sm: 'w-16 h-16',
    md: 'w-24 h-24',
    lg: 'w-32 h-32',
  };

  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <div className={sizeClasses[size]}>
        <DotLottieReact
          src="https://lottie.host/7340c974-65bd-4570-97df-ecc5596f9bc7/r5P4jlk17x.lottie"
          loop
          autoplay
        />
      </div>
      {showText && text && (
        <p className="text-sm font-medium text-gray-700">{text}</p>
      )}
    </div>
  );
};

export default LoadingEmoji;