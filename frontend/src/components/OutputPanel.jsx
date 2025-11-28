import React from 'react';
import { Paper, Box, Typography } from '@mui/material';
import { Terminal, Sparkles, MessageSquare } from 'lucide-react'; // Added MessageSquare
import { motion, AnimatePresence } from 'framer-motion';

import { tabContentVar } from '../animations/variants';
import Typewriter from './effects/Typewriter';
import ChatInterface from './ChatInterface'; // <--- NEW IMPORT

const OutputPanel = ({ activeTab }) => {

  // Configuration for the Header Label
  const headerConfig = {
    terminal: { title: 'TERMINAL OUTPUT', icon: <Terminal size={16} />, color: '#58a6ff' },
    reasoning: { title: 'AI REASONING LOGS', icon: <Sparkles size={16} />, color: '#a371f7' },
    chat:      { title: 'AI ASSISTANT CHAT', icon: <MessageSquare size={16} />, color: '#238636' } // New Config
  }[activeTab];

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
      
      {/* SECTION HEADER */}
      <Box 
        sx={{ 
          p: 1.5,
          height: 48, 
          borderBottom: '1px solid #30363d', 
          bgcolor: '#161b22', 
          display: 'flex', 
          alignItems: 'center',
          gap: 1.5
        }}
      >
        <Box sx={{ color: headerConfig.color, display: 'flex' }}>
          {headerConfig.icon}
        </Box>
        <Typography 
          variant="subtitle2" 
          sx={{ 
            fontFamily: 'JetBrains Mono, monospace', 
            fontWeight: 700, 
            color: headerConfig.color,
            letterSpacing: 1,
            fontSize: '0.75rem'
          }}
        >
          {headerConfig.title}
        </Typography>
      </Box>
      
      {/* ANIMATED CONTENT AREA */}
      <Box sx={{ flex: 1, overflow: 'hidden', position: 'relative' }}> {/* Removed overflowY:auto from here, individual components handle scrolling */}
        <AnimatePresence mode="wait">
          
          {/* 1. TERMINAL */}
          {activeTab === 'terminal' && (
            <motion.div
              key="terminal"
              variants={tabContentVar}
              initial="hidden" animate="visible" exit="exit"
              style={{ padding: 16, height: '100%', overflowY: 'auto' }}
            >
              <Box sx={{ fontFamily: 'monospace', fontSize: '0.85rem', color: '#ff7b72', lineHeight: 1.6 }}>
                <span style={{ color: '#8b949e' }}>$ python3 script.py</span><br/>
                &gt; TypeError: cannot unpack non-iterable int object<br/>
                &gt; at line 14, in bubble_sort<br/>
                &gt; <br/>
                &gt; Process exited with code 1
              </Box>
            </motion.div>
          )}

          {/* 2. AI REASONING */}
          {activeTab === 'reasoning' && (
            <motion.div
              key="reasoning"
              variants={tabContentVar}
              initial="hidden" animate="visible" exit="exit"
              style={{ padding: 16, height: '100%', overflowY: 'auto' }}
            >
              <Box sx={{ fontFamily: 'monospace', fontSize: '0.85rem', color: '#a371f7', lineHeight: 1.6 }}>
                 <Typewriter 
                   speed={15}
                   delay={200}
                   text="> [INFO] Analyzing execution stack trace... | > [WARN] Identified variable type mismatch at line 14. | > [THINKING] The user is trying to swap variables but used assignment. | > [ACTION] Generating Patch #1: Implementing tuple swap. | > [SUCCESS] Patch generated. Ready to review."
                 />
              </Box>
            </motion.div>
          )}

          {/* 3. CHAT INTERFACE (NEW) */}
          {activeTab === 'chat' && (
            <motion.div
              key="chat"
              variants={tabContentVar}
              initial="hidden" animate="visible" exit="exit"
              style={{ height: '100%' }}
            >
              <ChatInterface />
            </motion.div>
          )}

        </AnimatePresence>
      </Box>
    </Paper>
  );
};

export default OutputPanel;