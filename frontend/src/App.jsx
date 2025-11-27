import React, { useState } from 'react';
import { Box, Typography, Button, ToggleButton, ToggleButtonGroup } from '@mui/material';
import { Play, Cpu, Code, GitCompare, Sparkles } from 'lucide-react';
import Editor from "@monaco-editor/react";

import Sidebar from './components/Sidebar';
import OutputPanel from './components/OutputPanel';
import AiOverlay from './components/AiOverlay';
import DiffView from './components/DiffView'; 
import SuccessBanner from './components/SuccessBanner';

// --- MOCK DATA: Simulates the evolution of code for the Diff Viewer ---
const mockHistory = [
  // VERSION 1: Broken Code (Original)
  `def bubble_sort(arr):
    n = len(arr)
    # Traverse through all array elements
    for i in range(n):
        for j in range(0, n-i-1):
            if arr[j] > arr[j+1] :
                # ERROR: This just overwrites, doesn't swap!
                arr[j] = arr[j+1]`,
  
  // VERSION 2: Intermediate Patch (AI fixed logic but missed variable)
  `def bubble_sort(arr):
    n = len(arr)
    # Traverse through all array elements
    for i in range(n):
        for j in range(0, n-i-1):
            if arr[j] > arr[j+1] :
                # AI Attempt 1: Using temp variable
                temp = arr[j]
                arr[j] = arr[j+1]
                # ERROR: Forgot to assign temp back to arr[j+1]`,

  // VERSION 3: Final Correct Fix
  `def bubble_sort(arr):
    n = len(arr)
    # Traverse through all array elements
    for i in range(n):
        for j in range(0, n-i-1):
            if arr[j] > arr[j+1] :
                # FIXED: Pythonic tuple swap
                arr[j], arr[j+1] = arr[j+1], arr[j]`
];

function App() {
  const [viewMode, setViewMode] = useState('editor'); // 'editor' | 'diff'
  const [isFixing, setIsFixing] = useState(false);    // Laser Animation state
  const [showSuccess, setShowSuccess] = useState(false); // Success Banner state
  
  // EDITOR STATE: Default text or loaded file content
  const [code, setCode] = useState(`# ------------------------------------
# PASTE YOUR BROKEN PYTHON CODE HERE
# OR OPEN A PROJECT FOLDER ON THE LEFT
# ------------------------------------

def buggy_function(arr):
    # Example: This will cause an IndexError
    for i in range(len(arr) + 1):
        print(arr[i])
`);

  // Handler: When a file is clicked in Sidebar, update Editor
  const handleFileSelect = (newCode) => {
    setCode(newCode);
    setViewMode('editor'); // Ensure we see the code
  };

  // Handler: Simulate the AI Repair Process
  const handleStartRepair = () => {
    setShowSuccess(false);
    setIsFixing(true);
    
    // Fake a 3-second delay for the "AI Scan"
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
        {/* Logo */}
        <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1.5, color: 'primary.main', fontWeight: 800, letterSpacing: 1 }}>
          <Cpu size={24} /> AutoBugFix_ <Sparkles size={16} className="text-purple-400"/>
        </Typography>

        {/* Center Toggles */}
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

        {/* Action Button */}
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

      {/* MAIN CONTENT GRID */}
      <Box sx={{ flex: 1, display: 'flex', overflow: 'hidden', position: 'relative' }}>
        
        {/* 1. LEFT SIDEBAR (File Explorer) */}
        <Sidebar onFileSelect={handleFileSelect} />

        {/* 2. CENTER STAGE (Editor / Diff) */}
        <Box sx={{ flex: 1, position: 'relative', display: 'flex', flexDirection: 'column' }}>
          
          {/* Laser Animation Layer */}
          {isFixing && <AiOverlay />}

          {/* Conditional View */}
          {viewMode === 'editor' ? (
             <Editor
               height="100%"
               defaultLanguage="python"
               theme="vs-dark"
               value={code}                  // State binding
               onChange={(val) => setCode(val)} // State update
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
             // Pass the mock history to the Diff Viewer
             <DiffView history={mockHistory} />
          )}
        </Box>

        {/* 3. RIGHT PANEL (Terminal) */}
        <OutputPanel />

        {/* 4. SUCCESS BANNER (Toast) */}
        {showSuccess && (
          <SuccessBanner onApply={() => setViewMode('diff')} onClose={() => setShowSuccess(false)} />
        )}

      </Box>
    </Box>
  );
}

export default App;