// src/components/OutputPanel.jsx
import React from 'react';
import { Paper, Box, Typography } from '@mui/material';
import { Terminal, Cpu } from 'lucide-react';

const OutputPanel = () => {
  return (
    <Paper square sx={{ width: 350, display: 'flex', flexDirection: 'column', bgcolor: '#0d1117', borderLeft: '1px solid #30363d' }}>
      
      {/* Terminal Header */}
      <Box p={1.5} borderBottom="1px solid #30363d" bgcolor="#161b22" display="flex" alignItems="center" gap={1}>
        <Terminal size={14} color="#8b949e"/>
        <Typography variant="subtitle2" fontWeight="bold" color="text.secondary">TERMINAL</Typography>
      </Box>
      
      {/* Terminal Body */}
      <Box p={2} sx={{ fontFamily: 'monospace', fontSize: '0.85rem', color: '#ff7b72', overflowY: 'auto', flex: 1 }}>
        > TypeError: cannot unpack non-iterable int object<br/>
        > at line 14, in bubble_sort
      </Box>
      
      {/* AI Reasoning Header */}
      <Box p={1.5} borderTop="1px solid #30363d" borderBottom="1px solid #30363d" bgcolor="#161b22" display="flex" alignItems="center" gap={1} mt="auto">
        <Cpu size={14} color="#a371f7"/>
        <Typography variant="subtitle2" fontWeight="bold" color="secondary.main">AI REASONING</Typography>
      </Box>
      
      {/* AI Reasoning Body */}
      <Box p={2} sx={{ height: 200, fontFamily: 'monospace', fontSize: '0.85rem', color: '#a371f7', bgcolor: '#0d1117' }}>
         > Analyzing stack trace...<br/>
         > Identified variable type mismatch.<br/>
         > Generating Patch #1...
      </Box>
    </Paper>
  );
};

export default OutputPanel;