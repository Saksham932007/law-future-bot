import { useState } from 'react';
import { Send, Scale, Sparkles, MessageCircle, User, Bot } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';

interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
}

const Index = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: "Hello! I'm your AI Legal Assistant powered by Claude. I can help you with legal questions, document review, contract analysis, and general legal guidance. How can I assist you today?",
      role: 'assistant',
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [apiKey, setApiKey] = useState('');
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    if (!apiKey) {
      toast({
        title: "API Key Required",
        description: "Please enter your Anthropic API key to continue.",
        variant: "destructive"
      });
      return;
    }

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
      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'x-api-key': apiKey,
          'Content-Type': 'application/json',
          'anthropic-version': '2023-06-01'
        },
        body: JSON.stringify({
          model: 'claude-3-5-sonnet-20241022',
          max_tokens: 1000,
          system: 'You are a professional AI legal assistant. Provide helpful, accurate legal information and guidance. Always remind users that your responses are for informational purposes only and not a substitute for professional legal advice. Be thorough, professional, and cite relevant legal principles when appropriate.',
          messages: [
            ...messages.map(msg => ({
              role: msg.role,
              content: msg.content
            })),
            {
              role: 'user',
              content: currentInput
            }
          ]
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to get AI response');
      }

      const data = await response.json();
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: data.content[0].text,
        role: 'assistant',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to get AI response. Please check your API key and try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
      {/* Header */}
      <div className="border-b border-slate-700/50 bg-slate-900/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-xl shadow-lg shadow-cyan-500/25">
                <Scale className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                  LegalAI Assistant
                </h1>
                <p className="text-sm text-slate-400">Powered by Claude</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Sparkles className="h-5 w-5 text-cyan-400 animate-pulse" />
              <span className="text-sm text-slate-400">AI-Powered Legal Guidance</span>
            </div>
          </div>
        </div>
      </div>

      {/* API Key Input */}
      {!apiKey && (
        <div className="container mx-auto px-4 py-6">
          <Card className="max-w-md mx-auto p-6 bg-slate-800/50 border-slate-700 backdrop-blur-sm">
            <div className="text-center mb-4">
              <div className="p-3 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full w-fit mx-auto mb-3">
                <MessageCircle className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Anthropic API Key Required</h3>
              <p className="text-sm text-slate-400">Enter your Anthropic API key to start chatting with Claude, your AI legal assistant.</p>
            </div>
            <div className="space-y-3">
              <Input
                type="password"
                placeholder="Enter your Anthropic API key"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                className="bg-slate-900/50 border-slate-600 text-white placeholder-slate-500 focus:border-cyan-400 focus:ring-cyan-400/20"
              />
              <p className="text-xs text-slate-500">
                Your API key is stored locally and never sent to our servers.
              </p>
            </div>
          </Card>
        </div>
      )}

      {/* Chat Interface */}
      {apiKey && (
        <div className="container mx-auto px-4 py-6 max-w-4xl">
          <div className="bg-slate-800/30 backdrop-blur-sm rounded-2xl border border-slate-700/50 shadow-2xl overflow-hidden">
            {/* Messages */}
            <div className="h-96 overflow-y-auto p-6 space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in`}
                >
                  <div className={`flex items-start space-x-3 max-w-3xl ${message.role === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                    <div className={`flex-shrink-0 p-2 rounded-full ${
                      message.role === 'user' 
                        ? 'bg-gradient-to-r from-cyan-500 to-blue-500' 
                        : 'bg-gradient-to-r from-purple-500 to-pink-500'
                    } shadow-lg`}>
                      {message.role === 'user' ? (
                        <User className="h-4 w-4 text-white" />
                      ) : (
                        <Bot className="h-4 w-4 text-white" />
                      )}
                    </div>
                    <div className={`p-4 rounded-2xl ${
                      message.role === 'user'
                        ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-lg shadow-cyan-500/25'
                        : 'bg-slate-700/50 text-white border border-slate-600/50'
                    } backdrop-blur-sm`}>
                      <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
                      <p className="text-xs opacity-70 mt-2">
                        {message.timestamp.toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start animate-fade-in">
                  <div className="flex items-start space-x-3 max-w-3xl">
                    <div className="flex-shrink-0 p-2 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 shadow-lg">
                      <Bot className="h-4 w-4 text-white" />
                    </div>
                    <div className="p-4 rounded-2xl bg-slate-700/50 text-white border border-slate-600/50 backdrop-blur-sm">
                      <div className="flex items-center space-x-2">
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce"></div>
                          <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                          <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                        </div>
                        <span className="text-sm text-slate-400">Claude is thinking...</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Input Form */}
            <div className="border-t border-slate-700/50 bg-slate-900/50 p-4">
              <form onSubmit={handleSubmit} className="flex items-center space-x-3">
                <div className="flex-1 relative">
                  <Input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Ask me any legal question..."
                    disabled={isLoading}
                    className="bg-slate-800/50 border-slate-600 text-white placeholder-slate-500 focus:border-cyan-400 focus:ring-cyan-400/20 pr-12"
                  />
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                    <Scale className="h-4 w-4 text-slate-500" />
                  </div>
                </div>
                <Button
                  type="submit"
                  disabled={isLoading || !input.trim()}
                  className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white border-0 shadow-lg shadow-cyan-500/25 transition-all duration-200 hover:shadow-cyan-500/40"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </form>
              <p className="text-xs text-slate-500 mt-2 text-center">
                Responses are for informational purposes only and not a substitute for professional legal advice.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Features Section */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          <Card className="p-6 bg-slate-800/30 border-slate-700/50 backdrop-blur-sm hover:bg-slate-800/50 transition-all duration-300 group">
            <div className="p-3 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-lg w-fit mb-4 group-hover:shadow-lg group-hover:shadow-cyan-500/25 transition-all duration-300">
              <MessageCircle className="h-6 w-6 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">Legal Q&A</h3>
            <p className="text-slate-400 text-sm">Get instant answers to your legal questions with AI-powered analysis.</p>
          </Card>
          
          <Card className="p-6 bg-slate-800/30 border-slate-700/50 backdrop-blur-sm hover:bg-slate-800/50 transition-all duration-300 group">
            <div className="p-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg w-fit mb-4 group-hover:shadow-lg group-hover:shadow-purple-500/25 transition-all duration-300">
              <Scale className="h-6 w-6 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">Legal Research</h3>
            <p className="text-slate-400 text-sm">Research legal precedents and case law with advanced AI assistance.</p>
          </Card>
          
          <Card className="p-6 bg-slate-800/30 border-slate-700/50 backdrop-blur-sm hover:bg-slate-800/50 transition-all duration-300 group">
            <div className="p-3 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-lg w-fit mb-4 group-hover:shadow-lg group-hover:shadow-emerald-500/25 transition-all duration-300">
              <Sparkles className="h-6 w-6 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">Document Review</h3>
            <p className="text-slate-400 text-sm">Get AI-powered insights on contracts and legal documents.</p>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Index;
