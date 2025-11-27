// frontend/src/components/FinalOutput.jsx

import React from "react";
import { Box, Typography, Button } from "@mui/material";
import CodeEditor from "./CodeEditor";

/*
  FinalOutput Component
  ---------------------
  Shows:
  - Final repaired code (read-only)
  - A rerun button to restart the process
*/

const FinalOutput = ({ finalCode, onRestart }) => {
  return (
    <Box
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        bgcolor: "#0d1117",
        color: "white",
        p: 2,
        borderRadius: 2,
        border: "1px solid #30363d",
        overflow: "hidden",
      }}
    >
      <Typography
        variant="h6"
        sx={{ mb: 2, color: "#79c0ff", textTransform: "uppercase" }}
      >
        Final Repaired Code
      </Typography>

      {/* Code Viewer */}
      <Box sx={{ flex: 1, mb: 2 }}>
        <CodeEditor
          code={finalCode || "# No final code generated"}
          readOnly={true}
          height="100%"
        />
      </Box>

      {/* Button to restart process */}
      <Button
        variant="contained"
        color="primary"
        onClick={onRestart}
        sx={{ alignSelf: "flex-end", mt: 1 }}
      >
        Restart Repair
      </Button>
    </Box>
  );
};

export default FinalOutput;
