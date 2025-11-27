// src/components/AiOverlay.jsx
import React from 'react';
import { motion } from 'framer-motion';

const AiOverlay = () => {
  return (
    <div className="absolute inset-0 z-10 pointer-events-none flex flex-col justify-center items-center bg-black/50 backdrop-blur-[2px]">
      
      {/* The Text Pulse */}
      <motion.div 
        initial={{ opacity: 0.5 }}
        animate={{ opacity: 1 }}
        transition={{ repeat: Infinity, duration: 1, repeatType: "reverse" }}
        className="text-blue-400 font-mono text-lg font-bold mb-4 bg-gray-900 px-4 py-2 rounded border border-blue-500/50 shadow-[0_0_15px_rgba(59,130,246,0.5)]"
      >
        AI DEBUGGER RUNNING...
      </motion.div>

      {/* The Scanning Laser Line */}
      <motion.div
        className="absolute w-full h-[2px] bg-blue-500 shadow-[0_0_20px_#3b82f6]"
        initial={{ top: "0%" }}
        animate={{ top: "100%" }}
        transition={{ 
          duration: 2, 
          repeat: Infinity, 
          ease: "linear" 
        }}
      />
    </div>
  );
};

export default AiOverlay;