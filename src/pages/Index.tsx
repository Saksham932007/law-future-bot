
import { useState } from 'react';
import { Send, Scale, Sparkles, MessageCircle, Zap, Shield, Brain } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Hero3D } from '@/components/Hero3D';
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
      content: "Hello! I'm your AI Legal Assistant powered by Gemini. I can help you with legal questions, contract analysis, and general legal guidance. How can I assist you today?",
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
      {/* Enhanced Header with 3D Background */}
      <div className="relative border-b border-slate-700/50 bg-slate-900/50 backdrop-blur-xl">
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-blue-500/10"></div>
        <Hero3D />
        <div className="relative container mx-auto px-4 py-6">
          <motion.div 
            className="flex items-center justify-between"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex items-center space-x-4">
              <motion.div 
                className="p-3 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-2xl shadow-2xl shadow-cyan-500/25"
                whileHover={{ scale: 1.05, rotate: 5 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
              >
                <Scale className="h-8 w-8 text-white" />
              </motion.div>
              <div>
                <motion.h1 
                  className="text-3xl font-bold bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                >
                  LegalAI Assistant
                </motion.h1>
                <motion.p 
                  className="text-sm text-slate-400 font-medium"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                >
                  Powered by Gemini AI • Smart Legal Analysis
                </motion.p>
              </div>
            </div>
            <motion.div 
              className="flex items-center space-x-3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <Sparkles className="h-6 w-6 text-cyan-400 animate-pulse" />
              <span className="text-sm text-slate-300 font-medium">Smart Legal Analysis</span>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Enhanced Chat Interface */}
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <motion.div 
          className="bg-gradient-to-br from-slate-800/30 to-slate-900/30 backdrop-blur-xl rounded-3xl border border-slate-700/50 shadow-2xl overflow-hidden"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Messages */}
          <div className="h-[600px] overflow-y-auto p-8 space-y-6 scrollbar-thin scrollbar-thumb-slate-600 scrollbar-track-transparent">
            {messages.map((message, index) => (
              <ChatMessage 
                key={message.id} 
                message={message} 
                isLatest={index === messages.length - 1}
              />
            ))}
            {isLoading && <LoadingMessage />}
          </div>

          {/* Enhanced Input Form */}
          <div className="border-t border-slate-700/50 bg-gradient-to-r from-slate-900/50 to-slate-800/50 backdrop-blur-sm p-6">
            <form onSubmit={handleSubmit} className="flex items-center space-x-4">
              <div className="flex-1 relative">
                <Input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask me any legal question..."
                  disabled={isLoading}
                  className="bg-slate-800/50 border-slate-600 text-white placeholder-slate-400 focus:border-cyan-400 focus:ring-cyan-400/20 pr-12 h-14 rounded-2xl text-base"
                />
                <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                  <Scale className="h-5 w-5 text-slate-500" />
                </div>
              </div>
              
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  type="submit"
                  disabled={isLoading || !input.trim()}
                  className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white border-0 shadow-xl shadow-cyan-500/25 transition-all duration-300 hover:shadow-cyan-500/40 h-14 px-8 rounded-2xl font-medium"
                >
                  <Send className="h-5 w-5" />
                </Button>
              </motion.div>
            </form>
            <p className="text-xs text-slate-500 mt-3 text-center">
              ⚖️ AI-powered legal guidance • For informational purposes only
            </p>
          </div>
        </motion.div>
      </div>

      {/* Enhanced Features Section */}
      <div className="container mx-auto px-4 py-16">
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          {[
            {
              icon: MessageCircle,
              title: "Legal Q&A",
              description: "Get instant answers to your legal questions with AI-powered analysis and comprehensive guidance.",
              gradient: "from-cyan-500 to-blue-600",
              shadowColor: "shadow-cyan-500/25"
            },
            {
              icon: Shield,
              title: "Legal Analysis",
              description: "Receive detailed legal analysis and guidance on various legal matters and scenarios.",
              gradient: "from-purple-500 to-pink-600",
              shadowColor: "shadow-purple-500/25"
            },
            {
              icon: Brain,
              title: "Legal Research",
              description: "Research legal precedents and case law with advanced AI assistance and detailed analysis.",
              gradient: "from-emerald-500 to-teal-600",
              shadowColor: "shadow-emerald-500/25"
            }
          ].map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
              whileHover={{ scale: 1.05, y: -5 }}
            >
              <Card className="p-8 bg-gradient-to-br from-slate-800/30 to-slate-900/30 border-slate-700/50 backdrop-blur-xl hover:bg-slate-800/50 transition-all duration-300 group shadow-xl">
                <motion.div 
                  className={`p-4 bg-gradient-to-br ${feature.gradient} rounded-2xl w-fit mb-6 shadow-xl ${feature.shadowColor} group-hover:shadow-2xl transition-all duration-300`}
                  whileHover={{ rotate: 5 }}
                  transition={{ type: "spring", stiffness: 400, damping: 17 }}
                >
                  <feature.icon className="h-8 w-8 text-white" />
                </motion.div>
                <h3 className="text-xl font-bold text-white mb-3 group-hover:text-cyan-400 transition-colors">
                  {feature.title}
                </h3>
                <p className="text-slate-400 text-sm leading-relaxed">
                  {feature.description}
                </p>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
};

export default Index;
