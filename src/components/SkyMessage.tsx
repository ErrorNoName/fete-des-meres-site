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
    if (progress >= message.position && progress <= message.position + 20) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  }, [progress, message.position]);

  const getOpacity = () => {
    if (progress < message.position) return 0;
    if (progress > message.position + 20) return 0;
    if (progress < message.position + 5) {
      return (progress - message.position) / 5;
    }
    if (progress > message.position + 15) {
      return 1 - (progress - (message.position + 15)) / 5;
    }
    return 1;
  };

  // Ajoute un effet de glissement et nuage
  return (
    <motion.div
      className="absolute left-1/2 text-center w-4/5 pointer-events-none"
      style={{
        top: '20%',
        opacity: isVisible ? getOpacity() : 0,
        color: `rgba(60, 60, 60, ${getOpacity()})`,
        textShadow: `0 2px 8px rgba(255,255,255,0.7)`
      }}
      initial={{ y: 40, scale: 0.9 }}
      animate={{ y: isVisible ? 0 : 40, scale: isVisible ? 1 : 0.9 }}
      transition={{ duration: 1 }}
    >
      {/* Nuage stylisé */}
      <svg width="320" height="60" viewBox="0 0 320 60" style={{ position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%,-50%)', zIndex: 0 }}>
        <ellipse cx="160" cy="30" rx="120" ry="22" fill="#fff" opacity="0.7" />
        <ellipse cx="80" cy="32" rx="30" ry="14" fill="#fff" opacity="0.5" />
        <ellipse cx="240" cy="28" rx="28" ry="12" fill="#fff" opacity="0.5" />
      </svg>
      <span style={{ position: 'relative', zIndex: 1, fontSize: '1.3rem', fontWeight: 300, fontFamily: 'serif', letterSpacing: 1 }}>
        {message.text}
      </span>
    </motion.div>
  );
};

export default SkyMessage;