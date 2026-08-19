import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

interface NeumorphicInputProps {
  id: string;
  type: string;
  placeholder: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  label?: string;
  required?: boolean;
  autoComplete?: string;
  icon?: React.ReactNode;
}

export const NeumorphicInput: React.FC<NeumorphicInputProps> = ({
  id,
  type,
  placeholder,
  value,
  onChange,
  label,
  required = false,
  autoComplete,
  icon,
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const isPasswordType = type === 'password';
  const effectiveType = isPasswordType ? (showPassword ? 'text' : 'password') : type;

  return (
    <div className="neu-input-container">
      {label && <label htmlFor={id} className="neu-label">{label}</label>}
      <div className="neu-input-box neu-input relative flex items-center px-6 py-4">
        {icon && <div className="text-gray-500 mr-3 shrink-0">{icon}</div>}
        <input
          id={id}
          type={effectiveType}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          required={required}
          autoComplete={autoComplete}
          className="w-full text-base text-[#444] bg-transparent border-none outline-none placeholder-gray-400 font-medium"
        />
        {isPasswordType && (
          <button
            type="button"
            id={`${id}-toggle-visibility`}
            onClick={() => setShowPassword(!showPassword)}
            className="text-gray-400 hover:text-gray-600 focus:outline-none ml-2 transition-colors p-1"
            aria-label={showPassword ? 'Hide password' : 'Show password'}
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        )}
      </div>
    </div>
  );
};

