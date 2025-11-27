// frontend/src/components/PatchViewer.jsx

import React from "react";
import { Box, Typography } from "@mui/material";
import { Diff, Hunk, parseDiff } from "react-diff-view";
import "react-diff-view/style/index.css";

/*
  PatchViewer Component
  ---------------------
  - Displays unified diff output (patch)
  - Shows added/removed lines with colors
  - Works with your repair engine's patch output
*/

const PatchViewer = ({ patch }) => {
  if (!patch || patch.trim().length === 0) {
    return (
      <Box
        sx={{
          p: 2,
          fontFamily: "monospace",
          color: "gray",
          bgcolor: "#0d1117",
          borderRadius: 2,
          border: "1px solid #30363d",
        }}
      >
        No patch generated yet.
      </Box>
    );
  }

  let files = [];
  try {
    files = parseDiff(patch);
  } catch (err) {
    return (
      <Box p={2} sx={{ color: "red", fontFamily: "monospace" }}>
        Invalid patch format
      </Box>
    );
  }

  return (
    <Box
      sx={{
        height: "100%",
        overflowY: "auto",
        bgcolor: "#0d1117",
        color: "white",
        p: 1,
        fontFamily: "monospace",
        borderRadius: 2,
        border: "1px solid #30363d",
      }}
    >
      <Typography
        variant="subtitle2"
        sx={{ mb: 1, color: "#79c0ff", textTransform: "uppercase" }}
      >
        Generated Patch
      </Typography>

      {files.map(({ hunks = [] }, idx) => (
        <Diff
          key={idx}
          viewType="unified"
          diffType="modify"
          hunks={hunks}
        >
          {(hunks) =>
            hunks.map((hunk) => <Hunk key={hunk.content} hunk={hunk} />)
          }
        </Diff>
      ))}
    </Box>
  );
};

export default PatchViewer;
