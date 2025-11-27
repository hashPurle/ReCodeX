import React, { useState } from 'react';
import { Paper, Box, Button } from '@mui/material';
import { Terminal, Cpu } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// --- IMPORT ANIMATIONS ---
import { tabContentVar } from '../animations/variants';

// --- IMPORT EFFECTS ---
import HackerText from './effects/HackerText';
import Typewriter from './effects/Typewriter';

const OutputPanel = () => {
  const [activeTab, setActiveTab] = useState('terminal'); // 'terminal' | 'reasoning'

  return (
    <Paper 
      square 
      elevation={0}
      sx={{ 
        width: '100%', 
        height: '100%', 
        display: 'flex', 
        flexDirection: 'column', 
        bgcolor: '#0d1117', 
        borderLeft: '1px solid #30363d' 
      }}
    >
      
      {/* --- TAB HEADER --- */}
      <Box sx={{ borderBottom: '1px solid #30363d', bgcolor: '#161b22', display: 'flex' }}>
        
        {/* Terminal Tab Button */}
        <Button
          onClick={() => setActiveTab('terminal')}
          startIcon={<Terminal size={14} />}
          sx={{
            borderRadius: 0,
            textTransform: 'none',
            color: activeTab === 'terminal' ? '#58a6ff' : '#8b949e',
            borderBottom: activeTab === 'terminal' ? '2px solid #58a6ff' : '2px solid transparent',
            bgcolor: activeTab === 'terminal' ? 'rgba(88, 166, 255, 0.1)' : 'transparent',
            '&:hover': { bgcolor: 'rgba(88, 166, 255, 0.05)', color: '#c9d1d9' },
            px: 2,
            py: 1.5,
            fontWeight: 600,
            fontSize: '0.8rem',
            minWidth: 120,
            transition: 'all 0.2s'
          }}
        >
          {/* HACKER TEXT EFFECT: Decrypts "TERMINAL" when loaded */}
          <HackerText text="TERMINAL" />
        </Button>

        {/* AI Reasoning Tab Button */}
        <Button
          onClick={() => setActiveTab('reasoning')}
          startIcon={<Cpu size={14} />}
          sx={{
            borderRadius: 0,
            textTransform: 'none',
            color: activeTab === 'reasoning' ? '#a371f7' : '#8b949e',
            borderBottom: activeTab === 'reasoning' ? '2px solid #a371f7' : '2px solid transparent',
            bgcolor: activeTab === 'reasoning' ? 'rgba(163, 113, 247, 0.1)' : 'transparent',
            '&:hover': { bgcolor: 'rgba(163, 113, 247, 0.05)', color: '#c9d1d9' },
            px: 2,
            py: 1.5,
            fontWeight: 600,
            fontSize: '0.8rem',
            minWidth: 140,
            transition: 'all 0.2s'
          }}
        >
          {/* HACKER TEXT EFFECT: Decrypts "AI REASONING" */}
          <HackerText text="AI REASONING" />
        </Button>
      </Box>
      
      {/* --- ANIMATED CONTENT AREA --- */}
      <Box sx={{ flex: 1, overflowY: 'auto', position: 'relative', overflowX: 'hidden' }}>
        <AnimatePresence mode="wait">
          
          {activeTab === 'terminal' ? (
            <motion.div
              key="terminal"
              variants={tabContentVar}
              initial="hidden"
              animate="visible"
              exit="exit"
              style={{ padding: 16 }}
            >
              {/* TERMINAL CONTENT (Static error logs) */}
              <Box sx={{ fontFamily: 'monospace', fontSize: '0.85rem', color: '#ff7b72', lineHeight: 1.6 }}>
                <span style={{ color: '#8b949e' }}>$ python3 script.py</span><br/>
                &gt; TypeError: cannot unpack non-iterable int object<br/>
                &gt; at line 14, in bubble_sort<br/>
                &gt; <br/>
                &gt; Process exited with code 1
              </Box>
            </motion.div>
          ) : (
            <motion.div
              key="reasoning"
              variants={tabContentVar}
              initial="hidden"
              animate="visible"
              exit="exit"
              style={{ padding: 16 }}
            >
              {/* AI REASONING CONTENT (Animated Typewriter) */}
              <Box sx={{ fontFamily: 'monospace', fontSize: '0.85rem', color: '#a371f7', lineHeight: 1.6 }}>
                 <Typewriter 
                   speed={15}
                   delay={200}
                   text="> [INFO] Analyzing execution stack trace... | > [WARN] Identified variable type mismatch at line 14. | > [THINKING] The user is trying to swap variables but used assignment. | > [ACTION] Generating Patch #1: Implementing tuple swap. | > [SUCCESS] Patch generated. Ready to review."
                 />
              </Box>
            </motion.div>
          )}

        </AnimatePresence>
      </Box>
    </Paper>
  );
};

export default OutputPanel;