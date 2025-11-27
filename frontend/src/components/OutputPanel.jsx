
import React from "react";
import { Box, Typography, Divider } from "@mui/material";
import { formatError, extractLineNumber } from "../utils/formatError";

/*
  OutputPanel Component
  ---------------------
  Shows:
  - Cleaned error message
  - Line number extracted from trace
  - Logs from the repair engine
*/

const OutputPanel = ({ error, logs }) => {
  const cleanError = error ? formatError(error) : "No errors yet.";
  const lineNumber = extractLineNumber(error);

  return (
    <Box
      sx={{
        height: "100%",
        overflowY: "auto",
        bgcolor: "#0d1117",
        color: "white",
        p: 2,
        fontFamily: "monospace",
      }}
    >
      {/* ERROR SECTION */}
      <Typography variant="subtitle2" sx={{ color: "#ff7b72", mb: 1 }}>
        ERROR
      </Typography>

      <Box
        sx={{
          bgcolor: "#161b22",
          p: 2,
          borderRadius: 2,
          mb: 2,
          border: "1px solid #30363d",
        }}
      >
        <Typography sx={{ whiteSpace: "pre-wrap" }}>
          {cleanError}
        </Typography>

        {lineNumber && (
          <Typography sx={{ mt: 1, color: "#ffa657" }}>
            → Suspected Line: {lineNumber}
          </Typography>
        )}
      </Box>

      <Divider sx={{ borderColor: "#30363d", my: 2 }} />

      {/* LOGS SECTION */}
      <Typography variant="subtitle2" sx={{ color: "#79c0ff", mb: 1 }}>
        TERMINAL LOGS
      </Typography>

      <Box
        sx={{
          bgcolor: "#161b22",
          p: 2,
          borderRadius: 2,
          border: "1px solid #30363d",
        }}
      >
        <Typography sx={{ whiteSpace: "pre-wrap" }}>
          {logs || "No logs available."}
        </Typography>
      </Box>
    </Box>
  );
};

export default OutputPanel;
