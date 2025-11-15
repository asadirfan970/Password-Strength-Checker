
import React from 'react';
import { StrengthLevel } from '../types';

interface PasswordStrengthMeterProps {
  level: StrengthLevel;
}

const strengthConfig = {
  [StrengthLevel.EMPTY]: { text: '', color: 'bg-gray-500', bars: 0 },
  [StrengthLevel.VERY_WEAK]: { text: 'Very Weak', color: 'bg-red-500', bars: 1 },
  [StrengthLevel.WEAK]: { text: 'Weak', color: 'bg-yellow-500', bars: 2 },
  [StrengthLevel.MEDIUM]: { text: 'Medium', color: 'bg-blue-500', bars: 3 },
  [StrengthLevel.STRONG]: { text: 'Strong', color: 'bg-green-500', bars: 4 },
  [StrengthLevel.VERY_STRONG]: { text: 'Very Strong', color: 'bg-emerald-600', bars: 5 },
};

const PasswordStrengthMeter: React.FC<PasswordStrengthMeterProps> = ({ level }) => {
  const { text, color, bars } = strengthConfig[level] || strengthConfig[StrengthLevel.EMPTY];

  return (
    <div className="w-full mt-4">
      <div className="flex justify-between items-center mb-1">
        <p className="text-sm font-medium text-white/80 transition-opacity duration-300">
          {text}
        </p>
      </div>
      <div className="flex gap-2 h-2">
        {Array.from({ length: 5 }).map((_, index) => (
          <div
            key={index}
            className={`flex-1 rounded-full transition-colors duration-300 ${
              index < bars ? color : 'bg-white/20'
            }`}
          ></div>
        ))}
      </div>
    </div>
  );
};

export default PasswordStrengthMeter;
