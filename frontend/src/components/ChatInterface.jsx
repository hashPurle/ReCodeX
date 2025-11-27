import React, { useState, useRef, useEffect } from 'react';
import { Box, TextField, IconButton, Typography, Avatar } from '@mui/material';
import { Send, Bot, User } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const ChatInterface = () => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([
    { id: 1, sender: 'ai', text: "Hello! I analyzed your code. I found an IndexError in the loop logic. Ask me anything about the fix!" }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef(null);

  // Auto-scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSend = () => {
    if (!input.trim()) return;

    const userMsg = { id: Date.now(), sender: 'user', text: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    // MOCK AI RESPONSE (Replace with real API later)
    setTimeout(() => {
      const aiMsg = { 
        id: Date.now() + 1, 
        sender: 'ai', 
        text: "The loop was running 1 step too far because 'range(len(arr))' already goes from 0 to n-1. Adding '+1' caused it to access an index that doesn't exist." 
      };
      setMessages(prev => [...prev, aiMsg]);
      setIsTyping(false);
    }, 1500);
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%', bgcolor: '#0d1117' }}>
      
      {/* 1. MESSAGES AREA */}
      <Box 
        ref={scrollRef} 
        sx={{ 
          flex: 1, 
          overflowY: 'auto', 
          p: 2, 
          display: 'flex', 
          flexDirection: 'column', 
          gap: 2 
        }}
      >
        <AnimatePresence>
          {messages.map((msg) => (
            <motion.div 
              key={msg.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              display="flex"
              style={{ 
                alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                flexDirection: msg.sender === 'user' ? 'row-reverse' : 'row',
                alignItems: 'flex-start',
                gap: 8,
                maxWidth: '90%'
              }}
            >
              {/* Avatar */}
              <Avatar sx={{ 
                width: 28, height: 28, 
                bgcolor: msg.sender === 'user' ? '#238636' : '#1f6feb',
                fontSize: '0.8rem'
              }}>
                {msg.sender === 'user' ? <User size={16} /> : <Bot size={16} />}
              </Avatar>

              {/* Bubble */}
              <Box sx={{ 
                bgcolor: msg.sender === 'user' ? '#238636' : '#1f2428', 
                color: 'white',
                p: 1.5, 
                borderRadius: 2,
                borderTopLeftRadius: msg.sender === 'ai' ? 0 : 8,
                borderTopRightRadius: msg.sender === 'user' ? 0 : 8,
                border: '1px solid',
                borderColor: msg.sender === 'user' ? 'transparent' : '#30363d',
                fontSize: '0.85rem',
                lineHeight: 1.5,
                boxShadow: '0 2px 5px rgba(0,0,0,0.2)'
              }}>
                {msg.text}
              </Box>
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Typing Indicator */}
        {isTyping && (
          <Box display="flex" gap={1} ml={1}>
             <motion.div animate={{ opacity: [0.4, 1, 0.4] }} transition={{ repeat: Infinity, duration: 1.5 }} style={{ width: 6, height: 6, borderRadius: '50%', background: '#8b949e' }} />
             <motion.div animate={{ opacity: [0.4, 1, 0.4] }} transition={{ repeat: Infinity, duration: 1.5, delay: 0.2 }} style={{ width: 6, height: 6, borderRadius: '50%', background: '#8b949e' }} />
             <motion.div animate={{ opacity: [0.4, 1, 0.4] }} transition={{ repeat: Infinity, duration: 1.5, delay: 0.4 }} style={{ width: 6, height: 6, borderRadius: '50%', background: '#8b949e' }} />
          </Box>
        )}
      </Box>

      {/* 2. INPUT AREA */}
      <Box sx={{ p: 2, borderTop: '1px solid #30363d', bgcolor: '#161b22' }}>
        <Box 
          sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            bgcolor: '#0d1117', 
            borderRadius: 2, 
            border: '1px solid #30363d',
            px: 1
          }}
        >
          <TextField
            fullWidth
            placeholder="Ask about the error..."
            variant="standard"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            InputProps={{ 
              disableUnderline: true, 
              sx: { color: 'white', fontSize: '0.9rem', p: 1 } 
            }}
          />
          <IconButton onClick={handleSend} disabled={!input.trim()} sx={{ color: '#58a6ff' }}>
            <Send size={18} />
          </IconButton>
        </Box>
      </Box>

    </Box>
  );
};

export default ChatInterface;