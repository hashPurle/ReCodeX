import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Ide from './pages/Ide';

// --- IMPORT THE NEW BORDER EFFECT ---
import CyberBorder from './components/effects/CyberBorder';

function App() {
  return (
    <BrowserRouter>
      {/* We place CyberBorder here so it renders on top of 
        every page but isn't affected by route changes 
      */}
      <CyberBorder />

      <Routes>
        {/* Route 1: The Landing Page (Grid) */}
        <Route path="/" element={<Dashboard />} />
        
        {/* Route 2: The Debugger Tool */}
        <Route path="/ide" element={<Ide />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;