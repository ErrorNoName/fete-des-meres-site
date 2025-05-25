import React from 'react';
import { motion } from 'framer-motion';

interface CharacterProps {
  type: 'mother' | 'child';
  progress: number;
  brightness: number;
}

const Character: React.FC<CharacterProps> = ({ type, progress, brightness }) => {
  // Intensité de la lumière basée sur la progression et le type
  const luminosity = type === 'mother' 
    ? Math.min(0.4 + brightness * 0.6, 1) 
    : Math.min((progress - 90) * 0.1, 0.8);
  
  // Couleurs émotives différentes pour la mère et l'enfant
  const baseHue = type === 'mother' ? 340 : 30; // Rose pour mère, doré pour enfant
  
  // Taille des sphères et de leurs auras
  const size = type === 'mother' ? 30 : 20;
  const glowSize = size * (1.8 + brightness * 0.5);
  
  // Pulsation subtile pour simuler la respiration/émotion
  const pulseAnimation = {
    scale: [1, 1.05, 1],
    transition: {
      duration: type === 'mother' ? 3 : 2,
      ease: "easeInOut",
      repeat: Infinity,
    }
  };
  
  // Visibilité basée sur la progression
  const isMotherVisible = type === 'mother';
  const isChildVisible = type === 'child' && progress > 80;
  const opacity = type === 'mother' 
    ? 1 
    : Math.min((progress - 80) / 15, 1);
  
  // Ne pas afficher si pas visible
  if ((type === 'mother' && !isMotherVisible) || (type === 'child' && !isChildVisible)) {
    return null;
  }

  return (
    <motion.div
      initial={type === 'child' ? { scale: 0.3, opacity: 0 } : {}}
      animate={{
        ...pulseAnimation,
        opacity: opacity
      }}
      style={{
        position: 'absolute',
        pointerEvents: 'none',
      }}
    >
      {/* Aura extérieure diffuse */}
      <div 
        style={{
          position: 'absolute',
          width: glowSize * 2.5,
          height: glowSize * 2.5,
          borderRadius: '50%',
          background: `radial-gradient(circle, 
            hsla(${baseHue}, 100%, 70%, ${luminosity * 0.3}) 0%, 
            hsla(${baseHue}, 100%, 70%, 0) 70%)`,
          transform: 'translate(-50%, -50%)',
          filter: `blur(${10 + brightness * 10}px)`,
        }}
      />
      
      {/* Aura intermédiaire */}
      <div 
        style={{
          position: 'absolute',
          width: glowSize * 1.8,
          height: glowSize * 1.8,
          borderRadius: '50%',
          background: `radial-gradient(circle, 
            hsla(${baseHue}, 100%, 80%, ${luminosity * 0.5}) 0%, 
            hsla(${baseHue}, 100%, 80%, 0) 70%)`,
          transform: 'translate(-50%, -50%)',
          filter: `blur(${5 + brightness * 8}px)`,
        }}
      />
      
      {/* Sphère centrale avec éclat */}
      <div 
        style={{
          position: 'absolute',
          width: size,
          height: size,
          borderRadius: '50%',
          background: `radial-gradient(circle at 40% 40%, 
            hsla(${baseHue}, 100%, 98%, ${luminosity * 0.95}),
            hsla(${baseHue}, 85%, 80%, ${luminosity * 0.8}) 60%,
            hsla(${baseHue - 10}, 70%, 70%, ${luminosity * 0.7}) 100%)`,
          boxShadow: `0 0 ${10 + brightness * 20}px ${size/3}px hsla(${baseHue}, 100%, 80%, ${luminosity * 0.8})`,
          transform: 'translate(-50%, -50%)',
        }}
      />
      
      {/* Éclat central */}
      <div 
        style={{
          position: 'absolute',
          width: size * 0.4,
          height: size * 0.4,
          borderRadius: '50%',
          background: `hsla(${baseHue - 10}, 100%, 98%, ${luminosity * 0.95})`,
          transform: 'translate(-50%, -50%) translate(20%, 20%)',
          filter: 'blur(1px)',
        }}
      />
    </motion.div>
  );
};

export default Character;