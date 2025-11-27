// frontend/src/components/ErrorDialog.jsx

import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
} from "@mui/material";

/*
  ErrorDialog Component
  ---------------------
  A reusable error popup for:
  - Sandbox crashes
  - API errors
  - Unexpected exceptions
*/

const ErrorDialog = ({ open, onClose, message }) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          bgcolor: "#0d1117",
          color: "white",
          border: "1px solid #30363d",
        },
      }}
    >
      <DialogTitle sx={{ color: "#ff7b72", fontWeight: "bold" }}>
        Error
      </DialogTitle>

      <DialogContent dividers sx={{ borderColor: "#30363d" }}>
        <Box sx={{ whiteSpace: "pre-wrap", fontFamily: "monospace" }}>
          <Typography>{message || "An unexpected error occurred."}</Typography>
        </Box>
      </DialogContent>

      <DialogActions sx={{ borderTop: "1px solid #30363d" }}>
        <Button variant="contained" onClick={onClose}>
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ErrorDialog;
