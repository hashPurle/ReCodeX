import React from 'react'
import { createRoot } from 'react-dom/client'
import { ThemeProvider, CssBaseline } from '@mui/material';
import { theme } from './theme/muiTheme'; // Importing the theme file you just created
import App from './App.jsx'
import './index.css'

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {/* This wraps the whole app in your Dark/Cyberpunk Theme */}
    <ThemeProvider theme={theme}>
      <CssBaseline /> {/* This resets basic CSS to match the dark theme */}
      <App />
    </ThemeProvider>
  </React.StrictMode>,
)
