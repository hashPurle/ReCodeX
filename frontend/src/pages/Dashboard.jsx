import React from 'react';
import { Box, Typography, Chip, Grid } from '@mui/material';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  Cpu, Zap, Shield, Activity, ArrowRight, Terminal, 
  FileText, BarChart2, GitPullRequest, HelpCircle 
} from 'lucide-react';

// --- DATA ---
const features = [
  { id: 'debugger', title: 'Local AI Error Solver', desc: 'Autonomous repair loop for Python scripts. Runs locally.', icon: <Cpu size={22} />, color: '#2f81f7', path: '/ide', status: 'LIVE' },
  { id: 'optimizer', title: 'Code Optimizer', desc: 'Deep static analysis to reduce time complexity.', icon: <Zap size={22} />, color: '#e3b341', path: '#', status: 'SOON' },
  { id: 'security', title: 'Security Audit', desc: 'Vulnerability scanning for unsafe imports & injection risks.', icon: <Shield size={22} />, color: '#f85149', path: '#', status: 'SOON' },
  { id: 'metrics', title: 'Dev Metrics', desc: 'Real-time velocity tracking and error heatmaps.', icon: <Activity size={22} />, color: '#a371f7', path: '#', status: 'SOON' },
  { id: 'docs', title: 'Doc Generator', desc: 'Auto-generate docstrings, comments, and READMEs.', icon: <FileText size={22} />, color: '#3fb950', path: '#', status: 'SOON' },
  { id: 'complexity', title: 'Complexity Analysis', desc: 'Big-O visualization and cyclomatic complexity scoring.', icon: <BarChart2 size={22} />, color: '#db61a2', path: '#', status: 'SOON' },
  { id: 'commits', title: 'Commit Summarizer', desc: 'Generate semantic git commit messages automatically.', icon: <GitPullRequest size={22} />, color: '#f0883e', path: '#', status: 'SOON' },
  { id: 'doubtnut', title: 'Doubtnut AI', desc: 'Instant answers to logic doubts and syntax queries.', icon: <HelpCircle size={22} />, color: '#38bdf8', path: '#', status: 'SOON' },
];

// --- BACKGROUND COMPONENT ---
const AuroraBackground = () => (
  <div className="fixed inset-0 z-0 overflow-hidden bg-[#0d1117]">
    <motion.div animate={{ scale: [1, 1.15, 1], opacity: [0.25, 0.45, 0.25] }} transition={{ duration: 12, repeat: Infinity }} className="absolute -top-[20%] -left-[15%] w-[50vw] h-[50vw] rounded-full bg-blue-600/20 blur-[120px]" />
    <motion.div animate={{ scale: [1, 1.05, 1], opacity: [0.2, 0.35, 0.2] }} transition={{ duration: 14, repeat: Infinity }} className="absolute top-[25%] right-[0%] w-[40vw] h-[40vw] rounded-full bg-purple-600/15 blur-[120px]" />
  </div>
);

