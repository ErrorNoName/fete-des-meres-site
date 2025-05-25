import React from 'react';
import { motion } from 'framer-motion';

interface CharacterProps {
  type: 'mother' | 'child';
  progress: number;
  brightness: number;
}

const Character: React.FC<CharacterProps> = ({ type, progress, brightness }) => {
  // Mother character moves across the screen based on progress
  // Child character appears at the end

  const colorIntensity = Math.min(brightness * 2, 1);
  
  const baseColor = type === 'mother' 
    ? `rgba(255, ${Math.round(105 * colorIntensity)}, ${Math.round(180 * colorIntensity)}, 1)` 
    : `rgba(${Math.round(100 * colorIntensity)}, ${Math.round(149 * colorIntensity)}, 255, 1)`;

  const shadowColor = type === 'mother'
    ? `rgba(255, ${Math.round(105 * colorIntensity)}, ${Math.round(180 * colorIntensity)}, 0.4)`
    : `rgba(${Math.round(100 * colorIntensity)}, ${Math.round(149 * colorIntensity)}, 255, 0.4)`;

  const isChildVisible = progress > 90;
  
  return (
    <>
      {type === 'mother' && (
        <motion.div
          className="absolute"
          style={{
            bottom: '15%',
            left: `${progress}%`,
            translateX: '-50%',
            filter: `drop-shadow(0 0 10px ${shadowColor})`,
          }}
          animate={{
            rotate: progress * 3.6, // Roll animation
          }}
        >
          <svg width="50" height="50" viewBox="0 0 50 50">
            <circle 
              cx="25" 
              cy="25" 
              r="20" 
              fill="none" 
              stroke={baseColor} 
              strokeWidth="2" 
            />
            <circle 
              cx="25" 
              cy="25" 
              r="18" 
              fill="none" 
              stroke={baseColor} 
              strokeWidth="1" 
              strokeDasharray="4 4" 
            />
          </svg>
        </motion.div>
      )}
      
      {type === 'child' && isChildVisible && (
        <motion.div
          className="absolute"
          style={{
            bottom: '15%',
            left: '95%',
            translateX: '-50%',
            filter: `drop-shadow(0 0 10px ${shadowColor})`,
          }}
          initial={{ opacity: 0, scale: 0 }}
          animate={{ 
            opacity: (progress - 90) * 10,
            scale: Math.min((progress - 90) / 5, 1),
          }}
        >
          <svg width="40" height="40" viewBox="0 0 40 40">
            <circle 
              cx="20" 
              cy="20" 
              r="15" 
              fill="none" 
              stroke={baseColor} 
              strokeWidth="2" 
            />
            <circle 
              cx="20" 
              cy="20" 
              r="12" 
              fill="none" 
              stroke={baseColor} 
              strokeWidth="1" 
            />
          </svg>
        </motion.div>
      )}
    </>
  );
};

export default Character;