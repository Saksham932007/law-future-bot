
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
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white overflow-hidden relative">
      {/* Animated Background Grid */}
      <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-blue-500/10">
        <div className="absolute inset-0" style={{
          backgroundImage: `
            linear-gradient(rgba(6, 182, 212, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(6, 182, 212, 0.1) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px',
          animation: 'grid-move 20s linear infinite'
        }}></div>
      </div>

      {/* Hero Section with 3D Background */}
      <div className="relative min-h-screen flex items-center justify-center">
        <Hero3D />
        
        <div className="relative container mx-auto px-6 text-center z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-5xl mx-auto"
          >
            {/* Logo and Title */}
            <motion.div 
              className="flex items-center justify-center space-x-6 mb-12"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <motion.div 
                className="relative p-5 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-3xl shadow-2xl shadow-cyan-500/30"
                whileHover={{ scale: 1.1, rotate: 5 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
              >
                <Scale className="h-14 w-14 text-white" />
                <div className="absolute -inset-2 bg-gradient-to-r from-cyan-600 to-blue-700 rounded-3xl blur opacity-30 animate-pulse"></div>
              </motion.div>
              <div className="text-left">
                <motion.h1 
                  className="text-7xl font-black bg-gradient-to-r from-cyan-300 via-blue-400 to-purple-400 bg-clip-text text-transparent leading-tight"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8, delay: 0.4 }}
                >
                  LegalAI
                </motion.h1>
                <motion.p 
                  className="text-xl text-slate-400 font-semibold tracking-wide"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8, delay: 0.6 }}
                >
                  Powered by Gemini AI
                </motion.p>
              </div>
            </motion.div>

            {/* Main Headline */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
              className="mb-10 text-center"
            >
              <h2 className="text-6xl md:text-7xl font-black mb-8 leading-[0.9] tracking-tight">
                <span className="block text-white">Your AI-Powered</span>
                <span className="block bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
                  Legal Assistant
                </span>
              </h2>
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 1 }}
                className="relative"
              >
                <p className="text-xl md:text-2xl text-slate-300 mb-12 max-w-4xl mx-auto leading-relaxed font-light">
                  Get instant legal guidance, document analysis, and professional insights powered by advanced AI technology. 
                  Your trusted companion for navigating complex legal matters.
                </p>
                <div className="absolute -inset-4 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 blur-xl rounded-full opacity-50"></div>
              </motion.div>
            </motion.div>

            {/* CTA Button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1.2 }}
              className="mb-20"
            >
              <motion.div
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                className="relative inline-block"
              >
                <Button
                  onClick={handleGetStarted}
                  className="relative bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white border-0 shadow-2xl shadow-cyan-500/30 transition-all duration-300 hover:shadow-cyan-500/50 h-16 px-16 rounded-2xl text-xl font-bold group overflow-hidden"
                >
                  <span className="relative z-10 flex items-center">
                    Get Started
                    <ArrowRight className="ml-4 h-6 w-6 group-hover:translate-x-1 transition-transform" />
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-blue-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </Button>
                <div className="absolute -inset-4 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-2xl blur-lg opacity-30 group-hover:opacity-50 transition-opacity duration-300"></div>
              </motion.div>
            </motion.div>

            {/* Features Grid */}
            <motion.div 
              className="grid grid-cols-1 md:grid-cols-3 gap-10 max-w-7xl mx-auto"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1.4 }}
            >
              {[
                {
                  icon: MessageCircle,
                  title: "Legal Q&A",
                  description: "Get instant answers to your legal questions with AI-powered analysis and comprehensive research.",
                  gradient: "from-cyan-500 to-blue-600",
                  shadowColor: "shadow-cyan-500/25",
                  glowColor: "from-cyan-500/20 to-blue-600/20"
                },
                {
                  icon: Shield,
                  title: "Legal Research",
                  description: "Research legal precedents and case law with advanced AI assistance and detailed insights.",
                  gradient: "from-purple-500 to-pink-600",
                  shadowColor: "shadow-purple-500/25",
                  glowColor: "from-purple-500/20 to-pink-600/20"
                },
                {
                  icon: Brain,
                  title: "Document Review",
                  description: "Get AI-powered insights on contracts and legal documents with thorough analysis.",
                  gradient: "from-emerald-500 to-teal-600",
                  shadowColor: "shadow-emerald-500/25",
                  glowColor: "from-emerald-500/20 to-teal-600/20"
                }
              ].map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 1.6 + index * 0.1 }}
                  whileHover={{ scale: 1.05, y: -8 }}
                  className="relative group"
                >
                  <Card className="relative p-10 bg-gradient-to-br from-slate-800/40 to-slate-900/40 border-slate-700/50 backdrop-blur-xl hover:bg-slate-800/60 transition-all duration-500 group shadow-2xl h-full overflow-hidden">
                    {/* Animated background glow */}
                    <div className={`absolute -inset-2 bg-gradient-to-r ${feature.glowColor} rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500`}></div>
                    
                    <div className="relative z-10">
                      <motion.div 
                        className={`p-5 bg-gradient-to-br ${feature.gradient} rounded-3xl w-fit mx-auto mb-8 shadow-2xl ${feature.shadowColor} group-hover:shadow-2xl transition-all duration-500`}
                        whileHover={{ rotate: 10, scale: 1.1 }}
                        transition={{ type: "spring", stiffness: 400, damping: 17 }}
                      >
                        <feature.icon className="h-10 w-10 text-white" />
                      </motion.div>
                      
                      <h3 className="text-2xl font-bold text-white mb-6 group-hover:text-cyan-400 transition-colors duration-300 text-center">
                        {feature.title}
                      </h3>
                      
                      <p className="text-slate-400 text-base leading-relaxed text-center group-hover:text-slate-300 transition-colors duration-300">
                        {feature.description}
                      </p>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>

        {/* Enhanced Floating Elements */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {[...Array(12)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-3 h-3 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full opacity-70 blur-sm"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                y: [0, -40, 0],
                x: [0, Math.random() * 20 - 10, 0],
                opacity: [0.7, 1, 0.7],
                scale: [1, 1.2, 1],
              }}
              transition={{
                duration: 4 + Math.random() * 2,
                repeat: Infinity,
                delay: i * 0.3,
                ease: "easeInOut"
              }}
            />
          ))}
        </div>
      </div>

      {/* Bottom Section */}
      <div className="relative py-20 border-t border-slate-700/30 bg-gradient-to-t from-slate-900/50 to-transparent">
        <div className="container mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 2 }}
          >
            <div className="flex items-center justify-center space-x-4 text-slate-400 mb-4">
              <Sparkles className="h-6 w-6 text-cyan-400 animate-pulse" />
              <span className="text-lg font-medium">Powered by Google Gemini AI</span>
              <Zap className="h-6 w-6 text-cyan-400 animate-pulse" />
            </div>
            <p className="text-sm text-slate-500 max-w-2xl mx-auto leading-relaxed">
              ⚖️ All responses are for informational purposes only and not a substitute for professional legal advice. 
              Always consult with qualified legal professionals for specific legal matters.
            </p>
          </motion.div>
        </div>
      </div>

      <style jsx>{`
        @keyframes grid-move {
          0% { transform: translate(0, 0); }
          100% { transform: translate(50px, 50px); }
        }
      `}</style>
    </div>
  );
};

export default Landing;
