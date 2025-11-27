// src/components/OutputPanel.jsx

import React from "react";
import { Paper, Box, Typography, Divider } from "@mui/material";
import { Terminal, Cpu } from "lucide-react";
import { formatError, extractLineNumber } from "../utils/formatError";

/*
  OutputPanel Component (Final Merged Version)
  -------------------------------------------
  Keeps:
  ✔ Your real logic (error formatter + line extraction)
  ✔ Vishal's UI styling (terminal layout, icons, colors)
*/

const OutputPanel = ({ error, logs }) => {
  const cleanError = error ? formatError(error) : "No errors yet.";
  const lineNumber = extractLineNumber(error);

  return (
    <Paper
      square
      sx={{
        width: 350,
        display: "flex",
        flexDirection: "column",
        bgcolor: "#0d1117",
        borderLeft: "1px solid #30363d",
      }}
    >
      {/* -------- TERMINAL HEADER -------- */}
      <Box
        p={1.5}
        borderBottom="1px solid #30363d"
        bgcolor="#161b22"
        display="flex"
        alignItems="center"
        gap={1}
      >
        <Terminal size={14} color="#8b949e" />
        <Typography variant="subtitle2" fontWeight="bold" color="text.secondary">
          TERMINAL OUTPUT
        </Typography>
      </Box>

      {/* -------- ERROR SECTION -------- */}
      <Box
        p={2}
        sx={{
          fontFamily: "monospace",
          fontSize: "0.85rem",
          color: "#ff7b72",
          overflowY: "auto",
          flex: 1,
        }}
      >
        <Typography sx={{ whiteSpace: "pre-wrap" }}>{cleanError}</Typography>

        {lineNumber && (
          <Typography sx={{ mt: 1, color: "#ffa657" }}>
            → Suspected Line: {lineNumber}
          </Typography>
        )}
      </Box>

      {/* Divider */}
      <Divider sx={{ borderColor: "#30363d" }} />

      {/* -------- AI REASONING HEADER -------- */}
      <Box
        p={1.5}
        borderTop="1px solid #30363d"
        borderBottom="1px solid #30363d"
        bgcolor="#161b22"
        display="flex"
        alignItems="center"
        gap={1}
      >
        <Cpu size={14} color="#a371f7" />
        <Typography variant="subtitle2" fontWeight="bold" color="secondary.main">
          AI REASONING
        </Typography>
      </Box>

      {/* -------- LOGS SECTION -------- */}
      <Box
        p={2}
        sx={{
          height: 200,
          fontFamily: "monospace",
          fontSize: "0.85rem",
          color: "#a371f7",
          overflowY: "auto",
        }}
      >
        <Typography sx={{ whiteSpace: "pre-wrap" }}>
          {logs || "No logs available."}
        </Typography>
      </Box>
    </Paper>
  );
};

export default OutputPanel;
