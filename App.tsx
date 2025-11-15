import React, { useState, useMemo } from 'react';
import PasswordStrengthMeter from './components/PasswordStrengthMeter';
import { calculatePasswordStrength } from './services/passwordService';
import { StrengthLevel, PasswordStrengthResult } from './types';

const App: React.FC = () => {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const strength: PasswordStrengthResult = useMemo(() => calculatePasswordStrength(password), [password]);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const getResultTextColor = () => {
    switch (strength.level) {
      case StrengthLevel.VERY_WEAK: return 'text-red-400';
      case StrengthLevel.WEAK: return 'text-yellow-400';
      case StrengthLevel.MEDIUM: return 'text-blue-400';
      case StrengthLevel.STRONG: return 'text-green-400';
      case StrengthLevel.VERY_STRONG: return 'text-emerald-400';
      default: return 'text-white/50';
    }
  };

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center overflow-hidden bg-gray-900 font-sans p-4">
      {/* Background Shapes */}
      <div className="absolute top-0 -left-1/4 w-96 h-96 bg-purple-600/50 rounded-full filter blur-3xl opacity-50 animate-blob"></div>
      <div className="absolute top-0 -right-1/4 w-96 h-96 bg-indigo-600/50 rounded-full filter blur-3xl opacity-50 animate-blob animation-delay-2000"></div>
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-pink-600/50 rounded-full filter blur-3xl opacity-50 animate-blob animation-delay-4000"></div>

      <style>{`
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 { animation-delay: 2s; }
        .animation-delay-4000 { animation-delay: 4s; }
      `}</style>
      
      <main className="w-full max-w-md mx-auto z-10">
        <div className="bg-white/10 backdrop-filter backdrop-blur-xl rounded-2xl shadow-2xl p-6 md:p-8 border border-white/20">
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-white tracking-tight">Password Fortress</h1>
            <p className="text-white/60 mt-2">See how long it would take to crack your password.</p>
          </div>

          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              className="w-full p-4 pr-12 text-lg text-white bg-white/10 rounded-lg border-2 border-transparent focus:border-purple-400 focus:outline-none focus:ring-0 transition-all duration-300 placeholder-white/40"
              autoComplete="off"
            />
            <button
              onClick={togglePasswordVisibility}
              className="absolute inset-y-0 right-0 flex items-center px-4 text-white/60 hover:text-white/90 transition-colors"
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a9.97 9.97 0 01-1.563 3.029m0 0l-2.117-2.117" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.522 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              )}
            </button>
          </div>

          <PasswordStrengthMeter level={strength.level} />

          <div className="mt-6 text-center h-10 flex items-center justify-center">
              <p className={`text-lg font-semibold transition-all duration-300 ${getResultTextColor()}`}>
                {strength.level !== StrengthLevel.EMPTY ? `Time to crack: ${strength.timeToCrack}` : 'Start typing to see the result...'}
              </p>
          </div>

          {strength.scenarios && (
            <div className="mt-6 pt-6 border-t border-white/20">
              <h3 className="text-center text-sm font-semibold text-white/80 uppercase tracking-wider mb-4">Cracking Time Scenarios</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                {/* Online Attack */}
                <div className="p-2">
                  <p className="font-bold text-lg text-purple-300">{strength.scenarios.onlineThrottled}</p>
                  <p className="text-xs text-white/60 mt-1 font-medium">Online Attack</p>
                  <p className="text-xs text-white/40">100 guesses/sec</p>
                </div>
                {/* Desktop GPU (highlighted) */}
                <div className="bg-white/10 rounded-lg p-2 border border-white/10 ring-1 ring-purple-400/50">
                  <p className="font-bold text-lg text-blue-300">{strength.scenarios.desktopGpu}</p>
                  <p className="text-xs text-white/60 mt-1 font-medium">Desktop GPU</p>
                  <p className="text-xs text-white/40">100B guesses/sec</p>
                </div>
                {/* Massive Network */}
                <div className="p-2">
                  <p className="font-bold text-lg text-red-300">{strength.scenarios.massiveNetwork}</p>
                  <p className="text-xs text-white/60 mt-1 font-medium">Massive Network</p>
                  <p className="text-xs text-white/40">10T guesses/sec</p>
                </div>
              </div>
            </div>
          )}

        </div>
        <footer className="text-center mt-6">
            <p className="text-sm text-white/40">Estimates are based on a brute-force attack from a powerful consumer desktop.</p>
        </footer>
      </main>
    </div>
  );
};

export default App;
