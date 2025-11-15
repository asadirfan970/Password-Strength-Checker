import { StrengthLevel, PasswordStrengthResult, CrackingTimeScenarios } from '../types';

const GUESSES = {
  ONLINE_THROTTLED: 100n, // 100 guesses per second (e.g., against a website login)
  DESKTOP_GPU: 100_000_000_000n, // 100 billion guesses per second (consumer-grade hardware)
  MASSIVE_NETWORK: 10_000_000_000_000n, // 10 trillion guesses per second (botnet, large cluster)
};


const timeUnits: { unit: string; seconds: bigint }[] = [
  { unit: 'year', seconds: 31536000n },
  { unit: 'month', seconds: 2592000n },
  { unit: 'week', seconds: 604800n },
  { unit: 'day', seconds: 86400n },
  { unit: 'hour', seconds: 3600n },
  { unit: 'minute', seconds: 60n },
  { unit: 'second', seconds: 1n },
];

function formatTime(totalSeconds: bigint): string {
  if (totalSeconds < 1n) {
    return 'Instantly';
  }

  for (const { unit, seconds } of timeUnits) {
    if (totalSeconds >= seconds) {
      const count = totalSeconds / seconds;
      if (count > 1000000000000n) return `Trillions of years`;
      if (count > 1000000000n) return `${(count / 1000000000n).toLocaleString()} billion years`;
      if (count > 1000000n) return `${(count / 1000000n).toLocaleString()} million years`;
      if (count > 1000n && unit === 'year') return `${(count / 1000n).toLocaleString()} thousand years`;

      return `${count.toLocaleString()} ${unit}${count > 1 ? 's' : ''}`;
    }
  }
  return 'Instantly';
}


export const calculatePasswordStrength = (password: string): PasswordStrengthResult => {
  if (!password) {
    return {
      timeToCrack: '',
      level: StrengthLevel.EMPTY,
      scenarios: null,
    };
  }

  let characterPool = 0;
  if (/[a-z]/.test(password)) characterPool += 26;
  if (/[A-Z]/.test(password)) characterPool += 26;
  if (/[0-9]/.test(password)) characterPool += 10;
  if (/[^a-zA-Z0-9]/.test(password)) characterPool += 32;

  const combinations = BigInt(characterPool) ** BigInt(password.length);
  
  // Calculate seconds for each scenario (average case is combinations / (guesses * 2))
  const secondsToCrackDesktop = combinations / (GUESSES.DESKTOP_GPU * 2n);
  const secondsToCrackOnline = combinations / (GUESSES.ONLINE_THROTTLED * 2n);
  const secondsToCrackNetwork = combinations / (GUESSES.MASSIVE_NETWORK * 2n);
  
  const scenarios: CrackingTimeScenarios = {
    onlineThrottled: formatTime(secondsToCrackOnline),
    desktopGpu: formatTime(secondsToCrackDesktop),
    massiveNetwork: formatTime(secondsToCrackNetwork),
  };

  // The main timeToCrack and level are based on the standard desktop GPU scenario
  const timeToCrack = scenarios.desktopGpu;

  let level: StrengthLevel;
  if (secondsToCrackDesktop < timeUnits.find(u => u.unit === 'hour')!.seconds) {
    level = StrengthLevel.VERY_WEAK;
  } else if (secondsToCrackDesktop < timeUnits.find(u => u.unit === 'day')!.seconds) {
    level = StrengthLevel.WEAK;
  } else if (secondsToCrackDesktop < timeUnits.find(u => u.unit === 'year')!.seconds) {
    level = StrengthLevel.MEDIUM;
  } else if (secondsToCrackDesktop < timeUnits.find(u => u.unit === 'year')!.seconds * 100n) {
    level = StrengthLevel.STRONG;
  } else {
    level = StrengthLevel.VERY_STRONG;
  }

  return { timeToCrack, level, scenarios };
};
