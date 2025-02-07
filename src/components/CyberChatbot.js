import React, { useState, useRef, useEffect } from 'react';
import {
    Paper,
    TextField,
    IconButton,
    Box,
    Typography,
    CircularProgress
} from '@mui/material';
import { Send, Close } from '@mui/icons-material';
import { getChatResponse } from '../utils/chatService';

const CyberChatbot = () => {
    const [messages, setMessages] = useState([
        { text: "Hi! I'm your CyberShield assistant. Ask me anything about cybersecurity!", type: 'bot' }
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isChatOpen, setIsChatOpen] = useState(false);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSend = async () => {
        if (!input.trim()) return;

        // Add user message
        setMessages(prev => [...prev, { text: input, type: 'user' }]);
        setIsLoading(true);

        try {
            const response = await getChatResponse(input);
            setMessages(prev => [...prev, { text: response, type: 'bot' }]);
        } catch (error) {
            setMessages(prev => [...prev, {
                text: "Sorry, I'm having trouble connecting right now. Please try again later.",
                type: 'bot'
            }]);
        } finally {
            setIsLoading(false);
            setInput('');
        }
    };

    
    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    return (
        <Box sx={{ position: 'fixed', bottom: 20, right: 20, zIndex: 1000 }}>
            {isChatOpen ? (
                <Paper
                    elevation={3}
                    sx={{
                        width: 350,
                        height: 500,
                        display: 'flex',
                        flexDirection: 'column',
                        overflow: 'hidden'
                    }}
                >
                    {/* Header */}
                    <Box
                        sx={{
                            p: 2,
                            backgroundColor: 'primary.main',
                            color: 'white',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center'
                        }}
                    >
                        <Typography variant="h6">CyberShield Assistant</Typography>
                        <IconButton
                            size="small"
                            onClick={() => setIsChatOpen(false)}
                            sx={{ color: 'white' }}
                        >
                            <Close />
                        </IconButton>
                    </Box>

                    {/* Messages Area */}
                    <Box
                        sx={{
                            flex: 1,
                            overflowY: 'auto',
                            p: 2,
                            display: 'flex',
                            flexDirection: 'column',
                            gap: 1
                        }}
                    >
                        {messages.map((message, index) => (
                            <Box
                                key={index}
                                sx={{
                                    alignSelf: message.type === 'user' ? 'flex-end' : 'flex-start',
                                    maxWidth: '80%'
                                }}
                            >
                                <Paper
                                    sx={{
                                        p: 1,
                                        backgroundColor: message.type === 'user' ? 'primary.main' : 'grey.100',
                                        color: message.type === 'user' ? 'white' : 'text.primary'
                                    }}
                                >
                                    <Typography variant="body2">{message.text}</Typography>
                                </Paper>
                            </Box>
                        ))}
                        {isLoading && (
                            <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
                                <CircularProgress size={20} />
                            </Box>
                        )}
                        <div ref={messagesEndRef} />
                    </Box>

                    {/* Input Area */}
                    <Box sx={{ p: 2, backgroundColor: 'grey.100' }}>
                        <TextField
                            fullWidth
                            variant="outlined"
                            size="small"
                            placeholder="Ask about cybersecurity..."
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyPress={handleKeyPress}
                            InputProps={{
                                endAdornment: (
                                    <IconButton onClick={handleSend} disabled={isLoading}>
                                        <Send />
                                    </IconButton>
                                )
                            }}
                        />
                    </Box>
                </Paper>
            ) : (
                <IconButton
                    onClick={() => setIsChatOpen(true)}
                    sx={{
                        backgroundColor: 'primary.main',
                        color: 'white',
                        '&:hover': {
                            backgroundColor: 'primary.dark',
                        },
                        width: 60,
                        height: 60,
                    }}
                >
                    <Typography variant="h5">💬</Typography>
                </IconButton>
            )}
        </Box>
    );
};

export default CyberChatbot;