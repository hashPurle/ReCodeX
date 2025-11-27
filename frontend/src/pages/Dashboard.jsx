import React from 'react';
import { Box, Typography, Chip } from '@mui/material';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Cpu, Zap, Shield, Activity, ArrowRight, Terminal } from 'lucide-react';

// ---------------------- FEATURES ----------------------
const features = [
  {
    id: 'debugger',
    title: 'Local AI Error Solver',
    desc: 'Autonomous repair loop for Python scripts. Runs locally.',
    icon: <Cpu size={22} />,
    color: '#2f81f7',
    path: '/ide',
    status: 'LIVE',
  },
  {
    id: 'optimizer',
    title: 'Code Optimizer',
    desc: 'Deep static analysis to reduce time complexity.',
    icon: <Zap size={22} />,
    color: '#e3b341',
    path: '#',
    status: 'SOON',
  },
  {
    id: 'security',
    title: 'Security Audit',
    desc: 'Vulnerability scanning for unsafe imports & injection risks.',
    icon: <Shield size={22} />,
    color: '#f85149',
    path: '#',
    status: 'SOON',
  },
  {
    id: 'metrics',
    title: 'Dev Metrics',
    desc: 'Real-time velocity tracking and error heatmaps.',
    icon: <Activity size={22} />,
    color: '#a371f7',
    path: '#',
    status: 'SOON',
  },
];

// ---------------------- BACKGROUND ----------------------
const AuroraBackground = () => (
  <div className="fixed inset-0 z-0 overflow-hidden bg-[#0d1117]">
    <motion.div
      animate={{ scale: [1, 1.15, 1], opacity: [0.25, 0.45, 0.25] }}
      transition={{ duration: 12, repeat: Infinity }}
      className="absolute -top-[20%] -left-[15%] w-[50vw] h-[50vw] rounded-full bg-blue-600/20 blur-[120px]"
    />
    <motion.div
      animate={{ scale: [1, 1.05, 1], opacity: [0.2, 0.35, 0.2] }}
      transition={{ duration: 14, repeat: Infinity }}
      className="absolute top-[25%] right-[0%] w-[40vw] h-[40vw] rounded-full bg-purple-600/15 blur-[120px]"
    />
  </div>
);

// ---------------------- CARD ----------------------
const FeatureCard = ({ feature, onClick }) => {
  const isLive = feature.status === 'LIVE';

  return (
    <motion.div
      whileHover={{ scale: 1.05, y: -8 }}
      transition={{ type: 'spring', stiffness: 160 }}
    >
      <Box
        sx={{
          width: 250,
          height: 280,
          p: 2.5,
          borderRadius: 3,
          cursor: isLive ? 'pointer' : 'default',
          background: 'rgba(22,27,34,0.7)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(56,139,253,0.2)',
          position: 'relative',
          overflow: 'hidden',
          transition: 'border 0.3s ease, box-shadow 0.3s ease',
          '&:hover': {
            border: '1px solid rgba(56,139,253,0.8)',     // soft blue border
            boxShadow: '0 0 18px rgba(56,139,253,0.4)',   // blue glow
          },
        }}
        onClick={onClick}
      >
        {/* Watermark Icon */}
        <motion.div
          animate={{ opacity: [0.03, 0.07, 0.03] }}
          transition={{ duration: 4, repeat: Infinity }}
          className="absolute -top-2 -right-2"
        >
          <Terminal size={70} />
        </motion.div>

        {/* Header */}
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Box
            sx={{
              p: 1,
              borderRadius: 2,
              border: '1px solid rgba(255,255,255,0.1)',
              color: feature.color,
              background: 'rgba(255,255,255,0.05)',
            }}
          >
            {feature.icon}
          </Box>

          <Chip
            label={feature.status}
            size="small"
            sx={{
              bgcolor: isLive ? 'rgba(46,160,67,0.25)' : 'rgba(48,54,61,0.4)',
              color: isLive ? '#3fb950' : '#8b949e',
              fontWeight: 700,
              fontSize: '0.7rem',
            }}
          />
        </Box>

        {/* Title */}
        <Typography
          variant="h6"
          fontWeight={800}
          color="white"
          sx={{ mt: 2, fontSize: '1.1rem' }}
        >
          {feature.title}
        </Typography>

        {/* Description */}
        <Typography
          variant="body2"
          sx={{ color: '#9ca3af', mt: 1, minHeight: 40 }}
        >
          {feature.desc}
        </Typography>

        {/* Button */}
        {isLive && (
          <motion.div whileHover={{ x: 6 }}>
            <Typography
              variant="body2"
              sx={{
                color: feature.color,
                fontWeight: 700,
                mt: 1,
                display: 'flex',
                alignItems: 'center',
                gap: 0.5,
              }}
            >
              LAUNCH <ArrowRight size={14} />
            </Typography>
          </motion.div>
        )}
      </Box>
    </motion.div>
  );
};

// ---------------------- DASHBOARD ----------------------
const Dashboard = () => {
  const navigate = useNavigate();

  // Greeting
  const hour = new Date().getHours();
  const greeting =
    hour < 12 ? 'Good Morning' :
    hour < 18 ? 'Good Afternoon' :
    'Good Evening';

  return (
    <Box sx={{ minHeight: '100vh', position: 'relative' }}>
      <AuroraBackground />

      <Box position="relative" zIndex={10} textAlign="center" pt={10}>

        {/* -------- HERO SECTION -------- */}
        <Typography variant="h5" fontWeight={700} sx={{ color: '#58a6ff', mb: 1 }}>
          {greeting}, Developer 👋
        </Typography>

        <Typography
          variant="h2"
          fontWeight={900}
          sx={{
            background: 'linear-gradient(to right, #3b82f6, #a855f7)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            fontSize: '3rem',
            mb: 2,
          }}
        >
          ReCodeX
        </Typography>

        <Typography
          variant="body1"
          sx={{
            color: '#9ca3af',
            fontSize: '1rem',
            maxWidth: 580,
            mx: 'auto',
            mb: 6,
            lineHeight: 1.6,
          }}
        >
          Your offline AI-powered developer toolkit — built to debug, repair,
          optimize, and enhance your code locally without internet.
        </Typography>

        {/* -------- CARD ROW -------- */}
        <Box
          sx={{
            display: 'flex',
            gap: 3,
            justifyContent: 'center',
            alignItems: 'center',
            width: '100%',
            overflowX: 'auto',
            py: 3,
            px: 4,
          }}
        >
          {features.map((feature) => (
            <FeatureCard
              key={feature.id}
              feature={feature}
              onClick={() =>
                feature.status === 'LIVE' && navigate(feature.path)
              }
            />
          ))}
        </Box>
      </Box>
    </Box>
  );
};

export default Dashboard;
