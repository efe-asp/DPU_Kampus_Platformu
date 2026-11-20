import React from 'react';
import { motion } from 'framer-motion';

export function ExitSplashOverlay() {
  return (
    <motion.div
      key="exit-splash-overlay"
      initial={{ opacity: 1 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.02 }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      className="fixed inset-0 z-50 bg-[#091526] flex flex-col items-center justify-center select-none overflow-hidden"
    >
      {/* Geometric grid texture overlay */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.06]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='40' height='40'%3E%3Cpath d='M 40 0 L 0 0 0 40' fill='none' stroke='white' stroke-width='0.5'/%3E%3C/svg%3E")`,
          backgroundSize: '40px 40px',
        }}
      />

      {/* Soft ambient red glow centered behind logo */}
      <div className="absolute w-72 h-72 rounded-full bg-red-500/15 blur-3xl pointer-events-none" />

      {/* Centered Logo & Typography Stack */}
      <div className="relative z-10 flex flex-col items-center text-center px-4">
        {/* Circular University Crest with Pulsing Red Ring */}
        <div className="relative flex items-center justify-center">
          {/* Pulsing red ring */}
          <div className="absolute -inset-3 rounded-full bg-red-500/25 animate-ping opacity-70" />
          <motion.div
            animate={{ scale: [1, 1.06, 1] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute -inset-1.5 rounded-full bg-red-500/20 blur-sm"
          />
          <img
            src="/images/dpu-logo.png"
            alt="DPÜ Logo"
            className="w-20 h-20 rounded-full object-cover bg-white p-1 shadow-[0_0_40px_rgba(239,68,68,0.28)] ring-4 ring-white/15 relative z-10"
          />
        </div>

        {/* Brand Title & Subtitle */}
        <motion.h1
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.35 }}
          className="text-3xl font-extrabold tracking-tight text-white mt-5"
        >
          DPÜ Kampüs
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.18, duration: 0.35 }}
          className="text-sm font-medium text-slate-300 mt-1"
        >
          Güvenli Çıkış Yapılıyor
        </motion.p>

        {/* Red Progress Bar Track & Status Text (Fills over 2.3s for 2.4s total splash) */}
        <div className="flex flex-col items-center mt-6">
          <div className="w-56 h-1.5 bg-white/10 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: '0%' }}
              animate={{ width: '100%' }}
              transition={{ duration: 2.3, ease: [0.16, 1, 0.3, 1] }}
              className="h-full bg-[#EF4444] rounded-full shadow-[0_0_12px_rgba(239,68,68,0.6)]"
            />
          </div>

          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.25, duration: 0.35 }}
            className="text-xs text-slate-400 font-medium mt-3"
          >
            Öğrenci oturumu sonlandırılıyor...
          </motion.span>
        </div>
      </div>
    </motion.div>
  );
}

export default ExitSplashOverlay;
