import React from 'react';
import { loginWithGoogle } from '../../lib/firebase';
import { Shield, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

const LoginPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-950 p-6">
      <div className="max-w-md w-full text-center space-y-12">
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="relative inline-block"
        >
          <div className="absolute inset-0 bg-amber-500 blur-3xl opacity-20 animate-pulse" />
          <img src="./dark.png" alt="Tribe Designs" className="w-32 h-32 mx-auto relative z-10" />
        </motion.div>

        <div className="space-y-4">
          <h1 className="text-4xl font-syne font-black uppercase tracking-tighter">Admin Portal</h1>
          <p className="text-zinc-500 font-medium">Restricted access for Tribe Designs management only.</p>
        </div>

        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-zinc-900 border border-zinc-800 p-8 rounded-3xl shadow-2xl space-y-8"
        >
          <div className="flex items-center justify-center gap-3 text-amber-500">
            <Shield size={20} />
            <span className="text-xs font-black tracking-widest uppercase">Secure Authentication</span>
          </div>

          <button 
            onClick={loginWithGoogle}
            className="w-full bg-white text-black font-black py-4 rounded-2xl flex items-center justify-center gap-3 hover:bg-amber-500 transition-all group"
          >
            <img src="https://www.google.com/favicon.ico" className="w-5 h-5" alt="Google" />
            SIGN IN WITH GOOGLE
            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </button>

          <p className="text-[10px] text-zinc-600 uppercase tracking-widest leading-relaxed">
            By signing in, you acknowledge that all actions are logged and unauthorized access is strictly prohibited.
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default LoginPage;
