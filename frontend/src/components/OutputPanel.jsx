import React from 'react';
import { Paper, Box, Typography } from '@mui/material';
import { Terminal, Sparkles, MessageSquare } from 'lucide-react'; // Added MessageSquare
import { motion, AnimatePresence } from 'framer-motion';

import { tabContentVar } from '../animations/variants';
import Typewriter from './effects/Typewriter';
import ChatInterface from './ChatInterface'; // <--- NEW IMPORT

const OutputPanel = ({ activeTab, logs, reasoning, error }) => {

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
              <Box sx={{ fontFamily: 'monospace', fontSize: '0.85rem', color: '#ff7b72', lineHeight: 1.6, whiteSpace: 'pre-wrap' }}>
                <span style={{ color: '#8b949e' }}>$ python3 script.py</span><br/>
                {logs || (error ? `> ${error}` : `> Process not run yet`)}
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
              <Box sx={{ fontFamily: 'monospace', fontSize: '0.85rem', color: '#a371f7', lineHeight: 1.6, whiteSpace: 'pre-wrap' }}>
                {/* Show reasoning (could be raw AI response or object) */}
                {typeof reasoning === 'string' && reasoning ? (
                  <Typewriter speed={15} delay={200} text={reasoning} />
                ) : reasoning?.response ? (
                  <Box>
                    {error && (
                      <Box sx={{ fontSize: '0.8rem', color: '#ff7b72', mb: 1 }}>Error: <code style={{ fontFamily: 'JetBrains Mono' }}>{error}</code></Box>
                    )}
                    <Typewriter speed={15} delay={200} text={reasoning.response} />
                    {reasoning.prompt && (
                      <Box mt={1} sx={{ fontSize: '0.7rem', color: '#8b949e' }}>Prompt used: <code style={{fontFamily: 'JetBrains Mono'}}>{reasoning.prompt}</code></Box>
                    )}
                  </Box>
                ) : (
                  <Box sx={{ color: '#8b949e' }}>No AI reasoning yet</Box>
                )}
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
              <ChatInterface context={{ reasoning, logs, error }} />
            </motion.div>
          )}

        </AnimatePresence>
      </Box>
    </Paper>
  );
};

export default OutputPanel;