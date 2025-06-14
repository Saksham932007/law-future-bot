import { useState } from 'react';
import { Send, Scale, Sparkles, MessageCircle, Zap, Shield, Brain } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { ChatMessage } from '@/components/ChatMessage';
import { LoadingMessage } from '@/components/LoadingMessage';
import { motion } from 'framer-motion';

interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
}

// Embedded API key
const GEMINI_API_KEY = 'AIzaSyAYYBn61_8r8tnVYUTqVxKvcy7PYQa5Jow';

const Index = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: "Hello! I'm your AI Legal Assistant. I can help you with legal questions, contract analysis, and general legal guidance. How can I assist you today?",
      role: 'assistant',
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: input,
      role: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    const currentInput = input;
    setInput('');
    setIsLoading(true);

    try {
      const prompt = `You are a professional AI legal assistant. Provide helpful, accurate legal information and guidance. Always remind users that your responses are for informational purposes only and not a substitute for professional legal advice. Be thorough, professional, and cite relevant legal principles when appropriate.\n\nUser: ${currentInput}`;

      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: prompt
                }
              ]
            }
          ],
          generationConfig: {
            temperature: 0.7,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 2000,
          }
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to get AI response');
      }

      const data = await response.json();
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: data.candidates[0].content.parts[0].text,
        role: 'assistant',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to get AI response. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white overflow-hidden">
      {/* Enhanced Header */}
      <div className="relative border-b border-slate-700/30 bg-slate-900/20 backdrop-blur-xl">
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/5 to-blue-500/5"></div>
        <div className="relative container mx-auto px-6 py-4">
          <motion.div 
            className="flex items-center justify-between"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center space-x-4">
              <motion.div 
                className="relative p-3 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-2xl shadow-2xl shadow-cyan-500/20"
                whileHover={{ scale: 1.05, rotate: 5 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
              >
                <Scale className="h-7 w-7 text-white" />
                <div className="absolute inset-0 bg-gradient-to-br from-cyan-400/30 to-blue-500/30 rounded-2xl blur-sm"></div>
              </motion.div>
              <div>
                <motion.h1 
                  className="text-2xl font-bold bg-gradient-to-r from-cyan-300 via-blue-300 to-purple-300 bg-clip-text text-transparent"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                >
                  LegalAI Assistant
                </motion.h1>
                <motion.p 
                  className="text-sm text-slate-400 font-medium"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.3 }}
                >
                  Smart Legal Analysis
                </motion.p>
              </div>
            </div>
            <motion.div 
              className="flex items-center space-x-3 bg-slate-800/30 px-4 py-2 rounded-full border border-slate-600/30"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <div className="relative">
                <Sparkles className="h-5 w-5 text-cyan-400" />
                <div className="absolute inset-0 animate-ping">
                  <Sparkles className="h-5 w-5 text-cyan-400/50" />
                </div>
              </div>
              <span className="text-sm text-slate-300 font-medium">AI Legal Assistant</span>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Main Chat Interface */}
      <div className="container mx-auto px-6 py-6 max-w-5xl">
        <motion.div 
          className="bg-gradient-to-br from-slate-800/20 to-slate-900/20 backdrop-blur-2xl rounded-3xl border border-slate-700/30 shadow-2xl overflow-hidden"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Messages Container */}
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-b from-slate-800/10 via-transparent to-slate-900/10 pointer-events-none"></div>
            <div className="h-[600px] overflow-y-auto p-8 space-y-8 scrollbar-thin scrollbar-thumb-slate-600/50 scrollbar-track-transparent hover:scrollbar-thumb-slate-500/70 transition-colors">
              {messages.map((message, index) => (
                <ChatMessage 
                  key={message.id} 
                  message={message} 
                  isLatest={index === messages.length - 1}
                />
              ))}
              {isLoading && <LoadingMessage />}
            </div>
          </div>

          {/* Enhanced Input Section */}
          <div className="relative border-t border-slate-700/30 bg-gradient-to-r from-slate-900/30 to-slate-800/30 backdrop-blur-sm">
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/5 to-blue-500/5"></div>
            <div className="relative p-6">
              <form onSubmit={handleSubmit} className="flex items-end space-x-4">
                <div className="flex-1 relative group">
                  <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-2xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="relative">
                    <Input
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      placeholder="Ask me any legal question..."
                      disabled={isLoading}
                      className="bg-slate-800/60 border-slate-600/50 text-white placeholder-slate-400 focus:border-cyan-400/70 focus:ring-cyan-400/20 pr-12 h-16 rounded-2xl text-base font-medium shadow-xl backdrop-blur-sm transition-all duration-300 focus:bg-slate-800/80 focus:shadow-cyan-500/10"
                    />
                    <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                      <Scale className="h-5 w-5 text-slate-500 group-hover:text-cyan-400 transition-colors duration-300" />
                    </div>
                  </div>
                </div>
                
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    type="submit"
                    disabled={isLoading || !input.trim()}
                    className="relative bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white border-0 shadow-xl shadow-cyan-500/25 transition-all duration-300 hover:shadow-cyan-500/40 hover:shadow-lg h-16 px-8 rounded-2xl font-semibold group overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-blue-500 opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
                    <Send className="h-5 w-5 relative z-10" />
                  </Button>
                </motion.div>
              </form>
              
              {/* Enhanced Footer */}
              <div className="flex items-center justify-center mt-4 space-x-4">
                <div className="flex items-center space-x-2 text-slate-500 text-xs">
                  <Shield className="h-4 w-4" />
                  <span>Secure & Confidential</span>
                </div>
                <div className="w-1 h-1 bg-slate-600 rounded-full"></div>
                <div className="flex items-center space-x-2 text-slate-500 text-xs">
                  <Brain className="h-4 w-4" />
                  <span>AI-Powered Legal Guidance</span>
                </div>
                <div className="w-1 h-1 bg-slate-600 rounded-full"></div>
                <div className="flex items-center space-x-2 text-slate-500 text-xs">
                  <Zap className="h-4 w-4" />
                  <span>For Informational Purposes Only</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Index;
