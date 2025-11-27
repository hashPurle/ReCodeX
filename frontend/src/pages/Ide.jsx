import React, { useState } from 'react';
import { Box, Typography, Button, ToggleButton, ToggleButtonGroup, IconButton, Divider } from '@mui/material';
import { Play, Cpu, Code, GitCompare, Sparkles, ArrowLeft, Terminal, MessageSquare } from 'lucide-react'; // Added MessageSquare
import Editor from "@monaco-editor/react";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels"; 
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

import Sidebar from '../components/Sidebar';
import OutputPanel from '../components/OutputPanel';
import AiOverlay from '../components/AiOverlay';
import DiffView from '../components/DiffView'; 
import SuccessBanner from '../components/SuccessBanner';

// --- MOCK DATA ---
const mockHistory = [
  `def bubble_sort(arr):
    n = len(arr)
    for i in range(n):
        for j in range(0, n-i-1):
            if arr[j] > arr[j+1] :
                arr[j] = arr[j+1] # Error: Overwrites instead of swapping`,
  `def bubble_sort(arr):
    n = len(arr)
    for i in range(n):
        for j in range(0, n-i-1):
            if arr[j] > arr[j+1] :
                temp = arr[j]
                arr[j] = arr[j+1] # Error: Missed assignment`,
  `def bubble_sort(arr):
    n = len(arr)
    for i in range(n):
        for j in range(0, n-i-1):
            if arr[j] > arr[j+1] :
                arr[j], arr[j+1] = arr[j+1], arr[j]`
];

function Ide() {
  const navigate = useNavigate();
  
  // STATE 1: Center Panel (Code vs Diff)
  const [viewMode, setViewMode] = useState('editor');
  
  // STATE 2: Right Panel (Terminal vs AI vs Chat)
  const [activeOutputTab, setActiveOutputTab] = useState('terminal');

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
    
    // Fake a 3-second delay
    setTimeout(() => {
      setIsFixing(false);
      setShowSuccess(true);
      // Automatically switch to AI Logic tab when repair finishes
      setActiveOutputTab('reasoning'); 
    }, 3000);
  };

  return (
    <Box sx={{ height: '100vh', display: 'flex', flexDirection: 'column', bgcolor: '#0d1117' }}>
      
      {/* --- NAVBAR --- */}
      <motion.div 
        initial={{ y: -50, opacity: 0 }} 
        animate={{ y: 0, opacity: 1 }} 
        transition={{ duration: 0.5, ease: "circOut" }}
      >
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
          
          {/* LEFT: Logo & Back */}
          <Box display="flex" alignItems="center" gap={2}>
            <IconButton 
              onClick={() => navigate('/')} 
              size="small"
              sx={{ color: '#8b949e', border: '1px solid #30363d', borderRadius: 2, '&:hover': { color: 'white', borderColor: 'white' } }}
            >
              <ArrowLeft size={18} />
            </IconButton>
            <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1.5, color: 'primary.main', fontWeight: 800, letterSpacing: 1 }}>
              <Cpu size={24} /> AutoBugFix_
            </Typography>
          </Box>

          {/* CENTER: Combined Toggles */}
          <Box display="flex" alignItems="center" gap={2}>
            
            {/* Group 1: Editor View */}
            <ToggleButtonGroup
              value={viewMode}
              exclusive
              onChange={(e, newMode) => newMode && setViewMode(newMode)}
              size="small"
              sx={{ 
                '& .MuiToggleButton-root': { color: '#8b949e', borderColor: '#30363d', px: 2, py: 0.5 }, 
                '& .Mui-selected': { bgcolor: '#1f6feb !important', color: 'white !important', borderColor: '#1f6feb !important' } 
              }}
            >
              <ToggleButton value="editor"><Code size={16} style={{ marginRight: 8 }} /> Code</ToggleButton>
              <ToggleButton value="diff"><GitCompare size={16} style={{ marginRight: 8 }} /> Diff</ToggleButton>
            </ToggleButtonGroup>

            {/* Vertical Divider */}
            <Divider orientation="vertical" flexItem sx={{ bgcolor: '#30363d', mx: 1 }} />

            {/* Group 2: Output View (Terminal / AI / Chat) */}
            <ToggleButtonGroup
              value={activeOutputTab}
              exclusive
              onChange={(e, newMode) => newMode && setActiveOutputTab(newMode)}
              size="small"
              sx={{ 
                '& .MuiToggleButton-root': { color: '#8b949e', borderColor: '#30363d', px: 2, py: 0.5 }, 
                '& .Mui-selected': { 
                   // Dynamic color based on selection
                   bgcolor: activeOutputTab === 'reasoning' ? '#a371f7 !important' : 
                            activeOutputTab === 'chat' ? '#238636 !important' : '#30363d !important',
                   color: 'white !important', 
                   // Transparent border for selected item to look cleaner
                   borderColor: 'transparent'
                } 
              }}
            >
              <ToggleButton value="terminal"><Terminal size={16} style={{ marginRight: 8 }} /> Terminal</ToggleButton>
              <ToggleButton value="reasoning"><Sparkles size={16} style={{ marginRight: 8 }} /> AI Logic</ToggleButton>
              <ToggleButton value="chat"><MessageSquare size={16} style={{ marginRight: 8 }} /> Chat</ToggleButton>
            </ToggleButtonGroup>

          </Box>

          {/* RIGHT: Action Button */}
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
      </motion.div>

      {/* --- MAIN LAYOUT --- */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.98 }} 
        animate={{ opacity: 1, scale: 1 }} 
        transition={{ duration: 0.6, delay: 0.2 }}
        style={{ flex: 1, overflow: 'hidden', position: 'relative', display: 'flex' }}
      >
        <Box sx={{ flex: 1, overflow: 'hidden', position: 'relative' }}>
          
          <PanelGroup direction="horizontal">
            
            {/* 1. SIDEBAR */}
            <Panel defaultSize={20} minSize={15} maxSize={30}>
              <Sidebar onFileSelect={handleFileSelect} />
            </Panel>

            <PanelResizeHandle className="ResizeHandleOuter"><div className="ResizeHandleInner" /></PanelResizeHandle>

            {/* 2. CENTER PANEL */}
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
                    options={{ minimap: { enabled: false }, fontSize: 15, fontFamily: 'JetBrains Mono', padding: { top: 24, bottom: 24 }, scrollBeyondLastLine: false, smoothScrolling: true, cursorBlinking: "smooth" }}
                  />
                ) : (
                  <DiffView history={mockHistory} />
                )}
              </Box>
            </Panel>

            <PanelResizeHandle className="ResizeHandleOuter"><div className="ResizeHandleInner" /></PanelResizeHandle>

            {/* 3. RIGHT PANEL (Controlled by Navbar) */}
            <Panel defaultSize={25} minSize={20} maxSize={40}>
              {/* PASSING STATE DOWN */}
              <OutputPanel activeTab={activeOutputTab} />
            </Panel>

          </PanelGroup>

          {showSuccess && (
            <SuccessBanner onApply={() => setViewMode('diff')} onClose={() => setShowSuccess(false)} />
          )}
        </Box>
      </motion.div>
    </Box>
  );
}

export default Ide;