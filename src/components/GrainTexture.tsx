import React from 'react';

export const GrainTexture = () => (
  <div className="hidden md:fixed md:inset-0 md:block pointer-events-none z-50 opacity-[0.03] dark:opacity-[0.05] mix-blend-overlay dark:mix-blend-soft-light">
    <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      <filter id="noiseFilter">
        <feTurbulence 
          type="fractalNoise" 
          baseFrequency="0.65" 
          numOctaves="3" 
          stitchTiles="stitch" />
      </filter>
      <rect width="100%" height="100%" filter="url(#noiseFilter)" />
    </svg>
  </div>
);
