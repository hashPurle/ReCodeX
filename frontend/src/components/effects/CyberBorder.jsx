import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Box } from '@mui/material';

const CyberBorder = () => {
  const [isVisible, setIsVisible] = useState(false);

  // --- MOUSE IDLE DETECTION ---
  useEffect(() => {
    let idleTimer;

    const handleMouseMove = () => {
      // 1. Wake up the border immediately
      setIsVisible(true);

      // 2. Clear existing timer so it doesn't fade while moving
      clearTimeout(idleTimer);

      // 3. Set a new timer to fade out after 2 seconds of stillness
      idleTimer = setTimeout(() => {
        setIsVisible(false);
      }, 2000);
    };

    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      clearTimeout(idleTimer);
    };
  }, []);

  // Animation variants for the glowing pulse
  const borderVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { duration: 0.5 } // Smooth fade in
    },
    pulse: {
      boxShadow: [
        'inset 0 0 20px 2px rgba(47, 129, 247, 0.3)', // Blue
        'inset 0 0 30px 4px rgba(163, 113, 247, 0.4)', // Purple
        'inset 0 0 20px 2px rgba(56, 189, 248, 0.3)', // Cyan
        'inset 0 0 20px 2px rgba(47, 129, 247, 0.3)'  // Back to Blue
      ],
      transition: {
        duration: 4,
        repeat: Infinity,
        ease: "linear"
      }
    },
  };

  return (
    <Box
      sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 9999,
        pointerEvents: 'none',
        overflow: 'hidden',
      }}
    >
      {/* 1. The Interactive Glow Layer */}
      <motion.div
        initial="hidden"
        animate={isVisible ? ["visible", "pulse"] : "hidden"}
        variants={borderVariants}
        style={{
          position: 'absolute',
          inset: 0,
        }}
      />

      {/* 2. Static Thin Tech Border (Always visible for structure, or remove if you want total darkness) */}
      <motion.div 
        animate={{ opacity: isVisible ? 1 : 0.3 }} // Dims when idle
        transition={{ duration: 1 }}
        style={{
          position: 'absolute',
          inset: '2px',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          mixBlendMode: 'overlay'
        }}
      />

      {/* 3. Corner Accents (Always visible but dim when idle) */}
      <motion.div 
        animate={{ opacity: isVisible ? 1 : 0.2 }} // Dims when idle
        transition={{ duration: 1 }}
      >
        {/* Top Left */}
        <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-blue-500/50 rounded-tl-md" />
        {/* Top Right */}
        <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-purple-500/50 rounded-tr-md" />
        {/* Bottom Left */}
        <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-purple-500/50 rounded-bl-md" />
        {/* Bottom Right */}
        <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-blue-500/50 rounded-br-md" />
      </motion.div>

    </Box>
  );
};

export default CyberBorder;