// src/App.jsx
import React, { useState } from "react";
import {
  Box,
  Typography,
  Button,
  ToggleButton,
  ToggleButtonGroup,
} from "@mui/material";

import { Play, Cpu, Code, GitCompare, Sparkles } from "lucide-react";
import Editor from "@monaco-editor/react";

// Core Components
import Sidebar from "./components/Sidebar";
import OutputPanel from "./components/OutputPanel";
import AiOverlay from "./components/AiOverlay";
import DiffView from "./components/DiffView";
import SuccessBanner from "./components/SuccessBanner";

// Engine Logic (Your part)
import { useRepairEngine } from "./hooks/useRepairEngine";

function App() {
  const engine = useRepairEngine();

  const [viewMode, setViewMode] = useState("editor"); // "editor" | "diff"
  const [isFixing, setIsFixing] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const [code, setCode] = useState("# Paste your Python code here");

  // ---------------------------------------------
  // When clicking file in sidebar
  // ---------------------------------------------
  const handleFileSelect = (newCode) => {
    setCode(newCode);
    engine.loadCode(newCode);
    setViewMode("editor");
  };

  // ---------------------------------------------
  // Auto Repair → calls engine + shows animation
  // ---------------------------------------------
  const handleStartRepair = async () => {
    setShowSuccess(false);
    setIsFixing(true);

    // Run engine repair (mock or backend)
    await engine.startFullRepair();

    // Animation delay
    setTimeout(() => {
      setIsFixing(false);
      setShowSuccess(true); // Show “Fix Applied” banner
    }, 1200);
  };

  return (
    <Box sx={{ height: "100vh", display: "flex", flexDirection: "column" }}>
      {/* --------------------------- NAVBAR --------------------------- */}
      <Box
        sx={{
          height: 64,
          borderBottom: "1px solid rgba(48, 54, 61, 0.5)",
          display: "flex",
          alignItems: "center",
          px: 3,
          justifyContent: "space-between",
          bgcolor: "rgba(22, 27, 34, 0.8)",
          backdropFilter: "blur(10px)",
          position: "sticky",
          top: 0,
          zIndex: 10,
        }}
      >
        {/* Logo */}
        <Typography
          variant="h6"
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1.5,
            color: "primary.main",
            fontWeight: 800,
            letterSpacing: 1,
          }}
        >
          <Cpu size={24} /> AutoBugFix_ <Sparkles size={16} />
        </Typography>

        {/* Center Toggle Buttons */}
        <ToggleButtonGroup
          value={viewMode}
          exclusive
          onChange={(e, v) => v && setViewMode(v)}
          size="small"
          sx={{
            "& .MuiToggleButton-root": {
              color: "#8b949e",
              borderColor: "#30363d",
              px: 3,
            },
            "& .Mui-selected": {
              bgcolor: "#1f6feb !important",
              color: "white !important",
              borderColor: "#1f6feb !important",
            },
          }}
        >
          <ToggleButton value="editor">
            <Code size={16} style={{ marginRight: 8 }} /> Code
          </ToggleButton>

          <ToggleButton value="diff" disabled={!engine.history.length}>
            <GitCompare size={16} style={{ marginRight: 8 }} /> Diff
          </ToggleButton>
        </ToggleButtonGroup>

        {/* Start Auto-Repair Button */}
        <Button
          variant="contained"
          startIcon={!isFixing && <Play size={18} />}
          disabled={isFixing}
          onClick={handleStartRepair}
          sx={{
            fontWeight: "bold",
            borderRadius: 2,
            px: 3,
            py: 1,
            textTransform: "none",
            fontSize: "0.9rem",
            boxShadow: "0 0 15px rgba(47, 129, 247, 0.4)",
            transition: "all 0.3s ease",
            "&:hover": { boxShadow: "0 0 25px rgba(47, 129, 247, 0.6)" },
          }}
        >
          {isFixing ? "AI Repairing..." : "Start Auto-Repair"}
        </Button>
      </Box>

      {/* -------------------------- MAIN GRID -------------------------- */}
      <Box
        sx={{
          flex: 1,
          display: "flex",
          overflow: "hidden",
          position: "relative",
        }}
      >
        {/* Sidebar */}
        <Sidebar onFileSelect={handleFileSelect} />

        {/* Editor / Diff */}
        <Box
          sx={{
            flex: 1,
            position: "relative",
            display: "flex",
            flexDirection: "column",
          }}
        >
          {isFixing && <AiOverlay />}

          {viewMode === "editor" ? (
            <Editor
              height="100%"
              defaultLanguage="python"
              theme="vs-dark"
              value={code}
              onChange={(v) => {
                setCode(v);
                engine.loadCode(v);
              }}
              options={{
                minimap: { enabled: false },
                fontSize: 15,
                fontFamily: "JetBrains Mono",
                padding: { top: 24 },
                scrollBeyondLastLine: false,
                smoothScrolling: true,
              }}
            />
          ) : (
            <DiffView history={engine.history} />
          )}
        </Box>

        {/* Terminal */}
        <OutputPanel error={engine.error} logs={engine.logs} />

        {/* Success Banner */}
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

export default App;
