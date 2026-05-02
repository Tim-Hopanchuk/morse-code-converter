export interface MorseConfig {
  dot: string;
  dash: string;
  charDelim: string;
  wordDelim: string;
  ignoreUnknown: boolean;
}

export interface TestCase {
  name: string;
  text: string;
  config: MorseConfig | undefined;
  expectedMorse: string;
}
