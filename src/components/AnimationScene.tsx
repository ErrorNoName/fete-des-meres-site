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
  
  // Background gradient based on progress
  const getBackgroundStyle = () => {
    const bgOpacity = Math.min(brightness * 1.5, 1);
    
    return {
      background: `
        linear-gradient(to bottom, 
          rgba(0, 0, 0, ${1 - bgOpacity}) 0%,
          rgba(${25 * brightness}, ${5 * brightness}, ${50 * brightness}, ${1 - brightness * 0.5}) 50%,
          rgba(${40 * brightness}, ${10 * brightness}, ${80 * brightness}, ${1 - brightness * 0.3}) 100%)
      `,
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
  
  // Ajout d'un paysage naturel épuré et d'un sentier
  const renderBackgroundNature = () => {
    // Prairie, sentier, arbres stylisés, soleil
    return (
      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 1000 600" preserveAspectRatio="none">
        {/* Ciel dégradé */}
        <defs>
          <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#b3e0ff" />
            <stop offset="100%" stopColor="#e6ffe6" />
          </linearGradient>
          <linearGradient id="ground" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#b6e2a1" />
            <stop offset="100%" stopColor="#6db37b" />
          </linearGradient>
        </defs>
        {/* Ciel */}
        <rect x="0" y="0" width="1000" height="400" fill="url(#sky)" />
        {/* Soleil */}
        <circle cx={200 + 600 * brightness} cy={120 - 40 * brightness} r="40" fill="#fff9c4" opacity={0.7 + 0.3 * brightness} />
        {/* Nuages */}
        <ellipse cx="300" cy="100" rx="60" ry="20" fill="#fff" opacity="0.5" />
        <ellipse cx="700" cy="80" rx="50" ry="18" fill="#fff" opacity="0.4" />
        {/* Arbres */}
        <ellipse cx="120" cy="340" rx="18" ry="60" fill="#a3c585" opacity="0.7" />
        <ellipse cx="880" cy="350" rx="22" ry="70" fill="#a3c585" opacity="0.6" />
        {/* Sol */}
        <rect x="0" y="400" width="1000" height="200" fill="url(#ground)" />
        {/* Sentier sinueux */}
        <path d="M 100 500 Q 300 420 500 520 Q 700 600 900 480" stroke="#e2c799" strokeWidth="30" fill="none" opacity="0.7" />
        {/* Fleurs */}
        <circle cx="200" cy="550" r="5" fill="#ffb6b9" />
        <circle cx="800" cy="570" r="4" fill="#fff176" />
      </svg>
    );
  };
  
  // Améliore le mouvement du personnage pour suivre le sentier
  const getMotherPosition = (progress: number) => {
    // Sentier : M 100 500 Q 300 420 500 520 Q 700 600 900 480
    // Interpolation sur 3 segments de Bézier
    const t = progress / 100;
    let x, y;
    if (t < 0.5) {
      // Premier segment
      const t2 = t * 2;
      // Quadratic Bézier: (1-t)^2*100 + 2*(1-t)*t*300 + t^2*500
      x = (1 - t2) * (1 - t2) * 100 + 2 * (1 - t2) * t2 * 300 + t2 * t2 * 500;
      y = (1 - t2) * (1 - t2) * 500 + 2 * (1 - t2) * t2 * 420 + t2 * t2 * 520;
    } else {
      // Second segment
      const t2 = (t - 0.5) * 2;
      x = (1 - t2) * (1 - t2) * 500 + 2 * (1 - t2) * t2 * 700 + t2 * t2 * 900;
      y = (1 - t2) * (1 - t2) * 520 + 2 * (1 - t2) * t2 * 600 + t2 * t2 * 480;
    }
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
      className="fixed inset-0 flex flex-col overflow-hidden bg-gradient-to-b from-blue-100 to-green-200" 
      style={getBackgroundStyle()}
    >
      {/* Paysage naturel */}
      {renderBackgroundNature()}
      {/* Stars in the background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {renderStars()}
      </div>
      
      {/* Messages in the sky */}
      <div className="relative flex-1">
        {messages.map(message => (
          <SkyMessage 
            key={message.id} 
            message={message} 
            progress={progress} 
            brightness={brightness}
          />
        ))}
      </div>
      
      {/* Ground with characters */}
      <div className="relative" style={groundStyle}>
        {/* Personnage mère suit le sentier */}
        <div style={{ position: 'absolute', left: 0, top: 0, width: '100%', height: '100%', pointerEvents: 'none' }}>
          {(() => {
            const { x, y } = getMotherPosition(progress);
            return (
              <div style={{ position: 'absolute', left: `${x / 10}%`, top: `${y / 6}%`, transform: 'translate(-50%, -50%)' }}>
                <Character type="mother" progress={progress} brightness={brightness} />
              </div>
            );
          })()}
        </div>
        {/* Personnage enfant à la fin du sentier */}
        {progress > 90 && (
          <div style={{ position: 'absolute', left: '90%', top: '80%', transform: 'translate(-50%, -50%)' }}>
            <Character type="child" progress={progress} brightness={brightness} />
          </div>
        )}
      </div>
      
      {/* Initial instructions overlay */}
      {progress === 0 && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/70 text-white z-10">
          <div className="text-center p-6">
            <p className="text-xl mb-4">Secouez votre téléphone pour commencer</p>
            <div className="animate-bounce">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 2v20M4 12l8 8 8-8"/>
              </svg>
            </div>
          </div>
        </div>
      )}
      
      {/* Final message with heart animation */}
      {showFinalMessage && (
        <motion.div 
          className="fixed inset-0 flex flex-col items-center justify-center z-20"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
        >
          <div className="bg-black/30 backdrop-blur-sm p-8 rounded-xl text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.5, duration: 0.8, type: "spring" }}
            >
              <Heart className="w-20 h-20 text-pink-500 mx-auto mb-4 animate-pulse" />
            </motion.div>
            
            <motion.p 
              className="text-3xl font-light text-white"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 1, duration: 0.5 }}
            >
              Je t'aime
            </motion.p>
          </div>
        </motion.div>
      )}
      
      {/* Visual feedback for shake detection */}
      {shakeDetected && (
        <div className="fixed inset-0 bg-white/10 pointer-events-none" />
      )}
      
      {/* Progress indicator */}
      <div className="fixed bottom-4 left-4 right-4 h-1 bg-white/20 rounded-full overflow-hidden">
        <div 
          className="h-full bg-purple-500 rounded-full"
          style={{ width: `${progress}%` }}
        />
      </div>
      
      {/* Audio elements */}
      <audio ref={musicRef} src={backgroundMusic} preload="auto" />
      <audio ref={birdsRef} src={birdsSound} preload="auto" />
      <audio ref={windRef} src={windSound} preload="auto" />
      {/* Bouton mute */}
      <button
        className="fixed top-4 right-4 z-50 bg-white/70 rounded-full px-3 py-2 text-gray-700 text-sm shadow"
        onClick={() => setMuted((m) => !m)}
        aria-label={muted ? 'Activer le son' : 'Couper le son'}
      >
        {muted ? '🔇 Son coupé' : '🔊 Son actif'}
      </button>
    </div>
  );
};

export default AnimationScene;