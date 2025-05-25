import React, { useState, useEffect, useRef } from 'react';
import { useAnimation } from '../context/AnimationContext';
import Character from './Character';
import SkyMessage from './SkyMessage';
import { Heart } from 'lucide-react';
import { motion } from 'framer-motion';
import { backgroundMusic, birdsSound, windSound } from '../utils/sounds';

interface AnimationSceneProps {
  id: string;
}

const AnimationScene: React.FC<AnimationSceneProps> = ({ id }) => {
  const { messages, speed, loadAnimation } = useAnimation();
  const [progress, setProgress] = useState(0);
  const [brightness, setBrightness] = useState(0);
  const [shakeDetected, setShakeDetected] = useState(false);
  const [motionPermissionGranted, setMotionPermissionGranted] = useState(false);
  const [showFinalMessage, setShowFinalMessage] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [messageIndex, setMessageIndex] = useState(-1);
  const [autoProgress, setAutoProgress] = useState(true);
  const lastShakeTime = useRef(0);
  const progressRef = useRef(0);
  // Audio refs
  const musicRef = useRef<HTMLAudioElement | null>(null);
  const birdsRef = useRef<HTMLAudioElement | null>(null);
  const windRef = useRef<HTMLAudioElement | null>(null);
  const [muted, setMuted] = useState(false);
  
  // Load the animation data based on the ID
  useEffect(() => {
    loadAnimation(id);
  }, [id, loadAnimation]);

  // Initialize device motion detection
  useEffect(() => {
    // Check if DeviceMotionEvent is available
    if (typeof DeviceMotionEvent !== 'undefined') {
      // Request permission for iOS 13+ devices
      if (typeof (DeviceMotionEvent as any).requestPermission === 'function') {
        const requestPermission = async () => {
          try {
            const permissionState = await (DeviceMotionEvent as any).requestPermission();
            setMotionPermissionGranted(permissionState === 'granted');
          } catch (error) {
            console.error('Error requesting motion permission:', error);
          }
        };
        
        const handleRequestPermission = () => {
          requestPermission();
          document.removeEventListener('click', handleRequestPermission);
        };
        
        document.addEventListener('click', handleRequestPermission);
        return () => {
          document.removeEventListener('click', handleRequestPermission);
        };
      } else {
        // For non-iOS devices, assume permission is granted
        setMotionPermissionGranted(true);
      }
    }
  }, []);
  
  // Set up the motion detection
  useEffect(() => {
    if (!motionPermissionGranted) return;
    
    const handleDeviceMotion = (event: DeviceMotionEvent) => {
      const { accelerationIncludingGravity } = event;
      if (!accelerationIncludingGravity) return;
      
      const { x, y, z } = accelerationIncludingGravity;
      if (x === null || y === null || z === null) return;
      
      // Calculate magnitude of acceleration
      const acceleration = Math.sqrt(x * x + y * y + z * z);
      const now = Date.now();
      
      // Detect shake - adjust threshold as needed
      if (acceleration > 15 && now - lastShakeTime.current > 200) {
        setShakeDetected(true);
        lastShakeTime.current = now;
        
        // Update progress based on speed
        setProgress(prev => {
          const newProgress = Math.min(prev + speed / 10, 100);
          progressRef.current = newProgress;
          return newProgress;
        });
        
        // After 200ms, reset shake state
        setTimeout(() => setShakeDetected(false), 200);
      }
    };
    
    window.addEventListener('devicemotion', handleDeviceMotion);
    
    return () => {
      window.removeEventListener('devicemotion', handleDeviceMotion);
    };
  }, [motionPermissionGranted, speed]);
  
  // Update brightness based on progress
  useEffect(() => {
    setBrightness(progress / 100);
    
    // Show final message at the end
    if (progress >= 95) {
      setShowFinalMessage(true);
    } else {
      setShowFinalMessage(false);
    }
  }, [progress]);
  
  // Avancement automatique avec arrêts aux messages
  useEffect(() => {
    if (!autoProgress || progress >= 100) return;
    
    const messagePositions = messages.map(m => m.position);
    
    // Trouver si on est à une position de message
    const nearestMessageIdx = messagePositions.findIndex(pos => 
      Math.abs(progress - pos) < 1
    );
    
    if (nearestMessageIdx !== -1 && messageIndex !== nearestMessageIdx) {
      // Pause à un message
      setIsPaused(true);
      setMessageIndex(nearestMessageIdx);
      
      // Jouer le son de tintement
      const tinkle = new Audio('/music/tinkle.mp3');
      if (!muted) {
        tinkle.volume = 0.5;
        tinkle.play();
      }
      
      // Attendre 5 secondes puis continuer
      setTimeout(() => {
        setIsPaused(false);
      }, 5000);
    } else if (!isPaused) {
      // Avancement automatique doux
      const timer = setInterval(() => {
        setProgress(prev => {
          const newProgress = Math.min(prev + (speed / 200), 100);
          progressRef.current = newProgress;
          return newProgress;
        });
      }, 50);
      
      return () => clearInterval(timer);
    }
  }, [progress, messages, isPaused, autoProgress, messageIndex, speed, muted]);
  
  // Mise à jour des sons selon la progression
  useEffect(() => {
    if (musicRef.current && !muted) {
      // Transition musicale selon la progression
      if (progress > 70) {
        // Transition vers des nappes musicales éthérées
        musicRef.current.volume = Math.max(0.2, 0.5 - (progress - 70) / 60);
        
        // Tentative de charger et jouer la musique éthérée
        const etherealMusic = new Audio('/music/ethereal.mp3');
        etherealMusic.volume = Math.min((progress - 70) / 30 * 0.5, 0.5);
        etherealMusic.loop = true;
        etherealMusic.play().catch(() => {});
      }
    }
  }, [progress, muted]);
  
  // Palette de couleur chaude au départ, évoluant vers blanc-rosé
  const getBackgroundStyle = () => {
    // Couleurs de base chaudes au début
    const startColor = {
      r: 40,
      g: 10, 
      b: 30
    };
    
    // Couleurs finales plus claires et rosées
    const endColor = {
      r: 50 + 150 * brightness,
      g: 20 + 140 * brightness,
      b: 60 + 120 * brightness
    };
    
    // Interpolation des couleurs
    const r = startColor.r + (endColor.r - startColor.r) * brightness;
    const g = startColor.g + (endColor.g - startColor.g) * brightness;
    const b = startColor.b + (endColor.b - startColor.b) * brightness;
    
    return {
      background: `linear-gradient(to bottom,
        rgb(${r}, ${g}, ${b}) 0%,
        rgb(${r * 0.8}, ${g * 0.8}, ${b * 0.9}) 100%)`,
    };
  };
  
  // Simulate stars/particles in the background
  const renderStars = () => {
    const stars = [];
    const starCount = 50;
    
    for (let i = 0; i < starCount; i++) {
      const size = Math.random() * 3 + 1;
      const starBrightness = Math.random() * 0.5 + 0.1;
      const posX = Math.random() * 100;
      const posY = Math.random() * 100;
      
      stars.push(
        <div
          key={i}
          className="absolute rounded-full"
          style={{
            width: `${size}px`,
            height: `${size}px`,
            left: `${posX}%`,
            top: `${posY}%`,
            backgroundColor: `rgba(255, 255, 255, ${starBrightness * brightness})`,
            boxShadow: `0 0 ${size * 2}px rgba(255, 255, 255, ${starBrightness * brightness})`,
          }}
        />
      );
    }
    
    return stars;
  };
  
  // Ground that changes with brightness
  const groundStyle = {
    height: '15%',
    background: `
      linear-gradient(to bottom,
        rgba(${30 * brightness}, ${10 * brightness}, ${40 * brightness}, 1) 0%,
        rgba(${50 * brightness}, ${20 * brightness}, ${70 * brightness}, 1) 100%)
    `,
    borderTop: `1px solid rgba(${100 * brightness}, ${50 * brightness}, ${150 * brightness}, ${brightness})`,
  };
  
  // Nouveau style visuel pour une expérience minimaliste et émotive
  const renderBackgroundNature = () => {
    // Décors minimalistes avec dégradés subtils
    return (
      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 1000 600" preserveAspectRatio="none">
        {/* Dégradés pour le ciel et le sol */}
        <defs>
          <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={`rgba(${40 + 210 * brightness}, ${10 + 150 * brightness}, ${60 + 170 * brightness}, 1)`} />
            <stop offset="100%" stopColor={`rgba(${130 + 100 * brightness}, ${50 + 150 * brightness}, ${160 + 60 * brightness}, 1)`} />
          </linearGradient>
          <radialGradient id="glow" cx="0.5" cy="0.5" r="0.5" fx="0.5" fy="0.5">
            <stop offset="0%" stopColor={`rgba(255, ${180 + 75 * brightness}, ${200 + 55 * brightness}, ${0.3 + 0.4 * brightness})`} />
            <stop offset="100%" stopColor="rgba(255, 255, 255, 0)" />
          </radialGradient>
          <linearGradient id="ground" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={`rgba(${60 + 30 * brightness}, ${20 + 40 * brightness}, ${90 + 20 * brightness}, 1)`} />
            <stop offset="100%" stopColor={`rgba(${30 + 20 * brightness}, ${10 + 30 * brightness}, ${40 + 20 * brightness}, 1)`} />
          </linearGradient>
          <filter id="bloom" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="10" />
          </filter>
        </defs>
        
        {/* Ciel */}
        <rect x="0" y="0" width="1000" height="500" fill="url(#sky)" />
        
        {/* Aura lumineuse diffuse (évolue avec la progression) */}
        <circle 
          cx={200 + 600 * brightness} 
          cy="150" 
          r={120 + 80 * brightness} 
          fill="url(#glow)" 
          style={{ filter: 'blur(40px)' }}
        />
        
        {/* Silhouettes organiques (éléments de la grotte vers la fin) */}
        <path 
          d={`M -10,400 Q 200,${380 - 50 * brightness} 400,${400 + 20 * brightness} T 800,${410 - 30 * brightness} T 1010,390`} 
          fill={`rgba(${40 + 10 * brightness}, ${30 + 20 * brightness}, ${60 + 10 * brightness}, ${0.6 + 0.4 * brightness})`} 
          style={{ filter: 'blur(3px)' }}
        />
        
        {/* Herbes douces stylisées */}
        {Array.from({ length: 15 }).map((_, i) => (
          <path 
            key={`grass-${i}`} 
            d={`M ${70 + i * 60 + Math.sin(i) * 30},500 Q ${80 + i * 60 + Math.sin(i) * 30},${480 - Math.random() * 40} ${90 + i * 60 + Math.sin(i) * 30},500`} 
            stroke={`rgba(${140 + 60 * brightness}, ${160 + 70 * brightness}, ${100 + 90 * brightness}, ${0.4 + 0.4 * brightness})`} 
            strokeWidth="3"
            fill="none"
          />
        ))}
        
        {/* Fleurs pastel */}
        {Array.from({ length: 8 }).map((_, i) => (
          <g key={`flower-${i}`} style={{ opacity: 0.2 + 0.7 * brightness }}>
            <circle 
              cx={120 + i * 110 + Math.sin(i * 3) * 50} 
              cy={490 - Math.random() * 20} 
              r={3 + Math.random() * 3}
              fill={i % 3 === 0 ? '#ffb6c1' : i % 3 === 1 ? '#ffe4b5' : '#b0e0e6'} 
            />
          </g>
        ))}
        
        {/* Sentier subtil (clairière vers la grotte) */}
        <path 
          d="M 50,500 Q 300,480 500,510 Q 700,540 950,490" 
          stroke={`rgba(${170 + 50 * brightness}, ${160 + 70 * brightness}, ${190 + 30 * brightness}, ${0.3 + 0.2 * brightness})`} 
          strokeWidth="30" 
          fill="none" 
          strokeLinecap="round"
          style={{ filter: 'blur(8px)' }}
        />
        
        {/* Sol avec texture douce */}
        <rect x="0" y="500" width="1000" height="100" fill="url(#ground)" />
      </svg>
    );
  };

  // Nouvelle fonction pour l'effet de bloom autour des sphères
  const getBloomIntensity = () => {
    return 5 + 15 * brightness;
  };

  // Position sur le chemin avec une courbe plus naturelle et poétique
  const getMotherPosition = (progress: number) => {
    // Courbe poétique qui suit la clairière vers la grotte
    const t = progress / 100;
    // Position plus fluide avec une courbe cubique naturelle
    const x = 50 + 900 * t;
    // Mouvement ondulant léger pour donner une impression de flottement
    const y = 490 - 20 * Math.sin(t * Math.PI * 2) - t * 20;
    
    return { x, y };
  };
  
  // Démarre la musique douce au début
  useEffect(() => {
    if (musicRef.current && !muted) {
      musicRef.current.volume = 0.5;
      musicRef.current.loop = true;
      musicRef.current.play().catch(() => {});
    }
    if (birdsRef.current && !muted) {
      birdsRef.current.volume = 0.2;
      birdsRef.current.loop = true;
      birdsRef.current.play().catch(() => {});
    }
    if (windRef.current && !muted) {
      windRef.current.volume = 0.15;
      windRef.current.loop = true;
      windRef.current.play().catch(() => {});
    }
    if (muted) {
      musicRef.current?.pause();
      birdsRef.current?.pause();
      windRef.current?.pause();
    }
  }, [muted]);
  
  return (
    <div 
      className="fixed inset-0 flex flex-col overflow-hidden" 
      style={getBackgroundStyle()}
    >
      {/* Paysage naturel */}
      {renderBackgroundNature()}
      
      {/* Étoiles subtiles / particules de lumière */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {renderStars()}
      </div>
      
      {/* Messages dans le ciel */}
      <div className="relative flex-1 z-10">
        {messages.map(message => (
          <SkyMessage 
            key={message.id} 
            message={message} 
            progress={progress} 
            brightness={brightness}
          />
        ))}
      </div>
      
      {/* Zone des personnages (sphères lumineuses) */}
      <div className="relative h-1/2 pointer-events-none">
        {/* Mère-sphère qui suit le chemin */}
        <div style={{ position: 'absolute', left: 0, top: 0, width: '100%', height: '100%' }}>
          {(() => {
            const { x, y } = getMotherPosition(progress);
            return (
              <div style={{ position: 'absolute', left: `${x / 10}%`, top: `${y / 6}%` }}>
                <Character type="mother" progress={progress} brightness={brightness} />
              </div>
            );
          })()}
        </div>
        
        {/* Enfant-sphère qui attend à la fin */}
        <div style={{ position: 'absolute', right: '10%', bottom: '20%' }}>
          <Character type="child" progress={progress} brightness={brightness} />
        </div>
      </div>
      
      {/* Interaction initiale */}
      {progress === 0 && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/80 text-white z-20">
          <motion.div 
            className="text-center p-8 max-w-md"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.5, delay: 0.5 }}
          >
            <h2 
              style={{ 
                fontFamily: "'Cormorant Garamond', serif", 
                fontSize: '1.8rem', 
                fontWeight: 300,
                letterSpacing: '0.05em',
                marginBottom: '1.5rem',
                color: 'rgba(255, 255, 255, 0.95)',
                textShadow: '0 0 15px rgba(255, 255, 255, 0.8)'
              }}
            >
              Pour ma Mère
            </h2>
            <p 
              style={{ 
                fontFamily: "'Cormorant Garamond', serif", 
                fontSize: '1.2rem', 
                fontWeight: 300,
                lineHeight: 1.6,
                marginBottom: '2rem',
                color: 'rgba(255, 255, 255, 0.85)',
              }}
            >
              Suivez le voyage d'une sphère de lumière, symbole d'amour maternel, 
              dans un moment de tendresse partagée.
            </p>
            <motion.button
              className="px-6 py-3 rounded-full bg-white/20 hover:bg-white/30 text-white backdrop-blur-md"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setAutoProgress(true)}
            >
              Commencer l'expérience
            </motion.button>
            <p className="text-xs mt-6 text-white/60">
              Ou touchez l'écran pour avancer manuellement
            </p>
          </motion.div>
        </div>
      )}
      
      {/* Moment final de réunion */}
      {progress >= 95 && (
        <motion.div 
          className="fixed inset-0 flex flex-col items-center justify-center z-20"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 2 }}
        >
          <div className="text-center p-6">
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ 
                type: "spring", 
                stiffness: 100, 
                delay: 1, 
                duration: 1.5 
              }}
            >
              <div 
                style={{
                  width: '150px',
                  height: '150px',
                  borderRadius: '50%',
                  margin: '0 auto 2rem',
                  background: `radial-gradient(circle, rgba(255,255,255,0.9) 0%, rgba(255,230,240,0.8) 50%, rgba(255,200,230,0) 100%)`,
                  filter: 'blur(15px)',
                }}
              />
            </motion.div>
            
            <motion.p 
              style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: '2.2rem',
                fontWeight: 300,
                color: 'white',
                textShadow: '0 0 20px rgba(255, 255, 255, 0.8)'
              }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 2 }}
            >
              Je t'aime, Maman
            </motion.p>
          </div>
        </motion.div>
      )}
      
      {/* Audio */}
      <audio ref={musicRef} src={backgroundMusic} preload="auto" />
      <audio ref={birdsRef} src={birdsSound} preload="auto" />
      <audio ref={windRef} src={windSound} preload="auto" />
      
      {/* Bouton muet */}
      <button
        className="fixed top-4 right-4 z-50 bg-white/20 backdrop-blur-sm rounded-full w-12 h-12 flex items-center justify-center text-white hover:bg-white/30"
        onClick={() => setMuted((m) => !m)}
        aria-label={muted ? 'Activer le son' : 'Couper le son'}
      >
        {muted ? '🔇' : '🔊'}
      </button>
    </div>
  );
};

export default AnimationScene;