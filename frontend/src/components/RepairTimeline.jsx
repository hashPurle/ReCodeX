// frontend/src/components/RepairTimeline.jsx

import React from "react";
import { Box, Typography, Stack, Chip } from "@mui/material";

/*
  RepairTimeline Component
  ------------------------
  - Shows each iteration of the repair loop
  - Uses MUI Chips for clean version labels
  - Logic works fully without styling/animations
*/

const RepairTimeline = ({ iterations = [], currentStep }) => {
  if (!iterations || iterations.length === 0) {
    return (
      <Box
        sx={{
          p: 2,
          color: "gray",
          fontFamily: "monospace",
          bgcolor: "#0d1117",
          borderRadius: 2,
          border: "1px solid #30363d",
        }}
      >
        No repair history yet.
      </Box>
    );
  }

  return (
    <Box
      sx={{
        p: 2,
        bgcolor: "#0d1117",
        color: "white",
        borderRadius: 2,
        border: "1px solid #30363d",
        fontFamily: "monospace",
      }}
    >
      <Typography
        variant="subtitle2"
        sx={{ mb: 2, color: "#79c0ff", textTransform: "uppercase" }}
      >
        Repair Timeline
      </Typography>

      <Stack spacing={2}>
        {iterations.map((step, index) => {
          const label = step.error
            ? `Step ${index + 1} — Patch Applied`
            : `Step ${index + 1} — Fixed ✔`;

          const isActive = currentStep === index + 1;
          const isFinal = !step.error;

          return (
            <Chip
              key={index}
              label={label}
              size="small"
              variant={isActive ? "filled" : "outlined"}
              color={isFinal ? "success" : "secondary"}
              sx={{
                justifyContent: "flex-start",
                fontSize: "0.75rem",
                borderColor: "#30363d",
              }}
            />
          );
        })}
      </Stack>
    </Box>
  );
};

export default RepairTimeline;
