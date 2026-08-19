import React, { useState } from 'react';
import { Mail, CheckCircle2 } from 'lucide-react';
import { NeumorphicInput } from './NeumorphicInput';

interface ForgotPasswordCardProps {
  onBackToSignIn: () => void;
  onSetNotification: (msg: { type: 'success' | 'error' | 'info'; message: string } | null) => void;
}

export const ForgotPasswordCard: React.FC<ForgotPasswordCardProps> = ({
  onBackToSignIn,
  onSetNotification,
}) => {
  const [identifier, setIdentifier] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!identifier.trim()) {
      onSetNotification({ type: 'error', message: 'Please enter your username or email address.' });
      return;
    }

    setIsLoading(true);
    onSetNotification(null);

    setTimeout(() => {
      setIsLoading(false);
      setIsSubmitted(true);
      onSetNotification({
        type: 'success',
        message: `Password reset instructions sent to ${identifier}!`,
      });
    }, 700);
  };

  return (
    <div className="w-full flex flex-col items-center" id="forgot-password-card">
      <h1 className="text-[#2d3436] text-[30px] sm:text-[34px] font-black mb-3 text-center tracking-[-1.5px]">
        Recovery System
      </h1>

      {!isSubmitted ? (
        <form onSubmit={handleSubmit} id="forgot-password-form" className="w-full flex flex-col items-center">
          <p className="text-xs text-gray-500 mb-6 text-center leading-relaxed max-w-[300px]">
            Enter your account username or registered email and we will dispatch recovery instructions.
          </p>

          <NeumorphicInput
            id="forgot-identifier"
            label="Recovery Target"
            type="text"
            placeholder="Username or registered email"
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
            icon={<Mail size={18} />}
            required
            autoComplete="email"
          />

          <button
            type="submit"
            id="btn-forgot-submit"
            disabled={isLoading}
            className="btn-main mt-2"
            style={{
              background: 'linear-gradient(135deg, #d500f9, #aa00ff)',
              boxShadow: '0px 10px 25px rgba(170, 0, 255, 0.4), 0px 4px 10px rgba(0, 0, 0, 0.1)',
            }}
          >
            {isLoading ? 'DISPATCHING LINK...' : 'DISPATCH RECOVERY LINK'}
          </button>
        </form>
      ) : (
        <div className="text-center py-4">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center neu-button text-purple-600">
            <CheckCircle2 size={36} />
          </div>
          <h3 className="font-bold text-gray-800 text-base mb-1">Check Your Inbox</h3>
          <p className="text-xs text-gray-500 mb-6 leading-relaxed">
            A secure recovery link has been dispatched to <strong>{identifier}</strong>.
          </p>
          <button
            type="button"
            onClick={() => {
              setIsSubmitted(false);
              setIdentifier('');
            }}
            className="neu-button px-6 py-2.5 text-xs font-bold text-gray-700 hover:text-gray-900"
          >
            Send Another Link
          </button>
        </div>
      )}

      <div className="mt-6 text-center">
        <button
          type="button"
          id="forgot-back-to-signin-btn"
          onClick={onBackToSignIn}
          className="text-xs font-semibold text-gray-500 hover:text-gray-900 transition-colors uppercase tracking-wider"
        >
          ← Return to Secure Portal
        </button>
      </div>
    </div>
  );
};

