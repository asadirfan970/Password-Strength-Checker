export enum StrengthLevel {
  EMPTY = -1,
  VERY_WEAK = 0,
  WEAK = 1,
  MEDIUM = 2,
  STRONG = 3,
  VERY_STRONG = 4,
}

export interface CrackingTimeScenarios {
  onlineThrottled: string;
  desktopGpu: string;
  massiveNetwork: string;
}

export interface PasswordStrengthResult {
  timeToCrack: string; // Main display time, based on desktopGpu
  level: StrengthLevel;
  scenarios: CrackingTimeScenarios | null;
}