// --- FEATURE CARD COMPONENT ---
const FeatureCard = ({ feature, onClick }) => {
  const isLive = feature.status === 'LIVE';
  return (
    <motion.div whileHover={{ scale: 1.03, y: -5 }} whileTap={{ scale: 0.98 }} transition={{ type: 'spring', stiffness: 200, damping: 15 }} style={{ height: '100%' }}>
      <Box onClick={onClick} sx={{ height: '100%', minHeight: 220, p: 2.5, borderRadius: 3, cursor: isLive ? 'pointer' : 'default', background: 'rgba(22,27,34,0.6)', backdropFilter: 'blur(12px)', border: '1px solid rgba(56,139,253,0.15)', position: 'relative', overflow: 'hidden', display: 'flex', flexDirection: 'column', transition: 'border 0.3s ease, box-shadow 0.3s ease, background 0.3s', '&:hover': { background: 'rgba(22,27,34,0.8)', border: `1px solid ${feature.color}80`, boxShadow: `0 0 20px ${feature.color}20` } }}>
        <motion.div animate={{ opacity: [0.03, 0.07, 0.03] }} transition={{ duration: 4, repeat: Infinity }} className="absolute -top-4 -right-4 pointer-events-none"><Terminal size={90} /></motion.div>
        <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
          <Box sx={{ p: 1, borderRadius: 2, border: `1px solid ${feature.color}30`, color: feature.color, background: `${feature.color}10` }}>{feature.icon}</Box>
          <Chip label={feature.status} size="small" sx={{ bgcolor: isLive ? 'rgba(46,160,67,0.2)' : 'rgba(48,54,61,0.5)', color: isLive ? '#3fb950' : '#8b949e', fontWeight: 800, fontSize: '0.65rem', border: '1px solid', borderColor: isLive ? '#3fb950' : 'transparent' }} />
        </Box>
        <Typography variant="h6" fontWeight={700} color="white" sx={{ fontSize: '1rem', lineHeight: 1.2, mb: 1 }}>{feature.title}</Typography>
        <Typography variant="body2" sx={{ color: '#8b949e', fontSize: '0.8rem', lineHeight: 1.5, flex: 1 }}>{feature.desc}</Typography>
        {isLive && (<Box mt={2}><motion.div whileHover={{ x: 4 }}><Typography variant="body2" sx={{ color: feature.color, fontWeight: 700, fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: 0.5, textTransform: 'uppercase', letterSpacing: 0.5 }}>Launch <ArrowRight size={14} /></Typography></motion.div></Box>)}
      </Box>
    </motion.div>
  );
};

// --- MAIN DASHBOARD PAGE ---
const Dashboard = () => {
  const navigate = useNavigate();
  
  return (
    <Box sx={{ minHeight: '100vh', position: 'relative', display: 'flex', flexDirection: 'column' }}>
      <AuroraBackground />

      <Box position="relative" zIndex={10} pt={6} pb={8} px={4} maxWidth={1400} mx="auto" width="100%">
        
        {/* -------- WIDE HEADER SECTION -------- */}
        <Box display="flex" justifyContent="center" mb={8}>
          <motion.div 
            initial={{ y: -20, opacity: 0 }} 
            animate={{ y: 0, opacity: 1 }} 
            transition={{ duration: 0.8 }}
            style={{ width: '100%', maxWidth: '1000px' }}
          >
            {/* WIDE BLUE HERO BOX */}
            <Box 
              textAlign="center"
              sx={{
                background: 'linear-gradient(180deg, rgba(30, 58, 138, 0.25) 0%, rgba(13, 17, 23, 0) 100%)',
                border: '1px solid rgba(59, 130, 246, 0.3)',
                borderRadius: 4,
                p: { xs: 3, md: 6 },
                boxShadow: '0 0 60px rgba(37, 99, 235, 0.15)',
                backdropFilter: 'blur(10px)'
              }}
            >
              <Typography variant="subtitle1" fontWeight={700} sx={{ color: '#58a6ff', mb: 1, letterSpacing: 2, textTransform: 'uppercase', fontSize: '0.85rem' }}>
                System Ready • v2.0.4
              </Typography>

              <Typography variant="h2" fontWeight={900} sx={{ background: 'linear-gradient(to right, #ffffff, #94a3b8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', fontSize: { xs: '3rem', md: '5rem' }, mb: 2, letterSpacing: -2 }}>
                ReCodeX <span style={{ color: '#2f81f7', WebkitTextFillColor: '#2f81f7' }}>Suite</span>
              </Typography>

              <Typography variant="body1" sx={{ color: '#c9d1d9', fontSize: '1.1rem', maxWidth: 600, mx: 'auto', lineHeight: 1.6 }}>
                The industry-standard autonomous repair engine.<br/> 
                Debug, optimize, and fortify your codebase—<strong style={{ color: '#58a6ff' }}>100% offline.</strong>
              </Typography>
            </Box>
          </motion.div>
        </Box>

        {/* -------- GRID CONTAINER -------- */}
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: 'repeat(4, 1fr)' }, gap: 3 }}>
          {features.map((feature, index) => (
            <motion.div key={feature.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1, duration: 0.5 }}>
              <FeatureCard feature={feature} onClick={() => feature.status === 'LIVE' && navigate(feature.path)} />
            </motion.div>
          ))}
        </Box>

      </Box>
    </Box>
  );
};

export default Dashboard;