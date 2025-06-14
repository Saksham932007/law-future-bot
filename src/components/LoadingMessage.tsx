
import { Bot } from 'lucide-react';
import { motion } from 'framer-motion';

export const LoadingMessage = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="flex justify-start mb-6"
    >
      <div className="flex items-start space-x-3 max-w-4xl">
        <div className="flex-shrink-0 p-3 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-600 shadow-xl shadow-purple-500/25">
          <Bot className="h-5 w-5 text-white" />
        </div>
        
        <div className="p-6 rounded-3xl bg-gradient-to-br from-slate-800 to-slate-900 text-white border border-slate-600/50 shadow-xl backdrop-blur-sm">
          <div className="flex items-center space-x-3">
            <div className="flex space-x-2">
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  className="w-3 h-3 bg-cyan-400 rounded-full"
                  animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.7, 1, 0.7],
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    delay: i * 0.2,
                  }}
                />
              ))}
            </div>
            <span className="text-sm text-slate-300">Gemini is thinking...</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
