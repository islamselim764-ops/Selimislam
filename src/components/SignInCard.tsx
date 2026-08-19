import React, { useState } from 'react';
import { User as UserIcon, Lock, Sparkles, ShieldCheck, ArrowRight, LogIn } from 'lucide-react';
import { NeumorphicInput } from './NeumorphicInput';
import { UserSession } from '../types';

interface SignInCardProps {
  onLoginSuccess: (session: UserSession) => void;
  onSetNotification: (msg: { type: 'success' | 'error' | 'info'; message: string } | null) => void;
}

export const SignInCard: React.FC<SignInCardProps> = ({ onLoginSuccess, onSetNotification }) => {
  const [username, setUsername] = useState('selim_admin');
  const [password, setPassword] = useState('••••••••');
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const performLogin = (targetUser: string) => {
    setIsLoading(true);
    onSetNotification(null);

    setTimeout(() => {
      setIsLoading(false);
      const cleanUser = targetUser.trim() || 'Admin User';
      onLoginSuccess({
        username: cleanUser,
        name: cleanUser.charAt(0).toUpperCase() + cleanUser.slice(1),
        email: `${cleanUser.toLowerCase().replace(/[^a-z0-9]/g, '')}@example.com`,
        loggedInAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      });
    }, 400);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const userToUse = username.trim() || 'selim_admin';
    performLogin(userToUse);
  };

  const handleQuickDemo = () => {
    setUsername('selim_admin');
    setPassword('neumorphic2026');
    performLogin('selim_admin');
  };

  return (
    <form onSubmit={handleSubmit} className="w-full flex flex-col items-center" id="signin-form">
      <h1 className="text-[#2d3436] text-[32px] sm:text-[36px] font-black mb-7 text-center tracking-[-1.5px]">
        Secure Portal
      </h1>

      <NeumorphicInput
        id="signin-username"
        label="Identifier / ইউজারনেম"
        type="text"
        placeholder="Enter username or email"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        icon={<UserIcon size={18} />}
        required
        autoComplete="username"
      />

      <NeumorphicInput
        id="signin-password"
        label="Security Key / পাসওয়ার্ড"
        type="password"
        placeholder="Enter your password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        icon={<Lock size={18} />}
        required
        autoComplete="current-password"
      />

      {/* Remember me & Quick Fill */}
      <div className="w-full flex items-center justify-between text-xs text-gray-600 px-3 mb-5">
        <label className="flex items-center gap-2 cursor-pointer select-none">
          <input
            id="remember-me-checkbox"
            type="checkbox"
            checked={rememberMe}
            onChange={(e) => setRememberMe(e.target.checked)}
            className="w-4 h-4 accent-[#00e676] rounded cursor-pointer"
          />
          <span className="text-gray-600 font-medium">Remember device</span>
        </label>
        <button
          type="button"
          id="quick-demo-btn"
          onClick={handleQuickDemo}
          className="text-gray-500 hover:text-emerald-700 inline-flex items-center gap-1.5 font-semibold transition-colors cursor-pointer"
          title="Instant 1-Click Login"
        >
          <Sparkles size={14} className="text-emerald-500" />
          <span>১-ক্লিক লগইন</span>
        </button>
      </div>

      {/* Main Login Action Button */}
      <button
        type="submit"
        id="btn-login"
        disabled={isLoading}
        className="btn-main flex items-center justify-center gap-2"
      >
        {isLoading ? (
          <span>ভিতরে প্রবেশ করা হচ্ছে...</span>
        ) : (
          <>
            <LogIn size={18} />
            <span>লগইন করুন • ENTER DASHBOARD</span>
            <ArrowRight size={16} />
          </>
        )}
      </button>

      {/* Immersive Device State Badge */}
      <div className="mt-7 flex items-center justify-center gap-1.5 text-[11px] text-[#a2aab9] font-semibold uppercase tracking-[0.7px]">
        <ShieldCheck size={14} className="text-[#00e676]" />
        <span>Trusted Device: OSX-7729-Z • SSL ACTIVE</span>
      </div>
    </form>
  );
};


