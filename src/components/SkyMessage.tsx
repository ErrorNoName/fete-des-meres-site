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
  const [hasAppeared, setHasAppeared] = useState(false);
  const [isFading, setIsFading] = useState(false);
  
  // Zone d'apparition du message (plus proactive et poétique)
  useEffect(() => {
    // Le message apparaît à sa position et disparaît progressivement
    if (progress >= message.position - 2 && progress <= message.position + 15) {
      if (!hasAppeared) {
        setHasAppeared(true);
      }
      setIsVisible(true);
      setIsFading(false);
    } else if (hasAppeared && progress > message.position + 15) {
      setIsFading(true);
      // Message disparaît doucement
      setTimeout(() => {
        setIsVisible(false);
      }, 2000);
    }
  }, [progress, message.position, hasAppeared]);

  // Calcul délicat de l'opacité pour des transitions douces
  const getOpacity = () => {
    if (!isVisible) return 0;
    
    if (progress < message.position) {
      return (progress - (message.position - 2)) / 2;
    }
    
    if (progress > message.position + 10) {
      return 1 - (progress - (message.position + 10)) / 5;
    }
    
    return 1;
  };
  
  // Ne rien rendre si pas visible du tout
  if (!isVisible && !isFading) return null;

  return (
    <motion.div
      className="absolute left-1/2 w-full max-w-md px-6 pointer-events-none z-10"
      style={{
        top: '30%',
        transform: 'translateX(-50%)',
      }}
      initial={{ opacity: 0, y: 20, scale: 0.9 }}
      animate={{ 
        opacity: getOpacity(),
        y: isVisible ? 0 : 20,
        scale: isVisible ? 1 : 0.9
      }}
      transition={{ duration: 1.5, ease: "easeOut" }}
    >
      {/* Message avec style typographique élégant */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: getOpacity() }}
        transition={{ duration: 1.2, delay: 0.3 }}
        style={{
          position: 'relative',
          textAlign: 'center',
        }}
      >
        {/* Halo lumineux autour du texte */}
        <div 
          style={{
            position: 'absolute',
            inset: '-2rem',
            background: `radial-gradient(ellipse at center, 
              rgba(255,255,255,${0.15 * getOpacity()}) 0%, 
              rgba(255,255,255,0) 70%)`,
            filter: `blur(${8 + brightness * 5}px)`,
            zIndex: -1,
          }}
        />
        
        {/* Texte avec typographie émotive */}
        <p
          style={{
            fontFamily: "'Cormorant Garamond', serif, 'Times New Roman', Times, serif",
            fontSize: '1.5rem',
            fontWeight: 300,
            lineHeight: 1.5,
            color: `rgba(255, 255, 255, ${0.8 + brightness * 0.2})`,
            textShadow: `0 0 ${10 + brightness * 15}px rgba(255, 255, 255, ${0.5 * getOpacity()})`,
            letterSpacing: '0.03em',
          }}
        >
          {message.text}
        </p>
        
        {/* Trait lumineux délicat sous le texte */}
        <motion.div
          initial={{ width: '0%', opacity: 0 }}
          animate={{ width: '80%', opacity: getOpacity() * 0.6 }}
          transition={{ duration: 1.5, delay: 0.8 }}
          style={{
            height: '1px',
            background: `linear-gradient(to right, 
              rgba(255,255,255,0) 0%, 
              rgba(255,255,255,${0.7 * getOpacity()}) 50%, 
              rgba(255,255,255,0) 100%)`,
            margin: '1rem auto',
          }}
        />
      </motion.div>
    </motion.div>
  );
};

export default SkyMessage;