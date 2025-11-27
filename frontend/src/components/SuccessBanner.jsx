// src/components/SuccessBanner.jsx
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, ArrowRight, Sparkles } from 'lucide-react';
import { Button, Box, Typography, IconButton } from '@mui/material';

const SuccessBanner = ({ onApply, onClose }) => {
  return (
    <AnimatePresence>
      <motion.div 
        initial={{ y: 100, opacity: 0, scale: 0.9 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        exit={{ y: 20, opacity: 0, scale: 0.95 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
        className="absolute bottom-4 right-4 z-50"
      >
        <Box 
          sx={{ 
            bgcolor: 'rgba(22, 27, 34, 0.95)', // Glass effect
            backdropFilter: 'blur(10px)',
            border: '1px solid #2ea043',
            boxShadow: '0 0 20px rgba(46, 160, 67, 0.2)',
            borderRadius: 2,
            p: 2,
            display: 'flex',
            alignItems: 'flex-start',
            gap: 2,
            maxWidth: 400,
            position: 'relative',
            overflow: 'hidden'
          }}
        >
          {/* Subtle background glow effect */}
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-green-500 to-emerald-500" />

          <CheckCircle2 size={28} className="text-green-400 mt-1" />
          
          <Box flex={1}>
            <Typography variant="subtitle1" fontWeight="bold" color="white" display="flex" itemsCenter gap={1}>
              Patch Successfully Generated! <Sparkles size={16} className="text-yellow-400" />
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              The AI has resolved the recursion error. Review the diff before applying.
            </Typography>
            
            <Box display="flex" gap={1}>
              <Button 
                variant="contained" 
                color="success" 
                size="small" 
                endIcon={<ArrowRight size={16}/>}
                onClick={onApply}
                sx={{ fontWeight: 'bold', borderRadius: 1, textTransform: 'none', boxShadow: '0 0 10px rgba(46, 160, 67, 0.3)' }}
              >
                Review Fix
              </Button>
              <Button size="small" onClick={onClose} sx={{ color: 'text.secondary', textTransform: 'none' }}>
                Dismiss
              </Button>
            </Box>
          </Box>
        </Box>
      </motion.div>
    </AnimatePresence>
  );
};

export default SuccessBanner;