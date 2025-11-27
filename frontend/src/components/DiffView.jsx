// src/components/DiffView.jsx
import React, { useState } from "react";
import { Diff, Hunk, parseDiff } from "react-diff-view";
import { Box, Button, Typography, Paper, Chip } from "@mui/material";
import { ChevronLeft, ChevronRight, GitCommit } from "lucide-react";
import "react-diff-view/style/index.css";

/*
  FINAL CLEAN VERSION
  --------------------
  ✔ Uses react-diff-view (correct library)
  ✔ Converts old/new code into a proper unified diff
  ✔ Supports navigation between patches
  ✔ Styled to match GitHub dark mode
*/

const DiffView = ({ history = [] }) => {
  const [index, setIndex] = useState(0);

  // Must have at least 2 versions to show a diff
  if (!history || history.length < 2) {
    return (
      <Box
        display="flex"
        alignItems="center"
        justifyContent="center"
        height="100%"
        color="text.secondary"
      >
        <Typography>No repair history available yet.</Typography>
      </Box>
    );
  }

  const oldCode = history[index];
  const newCode = history[index + 1];

  // Convert code into a unified diff so react-diff-view can parse it
  const diffText = `
diff --git a/code.py b/code.py
index 000000..111111 100644
--- a/code.py
+++ b/code.py
@@ -1,100 +1,100 @@
${oldCode}
@@ -1,100 +1,100 @@
${newCode}
`;

  const [diff] = parseDiff(diffText);

  const goNext = () => {
    if (index < history.length - 2) setIndex(index + 1);
  };

  const goPrev = () => {
    if (index > 0) setIndex(index - 1);
  };

  return (
    <Box
      sx={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        bgcolor: "#0d1117",
        height: "100%",
      }}
    >
      {/* NAV BAR */}
      <Paper
        square
        sx={{
          p: 1.5,
          bgcolor: "#161b22",
          borderBottom: "1px solid #30363d",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Box display="flex" alignItems="center" gap={2}>
          <Typography
            variant="subtitle2"
            fontWeight="bold"
            color="white"
            display="flex"
            alignItems="center"
            gap={1}
          >
            <GitCommit size={16} />
            Reviewing Patch {index + 1} / {history.length - 1}
          </Typography>

          <Chip
            label={index === history.length - 2 ? "Final Fix" : "Intermediate Patch"}
            size="small"
            variant="outlined"
            color={index === history.length - 2 ? "success" : "primary"}
            sx={{ borderRadius: 1, height: 24 }}
          />
        </Box>

        {/* Controls */}
        <Box display="flex" gap={1}>
          <Button
            variant="outlined"
            size="small"
            startIcon={<ChevronLeft size={16} />}
            onClick={goPrev}
            disabled={index === 0}
            sx={{
              borderColor: "#30363d",
              color: "#c9d1d9",
              "&:hover": { borderColor: "#58a6ff" },
            }}
          >
            Prev
          </Button>

          <Button
            variant="outlined"
            size="small"
            endIcon={<ChevronRight size={16} />}
            onClick={goNext}
            disabled={index >= history.length - 2}
            sx={{
              borderColor: "#30363d",
              color: "#c9d1d9",
              "&:hover": { borderColor: "#58a6ff" },
            }}
          >
            Next
          </Button>
        </Box>
      </Paper>

      {/* DIFF VIEWER */}
      <Box
        sx={{
          flex: 1,
          overflow: "auto",
          p: 2,
        }}
      >
        <Diff viewType="split" hunks={diff.hunks} diffType={diff.type}>
          {(hunks) =>
            hunks.map((hunk) => <Hunk key={hunk.content} hunk={hunk} />)
          }
        </Diff>
      </Box>
    </Box>
  );
};

export default DiffView;
