
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Scale, Sparkles, MessageCircle, Shield, Brain, ArrowRight, Zap } from 'lucide-react';
import { Hero3D } from '@/components/Hero3D';
import { motion } from 'framer-motion';

const Landing = () => {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    navigate('/chat');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white overflow-hidden">
      {/* Hero Section with 3D Background */}
      <div className="relative min-h-screen flex items-center justify-center">
        <Hero3D />
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/5 to-blue-500/5"></div>
        
        <div className="relative container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-4xl mx-auto"
          >
            {/* Logo and Title */}
            <motion.div 
              className="flex items-center justify-center space-x-4 mb-8"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <motion.div 
                className="p-4 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-3xl shadow-2xl shadow-cyan-500/25"
                whileHover={{ scale: 1.1, rotate: 5 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
              >
                <Scale className="h-12 w-12 text-white" />
              </motion.div>
              <div>
                <h1 className="text-6xl font-bold bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
                  LegalAI
                </h1>
                <p className="text-xl text-slate-400 font-medium">
                  Powered by Gemini AI
                </p>
              </div>
            </motion.div>

            {/* Main Headline */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="mb-8"
            >
              <h2 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
                Your AI-Powered
                <span className="block bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                  Legal Assistant
                </span>
              </h2>
              <p className="text-xl text-slate-300 mb-12 max-w-3xl mx-auto leading-relaxed">
                Get instant legal guidance, document analysis, and professional insights powered by advanced AI technology. 
                Your trusted companion for navigating complex legal matters.
              </p>
            </motion.div>

            {/* CTA Button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="mb-16"
            >
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  onClick={handleGetStarted}
                  className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white border-0 shadow-2xl shadow-cyan-500/25 transition-all duration-300 hover:shadow-cyan-500/40 h-16 px-12 rounded-2xl text-lg font-semibold group"
                >
                  Get Started
                  <ArrowRight className="ml-3 h-6 w-6 group-hover:translate-x-1 transition-transform" />
                </Button>
              </motion.div>
            </motion.div>

            {/* Features Grid */}
            <motion.div 
              className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
            >
              {[
                {
                  icon: MessageCircle,
                  title: "Legal Q&A",
                  description: "Get instant answers to your legal questions with AI-powered analysis.",
                  gradient: "from-cyan-500 to-blue-600",
                  shadowColor: "shadow-cyan-500/25"
                },
                {
                  icon: Shield,
                  title: "Legal Research",
                  description: "Research legal precedents and case law with advanced AI assistance.",
                  gradient: "from-purple-500 to-pink-600",
                  shadowColor: "shadow-purple-500/25"
                },
                {
                  icon: Brain,
                  title: "Document Review",
                  description: "Get AI-powered insights on contracts and legal documents.",
                  gradient: "from-emerald-500 to-teal-600",
                  shadowColor: "shadow-emerald-500/25"
                }
              ].map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 1 + index * 0.1 }}
                  whileHover={{ scale: 1.05, y: -5 }}
                >
                  <Card className="p-8 bg-gradient-to-br from-slate-800/30 to-slate-900/30 border-slate-700/50 backdrop-blur-xl hover:bg-slate-800/50 transition-all duration-300 group shadow-xl h-full">
                    <motion.div 
                      className={`p-4 bg-gradient-to-br ${feature.gradient} rounded-2xl w-fit mx-auto mb-6 shadow-xl ${feature.shadowColor} group-hover:shadow-2xl transition-all duration-300`}
                      whileHover={{ rotate: 5 }}
                      transition={{ type: "spring", stiffness: 400, damping: 17 }}
                    >
                      <feature.icon className="h-8 w-8 text-white" />
                    </motion.div>
                    <h3 className="text-xl font-bold text-white mb-4 group-hover:text-cyan-400 transition-colors">
                      {feature.title}
                    </h3>
                    <p className="text-slate-400 text-sm leading-relaxed">
                      {feature.description}
                    </p>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>

        {/* Floating Elements */}
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-cyan-400 rounded-full opacity-60"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                y: [0, -30, 0],
                opacity: [0.6, 1, 0.6],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                delay: i * 0.5,
              }}
            />
          ))}
        </div>
      </div>

      {/* Bottom Section */}
      <div className="relative py-16 border-t border-slate-700/50">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 1.2 }}
          >
            <div className="flex items-center justify-center space-x-3 text-slate-400">
              <Sparkles className="h-5 w-5 text-cyan-400" />
              <span className="text-sm">Powered by Google Gemini AI</span>
              <Zap className="h-5 w-5 text-cyan-400" />
            </div>
            <p className="text-xs text-slate-500 mt-2">
              ⚖️ All responses are for informational purposes only and not a substitute for professional legal advice.
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Landing;
