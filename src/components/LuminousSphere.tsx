import React from 'react';

export const LuminousSphere: React.FC<{ playing: boolean }> = ({ playing }) => (
  <div
    style={{
      width: 120,
      height: 120,
      borderRadius: '50%',
      background: 'radial-gradient(circle at 60% 40%, #fffbe6 0%, #ffe7b7 60%, #e0b7e6 100%)',
      boxShadow: playing
        ? '0 0 60px 30px #ffe7b7, 0 0 120px 60px #e0b7e6'
        : '0 0 30px 10px #ffe7b7',
      opacity: playing ? 1 : 0.7,
      transition: 'box-shadow 0.6s, opacity 0.6s',
      margin: '0 auto',
    }}
    aria-label="Luminous Sphere"
  />
);