
import { User, Bot, FileText } from 'lucide-react';
import { motion } from 'framer-motion';

interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
  hasDocument?: boolean;
  documentName?: string;
}

interface ChatMessageProps {
  message: Message;
  isLatest?: boolean;
}

export const ChatMessage = ({ message, isLatest }: ChatMessageProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'} mb-6`}
    >
      <div className={`flex items-start space-x-3 max-w-4xl ${message.role === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
        <motion.div 
          className={`flex-shrink-0 p-3 rounded-2xl shadow-xl ${
            message.role === 'user' 
              ? 'bg-gradient-to-br from-cyan-500 to-blue-600 shadow-cyan-500/25' 
              : 'bg-gradient-to-br from-purple-500 to-pink-600 shadow-purple-500/25'
          }`}
          whileHover={{ scale: 1.05 }}
          transition={{ type: "spring", stiffness: 400, damping: 17 }}
        >
          {message.role === 'user' ? (
            <User className="h-5 w-5 text-white" />
          ) : (
            <Bot className="h-5 w-5 text-white" />
          )}
        </motion.div>
        
        <motion.div 
          className={`p-6 rounded-3xl max-w-2xl ${
            message.role === 'user'
              ? 'bg-gradient-to-br from-cyan-500 to-blue-600 text-white shadow-xl shadow-cyan-500/25'
              : 'bg-gradient-to-br from-slate-800 to-slate-900 text-white border border-slate-600/50 shadow-xl'
          } backdrop-blur-sm`}
          whileHover={{ scale: 1.02 }}
          transition={{ type: "spring", stiffness: 400, damping: 17 }}
        >
          {/* Document indicator */}
          {message.hasDocument && message.documentName && (
            <div className="flex items-center space-x-2 mb-3 p-2 bg-white/10 rounded-xl">
              <FileText className="h-4 w-4 text-cyan-300" />
              <span className="text-xs text-cyan-300 font-medium">{message.documentName}</span>
            </div>
          )}
          
          <div className="prose prose-invert max-w-none">
            <p className="text-sm leading-relaxed whitespace-pre-wrap mb-0">{message.content}</p>
          </div>
          <div className="flex justify-between items-center mt-3 pt-3 border-t border-white/10">
            <p className="text-xs opacity-70">
              {message.timestamp.toLocaleTimeString()}
            </p>
            {message.role === 'assistant' && (
              <div className="flex items-center space-x-1">
                <div className="w-1 h-1 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-xs opacity-70">AI Response</span>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};
