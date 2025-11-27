import React, { useState } from 'react';
import ReactDiffViewer from 'react-diff-viewer-continued';
import { Box, Button, Typography, Paper, Chip } from '@mui/material';
import { ChevronLeft, ChevronRight, GitCommit } from 'lucide-react';

const DiffView = ({ history = [] }) => {
  const [index, setIndex] = useState(0);

  if (!history || history.length < 2) {
    return (
      <Box display="flex" alignItems="center" justifyContent="center" height="100%" color="text.secondary">
        <Typography>No repair history available yet.</Typography>
      </Box>
    );
  }

  const oldCode = history[index];
  const newCode = history[index + 1];

  const handleNext = () => {
    if (index < history.length - 2) setIndex(index + 1);
  };

  const handlePrev = () => {
    if (index > 0) setIndex(index - 1);
  };

  // --- NEW: Clean, Professional GitHub-Dark Theme ---
  const newStyles = {
    variables: {
      dark: {
        // Base Colors
        diffViewerBackground: '#0d1117', // Matches your app background
        diffViewerColor: '#c9d1d9',      // Readable main text color
        
        // Additions (Green)
        addedBackground: 'rgba(46, 160, 67, 0.15)', // Subtle, transparent green
        addedColor: '#7ee787',                      // Bright, readable green text
        wordAddedBackground: 'rgba(46, 160, 67, 0.4)', // Slightly brighter for word emphasis

        // Deletions (Red)
        removedBackground: 'rgba(248, 81, 73, 0.15)', // Subtle, transparent red
        removedColor: '#ff7b72',                      // Bright, readable red text
        wordRemovedBackground: 'rgba(248, 81, 73, 0.4)', // Slightly brighter for word emphasis

        // Gutter (Line Numbers)
        gutterBackground: '#0d1117',     // Blends with background
        gutterColor: '#484f58',          // Subtle line numbers
        gutterBorderless: true,          // Cleaner look
      }
    },
    // Force the font family to match your editor
    codeFold: {
      fontFamily: 'JetBrains Mono, monospace',
      fontSize: '14px',
    },
    lineNumber: {
      fontFamily: 'JetBrains Mono, monospace',
      fontSize: '14px',
    }
  };

  return (
    <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', bgcolor: '#0d1117', height: '100%' }}>
      
      {/* 1. NAVIGATION BAR (Unchanged) */}
      <Paper 
        square 
        sx={{ 
          p: 1.5, 
          bgcolor: '#161b22', 
          borderBottom: '1px solid #30363d',
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between'
        }}
      >
        <Box display="flex" alignItems="center" gap={2}>
          <Typography variant="subtitle2" fontWeight="bold" color="white" display="flex" alignItems="center" gap={1}>
            <GitCommit size={16} className="text-blue-400"/>
            Reviewing Patch {index + 1} of {history.length - 1}
          </Typography>
          
          <Chip 
            label={index === history.length - 2 ? "Final Fix" : "Intermediate Patch"} 
            size="small" 
            color={index === history.length - 2 ? "success" : "primary"}
            variant="outlined"
            sx={{ borderRadius: 1, height: 24 }}
          />
        </Box>

        <Box display="flex" gap={1}>
          <Button 
            variant="outlined" 
            size="small" 
            startIcon={<ChevronLeft size={16}/>}
            onClick={handlePrev}
            disabled={index === 0}
            sx={{ borderColor: '#30363d', color: '#c9d1d9', '&:hover': { borderColor: '#58a6ff' } }}
          >
            Prev
          </Button>
          <Button 
            variant="outlined" 
            size="small" 
            endIcon={<ChevronRight size={16}/>}
            onClick={handleNext}
            disabled={index >= history.length - 2}
            sx={{ borderColor: '#30363d', color: '#c9d1d9', '&:hover': { borderColor: '#58a6ff' } }}
          >
            Next
          </Button>
        </Box>
      </Paper>

      {/* 2. DIFF VIEWER (With New Styles) */}
      <Box sx={{ flex: 1, overflow: 'auto', position: 'relative' }}>
        <ReactDiffViewer 
          oldValue={oldCode} 
          newValue={newCode} 
          splitView={true} 
          useDarkTheme={true}
          styles={newStyles} // <-- Applying the new clean styles here
        />
      </Box>
    </Box>
  );
};

export default DiffView;