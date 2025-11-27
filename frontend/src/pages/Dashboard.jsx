import React from 'react';
import { Box, Typography, Grid, Chip } from '@mui/material';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Cpu, Zap, Shield, Activity, ArrowRight, Sparkles, Terminal } from 'lucide-react';

// --- DATA ---
const features = [
  {
    id: 'debugger',
    title: 'Local AI Error Solver',
    desc: 'Autonomous repair loop for Python scripts. Runs locally.',
    icon: <Cpu size={24} />, // Smaller Icon
    color: '#2f81f7',
    path: '/ide',
    status: 'LIVE',
    glow: 'rgba(47, 129, 247, 0.5)'
  },
  {
    id: 'optimizer',
    title: 'Code Optimizer',
    desc: 'Deep static analysis to reduce time complexity.',
    icon: <Zap size={24} />,
    color: '#e3b341',
    path: '#',
    status: 'SOON',
    glow: 'rgba(227, 179, 65, 0.5)'
  },
  {
    id: 'security',
    title: 'Security Audit',
    desc: 'Vulnerability scanning for unsafe imports & injection risks.',
    icon: <Shield size={24} />,
    color: '#f85149',
    path: '#',
    status: 'SOON',
    glow: 'rgba(248, 81, 73, 0.5)'
  },
  {
    id: 'metrics',
    title: 'Dev Metrics',
    desc: 'Real-time velocity tracking and error heatmaps.',
    icon: <Activity size={24} />,
    color: '#a371f7',
    path: '#',
    status: 'SOON',
    glow: 'rgba(163, 113, 247, 0.5)'
  }
];

// --- COMPONENTS ---

const AuroraBackground = () => (
  <div className="fixed inset-0 z-0 overflow-hidden bg-[#0d1117]">
    <motion.div 
      animate={{ scale: [1, 1.2, 1], rotate: [0, 90, 0], opacity: [0.3, 0.5, 0.3] }}
      transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
      className="absolute -top-[20%] -left-[10%] w-[50vw] h-[50vw] rounded-full bg-blue-600/20 blur-[120px]" 
    />
    <motion.div 
      animate={{ scale: [1, 1.1, 1], x: [0, 100, 0], opacity: [0.2, 0.4, 0.2] }}
      transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
      className="absolute top-[20%] right-[0%] w-[40vw] h-[40vw] rounded-full bg-purple-600/10 blur-[100px]" 
    />
    <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150 mix-blend-overlay"></div>
  </div>
);

const FeatureCard = ({ feature, onClick }) => {
  const isLive = feature.status === 'LIVE';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={isLive ? { y: -5, scale: 1.02 } : {}}
      transition={{ type: 'spring', stiffness: 200, damping: 20 }}
      onClick={onClick}
      className="h-full"
    >
      <Box
        sx={{
          position: 'relative',
          height: '100%',
          p: 2.5, // Reduced padding (Compact)
          borderRadius: 3,
          cursor: isLive ? 'pointer' : 'default',
          background: 'rgba(22, 27, 34, 0.6)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(48, 54, 61, 0.5)',
          overflow: 'hidden',
          transition: 'all 0.3s ease',
          '&:hover': isLive ? {
            borderColor: feature.color,
            boxShadow: `0 0 20px ${feature.glow}, inset 0 0 10px ${feature.glow}20`
          } : {},
          '&:hover .icon-box': {
            transform: 'scale(1.1) rotate(5deg)',
            bgcolor: feature.color,
            color: '#fff'
          }
        }}
      >
        {/* Background Icon Watermark (Smaller now) */}
        <div className="absolute -top-2 -right-2 p-3 opacity-5 pointer-events-none">
          <Terminal size={80} /> 
        </div>

        {/* Header: Icon + Status */}
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2} position="relative" zIndex={10}>
          <Box 
            className="icon-box"
            sx={{ 
              p: 1.2, // Smaller icon box
              borderRadius: 2, 
              bgcolor: 'rgba(255,255,255,0.05)', 
              color: feature.color,
              border: `1px solid ${feature.color}40`,
              transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
            }}
          >
            {feature.icon}
          </Box>
          <Chip 
            label={feature.status} 
            size="small" 
            sx={{ 
              height: 22, // Compact Chip
              fontSize: '0.7rem',
              bgcolor: isLive ? 'rgba(46, 160, 67, 0.2)' : 'rgba(48, 54, 61, 0.5)', 
              color: isLive ? '#3fb950' : '#8b949e',
              fontWeight: 800,
              letterSpacing: 0.5,
              border: '1px solid',
              borderColor: isLive ? '#3fb950' : 'transparent',
              backdropFilter: 'blur(4px)'
            }} 
          />
        </Box>

        {/* Content */}
        <Box position="relative" zIndex={10}>
          <Typography variant="h6" fontWeight="800" color="white" gutterBottom sx={{ fontSize: '1.1rem', letterSpacing: -0.5 }}>
            {feature.title}
          </Typography>
          <Typography variant="body2" color="#8b949e" mb={2} sx={{ fontSize: '0.85rem', lineHeight: 1.5, minHeight: 40 }}>
            {feature.desc}
          </Typography>

          {/* Action Button */}
          {isLive && (
            <motion.div whileHover={{ x: 5 }}>
              <Typography 
                variant="button" 
                display="flex" 
                alignItems="center" 
                gap={0.5} 
                sx={{ 
                  color: feature.color, 
                  fontWeight: 800, 
                  fontSize: '0.75rem',
                  letterSpacing: 0.5
                }}
              >
                LAUNCH <ArrowRight size={14} />
              </Typography>
            </motion.div>
          )}
        </Box>
      </Box>
    </motion.div>
  );
};

