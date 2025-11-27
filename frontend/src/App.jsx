// src/App.jsx
import React, { useEffect } from 'react';
import { Box, Paper, Typography, Button, Stack, Chip } from '@mui/material';
import { Play, Cpu, FileCode } from 'lucide-react';
import Editor from "@monaco-editor/react";

import AiOverlay from './components/AiOverlay'; 
import { useRepairEngine } from "./hooks/useRepairEngine";  // Your logic engine

function App() {
  const engine = useRepairEngine();

  // TEMPORARY TESTING → This is for you (Frontend Dev 2)
  useEffect(() => {
    engine.loadCode("print('hello')");

    engine.runCurrentCode().then((res) => {
      console.log("RUN:", res);
    });

    engine.startFullRepair(2).then((res) => {
      console.log("REPAIR:", res);
    });
  }, []);

  const isAiWorking = false; // Vishal can toggle this for animation

  return (
    <Box sx={{ height: '100vh', display: 'flex', flexDirection: 'column', bgcolor: 'background.default', color: 'text.primary' }}>

      {/* 1. NAVBAR */}
      <Box sx={{ height: 60, borderBottom: '1px solid #30363d', display: 'flex', alignItems: 'center', px: 3, justifyContent: 'space-between' }}>
        <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'primary.main' }}>
          <Cpu size={20} /> AutoBugFix_
        </Typography>
        <Button 
          variant="contained" 
          startIcon={<Play size={16} />}
          onClick={() => engine.startFullRepair()}
        >
          Start Auto-Repair
        </Button>
      </Box>

      {/* 2. MAIN GRID */}
      <Box sx={{ flex: 1, display: 'flex', overflow: 'hidden' }}>

        {/* COLUMN A: Sidebar */}
        <Paper square sx={{ width: 250, borderRight: '1px solid #30363d', display: 'flex', flexDirection: 'column' }}>
          <Box p={2} borderBottom="1px solid #30363d">
            <Typography variant="subtitle2" color="text.secondary">FILES</Typography>
            <Stack direction="row" spacing={1} mt={1} alignItems="center" sx={{ color: 'white', cursor: 'pointer' }}>
              <FileCode size={16} color="#2f81f7" />
              <Typography variant="body2">script.py</Typography>
            </Stack>
          </Box>

          <Box p={2} flex={1}>
            <Typography variant="subtitle2" color="text.secondary" mb={2}>REPAIR HISTORY</Typography>
            <Stack spacing={2}>
              <Chip label="v1.0 Original" size="small" variant="outlined" sx={{ justifyContent: 'flex-start' }} />
              <Chip label="v1.1 Patching..." size="small" color="secondary" sx={{ justifyContent: 'flex-start' }} />
            </Stack>
          </Box>
        </Paper>

        {/* COLUMN B: Editor */}
        <Box sx={{ flex: 1, position: 'relative', borderRight: '1px solid #30363d' }}>
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
            onChange={(value) => engine.loadCode(value)}
          />
        </Box>

        {/* COLUMN C: Output Console */}
        <Paper square sx={{ width: 350, display: 'flex', flexDirection: 'column', bgcolor: '#0d1117' }}>
          
          <Box p={1.5} borderBottom="1px solid #30363d" bgcolor="#161b22">
            <Typography variant="subtitle2" fontWeight="bold">TERMINAL OUTPUT</Typography>
          </Box>

          <Box p={2} sx={{ fontFamily: 'monospace', fontSize: '0.85rem', color: '#ff7b72' }}>
            {engine.error || "No errors yet."}
          </Box>

          <Box p={1.5} borderTop="1px solid #30363d" borderBottom="1px solid #30363d" bgcolor="#161b22" mt="auto">
            <Typography variant="subtitle2" fontWeight="bold" color="secondary.main">AI REASONING</Typography>
          </Box>

          <Box p={2} sx={{ height: 200, fontFamily: 'monospace', fontSize: '0.85rem', color: '#a371f7', overflowY: 'auto' }}>
            {engine.logs || "No logs yet."}
          </Box>
        </Paper>

      </Box>
    </Box>
  );
}

export default App;
