// src/App.jsx
import React from 'react';
import { Box, Paper, Typography, Button, Stack, Chip } from '@mui/material';
import { Play, Cpu, FileCode } from 'lucide-react';
import Editor from "@monaco-editor/react";
import AiOverlay from './components/AiOverlay'; // Import your animation

// DUMMY DATA (Use this until your teammate connects the API)
const isAiWorking = true; // Toggle this to false to hide the animation

function App() {
  return (
    <Box sx={{ height: '100vh', display: 'flex', flexDirection: 'column', bgcolor: 'background.default', color: 'text.primary' }}>
      
      {/* 1. NAVBAR */}
      <Box sx={{ height: 60, borderBottom: '1px solid #30363d', display: 'flex', alignItems: 'center', px: 3, justifyContent: 'space-between' }}>
        <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'primary.main' }}>
          <Cpu size={20} /> AutoBugFix_
        </Typography>
        <Button variant="contained" startIcon={<Play size={16} />}>
          Start Auto-Repair
        </Button>
      </Box>

      {/* 2. MAIN GRID */}
      <Box sx={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
        
        {/* COLUMN A: Sidebar (History) */}
        <Paper square sx={{ width: 250, borderRight: '1px solid #30363d', display: 'flex', flexDirection: 'column' }}>
          <Box p={2} borderBottom="1px solid #30363d">
            <Typography variant="subtitle2" color="text.secondary">FILES</Typography>
            <Stack direction="row" spacing={1} mt={1} alignItems="center" sx={{ color: 'white', cursor: 'pointer' }}>
              <FileCode size={16} color="#2f81f7"/> 
              <Typography variant="body2">script.py</Typography>
            </Stack>
          </Box>
          <Box p={2} flex={1}>
            <Typography variant="subtitle2" color="text.secondary" mb={2}>REPAIR HISTORY</Typography>
            {/* Mock Timeline */}
            <Stack spacing={2}>
              <Chip label="v1.0 Original" size="small" variant="outlined" sx={{ justifyContent: 'flex-start' }} />
              <Chip label="v1.1 Patching..." size="small" color="secondary" sx={{ justifyContent: 'flex-start' }} />
            </Stack>
          </Box>
        </Paper>

        {/* COLUMN B: The Code Editor (The Stage) */}
        <Box sx={{ flex: 1, position: 'relative', borderRight: '1px solid #30363d' }}>
          
          {/* THE AI ANIMATION OVERLAY */}
          {isAiWorking && <AiOverlay />}

          <Editor
            height="100%"
            defaultLanguage="python"
            theme="vs-dark"
            defaultValue="# Paste broken code here..."
            options={{
              minimap: { enabled: false },
              fontSize: 14,
              padding: { top: 20 }
            }}
          />
        </Box>

        {/* COLUMN C: Output Console */}
        <Paper square sx={{ width: 350, display: 'flex', flexDirection: 'column', bgcolor: '#0d1117' }}>
          <Box p={1.5} borderBottom="1px solid #30363d" bgcolor="#161b22">
            <Typography variant="subtitle2" fontWeight="bold">TERMINAL OUTPUT</Typography>
          </Box>
          <Box p={2} sx={{ fontFamily: 'monospace', fontSize: '0.85rem', color: '#ff7b72' }}>
            {/* Mock Error */}
            > TypeError: cannot unpack non-iterable int object<br/>
            > at line 14, in bubble_sort
          </Box>
          
          <Box p={1.5} borderTop="1px solid #30363d" borderBottom="1px solid #30363d" bgcolor="#161b22" mt="auto">
            <Typography variant="subtitle2" fontWeight="bold" color="secondary.main">AI REASONING</Typography>
          </Box>
          <Box p={2} sx={{ height: 200, fontFamily: 'monospace', fontSize: '0.85rem', color: '#a371f7' }}>
             > Analyzing stack trace...<br/>
             > Identified variable type mismatch.<br/>
             > Generating Patch #1...
          </Box>
        </Paper>

      </Box>
    </Box>
  );
}

export default App;