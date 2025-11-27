import React, { useState } from 'react';
import { Box, Typography, Button, ToggleButton, ToggleButtonGroup } from '@mui/material';
import { Play, Cpu, Code, GitCompare, Sparkles } from 'lucide-react';
import Editor from "@monaco-editor/react";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels"; // <--- NEW IMPORT

import Sidebar from './components/Sidebar';
import OutputPanel from './components/OutputPanel';
import AiOverlay from './components/AiOverlay';
import DiffView from './components/DiffView'; 
import SuccessBanner from './components/SuccessBanner';

// --- MOCK DATA ---
const mockHistory = [
  `def bubble_sort(arr):
    n = len(arr)
    for i in range(n):
        for j in range(0, n-i-1):
            if arr[j] > arr[j+1] :
                arr[j] = arr[j+1]`,
  `def bubble_sort(arr):
    n = len(arr)
    for i in range(n):
        for j in range(0, n-i-1):
            if arr[j] > arr[j+1] :
                temp = arr[j]
                arr[j] = arr[j+1]`,
  `def bubble_sort(arr):
    n = len(arr)
    for i in range(n):
        for j in range(0, n-i-1):
            if arr[j] > arr[j+1] :
                arr[j], arr[j+1] = arr[j+1], arr[j]`
];

function App() {
  const [viewMode, setViewMode] = useState('editor');
  const [isFixing, setIsFixing] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  
  const [code, setCode] = useState(`# ------------------------------------
# PASTE YOUR BROKEN PYTHON CODE HERE
# OR OPEN A PROJECT FOLDER ON THE LEFT
# ------------------------------------

def buggy_function(arr):
    # Example: This will cause an IndexError
    for i in range(len(arr) + 1):
        print(arr[i])
`);

  const handleFileSelect = (newCode) => {
    setCode(newCode);
    setViewMode('editor'); 
  };

  const handleStartRepair = () => {
    setShowSuccess(false);
    setIsFixing(true);
    setTimeout(() => {
      setIsFixing(false);
      setShowSuccess(true);
    }, 3000);
  };

  return (
    <Box sx={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
      
      {/* NAVBAR */}
      <Box sx={{ 
        height: 64, 
        borderBottom: '1px solid rgba(48, 54, 61, 0.5)', 
        display: 'flex', 
        alignItems: 'center', 
        px: 3, 
        justifyContent: 'space-between',
        bgcolor: 'rgba(22, 27, 34, 0.8)', 
        backdropFilter: 'blur(10px)',
        position: 'sticky', top: 0, zIndex: 10
      }}>
        <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1.5, color: 'primary.main', fontWeight: 800, letterSpacing: 1 }}>
          <Cpu size={24} /> AutoBugFix_ <Sparkles size={16} className="text-purple-400"/>
        </Typography>

        <ToggleButtonGroup
          value={viewMode}
          exclusive
          onChange={(e, newMode) => newMode && setViewMode(newMode)}
          size="small"
          sx={{ 
            '& .MuiToggleButton-root': { color: '#8b949e', borderColor: '#30363d', px: 3 }, 
            '& .Mui-selected': { bgcolor: '#1f6feb !important', color: 'white !important', borderColor: '#1f6feb !important' } 
          }}
        >
          <ToggleButton value="editor"><Code size={16} style={{ marginRight: 8 }} /> Code</ToggleButton>
          <ToggleButton value="diff"><GitCompare size={16} style={{ marginRight: 8 }} /> Diff</ToggleButton>
        </ToggleButtonGroup>

        <Button 
          variant="contained" 
          startIcon={!isFixing && <Play size={18} />} 
          disabled={isFixing}
          onClick={handleStartRepair}
          sx={{ 
            fontWeight: 'bold', borderRadius: 2, px: 3, py: 1, textTransform: 'none', fontSize: '0.9rem',
            boxShadow: '0 0 15px rgba(47, 129, 247, 0.4)',
            transition: 'all 0.3s ease',
            '&:hover': { boxShadow: '0 0 25px rgba(47, 129, 247, 0.6)' }
          }}
        >
          {isFixing ? 'AI Repairing...' : 'Start Auto-Repair'}
        </Button>
      </Box>

      {/* --- MAIN RESIZABLE LAYOUT --- */}
      <Box sx={{ flex: 1, overflow: 'hidden', position: 'relative' }}>
        
        <PanelGroup direction="horizontal">
          
          {/* 1. LEFT PANEL (SIDEBAR) */}
          <Panel defaultSize={20} minSize={15} maxSize={30}>
            <Sidebar onFileSelect={handleFileSelect} />
          </Panel>

          {/* HANDLE 1 */}
          <PanelResizeHandle className="ResizeHandleOuter">
            <div className="ResizeHandleInner" />
          </PanelResizeHandle>

          {/* 2. CENTER PANEL (EDITOR/DIFF) */}
          <Panel>
            <Box sx={{ height: '100%', position: 'relative', display: 'flex', flexDirection: 'column' }}>
              {isFixing && <AiOverlay />}
              
              {viewMode === 'editor' ? (
                <Editor
                  height="100%"
                  defaultLanguage="python"
                  theme="vs-dark"
                  value={code}
                  onChange={(val) => setCode(val)}
                  options={{ 
                    minimap: { enabled: false }, 
                    fontSize: 15, 
                    fontFamily: 'JetBrains Mono',
                    padding: { top: 24, bottom: 24 },
                    scrollBeyondLastLine: false,
                    smoothScrolling: true,
                    cursorBlinking: "smooth"
                  }}
                />
              ) : (
                <DiffView history={mockHistory} />
              )}
            </Box>
          </Panel>

          {/* HANDLE 2 */}
          <PanelResizeHandle className="ResizeHandleOuter">
             <div className="ResizeHandleInner" />
          </PanelResizeHandle>

          {/* 3. RIGHT PANEL (TERMINAL) */}
          <Panel defaultSize={25} minSize={20} maxSize={40}>
            <OutputPanel />
          </Panel>

        </PanelGroup>

        {/* Success Banner (Floating) */}
        {showSuccess && (
          <SuccessBanner onApply={() => setViewMode('diff')} onClose={() => setShowSuccess(false)} />
        )}
      </Box>
    </Box>
  );
}

export default App;