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
        y: [0, -12, 0],
        boxShadow: [
          '0 0 60px 20px #ffe7b7',
          '0 0 80px 40px #ffd6e0',
          '0 0 60px 20px #ffe7b7',
        ],
      }}
      transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
      className="w-48 h-48 md:w-64 md:h-64 flex items-center justify-center relative"
      style={{ filter: 'blur(0.5px)' }}
    >
      <Canvas camera={{ position: [0, 0, 5] }} style={{ borderRadius: '50%' }}>
        <ambientLight intensity={0.7} />
        <pointLight position={[0, 0, 2]} intensity={1.5} color="#ffe7b7" />
        <Sphere args={[1, 32, 32]}>
          <meshStandardMaterial
            color={playing ? "#ffd700" : "#fff8e7"}
            emissive="#ffd700"
            emissiveIntensity={playing ? 1.5 : 0.7}
            roughness={0.18}
            metalness={0.7}
          />
        </Sphere>
      </Canvas>
      {/* Halo lumineux doux */}
      <div
        className="absolute rounded-full pointer-events-none"
        style={{
          width: '100%',
          height: '100%',
          left: 0,
          top: 0,
          background: 'radial-gradient(circle, #ffe7b7 0%, #ffd6e0 60%, transparent 100%)',
          opacity: 0.25,
          zIndex: 1,
        }}
      />
    </motion.div>
  );
};
