import React, { useState } from 'react';
import { User as UserIcon, Mail, Lock, ShieldCheck } from 'lucide-react';
import { NeumorphicInput } from './NeumorphicInput';
import { UserSession } from '../types';

interface SignUpCardProps {
  onSignUpSuccess: (session: UserSession) => void;
  onSetNotification: (msg: { type: 'success' | 'error' | 'info'; message: string } | null) => void;
  onBackToSignIn: () => void;
}

export const SignUpCard: React.FC<SignUpCardProps> = ({
  onSignUpSuccess,
  onSetNotification,
  onBackToSignIn,
}) => {
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !username.trim() || !email.trim() || !password) {
      onSetNotification({ type: 'error', message: 'Please complete all required fields.' });
      return;
    }
    if (password !== confirmPassword) {
      onSetNotification({ type: 'error', message: 'Passwords do not match. Please verify.' });
      return;
    }
    if (password.length < 6) {
      onSetNotification({ type: 'error', message: 'Password must be at least 6 characters.' });
      return;
    }

    setIsLoading(true);
    onSetNotification(null);

    setTimeout(() => {
      setIsLoading(false);
      onSignUpSuccess({
        username: username.trim(),
        name: name.trim(),
        email: email.trim(),
        loggedInAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      });
    }, 600);
  };

  return (
    <form onSubmit={handleSubmit} className="w-full flex flex-col items-center" id="signup-form">
      <h1 className="text-[#2d3436] text-[32px] sm:text-[36px] font-black mb-6 text-center tracking-[-1.5px]">
        Create Account
      </h1>

      <NeumorphicInput
        id="signup-name"
        label="Full Name"
        type="text"
        placeholder="Enter your name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        icon={<UserIcon size={18} />}
        required
      />

      <NeumorphicInput
        id="signup-username"
        label="Username Handle"
        type="text"
        placeholder="Choose username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        icon={<UserIcon size={18} />}
        required
      />

      <NeumorphicInput
        id="signup-email"
        label="Email Address"
        type="email"
        placeholder="name@domain.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        icon={<Mail size={18} />}
        required
      />

      <NeumorphicInput
        id="signup-password"
        label="Password Key"
        type="password"
        placeholder="Create password (6+ chars)"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        icon={<Lock size={18} />}
        required
      />

      <NeumorphicInput
        id="signup-confirm-password"
        label="Confirm Security Key"
        type="password"
        placeholder="Re-enter password"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        icon={<ShieldCheck size={18} />}
        required
      />

      <button
        type="submit"
        id="btn-signup-submit"
        disabled={isLoading}
        className="btn-main mt-2"
        style={{
          background: 'linear-gradient(135deg, #ff9d42, #e65100)',
          boxShadow: '0px 10px 25px rgba(230, 81, 0, 0.4), 0px 4px 10px rgba(0, 0, 0, 0.1)',
        }}
      >
        {isLoading ? 'ENROLLING USER...' : 'JOIN NOW'}
      </button>

      <div className="mt-6 text-center">
        <button
          type="button"
          id="back-to-signin-link"
          onClick={onBackToSignIn}
          className="text-xs font-semibold text-gray-500 hover:text-gray-900 transition-colors uppercase tracking-wider"
        >
          ← Return to Secure Portal
        </button>
      </div>
    </form>
  );
};

