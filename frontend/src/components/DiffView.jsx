// src/components/DiffView.jsx
import React from "react";
import ReactDiffViewer from "react-diff-viewer-continued";
import { Box, Paper, Typography, Button, Stack } from "@mui/material";

export default function DiffView({
  history = [],
  selectedIndex = null,
  onSelectIndex = () => {},
  onApply = () => {},
  onReject = () => {},
}) {
  if (!history || history.length === 0) {
    return (
      <Box
        display="flex"
        alignItems="center"
        justifyContent="center"
        height="100%"
        color="white"
      >
        <Typography>No patches available.</Typography>
      </Box>
    );
  }

  // Determine selected item or fallback to last
  const idx =
    typeof selectedIndex === "number" && selectedIndex >= 0
      ? selectedIndex
      : history.length - 1;

  const item = history[idx];
  const prev = item?.prev ?? "";
  const next = item?.next ?? "";

  const prevStr = typeof prev === "string" ? prev : String(prev || "");
  const nextStr = typeof next === "string" ? next : String(next || "");

  return (
    <Box sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
      
      {/* ------- TOP CONTROL BAR ------- */}
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        px={1.5}
        py={0.75}
      >
        <Typography color="white" fontSize={14}>
          Patch {idx + 1} / {history.length}
        </Typography>

        <Stack direction="row" spacing={1}>
          {/* PREV BUTTON */}
          <Button
            size="small"
            variant="outlined"
            disabled={idx === 0}
            onClick={() => onSelectIndex(idx - 1)}
          >
            Prev
          </Button>

          {/* NEXT BUTTON */}
          <Button
            size="small"
            variant="outlined"
            disabled={idx === history.length - 1}
            onClick={() => onSelectIndex(idx + 1)}
          >
            Next
          </Button>

          {/* APPLY */}
          {!item?.rejected && (
            <Button
              size="small"
              color="success"
              variant="contained"
              onClick={() => onApply(idx)}
            >
              Apply
            </Button>
          )}

          {/* REJECT */}
          {!item?.rejected ? (
            <Button
              size="small"
              color="error"
              variant="outlined"
              onClick={() => onReject(idx)}
            >
              Reject
            </Button>
          ) : (
            <Typography color="#f85149" fontSize={13} sx={{ mt: 0.5 }}>
              Rejected
            </Typography>
          )}
        </Stack>
      </Stack>

      {/* ------- DIFF VIEW ------- */}
      <Paper
        square
        sx={{
          flex: 1,
          bgcolor: "#0d1117",
          p: 1,
          borderTop: "1px solid #30363d",
        }}
      >
        <ReactDiffViewer
          oldValue={prevStr}
          newValue={nextStr}
          splitView
          useDarkTheme
          leftTitle="Before"
          rightTitle="After"
          showDiffOnly={false}
          styles={{
            gutter: { color: "#8b949e" },
            line: { color: "#c9d1d9", fontSize: 14, fontFamily: "JetBrains Mono" },
          }}
        />
      </Paper>
    </Box>
  );
}
