import { useState } from 'react';
import { Send, Scale, Sparkles, MessageCircle, Zap, Shield, Brain } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Hero3D } from '@/components/Hero3D';
import { ChatMessage } from '@/components/ChatMessage';
import { LoadingMessage } from '@/components/LoadingMessage';
import { DocumentUpload } from '@/components/DocumentUpload';
import { UploadedDocument } from '@/components/UploadedDocument';
import { motion } from 'framer-motion';

interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
  hasDocument?: boolean;
  documentName?: string;
}

interface DocumentMetadata {
  pageCount?: number;
  fileType: string;
  wordCount: number;
  documentType: string;
}

interface UploadedFile {
  name: string;
  size: number;
  content: string;
  metadata?: DocumentMetadata;
}

// Embedded API key
const GEMINI_API_KEY = 'AIzaSyAYYBn61_8r8tnVYUTqVxKvcy7PYQa5Jow';

const Index = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: "Hello! I'm your AI Legal Assistant powered by Gemini. I can help you with legal questions, document review, contract analysis, and general legal guidance. You can also upload documents for me to review and analyze. How can I assist you today?",
      role: 'assistant',
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<UploadedFile | null>(null);
  const { toast } = useToast();

  const generateDocumentPrompt = (file: UploadedFile, userInput?: string) => {
    const { metadata } = file;
    let prompt = `You are a professional AI legal assistant. Provide helpful, accurate legal information and guidance. Always remind users that your responses are for informational purposes only and not a substitute for professional legal advice.

The user has uploaded a document named "${file.name}" with the following details:
- Document type: ${metadata?.documentType || 'general'}
- Word count: ${metadata?.wordCount || 'unknown'}
- File type: ${metadata?.fileType || 'unknown'}`;

    if (metadata?.pageCount) {
      prompt += `\n- Page count: ${metadata.pageCount}`;
    }

    prompt += `\n\nDocument content:\n${file.content}\n\n`;

    // Tailor analysis based on document type
    switch (metadata?.documentType) {
      case 'contract':
        prompt += `Please provide a comprehensive contract analysis including:
1. Key terms and obligations for each party
2. Payment terms and deadlines
3. Termination clauses and conditions
4. Potential legal risks or red flags
5. Recommendations for improvement or clarification
6. Compliance considerations`;
        break;
      case 'lease':
        prompt += `Please provide a lease agreement analysis including:
1. Lease terms, duration, and renewal options
2. Rent amount, escalation clauses, and payment terms
3. Tenant and landlord responsibilities
4. Security deposit and fee structures
5. Maintenance and repair obligations
6. Termination and eviction procedures
7. Legal compliance and tenant rights`;
        break;
      case 'nda':
        prompt += `Please provide an NDA analysis including:
1. Scope of confidential information covered
2. Duration of confidentiality obligations
3. Permitted disclosures and exceptions
4. Consequences of breach
5. Jurisdiction and governing law
6. Recommendations for strengthening protection`;
        break;
      case 'policy':
        prompt += `Please provide a policy document analysis including:
1. Policy scope and applicability
2. Key requirements and procedures
3. Compliance obligations
4. Enforcement mechanisms
5. Legal adequacy and potential gaps
6. Recommendations for improvement`;
        break;
      default:
        prompt += `Please provide a comprehensive legal document analysis including:
1. Document purpose and legal significance
2. Key legal provisions and requirements
3. Rights and obligations identified
4. Potential legal issues or concerns
5. Compliance considerations
6. Recommendations and next steps`;
    }

    if (userInput && userInput.trim()) {
      prompt += `\n\nSpecific user question: ${userInput}`;
    } else {
      prompt += `\n\nPlease provide the analysis above and highlight any critical issues that require immediate attention.`;
    }

    return prompt;
  };

  const handleFileSelect = (file: File, content: string, metadata?: DocumentMetadata) => {
    setUploadedFile({
      name: file.name,
      size: file.size,
      content: content,
      metadata
    });
    
    const typeDescription = metadata?.documentType ? ` (${metadata.documentType})` : '';
    toast({
      title: "Document uploaded",
      description: `${file.name}${typeDescription} is ready for analysis.`
    });
  };

  const handleRemoveFile = () => {
    setUploadedFile(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if ((!input.trim() && !uploadedFile) || isLoading) return;

    let messageContent = input;
    let hasDocument = false;
    let documentName = '';

    if (uploadedFile) {
      hasDocument = true;
      documentName = uploadedFile.name;
      if (input.trim()) {
        messageContent = `${input}\n\n[Document attached: ${uploadedFile.name}]`;
      } else {
        messageContent = `Please analyze this document: ${uploadedFile.name}`;
      }
    }

    const userMessage: Message = {
      id: Date.now().toString(),
      content: messageContent,
      role: 'user',
      timestamp: new Date(),
      hasDocument,
      documentName
    };

    setMessages(prev => [...prev, userMessage]);
    const currentInput = input;
    const currentFile = uploadedFile;
    setInput('');
    setUploadedFile(null);
    setIsLoading(true);

    try {
      let prompt: string;

      if (currentFile) {
        prompt = generateDocumentPrompt(currentFile, currentInput);
      } else {
        prompt = `You are a professional AI legal assistant. Provide helpful, accurate legal information and guidance. Always remind users that your responses are for informational purposes only and not a substitute for professional legal advice. Be thorough, professional, and cite relevant legal principles when appropriate.\n\nUser: ${currentInput}`;
      }

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
                  Powered by Gemini AI • Enhanced Document Analysis
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
            {/* Uploaded Document Display */}
            {uploadedFile && (
              <UploadedDocument
                fileName={uploadedFile.name}
                fileSize={uploadedFile.size}
                onRemove={() => setUploadedFile(null)}
              />
            )}
            
            <form onSubmit={handleSubmit} className="flex items-center space-x-4">
              <div className="flex-1 relative">
                <Input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask me any legal question or upload a document for comprehensive analysis..."
                  disabled={isLoading}
                  className="bg-slate-800/50 border-slate-600 text-white placeholder-slate-400 focus:border-cyan-400 focus:ring-cyan-400/20 pr-12 h-14 rounded-2xl text-base"
                />
                <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                  <Scale className="h-5 w-5 text-slate-500" />
                </div>
              </div>
              
              <DocumentUpload
                onFileSelect={handleFileSelect}
                disabled={isLoading}
              />
              
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  type="submit"
                  disabled={isLoading || (!input.trim() && !uploadedFile)}
                  className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white border-0 shadow-xl shadow-cyan-500/25 transition-all duration-300 hover:shadow-cyan-500/40 h-14 px-8 rounded-2xl font-medium"
                >
                  <Send className="h-5 w-5" />
                </Button>
              </motion.div>
            </form>
            <p className="text-xs text-slate-500 mt-3 text-center">
              ⚖️ Enhanced with document type detection and specialized legal analysis • For informational purposes only
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
              title: "Smart Document Analysis",
              description: "Upload contracts, agreements, or legal documents for AI-powered analysis with document type detection.",
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
