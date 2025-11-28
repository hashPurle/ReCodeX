// src/pages/Ide.jsx
import React, { useState } from "react";
import {
  Box,
  Typography,
  Button,
  ToggleButton,
  ToggleButtonGroup,
  IconButton,
  Divider, // Added Divider
} from "@mui/material";

import {
  Play,
  Cpu,
  Code,
  GitCompare,
  Sparkles,
  ArrowLeft,
  Terminal,      // Added
  MessageSquare, // Added for Chat
} from "lucide-react";

import Editor from "@monaco-editor/react";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

import { useRepairEngine } from "../hooks/useRepairEngine";

// Components
import Sidebar from "../components/Sidebar";
import OutputPanel from "../components/OutputPanel";
import AiOverlay from "../components/AiOverlay";
import SuccessBanner from "../components/SuccessBanner";
import DiffView from "../components/DiffView";

function Ide() {
  const navigate = useNavigate();
  const engine = useRepairEngine();

  // --- STATE ---
  const [viewMode, setViewMode] = useState("editor");
  const [activeOutputTab, setActiveOutputTab] = useState("terminal"); // NEW: Controls Right Panel
  const [isFixing, setIsFixing] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const {
    code,
    history,
    selectedIndex,
    applyHistory,
    rejectHistory,
    selectHistoryIndex,
    aiReasoning,
    logs,
    error,
    startFullRepair,
    loadCode,
  } = engine;


  // --------------- Load File From Sidebar ---------------
  const handleFileSelect = (newCode) => {
    const safe = newCode || "";
    // setCode(safe); // Removed local setCode, engine handles it
    engine.loadCode(safe);
    setViewMode("editor");
  };

  // --------------- AUTO-REPAIR ---------------
  const handleStartRepair = async () => {
    setIsFixing(true);
    setShowSuccess(false);

    const result = await engine.startFullRepair();
    console.log("Repair Result:", result);

    setIsFixing(false);
    setShowSuccess(true);

    // Auto-switch to Diff view
    if (engine.history.length) setViewMode("diff");
    
    // Auto-switch Right Panel to AI Reasoning
    setActiveOutputTab('reasoning'); 
  };

  return (
    <Box sx={{ height: "100vh", display: "flex", flexDirection: "column", bgcolor: "#0d1117" }}>

      {/* ---------------- NAVBAR ---------------- */}
      <motion.div
        initial={{ y: -40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.4 }}
      >
        <Box
          sx={{
            height: 64,
            borderBottom: "1px solid rgba(48,54,61,0.5)",
            display: "flex",
            alignItems: "center",
            px: 3,
            justifyContent: "space-between",
            bgcolor: "rgba(22,27,34,0.8)",
            backdropFilter: "blur(10px)",
          }}
        >
          {/* Back + Logo */}
          <Box display="flex" alignItems="center" gap={2}>
            <IconButton
              onClick={() => navigate("/")}
              sx={{
                border: "1px solid #30363d",
                borderRadius: 2,
                color: "#8b949e",
              }}
            >
              <ArrowLeft size={18} />
            </IconButton>

            <Typography
              variant="h6"
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
                fontWeight: 900,
                color: "primary.main",
              }}
            >
              <Cpu size={22} /> ReCodeX <Sparkles size={16} />
            </Typography>
          </Box>

          {/* CENTER: Combined Toggles */}
          <Box display="flex" alignItems="center" gap={2}>
            
            {/* Group 1: Editor / Diff */}
            <ToggleButtonGroup
              value={viewMode}
              exclusive
              onChange={(e, v) => v && setViewMode(v)}
              size="small"
              sx={{ 
                '& .MuiToggleButton-root': { color: '#8b949e', borderColor: '#30363d', px: 2 }, 
                '& .Mui-selected': { bgcolor: '#1f6feb !important', color: 'white !important' } 
              }}
            >
              <ToggleButton value="editor">
                <Code size={16} style={{ marginRight: 6 }} /> Code
              </ToggleButton>

              <ToggleButton value="diff" disabled={!engine.history.length}>
                <GitCompare size={16} style={{ marginRight: 6 }} /> Diff
              </ToggleButton>
            </ToggleButtonGroup>

            <Divider orientation="vertical" flexItem sx={{ bgcolor: '#30363d', mx: 1 }} />

            {/* Group 2: Output View (Terminal / AI / Chat) -- NEW */}
            <ToggleButtonGroup
              value={activeOutputTab}
              exclusive
              onChange={(e, v) => v && setActiveOutputTab(v)}
              size="small"
              sx={{ 
                '& .MuiToggleButton-root': { color: '#8b949e', borderColor: '#30363d', px: 2 }, 
                '& .Mui-selected': { 
                   bgcolor: activeOutputTab === 'reasoning' ? '#a371f7 !important' : 
                            activeOutputTab === 'chat' ? '#238636 !important' : '#30363d !important',
                   color: 'white !important', 
                   borderColor: 'transparent'
                } 
              }}
            >
              <ToggleButton value="terminal"><Terminal size={16} style={{ marginRight: 8 }} /> Terminal</ToggleButton>
              <ToggleButton value="reasoning"><Sparkles size={16} style={{ marginRight: 8 }} /> AI Logic</ToggleButton>
              <ToggleButton value="chat"><MessageSquare size={16} style={{ marginRight: 8 }} /> Chat</ToggleButton>
            </ToggleButtonGroup>

          </Box>

          {/* Auto Repair Button */}
          <Button
            variant="contained"
            startIcon={!isFixing && <Play size={18} />}
            disabled={isFixing}
            onClick={handleStartRepair}
            sx={{
              ml: 2,
              borderRadius: 2,
              px: 3,
              textTransform: "none",
            }}
          >
            {isFixing ? "Fixing..." : "Auto-Repair"}
          </Button>
        </Box>
      </motion.div>

      {/* ---------------- MAIN LAYOUT ---------------- */}
      <Box sx={{ flex: 1, minHeight: 0 }}>
        <PanelGroup direction="horizontal">

          {/* Sidebar */}
          <Panel defaultSize={20} minSize={15}>
            <Sidebar onFileSelect={handleFileSelect} />
          </Panel>

          <PanelResizeHandle className="ResizeHandleOuter"><div className="ResizeHandleInner" /></PanelResizeHandle>

          {/* Editor / Diff */}
          <Panel>
            <Box sx={{ height: "100%", position: "relative" }}>
              {isFixing && <AiOverlay />}

              {viewMode === "editor" ? (
                <Editor
                  height="100%"
                  theme="vs-dark"
                  defaultLanguage="python"
                  value={engine.code} 
                  onChange={(v) => engine.loadCode(v || "")}
                  options={{ minimap: { enabled: false }, fontSize: 15, fontFamily: 'JetBrains Mono', padding: { top: 24 } }}
                />

              ) : (
                <DiffView
                  history={engine.history}
                  selectedIndex={engine.selectedIndex}
                  onSelectIndex={engine.selectHistoryIndex}
                  onApply={(i) => {
                    engine.applyHistory(i);
                    setViewMode("editor");
                  }}
                  onReject={(i) => {
                    engine.rejectHistory(i);
                    setViewMode("editor");
                  }}
                />
              )}
            </Box>
          </Panel>

          <PanelResizeHandle className="ResizeHandleOuter"><div className="ResizeHandleInner" /></PanelResizeHandle>

          {/* Terminal + Reasoning + Chat */}
          <Panel defaultSize={25} minSize={15}>
            <OutputPanel
              activeTab={activeOutputTab} // Pass the active tab state
              logs={engine.logs}
              error={engine.error}
              reasoning={engine.aiReasoning}
            />
          </Panel>

        </PanelGroup>

        {/* Success banner */}
        {showSuccess && (
          <SuccessBanner
            onApply={() => setViewMode("diff")}
            onClose={() => setShowSuccess(false)}
          />
        )}
      </Box>
    </Box>
  );
}

export default Ide;