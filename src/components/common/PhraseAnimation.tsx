'use client';
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const phrases = ['Debug Faster', 'Build Faster', 'Ship Faster'];

const PhraseAnimation: React.FC = () => {
  const [currentPhraseIndex, setCurrentPhraseIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      // every 2 seconds
      setCurrentPhraseIndex((prevIndex) => (prevIndex + 1) % phrases.length);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <motion.div
          key={currentPhraseIndex}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.5 }}
        >
          {phrases[currentPhraseIndex]}
        </motion.div>
      </div>
    </div>
  );
};

export default PhraseAnimation;
