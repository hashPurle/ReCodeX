import React, { useRef, useState } from 'react';
import { Paper, Box, Typography, Stack, Chip, Button } from '@mui/material';
import { FileCode, Folder, FolderOpen, ChevronRight, ChevronDown, XCircle, FileJson, FileType, File } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// --- IMPORT ANIMATIONS ---
// Make sure src/animations/variants.js exists!
import { containerVar, itemVar } from '../animations/variants';

// --- HELPER: Build Tree from File List ---
const buildFileTree = (files) => {
  const root = [];
  
  files.forEach(file => {
    // Filter out node_modules and hidden files
    if (file.webkitRelativePath.includes('node_modules') || file.name.startsWith('.')) return;

    const parts = file.webkitRelativePath.split('/');
    let currentLevel = root;

    parts.forEach((part, index) => {
      const isFile = index === parts.length - 1;
      let existingNode = currentLevel.find(node => node.name === part);

      if (!existingNode) {
        existingNode = {
          name: part,
          type: isFile ? 'file' : 'folder',
          file: isFile ? file : null,
          children: []
        };
        currentLevel.push(existingNode);
      }

      if (!isFile) {
        currentLevel = existingNode.children;
      }
    });
  });

  return root;
};

// --- COMPONENT: Recursive File Node (Animated) ---
const FileTreeNode = ({ node, depth, onFileClick }) => {
  const [isOpen, setIsOpen] = useState(false);
  
  const getIcon = (name, type, isOpen) => {
    if (type === 'folder') return isOpen ? <FolderOpen size={14} color="#58a6ff" /> : <Folder size={14} color="#58a6ff" />;
    if (name.endsWith('.js') || name.endsWith('.jsx')) return <FileCode size={14} color="#f1e05a" />;
    if (name.endsWith('.css')) return <FileType size={14} color="#563d7c" />;
    if (name.endsWith('.json')) return <FileJson size={14} color="#e34c26" />;
    return <File size={14} color="#c9d1d9" />;
  };

  const handleClick = (e) => {
    e.stopPropagation();
    if (node.type === 'folder') {
      setIsOpen(!isOpen);
    } else {
      onFileClick(node.file);
    }
  };

  return (
    <Box sx={{ userSelect: 'none' }}>
      {/* ANIMATED ROW ITEM */}
      <motion.div
        variants={itemVar} // Apply Fade In Variant
        // No initial/animate here; the Parent Container controls the stagger!
        whileHover={{ x: 4, color: "#58a6ff" }} // Hover Effect: Slide right + Blue
        onClick={handleClick}
        style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: 6, 
          paddingTop: 4, 
          paddingBottom: 4, 
          paddingLeft: `${depth * 12 + 8}px`, 
          paddingRight: 8,
          cursor: 'pointer',
          color: '#c9d1d9',
          fontSize: '0.85rem',
          fontFamily: 'monospace',
          transition: 'background 0.1s' 
        }}
      >
        <Box sx={{ width: 16, display: 'flex', justifyContent: 'center' }}>
          {node.type === 'folder' && (
             isOpen ? <ChevronDown size={12} /> : <ChevronRight size={12} />
          )}
        </Box>
        {getIcon(node.name, node.type, isOpen)}
        <Typography variant="body2" sx={{ fontFamily: 'inherit', fontSize: 'inherit', pt: 0.2 }} noWrap>
          {node.name}
        </Typography>
      </motion.div>

      {/* RECURSIVE CHILDREN (Animated Open/Close) */}
      <AnimatePresence>
        {node.type === 'folder' && isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
            style={{ overflow: 'hidden' }}
          >
            {node.children.map((child, i) => (
              <FileTreeNode key={i} node={child} depth={depth + 1} onFileClick={onFileClick} />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </Box>
  );
};

// --- MAIN SIDEBAR COMPONENT ---
const Sidebar = ({ onFileSelect }) => {
  const [fileTree, setFileTree] = useState([]);
  const fileInputRef = useRef(null);

  const handleFolderUpload = (event) => {
    const uploadedFiles = Array.from(event.target.files);
    const tree = buildFileTree(uploadedFiles);
    
    // Sort: Folders first
    const sortNodes = (nodes) => {
      return nodes.sort((a, b) => {
        if (a.type === b.type) return a.name.localeCompare(b.name);
        return a.type === 'folder' ? -1 : 1;
      }).map(node => ({ ...node, children: sortNodes(node.children) }));
    };
    
    setFileTree(sortNodes(tree));
  };

  const handleFileClick = (file) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      onFileSelect(e.target.result, file.name);
    };
    reader.readAsText(file);
  };

  return (
    <Paper 
      square 
      sx={{ 
        width: '100%', 
        height: '100%', 
        borderRight: '1px solid #30363d', 
        display: 'flex', 
        flexDirection: 'column', 
        bgcolor: 'background.paper' 
      }}
    >
      
      {/* HEADER */}
      <Box p={2} borderBottom="1px solid #30363d">
        <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1.5, fontSize: '0.75rem', fontWeight: 700, letterSpacing: 1 }}>PROJECT</Typography>
        
        <input 
          type="file" 
          webkitdirectory="true" 
          directory="true" 
          multiple 
          ref={fileInputRef} 
          style={{ display: 'none' }} 
          onChange={handleFolderUpload}
        />
        
        <Button 
          variant="outlined" 
          size="small" 
          fullWidth
          onClick={() => fileInputRef.current.click()}
          sx={{ 
            color: '#c9d1d9', 
            borderColor: '#30363d', 
            textTransform: 'none',
            justifyContent: 'flex-start',
            gap: 1,
            '&:hover': { borderColor: 'primary.main', color: 'primary.main', bgcolor: 'rgba(47, 129, 247, 0.05)' }
          }}
        >
          <FolderOpen size={14} /> Open Folder
        </Button>
      </Box>

      {/* TREE VIEW CONTAINER */}
      <Box flex={1} overflow="auto" sx={{ '&::-webkit-scrollbar': { width: '4px' } }}>
        <Box pt={1}>
          {fileTree.length === 0 ? (
            <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic', fontSize: '0.8rem', opacity: 0.5, p: 2 }}>
              No project loaded.
            </Typography>
          ) : (
            // WRAPPER WITH CONTAINER VARIANT (Triggers the Stagger Effect)
            <motion.div
              variants={containerVar}
              initial="hidden"
              animate="visible"
            >
              {fileTree.map((node, i) => (
                <FileTreeNode key={i} node={node} depth={0} onFileClick={handleFileClick} />
              ))}
            </motion.div>
          )}
        </Box>
      </Box>

      {/* TIMELINE */}
      <Box p={2} borderTop="1px solid #30363d">
        <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1.5, fontSize: '0.75rem', fontWeight: 700, letterSpacing: 1 }}>REPAIR TIMELINE</Typography>
        <Stack spacing={1}>
           <Chip label="v1.0 Original" size="small" variant="outlined" icon={<XCircle size={12}/>} sx={{ justifyContent: 'flex-start', borderRadius: 1, borderColor: '#30363d', width: '100%' }} />
        </Stack>
      </Box>
    </Paper>
  );
};

export default Sidebar;