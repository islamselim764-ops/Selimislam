import React from 'react';
import { motion } from 'motion/react';
import { AuthMode } from '../types';

interface FloatingOrbsProps {
  currentMode: AuthMode;
  onSelectMode: (mode: AuthMode) => void;
}

export const FloatingOrbs: React.FC<FloatingOrbsProps> = ({ currentMode, onSelectMode }) => {
  return (
    <>
      {/* Desktop Floating Immersive Nodes */}
      <div className="hidden xl:block pointer-events-auto">
        {/* Node 1 (Top Left): Welcome / Portal info */}
        <motion.div
          id="floating-welcome-node"
          initial={{ scale: 0.8, opacity: 0, y: -20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          whileHover={{ scale: 1.08 }}
          className="floating-node node-info absolute left-10 2xl:left-24 top-20 z-10 cursor-pointer"
          style={{ width: '115px', height: '115px' }}
          onClick={() => onSelectMode('signin')}
        >
          <span className="text-2xl mb-1">👋</span>
          <span className="node-label">Welcome</span>
          <span className="text-[11px] font-extrabold tracking-wider">PORTAL</span>
        </motion.div>

        {/* Node 2 (Top Right): Sign Up / Join Now Node */}
        <motion.button
          id="floating-signup-node"
          type="button"
          onClick={() => onSelectMode(currentMode === 'signup' ? 'signin' : 'signup')}
          initial={{ scale: 0.8, opacity: 0, y: -20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.95 }}
          className="floating-node node-signup absolute right-8 2xl:right-24 top-28 z-10 p-2"
          style={{ width: '130px', height: '130px' }}
        >
          <span className="node-label">
            {currentMode === 'signup' ? 'Back to' : 'New User?'}
          </span>
          <span className="text-base font-extrabold tracking-wider leading-tight">
            {currentMode === 'signup' ? 'SIGN IN' : 'JOIN NOW'}
          </span>
        </motion.button>

        {/* Node 3 (Bottom Left): Recovery System Node */}
        <motion.button
          id="floating-recovery-node"
          type="button"
          onClick={() => onSelectMode(currentMode === 'forgot' ? 'signin' : 'forgot')}
          initial={{ scale: 0.8, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.95 }}
          className="floating-node node-forget absolute left-12 2xl:left-28 bottom-20 z-10 p-3"
          style={{ width: '145px', height: '145px' }}
        >
          <span className="node-label">
            {currentMode === 'forgot' ? 'Access' : 'Credential'}
          </span>
          <span className="text-sm font-extrabold leading-tight tracking-wide">
            {currentMode === 'forgot' ? 'SIGN IN PORTAL' : 'RECOVERY SYSTEM'}
          </span>
        </motion.button>

        {/* Node 4 (Bottom Right): Live Help & Security status */}
        <motion.div
          id="floating-security-node"
          initial={{ scale: 0.8, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          whileHover={{ scale: 1.08 }}
          className="floating-node node-support absolute right-12 2xl:right-28 bottom-16 z-10 cursor-pointer p-2"
          style={{ width: '120px', height: '120px' }}
        >
          <span className="text-2xl mb-1">💬</span>
          <span className="node-label">Live Help</span>
          <span className="text-[11px] font-extrabold tracking-wider">PROTECTED</span>
        </motion.div>
      </div>

      {/* Mid-screen and Tablet floating buttons */}
      <div className="hidden md:flex xl:hidden items-center justify-center gap-6 mt-8 z-20">
        <motion.button
          id="tablet-node-signin"
          type="button"
          onClick={() => onSelectMode('signin')}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className={`floating-node ${
            currentMode === 'signin' ? 'node-info ring-4 ring-white/60' : 'node-info'
          } w-24 h-24 p-2`}
        >
          <span className="node-label">Portal</span>
          <span className="text-xs font-bold">SIGN IN</span>
        </motion.button>

        <motion.button
          id="tablet-node-signup"
          type="button"
          onClick={() => onSelectMode('signup')}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className={`floating-node ${
            currentMode === 'signup' ? 'node-signup ring-4 ring-white/60' : 'node-signup'
          } w-24 h-24 p-2`}
        >
          <span className="node-label">New User?</span>
          <span className="text-xs font-bold">JOIN NOW</span>
        </motion.button>

        <motion.button
          id="tablet-node-forgot"
          type="button"
          onClick={() => onSelectMode('forgot')}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className={`floating-node ${
            currentMode === 'forgot' ? 'node-forget ring-4 ring-white/60' : 'node-forget'
          } w-24 h-24 p-2`}
        >
          <span className="node-label">Access</span>
          <span className="text-[10px] font-bold leading-tight">RECOVERY</span>
        </motion.button>
      </div>

      {/* Mobile-friendly Floating Row */}
      <div className="flex md:hidden items-center justify-center gap-3 mt-6 z-20">
        <motion.button
          id="mobile-nav-signin"
          type="button"
          onClick={() => onSelectMode('signin')}
          whileTap={{ scale: 0.95 }}
          className={`floating-node ${
            currentMode === 'signin' ? 'node-info opacity-100 ring-2 ring-white' : 'node-info opacity-90'
          } w-16 h-16 text-[10px] font-bold p-1`}
        >
          <span className="node-label text-[8px]">Portal</span>
          <span>SIGN IN</span>
        </motion.button>

        <motion.button
          id="mobile-nav-signup"
          type="button"
          onClick={() => onSelectMode('signup')}
          whileTap={{ scale: 0.95 }}
          className={`floating-node ${
            currentMode === 'signup' ? 'node-signup opacity-100 ring-2 ring-white' : 'node-signup opacity-90'
          } w-16 h-16 text-[10px] font-bold p-1`}
        >
          <span className="node-label text-[8px]">New?</span>
          <span>JOIN</span>
        </motion.button>

        <motion.button
          id="mobile-nav-forgot"
          type="button"
          onClick={() => onSelectMode('forgot')}
          whileTap={{ scale: 0.95 }}
          className={`floating-node ${
            currentMode === 'forgot' ? 'node-forget opacity-100 ring-2 ring-white' : 'node-forget opacity-90'
          } w-16 h-16 text-[10px] font-bold p-1`}
        >
          <span className="node-label text-[8px]">Reset</span>
          <span>RECOVER</span>
        </motion.button>
      </div>
    </>
  );
};