// --- MAIN PAGE ---
const Dashboard = () => {
  const navigate = useNavigate();

  return (
    <Box sx={{ minHeight: '100vh', position: 'relative' }}>
      
      <AuroraBackground />

      <Box 
        position="relative" 
        zIndex={10} 
        display="flex" 
        flexDirection="column" 
        alignItems="center" 
        justifyContent="center" 
        minHeight="100vh"
        p={3}
      >
        
        {/* HERO HEADER */}
        <Box textAlign="center" mb={6} maxWidth={800}>
          <motion.div 
            initial={{ opacity: 0, y: -20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.8, ease: "circOut" }}
          >
            <Box display="inline-flex" alignItems="center" gap={1} mb={2} px={1.5} py={0.5} borderRadius={10} bgcolor="rgba(47, 129, 247, 0.15)" border="1px solid rgba(47, 129, 247, 0.3)">
              <Sparkles size={12} className="text-blue-400" />
              <Typography variant="caption" fontWeight="bold" color="primary.main" letterSpacing={1} fontSize="0.7rem">
                SYSTEM V2.0 ONLINE
              </Typography>
            </Box>

            <Typography 
              variant="h2" 
              fontWeight="900" 
              color="white" 
              sx={{ 
                fontSize: { xs: '2.5rem', md: '3.5rem' }, // Smaller Title
                letterSpacing: -1.5, 
                lineHeight: 1,
                mb: 1.5,
                background: 'linear-gradient(to right, #fff, #94a3b8)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                dropShadow: '0 0 20px rgba(255,255,255,0.1)'
              }}
            >
              The Ultimate Offline <br/> 
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-600">
                Developer Toolkit
              </span>
            </Typography>

            <Typography variant="body1" color="#8b949e" sx={{ fontSize: '0.95rem', fontWeight: 400, maxWidth: 500, mx: 'auto', lineHeight: 1.5 }}>
              Local-first debugging, optimization, and security tools. <br/> 
              Powered by advanced static analysis and AI models.
            </Typography>
          </motion.div>
        </Box>

        {/* GRID OF CARDS (Constrained Width for Compactness) */}
        <Box sx={{ width: '100%', maxWidth: 900 }}> {/* Tighter Width */}
          <Grid container spacing={2}> {/* Tighter Spacing */}
            {features.map((feature, index) => (
              <Grid item xs={12} sm={6} key={feature.id}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 + 0.3, duration: 0.4 }}
                >
                  <FeatureCard 
                    feature={feature} 
                    onClick={() => feature.status === 'LIVE' && navigate(feature.path)} 
                  />
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </Box>

      </Box>
    </Box>
  );
};

export default Dashboard;