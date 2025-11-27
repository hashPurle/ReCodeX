import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Ide from './pages/Ide';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/ide" element={<Ide />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;