// src/components/AiOverlay.jsx
import React from 'react';
import { motion } from 'framer-motion';
import { Cpu } from 'lucide-react';

const AiOverlay = () => {
  return (
    <div className="absolute inset-0 z-20 pointer-events-none flex flex-col justify-center items-center overflow-hidden bg-[#0d1117]/60 backdrop-blur-[1px]">
      
      {/* Central Pulsing Status */}
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-[#161b22] border border-blue-500/30 px-6 py-3 rounded-full shadow-[0_0_30px_rgba(59,130,246,0.3)] flex items-center gap-3"
      >
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        >
          <Cpu size={20} className="text-blue-400" />
        </motion.div>
        <motion.span 
          animate={{ opacity: [1, 0.5, 1] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="text-blue-100 font-mono font-semibold text-sm tracking-wider"
        >
          AI NEURAL SCAN IN PROGRESS...
        </motion.span>
      </motion.div>

      {/* The Electric Laser Scanner */}
      <motion.div
        className="absolute w-full h-[3px] bg-gradient-to-r from-transparent via-blue-500 to-transparent"
        style={{ boxShadow: '0 0 15px #3b82f6, 0 0 30px #3b82f6' }}
        initial={{ top: "-10%" }}
        animate={{ top: "110%" }}
        transition={{ 
          duration: 1.8, 
          repeat: Infinity, 
          ease: "easeInOut" 
        }}
      />
    </div>
  );
};

export default AiOverlay;