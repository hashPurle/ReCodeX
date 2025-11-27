// src/pages/Ide.jsx
import React, { useState } from "react";
import {
  Box,
  Typography,
  Button,
  ToggleButton,
  ToggleButtonGroup,
  IconButton,
} from "@mui/material";

import {
  Play,
  Cpu,
  Code,
  GitCompare,
  Sparkles,
  ArrowLeft,
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

  const [viewMode, setViewMode] = useState("editor");
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
    setCode(safe);
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

          {/* Center: Editor / Diff */}
          <ToggleButtonGroup
            value={viewMode}
            exclusive
            onChange={(e, v) => v && setViewMode(v)}
          >
            <ToggleButton value="editor">
              <Code size={16} style={{ marginRight: 6 }} /> Code
            </ToggleButton>

            <ToggleButton value="diff" disabled={!engine.history.length}>
              <GitCompare size={16} style={{ marginRight: 6 }} /> Diff
            </ToggleButton>
          </ToggleButtonGroup>

          {/* Auto Repair */}
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

          <PanelResizeHandle><div className="ResizeHandleInner" /></PanelResizeHandle>

          {/* Editor / Diff */}
          <Panel>
            <Box sx={{ height: "100%", position: "relative" }}>
              {isFixing && <AiOverlay />}

              {viewMode === "editor" ? (
                <Editor
                  height="100%"
                  theme="vs-dark"
                  defaultLanguage="python"
                  value={engine.code}   // IMPORTANT
                  onChange={(v) => engine.loadCode(v || "")}
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

          <PanelResizeHandle><div className="ResizeHandleInner" /></PanelResizeHandle>

          {/* Terminal + Reasoning */}
          <Panel defaultSize={25} minSize={15}>
            <OutputPanel
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
