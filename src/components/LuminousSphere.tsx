import React from 'react';
import { Canvas } from '@react-three/fiber';
import { Sphere } from '@react-three/drei';
import { motion } from 'framer-motion';

interface Props {
  playing: boolean;
}

export const LuminousSphere: React.FC<Props> = ({ playing }) => {
  return (
    <motion.div
      animate={{
        y: [0, -8, 0],
        filter: [
          'drop-shadow(0 0 16px #ffe7b7)',
          'drop-shadow(0 0 32px #ffd6e0)',
          'drop-shadow(0 0 16px #ffe7b7)',
        ],
      }}
      transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
      className="w-40 h-40 md:w-56 md:h-56 flex items-center justify-center relative"
      style={{ zIndex: 20 }}
    >
      {/* Halo pixel art */}
      <svg
        className="absolute left-1/2 top-1/2"
        style={{
          transform: 'translate(-50%,-50%)',
          zIndex: 1,
          pointerEvents: 'none',
        }}
        width="220"
        height="220"
      >
        <defs>
          <radialGradient id="halo" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#ffe7b7" stopOpacity="0.7" />
            <stop offset="60%" stopColor="#ffd6e0" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#fff" stopOpacity="0" />
          </radialGradient>
        </defs>
        <circle cx="110" cy="110" r="100" fill="url(#halo)" />
      </svg>
      <Canvas camera={{ position: [0, 0, 5] }} style={{ borderRadius: '50%' }}>
        <ambientLight intensity={0.7} />
        <pointLight position={[0, 0, 2]} intensity={1.5} color="#ffe7b7" />
        <Sphere args={[1, 32, 32]}>
          <meshStandardMaterial
            color={playing ? '#ffd700' : '#fff8e7'}
            emissive="#ffd700"
            emissiveIntensity={playing ? 1.5 : 0.7}
            roughness={0.18}
            metalness={0.7}
          />
        </Sphere>
      </Canvas>
    </motion.div>
  );
};
