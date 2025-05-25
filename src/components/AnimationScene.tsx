import React, { useState, useEffect, useRef } from 'react';
import { useAnimation } from '../context/AnimationContext';
import Character from './Character';
import SkyMessage from './SkyMessage';
import { Heart } from 'lucide-react';
import { motion } from 'framer-motion';

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
  
  return (
    <div 
      className="fixed inset-0 flex flex-col overflow-hidden" 
      style={getBackgroundStyle()}
    >
      {/* Stars in the background */}
      <div className="absolute inset-0 overflow-hidden">
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
        <Character type="mother" progress={progress} brightness={brightness} />
        <Character type="child" progress={progress} brightness={brightness} />
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
    </div>
  );
};

export default AnimationScene;