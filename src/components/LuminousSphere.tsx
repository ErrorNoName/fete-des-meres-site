import React from 'react';
import { Canvas } from '@react-three/fiber';
import { Sphere } from '@react-three/drei';

interface Props {
  playing: boolean;
}

export const LuminousSphere: React.FC<Props> = ({ playing }) => {
  return (
    <div className="w-64 h-64">
      <Canvas camera={{ position: [0, 0, 5] }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} />
        
        <Sphere args={[1, 32, 32]}>
          <meshStandardMaterial
            color={playing ? "#ffd700" : "#fff8e7"}
            emissive="#ffd700"
            emissiveIntensity={playing ? 1.5 : 0.5}
            roughness={0.2}
            metalness={0.8}
          />
        </Sphere>
      </Canvas>
    </div>
  );
};
