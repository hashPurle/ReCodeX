// src/components/SuccessBanner.jsx
import React from "react";
import { Box, Typography, Button } from "@mui/material";

const SuccessBanner = ({ onApply, onClose }) => (
  <Box sx={{
    position: "fixed",
    right: 24,
    bottom: 24,
    zIndex: 2000,
    bgcolor: "rgba(22,27,34,0.9)",
    border: "1px solid rgba(48,54,61,0.6)",
    p: 2,
    borderRadius: 2,
    boxShadow: "0 8px 30px rgba(0,0,0,0.6)"
  }}>
    <Typography variant="h6" sx={{ display: "flex", alignItems: "center", gap: 1 }}>Repair Complete</Typography>
    <Typography variant="body2" color="#9aa4ad" sx={{ mt: 1 }}>AI finished the repair. Apply changes or close.</Typography>
    <Box sx={{ display: "flex", gap: 1, mt: 2 }}>
      <Button variant="contained" onClick={onApply}>View Diff</Button>
      <Button variant="outlined" onClick={onClose}>Close</Button>
    </Box>
  </Box>
);

export default SuccessBanner;
