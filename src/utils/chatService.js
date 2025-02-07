// src/utils/chatService.js

const { GoogleGenerativeAI } = require("@google/generative-ai");
const apiKey = process.env.REACT_APP_GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey);

const model = genAI.getGenerativeModel({
    model: "gemini-1.5-flash-8b",
    systemInstruction: `You are a friendly and knowledgeable cybersecurity assistant for the CyberShield platform. Your role is to:
    1. Answer questions about cybersecurity, online safety, and digital security
    2. Provide clear, actionable advice for staying safe online
    3. Explain complex security concepts in simple terms
    4. Support both English and Hindi language queries
    5. Focus on practical, real-world cybersecurity scenarios
    6. Never share harmful or malicious security information
    7. Always promote ethical and legal cybersecurity practices
    
    Keep responses concise (2-3 sentences when possible) and friendly. If you're unsure about something, admit it and suggest consulting official cybersecurity resources.`
});

const generationConfig = {
    temperature: 1,
    topP: 0.95,
    topK: 40,
    maxOutputTokens: 8192,
    responseMimeType: "text/plain",
};

export const getChatResponse = async (message) => {
    try {
        if (!apiKey) {
            throw new Error('REACT_APP_GEMINI_API_KEY is not configured');
        }

        const chatSession = model.startChat({
            generationConfig,
            history: []
        });

        const result = await chatSession.sendMessage(message);
        return result.response.text();
    } catch (error) {
        console.error('Chat Service Error:', error);
        throw new Error(error.message || 'Failed to get chat response');
    }
};