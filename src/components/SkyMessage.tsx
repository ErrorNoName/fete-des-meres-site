import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Message } from '../context/AnimationContext';

interface SkyMessageProps {
  message: Message;
  progress: number;
  brightness: number;
}

const SkyMessage: React.FC<SkyMessageProps> = ({ message, progress, brightness }) => {
  const [isVisible, setIsVisible] = useState(false);
  
  useEffect(() => {
    // Show message when progress reaches message position
    // and hide when it's 20% past
    if (progress >= message.position && progress <= message.position + 20) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  }, [progress, message.position]);

  // Calculate visibility - fade in and out
  const getOpacity = () => {
    if (progress < message.position) return 0;
    if (progress > message.position + 20) return 0;
    
    // Fade in during first 5%
    if (progress < message.position + 5) {
      return (progress - message.position) / 5;
    }
    
    // Fade out during last 5%
    if (progress > message.position + 15) {
      return 1 - (progress - (message.position + 15)) / 5;
    }
    
    // Full opacity in the middle
    return 1;
  };

  // Text color based on brightness
  const getTextColor = () => {
    const brightnessValue = Math.max(0.2, brightness);
    return `rgba(${Math.round(255 * brightnessValue)}, ${Math.round(255 * brightnessValue)}, ${Math.round(255 * brightnessValue)}, ${getOpacity()})`;
  };

  return (
    <motion.div 
      className="absolute left-1/2 -translate-x-1/2 text-center w-4/5 pointer-events-none"
      style={{
        top: '30%',
        opacity: isVisible ? getOpacity() : 0,
        color: getTextColor(),
        textShadow: `0 0 8px rgba(0, 0, 0, 0.8)`,
      }}
      initial={{ y: 20 }}
      animate={{ 
        y: isVisible ? 0 : 20,
      }}
      transition={{ duration: 0.5 }}
    >
      <p className="text-xl font-light">{message.text}</p>
    </motion.div>
  );
};

export default SkyMessage;