import React, { useState, useRef, useEffect } from 'react';
import { Box, TextField, IconButton, Avatar } from '@mui/material';
import { Send, Bot, User } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const ChatInterface = () => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([
    { id: 1, sender: 'ai', text: "Hello! I analyzed your code. Ask me anything about the error or the fix!" }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef(null);

  // Auto-scroll
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userText = input;
    const userMsg = { id: Date.now(), sender: 'user', text: userText };
    
    // 1. Add User Message
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    try {
      // --- OPTION A: REAL BACKEND CALL (Uncomment if Backend is ready) ---
      /*
      const response = await fetch('http://localhost:8000/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userText })
      });
      const data = await response.json();
      const aiResponse = data.reply; 
      */

      // --- OPTION B: SMART SIMULATION (For Hackathon Demo) ---
      // This switches responses based on keywords so it feels "real"
      let aiResponse = "I'm not sure about that details. Can you be more specific?";
      
      const lowerInput = userText.toLowerCase();
      
      if (lowerInput.includes("error") || lowerInput.includes("bug")) {
        aiResponse = "The main error was an **IndexError**. The loop `range(len(arr) + 1)` tries to access an index that doesn't exist. Arrays are 0-indexed.";
      } else if (lowerInput.includes("fix") || lowerInput.includes("solve")) {
        aiResponse = "I fixed it by changing the loop range to `range(len(arr))`. This ensures we stop exactly at the last valid element.";
      } else if (lowerInput.includes("thank")) {
        aiResponse = "You're welcome! Let me know if you need help optimizing this further.";
      } else if (lowerInput.includes("complexity") || lowerInput.includes("time")) {
        aiResponse = "This code runs in **O(n)** time complexity since it iterates through the list once.";
      }

      // Simulate network delay
      setTimeout(() => {
        const aiMsg = { id: Date.now() + 1, sender: 'ai', text: aiResponse };
        setMessages(prev => [...prev, aiMsg]);
        setIsTyping(false);
      }, 1000 + Math.random() * 1000); // Random delay 1-2s

    } catch (error) {
      setIsTyping(false);
      setMessages(prev => [...prev, { id: Date.now(), sender: 'ai', text: "Error connecting to local AI engine." }]);
    }
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%', bgcolor: '#0d1117' }}>
      
      {/* MESSAGES AREA */}
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
              style={{ 
                display: 'flex',
                alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                flexDirection: msg.sender === 'user' ? 'row-reverse' : 'row',
                alignItems: 'flex-start',
                gap: 8,
                maxWidth: '90%'
              }}
            >
              <Avatar sx={{ 
                width: 28, height: 28, 
                bgcolor: msg.sender === 'user' ? '#238636' : '#1f6feb',
                fontSize: '0.8rem'
              }}>
                {msg.sender === 'user' ? <User size={16} /> : <Bot size={16} />}
              </Avatar>

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
                {/* Render simple markdown-like bolding */}
                {msg.text.split("**").map((part, i) => 
                  i % 2 === 1 ? <strong key={i}>{part}</strong> : part
                )}
              </Box>
            </motion.div>
          ))}
        </AnimatePresence>

        {isTyping && (
          <Box display="flex" gap={1} ml={1} alignItems="center">
             <Bot size={16} color="#8b949e" />
             <motion.div animate={{ opacity: [0.4, 1, 0.4] }} transition={{ repeat: Infinity, duration: 1.5 }} style={{ width: 4, height: 4, borderRadius: '50%', background: '#8b949e' }} />
             <motion.div animate={{ opacity: [0.4, 1, 0.4] }} transition={{ repeat: Infinity, duration: 1.5, delay: 0.2 }} style={{ width: 4, height: 4, borderRadius: '50%', background: '#8b949e' }} />
             <motion.div animate={{ opacity: [0.4, 1, 0.4] }} transition={{ repeat: Infinity, duration: 1.5, delay: 0.4 }} style={{ width: 4, height: 4, borderRadius: '50%', background: '#8b949e' }} />
          </Box>
        )}
      </Box>

      {/* INPUT AREA */}
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